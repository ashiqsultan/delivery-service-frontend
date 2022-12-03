import React, { useRef, useMemo, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import isEqual from 'lodash/isEqual';

type PropTypes = {
  markerIcon: L.Icon;
  isDraggable: boolean;
  position: LatLng;
  setPosition?: Function;
  markerName: string;
  popupMsg?: string;
};
function DraggableMarker(props: PropTypes) {
  const markerRef = useRef(null);

  useEffect(() => {
    console.log('DraggableMarker Rerendered', props.markerName);
    const marker = markerRef.current;
    if (marker != null) marker.openPopup();
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
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
    >
      {props.popupMsg && <Popup>{props.popupMsg}</Popup>}
    </Marker>
  );
}
export default React.memo(DraggableMarker, (prev, next) => {
  return (
    isEqual(prev.position, next.position) ||
    prev.isDraggable === next.isDraggable
  );
});
