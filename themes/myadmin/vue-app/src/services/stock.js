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

export function getStockRapport(params) {
  return getLists('node', 'stock_rapport', params)
}

export function saveStockRapport(params) {
  return saveItem(params);
}