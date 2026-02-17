import { deleteItem, getLists, saveItem } from "./api";

export function getConsultations(params) {
  return getLists("node", "consultations", params);
}

export function saveConsultation(params) {
  return saveItem(params);
}

export function deleteConsultation(id) {
  return deleteItem("node", id);
}

export function deleteOrder(id) {
  return deleteItem("node", id);
}