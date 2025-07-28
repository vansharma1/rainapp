import axios from "axios";
import DebugLogger from "../utils/DebugLogger";
import { useMockMode } from "../hooks/useMockMode";
import mockWeather from "../mock/mockWeather";

const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const TOMORROW_KEY = process.env.REACT_APP_TOMORROW_API_KEY;
const XWEATHER_KEY = process.env.REACT_APP_XWEATHER_API_KEY;

export async function fetchRainData({ lat, lon }) {
  // Mock mode
  if (process.env.REACT_APP_USE_MOCK_DATA === "true") {
    DebugLogger.log("fetchRainData", "Using mock data", { lat, lon });
    return mockWeather(lat, lon);
  }

  // Try OpenWeather first
  try {
    const resp = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`
    );
    if (resp.status === 200 && resp.data) {
      const rain = resp.data.rain ? resp.data.rain["1h"] || resp.data.rain["3h"] : 0;
      return {
        source: "OpenWeather",
        intensity: rain ? (rain < 2 ? "light" : rain < 10 ? "moderate" : "heavy") : "none",
        rain,
        temp: resp.data.main.temp,
        lastUpdated: Date.now(),
        city: resp.data.name,
        region: resp.data.sys.country,
      };
    }
  } catch (e) {
    DebugLogger.error("fetchRainData", "OpenWeather failed", e);
  }

  // Fallback to Tomorrow.io (limited free tier)
  try {
    const resp = await axios.get(
      `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${TOMORROW_KEY}`
    );
    if (resp.status === 200 && resp.data && resp.data.data) {
      const rain = resp.data.data.values.precipitationIntensity;
      return {
        source: "Tomorrow.io",
        intensity: rain ? (rain < 2 ? "light" : rain < 10 ? "moderate" : "heavy") : "none",
        rain,
        temp: resp.data.data.values.temperature,
        lastUpdated: Date.now(),
        city: resp.data.location.name,
        region: resp.data.location.region,
      };
    }
  } catch (e) {
    DebugLogger.error("fetchRainData", "Tomorrow.io failed", e);
  }

  // Fallback to XWeather (if key exists)
  if (XWEATHER_KEY) {
    try {
      const resp = await axios.get(
        `https://api.xweather.com/point?lat=${lat}&lon=${lon}&apikey=${XWEATHER_KEY}`
      );
      if (resp.status === 200 && resp.data) {
        const rain = resp.data.precipitation;
        return {
          source: "XWeather",
          intensity: rain ? (rain < 2 ? "light" : rain < 10 ? "moderate" : "heavy") : "none",
          rain,
          temp: resp.data.temperature,
          lastUpdated: Date.now(),
          city: resp.data.city,
          region: resp.data.region,
        };
      }
    } catch (e) {
      DebugLogger.error("fetchRainData", "XWeather failed", e);
    }
  }

  // If all fails, return default
  DebugLogger.error("fetchRainData", "All weather APIs failed for", { lat, lon });
  return {
    source: "none",
    intensity: "none",
    rain: 0,
    temp: null,
    lastUpdated: Date.now(),
    city: null,
    region: null,
  };
}
