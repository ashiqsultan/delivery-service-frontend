import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

import UserInfo from '../components/UserInfo';
import DraggableMarker from '../components/DraggableMarker';
import {
  pickupMarkerIcon,
  dropMarkerIcon,
  driverMarkerIcon,
  API_URL,
  socketEvents,
} from '../constants';

const initialValues: {
  zoom: number;
  center: [number, number];
  scrollWheelZoom: boolean;
} = {
  zoom: 15,
  center: [13.092123232608643, 80.28222309087568],
  scrollWheelZoom: true,
};
const mapContainerStyle = {
  width: '100%',
  height: '99vh',
};

const staticPickupLocation: LatLng = new LatLng(
  13.102971824499635,
  80.27971744537354
);
const staticDropLocation: LatLng = new LatLng(
  13.092123232608643,
  80.28222309087568
);
const staticDriverLocation: LatLng = new LatLng(
  13.097329677125256,
  80.29340744018556
);

const socket = io(API_URL);

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [pickupLocation, setPickupLocation] = useState(staticPickupLocation);
  const [isPickupDraggable, setIsPickupDraggable] = useState(true);

  const [dropLocation, setDropLocation] = useState(staticDropLocation);
  const [isDropDraggable, setIsDropDraggable] = useState(true);

  const [driverLocation, setDriverLocation] = useState(staticDriverLocation);

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
          setDriverLocation(newLocation);
        }
      } catch (error) {}
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

  return (
    <>
      <div>
        <UserInfo />
      </div>
      <div>
        <MapContainer style={mapContainerStyle} {...initialValues}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Pickup Marker */}
          <DraggableMarker
            isDraggable={isPickupDraggable}
            position={pickupLocation}
            setPosition={setPickupLocation}
            markerIcon={pickupMarkerIcon}
            key={'pickup-marker'}
            markerName={'pickup-marker'}
          />
          {/* Drop Location Marker */}
          <DraggableMarker
            isDraggable={isDropDraggable}
            position={dropLocation}
            setPosition={setDropLocation}
            markerIcon={dropMarkerIcon}
            key={'drop-marker'}
            markerName={'drop-marker'}
          />
          {/* Driver Location Marker */}
          <DraggableMarker
            isDraggable={false}
            position={driverLocation}
            setPosition={setDriverLocation}
            markerIcon={driverMarkerIcon}
            key={'Driver-marker'}
            markerName={'Driver-marker'}
          />
        </MapContainer>
      </div>
    </>
  );
};
export default Dashboard;
