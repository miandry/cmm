<template>
    <div>
        <!-- Boutons supérieurs -->
        <div class="fixed top-16 right-2 sm:top-4 sm:right-4 no-print z-50">
            <div class="flex gap-2">
                <button @click="printOrdonnance"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimer
                </button>
                <button @click="smartBack"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <i class="ri-arrow-left-line"></i>
                    Revenir
                </button>
            </div>
        </div>

        <!-- Conteneur principal avec pagination -->
        <div>

            <!-- Onglets -->
            <div class="w-[350px] mx-auto mt-4 text-xs no-print z-40">
                <div class="flex bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <button @click="activeTab = 'medicaments'" :class="[
                        'py-2 font-medium text-xs transition-colors w-full',
                        activeTab === 'medicaments'
                            ? 'bg-medical-blue text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    ]">
                        Médicaments & Instructions
                    </button>
                    <button @click="activeTab = 'examens'" :class="[
                        'py-2 font-medium text-xs transition-colors w-full',
                        activeTab === 'examens'
                            ? 'bg-medical-blue text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    ]">
                        Examens
                    </button>
                </div>
            </div>

            <!-- Onglet Médicaments & Instructions -->
            <div v-if="activeTab === 'medicaments'" v-for="pageNumber in displayedMedicamentsPages"
                :key="`med-page-${pageNumber}`" class="sheet-a5 p-5 relative flex flex-col justify-between mb-6"
                :class="{ 'hidden': pageNumber !== currentMedicamentsPage }" v-show="ordonnanceData">
                <div class="print-colors-fix">
                    <!-- En-tête -->
                    <div
                        class="flex justify-between items-start border-b-4 border-double border-medical-blue pb-2 mb-4 font-sans">
                        <div class="w-2/3">
                            <h1 class="text-sm font-bold text-medical-blue uppercase tracking-wide leading-tight editable-field"
                                contenteditable="true" @blur="updateField('medecin.nom', $event)"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'medecinNom')"
                                @input="preventVueUpdate($event)" ref="medecinNomField">
                                {{ ordonnanceData.medecin.nom }}
                            </h1>
                            <p class="text-sm font-medium text-gray-600 leading-tight editable-field"
                                contenteditable="true" @blur="updateField('medecin.titre', $event)"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'medecinTitre')"
                                @input="preventVueUpdate($event)" ref="medecinTitreField">
                                {{ ordonnanceData.medecin.titre }}
                            </p>
                            <div class="text-[11px] text-gray-500 leading-snug mt-1">
                                <p class="font-bold text-medical-blue inline mr-3 editable-field" contenteditable="true"
                                    @blur="updateField('medecin.centre', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinCentre')" @input="preventVueUpdate($event)"
                                    ref="medecinCentreField">
                                    {{ ordonnanceData.medecin.centre }}
                                </p>
                                <span class="inline editable-field" contenteditable="true"
                                    @blur="updateField('medecin.adresse', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinAdresse')" @input="preventVueUpdate($event)"
                                    ref="medecinAdresseField">
                                    {{ ordonnanceData.medecin.adresse }}
                                </span>
                                <p class="mt-[2px] editable-field" contenteditable="true"
                                    @blur="updateField('medecin.contact', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinContact')" @input="preventVueUpdate($event)"
                                    ref="medecinContactField">
                                    {{ ordonnanceData.medecin.contact }}
                                </p>
                                <p class="mt-[2px] text-[9px] editable-field" contenteditable="true"
                                    @blur="updateField('medecin.immat', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinImmat')" @input="preventVueUpdate($event)"
                                    ref="medecinImmatField">
                                    {{ ordonnanceData.medecin.immat }}
                                </p>
                            </div>
                        </div>

                        <div class="w-1/3 text-right pt-1">
                            <div class="text-sm text-medical-blue font-semibold leading-tight">
                                <span class="editable-field" contenteditable="true"
                                    @blur="updateField('cabinet.ville', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'cabinetVille')" @input="preventVueUpdate($event)"
                                    ref="cabinetVilleField">
                                    {{ ordonnanceData.cabinet.ville }}
                                </span>, le
                            </div>
                            <div class="text-base font-bold text-gray-800 mt-[2px]">
                                <span class="date-editable editable-field" contenteditable="true"
                                    @blur="updateField('date', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'date')" @input="preventVueUpdate($event)"
                                    ref="dateField">
                                    {{ ordonnanceData.date }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Informations patient (uniquement sur la première page) -->
                    <div v-if="pageNumber === 1"
                        class="bg-medical-gray rounded-md p-2.5 mb-4 print:bg-transparent print:p-0 print:mb-3">
                        <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm items-end leading-snug">
                            <div class="min-w-[100px] flex items-baseline">
                                <span class="font-sans font-bold text-medical-blue text-xs inline-block">Nom :</span>
                                <span class="font-bold text-base text-xs patient-nom editable-field" contenteditable="true"
                                    @blur="updateField('patient.nom', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'patientNom')" @input="preventVueUpdate($event)"
                                    ref="patientNomField">
                                    {{ ordonnanceData.patient.nom }}
                                </span>
                            </div>
                            <div class="flex items-baseline">
                                <span class="font-sans font-bold text-medical-blue text-xs">Âge :</span>
                                <span class="patient-age editable-field text-xs" contenteditable="true"
                                    @blur="updateField('patient.age', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'patientAge')" @input="preventVueUpdate($event)"
                                    ref="patientAgeField">
                                    {{ ordonnanceData.patient.age }}
                                </span>
                            </div>
                            <div class="flex items-baseline">
                                <span class="font-sans font-bold text-medical-blue text-xs">Dossier :</span>
                                <span class="patient-dossier editable-field text-xs" contenteditable="true"
                                    @blur="updateField('patient.dossier', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'patientDossier')" @input="preventVueUpdate($event)"
                                    ref="patientDossierField">
                                    {{ ordonnanceData.patient.dossier }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Section Prescription Médicaments -->
                    <div class="mb-3">
                        <h2 v-if="getMedicamentsForPage(pageNumber).length"
                            class="font-sans text-base font-bold text-medical-blue border-b border-gray-300 mb-3 pb-0.5">
                            Prescription
                        </h2>

                        <ul class="med-counter">
                            <li v-for="(traitement, index) in getMedicamentsForPage(pageNumber)" :key="index"
                                class="med-item relative group border-b border-gray-100 pb-2 print:border-none">
                                <div class="pl-6">
                                    <div class="flex justify-between items-baseline">
                                        <strong
                                            class="text-medical-red font-bold text-xs block leading-tight editable-field"
                                            contenteditable="true"
                                            @blur="(e) => updateTraitementField(traitement.originalIndex, 'nom', e)"
                                            @keydown.enter="saveAndBlur($event)"
                                            @focus="(e) => handleTraitementFocus(e, traitement.originalIndex, 'nom')"
                                            @input="preventVueUpdate($event)">
                                            {{ traitement.nom }}
                                        </strong>
                                        <button @click="removeTraitement(traitement.originalIndex)"
                                            class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            ×
                                        </button>
                                    </div>
                                    <div class="dosage-info text-xs text-gray-700 ml-2 space-y-0.5 leading-snug">
                                        <div class="flex items-baseline">
                                            <span class="w-2 h-1 bg-gray-300 rounded-full mr-1.5 print:hidden"></span>
                                            <span class="flex-1 editable-field" contenteditable="true"
                                                @blur="(e) => updateTraitementField(traitement.originalIndex, 'posologie', e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleTraitementFocus(e, traitement.originalIndex, 'posologie')"
                                                @input="preventVueUpdate($event)">
                                                {{ traitement.posologie }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div v-if="pageNumber === totalMedicamentsPages" class="mt-3 no-print">
                            <button @click="addTraitement"
                                class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">
                                <span class="text-lg mr-1 leading-none">+</span> Ajouter un médicament
                            </button>
                        </div>
                    </div>

                    <!-- Instructions & Rendez-vous (uniquement sur la dernière page des médicaments) -->
                    <div v-if="pageNumber === totalMedicamentsPages"
                        class="mt-4 border-t border-dashed border-gray-300 pt-3">
                        <h3 class="font-sans text-xs font-bold text-medical-blue uppercase mb-1">
                            Instructions & Rendez-vous
                        </h3>
                        <ul id="instructions-list"
                            class="list-disc list-outside ml-4 text-sm text-gray-700 space-y-0.5 leading-snug">
                            <li v-for="(instruction, index) in ordonnanceData.instructions" :key="index"
                                class="instruction-item">
                                <span class="instruction-text editable-field" contenteditable="true"
                                    @blur="(e) => updateInstruction(index, e)" @keydown.enter="saveAndBlur($event)"
                                    @focus="(e) => handleInstructionFocus(e, index)" @input="preventVueUpdate($event)">
                                    {{ instruction }}
                                </span>
                                <button @click="removeInstruction(index)"
                                    class="no-print text-red-400 hover:text-red-600 font-bold px-1 text-lg opacity-0 hover:opacity-100 transition-opacity ml-2">
                                    ×
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Signature -->
                <div class="mt-8 pt-3 border-t border-gray-200 text-right">
                    <p class="text-xs italic text-gray-500 mb-1">Signature & Cachet</p>
                    <div class="inline-block w-40 h-14 border border-gray-300 rounded print:border-none"></div>
                </div>
            </div>

            <!-- Onglet Examens -->
            <div v-if="activeTab === 'examens'" v-for="pageNumber in displayedExamensPages"
                :key="`ex-page-${pageNumber}`" class="sheet-a5 p-5 relative flex flex-col justify-between mb-6"
                :class="{ 'hidden': pageNumber !== currentExamensPage }" v-show="ordonnanceData">
                <div class="print-colors-fix">
                    <!-- En-tête (identique) -->
                    <div
                        class="flex justify-between items-start border-b-4 border-double border-medical-blue pb-2 mb-4 font-sans">
                        <div class="w-2/3">
                            <h1 class="text-sm font-bold text-medical-blue uppercase tracking-wide leading-tight editable-field"
                                contenteditable="true" @blur="updateField('medecin.nom', $event)"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'medecinNom')"
                                @input="preventVueUpdate($event)">
                                {{ ordonnanceData.medecin.nom }}
                            </h1>
                            <p class="text-sm font-medium text-gray-600 leading-tight editable-field"
                                contenteditable="true" @blur="updateField('medecin.titre', $event)"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'medecinTitre')"
                                @input="preventVueUpdate($event)">
                                {{ ordonnanceData.medecin.titre }}
                            </p>
                            <div class="text-[11px] text-gray-500 leading-snug mt-1">
                                <p class="font-bold text-medical-blue inline mr-3 editable-field" contenteditable="true"
                                    @blur="updateField('medecin.centre', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinCentre')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.medecin.centre }}
                                </p>
                                <span class="inline editable-field" contenteditable="true"
                                    @blur="updateField('medecin.adresse', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinAdresse')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.medecin.adresse }}
                                </span>
                                <p class="mt-[2px] editable-field" contenteditable="true"
                                    @blur="updateField('medecin.contact', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinContact')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.medecin.contact }}
                                </p>
                                <p class="mt-[2px] text-[9px] editable-field" contenteditable="true"
                                    @blur="updateField('medecin.immat', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'medecinImmat')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.medecin.immat }}
                                </p>
                            </div>
                        </div>

                        <div class="w-1/3 text-right pt-1">
                            <div class="text-sm text-medical-blue font-semibold leading-tight">
                                <span class="editable-field" contenteditable="true"
                                    @blur="updateField('cabinet.ville', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'cabinetVille')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.cabinet.ville }}
                                </span>, le
                            </div>
                            <div class="text-base font-bold text-gray-800 mt-[2px]">
                                <span class="date-editable editable-field" contenteditable="true"
                                    @blur="updateField('date', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'date')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.date }}
                                </span>
                            </div>
                            <div class="text-xs text-gray-500 mt-1 no-print">
                                Page {{ pageNumber }}/{{ totalExamensPages }}
                            </div>
                        </div>
                    </div>

                    <!-- Informations patient (uniquement sur la première page) -->
                    <div v-if="pageNumber === 1"
                        class="bg-medical-gray rounded-md p-2.5 mb-4 print:bg-transparent print:p-0 print:mb-3">
                        <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm items-end leading-snug">
                            <div class="min-w-[100px] flex items-baseline">
                                <span class="font-sans font-bold text-medical-blue inline-block text-xs">Nom :</span>
                                <span class="font-bold text-base patient-nom editable-field text-xs" contenteditable="true"
                                    @blur="updateField('patient.nom', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'patientNom')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.patient.nom }}
                                </span>
                            </div>
                            <div class="flex items-baseline">
                                <span class="font-sans font-bold text-medical-blue text-xs">Âge :</span>
                                <span class="patient-age editable-field text-xs" contenteditable="true"
                                    @blur="updateField('patient.age', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'patientAge')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.patient.age }}
                                </span>
                            </div>
                            <div class="flex items-baseline">
                                <span class="font-sans font-bold text-medical-blue text-xs">Dossier :</span>
                                <span class="patient-dossier editable-field text-xs" contenteditable="true"
                                    @blur="updateField('patient.dossier', $event)" @keydown.enter="saveAndBlur($event)"
                                    @focus="handleFocus($event, 'patientDossier')" @input="preventVueUpdate($event)">
                                    {{ ordonnanceData.patient.dossier }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Section Examens -->
                    <div class="mb-3 mt-4">
                        <h2
                            class="font-sans text-base font-bold text-medical-blue border-b border-gray-300 mb-3 pb-0.5">
                            Examens Prescrits
                        </h2>

                        <ul class="examen-counter">
                            <li v-for="(examen, index) in getExamensForPage(pageNumber)" :key="index"
                                class="examen-item relative group border-b border-gray-100 pb-2 print:border-none">
                                <div class="pl-6">
                                    <div class="flex justify-between items-baseline">
                                        <strong
                                            class="text-medical-blue font-bold text-xs block leading-tight editable-field"
                                            contenteditable="true"
                                            @blur="(e) => updateExamenField(examen.originalIndex, 'nom', e)"
                                            @keydown.enter="saveAndBlur($event)"
                                            @focus="(e) => handleExamenFocus(e, examen.originalIndex, 'nom')"
                                            @input="preventVueUpdate($event)">
                                            {{ examen.nom }}
                                        </strong>
                                        <button @click="removeExamen(examen.originalIndex)"
                                            class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            ×
                                        </button>
                                    </div>
                                    <div class="examen-info text-xs text-gray-700 ml-2 space-y-0.5 leading-snug">
                                        <div class="flex items-baseline">
                                            <span class="w-2 h-1 bg-gray-300 rounded-full mr-1.5 print:hidden"></span>
                                            <span class="flex-1 editable-field" contenteditable="true"
                                                @blur="(e) => updateExamenField(examen.originalIndex, 'description', e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleExamenFocus(e, examen.originalIndex, 'description')"
                                                @input="preventVueUpdate($event)">
                                                {{ examen.description }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div v-if="pageNumber === totalExamensPages" class="mt-3 no-print">
                            <button @click="addExamen"
                                class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">
                                <span class="text-lg mr-1 leading-none">+</span> Ajouter un examen
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Signature -->
                <div class="mt-8 pt-3 border-t border-gray-200 text-right">
                    <p class="text-xs italic text-gray-500 mb-1">Signature & Cachet</p>
                    <div class="inline-block w-40 h-14 border border-gray-300 rounded print:border-none"></div>
                </div>
            </div>
        </div>

        <!-- Pagination en bas (fixe) -->
        <div v-if="activeTab === 'medicaments' && totalMedicamentsPages > 1"
            class="fixed bottom-4 left-1/2 transform -translate-x-1/2 no-print z-40">
            <div class="flex items-center gap-4 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-200">
                <button @click="prevPage('medicaments')" :disabled="currentMedicamentsPage === 1"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="ri-arrow-left-line"></i>
                </button>
                <span class="font-medium text-gray-700 min-w-[100px] text-center">
                    Page {{ currentMedicamentsPage }} / {{ totalMedicamentsPages }}
                </span>
                <button @click="nextPage('medicaments')" :disabled="currentMedicamentsPage === totalMedicamentsPages"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="ri-arrow-right-line"></i>
                </button>
            </div>
        </div>

        <div v-if="activeTab === 'examens' && totalExamensPages > 1"
            class="fixed bottom-4 left-1/2 transform -translate-x-1/2 no-print z-40">
            <div class="flex items-center gap-4 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-200">
                <button @click="prevPage('examens')" :disabled="currentExamensPage === 1"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="ri-arrow-left-line"></i>
                </button>
                <span class="font-medium text-gray-700 min-w-[100px] text-center">
                    Page {{ currentExamensPage }} / {{ totalExamensPages }}
                </span>
                <button @click="nextPage('examens')" :disabled="currentExamensPage === totalExamensPages"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="ri-arrow-right-line"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { useConsultationStore } from '../stores/index.js';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export default {
    name: 'OrdonnanceA5',
    setup() {
        const route = useRoute();
        const router = useRouter()
        const consultationsStore = useConsultationStore();
        const loader = ref(false);

        // Variables pour les onglets et pagination
        const activeTab = ref('medicaments');
        const currentMedicamentsPage = ref(1);
        const currentExamensPage = ref(1);
        const itemsPerPage = 10;

        const smartBack = () => {
            if (window.history.length > 1) {
                router.back()
            } else {
                router.push({ name: 'patients' })
            }
        }

        // Stocker les valeurs originales pour éviter les conflits
        const editingValues = ref({});

        // Données par défaut de l'ordonnance
        const defaultOrdonnanceData = {
            date: new Date().toLocaleDateString('fr-FR'),
            cabinet: {
                ville: "Tsiroanomandidy",
            },
            medecin: {
                nom: "Dr. RASOANAIJO Malalaniaina",
                titre: "Médecin Généraliste",
                centre: "CENTRE MÉDICAL VONJY AINA",
                adresse: "3TH3 Tsarahonena, Tsiroanomandidy",
                contact: "033 24 427 30 – 034 06 015 13",
                immat: "NIF: 30024 555 38 / STAT: 65201 14 2016 0 00199"
            },
            patient: {
                nom: "",
                age: "",
                mois: "",
                dossier: ""
            },
            traitements: [],
            examens: [],
            instructions: [
                "Prochain rendez-vous : "
            ]
        };

        // Données réactives de l'ordonnance
        const ordonnanceData = ref(JSON.parse(JSON.stringify(defaultOrdonnanceData)));

        // Computed pour la pagination des médicaments
        const totalMedicamentsPages = computed(() => {
            const pages = Math.ceil(ordonnanceData.value.traitements.length / itemsPerPage);
            return pages || 1; // Toujours au moins 1 page
        });

        const displayedMedicamentsPages = computed(() => {
            // Ajuster la page courante si elle est hors limites
            if (currentMedicamentsPage.value > totalMedicamentsPages.value) {
                currentMedicamentsPage.value = totalMedicamentsPages.value;
            }
            return Array.from({ length: totalMedicamentsPages.value }, (_, i) => i + 1);
        });

        const getMedicamentsForPage = (page) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return ordonnanceData.value.traitements.slice(start, end).map((item, index) => ({
                ...item,
                originalIndex: start + index
            }));
        };

        // Computed pour la pagination des examens
        const totalExamensPages = computed(() => {
            const pages = Math.ceil(ordonnanceData.value.examens.length / itemsPerPage);
            return pages || 1; // Toujours au moins 1 page
        });

        const displayedExamensPages = computed(() => {
            // Ajuster la page courante si elle est hors limites
            if (currentExamensPage.value > totalExamensPages.value) {
                currentExamensPage.value = totalExamensPages.value;
            }
            return Array.from({ length: totalExamensPages.value }, (_, i) => i + 1);
        });

        const getExamensForPage = (page) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return ordonnanceData.value.examens.slice(start, end).map((item, index) => ({
                ...item,
                originalIndex: start + index
            }));
        };

        // Navigation de pagination
        const prevPage = (tab) => {
            if (tab === 'medicaments' && currentMedicamentsPage.value > 1) {
                currentMedicamentsPage.value--;
            } else if (tab === 'examens' && currentExamensPage.value > 1) {
                currentExamensPage.value--;
            }
        };

        const nextPage = (tab) => {
            if (tab === 'medicaments' && currentMedicamentsPage.value < totalMedicamentsPages.value) {
                currentMedicamentsPage.value++;
            } else if (tab === 'examens' && currentExamensPage.value < totalExamensPages.value) {
                currentExamensPage.value++;
            }
        };

        // Charger les données de consultation
        const loadConsultation = async (consultationId) => {
            try {
                loader.value = true;
                await consultationsStore.fetchConsultation(consultationId);

                if (consultationsStore.consultation) {
                    // Mettre à jour les données patient
                    ordonnanceData.value.patient.nom = consultationsStore.consultation.field_client?.title || "";
                    ordonnanceData.value.patient.dossier = consultationsStore.consultation.nid || "";

                    // Formater la date de création
                    if (consultationsStore.consultation.created) {
                        const date = new Date(parseInt(consultationsStore.consultation.created) * 1000);
                        ordonnanceData.value.date = date.toLocaleDateString('fr-FR');
                    }

                    // Convertir les médicaments de la consultation
                    if (consultationsStore.consultation.field_medicaments?.length > 0) {
                        ordonnanceData.value.traitements = consultationsStore.consultation.field_medicaments.map(med => ({
                            nom: med.field_articles?.title || "Médicament",
                            posologie: "Posologie et Durée à définir",
                            duree: "Durée à definir"
                        }));
                    }

                    // Convertir les examens de la consultation
                    if (consultationsStore.consultation.field_examens?.length > 0) {
                        ordonnanceData.value.examens = consultationsStore.consultation.field_examens.map(ex => ({
                            nom: ex.field_examen?.title || "Examen",
                            description: `Inscriptions a suivre`
                        }));
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement:", error);
                toast.error("Une erreur est survenue lors du chargement des données.");
            } finally {
                loader.value = false;
            }
        };

        // Empêcher Vue de mettre à jour pendant l'édition
        function preventVueUpdate(event) {
            // Ne rien faire - laisser le DOM gérer l'édition
        }

        // Gérer le focus - sauvegarder la valeur actuelle
        function handleFocus(event, fieldName) {
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Gérer le focus pour les traitements
        function handleTraitementFocus(event, index, fieldType) {
            const fieldName = `traitement_${index}_${fieldType}`;
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Gérer le focus pour les examens
        function handleExamenFocus(event, index, fieldType) {
            const fieldName = `examen_${index}_${fieldType}`;
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Gérer le focus pour les instructions
        function handleInstructionFocus(event, index) {
            const fieldName = `instruction_${index}`;
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Sélectionner tout le texte dans un élément
        function selectAllText(element) {
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Sauvegarder et perdre le focus
        function saveAndBlur(event) {
            event.preventDefault();
            event.target.blur();
        }

        // Mettre à jour un champ simple
        function updateField(path, event) {
            const newValue = event.target.textContent.trim();
            const keys = path.split('.');
            let obj = ordonnanceData.value;

            const fieldName = keys.join('_');
            if (newValue === editingValues.value[fieldName]) {
                return;
            }

            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }

            obj[keys[keys.length - 1]] = newValue;
        }

        // Mettre à jour un traitement
        function updateTraitementField(index, field, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `traitement_${index}_${field}`;

            if (newValue === editingValues.value[oldValueKey]) {
                return;
            }

            if (ordonnanceData.value.traitements[index]) {
                ordonnanceData.value.traitements[index][field] = newValue;
            }
        }

        // Mettre à jour un examen
        function updateExamenField(index, field, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `examen_${index}_${field}`;

            if (newValue === editingValues.value[oldValueKey]) {
                return;
            }

            if (ordonnanceData.value.examens[index]) {
                ordonnanceData.value.examens[index][field] = newValue;
            }
        }

        // Mettre à jour une instruction
        function updateInstruction(index, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `instruction_${index}`;

            if (newValue === editingValues.value[oldValueKey]) {
                return;
            }

            if (ordonnanceData.value.instructions[index]) {
                ordonnanceData.value.instructions[index] = newValue;
            }
        }

        // Ajouter un nouveau traitement
        function addTraitement() {
            ordonnanceData.value.traitements.push({
                nom: "Nouveau Médicament",
                posologie: "Posologie et Durée à définir",
                duree: "Durée..."
            });
        }

        // Supprimer un traitement
        function removeTraitement(index) {
            ordonnanceData.value.traitements.splice(index, 1);

            // Ajuster la page courante si nécessaire
            if (currentMedicamentsPage.value > totalMedicamentsPages.value) {
                currentMedicamentsPage.value = totalMedicamentsPages.value;
            }
        }

        // Ajouter un nouvel examen
        function addExamen() {
            ordonnanceData.value.examens.push({
                nom: "Nouvel Examen",
                description: "Description de l'examen..."
            });
        }

        // Supprimer un examen
        function removeExamen(index) {
            ordonnanceData.value.examens.splice(index, 1);

            // Ajuster la page courante si nécessaire
            if (currentExamensPage.value > totalExamensPages.value) {
                currentExamensPage.value = totalExamensPages.value;
            }
        }

        // Imprimer l'ordonnance
        function printOrdonnance() {
            // Afficher toutes les pages pour l'impression
            window.print();
        }

        onMounted(async () => {
            const consultationId = route.query.key;

            // Récupérer la sauvegarde locale si elle existe
            const saved = localStorage.getItem('ordonnance_sauvegarde');
            if (saved) {
                try {
                    ordonnanceData.value = JSON.parse(saved);
                } catch (e) {
                    console.error("Erreur de parsing de la sauvegarde:", e);
                }
            }

            if (consultationId) {
                await loadConsultation(consultationId);
            }
        });

        // Sauvegarder automatiquement les modifications
        watch(ordonnanceData, (newValue) => {
            localStorage.setItem('ordonnance_autosave', JSON.stringify(newValue));
        }, { deep: true });

        return {
            loadConsultation,
            consultationsStore,
            ordonnanceData,
            addTraitement,
            removeTraitement,
            addExamen,
            removeExamen,
            printOrdonnance,
            // Onglets et pagination
            activeTab,
            currentMedicamentsPage,
            currentExamensPage,
            totalMedicamentsPages,
            totalExamensPages,
            displayedMedicamentsPages,
            displayedExamensPages,
            getMedicamentsForPage,
            getExamensForPage,
            prevPage,
            nextPage,
            // Fonctions d'édition
            updateField,
            updateTraitementField,
            updateExamenField,
            updateInstruction,
            saveAndBlur,
            handleFocus,
            handleTraitementFocus,
            handleExamenFocus,
            handleInstructionFocus,
            preventVueUpdate,
            smartBack
        };
    }
};
</script>

<style scoped>
/* Styles CSS inchangés - exactement les mêmes qu'avant */
@page {
    size: A5;
    margin: 0;
}

body {
    background-color: #e5e7eb;
}

.sheet-a5 {
    width: 148mm;
    min-height: 210mm;
    margin: 20px auto;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.editable-field {
    outline: none;
    min-width: 20px;
    display: inline-block;
    padding: 0 2px;
    cursor: text;
    border-bottom: 1px dashed transparent;
    transition: all 0.2s ease;
}

.editable-field[contenteditable="true"]:hover {
    border-bottom: 1px dashed #9ca3af;
    background-color: #f8fafc;
}

.editable-field[contenteditable="true"]:focus {
    border-bottom: 1px solid #0A346C;
    background-color: #f0f9ff;
    outline: none;
}

.editable-field:focus {
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
}

.med-counter {
    counter-reset: med-counter;
}

.med-item {
    counter-increment: med-counter;
}

.examen-counter {
    counter-reset: examen-counter;
}

.examen-item {
    counter-increment: examen-counter;
}

.med-item::before {
    content: counter(med-counter) ".";
    position: absolute;
    left: 0.5rem;
    color: #0A346C;
    font-weight: bold;
    font-size: 0.9em;
    padding-top: 0.28rem;
}

.examen-item::before {
    content: counter(examen-counter) ".";
    position: absolute;
    left: 0.5rem;
    color: #0A346C;
    font-weight: bold;
    font-size: 0.9em;
    padding-top: 0.28rem;
}

@media print {

    html,
    body {
        width: 148mm;
        height: 200mm;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
    }

    .sheet-a5 {
        width: 148mm !important;
        max-height: 200mm !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
        page-break-after: avoid !important;
    }

    .sheet-a5 * {
        line-height: 1.25 !important;
    }

    .no-print {
        display: none !important;
    }

    .editable-field {
        border-bottom: none !important;
        background-color: transparent !important;
    }

    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .print-colors-fix .text-medical-blue,
    .f-header {
        color: #0A346C !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    .print-colors-fix .text-medical-red {
        color: #CC0000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    button {
        display: none !important;
    }

    /* MODIFICATION CRITIQUE: Comme dans la facture */
    /* Masquer les pages avec la classe .hidden */
    .sheet-a5.hidden {
        display: none !important;
    }

    /* Afficher uniquement la page sans .hidden (la page active) */
    .sheet-a5:not(.hidden) {
        display: block !important;
        page-break-after: avoid !important;
        margin: 0 auto !important;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.med-item,
.examen-item,
.instruction-item {
    animation: fadeIn 0.3s ease-out;
}

button[class*="Ajouter"] {
    transition: all 0.2s ease;
}

button[class*="Ajouter"]:hover {
    transform: translateY(-1px);
}

.patient-nom {
    min-width: 200px;
}

.patient-age,
.patient-dossier {
    min-width: 60px;
}

.date-editable {
    min-width: 100px;
}

.instruction-item {
    position: relative;
    padding-right: 20px;
}

.instruction-text {
    min-width: 300px;
}

.text-medical-red.font-bold,
.text-medical-blue.font-bold {
    display: inline-block;
    width: 100%;
}

/* Nouveaux styles pour les onglets et pagination */
.hidden {
    display: none;
}

/* Styles pour les onglets */
.tab-button {
    transition: all 0.2s ease;
}

.tab-button:hover:not(.active) {
    background-color: #f8fafc;
}
</style>

<style>
/* Styles globaux inchangés */
.font-serif {
    font-family: 'Times New Roman', Times, serif;
}

.font-sans {
    font-family: Helvetica, Arial, sans-serif;
}

.text-medical-blue {
    color: #0A346C;
}

.text-medical-red {
    color: #CC0000;
}

.bg-medical-blue {
    background-color: #0A346C;
}

.bg-medical-red {
    background-color: #CC0000;
}

.bg-medical-gray {
    background-color: #F3F4F6;
}

.border-medical-blue {
    border-color: #0A346C;
}

@media print {
    .list-disc li::before {
        content: "•";
        color: #374151;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
    }

    /* S'assurer que les couleurs s'impriment correctement */
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }
}

[contenteditable] {
    unicode-bidi: plaintext;
    direction: ltr;
    text-align: left;
}

.editable-field br {
    display: none;
}
</style>
