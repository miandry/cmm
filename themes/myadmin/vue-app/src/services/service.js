import { getDetails, getLists, saveItem } from './api'

export function getServices(params) {
  return getLists('node', 'service', params)
}

export function getService(id, params) {
  return getDetails('node', 'service', id, params)
}

export function saveService(data) {
  return saveItem(data)
}
