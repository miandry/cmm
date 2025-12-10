<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-gray-900">Examens complémentaires prescrits</h4>
            <button @click="isModalOpen = true"
                class="px-3 py-2 bg-primary text-white !rounded-button text-sm font-medium whitespace-nowrap flex items-center space-x-2 cursor-pointer">
                <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-add-line"></i>
                </div>
                <span>Prescrire examen</span>
            </button>
        </div>
        <div class="space-y-3 mb-4" v-if="Object.keys(examenStore.savedExamen).length > 0">
            <div v-for="ex in examenStore.savedExamen.items" :key="ex.nid"
                class="flex items-center justify-between p-3 border border-gray-200 !rounded-button">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900 text-xs">{{ ex.title }}</h4>
                    <p class="text-xs text-gray-800">{{ ex.field_justification }}</p>
                    <p class="text-xs text-gray-400">{{ ex.field_description }}</p>
                </div>
                <div class="flex items-center">
                    <p class="text-xs text-green-600 font-medium">{{ Number(ex.field_prix).toLocaleString() }} Ar</p>
                    <button @click="removeFromList(ex.nid, ex.field_prix)"
                        class="text-red-500 hover:text-red-700 cursor-pointer">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 mb-4" v-if="Object.keys(examenStore.savedExamen).length > 0">
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Total examens:</span>
                <span class="text-lg font-semibold text-primary">{{
                    Number(examenStore.savedExamen.total).toLocaleString() }} Ar</span>
            </div>
        </div>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Conseils
                    hygiéno-diététiques</label>
                <textarea rows="3" v-model="conseils"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Conseils sur l'alimentation, l'hygiène de vie, l'activité physique..."></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Précautions
                        particulières</label>
                    <textarea rows="3" v-model="precautions"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Précautions à prendre..."></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Signes d'alerte</label>
                    <textarea rows="3" v-model="signes"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Signes nécessitant une consultation urgente..."></textarea>
                </div>
            </div>
        </div>
        <!-- MOdal -->
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50" v-if="isModalOpen">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Prescrire un examen</h3>
                            <button @click="isModalOpen = false"
                                class="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <i class="ri-close-line text-xl"></i>
                                </div>
                            </button>
                        </div>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Type d'examen <span
                                        class="text-red-500">*</span></label>
                                <div class="relative">
                                    <div
                                        class="w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <i class="ri-search-line text-sm"></i>
                                    </div>
                                    <input type="text" v-model="searchKeywords" @keyup="examSearch"
                                        placeholder="Rechercher ou saisir un nouvel examen..."
                                        class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        autocomplete="off">
                                    <div v-if="showExamList"
                                        class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                                        <div v-for="ex in examenStore.examens.rows" :key="ex.nid"
                                            @click="selectedExam(ex)"
                                            class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 exam-suggestion">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="text-xs font-medium text-gray-900">
                                                        {{ ex.title }}
                                                    </h5>
                                                </div>
                                                <span class="text-xs font-semibold text-primary">{{
                                                    Number(ex.field_prix).toLocaleString() }} Ar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-xs text-red-500" v-if="formError.nid">Ce champ est requis</p>
                                <div class="flex items-center justify-between mt-2">
                                    <span class="text-xs text-gray-500">Tapez pour rechercher</span>
                                    <!--  ou créer un nouvel
                                        examen -->
                                    <button type="button"
                                        class="text-xs text-primary hover:underline cursor-pointer hidden">+ Créer
                                        nouvel
                                        examen</button>
                                </div>
                            </div>
                            <div v-if="showSelectedExam" class="p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h4 class="text-sm font-medium text-blue-900">
                                            {{ exTitle }}
                                        </h4>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-semibold text-blue-900">{{
                                            Number(exFieldPrix).toLocaleString() }} Ar</p>
                                        <p class="text-xs text-blue-600 hidden">Prix estimé</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Prix personnalisé <span
                                        class="text-red-500">*</span></label>
                                <div class="relative">
                                    <input type="number" v-model="exFieldPrix"
                                        class="w-full px-3 py-2 pr-12 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                        placeholder="0">
                                    <span
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Ar</span>
                                </div>
                                <p class="text-xs text-red-500" v-if="formError.field_prix">Entrez un prix valide</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Instructions
                                    particulières</label>
                                <textarea v-model="exFieldDescription" rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                                    placeholder="Instructions spécifiques pour l'examen..."></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Justification
                                    clinique</label>
                                <textarea v-model="exFieldJustification" rows="2"
                                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                                    placeholder="Justification médicale de la prescription..."></textarea>
                            </div>
                        </form>
                        <div class="flex space-x-3 mt-6">
                            <button @click="isModalOpen = false"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                                Annuler
                            </button>
                            <button @click="saveExamen"
                                class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                                Prescrire
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useExamenStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';

export default {
    name: 'RecommandationsModals',
    setup() {
        const isModalOpen = ref(false);
        const showExamList = ref(false);
        const showSelectedExam = ref(false);
        const examenStore = useExamenStore();
        const isValid = ref(false);
        const conseils = ref('');
        const precautions = ref('');
        const signes = ref('');
        // -----
        const searchKeywords = ref('');
        const exNid = ref('')
        const exFieldDescription = ref('');
        const exFieldJustification = ref('');
        const exFieldPrix = ref('');
        const exTitle = ref('');
        const formError = reactive({
            nid: false,
            field_prix: false,
        })

        // Paramètres dynamiques de la requête pour examen
        const examenQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_prix',
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {},
            pager: 0,
            offset: 20
        })

        const examSearch = async () => {
            showExamList.value = true;
            updateFilter('title', searchKeywords.value, 'CONTAINS')
            await examenStore.fetchExamens(examenQueryOptions.value);
            if (searchKeywords.value == '') {
                showExamList.value = false
            }
        }

        // Ajouter / supprimer un filtre
        const updateFilter = (key, value, op = '=') => {
            if (!value) delete examenQueryOptions.value.filters[key]
            else examenQueryOptions.value.filters[key] = { val: value, op }
        }


        const selectedExam = (exam) => {
            exFieldPrix.value = exam.field_prix;
            exTitle.value = exam.title;
            exNid.value = exam.nid;
            searchKeywords.value = exam.title
            showExamList.value = false;
            showSelectedExam.value = true;
        }

        const validateForm = () => {
            isValid.value = true;
            if (exNid.value == '') {
                formError.nid = true;
                isValid.value = false;
            } else {
                formError.nid = false;
            }

            if (exFieldPrix.value == '' || exFieldPrix.value == 0) {
                formError.field_prix = true;
                isValid.value = false;
            } else {
                formError.field_prix = false;
            }
        }

        function resetForm() {
            showExamList.value = false
            showSelectedExam.value = false;
            searchKeywords.value = "";
            exNid.value = '';
            exTitle.value = '';
            exFieldDescription.value = '';
            exFieldJustification.value = '';
            exFieldPrix.value = '';
        }

        const saveExamen = async () => {
            validateForm()
            if (!isValid.value) return;
            const data = {
                nid: exNid.value,
                title: exTitle.value,
                field_description: exFieldDescription.value,
                field_justification: exFieldJustification.value,
                field_prix: exFieldPrix.value,
            }
            await examenStore.saveExamen(data)
            resetForm()
            isModalOpen.value = false;
        }

        const removeFromList = async (nid, prix) => {
            examenStore.removeFromList(nid, prix);
            toast.success('element enlevé !');
        };

        return {
            isModalOpen,
            examSearch,
            examenStore,
            showExamList,
            selectedExam,
            showSelectedExam,
            formError,
            saveExamen,
            searchKeywords,
            exNid,
            exFieldDescription,
            exFieldJustification,
            exFieldPrix,
            exTitle,
            removeFromList,
            conseils,
            precautions,
            signes,
        }

    }
}
</script>

<style></style>