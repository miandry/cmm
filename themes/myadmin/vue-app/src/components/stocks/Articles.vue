<template>
    <div>
        <PageLoader v-if="loader" />
        <!-- Recherche et Filtres -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <!-- Barre de Recherche -->
                <div class="w-full md:w-1/2 relative">
                    <input type="text" placeholder="Rechercher par nom" v-model="searchKeyWord"
                        @keypress.enter="handleSearch"
                        class="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <div
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i class="ri-search-line text-gray-400"></i>
                    </div>
                </div>
                <!-- Filtres -->
                <div class="w-full md:w-1/2 flex flex-wrap gap-3">
                    <div class="relative w-full">
                        <select v-model="selectedCategory" @change="handleCategorieFilter"
                            class=" w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2 !rounded-button whitespace-nowrap">
                            <option value="">Toutes Catégories</option>
                            <option v-for="cat in articleStore.categories.rows" :key="cat.tid" :value="cat.tid">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <!-- Tableau Principal -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" id="articlesTableau">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produit</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Catégorie</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix Unitaire</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valeur Totale</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="hover:bg-gray-50" v-for="article in articleStore.articles.rows" :key="article.nid">
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i class="ri-medicine-bottle-line text-blue-600"></i>
                                    </div>
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-900 text-xs">{{ article.title }}</div>
                                        <div class="text-sm text-gray-500 hidden">REF: PAR-500-001</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900 text-center">
                                {{ article.field_categorie ? article.field_categorie.title : "-" }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-medium text-gray-900">
                                        {{ article.field_quantite_stock < 0 ? "0" : article.field_quantite_stock }}
                                            </span>
                                            <div class="w-3 h-3 bg-secondary rounded-full"
                                                v-if="article.field_quantite_stock > 10"></div>
                                            <div class="w-3 h-3 bg-yellow-500 rounded-full"
                                                v-else-if="article.field_quantite_stock > 0"></div>
                                            <div class="w-3 h-3 bg-red-500 rounded-full" v-else></div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">

                                {{ article.field_prix_unitaire ?
                                    Number(article.field_prix_unitaire).toLocaleString('fr-MG', {
                                        style: 'currency',
                                        currency: 'MGA'
                                    }) : "-" }}
                            </td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">
                                {{ calculTotalPrice(article.field_prix_unitaire, article.field_quantite_stock) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span v-if="article.field_quantite_stock > 10"
                                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    En stock
                                </span>
                                <span v-else-if="article.field_quantite_stock > 0"
                                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Stock faible
                                </span>
                                <span v-else
                                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Rupture de stock
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-2">
                                    <button class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Modifier">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-edit-line"></i>
                                        </div>
                                    </button>
                                    <button class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                        title="Réapprovisionner">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-add-circle-line"></i>
                                        </div>
                                    </button>
                                    <button class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                        title="Détails">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-eye-line"></i>
                                        </div>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-center">
                <div class="flex items-center space-x-2">

                    <!-- Previous -->
                    <button @click="previousPage" :disabled="currentPage === 1"
                        class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <i class="ri-arrow-left-s-line"></i>
                    </button>

                    <!-- Pages -->
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                        class="px-3 py-2 rounded-md transition-colors" :class="page === currentPage
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:text-gray-900'">
                        {{ page }}
                    </button>

                    <!-- Next -->
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <i class="ri-arrow-right-s-line"></i>
                    </button>

                </div>
            </div>
        </div>

        <!-- modala add & edit -->
        <SaveStock class="fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50"
            :class="openModal ? 'flex' : 'hidden'" @close="$emit('close')"
            :categories="articleStore.categories.rows" @addArticle="addArticle"/>

    </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useArticleStore } from '../../stores/index.js';
import PageLoader from '../PageLoader.vue';
import SaveStock from './SaveStock.vue';

export default {
    name: "Articles",
    components: {
        PageLoader,
        SaveStock,
    },
    props: {
        openModal: {
            type: Boolean,
            required: true,
        }
    },
    setup() {
        const articleStore = useArticleStore();
        const perPage = 15;
        const currentPage = ref(1);
        const totalPages = computed(() => Math.ceil(articleStore.articles.total / perPage));
        const loader = ref(false);
        const searchKeyWord = ref('');
        const isFirstLoad = ref(true);
        const selectedCategory = ref('');
        // Paramètres dynamiques de la requête
        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_prix_unitaire',
                'field_nombre_par_unite',
                'field_quantite_stock',
                'field_image',
                'field_stock_unitaire',
                'field_categorie',
                'field_limite_stock',
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {},
            pager: 0,
            offset: 15
        })

        const categoryQueryOptions = ref({
            fields: [
                'tid',
                'name',
            ],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000
        })

        // Charger les articles (append=true pour "Voir plus")
        const fetchArticles = async (append = false) => {
            try {
                loader.value = true
                await articleStore.fetchArticles(queryOptions.value, append)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            } finally {
                loader.value = false
                if (isFirstLoad.value) {
                    isFirstLoad.value = false
                    return
                }
                await nextTick();

                const el = document.getElementById('articlesTableau');
                el?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        const fetchCategories = async (append = false) => {
            try {
                await articleStore.fetchCategories(categoryQueryOptions.value)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            }
        }

        onMounted(async () => {
            await fetchArticles(false)
            await fetchCategories();
        })

        const calculTotalPrice = (unitePrice, qtty) => {
            if (unitePrice && qtty && qtty >= 0) {
                return Number(unitePrice * qtty).toLocaleString('fr-MG', {
                    style: 'currency',
                    currency: 'MGA'
                })
            } else if (unitePrice && qtty && qtty <= 0) {
                return "0,00 Ar";
            } else {
                return '-'
            }
        }

        // Pages visibles (3 pages max)
        const visiblePages = computed(() => {
            const pages = [];
            const total = totalPages.value;
            const current = currentPage.value;

            if (total <= 3) {
                // Si total ≤ 3 → affichage normal
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                // Toujours 3 pages visibles autour de la page active
                if (current === 1) pages.push(1, 2, 3);
                else if (current === total) pages.push(total - 2, total - 1, total);
                else pages.push(current - 1, current, current + 1);
            }

            return pages;
        });

        // Actions
        const goToPage = page => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                onPagination(currentPage.value)
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++
                onPagination(currentPage.value)
            };
        };

        const previousPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--
                onPagination(currentPage.value)
            };
        };

        const onPagination = async (value) => {
            queryOptions.value.pager = value - 1;
            await fetchArticles(false);
        }

        const handleSearch = async () => {
            queryOptions.value.pager = 0
            updateFilter('title', searchKeyWord.value, 'CONTAINS')
            await fetchArticles(false);
        }

        const handleCategorieFilter = async () => {
            queryOptions.value.pager = 0
            updateFilter('field_categorie', selectedCategory.value)
            await fetchArticles(false);
        }

        // Ajouter / supprimer un filtre
        const updateFilter = (key, value, op = '=') => {
            if (!value) delete queryOptions.value.filters[key]
            else queryOptions.value.filters[key] = { val: value, op }
        }

        const addArticle = async () => {
            searchKeyWord.value = "";
            selectedCategory.value = "";
            updateFilter('title', searchKeyWord.value, 'CONTAINS')
            updateFilter('field_categorie', selectedCategory.value)
            await fetchArticles(false);
        }

        return {
            articleStore,
            calculTotalPrice,
            goToPage,
            nextPage,
            previousPage,
            visiblePages,
            totalPages,
            currentPage,
            loader,
            searchKeyWord,
            handleSearch,
            handleCategorieFilter,
            selectedCategory,
            addArticle
        }
    }
}
</script>

<style></style>