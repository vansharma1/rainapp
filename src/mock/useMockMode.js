export function useMockMode() {
  return {
    mockMode: process.env.REACT_APP_USE_MOCK_DATA === "true"
  };
}
