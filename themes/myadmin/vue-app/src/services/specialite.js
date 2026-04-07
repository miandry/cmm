import { getDetails, getLists, saveItem } from "./api";

export function getSpecialities(params) {
  return getLists("node", "specialite_docteur", params);
}

export function getSpeciality(id, params) {
  return getDetails("node", "specialite_docteur", id, params);
}


export function saveSpeciality(params) {
  return saveItem(params);
}
