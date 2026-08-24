<template>
    <div>
        <PageLoader v-if="loader" />
        <!-- Recherche et Filtres -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div
                class="flex flex-col xl:flex-row lg:items-center space-y-4 md:space-y-0 lg:space-x-4 gap-2 md:items-end">
                <!-- Barre de Recherche -->
                <div class="w-full xl:w-2/5 relative">
                    <input type="text" placeholder="Rechercher par article" v-model="searchKeyWord"
                        @input="handleSearch" @focus="showList = true" @blur="showList = false"
                        class="w-full px-4 py-2.5 pl-12 pr-4 text-gray-900 bg-gray-50 border border-gray-300 !rounded-button focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <div
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i class="ri-search-line text-gray-400"></i>
                    </div>

                    <div v-if="showList" @mousedown.prevent
                        class="max-h-48 overflow-y-auto border border-gray-300 !rounded-button bg-white absolute right-0 left-0 z-50">

                        <!-- Loader -->
                        <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                            <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                            </div>
                            <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                        </div>
                        <div v-else-if="articleStore.articles.rows.length" class="divide-y divide-gray-100">
                            <div v-for="article in articleStore.articles.rows" :key="article.nid"
                                :class="[
                                    'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer customer-item border-t-0']"
                                @click="selectArticle(article.nid, article.title)">
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">{{ article.title }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <h3 class="text-center text-gray-400 py-2">Aucun article trouvé avec ce mot-clé</h3>
                        </div>
                    </div>

                </div>
                <!-- Filtres -->
                <div class="w-full xl:w-1/5 flex flex-wrap gap-3">
                    <div class="relative w-full">
                        <select v-model="selectedSupplier" @change="handleSupplierFilter"
                            class=" w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2 !rounded-button whitespace-nowrap">
                            <option value="">Tous Fournisseurs</option>
                            <option v-for="supp in stockStore.suppliers.rows" :key="supp.nid" :value="supp.nid">
                                {{ supp.title }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="md:flex w-full xl:w-2/5 justify-between gap-4 items-center">
                    <div class="text-gray-400 text-xs">Date achat entre :</div>
                    <div class="md:w-1/2">
                        <input type="date" placeholder="date debut" v-model="dateStart"
                            class="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 !rounded-button focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    </div>
                    <div class="text-gray-400 text-xs"> Et</div>
                    <div class="md:w-1/2">
                        <input type="date" placeholder="date fin" v-model="dateEnd"
                            class="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 !rounded-button focus:ring-2 focus:ring-primary focus:border-primary outline-none">
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
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden">
                                Prix d'achat</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix de vente</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantité</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date</th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="hover:bg-gray-50" v-for="stock in stockStore.stocks.rows" :key="stock.nid">
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i class="ri-medicine-bottle-line text-blue-600"></i>
                                    </div>
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-900 text-xs">{{ stock.field_article.title }}
                                        </div>
                                        <div class="text-sm text-gray-500">REF: {{ stock.title }}</div>
                                        <div class="text-xs text-green-500">{{ stock.field_fournisseur ?
                                            stock.field_fournisseur.title : "-" }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm hidden">
                                {{
                                    Number(stock.field_prix_d_achat).toLocaleString('fr-MG', {
                                        style: 'currency',
                                        currency: 'MGA'
                                    }) }}
                            </td>
                            <td class="px-6 py-4 text-sm">
                                {{
                                    Number(stock.field_prix_unitaire).toLocaleString('fr-MG', {
                                        style: 'currency',
                                        currency: 'MGA'
                                    }) }}
                            </td>
                            <td class="px-6 py-4 text-sm whitespace-nowrap text-center">
                                {{ stock.field_quantite <= 0 ? 0 : stock.field_quantite }} </td>
                            <td class="px-6 py-4 text-sm whitespace-nowrap">
                                <div>
                                    Achat: <span class="text-green-500">{{ formatDate(stock.field_date, null, 'short')
                                    }}</span>
                                </div>
                                <div>
                                    Péremption: <span class="text-red-500">{{ formatDate(stock.field_peremption, null,
                                        'short') }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 hidden">
                                <div class="flex items-center space-x-2">
                                    <button class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Modifier" @click.prevent="editStock(stock)">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-edit-line"></i>
                                        </div>
                                    </button>
                                    <button class="p-2 text-gray-400 hover:text-green-600 transition-colors hidden"
                                        title="Réapprovisionner">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-add-circle-line"></i>
                                        </div>
                                    </button>
                                    <button class="p-2 text-gray-400 hover:text-purple-600 transition-colors hidden"
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

        <!-- modala add & edit :class="openModal ? 'flex' : 'hidden'" -->
        <SaveStock class="fixed inset-0 flex bg-black bg-opacity-50 items-center justify-center z-50" v-if="openModal"
            @close="closeStockModal" :suppliers="stockStore.suppliers.rows" @addStocks="addStocks"
            :stock="selectedStock" @updateStock="updateStock" />

    </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useArticleStore, useStockStore } from '../../stores/index.js';
import PageLoader from '../PageLoader.vue';
import SaveStock from './SaveStock.vue';
import { formatDate } from '../../utils/formateDate.js';
import { debounce } from 'lodash';

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
        },
        selectedStock: {
            type: Object,
            default: null
        }
    },
    emits: ['openModal', 'close'],
    setup(props, { emit }) {
        const articleStore = useArticleStore();
        const stockStore = useStockStore();
        const perPage = 15;
        const currentPage = ref(1);
        const totalPages = computed(() => Math.ceil(stockStore.stocks.total / perPage));
        const loader = ref(false);
        const searchKeyWord = ref('');
        const isFirstLoad = ref(true);
        const selectedSupplier = ref('');
        const showList = ref(false);
        const loading = ref(false)
        const dateStart = ref('');
        const dateEnd = ref('');

        // Paramètres dynamiques de la requête
        const queryOptions = ref({ //stock
            fields: [
                'nid',
                'title',
                'field_article',
                'field_date',
                'field_peremption',
                'field_fournisseur',
                'field_prix_d_achat',
                'field_prix_unitaire',
                'field_quantite',
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: 15
        })

        const queryOptionsArticle = ref({
            fields: [
                'nid',
                'title'
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: 10
        })

        const supplierQueryOptions = ref({
            fields: [
                'nid',
                'title',
            ],
            sort: { val: 'title', op: 'asc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: 1000
        })

        const fetchArticles = async (append = false) => {
            try {
                await articleStore.fetchArticles(queryOptionsArticle.value, append)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            } finally {
                loader.value = false
            }
        }

        // Charger les articles (append=true pour "Voir plus")
        const fetchStocks = async (append = false) => {
            try {
                loader.value = true
                await stockStore.fetchStocks(queryOptions.value, append)
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

        const fetchSuppliers = async (append = false) => {
            try {
                await stockStore.fetchSuppliers(supplierQueryOptions.value)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            }
        }

        onMounted(async () => {
            await fetchStocks(false)
            await fetchSuppliers();
        })

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
            await fetchStocks(false);
        }

        const handleSearch = () => {
            showList.value = true;
            loading.value = true;
            debouncedFetch();
        }

        const debouncedFetch = debounce(async () => {
            if (searchKeyWord.value == "") {
                showList.value = false;
                selectArticle('', '');
                return;
            }
            updateFilter(queryOptionsArticle.value, 'title', searchKeyWord.value, 'CONTAINS')
            await fetchArticles(false);
            loading.value = false;
        }, 600);

        const selectArticle = async (nid, name) => {
            searchKeyWord.value = name;
            updateFilter(queryOptions.value, 'field_article', nid, '=')
            await fetchStocks(false)
            showList.value = false;
        }

        const handleSupplierFilter = async () => {
            queryOptions.value.pager = 0
            updateFilter(queryOptions.value, 'field_fournisseur', selectedSupplier.value, '=')
            await fetchStocks(false);
        }

        // Fonction générique pour mettre à jour les filtres
        const updateFilter = (queryOptionsRef, key, value, op = '=') => {
            if (
                value === null ||
                value === undefined ||
                value === '' ||
                (Array.isArray(value) && value.length === 0)
            ) {
                delete queryOptionsRef.filters[key];
                return;
            }

            queryOptionsRef.filters[key] = {
                val: value,
                op
            };
        };

        const closeStockModal = () => {
            emit('close')
        }

        const addStocks = async () => {
            searchKeyWord.value = "";
            selectedSupplier.value = "";
            updateFilter(queryOptions.value, 'title', searchKeyWord.value, 'CONTAINS')
            updateFilter(queryOptions.value, 'field_fournisseur', selectedSupplier.value)
            await fetchStocks(false);
        }

        const updateStock = async () => {
            await fetchStocks(false);
        }

        const editStock = (stock) => {
            emit('openModal', stock);
        }

        const applyDateBetweenFilter = async () => {
            const start = dateStart.value;
            const end = dateEnd.value;

            //  Les deux dates vides → reset filtre + reload
            if (!start && !end) {
                if (queryOptions.value.filters.field_date) {
                    delete queryOptions.value.filters.field_date;
                    queryOptions.value.pager = 0;
                    await fetchStocks(false);
                }
                return;
            }

            // Une seule date → on ne fait rien
            if (!start || !end) {
                return;
            }

            // Deux dates → BETWEEN
            updateFilter(
                queryOptions.value,
                'field_date',
                [start, end],
                'BETWEEN'
            );

            queryOptions.value.pager = 0;
            await fetchStocks(false);
        };

        watch([dateStart, dateEnd], applyDateBetweenFilter);

        return {
            articleStore,
            stockStore,
            goToPage,
            nextPage,
            previousPage,
            visiblePages,
            totalPages,
            currentPage,
            loader,
            loading,
            searchKeyWord,
            handleSearch,
            handleSupplierFilter,
            selectedSupplier,
            addStocks,
            updateStock,
            formatDate,
            selectArticle,
            showList,
            editStock,
            closeStockModal,
            dateStart,
            dateEnd
        }
    }
}
</script>

<style></style>