<template>
    <div class="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        <PageLoader v-if="clientStore.loading" />
        <div class="flex-1 p-3 order-2 lg:order-1 flex flex-col">
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Consultation en cours</h3>
                <!-- consulatation form -->
                <GeneralForm />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Examen clinique</h3>
                <!-- examen clinique -->
                <ExamenClinique />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Prescription et suivi</h3>
                <!-- Prescription et suivi -->
                <PrescriptionEtSuivi />
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
                    <button
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
import { useClientStore } from '../stores/index.js';
import PageLoader from '../components/PageLoader.vue'

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

        return {
            clientStore
        };
    }
}
</script>