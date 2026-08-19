import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { getArticleReports } from "../../services/articleReports.js";

export const useArticleReportsStore = defineStore("articleReports", () => {
  const reports = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);

  async function fetchReports(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getArticleReports(query);
      const data = response.data;

      if (append && reports.value.rows.length) {
        reports.value.rows = [...reports.value.rows, ...data.rows];
      } else {
        reports.value = data;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    reports,
    loading,
    error,
    fetchReports,
  };
});
