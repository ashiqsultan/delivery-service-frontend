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

import UserInfo from '../components/UserInfo';
import DraggableMarker from '../components/DraggableMarker';
import {
  pickupMarkerIcon,
  dropMarkerIcon,
  driverMarkerIcon,
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

const Dashboard = () => {
  const [pickupLocation, setPickupLocation] = useState(staticPickupLocation);
  const [isPickupDraggable, setIsPickupDraggable] = useState(true);

  const [dropLocation, setDropLocation] = useState(staticDropLocation);
  const [isDropDraggable, setIsDropDraggable] = useState(true);

  const [driverLocation, setDriverLocation] = useState(staticDriverLocation);

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
