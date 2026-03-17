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
                <button @click="handleRapportInventaire"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors !rounded-button whitespace-nowrap">
                    <div v-if="isloading" class="w-5 h-5 flex items-center justify-center">
                        <div class="w-5 h-5 border-2 border-white-500 border-t-orange-600 rounded-full animate-spin">
                        </div>
                    </div>
                    <div v-else class="w-5 h-5 flex items-center justify-center">
                        <i class="ri-file-text-line"></i>
                    </div>

                    <span v-if="isloading">Chargement</span>
                    <span v-else>Rapport Inventaire</span>
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

            <!-- Rupture -->
            <div
                class="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-r from-red-500 to-rose-600 text-white">
                <div class="flex items-center justify-between font-bold">
                    <div>
                        <p class="text-xs uppercase opacity-80">Produits en Rupture</p>
                        <p class="text-3xl font-bold mt-1">
                            {{ stockStore.stockRapport.rows[0]?.field_article_rupture?.[0]?.value || 0 }}
                        </p>
                        <p class="text-xs opacity-80 mt-1">Action requise</p>
                    </div>

                    <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
                        <i class="ri-error-warning-line text-white text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- Stock Faible -->
            <div
                class="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <div class="flex items-center justify-between font-bold">
                    <div>
                        <p class="text-xs uppercase opacity-80">Stock Faible</p>
                        <p class="text-3xl font-bold mt-1">
                            {{ stockStore.stockRapport.rows[0]?.field_article_stock_faible?.[0]?.value || 0 }}
                        </p>
                        <p class="text-xs opacity-80 mt-1">Réapprovisionner bientôt</p>
                    </div>

                    <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
                        <i class="ri-alert-line text-white text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- Expiration -->
            <div
                class="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                <div class="flex items-center justify-between font-bold">
                    <div>
                        <p class="text-xs uppercase opacity-80">Expirant sous 30j</p>
                        <p class="text-3xl font-bold mt-1">
                            {{ stockStore.stockRapport.rows[0]?.field_article_expirant?.[0]?.value || 0 }}
                        </p>
                        <p class="text-xs opacity-80 mt-1">Vérifier les dates</p>
                    </div>

                    <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
                        <i class="ri-time-line text-white text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- Valeur Stock -->
            <div
                class="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <div class="flex items-center justify-between font-bold">
                    <div>
                        <p class="text-xs uppercase opacity-80">Valeur Totale Stock</p>
                        <p class="text-3xl font-bold mt-1">
                            Ar {{ formatNumber(stockStore.stockRapport.rows[0]?.field_total_stock?.[0]?.value || 0) }}
                        </p>
                        <p class="text-xs opacity-80 mt-1">Valeur actuelle</p>
                    </div>

                    <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
                        <i class="ri-money-dollar-circle-line text-white text-2xl"></i>
                    </div>
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
import { reactive, ref, onMounted } from 'vue';
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
        const form = reactive({
            entity_type: "node",
            bundle: "stock_rapport",
            title: "stock-rapport-" + Date.now()
        });

        // Fonction pour charger le rapport depuis le localStorage
        const loadRapportFromLocalStorage = () => {
            try {
                const savedRapport = localStorage.getItem('stockRapport');
                if (savedRapport) {
                    const rapportData = JSON.parse(savedRapport);
                    stockStore.stockRapport = rapportData;
                    // Retourner true si le rapport a été chargé
                    return true;
                }
            } catch (error) {
                console.error('Erreur lors du chargement du localStorage:', error);
            }
            return false;
        };

        // Fonction pour sauvegarder le rapport dans le localStorage
        const saveRapportToLocalStorage = (rapportData) => {
            try {
                localStorage.setItem('stockRapport', JSON.stringify(rapportData));
            } catch (error) {
                console.error('Erreur lors de la sauvegarde dans le localStorage:', error);
            }
        };

        // Fonction pour mettre à jour le rapport (fetch)
        const updateRapport = async () => {
            try {
                isloading.value = true;
                await stockStore.createStockRapport(form);

                if (stockStore.error) {
                    toast.error("Une erreur est survenue lors de la mise à jour.");
                    return;
                }

                // Sauvegarder le nouveau rapport dans le localStorage
                saveRapportToLocalStorage(stockStore.stockRapport);
                toast.success("Rapport mis à jour!");
            } catch (error) {
                console.error("Une erreur est survenue lors de la mise à jour:", error);
                toast.error("Erreur lors de la mise à jour du rapport");
            } finally {
                isloading.value = false;
            }
        };

        // Fonction pour gérer le clic sur le bouton Rapport Inventaire
        const handleRapportInventaire = async () => {
            await updateRapport();
        };

        // Formater les nombres avec séparateurs de milliers
        const formatNumber = (number) => {
            return Number(number).toLocaleString('fr-FR');
        };

        // Charger le rapport depuis le localStorage au montage du composant
        onMounted(() => {
            loadRapportFromLocalStorage();
        });

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
            handleRapportInventaire,
            isloading,
            stockStore,
            formatNumber
        }
    }
}
</script>

<style></style>