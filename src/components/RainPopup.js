import React, { useEffect, useState } from "react";
import { fetchRainData } from "../api/weather";
import DebugLogger from "../utils/DebugLogger";

function RainPopup({ position, onClose }) {
  const [rainInfo, setRainInfo] = useState(null);

  useEffect(() => {
    fetchRainData({ lat: position.lat, lon: position.lng })
      .then((data) => {
        setRainInfo(data);
        DebugLogger.log("RainPopup", "Rain data loaded", data);
      })
      .catch((e) => {
        DebugLogger.error("RainPopup", "Failed to load rain data", e);
        setRainInfo({ intensity: "none", rain: 0, temp: null });
      });
  }, [position]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "45%",
        background: "#fff",
        border: "1px solid #007fff",
        borderRadius: 8,
        padding: 16,
        zIndex: 9999,
        minWidth: 200,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        transform: "translate(-50%, -50%)"
      }}
    >
      <div>
        <b>
          {rainInfo?.intensity === "none"
            ? "No rain"
            : rainInfo?.intensity === "light"
            ? "Light rain"
            : rainInfo?.intensity === "moderate"
            ? "Moderate rain"
            : "Heavy rain"}
        </b>
        <br />
        {rainInfo?.temp !== null && (
          <>
            <span>Temperature: {rainInfo.temp}°C</span>
            <br />
          </>
        )}
        <span>
          Source: {rainInfo?.source || "N/A"}
        </span>
      </div>
      <button onClick={onClose} style={{ marginTop: 8, background: "#007fff", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px" }}>
        Close
      </button>
    </div>
  );
}

export default RainPopup;
