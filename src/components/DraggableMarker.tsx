import React, { useRef, useMemo, useEffect } from 'react';
import { Marker } from 'react-leaflet';
import { LatLng } from 'leaflet';
import isEqual from 'lodash/isEqual';

type PropTypes = {
  markerIcon: L.Icon;
  isDraggable: boolean;
  position: LatLng;
  setPosition: Function;
  markerName: string;
};
function DraggableMarker(props: PropTypes) {
  useEffect(() => {
    console.log('DraggableMarker Rerendered', props.markerName);
  });
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          console.log(marker.getLatLng());
          props.setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  return (
    <Marker
      draggable={props.isDraggable}
      eventHandlers={eventHandlers}
      position={props.position}
      ref={markerRef}
      icon={props.markerIcon}
    ></Marker>
  );
}
export default React.memo(DraggableMarker, (prev, next) => {
  return isEqual(prev.position, next.position);
});
