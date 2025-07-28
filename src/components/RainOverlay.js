import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { fetchRainData } from "../api/weather";
import { getRainColor } from "../utils/colorScale";
import DebugLogger from "../utils/DebugLogger";

function RainOverlay() {
  const map = useMap();
  const [rainData, setRainData] = useState([]);
  const [lastFetch, setLastFetch] = useState(0);

  // Helper: fetch rain for visible bounds, throttle to 10 min
  useEffect(() => {
    let timeout;
    const fetchRain = async () => {
      if (Date.now() - lastFetch < 10 * 60 * 1000) return; // 10 min throttle
      const bounds = map.getBounds();
      const center = map.getCenter();
      try {
        const rain = await fetchRainData({ lat: center.lat, lon: center.lng });
        setRainData([{ ...rain, ...center }]);
        setLastFetch(Date.now());
        DebugLogger.log("RainOverlay", "Fetched rain overlay data", { center, rain });
      } catch (e) {
        DebugLogger.error("RainOverlay", "Rain overlay fetch failed", e);
      }
    };
    // Debounce: only fetch after user stops moving map
    const onMoveEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(fetchRain, 1000);
    };
    map.on("moveend", onMoveEnd);
    // Initial fetch
    fetchRain();
    return () => map.off("moveend", onMoveEnd);
    // eslint-disable-next-line
  }, [map]);

  // Render: for MVP, simple circle/overlay at center, upgrade to grid for prod
  return (
    <>
      {rainData.map((rain, idx) =>
        rain.intensity !== "none" ? (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              width: 80,
              height: 80,
              background: getRainColor(rain.intensity),
              opacity: 0.4,
              borderRadius: "50%",
              zIndex: 500,
              pointerEvents: "none",
              animation: rain.intensity !== "light" ? "rainAnim 2s infinite linear" : "none",
            }}
          >
            {rain.intensity === "heavy" && (
              <span style={{ color: "#fff", fontSize: 32, marginLeft: 20, animation: "raindrop 0.9s infinite" }}>
                &#x1F327;
              </span>
            )}
            {rain.intensity === "moderate" && (
              <span style={{ color: "#fff", fontSize: 28, marginLeft: 20, animation: "raindrop 1.3s infinite" }}>
                &#x1F326;
              </span>
            )}
            {rain.intensity === "light" && (
              <span style={{ color: "#fff", fontSize: 24, marginLeft: 20, animation: "raindrop 2.1s infinite" }}>
                &#x1F325;
              </span>
            )}
          </div>
        ) : null
      )}
      <style>{`
        @keyframes rainAnim {
          0% { opacity: 0.5; }
          50% { opacity: 0.6; }
          100% { opacity: 0.5; }
        }
        @keyframes raindrop {
          0% { transform: translateY(0); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default RainOverlay;
