import axios from "axios";

const api = axios.create({
  baseURL: window.APP_DATA.baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function getMenuSettings() {
  return api.get("/api/clinic/menu-settings");
}

export function saveMenuSettings(disabled) {
  return api.post("/api/clinic/menu-settings", { disabled });
}
