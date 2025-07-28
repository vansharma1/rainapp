import axios from "axios";
import DebugLogger from "../utils/DebugLogger";

export async function getIPLocation() {
  try {
    const resp = await axios.get("https://ip-api.com/json/");
    if (resp.status === 200 && resp.data && resp.data.lat && resp.data.lon) {
      return { lat: resp.data.lat, lon: resp.data.lon, city: resp.data.city, region: resp.data.regionName, country: resp.data.country };
    } else {
      DebugLogger.error("getIPLocation", "Invalid IP location response", resp.data);
      throw new Error("Invalid IP API response");
    }
  } catch (e) {
    DebugLogger.error("getIPLocation", "API request failed", e);
    throw e;
  }
}
