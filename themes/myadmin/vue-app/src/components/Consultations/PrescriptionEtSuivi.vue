<template>
    <div>
        <div class="mb-4">
            <div class="flex space-x-2"> <!-- border-b border-gray-200 -->
                <button @click="setActiveTab('medications')" :class="['px-4 py-2 text-sm font-medium cursor-pointer border-b-2',
                    activeTab === 'medications' ? 'text-primary border-primary' : 'text-gray-600 hover:text-primary']">
                    Médicaments
                </button>

                <button @click="setActiveTab('recommendations')"
                    :class="['px-4 py-2 text-sm font-medium cursor-pointer border-b-2',
                        activeTab === 'recommendations' ? 'text-primary border-primary' : 'text-gray-600 hover:text-primary']">
                    Recommandations
                </button>

                <button @click="setActiveTab('followup')" :class="['px-4 py-2 text-sm font-medium cursor-pointer border-b-2',
                    activeTab === 'followup' ? 'text-primary border-primary' : 'text-gray-600 hover:text-primary']">
                    Suivi
                </button>
            </div>
        </div>
        <div v-show="activeTab === 'medications'" class="tab-content">
            <!-- MedicamentsModals -->
            <MedicamentsModals ref="medicationRef" />
        </div>
        <div v-show="activeTab === 'recommendations'" class="tab-content">
            <!-- Recommendations -->
            <RecommandationsModals  ref="recommandationRef"/>
        </div>
        <div v-show="activeTab === 'followup'" class="tab-content">
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prochaine
                            consultation</label>
                        <div class="relative">
                            <input type="date" v-model="form.suiviDate"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Type de suivi</label>
                        <select v-model="form.typeSuivi"
                            class="w-full px-3 py-2 pr-8 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option :value="''">Sélectionner le type</option>
                            <option :value="'Controle_de_routine'">Contrôle de routine</option>
                            <option :value="'Resultats_d_examens'">Résultats d'examens</option>
                            <option :value="'Suivi_evolution'">Suivi évolution</option>
                            <option :value="'Consultation_urgente_si_besoin'">Consultation urgente si besoin</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Objectifs du suivi</label>
                    <textarea rows="3" v-model="form.suiviObjectif"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Définissez les objectifs et points à surveiller lors du prochain rendez-vous..."></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, defineExpose, reactive } from 'vue';
import MedicamentsModals from './MedicamentsModals.vue';
import RecommandationsModals from './RecommandationsModals.vue';

export default {
    name: 'PrescriptionEtSuivi',
    components: {
        MedicamentsModals,
        RecommandationsModals,
    },
    setup() {
        const activeTab = ref('medications'); // tab actif par défaut
        const typeSuivi = ref('');
        const suiviObjectif = ref('');
        const suiviDate = ref('');
        const medicationRef = ref(null)
        const recommandationRef = ref(null);
        const form = reactive ({
            suiviDate: '',
            typeSuivi: '',
            suiviObjectif: '',
        })
        const setActiveTab = (tab) => {
            activeTab.value = tab;
        };


        function stockTabData() {
            return {
                medication: medicationRef.value.getMedicationData(),
                recommandation: recommandationRef.value.getRecommandationData(),
                suivi: { ...form }
            }
        }

        function resetAll() {
            medicationRef.value.resetAll();
            recommandationRef.value.resetAll();
            form.suiviDate = '';
            form.typeSuivi = '';
            form.suiviObjectif = '';
        }

        defineExpose({
            stockTabData,
            resetAll,
        })

        return {
            form,
            activeTab,
            setActiveTab,
            typeSuivi,
            suiviObjectif,
            suiviDate,
            medicationRef,
            stockTabData,
            recommandationRef,
            resetAll
            
        };
    },
};
</script>

<style></style>