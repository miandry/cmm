<template>
    <div class="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        <PageLoader v-if="loader" />
        <div class="flex-1 p-3 order-2 lg:order-1 flex flex-col">
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Consultation en cours</h3>
                <!-- consulatation form -->
                <div v-if="userStore.users.rows.length"
                    class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="ri-user-heart-line text-green-600"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">Dr. {{ userStore.users.rows[0].name }}</div>
                            <div class="text-sm text-gray-600 capitalize">{{
                                userStore.users.rows[0].field_specialite.title }}</div>
                        </div>
                    </div>
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <GeneralForm ref="generalFormRef" :canChange="canChange" />
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
            <!-- For mobile device -->
            <div class="flex-1 p-3 flex flex-col justify-end lg:hidden">
                <div class="space-y-2">
                    <button @click="handleConsultationSubmit(false)"
                        class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-sm cursor-pointer">
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-save-line"></i>
                        </div>
                        <span>Sauvegarder en brouillon</span>
                    </button>
                    <!--  v-if="canFinalizeConsultation" -->
                    <button @click="handleConsultationSubmit(true)"
                        class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap cursor-pointer">
                        Finaliser la consultation
                    </button>
                </div>
            </div>

            <Historique @openHistory="openHistory" @loadLastconsultation="loadLastconsultation"
                class="block lg:hidden" />
        </div>
        <!-- patient & historique -->
        <div
            class="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col order-1 lg:order-2 h-full">
            <!-- Patient actuelle -->
            <Patient :canChange="canChange" class="hidden lg:block" />
            <Historique @openHistory="openHistory" @loadLastconsultation="loadLastconsultation"
                class="hidden lg:block" />
            <!-- History modal -->
            <AllHistory v-if="isHistoryModalOpen" @closeHistory="closeHistory" :clientId="clientId" />

            <div class="hidden flex-1 p-3 lg:flex flex-col justify-end">
                <div class="space-y-2">
                    <button @click="handleConsultationSubmit(false)"
                        class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-sm cursor-pointer">
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-save-line"></i>
                        </div>
                        <span>Sauvegarder en brouillon</span>
                    </button>
                    <!--  v-if="canFinalizeConsultation" -->
                    <button @click="handleConsultationSubmit(true)"
                        class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap cursor-pointer">
                        Finaliser la consultation
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
import { useAppointmentStore, useClientStore, useConsultationStore, useExamenStore, useInvoiceStore, useOrderStore, useUserStore } from '../stores/index.js';
import PageLoader from '../components/PageLoader.vue'
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'
import AllHistory from '../components/Consultations/AllHistory.vue'
import { saveCompleteConsultation } from '../services/clinic.js'

export default {
    name: 'Consultations',
    components: {
        GeneralForm,
        ExamenClinique,
        PrescriptionEtSuivi,
        Patient,
        Historique,
        PageLoader,
        AllHistory
    },
    setup() {
        const prescriptionEtSuivi = ref(null);
        const consultationsStore = useConsultationStore();
        const examenStore = useExamenStore();
        const orderStore = useOrderStore();
        const invoiceStore = useInvoiceStore();
        const generalFormRef = ref(null);
        const examenCliniqueRef = ref(null);
        const patienStore = useClientStore();
        const appointmentStore = useAppointmentStore()
        const userStore = useUserStore();
        const router = useRouter();
        const route = useRoute();
        const canChange = ref(true);
        const isEditMode = computed(() => !!route.params.id);
        const loader = ref(false);
        const clientId = ref(null);
        const rdvId = ref(null);
        const isHistoryModalOpen = ref(false)
        const consultationReference = ref(null);

        const handleConsultationSubmit = async (withOrder) => {
            try {

                // Vérification que l'utilisateur connecté est un docteur
                const userRoles = window.APP_DATA?.roles || [];
                const isDoctor = userRoles.includes('docteur');

                if (!isDoctor) {
                    toast.error("Seul un docteur peut créer ou modifier une consultation !");
                    return;
                }

                loader.value = true

                let consultationStatus = withOrder ? "completed" : "draft"

                if (isEditMode.value) {
                    consultationStatus = withOrder ? "completed" : consultationsStore.consultation?.field_consultation_status
                }

                let lastConsultationStatus = withOrder ? "1" : "0"
                // data variable
                const generalFormData = generalFormRef.value.getGeneralFormData();
                const prescriptionEtSuiviData = prescriptionEtSuivi.value.stockTabData()
                // prescriptionEtSuiviData
                const medicamentsData = prescriptionEtSuiviData.medication;
                const recommandationData = prescriptionEtSuiviData.recommandation;
                const suiviData = prescriptionEtSuiviData.suivi;
                let totalMedicament = 0;
                let totalExamen = 0;

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
                        field_quantite: item.quantity,
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
                const hasExamens = allExamens?.length > 0;
                const hasMedications = allMedications?.length > 0;

                const consulatationGlobalData = {
                    entity_type: "node",
                    bundle: "consultations",
                    title: "consult-" + Date.now(),
                    status: 1,
                    field_docteur: window.APP_DATA.user.id,
                    field_client: patienStore.client.nid,
                    field_rendez_vous: parseInt(rdvId.value) || null,
                    // generalFormData
                    field_motif: generalFormData.consultationMotif,
                    field_temperature: generalFormData.temperature,
                    field_tension_arterielle: generalFormData.tension,
                    field_poids: generalFormData.poids,
                    field_montant: generalFormData.montant,

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
                    field_consultation_status: consultationStatus,
                }

                // Ajouter seulement si NON vide
                if (allMedications && allMedications.length > 0) {
                    consulatationGlobalData.field_medicaments = allMedications;
                    consulatationGlobalData.field_prix_total_medicaments = consultationsStore.savedMedication.total;
                    totalMedicament = parseFloat(consultationsStore.savedMedication.total);
                }

                // Ajouter seulement si NON vide
                if (allExamens && allExamens.length > 0) {
                    consulatationGlobalData.field_examens = allExamens;
                    consulatationGlobalData.field_prix_total_examens = examenStore.savedExamen.total;
                    totalExamen = parseFloat(examenStore.savedExamen.total);
                }
                let msg = "";
                if (isEditMode.value) {
                    consulatationGlobalData.nid = consultationsStore.consultation.nid;
                    msg = "Modification enregistré!"
                } else {
                    delete consulatationGlobalData.nid;
                    msg = "Consultation enregistré!"
                }

                // Préparer les données pour l'API groupée
                const completeConsultationData = {
                    consultation: consulatationGlobalData,
                    appointment: {
                        entity_type: "node",
                        bundle: "rendez_vous_medical",
                        nid: parseInt(rdvId.value) || consultationsStore.consultation.field_rendez_vous?.nid,
                        field_temperature: generalFormData.temperature,
                        field_tension_arterielle: generalFormData.tension,
                        field_poids: generalFormData.poids,
                    },
                    patient: {
                        entity_type: "node",
                        bundle: "client",
                        status: 1,
                        nid: parseInt(patienStore.client.nid),
                        field_consultation: null, // Sera rempli après création de la consultation
                        field_last_consultation_status: lastConsultationStatus,
                    },
                };

                // Ajouter la commande et facture si finalisation
                if (withOrder && (hasExamens || hasMedications)) {
                    const formatDateUS = () => {
                        const now = new Date();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const year = now.getFullYear();
                        return `${year}-${month}-${day}`;
                    };

                    let allArticles = null;
                    if (allMedications && allMedications.length > 0) {
                        allArticles = allMedications.map(item => ({
                            entity_type: "paragraph",
                            bundle: "commande",
                            field_article: item.field_articles,
                            field_quantite: item.field_quantite,
                            field_prix_d_achat: item.field_prix,
                            field_prix_unitaire: item.field_prix,
                        }));
                    }

                    completeConsultationData.order = {
                        entity_type: "node",
                        bundle: "commande",
                        title: "cmd-" + Date.now(),
                        field_client: patienStore.client.nid,
                        clientName: patienStore.client.title,
                        field_total_vente: totalExamen + totalMedicament,
                        field_articles: allArticles || [],
                        field_examens_order: allExamens || [],
                        field_date: formatDateUS(),
                        status: 1,
                        field_status: "payed",
                        field_type: "consultation",
                    };

                    completeConsultationData.invoice = {
                        entity_type: "node",
                        bundle: "facture",
                        status: 1,
                        title: `facture-${Date.now()}`,
                        field_articles_commande: allArticles || [],
                        field_examens_dans_commande: allExamens || [],
                        field_total_vente: totalExamen + totalMedicament,
                        field_patient_dossier: completeConsultationData.consultation.title,
                        field_patient_nom: patienStore.client.title,
                        field_reference_facture: completeConsultationData.consultation.title,
                        field_patient_age: patienStore.client.field_age || '',
                        field_tva_facture: 20,
                        field_type: 'consultation',
                        field_status_invoice: 0,
                        field_montant_cons: userStore.users.rows[0].field_specialite.field_montant_consultation || generalFormData.montant,
                        field_date_facture: new Date().toLocaleDateString('en-En'),
                        field_mode_paiement: 'Espèces / Chèque',
                    };
                }

                // Nettoyage en mode édition
                if (consultationReference.value) {
                    completeConsultationData.cleanup = {
                        old_consultation_id: consultationReference.value,
                    };
                    
                    // Récupérer l'ancienne commande si elle existe
                    await orderStore.fetchOrders({
                        fields: [
                            'nid',
                            'title',
                            'field_consultation_nid'
                        ],
                        filters: {
                            field_consultation_nid: {
                                val: consultationReference.value,
                                op: '=',
                            },
                            status: {
                                val: 1,
                                op: "="
                            }
                        }
                    });
                    
                    if (orderStore.orders.rows[0]?.nid) {
                        completeConsultationData.cleanup.old_order_id = orderStore.orders.rows[0].nid;
                    }
                }

                // Appel unique à l'API groupée
                const response = await saveCompleteConsultation(completeConsultationData);

                if (!response?.data?.status) {
                    toast.error("Une erreur est survenue lors de l'enregistrement.")
                    return
                }

                const consultationId = parseInt(response.data.consultation_id);

                toast.success(msg)
                generalFormRef.value.resetForm();
                prescriptionEtSuivi.value.resetAll();
                patienStore.resetClient();

                router.push({
                    name: 'consultation.details',
                    query: {
                        id: consultationId
                    }
                });

                
            } catch (error) {
                toast.error("Une erreur est survenue lors de l'enregistrement.")
            } finally {
                loader.value = false;
            }

        }

        const loadConsultationForEdit = async (consultationId) => {
            try {
                loader.value = true;
                await consultationsStore.fetchConsultation(consultationId);
                // Charger le patient
                await patienStore.fetchClient(consultationsStore.consultation.field_client.nid);

                // Remplir le formulaire général
                await nextTick();
                generalFormRef.value?.setFormData(consultationsStore.consultation);

                // Remplir prescription / suivi
                prescriptionEtSuivi.value?.setData(consultationsStore.consultation);
            } catch (error) {
                toast.error("Une erreur est survenue lors de la chargement des données.")
            } finally {
                loader.value = false;
            }
        };

        const canFinalizeConsultation = computed(() => {
            const hasMedications =
                consultationsStore.savedMedication?.items?.length > 0;

            const hasExamens =
                examenStore.savedExamen?.items?.length > 0;

            return hasMedications || hasExamens;
        });

        watch(
            () => route.params.id,
            async (newId) => {
                if (newId) {
                    await loadConsultationForEdit(newId);
                    canChange.value = false;
                } else {
                    generalFormRef.value.resetForm();
                    prescriptionEtSuivi.value.resetAll();
                    patienStore.resetClient();
                    canChange.value = true;
                }
            },
            { immediate: true }
        );

        onMounted(async () => {
            // Charger les données depuis localStorage
            const localConsultation = localStorage.getItem('currentConsultation');

            if (localConsultation) {
                const consultationToLoad = JSON.parse(localConsultation);
                loadLastconsultation(consultationToLoad);
            }

            // docteur
            const docteurId = window.APP_DATA.user.id;
            if (docteurId) {
                const doctorQueryOptions = {
                    fields: ['uid', 'name', 'field_specialite', 'status'],
                    filters: {
                        roles: { val: "docteur", op: "=" },
                        status: { val: 1, op: "=" },
                        uid: { val: docteurId, op: "=" },
                    },
                    values: {
                        field_specialite: ['nid', 'field_montant_consultation', 'title']
                    },
                    pager: 0,
                    offset: 1
                };
                await userStore.fetchUsers(doctorQueryOptions);
            }

            // rendez vous
            const appointmentId = route.query.appointment;
            if (appointmentId) {
                rdvId.value = appointmentId;
                await appointmentStore.fetchAppointment(appointmentId);
                await patienStore.fetchClient(appointmentStore.appointment.field_patient.nid);
            }


            // patient preselectionner et edit
            const clientId = route.query.client;
            if (clientId) {
                prescriptionEtSuivi.value.resetAll();
                consultationsStore.consultationsReset();
                await patienStore.fetchClient(clientId);
            }

            // reset form si c'est add
            if (!isEditMode.value && !clientId && !appointmentId) {
                prescriptionEtSuivi.value.resetAll();
                patienStore.resetClient()
                consultationsStore.consultationsReset();
            }
        });

        const openHistory = (cid) => {
            clientId.value = cid;
            isHistoryModalOpen.value = true
        }

        const loadLastconsultation = async (consultation) => {
            await patienStore.fetchClient(consultation.field_client.nid);
            generalFormRef.value?.setFormData(consultation);
            canChange.value = false;
            consultationReference.value = consultation.nid
        }

        const closeHistory = () => {
            isHistoryModalOpen.value = false
        }

        onBeforeUnmount(() => {
            localStorage.removeItem('currentConsultation');
        });

        return {
            patienStore,
            handleConsultationSubmit,
            prescriptionEtSuivi,
            generalFormRef,
            examenCliniqueRef,
            consultationsStore,
            examenStore,
            canFinalizeConsultation,
            isEditMode,
            canChange,
            loader,
            openHistory,
            loadLastconsultation,
            closeHistory,
            isHistoryModalOpen,
            clientId,
            consultationReference,
            userStore,
        };
    }
}
</script>
