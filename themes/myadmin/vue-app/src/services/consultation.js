import { getLists, saveItem } from "./api";

export function getConsultations(params) {
  return getLists("node", "consultations", params);
}

export function saveConsultation(params) {
  return saveItem(params);
}