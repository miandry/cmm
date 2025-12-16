import { deleteItem, getLists, saveItem } from "./api";

export function getClients(params) {
  return getLists("node", "client", params);
}

export function saveClient(params) {
  return saveItem(params);
}

export function deleteClient(id) {
  return deleteItem("node", id);
}
