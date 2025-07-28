import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import RainOverlay from "./RainOverlay";
import RainPopup from "./RainPopup";
import DebugLogger from "../utils/DebugLogger";

const DEFAULT_ZOOM = 12;

function MapView({ center, setUserLocated }) {
  const [popup, setPopup] = useState(null);

  function MapEvents() {
    useMapEvents({
      click(e) {
        setPopup({ latlng: e.latlng });
        DebugLogger.log("MapEvents", "Map clicked", e.latlng);
      }
    });
    return null;
  }

  return (
    <MapContainer center={center} zoom={DEFAULT_ZOOM} style={{ height: "80vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RainOverlay />
      {popup && <RainPopup position={popup.latlng} onClose={() => setPopup(null)} />}
      <MapEvents />
    </MapContainer>
  );
}

export default MapView;