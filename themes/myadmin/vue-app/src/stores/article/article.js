import { defineStore } from "pinia";
import { computed, h, ref, watch } from "vue";
import {
  getArticles,
  getCategories,
  getPacks,
  saveArticle,
} from "../../services/article";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { toast } from "vue-sonner";

export const useArticleStore = defineStore("article", () => {
  const articles = ref({ rows: [], total: 0 });
  const categories = ref({ rows: [], total: 0 });
  const packs = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);
  const savedOrder = ref(null);
  const cardItems = ref([]);

  // Map pour garder trace des stocks originaux et des quantités dans le panier
  const originalStocks = ref(new Map());

  // Mettre à jour les stocks des articles affichés en fonction du panier
  function updateDisplayedStocks() {
    articles.value.rows.forEach((article) => {
      // Sauvegarder le stock original si pas déjà fait
      if (!originalStocks.value.has(article.nid)) {
        originalStocks.value.set(article.nid, article.field_quantite_stock);
      }

      // Calculer la quantité totale dans le panier pour cet article
      const cartItem = cardItems.value.find((item) => item.nid === article.nid);
      const quantityInCart = cartItem ? cartItem.quantity : 0;

      // Le stock affiché = stock original - quantité dans le panier
      const originalStock = originalStocks.value.get(article.nid);
      article.field_quantite_stock = Math.max(
        0,
        originalStock - quantityInCart,
      );
    });
  }

  async function fetchArticles(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getArticles(query);
      const data = response.data;

      if (append && articles.value.rows.length) {
        articles.value.rows = [...articles.value.rows, ...data.rows];
      } else {
        articles.value = data;
      }

      // Après avoir chargé les articles, mettre à jour les stocks affichés
      updateDisplayedStocks();
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
    const originalStock =
      originalStocks.value.get(article.nid) || article.field_quantite_stock;

    if (item) {
      if (originalStock > item.quantity) {
        item.quantity++;
        updateDisplayedStocks(); // Mettre à jour tous les stocks affichés
      } else {
        toast.warning(() =>
          h("div", ["Rupture de stock !", h("br"), h("span", article.title)]),
        );
      }
    } else {
      if (originalStock > 0) {
        // Sauvegarder le stock original si pas déjà fait
        if (!originalStocks.value.has(article.nid)) {
          originalStocks.value.set(article.nid, article.field_quantite_stock);
        }

        cardItems.value.push({
          ...article,
          quantity: 1,
          _original_price: article.field_prix_unitaire,
        });

        updateDisplayedStocks(); // Mettre à jour tous les stocks affichés
      } else {
        toast.warning(() =>
          h("div", ["Rupture de stock !", h("br"), h("span", article.title)]),
        );
      }
    }
  }

  function incrementQuantity(item) {
    const originalStock = originalStocks.value.get(item.nid);

    if (originalStock > item.quantity) {
      item.quantity++;
      updateDisplayedStocks(); // Mettre à jour tous les stocks affichés
    } else {
      toast.warning(() =>
        h("div", ["Rupture de stock !", h("br"), h("span", item.title)]),
      );
    }
  }

  function decrementQuantity(item) {
    if (item.quantity > 1) {
      item.quantity--;
      updateDisplayedStocks(); // Mettre à jour tous les stocks affichés
    } else {
      removeItem(item);
    }
  }

  function removeItem(item) {
    const index = cardItems.value.findIndex((i) => i.nid == item.nid);
    if (index !== -1) {
      cardItems.value.splice(index, 1);
      updateDisplayedStocks(); // Mettre à jour tous les stocks affichés
      toast.success(() =>
        h("div", [h("span", item.title), h("br"), "a été retiré du panier !"]),
      );
    }
  }

  function clearCart(order) {
    if (order) {
      cardItems.value.splice(0);
    } else {
      cardItems.value.splice(0);
      toast.success("Le panier a été vidé avec succès !");
    }
    updateDisplayedStocks(); // Mettre à jour tous les stocks affichés
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

    // Réinitialiser les stocks originaux après la commande
    originalStocks.value.clear();

    return savedOrder.value;
  }

  // Watch pour surveiller les changements dans le panier et mettre à jour les stocks
  watch(
    cardItems,
    () => {
      updateDisplayedStocks();
    },
    { deep: true },
  );

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

  // packs
  async function fetchTypePack(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getPacks(query);
      const data = response.data;
      packs.value = data;
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
    fetchTypePack,
    packs,
  };
});
