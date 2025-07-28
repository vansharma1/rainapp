export default function mockWeather(lat, lon) {
  // Simple mock: randomize rain
  const rain = Math.random() < 0.4 ? Math.random() * 10 : 0;
  return {
    source: "mock",
    intensity: rain === 0 ? "none" : rain < 2 ? "light" : rain < 7 ? "moderate" : "heavy",
    rain,
    temp: 25 + Math.random() * 7,
    lastUpdated: Date.now(),
    city: "Mockville",
    region: "Mockland"
  };
}
