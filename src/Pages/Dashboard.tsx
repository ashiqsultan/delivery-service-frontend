import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import { Point } from 'geojson';
import { MapContainer, TileLayer } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import Button from '@mui/material/Button';

import UserInfo from '../components/UserInfo';
import DraggableMarker from '../components/DraggableMarker';
import ShipmentInfo from '../components/ShipmentInfo';
import { DashboardStatus, State, IAction } from '../types';
import {
  pickupMarkerIcon,
  dropMarkerIcon,
  driverMarkerIcon,
  API_URL,
  socketEvents,
  infoMsgs,
  mapInitialViewProps,
  ACTIONS,
} from '../constants';
import './dashboard.css';
import { createShipment } from '../api';

const socket = io(API_URL);

const initialState: State = {
  pickupLocation: new LatLng(13.102971824499635, 80.27971744537354),
  isPickupDraggable: false,
  isShowPickupMarker: false,
  dropLocation: new LatLng(13.092123232608643, 80.28222309087568),
  isDropDraggable: false,
  isShowDropMarker: false,
  driverLocation: null,
  info: infoMsgs[DashboardStatus.NO_SHIPMENT],
  dashboardStatus: DashboardStatus.NO_SHIPMENT,
};

function reducer(state: State, action: IAction): State {
  switch (action.type) {
    case ACTIONS.NEW_DELIVERY_CLICKED:
      return {
        ...state,
        isPickupDraggable: true,
        isShowPickupMarker: true,
        dashboardStatus: DashboardStatus.SHIPMENT_INITIATED,
        info: infoMsgs[DashboardStatus.SHIPMENT_INITIATED],
      };
    case ACTIONS.SET_DRIVER_LOCATION:
      return {
        ...state,
        driverLocation: action.payload.position, // position should be Leaflet LatLng
      };
    case ACTIONS.SET_PICKUP_LOCATION:
      return {
        ...state,
        pickupLocation: action.payload.position, // position should be Leaflet LatLng
      };
    case ACTIONS.SET_DROP_LOCATION:
      return {
        ...state,
        dropLocation: action.payload.position, // position should be Leaflet LatLng
      };
    case ACTIONS.PICKUP_SELECTED:
      return {
        ...state,
        isPickupDraggable: false,
        isDropDraggable: true,
        isShowDropMarker: true,
        dashboardStatus: DashboardStatus.PICKUP_SELECTED,
        info: infoMsgs[DashboardStatus.PICKUP_SELECTED],
      };
    case ACTIONS.DROP_SELECTED:
      return {
        ...state,
        isDropDraggable: false,
        dashboardStatus: DashboardStatus.DROP_SELECTED,
        info: infoMsgs[DashboardStatus.DROP_SELECTED],
      };
    default:
      console.log('default action');
      return state;
  }
}
const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Establish Socket
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(socketEvents.DA_LOCATION_CHANGED, (data) => {
      try {
        const coorArr = data?.currentLocation?.coordinates;
        const isNumberType = (value: any) => typeof value === 'number';
        if (
          Array.isArray(coorArr) &&
          coorArr.length === 2 &&
          isNumberType(coorArr[0]) &&
          isNumberType(coorArr[1])
        ) {
          const lat = coorArr[1];
          const lng = coorArr[0];
          const newLocation = new LatLng(lat, lng);
          const action = {
            type: ACTIONS.SET_DRIVER_LOCATION,
            payload: { position: newLocation },
          };
          dispatch(action);
        }
      } catch (error) {
        console.error(error);
      }
    });

    // Listens to Shipment updates once subscribed
    socket.on(socketEvents.SHIPMENT_UPDATED, (data) => {
      try {
        console.log({ data });
      } catch (error) {
        console.error(error);
      }
    });

    socket.emit(socketEvents.SUBSCRIBE_TO_DA, {
      deliveryAssociateId: '637fb7777b67e07ca8702543',
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const setPickupLocation = (position: LatLng) => {
    const action = {
      type: ACTIONS.SET_PICKUP_LOCATION,
      payload: { position },
    };
    dispatch(action);
  };
  const setDropLocation = (position: LatLng) => {
    const action = {
      type: ACTIONS.SET_DROP_LOCATION,
      payload: { position },
    };
    dispatch(action);
  };
  const onNewDeliveryClick = () => {
    const action = {
      type: ACTIONS.NEW_DELIVERY_CLICKED,
      payload: {},
    };
    dispatch(action);
  };
  const onPickupSelected = () => {
    const action = { type: ACTIONS.PICKUP_SELECTED, payload: {} };
    dispatch(action);
  };
  const onDropSelected = async () => {
    try {
      const action = { type: ACTIONS.DROP_SELECTED, payload: {} };
      await dispatch(action);
      const pickupPoint: Point = {
        type: 'Point',
        coordinates: [state.pickupLocation.lng, state.pickupLocation.lat],
      };
      const dropPoint: Point = {
        type: 'Point',
        coordinates: [state.dropLocation.lng, state.dropLocation.lat],
      };
      // Call API to Create new Shipment
      const createShipmentOp = await createShipment(pickupPoint, dropPoint);
      const shipment = createShipmentOp.data;
      // Subscribe to MongoDB Change Stream via Socket io for the created Shipment
      socket.emit(socketEvents.SUBSCRIBE_TO_SHIPMENT, {
        shipmentId: shipment._id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ButtonNewDelivery = () => {
    return (
      <Button
        variant='contained'
        onClick={() => {
          onNewDeliveryClick();
        }}
      >
        New Delivery
      </Button>
    );
  };
  const ButtonConfirmPickUp = () => {
    return (
      <Button
        variant='contained'
        onClick={() => {
          onPickupSelected();
        }}
      >
        Confirm Pickup Location
      </Button>
    );
  };
  const ButtonConfirmDrop = () => {
    return (
      <Button
        variant='contained'
        onClick={() => {
          onDropSelected();
        }}
      >
        Confirm Delivery Location
      </Button>
    );
  };

  return (
    <div className='container'>
      <div className='col-1'>
        <UserInfo />
        {/* Shipment info */}
        <div>
          <ShipmentInfo title={state.info.title} message={state.info.msg} />
        </div>
        {/* New Delivery button */}
        <div className='center-button'>
          {state.dashboardStatus === DashboardStatus.NO_SHIPMENT && (
            <ButtonNewDelivery />
          )}
          {state.dashboardStatus === DashboardStatus.SHIPMENT_INITIATED && (
            <ButtonConfirmPickUp />
          )}
          {state.dashboardStatus === DashboardStatus.PICKUP_SELECTED && (
            <ButtonConfirmDrop />
          )}
        </div>
      </div>
      <div className='col-2'>
        <MapContainer
          style={{ width: '100%', height: '99vh' }}
          {...mapInitialViewProps}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Pickup Marker */}
          {state.isShowPickupMarker ? (
            <DraggableMarker
              isDraggable={state.isPickupDraggable}
              position={state.pickupLocation}
              setPosition={setPickupLocation}
              markerIcon={pickupMarkerIcon}
              key={'pickup-marker'}
              markerName={'pickup-marker'}
              popupMsg='Mark your pickup location'
            />
          ) : null}
          {/* Drop Location Marker */}
          {state.isShowDropMarker ? (
            <DraggableMarker
              isDraggable={state.isDropDraggable}
              position={state.dropLocation}
              setPosition={setDropLocation}
              markerIcon={dropMarkerIcon}
              key={'drop-marker'}
              markerName={'drop-marker'}
              popupMsg='Mark your delivery location'
            />
          ) : null}
          {/* Driver Location Marker */}
          {state.driverLocation && (
            <DraggableMarker
              isDraggable={false}
              position={state.driverLocation}
              markerIcon={driverMarkerIcon}
              key={'Driver-marker'}
              markerName={'Driver-marker'}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};
export default Dashboard;
