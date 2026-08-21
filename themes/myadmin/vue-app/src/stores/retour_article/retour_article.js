import { defineStore } from "pinia";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import {
  getRetourArticles,
  saveRetourArticle,
} from "../../services/retour_article.js";
import { ref } from "vue";

export const useRetourArticleStore = defineStore("retour_article", () => {
  const retourArticles = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);

  async function fetchRetourArticles(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getRetourArticles(query);

      const data = response.data;

      if (append && retourArticles.value.rows.length) {
        retourArticles.value.rows = [...retourArticles.value.rows, ...data.rows];
      } else {
        retourArticles.value = data;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createRetourArticle(data) {
    try {
      const response = await saveRetourArticle(data);
      return response;
    } catch (err) {
      error.value = err;
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    retourArticles,
    fetchRetourArticles,
    createRetourArticle,
    error,
    loading,
  };
});
