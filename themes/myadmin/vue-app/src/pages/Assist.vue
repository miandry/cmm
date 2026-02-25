<template>
    <div>
        <header class="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
            <div class="max-w-4xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                        <i class="ri-capsule-line text-white text-lg md:text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-lg md:text-xl font-semibold text-gray-900 leading-tight">Assistant Clinique IA</h1>
                        <p class="text-[10px] md:text-sm text-gray-500 line-clamp-1 md:line-clamp-none">Basé sur l'inventaire clinique</p>
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
                <div ref="chatContainer" class="chat-container overflow-y-auto px-2 md:px-6 py-3 md:py-6 space-y-3 md:space-y-6">
                    <!-- Message de bienvenue -->
                    <div class="flex items-start space-x-3 mb-4">
                        <div class="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <i class="ri-robot-2-line text-white text-lg"></i>
                        </div>
                        <div class="flex-1">
                            <div class="message-bubble bg-gray-100 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 md:py-3 mb-4">
                                <p class="text-sm md:text-base font-medium text-gray-900 mb-1">Bonjour Docteur !</p>
                                <p class="text-sm md:text-base text-gray-700">Je suis votre Assistant Clinique. Je peux vous aider à analyser les stocks, consulter l'historique des patients ou préparer des recommandations basées sur les données réelles de la clinique.</p>
                                <p class="text-[11px] text-gray-500 mt-2 font-medium italic flex items-center">
                                    <i class="ri-radio-button-line text-green-500 mr-1 animate-pulse"></i>
                                    Connecté à l'inventaire en temps réel
                                </p>
                            </div>

                            <!-- Suggestions rapides -->
                            <div class="flex flex-wrap gap-1.5 mt-3">
                                <button @click="selectPrompt('patients', 'Donne-moi la liste de tous les patients avec leurs informations')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-user-heart-line text-teal-400 text-xs"></i>
                                    <span>Patients</span>
                                </button>
                                <button @click="selectPrompt('stock', 'Fais-moi un résumé des stocks critiques (faible quantité)')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-error-warning-line text-red-400 text-xs"></i>
                                    <span>Stocks critiques</span>
                                </button>
                                <button @click="selectPrompt('consultations', 'Quelles sont les dernières consultations enregistrées ?')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-stethoscope-line text-blue-400 text-xs"></i>
                                    <span>Consultations</span>
                                </button>
                                <button @click="selectPrompt('examens', 'Donne-moi la liste des examens disponibles avec leurs prix')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-test-tube-line text-green-400 text-xs"></i>
                                    <span>Examens & Tarifs</span>
                                </button>
                                <button @click="selectPrompt('ventes', 'Quelles ont été les dernières ventes réalisées ?')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-shopping-bag-2-line text-purple-400 text-xs"></i>
                                    <span>Ventes</span>
                                </button>
                                <button @click="selectPrompt('ventes', 'Montre-moi l\'évolution des ventes par semaine et par jour sous forme de graphique')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-bar-chart-groupped-line text-indigo-400 text-xs"></i>
                                    <span>Graphique ventes</span>
                                </button>
                                <button @click="selectPrompt('today', 'Quel patient a consulté aujourd\'hui ?')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-calendar-check-line text-orange-400 text-xs"></i>
                                    <span>Consultations aujourd'hui</span>
                                </button>
                                <button @click="selectPrompt('sales_today', 'Quel est le total des ventes aujourd\'hui ?')" 
                                    class="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-[11px] font-medium text-gray-600">
                                    <i class="ri-money-dollar-circle-line text-emerald-400 text-xs"></i>
                                    <span>Total ventes aujourd'hui</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Messages dynamiques -->
                    <div v-for="(message, index) in messages" :key="index">
                        <!-- Message utilisateur -->
                        <div v-if="message.type === 'user'" class="flex items-start space-x-3 justify-end">
                            <div class="message-bubble bg-primary text-white rounded-2xl rounded-tr-sm px-3 md:px-4 py-2 md:py-3 max-w-[80%]">
                                <img v-if="message.image" :src="message.image" class="w-full h-auto rounded-lg mb-2 border-2 border-white/20" alt="Image analysée">
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
                                <div class="prose prose-sm max-w-none text-[13px] md:text-sm" v-html="message.content"></div>
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
                                <p class="text-xs font-semibold text-gray-900 truncate">{{ patientInfo.name || '-' }}</p>
                            </div>
                            <div class="grid grid-cols-3 sm:block gap-2 sm:gap-0">
                                <div>
                                    <p class="text-[10px] text-gray-500 mb-0.5">Âge</p>
                                    <p class="text-xs font-semibold text-gray-900">{{ patientInfo.age ? `${patientInfo.age} ans` : '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-gray-500 mb-0.5">Sexe</p>
                                    <p class="text-xs font-semibold text-gray-900 capitalize">{{ patientInfo.gender || '-' }}</p>
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
                            <button @click="removeSelectedMedication"
                                class="text-gray-500 hover:text-red-500 ml-2">
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
                            <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileSelect">
                            <button @click="triggerFileUpload"
                                class="flex items-center justify-center bg-gray-50 text-gray-700 w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                title="Ajouter une image (Radio, Echo, etc.)"
                                :disabled="isProcessingImage">
                                <i v-if="isProcessingImage" class="ri-loader-4-line animate-spin"></i>
                                <i v-else class="ri-attachment-2 active:scale-95 transition-transform"></i>
                            </button>
                        </div>
                        
                        <!-- Image Preview -->
                        <div v-if="selectedImage" class="relative group inline-block">
                            <img :src="selectedImage" class="h-20 w-auto rounded-lg border border-gray-200 object-cover" alt="Preview">
                            <button @click="removeImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-red-600">
                                <i class="ri-close-line text-xs"></i>
                            </button>
                        </div>
                        
                        <!-- Textarea and Send Row -->
                        <div class="flex space-x-2">
                             <textarea ref="messageInput" v-model="currentMessage" @input="handleInput"
                            @keydown="handleKeyDown"
                            placeholder="Écrivez votre message..."
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
        const activeSuggestion = ref(null)

        // État patient
        const patientCardVisible = ref(false)
        const patientInfo = ref({
            name: '',
            age: null,
            gender: '',
            allergies: '',
            phone: '',
            email: '',
            adresse: '',
            assurance: '0',
            contactUrgence: '',
            notesMedicales: '',
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
                fields: ['nid', 'title', 'field_quantite_stock', 'field_unite'],
                pager: 0,
                offset: 50,
                sort: { val: 'title', op: 'asc' }
            });

            // Charger les patients au montage
            await clientStore.fetchAllClients({
                fields: ['nid', 'title', 'field_age', 'field_sexe', 'field_allergies', 'field_phone', 'field_email', 'field_adresse', 'field_assurance', 'field_contact_d_urgence', 'field_notes_medicales'],
                pager: 0,
                offset: 50,
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
                    'field_medicaments',
                    'field_examens',
                    'created'
                ],
                pager: 0,
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });

            // Charger les examens au montage
            await examenStore.fetchExamens({
                pager: 0,
                offset: 50
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

            // Helper pour formater une consultation proprement
            const formatConsultation = (c, includePatient = true) => {
                const parts = [];
                if (includePatient) parts.push(`Patient: ${c.patient_name || 'Anonyme'}`);
                if (c.motif) parts.push(`Motif: ${c.motif}`);
                const constantes = [];
                if (c.temperature) constantes.push(`Temp: ${c.temperature}°C`);
                if (c.tension_arterielle) constantes.push(`Tension: ${c.tension_arterielle}`);
                if (c.poids) constantes.push(`Poids: ${c.poids}kg`);
                if (constantes.length) parts.push(`Constantes: [${constantes.join(', ')}]`);
                const meds = c.medications?.map(m => m.title).filter(Boolean);
                if (meds?.length) parts.push(`Médicaments: [${meds.join(', ')}]`);
                const exams = c.exams?.map(e => e.title).filter(Boolean);
                if (exams?.length) parts.push(`Examens: [${exams.join(', ')}]`);
                if (c.date) parts.push(`Date: ${c.date}`);
                return `- ${parts.join(', ')}`;
            };

            // Helper pour formater une vente
            const formatSale = (o) => {
                const products = o.products?.map(p => `${p.title} (x${p.quantity})`).join(', ') || 'Aucun produit';
                const exams = o.exams?.map(e => e.title).join(', ') || 'Aucun examen';
                return `- Commande #${o.order_number}, Client: ${o.client_name || 'Anonyme'}, Produits: [${products}], Examens: [${exams}], Total: ${o.total} Ar`;
            };

            // Définition des tools/functions pour RAG
            const tools = [
                {
                    type: "function",
                    function: {
                        name: "patients_search",
                        description: "Rechercher un patient par nom, téléphone, email ou adresse. Utilise cette fonction quand l'utilisateur demande des informations sur un patient spécifique ou cherche un patient.",
                        parameters: {
                            type: "object",
                            properties: {
                                query: { 
                                    type: "string", 
                                    description: "Terme de recherche (nom, téléphone, email, etc.)" 
                                },
                                limit: { 
                                    type: "number", 
                                    description: "Nombre maximum de résultats (défaut: 20)" 
                                }
                            },
                            required: ["query"]
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "rag_search",
                        description: "Rechercher le dossier complet d'un patient incluant ses consultations, ventes et historique médical. Utilise cette fonction pour un résumé ou historique patient.",
                        parameters: {
                            type: "object",
                            properties: {
                                patient_id: { 
                                    type: "number", 
                                    description: "ID du patient (nid)" 
                                },
                                query: { 
                                    type: "string", 
                                    description: "Type d'information recherchée (historique, consultations, ventes, etc.)" 
                                }
                            },
                            required: ["patient_id", "query"]
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "medications_search",
                        description: "Rechercher des médicaments par nom ou filtrer par stock. Utilise pour les requêtes sur les médicaments, stocks, ou articles.",
                        parameters: {
                            type: "object",
                            properties: {
                                query: { 
                                    type: "string", 
                                    description: "Nom du médicament à rechercher" 
                                },
                                low_stock_only: { 
                                    type: "boolean", 
                                    description: "Filtrer uniquement les stocks bas (quantité <= 10)" 
                                },
                                limit: { 
                                    type: "number", 
                                    description: "Nombre maximum de résultats (défaut: 50)" 
                                }
                            },
                            required: []
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "consultations_search",
                        description: "Rechercher des consultations par patient, date ou motif. Utilise pour l'historique des consultations.",
                        parameters: {
                            type: "object",
                            properties: {
                                patient_id: { 
                                    type: "number", 
                                    description: "ID du patient pour filtrer" 
                                },
                                date_from: { 
                                    type: "string", 
                                    description: "Date de début (YYYY-MM-DD)" 
                                },
                                date_to: { 
                                    type: "string", 
                                    description: "Date de fin (YYYY-MM-DD)" 
                                },
                                limit: { 
                                    type: "number", 
                                    description: "Nombre maximum de résultats (défaut: 20)" 
                                }
                            },
                            required: []
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "sales_search",
                        description: "Rechercher des ventes/commandes par client, date ou produit. Utilise pour l'historique des ventes.",
                        parameters: {
                            type: "object",
                            properties: {
                                client_id: { 
                                    type: "number", 
                                    description: "ID du client pour filtrer" 
                                },
                                date_from: { 
                                    type: "string", 
                                    description: "Date de début (YYYY-MM-DD)" 
                                },
                                date_to: { 
                                    type: "string", 
                                    description: "Date de fin (YYYY-MM-DD)" 
                                },
                                limit: { 
                                    type: "number", 
                                    description: "Nombre maximum de résultats (défaut: 20)" 
                                }
                            },
                            required: []
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "today_stats",
                        description: "Obtenir les statistiques du jour: consultations, ventes totales, et stocks bas. Utilise pour les requêtes sur 'aujourd'hui'.",
                        parameters: {
                            type: "object",
                            properties: {},
                            required: []
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "semantic_search",
                        description: "Recherche sémantique globale across patients, médicaments, consultations et ventes. Utilise pour les requêtes générales ou ambiguës.",
                        parameters: {
                            type: "object",
                            properties: {
                                query: { 
                                    type: "string", 
                                    description: "Requête de recherche" 
                                },
                                types: { 
                                    type: "array", 
                                    items: { type: "string" },
                                    description: "Types d'entités à rechercher: patient, medication, consultation, sale" 
                                },
                                limit: { 
                                    type: "number", 
                                    description: "Nombre maximum de résultats par type (défaut: 10)" 
                                }
                            },
                            required: ["query"]
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "plan_consultation",
                        description: "Planifier la prochaine consultation d'un patient en analysant l'évolution de son état de santé (tendances poids, tension, température, médicaments prescrits). Retourne une recommandation de date et de motif.",
                        parameters: {
                            type: "object",
                            properties: {
                                patient_id: { 
                                    type: "number", 
                                    description: "ID du patient (nid)" 
                                },
                                urgency_level: { 
                                    type: "string", 
                                    enum: ["routine", "surveillance", "urgent"],
                                    description: "Niveau d'urgence: routine (contrôle normal), surveillance (pathologie chronique), urgent (symptômes inquiétants)" 
                                },
                                notes: { 
                                    type: "string", 
                                    description: "Notes médicales ou observations pour la planification" 
                                }
                            },
                            required: ["patient_id"]
                        }
                    }
                }
            ];

            // Fonction pour exécuter les tool calls
            const executeToolCall = async (toolName, args) => {
                console.log(`Executing tool: ${toolName}`, args);
                
                switch (toolName) {
                    case 'patients_search': {
                        const response = await fetch('/api/rag/patients', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                query: args.query, 
                                limit: args.limit || 20 
                            })
                        });
                        const data = await response.json();
                        return JSON.stringify(data.data || []);
                    }
                    
                    case 'rag_search': {
                        // D'abord récupérer les infos patient
                        const patientResponse = await fetch('/api/rag/patients', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ query: String(args.patient_id) })
                        });
                        const patientData = await patientResponse.json();
                        
                        // Puis les consultations du patient
                        const consultResponse = await fetch('/api/rag/consultations', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ patient_id: args.patient_id, limit: 20 })
                        });
                        const consultData = await consultResponse.json();
                        
                        // Et les ventes du patient
                        const salesResponse = await fetch('/api/rag/sales', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ client_id: args.patient_id, limit: 20 })
                        });
                        const salesData = await salesResponse.json();
                        
                        return JSON.stringify({
                            patient: patientData.data?.[0] || null,
                            consultations: consultData.data || [],
                            sales: salesData.data || []
                        });
                    }
                    
                    case 'medications_search': {
                        const params = new URLSearchParams();
                        if (args.query) params.append('query', args.query);
                        if (args.low_stock_only) params.append('low_stock_only', 'true');
                        if (args.limit) params.append('limit', args.limit);
                        
                        const response = await fetch(`/api/rag/medications?${params.toString()}`);
                        const data = await response.json();
                        return JSON.stringify(data.data || []);
                    }
                    
                    case 'consultations_search': {
                        const response = await fetch('/api/rag/consultations', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                patient_id: args.patient_id,
                                date_from: args.date_from,
                                date_to: args.date_to,
                                limit: args.limit || 20 
                            })
                        });
                        const data = await response.json();
                        return JSON.stringify(data.data || []);
                    }
                    
                    case 'sales_search': {
                        const response = await fetch('/api/rag/sales', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                client_id: args.client_id,
                                date_from: args.date_from,
                                date_to: args.date_to,
                                limit: args.limit || 20 
                            })
                        });
                        const data = await response.json();
                        return JSON.stringify(data.data || []);
                    }
                    
                    case 'today_stats': {
                        const response = await fetch('/api/rag/today');
                        const data = await response.json();
                        return JSON.stringify(data);
                    }
                    
                    case 'semantic_search': {
                        const response = await fetch('/api/rag/semantic', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                query: args.query,
                                types: args.types || ['patient', 'medication', 'consultation', 'sale'],
                                limit: args.limit || 10
                            })
                        });
                        const data = await response.json();
                        return JSON.stringify(data.results || {});
                    }
                    
                    case 'plan_consultation': {
                        // Récupérer les infos patient
                        const patientResponse = await fetch('/api/rag/patients', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ query: String(args.patient_id) })
                        });
                        const patientData = await patientResponse.json();
                        const patient = patientData.data?.[0] || null;
                        
                        // Récupérer l'historique des consultations
                        const consultResponse = await fetch('/api/rag/consultations', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ patient_id: args.patient_id, limit: 10 })
                        });
                        const consultData = await consultResponse.json();
                        const consultations = consultData.data || [];
                        
                        // Analyser l'évolution de l'état de santé
                        const healthEvolution = {
                            patient: patient,
                            consultations_count: consultations.length,
                            last_consultation: consultations[0] || null,
                            consultations_history: consultations,
                            trends: {
                                poids: consultations.filter(c => c.poids).map(c => ({ date: c.date, value: c.poids })).reverse(),
                                tension: consultations.filter(c => c.tension_arterielle).map(c => ({ date: c.date, value: c.tension_arterielle })).reverse(),
                                temperature: consultations.filter(c => c.temperature).map(c => ({ date: c.date, value: c.temperature })).reverse()
                            },
                            medications_prescribed: [...new Set(consultations.flatMap(c => c.medications?.map(m => m.title) || []))],
                            urgency_level: args.urgency_level || 'routine',
                            notes: args.notes || ''
                        };
                        
                        // Calculer la date recommandée
                        const today = new Date();
                        let recommendedDays = 30; // défaut: 1 mois
                        
                        if (args.urgency_level === 'urgent') {
                            recommendedDays = 3;
                        } else if (args.urgency_level === 'surveillance') {
                            recommendedDays = 14;
                        } else if (consultations.length > 0) {
                            // Analyser les tendances pour ajuster
                            const lastConsult = new Date(consultations[0].created * 1000);
                            const daysSinceLastConsult = Math.floor((today - lastConsult) / (1000 * 60 * 60 * 24));
                            
                            // Si dernière consultation récente (< 7 jours), proposer plus tard
                            if (daysSinceLastConsult < 7) {
                                recommendedDays = 30 - daysSinceLastConsult;
                            }
                        }
                        
                        const recommendedDate = new Date(today);
                        recommendedDate.setDate(today.getDate() + recommendedDays);
                        
                        healthEvolution.recommended_date = recommendedDate.toISOString().split('T')[0];
                        healthEvolution.recommended_days = recommendedDays;
                        
                        return JSON.stringify(healthEvolution);
                    }
                    
                    default:
                        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
                }
            };

            // Construire le contexte initial (patient/médicament sélectionné)
            let initialContext = '';
            
            if (patientCardVisible.value) {
                initialContext += `
            DOSSIER DU PATIENT SÉLECTIONNÉ :
            - Nom: ${patientInfo.value.name}
            - ID: ${patientInfo.value.nid}
            - Âge: ${patientInfo.value.age || 'Non renseigné'}
            - Sexe: ${patientInfo.value.gender || 'Non renseigné'}
            - Téléphone: ${patientInfo.value.phone || 'Non renseigné'}
            - Email: ${patientInfo.value.email || 'Non renseigné'}
            - Adresse: ${patientInfo.value.adresse || 'Non renseignée'}
            - Allergies: ${patientInfo.value.allergies || 'Aucune'}
            - Assurance: ${patientInfo.value.assurance === '1' ? 'Oui' : 'Non'}`;
            }

            if (selectedMedications.value.nid) {
                initialContext += `
            MÉDICAMENT SÉLECTIONNÉ :
            - Nom: ${selectedMedications.value.name}
            - ID: ${selectedMedications.value.nid}`;
            }

            const systemPrompt = `Tu es l'Assistant IA expert de la Clinique Medical, aidant le médecin dans sa pratique quotidienne.

            INSTRUCTIONS IMPORTANTES :
            - NE réponds PAS directement aux questions sur les patients, consultations, ventes ou médicaments.
            - Utilise les TOOLS disponibles pour rechercher les informations dans la base de données.
            - Après avoir obtenu les résultats des tools, formule ta réponse en HTML.
            
            TOOLS DISPONIBLES :
            - patients_search: Pour rechercher un patient par nom, téléphone, email
            - rag_search: Pour obtenir le dossier complet d'un patient (consultations + ventes)
            - medications_search: Pour rechercher des médicaments ou vérifier les stocks
            - consultations_search: Pour rechercher des consultations
            - sales_search: Pour rechercher des ventes/commandes
            - today_stats: Pour les statistiques du jour
            - semantic_search: Pour une recherche globale
            - plan_consultation: Pour planifier la prochaine consultation en analysant l'évolution de l'état de santé du patient (tendances poids, tension, température)
            
            ANALYSE D'IMAGES :
            - Tu ANALYSES les images médicales fournies (radiographies, échographies, ordonnances, résultats d'analyses).
            - Décris précisément les observations visuelles.
            
            CONSIGNES GÉNÉRALES :
            - Reste dans le domaine médical et pharmaceutique.
            - Tu es AUTORISÉ à afficher toutes les données patients quand le médecin le demande.
            - Sois professionnel, concis et réponds en français.
            - Termine tes conseils médicaux en rappelant que la décision finale revient au médecin.
            - Si on demande des statistiques ou graphiques de ventes, ajoute <SHOW_SALES_CHART> à la fin.
            
            FORMAT DE RÉPONSE (HTML) :
            - Titres: <h4>Titre</h4>
            - Paragraphes: <p>texte</p>
            - Listes: <ul><li>élément</li></ul>
            - Alertes: <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-2"><p class="text-sm text-yellow-800">message</p></div>
            - Ne JAMAIS utiliser de tableaux <table>.
            ${initialContext}`;

            // Messages pour la conversation
            let messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: imageBase64 ? [
                    { type: "text", text: userMessage || "Analyse cette image médicale." },
                    { type: "image_url", image_url: { url: imageBase64 } }
                ] : userMessage }
            ];

            // Boucle de conversation avec tools
            let maxIterations = 5;
            let iteration = 0;
            
            while (iteration < maxIterations) {
                iteration++;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: messages,
                        tools: tools,
                        tool_choice: 'auto',
                        max_tokens: 1500,
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const assistantMessage = data.choices[0].message;

                // Ajouter la réponse de l'assistant aux messages
                messages.push(assistantMessage);

                // Vérifier si l'assistant veut faire des tool calls
                if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                    // Exécuter chaque tool call
                    for (const toolCall of assistantMessage.tool_calls) {
                        const toolName = toolCall.function.name;
                        const toolArgs = JSON.parse(toolCall.function.arguments);
                        
                        console.log(`Tool call requested: ${toolName}`, toolArgs);
                        
                        // Exécuter le tool
                        const toolResult = await executeToolCall(toolName, toolArgs);
                        
                        // Ajouter le résultat aux messages
                        messages.push({
                            role: 'tool',
                            tool_call_id: toolCall.id,
                            content: toolResult
                        });
                    }
                    // Continuer la boucle pour obtenir la réponse finale
                } else {
                    // Pas de tool call, on a la réponse finale
                    return assistantMessage.content;
                }
            }
            
            // Si on atteint la limite d'itérations
            return "<p>Désolé, je n'ai pas pu compléter la recherche. Veuillez reformuler votre question.</p>";
        }

        const selectPrompt = (key, promptText) => {
            activeSuggestion.value = key;
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

        // Gestion patient
        const openPatientModal = () => {
            showPatientModal.value = true
        }

        const closePatientModal = () => {
            showPatientModal.value = false
        }

        const savePatient = async (patientData) => {
            patientInfo.value = patientData
            patientCardVisible.value = true
            closePatientModal()

            // Charger les consultations du patient sélectionné
            await consultationStore.fetchConsultations({
                fields: [
                    'nid',
                    'title',
                    'field_client',
                    'field_motif',
                    'field_temperature',
                    'field_tension_arterielle',
                    'field_poids',
                    'field_medicaments',
                    'field_examens',
                    'created'
                ],
                filters: {
                    field_client: { val: patientData.nid, op: '=' }
                },
                pager: 0,
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });

            // Charger les ventes/commandes du patient sélectionné
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
                filters: {
                    field_client: { val: patientData.nid, op: '=' }
                },
                pager: 0,
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });
        }

        const removePatientCard = async () => {
            patientCardVisible.value = false
            patientInfo.value = {
                name: '',
                age: null,
                gender: '',
                allergies: '',
            }

            // Recharger les consultations générales (sans filtre patient)
            await consultationStore.fetchConsultations({
                fields: [
                    'nid',
                    'title',
                    'field_client',
                    'field_motif',
                    'field_temperature',
                    'field_tension_arterielle',
                    'field_poids',
                    'field_medicaments',
                    'field_examens',
                    'created'
                ],
                pager: 0,
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });

            // Recharger les ventes générales (sans filtre patient)
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
                pager: 0,
                offset: 20,
                sort: { val: 'nid', op: 'desc' }
            });
        }

        // Gestion médicaments
        const openMedicationModal = () => {
            showMedicationModal.value = true
        }

        const closeMedicationModal = () => {
            showMedicationModal.value = false
        }

        const addMedication = (medicationData) => {
            selectedMedications.value = medicationData;
            closeMedicationModal()
        }

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