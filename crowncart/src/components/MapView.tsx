"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface MapViewProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

// Controller to handle map centering only when the center prop actually changes
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center as LatLngExpression, map.getZoom());
  }, [center, map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ position, setPosition }) => {
  return (
    <MapContainer
      className="w-full h-full"
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={position} />
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const newPos = marker.getLatLng();
            setPosition([newPos.lat, newPos.lng]);
          },
        }}
      />
    </MapContainer>
  );
};

export default MapView;