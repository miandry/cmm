<template>
    <div>
        <div class="mb-4">
            <div class="flex space-x-2"> <!-- border-b border-gray-200 -->
                <button @click="setActiveTab('medications')" :class="['px-4 py-2 text-sm font-medium cursor-pointer border-b-2',
                    activeTab === 'medications' ? 'text-primary border-primary' : 'text-gray-600 hover:text-primary']">
                    Médicaments
                </button>

                <button @click="setActiveTab('recommendations')" :class="['px-4 py-2 text-sm font-medium cursor-pointer border-b-2',
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
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-medium text-gray-900">Liste des médicaments</h4>
                <button
                    class="px-3 py-2 bg-primary text-white !rounded-button text-sm font-medium whitespace-nowrap flex items-center space-x-2 cursor-pointer">
                    <div class="w-4 h-4 flex items-center justify-center">
                        <i class="ri-add-line"></i>
                    </div>
                    <span>Ajouter médicament</span>
                </button>
            </div>
            <div class="space-y-3 mb-4">
                <div class="flex items-center justify-between p-3 border border-gray-200 !rounded-button">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">Paracetamol 500mg</h4>
                        <p class="text-sm text-gray-600">3 fois par jour pendant 5 jours</p>
                    </div>
                    <button class="text-red-500 hover:text-red-700 cursor-pointer">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
                <div class="flex items-center justify-between p-3 border border-gray-200 !rounded-button">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">Ibuprofène 400mg</h4>
                        <p class="text-sm text-gray-600">2 fois par jour si douleur</p>
                    </div>
                    <button class="text-red-500 hover:text-red-700 cursor-pointer">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 mb-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Total médicaments:</span>
                    <span class="text-lg font-semibold text-primary">37 000
                        Ar</span>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Instructions pharmaceutiques</label>
                <textarea rows="3"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Instructions particulières pour la prise des médicaments..."></textarea>
            </div>
        </div>
        <div  v-show="activeTab === 'recommendations'" class="tab-content">
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-medium text-gray-900">Examens complémentaires prescrits</h4>
                <button
                    class="px-3 py-2 bg-primary text-white !rounded-button text-sm font-medium whitespace-nowrap flex items-center space-x-2 cursor-pointer">
                    <div class="w-4 h-4 flex items-center justify-center">
                        <i class="ri-add-line"></i>
                    </div>
                    <span>Prescrire examen</span>
                </button>
            </div>
            <div class="space-y-3 mb-4">
                <div class="flex items-center justify-between p-3 border border-gray-200 !rounded-button">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">Bilan sanguin complet</h4>
                        <p class="text-sm text-gray-600">NFS, VS, CRP - À jeun</p>
                    </div>
                    <button class="text-red-500 hover:text-red-700 cursor-pointer">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
                <div class="flex items-center justify-between p-3 border border-gray-200 !rounded-button">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">Radiographie thoracique</h4>
                        <p class="text-sm text-gray-600">Face et profil - Urgent</p>
                    </div>
                    <button class="text-red-500 hover:text-red-700 cursor-pointer">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 mb-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Total examens:</span>
                    <span class="text-lg font-semibold text-primary">400 000 Ar</span>
                </div>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Conseils
                        hygiéno-diététiques</label>
                    <textarea rows="3"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Conseils sur l'alimentation, l'hygiène de vie, l'activité physique..."></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Précautions
                            particulières</label>
                        <textarea rows="3"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Précautions à prendre..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Signes d'alerte</label>
                        <textarea rows="3"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Signes nécessitant une consultation urgente..."></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="activeTab === 'followup'" class="tab-content">
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prochaine
                            consultation</label>
                        <div class="relative">
                            <input type="date"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Type de suivi</label>
                        <select
                            class="w-full px-3 py-2 pr-8 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">Sélectionner le type</option>
                            <option value="controle">Contrôle de routine</option>
                            <option value="resultats">Résultats d'examens</option>
                            <option value="evolution">Suivi évolution</option>
                            <option value="urgent">Consultation urgente si besoin</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Objectifs du suivi</label>
                    <textarea rows="3"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Définissez les objectifs et points à surveiller lors du prochain rendez-vous..."></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const activeTab = ref('medications'); // tab actif par défaut

        const setActiveTab = (tab) => {
            activeTab.value = tab;
        };

        return { activeTab, setActiveTab };
    },
};
</script>

<style></style>