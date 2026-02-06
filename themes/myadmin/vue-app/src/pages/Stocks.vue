<template>
    <!-- Contenu Principal -->
    <main class="px-6 py-8 max-w-7xl mx-auto">
        <!-- Titre et Actions Principales -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion du Stock</h1>
                <p class="text-gray-600">Gérez l'inventaire des produits médicaux de votre clinique</p>
            </div>
            <div class="flex flex-wrap gap-3 mt-4 lg:mt-0">
                <button @click="updateRapport"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors !rounded-button whitespace-nowrap">
                    <div v-if="isloading" class="w-5 h-5 flex items-center justify-center">
                        <div class="w-5 h-5 border-2 border-white-500 border-t-orange-600 rounded-full animate-spin">
                        </div>
                    </div>
                    <div v-else class="w-5 h-5 flex items-center justify-center">
                        <i class="ri-file-text-line"></i>
                    </div>

                    <span v-if="isloading">Chargement</span>
                    <span v-else >Rapport Inventaire</span>
                </button>
                <button @click="openAddModal"
                    class="px-4 py-2 bg-primary text-white !rounded-button font-medium text-sm whitespace-nowrap flex items-center space-x-2">
                    <div class="w-5 h-5 flex items-center justify-center">
                        <i class="ri-add-line"></i>
                    </div>
                    <span>Ajouter Stock</span>
                </button>
                <button @click="openAddArticleModal"
                    class="bg-secondary hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors !rounded-button font-medium text-sm whitespace-nowrap">
                    <div class="w-5 h-5 flex items-center justify-center">
                        <i class="ri-add-line"></i>
                    </div>
                    <span>Ajouter Article</span>
                </button>
            </div>
        </div>
        <!-- Alertes de Stock -->
        <div v-if="stockStore.stockRapport.rows.length"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 mb-1">Produits en Rupture</p>
                        <p class="text-3xl font-bold text-red-600">8</p>
                    </div>
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <i class="ri-error-warning-line text-red-600 text-2xl"></i>
                    </div>
                </div>
                <div class="mt-4 text-sm text-red-600 font-medium">Action requise</div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 mb-1">Stock Faible</p>
                        <p class="text-3xl font-bold text-orange-600">23</p>
                    </div>
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <i class="ri-alert-line text-orange-600 text-2xl"></i>
                    </div>
                </div>
                <div class="mt-4 text-sm text-orange-600 font-medium">Réapprovisionner bientôt</div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 mb-1">Expirant sous 30j</p>
                        <p class="text-3xl font-bold text-yellow-600">15</p>
                    </div>
                    <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <i class="ri-time-line text-yellow-600 text-2xl"></i>
                    </div>
                </div>
                <div class="mt-4 text-sm text-yellow-600 font-medium">Vérifier les dates</div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 mb-1">Valeur Totale Stock</p>
                        <p class="text-3xl font-bold text-green-600">Ar 637,250,000</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <i class="ri-money-euro-circle-line text-green-600 text-2xl"></i>
                    </div>
                </div>
                <div class="mt-4 flex items-center text-sm">
                    <span class="text-green-600 font-medium">+5.2%</span>
                    <span class="text-gray-500 ml-2">vs mois dernier</span>
                </div>
            </div>
        </div>
        <!-- Recherche, Filtres et Tableau Principal -->
        <Articles :openModal="openSaveArticleModal" @openModal="openEditModal" @close="openSaveArticleModal = false"
            :selectedStock="selectedStock" :openArticleModal="openArticleModal"
            @closeArticleModal="openArticleModal = false" />
    </main>
</template>

<script>
import { reactive, ref } from 'vue';
import Articles from '../components/stocks/Articles.vue';
import { useStockStore } from '../stores/index.js';
import { toast } from 'vue-sonner';

export default {
    name: "Stocks",
    components: {
        Articles
    },
    setup() {
        const openSaveArticleModal = ref(false);
        const openArticleModal = ref(false);
        const selectedStock = ref(null);
        const stockStore = useStockStore();
        const isloading = ref(false);

        const queryOptions = ref({ //stock
            fields: [
                'nid',
                'title',
                'field_article_expirant',
                'field_article_rupture',
                'field_article_stock_faible',
                'field_total_stock',
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {},
            pager: 0,
            offset: 1
        })

        const form = reactive({
            entity_type: "node",
            bundle: "stock_rapport",
            title: "stock-rapport-" + Date.now()
        })

        const updateRapport = async () => {
            try {
                isloading.value = true
                await stockStore.createStockRapport(form)

                if (stockStore.error) {
                    toast.error("Une erreur est survenue lors de la mise à jour.")
                    return
                }

                toast.success("Rapport mise à jour!");
            } catch (error) {
                console.error("Une erreur est survenue lors de la mise à jour.")
            } finally {
                isloading.value = false
            }
        }

        const openEditModal = (stock) => {
            selectedStock.value = stock;
            openSaveArticleModal.value = true;
        };

        const openAddModal = () => {
            selectedStock.value = null;
            openSaveArticleModal.value = true;
        };

        const openAddArticleModal = () => {
            openArticleModal.value = true;
        };
        return {
            openSaveArticleModal,
            selectedStock,
            openEditModal,
            openAddModal,
            openAddArticleModal,
            openArticleModal,
            updateRapport,
            isloading,
            stockStore
        }
    }
}
</script>

<style></style>