<template>
    <div>
        <main class="px-6 py-8 max-w-7xl mx-auto" v-if="consultation.title">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Informations du Patient</h2>
                        <div class="flex flex-col md:flex-row items-start gap-6">
                            <div
                                class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto">
                                <i class="ri-user-3-fill text-3xl text-blue-600"></i>
                            </div>
                            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Nom complet</label>
                                    <p class="text-lg font-semibold text-gray-900 text-capitalize">{{
                                        consultation.field_client.title }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Numéro de dossier</label>
                                    <p class="text-lg font-semibold text-gray-900">{{ consultation.title }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Âge</label>
                                    <p class="text-lg text-gray-900">{{ consultation.field_client.field_age ?
                                        consultation.field_client.field_age + ' ans' : 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500 text-capitalize">Sexe</label>
                                    <p class="text-lg text-gray-900">{{ consultation.field_client.field_sexe ?
                                        consultation.field_client.field_sexe == 'masculin' ? 'Masculin' : 'Féminin' :
                                        'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Adresse</label>
                                    <p class="text-lg text-gray-900">
                                        {{ consultation.field_client.field_adresse ?
                                            consultation.field_client.field_adresse : 'N/A' }}
                                    </p>
                                </div>

                                <div>
                                    <label class="text-sm font-medium text-gray-500">Téléphone</label>
                                    <p class="text-lg text-gray-900">{{ consultation.field_client.field_phone ?
                                        consultation.field_client.field_phone : 'N/A' }}</p>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-sm font-medium text-gray-500">Allergies</label>
                                    <p class="text-lg text-gray-900">
                                        {{ consultation.field_client.field_allergies ?
                                            consultation.field_client.field_allergies : 'Aucune' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <!-- Statut -->
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl font-semibold text-gray-900">Informations de la Consultation</h2>
                            <div class="mt-1">
                                <span v-if="consultation.field_consultation_status === 'completed'"
                                    class="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                    Achevée
                                </span>
                                <span v-else
                                    class="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Non achevée
                                </span>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Motif -->
                            <div class="md:col-span-2">
                                <label class="text-sm font-medium text-gray-500">Motif de consultation</label>
                                <p class="text-lg text-gray-900 mt-1">
                                    {{ consultation.field_motif ? consultation.field_motif : 'N/A' }}
                                </p>
                            </div>

                            <!-- Température -->
                            <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <i class="ri-temp-hot-line text-red-600"></i>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Température (°C)</label>
                                    <p class="text-lg font-semibold text-gray-900">
                                        {{ consultation.field_temperature ? consultation.field_temperature + ' °C' :
                                            'N/A' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Tension -->
                            <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i class="ri-heart-pulse-line text-blue-600"></i>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Tension artérielle</label>
                                    <p class="text-lg font-semibold text-gray-900">
                                        {{ consultation.field_tension_arterielle ? consultation.field_tension_arterielle
                                            + ' mmHg' : 'N/A' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Poids -->
                            <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                                v-if="consultation.field_poids">
                                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="ri-weight-line text-green-600"></i>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Poids (kg)</label>
                                    <p class="text-lg font-semibold text-gray-900">
                                        {{ consultation.field_poids ? consultation.field_poids + ' kg' : 'N/A' }}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        v-if="consultation.field_medicaments && consultation.field_medicaments.length > 0">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Médicaments prescrits</h2>
                        <div class="space-y-4">
                            <div v-for="medicament in consultation.field_medicaments" :key="medicament.id"
                                class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-2">
                                        <h3 class="font-semibold text-gray-900">{{ medicament.field_articles.title }}
                                        </h3>
                                        <!-- <span class="text-sm text-gray-500">12 janvier 2023</span> -->
                                    </div>
                                    <p class="text-gray-700 mb-1">{{ medicament.field_description ?
                                        medicament.field_description : '-' }}</p>
                                    <!-- <p class="text-sm text-gray-500">Dr. Jean-Pierre Martin - Cardiologie</p> -->
                                </div>
                            </div>
                        </div>
                        <div class="mt-6" v-if="consultation.field_instructions">
                            <div class="border-l-4 border-blue-500 pl-4 py-2">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="font-semibold text-gray-900">Instructions pharmaceutiques</h3>
                                </div>
                                <p class="text-gray-700">
                                    {{ consultation.field_instructions ? consultation.field_instructions :
                                        'Aucune instruction spécifique pour ces médicaments.' }}
                                </p>
                            </div>
                        </div>

                    </section>

                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        v-if="consultation.field_examens && consultation.field_examens.length > 0">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Examens prescrits</h2>
                        <div class="space-y-4">
                            <div v-for="medicament in consultation.field_examens" :key="medicament.id"
                                class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-2">
                                        <h3 class="font-semibold text-gray-900">{{ medicament.field_examen.title }}
                                        </h3>
                                    </div>
                                    <p class="text-gray-700 mb-1">
                                        {{ medicament.field_description ? medicament.field_description : '-' }}
                                        </p>
                                    <p class="text-sm text-gray-500">
                                        {{ medicament.field_justification ? medicament.field_justification : '-' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-6"
                            v-if="consultation.field_conseils && consultation.field_signes_d_alerte && consultation.field_precautions">
                            <div class="border-l-4 border-blue-500 pl-4 py-2 mb-4" v-if="consultation.field_conseils">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="font-semibold text-gray-900">Conseils hygiéno-diététiques</h3>
                                </div>
                                <p class="text-gray-700">
                                    {{ consultation.field_conseils ? consultation.field_conseils : '---' }}
                                </p>
                            </div>
                            <div class="border-l-4 border-blue-500 pl-4 py-2 mb-4"
                                v-if="consultation.field_precautions">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="font-semibold text-gray-900">Précautions</h3>
                                </div>
                                <p class="text-gray-700">
                                    {{ consultation.field_precautions ? consultation.field_precautions : '---' }}
                                </p>
                            </div>
                            <div class="border-l-4 border-blue-500 pl-4 py-2" v-if="consultation.field_signes_d_alerte">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="font-semibold text-gray-900">Signes d'alerte</h3>
                                </div>
                                <p class="text-gray-700">
                                    {{ consultation.field_signes_d_alerte ? consultation.field_signes_d_alerte : '---'
                                    }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="space-y-8">
                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h2>
                        <div class="space-y-3">
                            <button @click.prevent="createConsultation(consultation.field_client.nid)"
                                class="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap">
                                <i class="ri-calendar-check-line text-lg"></i>
                                <span>Programmer consultation</span>
                            </button>
                            <button v-if="consultation.field_consultation_status != 'completed'"
                                @click="editConsultation(consultation)"
                                class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap">
                                <i class="ri-edit-line text-lg"></i>
                                <span>Modifier consultation</span>
                            </button>
                            <button @click="print(consultation.nid)"
                                class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap">
                                <i class="ri-printer-line text-lg"></i>
                                <span>Imprimer ordonnance</span>
                            </button>
                            <button type="button"
                                class="w-full bg-red-50 text-red-700 py-3 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap border border-red-200">
                                <i class="ri-close-circle-line text-lg"></i>
                                <span>Annuler la consultation</span>
                            </button>
                        </div>
                    </section>

                    <section v-if="consultation.field_rendez_vous" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-xl font-semibold text-gray-900">Statut du Rendez-vous</h2>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div :class="['w-16 h-16 rounded-full flex items-center justify-center text-2xl', getAppointmentStatusIconBg(consultation.field_rendez_vous.field_app_status)]">
                                <i :class="getAppointmentStatusIcon(consultation.field_rendez_vous.field_app_status)"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <span :class="['px-3 py-1 rounded-full text-sm font-medium', getAppointmentStatusBadgeClass(consultation.field_rendez_vous.field_app_status)]">
                                        {{ getStatusLabel(consultation.field_rendez_vous.field_app_status) }}
                                    </span>
                                </div>
                                <p class="text-gray-600 text-sm">
                                    <span v-if="consultation.field_rendez_vous.field_app_status === 'pending'" class="text-amber-700">
                                        <i class="ri-time-line text-amber-600"></i> En attente de traitement
                                    </span>
                                    <span v-else-if="consultation.field_rendez_vous.field_app_status === 'in_process'" class="text-blue-700">
                                        <i class="ri-play-circle-line text-blue-600"></i> Rendez-vous en cours
                                    </span>
                                    <span v-else-if="consultation.field_rendez_vous.field_app_status === 'completed'" class="text-green-700">
                                        <i class="ri-checkbox-circle-line text-green-600"></i> Rendez-vous finalisé
                                    </span>
                                    <span v-else-if="consultation.field_rendez_vous.field_app_status === 'cancelled'" class="text-red-700">
                                        <i class="ri-close-circle-line text-red-600"></i> Rendez-vous annulé
                                    </span>
                                </p>
                            </div>
                            <button @click="openStatusModal" class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm !rounded-button">
                                Mettre à jour
                            </button>
                        </div>
                    </section>

                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        v-if="consultation.field_prochaine_consultation">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Prochains Rendez-vous</h2>
                        <div class="space-y-3">
                            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="font-semibold text-blue-900">
                                        <h3 class="font-semibold text-blue-900">
                                            {{ consultation.field_type_de_suivi ?
                                                getSuiviLabel(consultation.field_type_de_suivi) : '' }}
                                        </h3>
                                    </h3>
                                </div>
                                <p class="text-sm text-blue-700">{{
                                    formatDate(consultation.field_prochaine_consultation, null, "long") }}</p>
                                <p class="text-sm text-blue-600">{{ consultation.field_objectifs_du_suivi ?
                                    consultation.field_objectifs_du_suivi : '---' }}</p>
                            </div>
                        </div>
                    </section>

                    <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hidden">
                        <h2 class="text-xl font-semibold text-gray-900 mb-6">Documents Associés</h2>
                        <div class="space-y-3">
                            <div
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <i class="ri-file-pdf-line text-red-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Ordonnance_Mars2024.pdf</p>
                                        <p class="text-sm text-gray-500">2.1 MB • 2 mars 2024</p>
                                    </div>
                                </div>
                                <button
                                    class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                                    <i class="ri-download-line text-gray-600"></i>
                                </button>
                            </div>

                            <div
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i class="ri-image-line text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Radiographie_Thorax.jpg</p>
                                        <p class="text-sm text-gray-500">4.8 MB • 15 février 2024</p>
                                    </div>
                                </div>
                                <button
                                    class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                                    <i class="ri-download-line text-gray-600"></i>
                                </button>
                            </div>

                            <div
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i class="ri-file-text-line text-green-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Rapport_Laboratoire.pdf</p>
                                        <p class="text-sm text-gray-500">1.5 MB • 15 février 2024</p>
                                    </div>
                                </div>
                                <button
                                    class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                                    <i class="ri-download-line text-gray-600"></i>
                                </button>
                            </div>

                            <div
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i class="ri-file-chart-line text-purple-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Bilan_Cardiaque.pdf</p>
                                        <p class="text-sm text-gray-500">3.2 MB • 12 janvier 2024</p>
                                    </div>
                                </div>
                                <button
                                    class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                                    <i class="ri-download-line text-gray-600"></i>
                                </button>
                            </div>
                        </div>

                        <button
                            class="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap">
                            <i class="ri-add-line text-lg"></i>
                            <span>Ajouter Document</span>
                        </button>
                    </section>
                </div>
            </div>
        </main>

        <!-- Modal Changement Statut Rendez-vous -->
        <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div class="flex items-center justify-center min-h-screen px-4 text-center">
                <!-- Overlay -->
                <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

                <!-- Modal -->
                <div
                    class="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <i class="ri-calendar-2-line text-blue-600"></i>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Mettre à jour le statut du rendez-vous</h3>
                                <div class="mt-4 space-y-3">
                                    <label
                                        class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        :class="{ 'border-blue-500 bg-blue-50': selectedStatus === 'in_process' }">
                                        <input type="radio" value="in_process" v-model="selectedStatus"
                                            class="w-4 h-4 text-blue-600 focus:ring-blue-600">
                                        <div class="ml-3 flex items-center gap-2">
                                            <i class="ri-play-circle-line text-blue-600 text-lg"></i>
                                            <div>
                                                <div class="font-medium text-gray-900">En cours</div>
                                                <div class="text-xs text-gray-500">Rendez-vous en cours de traitement</div>
                                            </div>
                                        </div>
                                    </label>
                                    <label
                                        class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        :class="{ 'border-green-500 bg-green-50': selectedStatus === 'completed' }">
                                        <input type="radio" value="completed" v-model="selectedStatus"
                                            class="w-4 h-4 text-green-600 focus:ring-green-600">
                                        <div class="ml-3 flex items-center gap-2">
                                            <i class="ri-checkbox-circle-line text-green-600 text-lg"></i>
                                            <div>
                                                <div class="font-medium text-gray-900">Terminé</div>
                                                <div class="text-xs text-gray-500">Rendez-vous finalisé</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3 rounded-b-lg">
                        <button @click="updateAppointmentStatus" :disabled="updatingStatus"
                            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm">
                            <i v-if="updatingStatus" class="ri-loader-4-line animate-spin mr-2"></i>
                            {{ updatingStatus ? 'Mise à jour...' : 'Enregistrer' }}
                        </button>
                        <button @click="closeStatusModal" type="button"
                            class="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted, ref } from 'vue';
import { useConsultationStore, useAppointmentStore } from '../stores/index.js';
import { useRoute, useRouter } from 'vue-router';
import { formatDate } from '../utils/formateDate.js';
import { toast } from 'vue-sonner';

export default {
    setup() {
        const consultationsStore = useConsultationStore();
        const appointmentStore = useAppointmentStore();
        const route = useRoute();
        const router = useRouter();
        const consultation = ref({});

        // Variables pour le modal du statut du rendez-vous
        const showStatusModal = ref(false);
        const selectedStatus = ref('pending');
        const updatingStatus = ref(false);
        // Paramètres dynamiques de la requête
        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_client',
                'field_conseils',
                'field_examens',
                'field_instructions',
                'field_montant',
                'field_motif',
                'field_medicaments',
                'field_objectifs_du_suivi',
                'field_poids',
                'field_prix_total_examens',
                'field_prix_total_medicaments',
                'field_precautions',
                'field_signes_d_alerte',
                'field_consultation_status',
                'field_temperature',
                'field_tension_arterielle',
                'field_type_de_suivi',
                'field_consultation_status',
                'field_prochaine_consultation',
                'field_rendez_vous'
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                nid: {
                    val: route.query.id,
                    op: '=',
                }
            },
            values: {
                field_client: ['title', 'nid', 'field_adresse', 'field_sexe',
                    'field_allergies', 'field_assurance', 'field_consultation', 'field_email', 'field_notes_medicales',
                    'field_phone', 'field_phone', 'field_age'],
                field_rendez_vous: ['nid', 'field_app_status']
            },
            pager: 0,
            offset: 1
        })

        const suiviTypes = {
            Controle_de_routine: "Contrôle de routine",
            Resultats_d_examens: "Résultats d'examens",
            Suivi_evolution: "Suivi évolution",
            Consultation_urgente_si_besoin: "Consultation urgente si besoin"
        };

        const getSuiviLabel = (value) => {
            return suiviTypes[value] || value;
        };

        const getStatusLabel = (status) => {
            const statusMap = {
                'pending': 'En attente',
                'in_process': 'En cours',
                'completed': 'Terminé',
                'cancelled': 'Annulé'
            };
            return statusMap[status] || status || 'Non défini';
        };

        const getAppointmentStatusBadgeClass = (status) => {
            const classMap = {
                'pending': 'bg-amber-100 text-amber-800',
                'in_process': 'bg-blue-100 text-blue-800',
                'completed': 'bg-green-100 text-green-800',
                'cancelled': 'bg-red-100 text-red-800'
            };
            return classMap[status] || 'bg-gray-100 text-gray-800';
        };

        const getAppointmentStatusIconBg = (status) => {
            const bgMap = {
                'pending': 'bg-amber-100 text-amber-600',
                'in_process': 'bg-blue-100 text-blue-600',
                'completed': 'bg-green-100 text-green-600',
                'cancelled': 'bg-red-100 text-red-600'
            };
            return bgMap[status] || 'bg-gray-100 text-gray-600';
        };

        const getAppointmentStatusIcon = (status) => {
            const iconMap = {
                'pending': 'ri-time-line',
                'in_process': 'ri-play-circle-line',
                'completed': 'ri-checkbox-circle-fill',
                'cancelled': 'ri-close-circle-fill'
            };
            return iconMap[status] || 'ri-question-line';
        };

        onMounted(async () => {
            await consultationsStore.fetchConsultations(queryOptions.value);
            consultation.value = consultationsStore.consultations.rows[0];
        });

        function createConsultation(client) {
            router.push({
                name: 'consultations',
                query: {
                    client: client
                }
            });
        }

        const print = (nid) => {
            router.push({
                name: 'ordonnance',
                query: {
                    key: nid,
                }
            })
        }

        // edit consulatation
        const editConsultation = (consultation) => {
            if (consultation.field_consultation_status == "draft") {
                router.push({
                    name: 'consultation.edit',
                    params: {
                        id: consultation.nid
                    }
                });
                toast("Consultation chargé.", { class: "!bg-orange-100 !text-orange-700", });
            }
        };

        // Gestion du modal de statut du rendez-vous
        const openStatusModal = () => {
            if (consultation.value.field_rendez_vous) {
                selectedStatus.value = consultation.value.field_rendez_vous.field_app_status || 'pending';
                showStatusModal.value = true;
            } else {
                toast.error('Aucun rendez-vous associé à cette consultation');
            }
        };

        const closeStatusModal = () => {
            showStatusModal.value = false;
        };

        const updateAppointmentStatus = async () => {
            if (!selectedStatus.value || !consultation.value.field_rendez_vous?.nid) return;

            updatingStatus.value = true;
            try {
                const updateData = {
                    entity_type: "node",
                    bundle: "rendez_vous_medical",
                    nid: consultation.value.field_rendez_vous.nid,
                    field_app_status: selectedStatus.value
                };

                await appointmentStore.createAppointment(updateData);

                if (appointmentStore.error) {
                    toast.error('Erreur lors de la mise à jour du rendez-vous');
                    return;
                }

                // Mettre à jour localement
                consultation.value.field_rendez_vous.field_app_status = selectedStatus.value;
                closeStatusModal();
                toast.success('Statut du rendez-vous mis à jour avec succès');
            } catch (error) {
                console.error('Erreur:', error);
                toast.error('Une erreur est survenue lors de la mise à jour');
            } finally {
                updatingStatus.value = false;
            }
        };

        return {
            consultationsStore,
            consultation,
            formatDate,
            createConsultation,
            print,
            editConsultation,
            getSuiviLabel,
            getStatusLabel,
            getAppointmentStatusBadgeClass,
            getAppointmentStatusIconBg,
            getAppointmentStatusIcon,
            // Modal statut
            showStatusModal,
            selectedStatus,
            updatingStatus,
            openStatusModal,
            closeStatusModal,
            updateAppointmentStatus,
        };
    }
}
</script>

<style scoped>
.text-capitalize {
    text-transform: capitalize;
}
</style>