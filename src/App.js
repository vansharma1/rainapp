import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import LocationSearch from "./components/LocationSearch";
import Legend from "./components/Legend";
import DebugLogger from "./components/DebugLogger";
import { getIPLocation } from "./api/ip";
import { useMockMode } from "./mock/useMockMode";
import "./App.css";

function App() {
  // State for center, rain data, mock data mode, etc.
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const [userLocated, setUserLocated] = useState(false);
  const { mockMode } = useMockMode();

  useEffect(() => {
    // On mount, detect IP location if not in mock mode
    if (!mockMode) {
      getIPLocation()
        .then((loc) => {
          setCenter({ lat: loc.lat, lng: loc.lon });
          DebugLogger.log("App", "IP location found", { ...loc });
        })
        .catch((err) => {
          DebugLogger.error("App", "Failed to get IP location, using default", err);
        });
    }
  }, [mockMode]);

  return (
    <div className="app-container">
      <LocationSearch setCenter={setCenter} />
      <Legend />
      <MapView center={center} setUserLocated={setUserLocated} />
      <DebugLogger.Render />
    </div>
  );
}

export default App;