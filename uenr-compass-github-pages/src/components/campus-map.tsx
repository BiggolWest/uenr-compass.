"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";

export type CampusPlace = {
  name: string; type: string; area: string; time: string; distance: string;
  icon: "class" | "library" | "food" | "health" | "office"; lat: number; lon: number;
};
export type Coordinates = { lat: number; lon: number; accuracy?: number };
const campusCenter: [number, number] = [7.3491, -2.34225];
const pinIcon = new L.DivIcon({ className: "uenr-map-pin-wrap", html: '<span class="uenr-map-pin"><span></span></span>', iconSize: [28, 36], iconAnchor: [14, 34] });
const meIcon = new L.DivIcon({ className: "uenr-map-me-wrap", html: '<span class="uenr-map-me"></span>', iconSize: [26, 26], iconAnchor: [13, 13] });

function Recenter({ place }: { place: CampusPlace }) {
  const map = useMap();
  useEffect(() => { map.flyTo([place.lat, place.lon], Math.max(map.getZoom(), 17), { duration: 0.5 }); }, [map, place.lat, place.lon]);
  return null;
}
function MapClick({ enabled, onAdd }: { enabled: boolean; onAdd: (point: Coordinates) => void }) {
  useMapEvents({ click(event) { if (enabled) onAdd({ lat: event.latlng.lat, lon: event.latlng.lng }); } });
  return null;
}

export default function CampusMap({ places, selected, position, adding, dark, onSelect, onAdd }: {
  places: CampusPlace[]; selected: CampusPlace; position: Coordinates | null; adding: boolean;
  dark: boolean;
  onSelect: (place: CampusPlace) => void; onAdd: (point: Coordinates) => void;
}) {
  const campusBounds = useMemo(() => L.latLngBounds([7.343, -2.349], [7.355, -2.334]), []);
  return <div className={`live-map ${adding ? "map-adding" : ""}`}>
    <MapContainer center={campusCenter} zoom={17} minZoom={15} maxZoom={20} maxBounds={campusBounds} maxBoundsViscosity={0.65} scrollWheelZoom className="leaflet-map" aria-label="OpenStreetMap map of UENR Sunyani campus">
      <TileLayer attribution={dark ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'} url={dark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
      <Recenter place={selected}/><MapClick enabled={adding} onAdd={onAdd}/>
      {places.map((place) => <Marker key={`${place.name}-${place.lat}`} position={[place.lat, place.lon]} icon={pinIcon} eventHandlers={{ click: () => onSelect(place) }}><Tooltip direction="top" offset={[0, -26]}>{place.name}</Tooltip></Marker>)}
      {position && <><CircleMarker center={[position.lat, position.lon]} radius={Math.min(15, Math.max(7, (position.accuracy ?? 20) / 3))} pathOptions={{ color: "#168acb", fillColor: "#168acb", fillOpacity: 0.13, weight: 1 }} /><Marker position={[position.lat, position.lon]} icon={meIcon} zIndexOffset={1000}><Tooltip>You are here · ±{Math.round(position.accuracy ?? 0)} m</Tooltip></Marker></>}
    </MapContainer>
    {adding && <div className="map-tip"><span className="pin-tip-dot"/> Tap the map to add a campus place</div>}
    <div className="map-credit">Map data © OpenStreetMap contributors</div>
  </div>;
}
