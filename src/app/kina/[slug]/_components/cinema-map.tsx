"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ICinema } from "@/interfaces/ICinema";

const DEFAULT_ZOOM = 15;

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface CinemaMapProps {
  cinema: ICinema;
}

const CinemaMap: React.FC<CinemaMapProps> = ({ cinema }) => {
  if (!cinema.latitude || !cinema.longitude) {
    return null;
  }

  const position: L.LatLngExpression = [cinema.latitude, cinema.longitude];

  return (
    <div className="relative w-full aspect-video max-h-[500px]">
      <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-blood-red z-10 pointer-events-none" />
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-blood-red z-10 pointer-events-none" />

      <MapContainer
        center={position}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={markerIcon}>
          <Popup>{cinema.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default CinemaMap;
