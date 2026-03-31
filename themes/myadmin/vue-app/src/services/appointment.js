import { getDetails, getLists, saveItem } from "./api";

export function getAppointments(params) {
  return getLists("node", "rendez_vous_medical", params);
}

export function getAppointment(id, params) {
  return getDetails("node", "rendez_vous_medical", id, params);
}


export function saveAppointment(params) {
  return saveItem(params);
}
