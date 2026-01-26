import { defineStore } from "pinia";
import { computed, h, ref } from "vue";
import { getArticles, getCategories, saveArticle } from "../../services/article";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { toast } from "vue-sonner";

export const useArticleStore = defineStore("article", () => {
  const articles = ref({ rows: [], total: 0 });
  const categories = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);
  const savedOrder = ref(null);
  const cardItems = ref([]);

  // fetchArticles: si append=true, on ajoute les nouvelles données
  async function fetchArticles(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getArticles(query);

      const data = response.data;

      if (append && articles.value.rows.length) {
        // Ajouter les nouvelles données à la liste existante
        articles.value.rows = [...articles.value.rows, ...data.rows];
      } else {
        // Remplacer les données
        articles.value = data;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  // Save article
  async function createArticle(data) {
    try {
      const response = await saveArticle(data);
      return response;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  function addItem(article) {
    const item = cardItems.value.find((i) => i.nid == article.nid);

    if (item) {
      // vérifier le stock avant d'augmenter
      if (article.field_quantite_stock > 0) {
        item.quantity++;
        article.field_quantite_stock--;
      } else {
        toast.warning(() =>
          h("div", ["Rupture de stock !", h("br"), h("span", article.title)])
        );
      }
    } else {
      if (article.field_quantite_stock > 0) {
        // sauvegarder le prix original si pas déjà enregistré
        const originalPrice = article.field_prix_unitaire;

        cardItems.value.push({
          ...article,
          quantity: 1,
          _original_price: originalPrice, // on stocke le prix initial ici
        });

        article.field_quantite_stock--;
      } else {
        toast.warning(() =>
          h("div", ["Rupture de stock !", h("br"), h("span", article.title)])
        );
      }
    }
  }

  function incrementQuantity(item) {
    const article = articles.value.rows.find((a) => a.nid == item.nid);
    if (article && article.field_quantite_stock > 0) {
      item.quantity++;
      article.field_quantite_stock--;
    } else {
      toast.warning(() =>
        h("div", ["Rupture de stock !", h("br"), h("span", article.title)])
      );
    }
  }

  function decrementQuantity(item) {
    const article = articles.value.rows.find((a) => a.nid == item.nid);
    if (item.quantity > 1) {
      item.quantity--;
      if (article) article.field_quantite_stock++;
    } else {
      removeItem(item);
    }
  }

  function removeItem(item) {
    const index = cardItems.value.findIndex((i) => i.nid == item.nid);
    if (index !== -1) {
      const article = articles.value.rows.find((a) => a.nid == item.nid);
      if (article) {
        article.field_quantite_stock += cardItems.value[index].quantity;
      }
      cardItems.value.splice(index, 1);
      toast.success(() =>
        h("div", [h("span", item.title), h("br"), "a été retiré du panier !"])
      );
    }
  }

  function clearCart(order) {
    if (order) {
      cardItems.value.splice(0);
    } else {
      cardItems.value.forEach((item) => {
        const article = articles.value.rows.find((a) => a.nid == item.nid);
        if (article) article.field_quantite_stock += item.quantity;
      });
      cardItems.value.splice(0);
      toast.success("Le panier a été vidé avec succès !");
    }
  }

  // Calcul du total
  const total = computed(() => {
    return cardItems.value.reduce((sum, item) => {
      return sum + item.field_prix_unitaire * item.quantity;
    }, 0);
  });

  function saveOrder(client) {
    savedOrder.value = {
      clientId: client.nid,
      clientName: client.title,
      items: cardItems.value.map((item) => ({ ...item })), // copie des articles
      total: total.value,
    };
    return savedOrder.value;
  }

  // categories
  async function fetchCategories(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getCategories(query);
      const data = response.data;
      categories.value = data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }
  return {
    articles,
    categories,
    loading,
    error,
    fetchArticles,
    fetchCategories,
    createArticle,
    cardItems,
    addItem,
    removeItem,
    clearCart,
    total,
    savedOrder,
    saveOrder,
    decrementQuantity,
    incrementQuantity,
  };
});
