import { getLists, saveItem } from './api'

export function getArticles(params) {
  return getLists('node', 'article', params)
}

export function saveArticle(params) {
  return saveItem(params);
}