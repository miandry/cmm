import { getDetails, getLists, saveItem } from "./api";

export function getInvoices(params) {
  return getLists("node", "facture", params);
}

export function getInvoice(id, params) {
  return getDetails("node", "facture", id, params);
}


export function saveInvoice(params) {
  return saveItem(params);
}
