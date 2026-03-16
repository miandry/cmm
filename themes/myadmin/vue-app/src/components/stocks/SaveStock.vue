<template>
    <!-- Modal Ajout/Modification Produit -->
    <div>
        <PageLoader v-if="loader" />
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900">Ajouter un Stock</h3>
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors" @click="$emit('close')">
                    <div class="w-6 h-6 flex items-center justify-center">
                        <i class="ri-close-line"></i>
                    </div>
                </button>
            </div>
            <form class="p-6 space-y-3">
                <div>
                    <div class="relative">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit<span
                                class="text-red-500"> *</span></label>
                        <input type="text" v-model="searchKeyWord" v-if="isEdit"
                            class="w-full bg-gray-200 px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            readonly>
                        <input type="text" v-model="searchKeyWord" @input="handleSearch" @focus="showList = true" v-else
                            @blur="showList = false"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="Ex: Paracétamol 500mg">

                        <input type="text" v-model="form.field_article" hidden>
                        <p v-if="errors.field_article" class="text-red-500 text-xs">Le nom du produit est requis</p>

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
                <div v-if="selectedArticle">
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-6 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-2">
                        <div>
                            <p class="text-xs font-medium text-blue-900">Type pack: <span
                                    class="text-xs text-blue-600">{{ selectedArticle.field_type_pack ?
                                        selectedArticle.field_type_pack.title : "Non renseigner" }}</span>
                            </p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-blue-900">Quantité par pack: <span
                                    class="text-xs text-blue-600">{{ selectedArticle.field_nombre_par_unite }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Combien de pack?<span
                                    class="text-red-500">
                                    *</span></label>
                            <input type="number" min="1" v-model="form.field_quantite"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                            <p v-if="errors.field_quantite" class="text-red-500 text-xs">Veuillez ajouter une valeur
                                supérieure à 0</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quantité unitaire<span
                                    class="text-red-500">
                                    *</span></label>
                            <input type="number" min="1" v-model="form.field_quantite_unitaire" readonly
                                class="w-full px-3 py-2 border bg-gray-100 border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                            <p v-if="errors.field_quantite_unitaire" class="text-red-500 text-xs">Veuillez ajouter une
                                valeur supérieure à 0</p>
                        </div>
                    </div>
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-6 p-3 bg-green-50 rounded-lg border border-green-200 mb-2">
                        <div>
                            <p class="text-xs font-medium text-green-900">Quantité en stock actuelle: <span
                                    class="text-xs text-green-600">{{ selectedArticle.field_quantite_stock }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fournisseurs</label>
                        <div class="relative">
                            <select v-model="form.field_fournisseur"
                                class="w-full px-3 py-2 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                <option value="">Sélectionner le fournisseur</option>
                                <option v-for="supp in suppliers" :key="supp.nid" :value="supp.nid">
                                    {{ supp.title }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (Ar)<span
                                    class="text-red-500"> *</span></label>
                            <input type="number" v-model="form.field_prix_d_achat" min="1"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="0">
                            <p v-if="errors.field_prix_d_achat" class="text-red-500 text-xs">Veuillez ajouter un prix
                                valide
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Prix de vente (Ar)<span
                                    class="text-red-500"> *</span></label>
                            <input type="number" v-model="form.field_prix_unitaire" min="1"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="0">
                            <p v-if="errors.field_prix_unitaire" class="text-red-500 text-xs">Veuillez ajouter un prix
                                valide</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date d'achat</label>
                            <input type="date" v-model="form.field_date"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Date d'achat">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date de péremption</label>
                            <input type="date" v-model="form.field_peremption"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Date de péremption">
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end space-x-4 pt-4">
                    <button type="button"
                        class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button whitespace-nowrap"
                        @click.prevent="cancelAdd">
                        Annuler
                    </button>
                    <button @click.prevent="handleSaveArticle"
                        class="flex-1 px-4 py-2 bg-secondary text-white hover:bg-green-600 !rounded-button whitespace-nowrap">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue';
import { useArticleStore, useStockStore } from '../../stores/index.js';
import PageLoader from '../PageLoader.vue';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: "SaveStock",
    components: {
        PageLoader
    },
    props: {
        suppliers: {
            type: Array,
            required: true
        },
        stock: {
            type: Object,
            required: false
        },
    },
    emits: ['addStocks', 'close', 'updateStock'],
    setup(props, { emit }) {
        const stockStore = useStockStore();
        const articleStore = useArticleStore();
        const loader = ref(false)
        const loading = ref(false)
        const showList = ref(false);
        const selectedArticle = ref(null);
        const searchKeyWord = ref('');
        const form = reactive({
            entity_type: "node",
            bundle: "stock",
            title: "stock-" + Date.now(),
            field_article: "",
            field_fournisseur: "",
            field_peremption: 1,
            status: 1,
            field_prix_d_achat: "",
            field_prix_unitaire: "",
            field_quantite: 0,
            field_quantite_unitaire: 0,
            field_date: "",
        })

        const isEdit = computed(() => {
            return props.stock && props.stock.nid;
        });

        // field_image: ""

        // ---- OBJET DES ERREURS ----
        const errors = reactive({
            field_prix_unitaire: false,
            field_peremption: false,
            field_prix_d_achat: false,
            field_quantite: false,
            field_article: false,
            field_quantite_unitaire: false,
        });


        // ---- VALIDATION ----
        const validateForm = () => {
            let isValid = true;

            // Reset erreurs
            errors.field_prix_unitaire = false;
            errors.field_peremption = false;
            errors.field_prix_d_achat = false;
            errors.field_quantite = false;
            errors.field_quantite_unitaire = false;
            errors.field_article = false;

            // Nom requis
            if (
                !form.field_article ||
                Number(form.field_article) <= 0
            ) {
                errors.field_article = true;
                isValid = false;
            }

            // Prix > 0
            if (
                !form.field_prix_unitaire ||
                Number(form.field_prix_unitaire) <= 0
            ) {
                errors.field_prix_unitaire = true;
                isValid = false;
            }

            // Prix > 0
            if (
                !form.field_prix_d_achat ||
                Number(form.field_prix_d_achat) <= 0
            ) {
                errors.field_prix_d_achat = true;
                isValid = false;
            }

            // Quantité > 0
            if (
                !form.field_quantite ||
                Number(form.field_quantite) <= 0
            ) {
                errors.field_quantite = true;
                isValid = false;
            }

            /*if (
                !form.field_quantite_unitaire ||
                Number(form.field_quantite_unitaire) <= 0
            ) {
                errors.field_quantite_unitaire = true;
                isValid = false;
            }*/

            return isValid;
        };

        const handleSaveArticle = async () => {
            if (!validateForm()) {
                return;
            }
            try {
                // Clone du form
                const payload = { ...form };
                if (form.field_fournisseur == "") {
                    delete payload.field_fournisseur;
                }

                if (isEdit.value) {
                    // MODE EDIT
                    payload.nid = props.stock.nid;
                    payload.title = props.stock.title;
                } else {
                    // MODE ADD
                    delete payload.nid; // sécurité
                }

                loader.value = true
                await stockStore.createStock(payload)
                if (stockStore.error) {
                    toast.error("Une erreur est survenue lors de l'enregistrement.")
                    return
                }

                if (isEdit.value) {
                    emit('updateStock');
                    toast.success("Modification réussie");
                } else {
                    // MODE ADD
                    toast.success("Stock enregistré avec succès");
                    emit('addStocks');
                }

                emit('close');
                resetForm();
            } catch (error) {
                console.error("Une erreur est survenue lors de l'enregstrement")
            } finally {
                loader.value = false
            }
        }

        function resetForm() {
            form.field_article = "";
            form.field_quantite = 1;
            form.field_fournisseur = "";
            form.field_prix_d_achat = "";
            form.field_prix_unitaire = "";
            form.field_date = "";
            form.field_peremption = "";
        }

        const cancelAdd = () => {
            emit('close');
            resetForm()
        }

        // article search

        const queryOptionsArticle = ref({
            fields: [
                'nid',
                'title',
                'field_type_pack',
                'field_nombre_par_unite',
                'field_quantite_stock',
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
                console.error("une erreur c'est produit lors de la chargment des données")
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
                selectedArticle.value = article;
                searchKeyWord.value = article.title;
            } else {
                form.field_article = '';
                selectedArticle.value = null;
                searchKeyWord.value = '';
            }
            showList.value = false;
        }

        const updateFilter = (queryOptionsRef, key, value, op = '=') => {
            if (!value) delete queryOptionsRef.filters[key]
            else queryOptionsRef.filters[key] = { val: value, op }
        }

        watch(
            () => props.stock,
            (stock) => {
                if (!stock) return;

                // Pré-remplissage
                form.title = stock.title;
                searchKeyWord.value = stock.field_article?.title || "";
                form.field_article = stock.field_article.nid;
                form.field_quantite = stock.field_quantite;
                form.field_fournisseur = stock.field_fournisseur?.nid || "";
                form.field_prix_d_achat = stock.field_prix_d_achat;
                form.field_prix_unitaire = stock.field_prix_unitaire;
                form.field_date = stock.field_date;
                form.field_peremption = stock.field_peremption;
            },
            { immediate: true }
        );

        watch(
            [
                () => form.field_quantite,
                () => selectedArticle.value?.field_nombre_par_unite
            ],
            ([quantite, nombreParUnite]) => {
                if (quantite > 0 && nombreParUnite > 0) {
                    form.field_quantite_unitaire = quantite * nombreParUnite;
                } else {
                    form.field_quantite_unitaire = 0;
                }
            },
            { immediate: true }
        );


        return {
            form,
            handleSaveArticle,
            errors,
            loader,
            cancelAdd,
            handleSearch,
            showList,
            articleStore,
            searchKeyWord,
            selectArticle,
            isEdit,
            selectedArticle,
        };
    }
}
</script>

<style></style>loading