# Real-Time Rain Map – Localhost MVP

## Overview

A React-based web app for global, real-time (10–15 min update) city-level rain info. Targeted at travelers (scooter, cycle, walk, drive) for quick, informed decisions—should you wait or go?  
- **Interactive map:** Google Maps-style (Leaflet + OpenStreetMap)
- **Rain overlays:** Color-coded heatmap + animated raindrops (browser-performant)
- **Rain pop-up card:** Click anywhere to see status, duration, temp, always-filled
- **Route rain info:** Enter destination, see rain along route (with fallback/backup logic)
- **Autosuggest:** Location search bar with typeahead suggestions
- **Legend:** Always visible for rain intensity
- **Debugging:** Comprehensive logs in browser console (timestamp, function, case, error details)
- **API-efficient:** Throttled updates, debounce on pan/zoom, smart fallback for missing data
- **Mock Data Mode:** Toggleable for offline/local testing

## Setup

1. Clone repo
2. Copy `.env.example` to `.env` and fill in your API keys
3. `npm install`
4. `npm start`
5. Open [http://localhost:3000](http://localhost:3000)

## API keys & config

Fill in your keys in `.env` (see `.env.example`):

- `REACT_APP_TOMORROW_API_KEY`
- `REACT_APP_LOCATIONIQ_API_KEY`
- `REACT_APP_OPENWEATHER_API_KEY`
- `REACT_APP_OPENROUTESERVICE_API_KEY`
- `REACT_APP_XWEATHER_API_KEY`
- (You can add more or switch providers easily)

## Folder Structure

```
/public
  index.html
/src
  /api          # API wrappers (weather, routing, IP, etc)
  /components   # React UI components (Map, RainOverlay, SearchBar, Popup, Legend, etc)
  /hooks        # Custom React hooks (debounced fetch, geolocation, etc)
  /utils        # Helpers (logging, throttling, color scales, etc)
  /mock         # Mock data + toggle logic
  App.js
  index.js
.env.example
README.md
```

## Logging & Debugging

- Every function, edge case, and error is logged:
  ```
  [2025-07-28 12:42 IST] getRainInfo case2 failed: API 404 for X,Y
  [timestamp] [function] [case/error] [API code/input/context]
  ```
- No logs are ever hidden or toggled off; all go to browser console.

## Notes

- **No navigation/route avoidance**—focus is rain awareness only.
- **All units**: km, minutes, Celsius.
- **Tested on:** Chrome, Edge, Firefox (desktop).
- **Private codebase.**

## API Recommendations Section

See bottom of this file for a detailed comparison of free, free+paid, and paid APIs for weather and routing.

---

## API Recommendations & Comparison

### Free APIs

| API                | Granularity         | Update Freq | Global | Route Support | Free Limits           | Credit Card? | Pros/Cons                                  |
|--------------------|--------------------|-------------|--------|--------------|-----------------------|--------------|---------------------------------------------|
| Tomorrow.io        | City/Regional      | 15 min      | Yes    | No           | 500-1000 calls/day    | No           | Good docs, global, some missing cities      |
| OpenWeather        | City/Regional      | 10 min      | Yes    | No           | 60/min, 1000/day      | No           | Popular, some delays, rate limits           |
| XWeather (Aeromet) | City/Regional      | 15 min      | Yes    | No           | 50/min, 2500/day      | No           | Fast, decent coverage                       |
| LocationIQ         | City/Address       | N/A         | Yes    | Yes          | 15k/mo                | No           | Great for geocoding/autosuggest             |
| OpenRouteService   | N/A                | N/A         | Yes    | Yes          | 2k/day, 40k/mo        | No           | Good for routes, can be slow at peak        |
| ip-api.com         | City/Region        | N/A         | Yes    | N/A          | 45/min                | No           | Simple, no signup, not super precise        |

### Free+Paid Combo

- **Add paid Tomorrow.io or paid OpenWeather** for:
  - Finer granularity (neighborhood/block)
  - More frequent updates (1–5 min)
  - Higher call limits, SLAs, reliability
- **Paid Google Maps API**: Super accurate routes, live traffic, block-level rain (if paired with paid weather)

### Paid Only

- **Climacell/Tomorrow.io Enterprise:** Best for hyper-local, real-time rain (credit card required)
- **Google Maps + Weather Add-ons:** Block-level, global, but $$$

#### Trade-offs

- Free: Sufficient for MVP, some delays, regional fallback needed, lower quota
- Free+Paid: Best for scaling, higher accuracy, less fallback needed, more quota
- Paid: Best possible, but not needed for localhost/testing

---

Questions or want to swap an API? Just ask!