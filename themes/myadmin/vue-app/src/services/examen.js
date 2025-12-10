import { getLists, saveItem } from "./api";

export function getExamens(params) {
  return getLists("node", "examen", params);
}

export function saveExamen(params) {
  return saveItem(params);
}
