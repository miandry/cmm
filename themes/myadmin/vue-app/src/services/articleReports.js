import { getLists } from './api'

export function getArticleReports(params) {
  return getLists('node', 'rapport_article_stock', params)
}
