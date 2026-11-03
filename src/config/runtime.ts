export const runtimeConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  apiMode: import.meta.env.VITE_API_MODE ?? "mock",
  requestTimeoutMs: 15000,
};
