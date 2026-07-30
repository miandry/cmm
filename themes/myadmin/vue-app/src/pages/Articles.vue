<template>
    <main class="px-6 py-8 max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Catalogue des produits</h1>
                <p class="text-gray-600">Liste de tous les articles enregistrés dans la clinique</p>
            </div>
            <div class="flex flex-wrap gap-3 mt-4 lg:mt-0">
                <router-link to="/stocks/ajouter-produit"
                    class="bg-secondary hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors !rounded-button font-medium text-sm whitespace-nowrap">
                    <div class="w-5 h-5 flex items-center justify-center">
                        <i class="ri-add-line"></i>
                    </div>
                    <span>Ajouter un Produit</span>
                </router-link>
                <router-link to="/stocks"
                    class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 !rounded-button font-medium text-sm whitespace-nowrap flex items-center space-x-2">
                    <i class="ri-box-3-line"></i>
                    <span>Voir les stocks</span>
                </router-link>
            </div>
        </div>

        <PageLoader v-if="loader" />

        <!-- Recherche et filtres -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1 relative">
                    <input type="text" placeholder="Rechercher par nom de produit..." v-model="searchKeyword"
                        @input="handleSearch"
                        class="w-full px-4 py-2.5 pl-12 text-gray-900 bg-gray-50 border border-gray-300 !rounded-button focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <i class="ri-search-line"></i>
                    </div>
                </div>
                <div class="md:w-52">
                    <select v-model="selectedCategory" @change="handleCategoryFilter"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                        <option value="">Toutes catégories</option>
                        <option v-for="cat in articleStore.categories.rows" :key="cat.tid" :value="cat.tid">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>
                <div class="md:w-44">
                    <select v-model="statusFilter" @change="handleStatusFilter"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                        <option value="all">Tous statuts</option>
                        <option value="1">Publiés</option>
                        <option value="0">Non publiés</option>
                    </select>
                </div>
            </div>
            <p class="text-sm text-gray-500 mt-3">
                {{ articleStore.articles.total }} produit{{ articleStore.articles.total > 1 ? 's' : '' }} au total
            </p>
        </div>

        <!-- Tableau -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produit</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Catégorie</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type pack</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix unitaire</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unités / pack</th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-if="!loader && !articleStore.articles.rows.length">
                            <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                                Aucun produit trouvé.
                            </td>
                        </tr>
                        <tr v-for="article in articleStore.articles.rows" :key="article.nid"
                            class="hover:bg-gray-50" :class="{ 'opacity-60': !isPublished(article) }">
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 rounded-lg overflow-hidden bg-blue-100 flex-shrink-0 flex items-center justify-center">
                                        <img v-if="getArticleImage(article)" :src="getArticleImage(article)"
                                            :alt="article.title" class="w-full h-full object-cover">
                                        <i v-else class="ri-medicine-bottle-line text-blue-600"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900 text-sm">{{ article.title }}</div>
                                        <div class="text-xs text-gray-400">#{{ article.nid }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="publishBadgeClass(article)"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    {{ isPublished(article) ? 'Publié' : 'Non publié' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">
                                {{ getTaxonomyLabel(article.field_categorie, articleStore.categories.rows) }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">
                                {{ getTaxonomyLabel(article.field_type_pack, articleStore.packs.rows) }}
                            </td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                {{ formatPrice(article.field_prix_unitaire) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="stockBadgeClass(article.field_quantite_stock)"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    {{ article.field_quantite_stock ?? 0 }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 text-center">
                                {{ article.field_nombre_par_unite ?? '—' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <router-link :to="`/articles/${article.nid}/edit`"
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                        title="Modifier">
                                        <i class="ri-edit-line"></i>
                                        Modifier
                                    </router-link>
                                    <button type="button" :disabled="togglingId === article.nid"
                                        @click="togglePublish(article)"
                                        :class="isPublished(article)
                                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'"
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                                        <i v-if="togglingId === article.nid" class="ri-loader-4-line animate-spin"></i>
                                        <i v-else-if="isPublished(article)" class="ri-eye-off-line"></i>
                                        <i v-else class="ri-eye-line"></i>
                                        {{ togglingId === article.nid
                                            ? 'En cours...'
                                            : (isPublished(article) ? 'Dépublier' : 'Publier') }}
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
                    <button @click="previousPage" :disabled="currentPage === 1"
                        class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <i class="ri-arrow-left-s-line"></i>
                    </button>
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                        class="px-3 py-2 rounded-md transition-colors" :class="page === currentPage
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:text-gray-900'">
                        {{ page }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <i class="ri-arrow-right-s-line"></i>
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { debounce } from 'lodash';
import { toast } from 'vue-sonner';
import { useArticleStore } from '../stores/index.js';
import PageLoader from '../components/PageLoader.vue';

export default {
    name: 'Articles',
    components: { PageLoader },
    setup() {
        const articleStore = useArticleStore();
        const loader = ref(false);
        const searchKeyword = ref('');
        const selectedCategory = ref('');
        const statusFilter = ref('all');
        const currentPage = ref(1);
        const togglingId = ref(null);
        const perPage = 15;

        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'status',
                'field_prix_unitaire',
                'field_quantite_stock',
                'field_nombre_par_unite',
                'field_categorie',
                'field_type_pack',
                'field_image',
            ],
            sort: { val: 'title', op: 'asc' },
            filters: {},
            values: {
                field_categorie: ['tid', 'name', 'title'],
                field_type_pack: ['tid', 'name', 'title'],
            },
            pager: 0,
            offset: perPage,
        });

        const categoryQueryOptions = ref({
            fields: ['tid', 'name'],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000,
        });

        const packQueryOptions = ref({
            fields: ['tid', 'name'],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000,
        });

        const totalPages = computed(() =>
            Math.max(1, Math.ceil(articleStore.articles.total / perPage))
        );

        const visiblePages = computed(() => {
            const pages = [];
            const total = totalPages.value;
            const current = currentPage.value;

            if (total <= 3) {
                for (let i = 1; i <= total; i++) pages.push(i);
            } else if (current === 1) {
                pages.push(1, 2, 3);
            } else if (current === total) {
                pages.push(total - 2, total - 1, total);
            } else {
                pages.push(current - 1, current, current + 1);
            }
            return pages;
        });

        const updateFilter = (key, value, op = '=') => {
            if (value === null || value === undefined || value === '') {
                delete queryOptions.value.filters[key];
                return;
            }
            queryOptions.value.filters[key] = { val: value, op };
        };

        const fetchArticles = async () => {
            try {
                loader.value = true;
                await articleStore.fetchArticles(queryOptions.value);
            } catch (error) {
                console.error('Erreur lors du chargement des articles', error);
            } finally {
                loader.value = false;
            }
        };

        const fetchCategories = async () => {
            try {
                await articleStore.fetchCategories(categoryQueryOptions.value);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories', error);
            }
        };

        const fetchPacks = async () => {
            try {
                await articleStore.fetchTypePack(packQueryOptions.value);
            } catch (error) {
                console.error('Erreur lors du chargement des types pack', error);
            }
        };

        const getTaxonomyLabel = (field, lookupRows = []) => {
            if (field === null || field === undefined || field === '') {
                return '—';
            }
            if (typeof field === 'string' || typeof field === 'number') {
                const tid = String(field);
                const found = lookupRows.find((row) => String(row.tid) === tid);
                return found?.name || found?.title || tid;
            }
            const label = field.name || field.title || field.label;
            if (label) {
                return label;
            }
            const tid = field.tid || field.target_id;
            if (tid) {
                const found = lookupRows.find((row) => String(row.tid) === String(tid));
                if (found) {
                    return found.name || found.title || '—';
                }
            }
            return '—';
        };

        const handleSearch = debounce(async () => {
            currentPage.value = 1;
            queryOptions.value.pager = 0;
            updateFilter('title', searchKeyword.value.trim(), 'CONTAINS');
            await fetchArticles();
        }, 400);

        const handleCategoryFilter = async () => {
            currentPage.value = 1;
            queryOptions.value.pager = 0;
            updateFilter('field_categorie', selectedCategory.value);
            await fetchArticles();
        };

        const handleStatusFilter = async () => {
            currentPage.value = 1;
            queryOptions.value.pager = 0;
            if (statusFilter.value === 'all') {
                delete queryOptions.value.filters.status;
            } else {
                updateFilter('status', Number(statusFilter.value));
            }
            await fetchArticles();
        };

        const goToPage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                queryOptions.value.pager = page - 1;
                fetchArticles();
            }
        };

        const nextPage = () => goToPage(currentPage.value + 1);
        const previousPage = () => goToPage(currentPage.value - 1);

        const isPublished = (article) => Number(article.status) === 1;

        const togglePublish = async (article) => {
            const publish = !isPublished(article);
            togglingId.value = article.nid;

            try {
                const response = await articleStore.updateArticleStatus(article.nid, publish);
                if (!response?.data?.status) {
                    toast.error('Impossible de modifier le statut du produit.');
                    return;
                }

                article.status = publish ? 1 : 0;
                toast.success(publish ? 'Produit publié.' : 'Produit dépublié.');

                if (statusFilter.value !== 'all' && String(article.status) !== statusFilter.value) {
                    await fetchArticles();
                }
            } catch (error) {
                toast.error('Une erreur est survenue lors de la mise à jour.');
            } finally {
                togglingId.value = null;
            }
        };

        const formatPrice = (value) => {
            if (value === null || value === undefined || value === '') return '—';
            return Number(value).toLocaleString('fr-MG', {
                style: 'currency',
                currency: 'MGA',
            });
        };

        const getArticleImage = (article) => {
            const url = article.field_image?.image?.url;
            return url || null;
        };

        const stockBadgeClass = (qty) => {
            const n = Number(qty) || 0;
            if (n <= 0) return 'bg-red-100 text-red-700';
            if (n <= 10) return 'bg-orange-100 text-orange-700';
            return 'bg-green-100 text-green-700';
        };

        const publishBadgeClass = (article) =>
            isPublished(article) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';

        onMounted(async () => {
            await Promise.all([fetchCategories(), fetchPacks(), fetchArticles()]);
        });

        return {
            articleStore,
            loader,
            searchKeyword,
            selectedCategory,
            statusFilter,
            currentPage,
            totalPages,
            visiblePages,
            togglingId,
            handleSearch,
            handleCategoryFilter,
            handleStatusFilter,
            goToPage,
            nextPage,
            previousPage,
            togglePublish,
            isPublished,
            formatPrice,
            getArticleImage,
            getTaxonomyLabel,
            stockBadgeClass,
            publishBadgeClass,
        };
    },
};
</script>
