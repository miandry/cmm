import { getLists, saveItem } from "./api";

export function getQueueTickets(params) {
  return getLists("node", "fil_d_attentes", params);
}

export function saveQueueTicket(data) {
  return saveItem(data);
}
