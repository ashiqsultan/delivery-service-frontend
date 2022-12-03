import L from 'leaflet';

export const API_URL = 'http://localhost:5000';

import iconPickup from './assets/icon_pickup.svg';
import iconDrop from './assets/icon_drop.svg';
import iconDriver from './assets/icon_delivery_associate.svg';

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
