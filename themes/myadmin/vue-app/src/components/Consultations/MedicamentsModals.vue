<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-gray-900">Liste des médicaments</h4>
            <button @click="isOpen = true" v-if="!isEdit"
                class="px-3 py-2 bg-primary text-white !rounded-button text-sm font-medium whitespace-nowrap flex items-center space-x-2 cursor-pointer">
                <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-add-line"></i>
                </div>
                <span>Ajouter médicament</span>
            </button>
        </div>
        <div class="space-y-3 mb-4" v-if="Object.keys(consultationsStore.savedMedication).length > 0">
            <div v-for="item in consultationsStore.savedMedication.items" :key="item.nid"
                class="flex items-center justify-between p-2 border border-gray-200 !rounded-button">
                <div class="flex-1">
                    <p class="text-xs font-medium text-gray-900">{{ item.title }}</p>
                    <p class="text-xs text-gray-600">{{ item.field_description }}</p>
                </div>

                <div class="flex items-center">
                    <p class="text-xs text-green-600 font-medium">
                        {{ Number(item.field_prix).toLocaleString() }} Ar
                        <span class="text-gray-500"> x {{ item.quantity }}</span>
                    </p>
                    <button class="text-red-500 hover:text-red-700 cursor-pointer" v-if="!isEdit"
                        @click="removeFromList(item.nid, item.field_prix, item.quantity)">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 mb-4" v-if="Object.keys(consultationsStore.savedMedication).length > 0">
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Total médicaments:</span>
                <span class="text-lg font-semibold text-primary">{{
                    Number(consultationsStore.savedMedication.total).toLocaleString() }}
                    Ar</span>
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Instructions pharmaceutiques</label>
            <textarea rows="3" v-model="instructionGlobal"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Instructions particulières pour la prise des médicaments..."></textarea>
        </div>
        <!-- Modal -->
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50" v-if="isOpen">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Ajouter un médicament</h3>
                            <button @click="isOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <i class="ri-close-line text-xl"></i>
                                </div>
                            </button>
                        </div>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Médicament <span
                                        class="text-red-500">*</span></label>
                                <div class="relative">
                                    <div
                                        class="w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <i class="ri-search-line text-sm"></i>
                                    </div>
                                    <input type="text" v-model="searchKeywords" @keyup="searchArticle"
                                        placeholder="Rechercher ou saisir un médicament..."
                                        class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        autocomplete="off">
                                    <div v-if="showArticleList"
                                        class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                                        <div v-for="article in articleStore.articles.rows" :key="article.nid"
                                            @click="selectArticle(article)"
                                            class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 medication-suggestion">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="text-xs font-medium text-gray-900">{{ article.title }}
                                                    </h5>
                                                    <p class="text-xs text-gray-500 hidden">Antalgique • Antidouleur et
                                                        antipyrétique</p>
                                                </div>
                                                <span class="text-xs font-semibold text-primary">Qtté: {{
                                                    article.field_quantite_stock > 0 ?
                                                        parseInt(article.field_quantite_stock) : 0 }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p v-if="articleSelectedNidError" class="text-red-500 text-xs">Ce champ est requis
                                </p>
                                <div class="flex items-center justify-between mt-2">
                                    <span class="text-xs text-gray-500">Tapez pour rechercher</span>
                                    <!--  ou créer un nouveau médicament -->
                                    <button type="button"
                                        class="text-xs text-primary hover:underline cursor-pointer hidden">+ Créer
                                        nouveau</button>
                                </div>
                            </div>
                            <div v-if="isArticleSelected" class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <h4 class="text-xs font-medium text-blue-900">
                                            {{ articleSelectedTitle }}
                                        </h4>
                                        <p class="text-xs text-blue-600">Qtté dispo: <span
                                                class="font-medium text-blue-900">{{ articleSelectedQtty }}</span></p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xs font-semibold text-blue-900">
                                            {{ Number(articleSelectedPrice).toLocaleString() }} Ar
                                        </p>
                                        <p class="text-xs text-blue-600">Prix unitaire</p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Prix (Ar)</label>
                                    <input type="number" v-model="articleSelectedPrice"
                                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                        placeholder="Ex: 15000">
                                    <p v-if="articleSelectedPriceError" class="text-red-500 text-xs">Ce champ est requis
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Quantité
                                        <span v-if="isArticleSelected" class="text-xs font-normal text-green-500">
                                            (Dispo: {{ articleSelectedQtty }})</span>
                                    </label>
                                    <input type="number" v-model="quantityToOrder" min="1"
                                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                        placeholder="Ex: 15000">
                                    <p v-if="quantityToOrderError" class="text-red-500 text-xs">Quantité invalide!
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                                <textarea rows="2" v-model="instructions"
                                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                                    placeholder="3 fois par jour pendant 5 jours, ..."></textarea>
                                <p v-if="instructionsError" class="text-red-500 text-xs">Ce champ est requis</p>

                            </div>
                        </form>
                        <div class="flex space-x-3 mt-6">
                            <button @click="isOpen = false"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                                Annuler
                            </button>
                            <button @click="saveMedication"
                                class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, defineExpose } from 'vue';
import { useArticleStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';
import { useConsultationStore } from '../../stores/index.js';

export default {
    name: 'MedicamentsModals',
    setup() {
        const isOpen = ref(false);
        const isEdit = ref(false);
        const showArticleList = ref(false);
        const searchKeywords = ref('');
        const articleStore = useArticleStore();
        const quantityToOrder = ref(1);
        const isArticleSelected = ref(false);
        const articleSelectedTitle = ref('');
        const articleSelectedPrice = ref('');
        const articleSelectedNid = ref('');
        const articleSelectedQtty = ref('');
        const instructions = ref('');
        const articleSelectedNidError = ref(false)
        const articleSelectedPriceError = ref(false)
        const quantityToOrderError = ref(false)
        const instructionsError = ref(false)
        const isValid = ref(false);
        const consultationsStore = useConsultationStore();
        const instructionGlobal = ref('')


        // Paramètres dynamiques de la requête pour articles
        const articleQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_prix_unitaire',
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
            offset: 20
        })

        const searchArticle = async () => {
            showArticleList.value = true;
            updateFilter('title', searchKeywords.value, 'CONTAINS')
            await articleStore.fetchArticles(articleQueryOptions.value);
            if (searchKeywords.value == '') {
                showArticleList.value = false
            }
        }
        // Ajouter / supprimer un filtre
        const updateFilter = (key, value, op = '=') => {
            if (!value) delete articleQueryOptions.value.filters[key]
            else articleQueryOptions.value.filters[key] = { val: value, op }
        }

        const selectArticle = (article) => {
            if (article.field_quantite_stock <= 0) {
                toast.error('Article en rupture de stock !');
                return;
            }
            articleSelectedTitle.value = article.title;
            articleSelectedPrice.value = article.field_prix_unitaire
            articleSelectedQtty.value = article.field_quantite_stock
            articleSelectedNid.value = article.nid
            searchKeywords.value = article.title;
            isArticleSelected.value = true;
            showArticleList.value = false;
        }

        const saveMedication = async () => {
            isValid.value = true;

            const validateField = (field, errorField) => {
                if (field.value === '') {
                    errorField.value = true;
                    isValid.value = false;
                } else {
                    errorField.value = false;
                }
            };

            if (parseInt(articleSelectedQtty.value) < parseInt(quantityToOrder.value)) {
                quantityToOrderError.value = true;
                isValid.value = false;
            } else {
                quantityToOrderError.value = false;
                isValid.value = true;
            }
            validateField(articleSelectedNid, articleSelectedNidError);
            validateField(articleSelectedPrice, articleSelectedPriceError);


            validateField(instructions, instructionsError);

            if (!isValid.value) return;

            const data = {
                nid: parseInt(articleSelectedNid.value),
                field_prix: articleSelectedPrice.value,
                field_description: instructions.value,
                title: articleSelectedTitle.value,
                quantity: parseInt(quantityToOrder.value),
            };
            const res = await consultationsStore.saveMedication(data);
            if (res) {
                resetData();
                isOpen.value = false;
            }

        };

        const removeFromList = async (nid, prix, qtty) => {
            consultationsStore.removeFromList(nid, prix, qtty);
            toast.success('Article enlevé !');
        };

        function resetData() {
            articleSelectedNid.value = "";
            articleSelectedPrice.value = "";
            instructions.value = "";
            searchKeywords.value = "";
            articleSelectedQtty.value = "";
            isArticleSelected.value = false;
            articleSelectedPrice.value = "";
            articleSelectedTitle.value = "";
            quantityToOrder.value = "1"
        }

        function resetAll() {
            resetData();
            instructionGlobal.value = '';
            consultationsStore.savedMedication = {};
            consultationsStore.resetMedication();
        }

        function getMedicationData() {
            return {
                instructionGlobal: instructionGlobal.value
            }
        }

        function setData(medications = [], globalInstruction = '') {
            // Réinitialiser l'état actuel
            resetData();
            consultationsStore.resetMedication();
            // Ajouter chaque médicament dans le store
            if (medications.length > 0) {
                isEdit.value = true;
                medications.forEach(item => {
                    consultationsStore.saveMedication({
                        nid: item.field_articles || item.nid,
                        title: item.field_articles.title,
                        field_prix: item.field_prix,
                        quantity: item.field_quantite || 1,
                        field_description: item.field_description || ''
                    });
                });
            } else {
                isEdit.value = false;
            }

            // Pré-remplir l'instruction globale
            instructionGlobal.value = globalInstruction;
        }

        defineExpose({
            getMedicationData,
            resetAll,
            setData
        })
        return {
            isOpen,
            articleSelectedNidError,
            articleSelectedPriceError,
            instructionsError,
            showArticleList,
            searchArticle,
            selectArticle,
            articleStore,
            quantityToOrder,
            quantityToOrderError,
            searchKeywords,
            isArticleSelected,
            articleSelectedTitle,
            articleSelectedPrice,
            articleSelectedQtty,
            instructions,
            saveMedication,
            articleSelectedNid,
            consultationsStore,
            removeFromList,
            instructionGlobal,
            getMedicationData,
            resetAll,
            setData,
            isEdit
        }
    }
}
</script>

<style></style>