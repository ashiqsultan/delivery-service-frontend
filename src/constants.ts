import L from 'leaflet';

export const API_URL = 'http://localhost:5000';

import iconPickup from './assets/icon_pickup.svg';
import iconDrop from './assets/icon_drop.svg';
import iconDriver from './assets/icon_delivery_associate.svg';
import { IInfo, DashboardStatus } from './types';

export const pickupMarkerIcon = L.icon({
  iconUrl: iconPickup,
  iconSize: [50, 50], // size of the icon
  popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
  className: 'marker',
});

export const dropMarkerIcon = L.icon({
  iconUrl: iconDrop,
  iconSize: [50, 50], // size of the icon
  popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
  className: 'marker',
});

export const driverMarkerIcon = L.icon({
  iconUrl: iconDriver,
  iconSize: [50, 50], // size of the icon
  popupAnchor: [-3, -20], // point from which the popup should open relative to the iconAnchor
  className: 'marker',
});

export const socketEvents = {
  SUBSCRIBE_TO_SHIPMENT: 'SUBSCRIBE_TO_SHIPMENT',
  SUBSCRIBE_TO_DA: 'SUBSCRIBE_TO_DA',
  DA_LOCATION_CHANGED: 'DA_LOCATION_CHANGED',
  LEAVE_ROOM: 'LEAVE_ROOM',
};

export const infoMsgs: Record<DashboardStatus, IInfo> = {
  SHIPMENT_INITIATED: {
    title: 'Select Pickup Location',
    msg: 'Move the Pickup marker on the map to choose your pickup location. Click confirm to continue.',
  },
  PICKUP_SELECTED: {
    title: 'Select Delivery Location',
    msg: 'Move the Flag marker on the map to choose your Delivery location. Click confirm to continue.',
  },
  DROP_SELECTED: {
    title: 'Searching for delivery Associates',
    msg: 'Please wait, we are looking for associates to handle your delivery',
  },
  NO_SHIPMENT: { title: '', msg: '' },
  SEARCHING_ASSOCIATES: { title: '', msg: '' },
  ASSOCIATE_ASSIGNED: {
    title: 'Delivery Associate Assigned',
    msg: 'An Associate has been assigned to handle your delivery and will soon reach your pickup location',
  },
};

export const ACTIONS = {
  FIRST_LOAD: 'FIRST_LOAD',
  NEW_DELIVERY_CLICKED: 'NEW_DELIVERY_CLICKED',
  SET_DRIVER_LOCATION: 'SET_DRIVER_LOCATION',
  SET_PICKUP_LOCATION: 'SET_PICKUP_LOCATION',
  SET_DROP_LOCATION: 'SET_DROP_LOCATION',
  PICKUP_SELECTED: 'PICKUP_SELECTED',
  DROP_SELECTED: 'DROP_SELECTED',
};

export const mapInitialViewProps: {
  zoom: number;
  center: [number, number];
  scrollWheelZoom: boolean;
} = {
  zoom: 15,
  center: [13.092123232608643, 80.28222309087568],
  scrollWheelZoom: true,
};
