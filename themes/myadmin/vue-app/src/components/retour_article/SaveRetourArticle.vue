<template>
    <!-- Modal Ajout/Modification Retour Article -->
    <div>
        <PageLoader v-if="loader" />
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900">Ajouter un Retour d'Article</h3>
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors" @click="$emit('close')">
                    <div class="w-6 h-6 flex items-center justify-center">
                        <i class="ri-close-line"></i>
                    </div>
                </button>
            </div>
            <form class="p-6 space-y-3">
                <div>
                    <div class="relative">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Article<span
                                class="text-red-500"> *</span></label>
                        <input type="text" v-model="searchKeyWord" @input="handleSearch" @focus="showList = true" @blur="showList = false"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="Rechercher un article">
                        <input type="text" v-model="form.field_article" hidden>
                        <p v-if="errors.field_article" class="text-red-500 text-xs">L'article est requis</p>

                        <div v-if="showList" @mousedown.prevent
                            class="max-h-48 overflow-y-auto border border-gray-300 !rounded-button bg-white absolute right-0 left-0 z-50">

                            <!-- Loader -->
                            <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                                <div
                                    class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                                </div>
                                <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                            </div>
                            <div v-else-if="articleStore.articles.rows.length" class="divide-y divide-gray-100">
                                <div v-for="article in articleStore.articles.rows" :key="article.nid"
                                    :class="[
                                        'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer customer-item border-t-0']" @click="selectArticle(article)">
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
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantité<span
                            class="text-red-500"> *</span></label>
                    <input type="number" min="1" v-model="form.field_quantite"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Quantité retournée">
                    <p v-if="errors.field_quantite" class="text-red-500 text-xs">Veuillez ajouter une quantité valide</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea v-model="form.field_description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Description du retour (raison, état, etc.)"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date<span
                            class="text-red-500"> *</span></label>
                    <input type="date" v-model="form.field_date"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                    <p v-if="errors.field_date" class="text-red-500 text-xs">La date est requise</p>
                </div>

                <div class="flex items-center justify-end space-x-4 pt-4">
                    <button type="button"
                        class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button whitespace-nowrap"
                        @click.prevent="cancelAdd">
                        Annuler
                    </button>
                    <button @click.prevent="handleSaveRetourArticle"
                        class="flex-1 px-4 py-2 bg-secondary text-white hover:bg-green-600 !rounded-button whitespace-nowrap">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useRetourArticleStore, useArticleStore } from '../../stores/index.js';
import PageLoader from '../PageLoader.vue';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: "SaveRetourArticle",
    components: {
        PageLoader
    },
    props: {
        articles: {
            type: Array,
            required: false
        },
        retourArticle: {
            type: Object,
            required: false
        },
    },
    emits: ['addRetourArticle', 'close'],
    setup(props, { emit }) {
        const retourArticleStore = useRetourArticleStore();
        const articleStore = useArticleStore();
        const loader = ref(false);
        const loading = ref(false);
        const showList = ref(false);
        const searchKeyWord = ref('');
        const form = reactive({
            entity_type: "node",
            bundle: "retour_article",
            title: "retour-article-" + Date.now(),
            field_article: "",
            field_quantite: "",
            field_description: "",
            field_date: "",
            status: 1,
        });

        // ---- OBJET DES ERREURS ----
        const errors = reactive({
            field_article: false,
            field_quantite: false,
            field_date: false,
        });

        // ---- VALIDATION ----
        const validateForm = () => {
            let isValid = true;

            // Reset erreurs
            errors.field_article = false;
            errors.field_quantite = false;
            errors.field_date = false;

            // Article requis
            if (!form.field_article || Number(form.field_article) <= 0) {
                errors.field_article = true;
                isValid = false;
            }

            // Quantité > 0
            if (!form.field_quantite || Number(form.field_quantite) <= 0) {
                errors.field_quantite = true;
                isValid = false;
            }

            // Date requise
            if (!form.field_date) {
                errors.field_date = true;
                isValid = false;
            }

            return isValid;
        };

        const handleSaveRetourArticle = async () => {
            if (!validateForm()) {
                return;
            }
            try {
                const payload = { ...form };

                loader.value = true;
                await retourArticleStore.createRetourArticle(payload);
                
                if (retourArticleStore.error) {
                    toast.error("Une erreur est survenue lors de l'enregistrement.");
                    return;
                }

                toast.success("Retour d'article enregistré avec succès");
                emit('addRetourArticle');
                emit('close');
                resetForm();
            } catch (error) {
                console.error("Une erreur est survenue lors de l'enregistrement", error);
                toast.error("Une erreur est survenue lors de l'enregistrement");
            } finally {
                loader.value = false;
            }
        };

        function resetForm() {
            form.field_article = "";
            form.field_quantite = "";
            form.field_description = "";
            form.field_date = "";
        }

        const cancelAdd = () => {
            emit('close');
            resetForm();
        }

        // article search
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

        const fetchArticles = async (append = false) => {
            try {
                await articleStore.fetchArticles(queryOptionsArticle.value, append)
            } catch (error) {
                console.error("une erreur c'est produit lors du chargement des données")
            } finally {
                loading.value = false
            }
        }

        const handleSearch = () => {
            showList.value = true;
            loading.value = true;
            debouncedFetch();
        }

        const debouncedFetch = debounce(async () => {
            if (searchKeyWord.value == "") {
                showList.value = false;
                selectArticle(null);
                return;
            }
            updateFilter(queryOptionsArticle.value, 'title', searchKeyWord.value, 'CONTAINS')
            await fetchArticles(false);
            loading.value = false;
        }, 600);

        const selectArticle = async (article) => {
            if (article) {
                form.field_article = article.nid;
                searchKeyWord.value = article.title;
            } else {
                form.field_article = '';
                searchKeyWord.value = '';
            }
            showList.value = false;
        }

        const updateFilter = (queryOptionsRef, key, value, op = '=') => {
            if (!value) delete queryOptionsRef.filters[key]
            else queryOptionsRef.filters[key] = { val: value, op }
        }

        return {
            form,
            handleSaveRetourArticle,
            errors,
            loader,
            cancelAdd,
            handleSearch,
            showList,
            articleStore,
            searchKeyWord,
            selectArticle,
            loading,
        };
    }
}
</script>

<style></style>
