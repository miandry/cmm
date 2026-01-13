<template>
    <div>
        <!-- Bouton d'impression -->
        <div class="fixed top-4 right-4 no-print z-50">
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

        <!-- Feuille A5 -->
        <div class="sheet-a5 p-5 relative flex flex-col justify-between" v-if="ordonnanceData">
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
                        <p class="text-sm font-medium text-gray-600 leading-tight editable-field" contenteditable="true"
                            @blur="updateField('medecin.titre', $event)" @keydown.enter="saveAndBlur($event)"
                            @focus="handleFocus($event, 'medecinTitre')" @input="preventVueUpdate($event)"
                            ref="medecinTitreField">
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
                                @focus="handleFocus($event, 'date')" @input="preventVueUpdate($event)" ref="dateField">
                                {{ ordonnanceData.date }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Informations patient -->
                <div class="bg-medical-gray rounded-md p-2.5 mb-4 print:bg-transparent print:p-0 print:mb-3">
                    <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm items-end leading-snug">
                        <div class="min-w-[100px] flex items-baseline">
                            <span class="font-sans font-bold text-medical-blue inline-block">Nom :</span>
                            <span class="font-bold text-base patient-nom editable-field" contenteditable="true"
                                @blur="updateField('patient.nom', $event)" @keydown.enter="saveAndBlur($event)"
                                @focus="handleFocus($event, 'patientNom')" @input="preventVueUpdate($event)"
                                ref="patientNomField">
                                {{ ordonnanceData.patient.nom }}
                            </span>
                        </div>
                        <div class="flex items-baseline">
                            <span class="font-sans font-bold text-medical-blue">Âge :</span>
                            <span class="patient-age editable-field" contenteditable="true"
                                @blur="updateField('patient.age', $event)" @keydown.enter="saveAndBlur($event)"
                                @focus="handleFocus($event, 'patientAge')" @input="preventVueUpdate($event)"
                                ref="patientAgeField">
                                {{ ordonnanceData.patient.age }}
                            </span>
                        </div>
                        <div class="flex items-baseline">
                            <span class="font-sans font-bold text-medical-blue">Dossier :</span>
                            <span class="patient-dossier editable-field" contenteditable="true"
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
                    <h2 v-if="ordonnanceData.traitements.length"
                        class="font-sans text-base font-bold text-medical-blue border-b border-gray-300 mb-3 pb-0.5">
                        Prescription
                    </h2>

                    <ul class="med-counter space-y-2.5">
                        <li v-for="(traitement, index) in ordonnanceData.traitements" :key="index"
                            class="med-item relative group border-b border-gray-100 pb-2 print:border-none">
                            <div class="pl-6">
                                <div class="flex justify-between items-baseline">
                                    <strong
                                        class="text-medical-red font-bold text-sm block leading-tight editable-field"
                                        contenteditable="true" @blur="(e) => updateTraitementField(index, 'nom', e)"
                                        @keydown.enter="saveAndBlur($event)"
                                        @focus="(e) => handleTraitementFocus(e, index, 'nom')"
                                        @input="preventVueUpdate($event)"
                                        :ref="el => setTraitementFieldRef(el, 'nom', index)">
                                        {{ traitement.nom }}
                                    </strong>
                                    <button @click="removeTraitement(index)"
                                        class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        ×
                                    </button>
                                </div>
                                <div class="dosage-info text-xs text-gray-700 ml-2 space-y-0.5 leading-snug">
                                    <div class="flex items-baseline">
                                        <span class="w-2 h-1 bg-gray-300 rounded-full mr-1.5 print:hidden"></span>
                                        <span class="flex-1 editable-field" contenteditable="true"
                                            @blur="(e) => updateTraitementField(index, 'posologie', e)"
                                            @keydown.enter="saveAndBlur($event)"
                                            @focus="(e) => handleTraitementFocus(e, index, 'posologie')"
                                            @input="preventVueUpdate($event)"
                                            :ref="el => setTraitementFieldRef(el, 'posologie', index)">
                                            {{ traitement.posologie }}
                                        </span>
                                    </div>
                                    <div class="flex items-baseline">
                                        <span class="w-2 h-1 bg-gray-300 rounded-full mr-1.5 print:hidden"></span>
                                        <span class="flex-1 text-gray-500 italic editable-field" contenteditable="true"
                                            @blur="(e) => updateTraitementField(index, 'duree', e)"
                                            @keydown.enter="saveAndBlur($event)"
                                            @focus="(e) => handleTraitementFocus(e, index, 'duree')"
                                            @input="preventVueUpdate($event)"
                                            :ref="el => setTraitementFieldRef(el, 'duree', index)">
                                            {{ traitement.duree }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div class="mt-3 no-print">
                        <button @click="addTraitement"
                            class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">
                            <span class="text-lg mr-1 leading-none">+</span> Ajouter un médicament
                        </button>
                    </div>
                </div>

                <!-- Section Examens -->
                <div class="mb-3 mt-4">
                    <h2 v-if="ordonnanceData.examens.length"
                        class="font-sans text-base font-bold text-medical-blue border-b border-gray-300 mb-3 pb-0.5">
                        Examens Prescrits
                    </h2>

                    <ul class="examen-counter space-y-2.5">
                        <li v-for="(examen, index) in ordonnanceData.examens" :key="index"
                            class="examen-item relative group border-b border-gray-100 pb-2 print:border-none">
                            <div class="pl-6">
                                <div class="flex justify-between items-baseline">
                                    <strong
                                        class="text-medical-blue font-bold text-sm block leading-tight editable-field"
                                        contenteditable="true" @blur="(e) => updateExamenField(index, 'nom', e)"
                                        @keydown.enter="saveAndBlur($event)"
                                        @focus="(e) => handleExamenFocus(e, index, 'nom')"
                                        @input="preventVueUpdate($event)"
                                        :ref="el => setExamenFieldRef(el, 'nom', index)">
                                        {{ examen.nom }}
                                    </strong>
                                    <button @click="removeExamen(index)"
                                        class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        ×
                                    </button>
                                </div>
                                <div class="examen-info text-xs text-gray-700 ml-2 space-y-0.5 leading-snug">
                                    <div class="flex items-baseline">
                                        <span class="w-2 h-1 bg-gray-300 rounded-full mr-1.5 print:hidden"></span>
                                        <span class="flex-1 editable-field" contenteditable="true"
                                            @blur="(e) => updateExamenField(index, 'description', e)"
                                            @keydown.enter="saveAndBlur($event)"
                                            @focus="(e) => handleExamenFocus(e, index, 'description')"
                                            @input="preventVueUpdate($event)"
                                            :ref="el => setExamenFieldRef(el, 'description', index)">
                                            {{ examen.description }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div class="mt-3 no-print">
                        <button @click="addExamen"
                            class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">
                            <span class="text-lg mr-1 leading-none">+</span> Ajouter un examen
                        </button>
                    </div>
                </div>

                <!-- Instructions & Rendez-vous -->
                <div class="mt-4 border-t border-dashed border-gray-300 pt-3">
                    <h3 class="font-sans text-xs font-bold text-medical-blue uppercase mb-1">
                        Instructions & Rendez-vous
                    </h3>
                    <ul id="instructions-list"
                        class="list-disc list-outside ml-4 text-sm text-gray-700 space-y-0.5 leading-snug">
                        <li v-for="(instruction, index) in ordonnanceData.instructions" :key="index"
                            class="instruction-item">
                            <span class="instruction-text editable-field" contenteditable="true"
                                @blur="(e) => updateInstruction(index, e)" @keydown.enter="saveAndBlur($event)"
                                @focus="(e) => handleInstructionFocus(e, index)" @input="preventVueUpdate($event)"
                                :ref="el => setInstructionFieldRef(el, index)">
                                {{ instruction }}
                            </span>
                            <button @click="removeInstruction(index)"
                                class="no-print text-red-400 hover:text-red-600 font-bold px-1 text-lg opacity-0 hover:opacity-100 transition-opacity ml-2">
                                ×
                            </button>
                        </li>
                    </ul>

                    <div class="mt-2 no-print">
                        <button @click="addInstruction"
                            class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 px-2 py-1 rounded transition-colors">
                            <span class="text-lg mr-1 leading-none">+</span> Ajouter une instruction
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

        <!-- Loading State -->
        <div v-else class="flex items-center justify-center h-64">
            <div class="text-center">
                <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="text-gray-500">Chargement de l'ordonnance...</p>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue';
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

        const smartBack = () => {
            if (window.history.length > 1) {
                router.back()
            } else {
                router.push({ name: 'patients' })
            }
        }

        // Stocker les valeurs originales pour éviter les conflits
        const editingValues = ref({});
        const traitementFields = ref([]);
        const examenFields = ref([]);
        const instructionFields = ref([]);

        // Références aux champs
        const medecinNomField = ref(null);
        const medecinTitreField = ref(null);
        const medecinCentreField = ref(null);
        const medecinAdresseField = ref(null);
        const medecinContactField = ref(null);
        const medecinImmatField = ref(null);
        const cabinetVilleField = ref(null);
        const dateField = ref(null);
        const patientNomField = ref(null);
        const patientAgeField = ref(null);
        const patientDossierField = ref(null);

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
                            posologie: "Posologie à définir",
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

        // Empêcher Vue de mettre à jour pendant l'édition (CRITIQUE)
        function preventVueUpdate(event) {
            // Ne rien faire - laisser le DOM gérer l'édition
            // On sauvegarde seulement au blur
        }

        // Gérer le focus - sauvegarder la valeur actuelle
        function handleFocus(event, fieldName) {
            // Stocker la valeur originale
            editingValues.value[fieldName] = event.target.textContent;

            // Sélectionner tout le texte pour faciliter l'édition
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

        // Fonction pour référencer les champs de traitements
        function setTraitementFieldRef(el, type, index) {
            if (!el) return;
            if (!traitementFields.value[index]) {
                traitementFields.value[index] = {};
            }
            traitementFields.value[index][type] = el;
        }

        // Fonction pour référencer les champs d'examens
        function setExamenFieldRef(el, type, index) {
            if (!el) return;
            if (!examenFields.value[index]) {
                examenFields.value[index] = {};
            }
            examenFields.value[index][type] = el;
        }

        // Fonction pour référencer les champs d'instructions
        function setInstructionFieldRef(el, index) {
            if (!el) return;
            instructionFields.value[index] = el;
        }

        // Mettre à jour un champ simple
        function updateField(path, event) {
            const newValue = event.target.textContent.trim();
            const keys = path.split('.');
            let obj = ordonnanceData.value;

            // Vérifier si la valeur a changé
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
                posologie: "Posologie...",
                duree: "Durée..."
            });

            // Focus sur le nouveau champ après ajout
            nextTick(() => {
                const lastIndex = ordonnanceData.value.traitements.length - 1;
                const field = traitementFields.value[lastIndex]?.nom;
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        }

        // Supprimer un traitement (SANS CONFIRM)
        function removeTraitement(index) {
            ordonnanceData.value.traitements.splice(index, 1);
            traitementFields.value.splice(index, 1);
        }

        // Ajouter un nouvel examen
        function addExamen() {
            ordonnanceData.value.examens.push({
                nom: "Nouvel Examen",
                description: "Description de l'examen..."
            });

            // Focus sur le nouveau champ après ajout
            nextTick(() => {
                const lastIndex = ordonnanceData.value.examens.length - 1;
                const field = examenFields.value[lastIndex]?.nom;
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        }

        // Supprimer un examen (SANS CONFIRM)
        function removeExamen(index) {
            ordonnanceData.value.examens.splice(index, 1);
            examenFields.value.splice(index, 1);
        }

        // Ajouter une nouvelle instruction
        function addInstruction() {
            ordonnanceData.value.instructions.push("Nouvelle instruction...");

            // Focus sur la nouvelle instruction après ajout
            nextTick(() => {
                const lastIndex = ordonnanceData.value.instructions.length - 1;
                const field = instructionFields.value[lastIndex];
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        }

        // Supprimer une instruction (SANS CONFIRM)
        function removeInstruction(index) {
            ordonnanceData.value.instructions.splice(index, 1);
            instructionFields.value.splice(index, 1);
        }

        // Imprimer l'ordonnance
        function printOrdonnance() {
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
            addInstruction,
            removeInstruction,
            printOrdonnance,
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
            setTraitementFieldRef,
            setExamenFieldRef,
            setInstructionFieldRef,
            // Références
            medecinNomField,
            medecinTitreField,
            medecinCentreField,
            medecinAdresseField,
            medecinContactField,
            medecinImmatField,
            cabinetVilleField,
            dateField,
            patientNomField,
            patientAgeField,
            patientDossierField,
            smartBack
        };
    }
};
</script>

<style scoped>
/* CSS Spécifique pour le format papier A5 */
@page {
    size: A5;
    margin: 0;
}

body {
    background-color: #e5e7eb;
}

/* La feuille A5 exacte */
.sheet-a5 {
    width: 148mm;
    min-height: 210mm;
    margin: 20px auto;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Comportement des champs éditables */
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

/* Empêcher la sélection multiple sur les champs éditables */
.editable-field:focus {
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
}

/* Numérotation automatique CSS */
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

/* Style des éléments de liste avec numérotation */
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

/* --- STYLES D'IMPRESSION CRITIQUES pour la compacité --- */
@media print {
    .sheet-a5 {
        /* Réduit la marge interne pour l'impression */
        padding: 8mm !important;
        margin: 0;
        box-shadow: none;
        border: none;
    }

    /* Réduit l'interligne générale pour compresser */
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

    /* Répétez pour toutes les couleurs */
    .print-colors-fix .text-medical-red {
        color: #CC0000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    /* Cacher les boutons de suppression */
    button {
        display: none !important;
    }
}

/* Animation pour les nouveaux éléments */
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

/* Style pour le bouton d'ajout */
button[class*="Ajouter"] {
    transition: all 0.2s ease;
}

button[class*="Ajouter"]:hover {
    transform: translateY(-1px);
}

/* Style pour les champs éditables du patient */
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

/* Style pour les instructions */
.instruction-item {
    position: relative;
    padding-right: 20px;
}

.instruction-text {
    min-width: 300px;
}

/* Style spécifique pour éviter l'inversion du texte */
.text-medical-red.font-bold,
.text-medical-blue.font-bold {
    display: inline-block;
    width: 100%;
}
</style>

<style>
/* Styles globaux ajoutés au document */
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

/* Style pour les listes dans l'impression */
@media print {
    .list-disc li::before {
        content: "•";
        color: #374151;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
    }
}

/* Correction pour éviter le RTL sur les champs éditables */
[contenteditable] {
    unicode-bidi: plaintext;
    direction: ltr;
    text-align: left;
}

/* Empêcher les sauts de ligne indésirables */
.editable-field br {
    display: none;
}
</style>