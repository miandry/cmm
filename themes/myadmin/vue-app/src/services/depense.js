import { getLists, saveItem } from "./api";

export function getDepenses(params) {
  return getLists("node", "depenses", params);
}

export function saveDepense(params) {
  return saveItem(params);
}

export function getCategoriesDepense(params) {
  return getLists("taxonomy_term", "categories_depense", params);
}
