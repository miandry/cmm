import axios from "axios";

const api = axios.create({
  baseURL: window.APP_DATA.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function getDashboardSettings() {
  return api.get("/api/clinic/dashboard-settings");
}

export function saveDashboardSettings(disabled) {
  return api.post("/api/clinic/dashboard-settings", { disabled });
}
