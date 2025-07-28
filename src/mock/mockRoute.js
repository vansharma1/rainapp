export default function mockRoute(start, end) {
  // Return a geojson LineString between points
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [start.lng, start.lat],
            [end.lng, end.lat]
          ]
        },
        properties: {
          summary: "Mock route"
        }
      }
    ]
  };
}
