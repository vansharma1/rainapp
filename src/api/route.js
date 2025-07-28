import axios from "axios";
import DebugLogger from "../utils/DebugLogger";
import mockRoute from "../mock/mockRoute";

const OPENROUTESERVICE_KEY = process.env.REACT_APP_OPENROUTESERVICE_API_KEY;

export async function fetchRoute({ start, end }) {
  if (process.env.REACT_APP_USE_MOCK_DATA === "true") {
    DebugLogger.log("fetchRoute", "Using mock data", { start, end });
    return mockRoute(start, end);
  }

  // OpenRouteService API
  try {
    const resp = await axios.post(
      `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
      {
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
      },
      {
        headers: {
          Authorization: OPENROUTESERVICE_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.status === 200 && resp.data) {
      return resp.data;
    }
    DebugLogger.error("fetchRoute", "OpenRouteService failed", resp.data);
  } catch (e) {
    DebugLogger.error("fetchRoute", "OpenRouteService API error", e);
  }

  // Fallback: fail
  DebugLogger.error("fetchRoute", "All routing APIs failed", { start, end });
  return null;
}
