<template>
    <div>
        <header class="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
            <div class="max-w-4xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                        <i class="ri-capsule-line text-white text-lg md:text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-lg md:text-xl font-semibold text-gray-900 leading-tight">Assistant Clinique IA
                        </h1>
                        <p class="text-[10px] md:text-sm text-gray-500 line-clamp-1 md:line-clamp-none">Basé sur
                            l'inventaire clinique</p>
                    </div>
                </div>
                <div class="hidden sm:flex items-center text-sm text-gray-500">
                    <i class="ri-shield-check-line text-green-500 mr-1"></i>
                    <span class="whitespace-nowrap">Sécurisé et Confidentiel</span>
                </div>
            </div>
        </header>

        <div class="bg-primary/10 px-4 py-2 md:px-6 md:py-3 border-b border-primary/20">
            <div class="max-w-4xl mx-auto flex items-center">
                <i class="ri-information-line text-primary mr-2 flex-shrink-0"></i>
                <div class="text-[10px] md:text-sm">
                    <span class="font-bold text-primary">Médecins :</span>
                    <span class="text-gray-700 ml-1">Suggestions basées sur l'inventaire réel.</span>
                </div>
            </div>
        </div>

        <main class="max-w-4xl mx-auto px-1 md:px-6 py-2 md:py-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <!-- Chat Container -->
                <div ref="chatContainer"
                    class="chat-container overflow-y-auto px-2 md:px-6 py-3 md:py-6 space-y-3 md:space-y-6">
                    <!-- Message de bienvenue -->
                    <div class="flex items-start space-x-3 mb-4">
                        <div
                            class="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <i class="ri-robot-2-line text-white text-lg"></i>
                        </div>
                        <div class="flex-1">
                            <div
                                class="message-bubble bg-gray-100 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 md:py-3 mb-4">
                                <p class="text-sm md:text-base font-medium text-gray-900 mb-1">Bonjour Docteur !</p>
                                <p class="text-sm md:text-base text-gray-700">Je suis votre Assistant Clinique. Je peux
                                    vous aider à analyser les stocks, consulter l'historique des patients ou préparer
                                    des recommandations basées sur les données réelles de la clinique.</p>
                                <p class="text-[11px] text-gray-500 mt-2 font-medium italic flex items-center">
                                    <i class="ri-radio-button-line text-green-500 mr-1 animate-pulse"></i>
                                    Connecté à l'inventaire en temps réel
                                </p>
                            </div>

                            <!-- Aide Idéale / Suggestions -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                <div
                                    class="col-span-1 sm:col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
                                    Suggestions rapides</div>

                                <button
                                    @click="selectPrompt('Fais-moi un résumé des stocks critiques (faible quantité)')"
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <i class="ri-error-warning-line text-red-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Stocks critiques</div>
                                    </div>
                                </button>

                                <button @click="selectPrompt('Quelles sont les dernières consultations enregistrées ?')"
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <i class="ri-stethoscope-line text-blue-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Dernières consultations</div>
                                    </div>
                                </button>

                                <button
                                    @click="selectPrompt('Donne-moi la liste des examens disponibles avec leurs prix')"
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                            <i class="ri-test-tube-line text-green-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Examens & Tarifs</div>
                                    </div>
                                </button>

                                <button @click="selectPrompt('Quelles ont été les dernières ventes réalisées ?')"
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                            <i class="ri-shopping-bag-2-line text-purple-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Historique des ventes</div>
                                    </div>
                                </button>

                                <button
                                    @click="selectPrompt('Montre-moi l\'évolution des ventes par semaine et par jour sous forme de graphique')"
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                            <i class="ri-bar-chart-groupped-line text-indigo-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Évolution Ventes (Sem/Jour)
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Messages dynamiques -->
                    <div v-for="(message, index) in messages" :key="index">
                        <!-- Message utilisateur -->
                        <div v-if="message.type === 'user'" class="flex items-start space-x-3 justify-end">
                            <div
                                class="message-bubble bg-primary text-white rounded-2xl rounded-tr-sm px-3 md:px-4 py-2 md:py-3 max-w-[80%]">
                                <img v-if="message.image" :src="message.image"
                                    class="w-full h-auto rounded-lg mb-2 border-2 border-white/20" alt="Image analysée">
                                <p v-if="message.content" class="text-[13px] md:text-sm">{{ message.content }}</p>
                                <p class="text-[10px] text-blue-100 mt-1">{{ message.time }}</p>
                            </div>
                            <div
                                class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="ri-user-line text-gray-600 text-sm"></i>
                            </div>
                        </div>

                        <!-- Message IA -->
                        <div v-else-if="message.type === 'ai'" class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="ri-robot-line text-white text-sm"></i>
                            </div>
                            <div class="message-bubble bg-gray-100 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 md:py-3">
                                <div class="prose prose-sm max-w-none text-[13px] md:text-sm" v-html="message.content">
                                </div>
                                <SalesChart v-if="message.hasChart" />
                                <p class="text-[10px] text-gray-500 mt-1">{{ message.time }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Indicateur de frappe -->
                    <div v-show="isTyping" class="typing-indicator active items-start space-x-3">
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="ri-robot-line text-white text-sm"></i>
                        </div>
                        <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 md:py-3">
                            <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Patient Card -->
                <div v-show="patientCardVisible" class="border-t border-gray-200">
                    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-sm font-medium text-gray-900">Dossier Patient Attaché</h3>
                            <button @click="removePatientCard" class="text-gray-400 hover:text-red-500">
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <p class="text-[10px] text-gray-500 mb-0.5">Nom du Patient</p>
                                <p class="text-xs font-semibold text-gray-900 truncate">{{ patientInfo.name || '-' }}
                                </p>
                            </div>
                            <div class="grid grid-cols-3 sm:block gap-2 sm:gap-0">
                                <div>
                                    <p class="text-[10px] text-gray-500 mb-0.5">Âge</p>
                                    <p class="text-xs font-semibold text-gray-900">{{ patientInfo.age ?
                                        `${patientInfo.age} ans` : '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-gray-500 mb-0.5">Sexe</p>
                                    <p class="text-xs font-semibold text-gray-900 capitalize">{{ patientInfo.gender ||
                                        '-' }}</p>
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <p class="text-[10px] text-gray-500 mb-0.5">Allergies</p>
                                <p class="text-xs font-semibold text-gray-900 line-clamp-1">
                                    {{ patientInfo.allergies || 'Aucune' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Medications card -->
                <div v-show="selectedMedications.nid" class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <p class="text-sm font-medium text-gray-900 mb-3">Médicaments :</p>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ selectedMedications.name }}</p>
                            </div>
                            <button @click="removeSelectedMedication" class="text-gray-500 hover:text-red-500 ml-2">
                                <i class="ri-close-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Zone de saisie -->
                <div class="border-t border-gray-200 px-2 md:px-6 py-2 md:py-4 bg-white sticky bottom-0">
                    <div class="flex flex-col space-y-3">
                        <!-- Action Buttons Row -->
                        <div class="flex items-center space-x-2">
                            <button @click="openPatientModal"
                                class="flex-1 flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-xs font-medium"
                                title="Sélectionner un patient">
                                <i class="ri-user-add-line text-sm"></i>
                                <span>Patient</span>
                            </button>
                            <button @click="openMedicationModal"
                                class="flex-1 flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-xs font-medium"
                                title="Ajouter un médicament">
                                <i class="ri-capsule-line text-sm"></i>
                                <span>Médicament</span>
                            </button>
                            <input type="file" ref="fileInput" accept="image/*" class="hidden"
                                @change="handleFileSelect">
                            <button @click="triggerFileUpload"
                                class="flex items-center justify-center bg-gray-50 text-gray-700 w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                title="Ajouter une image (Radio, Echo, etc.)" :disabled="isProcessingImage">
                                <i v-if="isProcessingImage" class="ri-loader-4-line animate-spin"></i>
                                <i v-else class="ri-attachment-2 active:scale-95 transition-transform"></i>
                            </button>
                        </div>

                        <!-- Image Preview -->
                        <div v-if="selectedImage" class="relative group inline-block">
                            <img :src="selectedImage" class="h-20 w-auto rounded-lg border border-gray-200 object-cover"
                                alt="Preview">
                            <button @click="removeImage"
                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-red-600">
                                <i class="ri-close-line text-xs"></i>
                            </button>
                        </div>

                        <!-- Textarea and Send Row -->
                        <div class="flex space-x-2">
                            <textarea ref="messageInput" v-model="currentMessage" @input="handleInput"
                                @keydown="handleKeyDown" placeholder="Écrivez votre message..."
                                class="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-h-[48px]"
                                rows="1" maxlength="1000"></textarea>
                            <button @click="sendMessage" :disabled="!canSend"
                                class="bg-primary text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="ri-send-plane-line text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-2 px-1">
                        <p class="text-[10px] text-gray-400">Maj+Entrée pour nouvelle ligne</p>
                        <span class="text-[10px] text-gray-400">{{ currentMessage.length }}/1000</span>
                    </div>
                </div>
            </div>
        </main>

        <!-- Modal Patient -->
        <PatientModal :show="showPatientModal" @close="closePatientModal" @save="savePatient" />

        <!-- Modal Médicament -->
        <MedicationModal :show="showMedicationModal" @close="closeMedicationModal" @save="addMedication" />
    </div>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'
import PatientModal from '../components/assists/PatientModal.vue';
import MedicationModal from '../components/assists/MedicationModal.vue';
import SalesChart from '../components/charts/SalesChart.vue';
import { useArticleStore, useClientStore, useConsultationStore, useExamenStore, useOrderStore } from '../stores/index.js';
import { formatDate } from '../utils/formateDate';

export default {
    name: "Assist",
    components: {
        PatientModal,
        MedicationModal,
        SalesChart
    },
    setup() {
        const store = useArticleStore();
        const clientStore = useClientStore();
        const consultationStore = useConsultationStore();
        const examenStore = useExamenStore();
        const orderStore = useOrderStore();
        // Refs pour les éléments DOM
        const chatContainer = ref(null)
        const messageInput = ref(null)
        const fileInput = ref(null)

        // État des messages
        const messages = ref([])
        const currentMessage = ref('')
        const isTyping = ref(false)
        const selectedImage = ref(null)
        const isProcessingImage = ref(false)

        // État patient
        const patientCardVisible = ref(false)
        const patientInfo = ref({
            name: '',
            age: null,
            gender: '',
            allergies: '',
        })

        // État médicaments sélectionnés
        const selectedMedications = ref({
            name: '',
            nid: null,
        })

        // État modals
        const showPatientModal = ref(false)
        const showMedicationModal = ref(false)

        onMounted(async () => {
            // Charger l'inventaire au montage
            await store.fetchArticles({
                fields: ['nid', 'title', 'field_quantite_stock', 'field_unite', 'created'],
                // filters: {
                //     status: {
                //         val: 1,
                //         op: "="
                //     }
                // },
                pager: 0,
                offset: 20,
                sort: { val: 'created', op: 'asc' }
            });

            // Charger les patients au montage
            await clientStore.fetchAllClients({
                fields: ['nid', 'title', 'field_age', 'field_sexe', 'field_allergies', 'created'],
                pager: 0,
                offset: 20,
                sort: { val: 'title', op: 'asc' }
            });

            // Charger les consultations au montage avec détails cliniques
            await consultationStore.fetchConsultations({
                fields: [
                    'nid',
                    'title',
                    'field_client',
                    'field_motif',
                    'field_temperature',
                    'field_tension_arterielle',
                    'field_poids',
                    'created',
                    'field_examens',
                    'field_medicaments'
                ],
                pager: 0,
                values: {
                    field_client: [
                        'nid',
                        'title',
                        'field_phone',
                        'field_assurance',
                        'field_adresse',
                        'field_age',
                        'created',
                        'field_allergies',
                        'field_contact_d_urgence',
                        'field_email',
                        'field_notes_medicales',
                        'field_sexe',
                    ]
                },
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });

            // Charger les examens au montage
            await examenStore.fetchExamens({
                pager: 0,
                offset: 20
            });

            // Charger les commandes (ventes) au montage
            await orderStore.fetchOrders({
                fields: [
                    'nid',
                    'title',
                    'field_articles',
                    'field_examens_order',
                    'field_client',
                    'field_date',
                    'field_total_vente',
                    'created'
                ],
                values: {
                    field_client: [
                        'nid',
                        'title',
                        'field_phone',
                        'field_assurance',
                        'field_adresse',
                        'field_age',
                        'created',
                        'field_allergies',
                        'field_contact_d_urgence',
                        'field_email',
                        'field_notes_medicales',
                        'field_sexe',
                    ]
                },
                pager: 0,
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });
        });

        // Computed
        const canSend = computed(() => {
            return (currentMessage.value.trim().length > 0 || selectedImage.value) &&
                currentMessage.value.length <= 1000 &&
                !isProcessingImage.value
        })

        // Gestion du texte
        const handleInput = () => {
            nextTick(() => {
                if (messageInput.value) {
                    messageInput.value.style.height = 'auto'
                    messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
                }
            })
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (canSend.value) {
                    sendMessage()
                }
            }
        }

        // Messages
        const sendMessage = async () => {
            if (isProcessingImage.value) return;

            const message = currentMessage.value.trim()
            if (!message && !selectedImage.value) return

            // Ajouter le message utilisateur
            messages.value.push({
                type: 'user',
                content: message,
                image: selectedImage.value,
                time: new Date().toLocaleTimeString()
            })

            // Sauvegarder l'image pour l'envoi API puis reset
            const imageToSend = selectedImage.value
            currentMessage.value = ''
            selectedImage.value = null

            nextTick(() => {
                if (messageInput.value) {
                    messageInput.value.style.height = 'auto'
                }
            })

            // Simuler la réponse IA
            isTyping.value = true
            scrollToBottom()

            try {
                const response = await generateAIResponse(message, imageToSend)

                // Vérifier si la réponse contient la commande pour afficher le graphique
                let content = response;
                let hasChart = false;

                if (content.includes('<SHOW_SALES_CHART>')) {
                    hasChart = true;
                    content = content.replace('<SHOW_SALES_CHART>', '');
                }

                messages.value.push({
                    type: 'ai',
                    content: content,
                    time: new Date().toLocaleTimeString(),
                    hasChart: hasChart
                })
            } catch (error) {
                console.error("OpenAI API Error:", error)
                messages.value.push({
                    type: 'ai',
                    content: `
                        <div class="bg-red-50 border-l-4 border-red-400 p-3 mb-4 text-red-700">
                            <p class="font-medium">Erreur</p>
                            <p class="text-sm">Impossible de se connecter au service IA. Veuillez vérifier votre clé API OpenAI ou votre connexion internet.</p>
                        </div>
                    `,
                    time: new Date().toLocaleTimeString()
                })
            } finally {
                isTyping.value = false
                scrollToBottom()
            }
        }

        const generateAIResponse = async (userMessage, imageBase64 = null) => {
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            const apiUrl = 'https://api.openai.com/v1/chat/completions';

            let patientContext = '';
            if (patientCardVisible.value) {
                patientContext = `Information sur le patient : Nom: ${patientInfo.value.name}, Âge: ${patientInfo.value.age}, Sexe: ${patientInfo.value.gender}, Allergies: ${patientInfo.value.allergies || 'Aucune'}.`;
            }

            let medicationContext = '';
            if (selectedMedications.value.nid) {
                medicationContext = `Médicament sélectionné pour discussion : ${selectedMedications.value.name}.`;
            }

            // Préparer un résumé de l'inventaire réel
            const inventorySummary = store.articles.rows.map(item =>
                `- ${item.title}: ${item.field_quantite_stock} ${item.field_unite || 'unités'}`
            ).join('\n');

            // Préparer un résumé de la liste des patients
            const patientListSummary = clientStore.allClients.rows.map(p =>
                `- ${p.title} (${p.field_age ? p.field_age + ' ans' : 'âge inconnu'}, ${p.field_sexe || 'sexe inconnu'})`
            ).join('\n');

            // Préparer un résumé des dernières consultations avec détails cliniques
            const consultationSummary = consultationStore.consultations.rows.map(c =>
                `- Patient: ${c.field_client?.title || 'Anonyme'}, Motif: ${c.field_motif || 'N/A'}, Constantes: [Temp: ${c.field_temperature || '-'}°C, Tension: ${c.field_tension_arterielle || '-'}, Poids: ${c.field_poids || '-'}kg]`
            ).join('\n');

            // Préparer un résumé des examens disponibles
            const examSummary = examenStore.examens.rows.map(e =>
                `- ${e.title} (${e.field_prix || '0'} Ar)`
            ).join('\n');

            // Préparer un résumé des dernières ventes (orders) avec produits détaillés
            const salesSummary = orderStore.orders.rows.map(o => {
                const products = o.field_articles?.map(a => `${a.field_article?.title} (x${a.field_quantite})`).join(', ') || 'Aucun produit';
                const exams = o.field_examens_order?.map(e => e.field_examen?.title).join(', ') || 'Aucun examen';
                return `- Commande #${o.title}, Client: ${o.field_client?.title || 'Anonyme'}, Produits: [${products}], Examens: [${exams}], Total: ${o.field_total_vente || '0'} Ar`;
            }).join('\n');

            const systemPrompt = `Tu es l'Assistant IA expert de la Clinique Medical, aidant le médecin dans sa pratique quotidienne.
            
            ANALYSE D'IMAGES ET DOCUMENTS :
            - Tu ANALYSES les images médicales fournies (radiographies, échographies, ordonnances, résultats d'analyses, photos cliniques).
            - Décris précisément les observations visuelles, lis les textes sur les documents et suggère des pistes cliniques ou thérapeutiques.
            - Si l'image n'est manifestement pas médicale, mentionne-le simplement et reste concentré sur le contexte clinique.
            
            CONSIGNES GÉNÉRALES :
            - Reste strictement dans le domaine médical et pharmaceutique.
            - Sois professionnel, concis et réponds en français utilisant du HTML simple (p, ul, li, strong).
            - Termine tes conseils médicaux en rappelant que la décision finale revient au médecin.
            - Si on demande des statistiques ou graphiques de ventes, ajoute <SHOW_SALES_CHART> à la fin.

            STRUCTURE DES DONNÉES ET RELATIONS ENTRE ENTITÉS :

            1. RELATIONS CLIENT (PATIENT) :
            - Un CLIENT (patient) est identifié par son 'nid' (ID unique)
            - Chaque CLIENT possède : title (nom), field_age (âge), field_sexe (sexe), field_allergies (allergies), field_phone (téléphone), field_assurance (assurance), field_adresse (adresse), field_contact_d_urgence (contact urgence), field_email (email), field_notes_medicales (notes médicales)

            2. RELATIONS CONSULTATION :
            - Une CONSULTATION est liée à un CLIENT via la clé étrangère 'field_client' qui contient le 'nid' du client
            - Chaque CONSULTATION contient : title (titre/n°), field_motif (motif de consultation), field_temperature (température), field_tension_arterielle (tension), field_poids (poids), created (date)
            - Les constantes cliniques (température, tension, poids) sont enregistrées par consultation

            3. RELATIONS ARTICLE (MÉDICAMENT/PRODUIT) :
            - Un ARTICLE est identifié par son 'nid'
            - Chaque ARTICLE possède : title (nom), field_quantite_stock (quantité en stock), field_unite (unité de mesure)
            - Les ARTICLES sont utilisés dans les COMMANDES via field_articles

            4. RELATIONS EXAMEN :
            - Un EXAMEN est identifié par son 'nid'
            - Chaque EXAMEN possède : title (nom), field_prix (prix)
            - Les EXAMENS peuvent être prescrits dans les COMMANDES via field_examens_order

            5. RELATIONS COMMANDE (VENTE) :
            - Une COMMANDE est liée à un CLIENT via la clé étrangère 'field_client' (contient le 'nid' du client)
            - Une COMMANDE peut contenir plusieurs ARTICLES via 'field_articles' : tableau d'objets contenant {field_article: {nid, title}, field_quantite: nombre}
            - Une COMMANDE peut contenir plusieurs EXAMENS via 'field_examens_order' : tableau d'objets contenant {field_examen: {nid, title}}
            - Chaque COMMANDE a : title (n° commande), field_date (date), field_total_vente (montant total)

            6. SCHÉMA DES RELATIONS (Clés étrangères) :
            - Client (nid) ← field_client → Consultation (field_client)
            - Client (nid) ← field_client → Commande (field_client)
            - Article (nid) ← field_article.field_article → field_articles dans Commande
            - Examen (nid) ← field_examen.field_examen → field_examens_order dans Commande
            
            CONTEXTE ET DONNÉES DE LA CLINIQUE :
            - Stock actuel: ${inventorySummary}
            - Patients: ${patientListSummary}
            - Consultations récentes: ${consultationSummary}
            - Examens disponibles: ${examSummary}
            - Ventes (Commandes): ${salesSummary}
            
            CONTEXTE DE LA SESSION :
            Patient sélectionné: ${patientContext || 'Aucun'}
            Médicament sélectionné: ${medicationContext || 'Aucun'}
            
            COMMENT UTILISER CES RELATIONS :
            - Pour obtenir l'historique d'un patient, cherche les CONSULTATIONS et COMMANDES liées à son 'nid'
            - Pour analyser les prescriptions, regarde les ARTICLES et EXAMENS dans les COMMANDES par client
            - Pour le suivi clinique, relie les CONSTANTES des CONSULTATIONS aux prescriptions dans les COMMANDES
            - Pour l'inventaire, croise les sorties de stock (field_quantite dans field_articles) avec les COMMANDES`;

            let userContent = userMessage;

            if (imageBase64) {
                userContent = [
                    { type: "text", text: userMessage || "Analyse cette image médicale." },
                    {
                        type: "image_url",
                        image_url: {
                            "url": imageBase64
                        }
                    }
                ];
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey} `
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userContent }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status} `);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        }

        const selectPrompt = (promptText) => {
            currentMessage.value = promptText;
            sendMessage();
        }

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Check size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("L'image est trop volumineuse (max 5MB).");
                return;
            }

            isProcessingImage.value = true;
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedImage.value = e.target.result;
                isProcessingImage.value = false;
            };
            reader.onerror = () => {
                isProcessingImage.value = false;
                alert("Erreur lors de la lecture de l'image.");
            };
            reader.readAsDataURL(file);

            // Reset input value to allow re-selecting same file
            event.target.value = '';
        }

        const triggerFileUpload = () => {
            fileInput.value.click();
        }

        const removeImage = () => {
            selectedImage.value = null;
        }



        const scrollToBottom = () => {
            nextTick(() => {
                if (chatContainer.value) {
                    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
                }
            })
        }


        // =============================================
        // NOUVELLE FONCTION À AJOUTER ICI
        // =============================================
        // Fonction pour récupérer toutes les informations d'un patient

        const getPatientFullInfo = async (patientNid) => {
            try {
                isTyping.value = true;

                // 1. Récupérer les détails COMPLETS du patient spécifique
                let patient = null;

                // Sauvegarder la liste actuelle des patients
                const currentPatients = [...(clientStore.allClients?.rows || [])];

                try {
                    await clientStore.fetchClient(patientNid);
                    patient = clientStore.client;

                    // Restaurer la liste des patients
                    clientStore.allClients = { ...clientStore.allClients, rows: currentPatients };
                } catch (error) {
                    console.error("Erreur récupération patient:", error);
                    patient = currentPatients.find(p => p.nid === patientNid);
                }

                if (!patient) {
                    throw new Error("Patient non trouvé");
                }

                // 2. Sauvegarder l'état actuel des consultations
                const currentConsultations = [...(consultationStore.consultations?.rows || [])];

                // Récupérer les consultations du patient
                let patientConsultations = [];
                try {
                    const response = await consultationStore.fetchConsultations({
                        fields: [
                            'nid',
                            'title',
                            'field_motif',
                            'field_temperature',
                            'field_tension_arterielle',
                            'field_poids',
                            'created',
                            'field_examens',
                            'field_medicaments',
                            'field_client',
                        ],
                        filters: {
                            'field_client': {
                                val: patientNid,
                                op: '='
                            }
                        },
                        values: {
                            field_client: ['nid', 'title']
                        },
                        pager: 0,
                        sort: { val: 'nid', op: 'desc' }
                    });

                    patientConsultations = consultationStore.consultations?.rows || [];

                    // Restaurer les consultations originales
                    consultationStore.consultations = {
                        ...consultationStore.consultations,
                        rows: currentConsultations
                    };
                } catch (error) {
                    console.error("Erreur récupération consultations:", error);
                    patientConsultations = [];
                }

                // 3. Sauvegarder l'état actuel des commandes
                const currentOrders = [...(orderStore.orders?.rows || [])];

                // Récupérer les commandes du patient
                let patientOrders = [];
                try {
                    await orderStore.fetchOrders({
                        fields: [
                            'nid',
                            'title',
                            'field_articles',
                            'field_examens_order',
                            'field_date',
                            'field_total_vente',
                            'created',
                            'field_client',
                        ],
                        filters: {
                            'field_client': {
                                val: patientNid,
                                op: '='
                            }
                        },
                        values: {
                            field_client: ['nid', 'title']
                        },
                        pager: 0,
                        sort: { val: 'nid', op: 'desc' }
                    });

                    patientOrders = orderStore.orders?.rows || [];
                    console.log("Commandes du patient récupérées:", patientOrders);

                    // Restaurer les commandes originales
                    orderStore.orders = { ...orderStore.orders, rows: currentOrders };
                } catch (error) {
                    console.error("Erreur récupération commandes:", error);
                    patientOrders = [];
                }

                // 4. Récupérer les infos des médicaments prescrits sans écraser le store
                const prescribedMedications = [];
                const currentArticles = [...(store.articles?.rows || [])];

                for (const order of patientOrders) {
                    if (order.field_articles && order.field_articles.length > 0) {
                        for (const article of order.field_articles) {
                            if (article.field_article?.nid) {
                                let medInfo = null;
                                try {
                                    // Chercher d'abord dans la liste existante
                                    medInfo = currentArticles.find(a => a.nid === article.field_article.nid);

                                    // Si pas trouvé, faire un appel API spécifique
                                    if (!medInfo) {
                                        const response = await store.fetchArticles({
                                            fields: ['nid', 'title', 'field_quantite_stock', 'field_unite'],
                                            filters: {
                                                nid: {
                                                    val: article.field_article.nid,
                                                    op: '='
                                                }
                                            },
                                            pager: 0,
                                            offset: 1
                                        });
                                        medInfo = store.articles?.rows?.[0];
                                    }

                                    prescribedMedications.push({
                                        name: article.field_article?.title || 'Inconnu',
                                        quantite: article.field_quantite || 0,
                                        date: order.field_date || order.created || new Date().toISOString(),
                                        stockActuel: medInfo?.field_quantite_stock || 0,
                                        unite: medInfo?.field_unite || 'unités',
                                        nid: article.field_article?.nid
                                    });
                                    console.log("Médicament ajouté à la liste des prescrits:", prescribedMedications[prescribedMedications.length - 1]);
                                } catch (error) {
                                    console.error("Erreur récupération médicament:", error);
                                }
                            }
                        }
                    }
                }

                // Restaurer les articles
                store.articles = { ...store.articles, rows: currentArticles };

                // 5. Récupérer les infos des examens prescrits sans écraser le store
                const prescribedExams = [];
                const currentExamens = [...(examenStore.examens?.rows || [])];

                for (const order of patientOrders) {
                    if (order.field_examens_order && order.field_examens_order.length > 0) {
                        for (const exam of order.field_examens_order) {
                            if (exam.field_examen?.nid) {
                                let examInfo = null;
                                try {
                                    // Chercher d'abord dans la liste existante
                                    examInfo = currentExamens.find(e => e.nid === exam.field_examen.nid);

                                    // Si pas trouvé, faire un appel API spécifique
                                    if (!examInfo) {
                                        const response = await examenStore.fetchExamens({
                                            fields: ['nid', 'title', 'field_prix'],
                                            filters: {
                                                nid: {
                                                    val: exam.field_examen.nid,
                                                    op: '='
                                                }
                                            },
                                            pager: 0,
                                            offset: 1
                                        });
                                        examInfo = examenStore.examens?.rows?.[0];
                                    }

                                    prescribedExams.push({
                                        name: exam.field_examen?.title || 'Inconnu',
                                        prix: examInfo?.field_prix || 0,
                                        date: order.field_date || order.created || new Date().toISOString(),
                                        nid: exam.field_examen?.nid
                                    });
                                    console.log("Examen ajouté à la liste des prescrits:", prescribedExams[prescribedExams.length - 1]);
                                } catch (error) {
                                    console.error("Erreur récupération examen:", error);
                                }
                            }
                        }
                    }
                }

                // Restaurer les examens
                examenStore.examens = { ...examenStore.examens, rows: currentExamens };

                // 6. Vérifier les allergies
                const allergies = patient?.field_allergies ?
                    patient.field_allergies.split(',').map(a => a.trim()).filter(a => a) :
                    [];
                const medicationAlerts = [];

                if (allergies.length > 0 && prescribedMedications.length > 0) {
                    prescribedMedications.forEach(med => {
                        allergies.forEach(allergy => {
                            if (med.name && med.name.toLowerCase().includes(allergy.toLowerCase())) {
                                medicationAlerts.push({
                                    medication: med.name,
                                    allergene: allergy,
                                    date: med.date
                                });
                            }
                        });
                    });
                }

                return {
                    patient: {
                        nid: patient.nid,
                        nom: patient.title || 'Inconnu',
                        age: patient.field_age,
                        sexe: patient.field_sexe,
                        allergies: patient.field_allergies || 'Aucune',
                        telephone: patient.field_phone,
                        assurance: patient.field_assurance,
                        email: patient.field_email,
                        adresse: patient.field_adresse,
                        contactUrgence: patient.field_contact_d_urgence,
                        notesMedicales: patient.field_notes_medicales
                    },
                    consultations: Array.isArray(patientConsultations) ? patientConsultations.map(c => ({
                        date: c.created,
                        motif: c.field_motif,
                        temperature: c.field_temperature,
                        tension: c.field_tension_arterielle,
                        poids: c.field_poids,
                        titre: c.title,
                        nid: c.nid
                    })) : [],
                    prescriptions: {
                        medicaments: prescribedMedications,
                        examens: prescribedExams,
                        totalCommandes: patientOrders.length,
                        montantTotal: Array.isArray(patientOrders) ?
                            patientOrders.reduce((sum, o) => sum + (parseFloat(o.field_total_vente) || 0), 0) :
                            0
                    },
                    alertes: {
                        allergies: medicationAlerts,
                        hasAllergies: medicationAlerts.length > 0
                    }
                };
            } catch (error) {
                console.error("Erreur lors de la récupération des infos patient:", error);
                throw error;
            } finally {
                isTyping.value = false;
            }
        };


        // Gestion patient
        const openPatientModal = () => {
            showPatientModal.value = true
        }

        const closePatientModal = () => {
            showPatientModal.value = false
        }

        const savePatient = async (patientData) => {
            console.log("Patient sélectionné:", patientData.nid);
            patientInfo.value = patientData;
            patientCardVisible.value = true;
            closePatientModal();

            try {
                const patientFullInfo = await getPatientFullInfo(patientData.nid);
                console.log("Informations complètes du patient:", patientFullInfo);
                if (patientFullInfo) {
                    // Créer un message avec toutes les informations
                    let infoMessage = `
                        <div class="space-y-4">
                            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 class="font-bold text-blue-800 mb-2">Dossier Patient: ${patientFullInfo.patient.nom}</h3>
                                <div class="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span class="font-semibold">Âge:</span> ${patientFullInfo.patient.age || 'N/A'} ans
                                    </div>
                                    <div>
                                        <span class="font-semibold">Sexe:</span> ${patientFullInfo.patient.sexe || 'N/A'}
                                    </div>
                                    <div class="col-span-2">
                                        <span class="font-semibold">Allergies:</span> 
                                        <span class="${patientFullInfo.alertes.hasAllergies ? 'text-red-600 font-bold' : 'text-green-600'}">
                                            ${patientFullInfo.patient.allergies}
                                        </span>
                                    </div>
                                </div>
                            </div>
                    `;

                    // Ajouter les alertes allergies si présentes
                    if (patientFullInfo.alertes.hasAllergies) {
                        infoMessage += `
                            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h4 class="font-bold text-red-800 mb-2">Alertes Allergies Médicamenteuses</h4>
                                <ul class="list-disc list-inside text-sm text-red-700">
                        `;
                        patientFullInfo.alertes.allergies.forEach(alerte => {
                            infoMessage += `
                                <li>
                                    <span class="font-semibold">${alerte.medication}</span> 
                                    contient l'allergène: <span class="font-bold">${alerte.allergene}</span>
                                    (Prescrit le ${new Date(alerte.date).toLocaleDateString()})
                                </li>
                            `;
                        });
                        infoMessage += `</ul></div>`;
                    }

                    // Ajouter les consultations
                    if (patientFullInfo.consultations.length > 0) {
                        infoMessage += `
                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 class="font-bold text-gray-800 mb-2">- Consultations (${patientFullInfo.consultations.length})</h4>
                                <div class="space-y-2 max-h-60 overflow-y-auto">
                        `;
                        patientFullInfo.consultations.forEach(cons => {
                            infoMessage += `
                                <div class="bg-white p-3 rounded border border-gray-100 text-sm">
                                    <div class="flex justify-between">
                                        <span class="font-semibold">${formatDate(null, cons.date, "short")}</span>
                                        <span class="text-gray-500">${cons.titre}</span>
                                    </div>
                                    <p class="text-gray-700 mt-1"><span class="font-semibold">Motif:</span> ${cons.motif || 'N/A'}</p>
                                    <div class="grid grid-cols-3 gap-2 mt-1 text-xs">
                                        <span>Temp: ${cons.temperature || '-'}°C</span>
                                        <span>Tension: ${cons.tension || '-'}</span>
                                        <span>Poids: ${cons.poids || '-'} kg</span>
                                    </div>
                                </div>
                            `;
                        });
                        infoMessage += `</div></div>`;
                    }

                    // Ajouter les médicaments prescrits
                    if (patientFullInfo.prescriptions.medicaments.length > 0) {
                        infoMessage += `
                            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 class="font-bold text-green-800 mb-2">- Médicaments Prescrits (${patientFullInfo.prescriptions.medicaments.length})</h4>
                                <div class="space-y-2 max-h-60 overflow-y-auto">
                        `;
                        patientFullInfo.prescriptions.medicaments.forEach(med => {
                            const stockStatus = med.stockActuel < 10 ? 'text-red-600 font-bold' : 'text-green-600';
                            infoMessage += `
                                <div class="bg-white p-3 rounded border border-green-100 text-sm">
                                    <div class="flex justify-between">
                                        <span class="font-semibold">${med.name}</span>
                                        <span class="text-gray-500">${formatDate(null, med.date, "short")}</span>
                                    </div>
                                    <div class="flex justify-between mt-1">
                                        <span>Quantité prescrite: ${med.quantite} ${med.unite}</span>
                                        <span class="${stockStatus}">Stock actuel: ${med.stockActuel} ${med.unite}</span>
                                    </div>
                                </div>
                            `;
                        });
                        infoMessage += `</div></div>`;
                    }

                    // Ajouter les examens prescrits
                    if (patientFullInfo.prescriptions.examens.length > 0) {
                        infoMessage += `
                            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <h4 class="font-bold text-purple-800 mb-2">- Examens Prescrits (${patientFullInfo.prescriptions.examens.length})</h4>
                                <ul class="list-disc list-inside text-sm space-y-1">
                        `;
                        patientFullInfo.prescriptions.examens.forEach(exam => {
                            infoMessage += `
                                <li class="flex justify-between">
                                    <span class="font-semibold">${exam.name}</span>
                                    <span class="text-gray-500">${formatDate(null, exam.date, "short")} - ${exam.prix} Ar</span>
                                </li>
                            `;
                        });
                        infoMessage += `</ul>`;
                        infoMessage += `<p class="text-sm font-semibold mt-2 pt-2 border-t border-purple-200">Total des dépenses: ${patientFullInfo.prescriptions.montantTotal} Ar</p>`;
                        infoMessage += `</div>`;
                    }

                    infoMessage += `</div>`;

                    // Ajouter le message dans le chat
                    messages.value.push({
                        type: 'ai',
                        content: infoMessage,
                        time: new Date().toLocaleTimeString()
                    });
                }
            } catch (error) {
                console.error("Erreur:", error);
                messages.value.push({
                    type: 'ai',
                    content: `
                        <div class="bg-red-50 border-l-4 border-red-400 p-3 text-red-700">
                            <p class="font-medium">Erreur lors du chargement des informations du patient</p>
                            <p class="text-sm">${error.message}</p>
                        </div>
                    `,
                    time: new Date().toLocaleTimeString()
                });
            } finally {
                scrollToBottom();
            }
        };

        const removePatientCard = () => {
            patientCardVisible.value = false
            patientInfo.value = {
                name: '',
                age: null,
                gender: '',
                allergies: '',
            }
        }

        // Gestion médicaments
        const openMedicationModal = () => {
            showMedicationModal.value = true
        }

        const closeMedicationModal = () => {
            showMedicationModal.value = false
        }

        // Fonction pour récupérer toutes les informations d'un médicament
        const getMedicationFullInfo = async (medicationData) => {
            try {
                isTyping.value = true;

                // 1. Récupérer les infos de base du médicament depuis le store
                let medication = null;
                const currentArticles = [...(store.articles?.rows || [])];

                try {
                    // Chercher d'abord dans la liste existante
                    medication = currentArticles.find(a => a.nid === medicationData.nid);

                    // Si pas trouvé, faire un appel API spécifique
                    if (!medication) {
                        await store.fetchArticles({
                            fields: ['nid', 'title', 'field_quantite_stock', 'field_unite', 'created', 'field_description', 'field_prix_vente', 'field_date_expiration'],
                            filters: {
                                nid: {
                                    val: medicationData.nid,
                                    op: '='
                                }
                            },
                            pager: 0,
                            offset: 1
                        });
                        medication = store.articles?.rows?.[0];
                    }
                } catch (error) {
                    console.error("Erreur récupération médicament:", error);
                }

                if (!medication) {
                    throw new Error("Médicament non trouvé dans l'inventaire");
                }
                console.log("Informations du médicament récupérées:", medication);
                // 2. Récupérer l'historique des prescriptions de ce médicament
                const currentOrders = [...(orderStore.orders?.rows || [])];
                const medicationPrescriptions = [];

                try {
                    // Chercher dans toutes les commandes où ce médicament apparaît
                    await orderStore.fetchOrders({
                        fields: [
                            'nid',
                            'title',
                            'field_articles',
                            'field_client',
                            'field_date',
                            'created'
                        ],
                        values: {
                            field_client: ['nid', 'title', 'field_allergies']
                        },
                        pager: 0,
                        sort: { val: 'created', op: 'desc' }
                    });

                    const allOrders = orderStore.orders?.rows || [];
                    console.log("Toutes les commandes récupérées pour analyse des prescriptions:", allOrders);
                    // Filtrer les commandes contenant ce médicament
                    allOrders.forEach(order => {
                        if (order.field_articles && Array.isArray(order.field_articles)) {
                            order.field_articles.forEach(article => {
                                if (article.field_article?.nid === medicationData.nid) {
                                    medicationPrescriptions.push({
                                        orderId: order.nid,
                                        orderTitle: order.title,
                                        date: order.field_date || order.created,
                                        client: order.field_client?.title || 'Inconnu',
                                        clientNid: order.field_client?.nid,
                                        clientAllergies: order.field_client?.field_allergies || '',
                                        quantite: article.field_quantite || 0,
                                        prix: article.field_prix || medication.field_prix_vente || 0
                                    });
                                }
                            });
                        }
                    });

                    // Restaurer les commandes
                    orderStore.orders = { ...orderStore.orders, rows: currentOrders };
                } catch (error) {
                    console.error("Erreur récupération prescriptions:", error);
                }

                // 3. Identifier les patients allergiques à ce médicament
                const currentPatients = [...(clientStore.allClients?.rows || [])];
                const allergicPatients = [];
                const medicationName = medication.title.toLowerCase();

                // Parcourir tous les patients pour vérifier les allergies
                currentPatients.forEach(patient => {
                    if (patient.field_allergies) {
                        const allergies = patient.field_allergies.split(',').map(a => a.trim().toLowerCase());

                        // Vérifier si le nom du médicament correspond à une allergie
                        const matchingAllergies = allergies.filter(allergy =>
                            medicationName.includes(allergy) || allergy.includes(medicationName)
                        );

                        if (matchingAllergies.length > 0) {
                            // Vérifier si ce patient a déjà eu ce médicament
                            const hasPrescription = medicationPrescriptions.some(p => p.clientNid === patient.nid);

                            allergicPatients.push({
                                nid: patient.nid,
                                nom: patient.title,
                                age: patient.field_age,
                                sexe: patient.field_sexe,
                                allergies: patient.field_allergies,
                                allergiesMatch: matchingAllergies,
                                hasPrescription: hasPrescription,
                                prescriptions: medicationPrescriptions.filter(p => p.clientNid === patient.nid)
                            });
                        }
                    }
                });

                // 4. Récupérer des informations complémentaires via l'IA (optionnel)
                let aiInfo = null;
                if (medication) {
                    try {
                        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
                        const apiUrl = 'https://api.openai.com/v1/chat/completions';

                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                model: 'gpt-4o-mini',
                                messages: [
                                    {
                                        role: 'system',
                                        content: 'Tu es un assistant médical expert. Fournis des informations concises et précises sur les médicaments en français, au format HTML simple.'
                                    },
                                    {
                                        role: 'user',
                                        content: `Donne-moi des informations sur le médicament "${medication.title}" : 
                                - Indications principales
                                - Contre-indications
                                - Effets secondaires courants
                                - Précautions d'emploi
                                Réponds en HTML simple avec des puces.`
                                    }
                                ],
                                max_tokens: 500,
                                temperature: 0.7
                            })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            aiInfo = data.choices[0].message.content;
                        }
                    } catch (error) {
                        console.error("Erreur API OpenAI:", error);
                    }
                }

                return {
                    medication: {
                        nid: medication.nid,
                        nom: medication.title,
                        stock: medication.field_quantite_stock || 0,
                        unite: medication.field_unite || 'unités',
                        prix: medication.field_prix_vente || 'Non défini',
                        dateExpiration: medication.field_date_expiration,
                        description: medication.field_description,
                        dateAjout: medication.created
                    },
                    prescriptions: {
                        total: medicationPrescriptions.length,
                        historique: medicationPrescriptions.sort((a, b) => (b.date || 0) - (a.date || 0)),
                        patientsUniques: [...new Set(medicationPrescriptions.map(p => p.clientNid))].length
                    },
                    allergies: {
                        patientsAllergiques: allergicPatients,
                        totalAllergiques: allergicPatients.length,
                        patientsRisque: allergicPatients.filter(p => !p.hasPrescription).length // Patients allergiques jamais exposés
                    },
                    aiInfo: aiInfo
                };
            } catch (error) {
                console.error("Erreur lors de la récupération des infos médicament:", error);
                throw error;
            } finally {
                isTyping.value = false;
            }
        };

        // const addMedication = (medicationData) => {
        //     selectedMedications.value = medicationData;
        //     closeMedicationModal()
        // }


        const addMedication = async (medicationData) => {
            selectedMedications.value = medicationData;
            closeMedicationModal();

            try {
                const medicationFullInfo = await getMedicationFullInfo(medicationData);
                console.log("Informations complètes du médicament:", medicationFullInfo);

                if (medicationFullInfo) {
                    // Déterminer le statut du stock
                    const stockStatus = medicationFullInfo.medication.stock < 10 ? 'critique' :
                        medicationFullInfo.medication.stock < 20 ? 'faible' : 'normal';

                    const stockColor = stockStatus === 'critique' ? 'text-red-600' :
                        stockStatus === 'faible' ? 'text-orange-600' : 'text-green-600';

                    // Créer le message HTML
                    let infoMessage = `
                <div class="space-y-4">
                    <!-- En-tête médicament -->
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 class="font-bold text-blue-800 mb-2">💊 ${medicationFullInfo.medication.nom}</h3>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span class="font-semibold">Stock actuel:</span> 
                                <span class="${stockColor} font-bold">${medicationFullInfo.medication.stock} ${medicationFullInfo.medication.unite}</span>
                                <span class="text-xs ml-1">(${stockStatus})</span>
                            </div>
                            <div>
                                <span class="font-semibold">Prix:</span> ${medicationFullInfo.medication.prix} Ar
                            </div>
                            ${medicationFullInfo.medication.dateExpiration ? `
                            <div>
                                <span class="font-semibold">Date d'expiration:</span> 
                                ${formatDate(null, medicationFullInfo.medication.dateExpiration)}
                            </div>
                            ` : ''}
                            <div>
                                <span class="font-semibold">Ajouté le:</span> 
                                ${formatDate(null, medicationFullInfo.medication.dateAjout)}
                            </div>
                        </div>
                        ${medicationFullInfo.medication.description ? `
                        <div class="mt-2 text-sm">
                            <span class="font-semibold">Description:</span> ${medicationFullInfo.medication.description}
                        </div>
                        ` : ''}
                    </div>
            `;

                    // Alertes allergies
                    if (medicationFullInfo.allergies.totalAllergiques > 0) {
                        infoMessage += `
                    <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 class="font-bold text-red-800 mb-2">⚠️ Alertes Allergies (${medicationFullInfo.allergies.totalAllergiques} patients)</h4>
                        <div class="space-y-2 max-h-60 overflow-y-auto">
                `;

                        medicationFullInfo.allergies.patientsAllergiques.forEach(patient => {
                            const alertClass = patient.hasPrescription ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';
                            const alertIcon = patient.hasPrescription ? '⚠️ Déjà prescrit' : '🚫 Jamais prescrit';

                            infoMessage += `
                        <div class="p-3 rounded border ${alertClass} text-sm">
                            <div class="flex justify-between items-start">
                                <div>
                                    <span class="font-semibold">${patient.nom}</span>
                                    ${patient.age ? ` - ${patient.age} ans` : ''}
                                    ${patient.sexe ? ` - ${patient.sexe}` : ''}
                                </div>
                                <span class="text-xs font-semibold ${patient.hasPrescription ? 'text-orange-600' : 'text-red-600'}">${alertIcon}</span>
                            </div>
                            <div class="mt-1">
                                <span class="font-semibold">Allergies:</span> 
                                <span class="text-red-600">${patient.allergies}</span>
                            </div>
                            <div class="mt-1 text-xs">
                                <span class="font-semibold">Allergènes détectés:</span> 
                                ${patient.allergiesMatch.map(a => `<span class="bg-red-100 px-1 rounded">${a}</span>`).join(' ')}
                            </div>
                            ${patient.hasPrescription && patient.prescriptions.length > 0 ? `
                            <div class="mt-1 text-xs">
                                <span class="font-semibold">Dernière prescription:</span> 
                                ${formatDate(null, patient.prescriptions[0].date)}
                            </div>
                            ` : ''}
                        </div>
                    `;
                        });

                        infoMessage += `</div></div>`;
                    }

                    // Statistiques des prescriptions
                    if (medicationFullInfo.prescriptions.total > 0) {
                        infoMessage += `
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 class="font-bold text-green-800 mb-2">📊 Historique des Prescriptions</h4>
                        <div class="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div class="bg-white p-2 rounded">
                                <div class="text-xl font-bold text-green-600">${medicationFullInfo.prescriptions.total}</div>
                                <div class="text-xs">Prescriptions</div>
                            </div>
                            <div class="bg-white p-2 rounded">
                                <div class="text-xl font-bold text-blue-600">${medicationFullInfo.prescriptions.patientsUniques}</div>
                                <div class="text-xs">Patients</div>
                            </div>
                            <div class="bg-white p-2 rounded">
                                <div class="text-xl font-bold text-orange-600">${medicationFullInfo.allergies.patientsRisque}</div>
                                <div class="text-xs">À risque</div>
                            </div>
                        </div>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                `;

                        medicationFullInfo.prescriptions.historique.slice(0, 5).forEach(p => {
                            infoMessage += `
                        <div class="bg-white p-2 rounded border border-green-100 text-sm">
                            <div class="flex justify-between">
                                <span class="font-semibold">${p.client}</span>
                                <span class="text-gray-500">${formatDate(null, p.date)}</span>
                            </div>
                            <div class="flex justify-between text-xs">
                                <span>Quantité: ${p.quantite} ${medicationFullInfo.medication.unite}</span>
                                <span>Montant: ${p.prix * p.quantite} Ar</span>
                            </div>
                        </div>
                    `;
                        });

                        infoMessage += `</div></div>`;
                    }

                    // Informations IA
                    if (medicationFullInfo.aiInfo) {
                        infoMessage += `
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 class="font-bold text-purple-800 mb-2">🤖 Informations complémentaires</h4>
                        <div class="prose prose-sm max-w-none text-sm">
                            ${medicationFullInfo.aiInfo}
                        </div>
                        <p class="text-[10px] text-gray-500 mt-2 italic">Source: IA - À titre informatif</p>
                    </div>
                `;
                    }

                    infoMessage += `</div>`;

                    // Ajouter le message dans le chat
                    messages.value.push({
                        type: 'ai',
                        content: infoMessage,
                        time: new Date().toLocaleTimeString()
                    });
                }
            } catch (error) {
                console.error("Erreur:", error);
                messages.value.push({
                    type: 'ai',
                    content: `
                <div class="bg-red-50 border-l-4 border-red-400 p-3 text-red-700">
                    <p class="font-medium">Erreur lors du chargement des informations du médicament</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `,
                    time: new Date().toLocaleTimeString()
                });
            } finally {
                scrollToBottom();
            }
        };



        const removeSelectedMedication = () => {
            selectedMedications.value = {
                nid: null,
                name: '',
            };
        }

        return {
            // Refs DOM
            chatContainer,
            messageInput,
            fileInput,

            // État
            messages,
            currentMessage,
            isTyping,
            selectedImage,
            patientCardVisible,
            patientInfo,
            selectedMedications,
            showPatientModal,
            showMedicationModal,

            // Computed
            canSend,

            // Méthodes
            handleInput,
            handleKeyDown,
            sendMessage,
            openPatientModal,
            closePatientModal,
            savePatient,
            removePatientCard,
            openMedicationModal,
            addMedication,
            removeSelectedMedication,
            selectPrompt,
            handleFileSelect,
            triggerFileUpload,
            removeImage
        }
    }
}
</script>

<style>
.chat-container {
    height: calc(100vh - 240px);
}

@media (max-width: 768px) {
    .chat-container {
        height: calc(100vh - 280px);
    }
}

.message-bubble {
    max-width: 95%;
}

@media (min-width: 768px) {
    .message-bubble {
        max-width: 75%;
    }
}

.typing-indicator {
    display: none;
}

.typing-indicator.active {
    display: flex;
}

.typing-dot {
    animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
        opacity: 0.4;
    }

    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}

.prose ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.prose li {
    margin-bottom: 0.25rem;
}
</style>