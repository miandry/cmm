import { getLists, saveItem } from './api'

export function getArticles(params) {
  return getLists('node', 'article', params)
}

export function saveArticle(params) {
  return saveItem(params);
}

export function getCategories(params) {
  return getLists('taxonomy_term', 'categorie', params)
}

export function getPacks(params) {
  return getLists('taxonomy_term', 'pack', params)
}