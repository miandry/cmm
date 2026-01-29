import { getLists, saveItem } from './api'

export function getStocks(params) {
  return getLists('node', 'stock', params)
}

export function saveStock(params) {
  return saveItem(params);
}

export function getsuppliers(params) {
  return getLists('node', 'fournisseur', params)
}