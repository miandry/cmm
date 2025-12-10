<template>
    <div class="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        <PageLoader v-if="clientStore.loading || consultationsStore.loading" />
        <div class="flex-1 p-3 order-2 lg:order-1 flex flex-col">
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Consultation en cours</h3>
                <!-- consulatation form -->
                <GeneralForm ref="generalFormRef" />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4 hidden">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Examen clinique</h3>
                <!-- examen clinique -->
                <ExamenClinique ref="examenCliniqueRef" class="hidden" />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Prescription et suivi</h3>
                <!-- Prescription et suivi -->
                <PrescriptionEtSuivi ref="prescriptionEtSuivi" />
            </div>
        </div>
        <!-- patient & historique -->
        <div
            class="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col order-1 lg:order-2 h-full">
            <!-- Patient actuelle -->
            <Patient />
            <Historique />
            <div class="flex-1 p-3 flex flex-col justify-end">
                <div class="space-y-2">
                    <button
                        class="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-sm cursor-pointer">
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-printer-line"></i>
                        </div>
                        <span>Imprimer ordonnance</span>
                    </button>
                    <button @click="handleConsultationSubmit"
                        class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-sm cursor-pointer">
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-save-line"></i>
                        </div>
                        <span>Sauvegarder consultation</span>
                    </button>
                    <button
                        class="w-full py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-sm cursor-pointer">
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-calendar-line"></i>
                        </div>
                        <span>Planifier suivi</span>
                    </button>
                    <button
                        class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap cursor-pointer">
                        Finaliser consultation
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GeneralForm from '../components/Consultations/GeneralForm.vue'
import ExamenClinique from '../components/Consultations/ExamenClinique.vue'
import Patient from '../components/Consultations/Patient.vue'
import PrescriptionEtSuivi from '../components/Consultations/PrescriptionEtSuivi.vue'
import Historique from '../components/Consultations/Historique.vue'
import { useClientStore, useConsultationStore, useExamenStore } from '../stores/index.js';
import PageLoader from '../components/PageLoader.vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export default {
    name: 'Consultations',
    components: {
        GeneralForm,
        ExamenClinique,
        PrescriptionEtSuivi,
        Patient,
        Historique,
        PageLoader
    },
    setup() {
        const clientStore = useClientStore();
        const prescriptionEtSuivi = ref(null);
        const consultationsStore = useConsultationStore();
        const examenStore = useExamenStore();
        const generalFormRef = ref(null);
        const examenCliniqueRef = ref(null);
        const patienStore = useClientStore();

        const handleConsultationSubmit = async () => {
            // data variable
            const generalFormData = generalFormRef.value.getGeneralFormData();
            const prescriptionEtSuiviData = prescriptionEtSuivi.value.stockTabData()
            // prescriptionEtSuiviData
            const medicamentsData = prescriptionEtSuiviData.medication;
            const recommandationData = prescriptionEtSuiviData.recommandation;
            const suiviData = prescriptionEtSuiviData.suivi;

            /** validation global */

            if (!patienStore.client.nid) {
                toast.error("Veuillez séléctionner un patient!")
                return;
            }  //done

            if (generalFormData.hasError) return;

            /** fin validation global */
            let allMedications = null;
            let allExamens = null;
            if (consultationsStore.savedMedication?.items?.length > 0) {
                allMedications = consultationsStore.savedMedication.items.map(item => ({
                    entity_type: "paragraph",
                    bundle: "consultation_medicaments",
                    field_articles: item.nid,
                    field_description: item.field_description,
                    field_prix: item.field_prix,
                }));
            }
            if (examenStore.savedExamen?.items?.length > 0) {
                allExamens = examenStore.savedExamen.items.map(item => ({
                    entity_type: "paragraph",
                    bundle: "examens",
                    field_examen: item.nid,
                    field_description: item.field_description,
                    field_prix: item.field_prix,
                    field_justification: item.field_justification,
                }));
            }

            const consulatationGlobalData = {
                entity_type: "node",
                bundle: "consultations",
                title: "consult-" + Date.now(),
                status: 1,
                field_client: patienStore.client.nid,
                // generalFormData
                field_motif: generalFormData.consultationMotif,
                field_temperature: generalFormData.temperature,
                field_tension_arterielle: generalFormData.tension,
                field_poids: generalFormData.poids,

                // medicaments
                field_instructions: medicamentsData.instructionGlobal,

                // recommandation
                field_conseils: recommandationData.conseil,
                field_precautions: recommandationData.precautions,
                field_signes_d_alerte: recommandationData.signes,

                // suividata
                field_prochaine_consultation: suiviData.suiviDate,
                field_type_de_suivi: suiviData.typeSuivi,
                field_objectifs_du_suivi: suiviData.suiviObjectif,
            }

            // Ajouter seulement si NON vide
            if (allMedications) {
                consulatationGlobalData.field_medicaments = allMedications;
                consulatationGlobalData.field_prix_total_medicaments = consultationsStore.savedMedication.total;
            }

            // Ajouter seulement si NON vide
            if (allExamens) {
                consulatationGlobalData.field_examens = allExamens;
                consulatationGlobalData.field_prix_total_examens = examenStore.savedExamen.total;
            }

            await consultationsStore.createConsultation(consulatationGlobalData);
            if (consultationsStore.error) {
                toast.error("Une erreur est survenue lors de l'enregistrement.")
                return
            }
            toast.success("Consultation enregistré!")
        }

        return {
            clientStore,
            handleConsultationSubmit,
            prescriptionEtSuivi,
            generalFormRef,
            examenCliniqueRef,
            consultationsStore
        };
    }
}
</script>
