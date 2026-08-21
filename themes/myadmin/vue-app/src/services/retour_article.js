import { getLists, saveItem } from './api'

export function getRetourArticles(params) {
  return getLists('node', 'retour_article', params)
}

export function saveRetourArticle(params) {
  return saveItem(params);
}
