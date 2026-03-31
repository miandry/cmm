<template>
    <main class="pt-20 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Welcome Section Updated with icon -->
            <div class="mb-8">
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">Assistant Clinique</h2>
                            <p class="text-gray-600">Bienvenue sur votre espace de gestion. Gérez les rendez-vous,
                                consultez les patients et suivez l'activité médicale en temps réel.</p>
                        </div>
                        <div class="text-right">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="ri-hospital-line text-2xl text-blue-600"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 hidden">
                <!-- Stats cards content -->
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <!-- Gestion rapide avec seulement le bouton Nouveau RDV -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-gray-900">Gestion rapide</h3>
                                <button @click="openAppointmentModal"
                                    class="px-4 py-2 bg-primary text-white rounded-button font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center gap-2">
                                    <i class="ri-add-line"></i> Nouveau RDV
                                </button>
                            </div>
                            <p class="text-gray-500 text-sm">Cliquez sur le bouton pour planifier un nouveau
                                rendez-vous.</p>
                        </div>
                    </div>

                    <AppointmentTable ref="appointmentTableRef" />

                </div>

                <!-- Right sidebar -->
                <Medecins />
            </div>
        </div>

        <!-- Modal for Add Appointment (avec lien pour ajouter patient) -->
        <CreateAppointment v-if="showAppointmentModal" @close-create-appointment="closeAppointmentModal"
            @open-patient="openPatientModal" @appointment-created="onAppointmentCreated" ref="createAppointmentRef" />

        <!-- Modal for Add Patient (au dessus de la modal RDV dans l'ordre d'affichage) -->
        <AddPatient v-if="showPatientModal" @close-patient="closePatientModal" @patient-created="onPatientCreated" />

    </main>
</template>

<script>
import { ref } from 'vue';
import AppointmentTable from '../components/assistBoard/AppointmentTable.vue';
import CreateAppointment from '../components/assistBoard/CreateAppointment.vue';
import AddPatient from '../components/assistBoard/AddPatient.vue';
import Medecins from '../components/assistBoard/Medecins.vue';

export default {
    name: "AssistBoard",
    components: {
        AppointmentTable,
        CreateAppointment,
        AddPatient,
        Medecins
    },
    setup() {
        const showAppointmentModal = ref(false);
        const showPatientModal = ref(false);
        const createAppointmentRef = ref(null);
        const appointmentTableRef = ref(null);

        const openAppointmentModal = () => {
            showAppointmentModal.value = true;
        };

        const closeAppointmentModal = () => {
            showAppointmentModal.value = false;
        };

        const openPatientModal = () => {
            showPatientModal.value = true;
        };

        const closePatientModal = () => {
            showPatientModal.value = false;
        };

        // Gérer la création du patient
        const onPatientCreated = (nouveauPatient) => {
            // Fermer la modal patient
            closePatientModal();

            // Sélectionner automatiquement le patient dans le composant rendez-vous
            if (createAppointmentRef.value && nouveauPatient) {
                createAppointmentRef.value.selectNewPatient(nouveauPatient);
            }
        };

        // Gérer la création du rendez-vous
        const onAppointmentCreated = () => {
            // Rafraîchir la table des rendez-vous
            if (appointmentTableRef.value) {
                appointmentTableRef.value.refreshAppointments();
            }
        };

        return {
            showAppointmentModal,
            showPatientModal,
            openAppointmentModal,
            closeAppointmentModal,
            openPatientModal,
            closePatientModal,
            onPatientCreated,
            onAppointmentCreated,
            createAppointmentRef,
            appointmentTableRef
        };
    }
}
</script>