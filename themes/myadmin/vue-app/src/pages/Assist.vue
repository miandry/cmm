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
                fields: ['nid', 'title', 'field_quantite_stock', 'field_unite'],
                filters: {
                    status: {
                        val: 1,
                        op: "="
                    }
                },
                pager: 0,
                offset: 50,
                sort: { val: 'title', op: 'asc' }
            });

            // Charger les patients au montage
            await clientStore.fetchAllClients({
                fields: ['nid', 'title', 'field_age', 'field_sexe', 'field_allergies'],
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

            let patientContext = '';
            if (patientCardVisible.value) {
                patientContext = `Information sur le patient : Nom: ${patientInfo.value.name}, Âge: ${patientInfo.value.age}, Sexe: ${patientInfo.value.gender}, Allergies: ${patientInfo.value.allergies || 'Aucune'}.`;
            }

            let medicationContext = '';
            if (selectedMedications.value.nid) {
                medicationContext = `Médicament sélectionné pour discussion : ${selectedMedications.value.name}.`;
            }

            // === AJOUT: Recherche dynamique des médicaments demandés ===
            let dynamicInventorySummary = '';

            // Fonction de parsing simple pour extraire les médicaments
            const extractMedicationNames = (query) => {
                // Liste des mots à ignorer (déterminants, prépositions, verbes, etc.)
                const stopWords = [
                    'le', 'la', 'les', 'du', 'de', 'des', 'un', 'une', 'dans', 'pour', 'avec',
                    'est', 'sont', 'et', 'ou', 'mais', 'donc', 'car', 'ni', 'hier', 'aujourd',
                    'verifie', 'vérifie', 'vérifier', 'verifier', 's', 'il', 'elle', 'on',
                    'je', 'tu', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se', 'lui',
                    'moi', 'toi', 'soi', 'stp', 'svp', 's\'il', 'vous', 'plait', 'plaît',
                    'peux', 'peut', 'pouvez', 'pouvoir', 'avoir', 'être', 'faire', 'voir',
                    'donne', 'donner', 'donnez', 'donnes', 's\'il', 'te', 'please', 'please',
                    'stock', 'quantité', 'quantite', 'disponible', 'reste', 'restant',
                    'combien', 'nombre', 'unites', 'unités', 'boites', 'boîtes', 'comprimes',
                    'comprimés', 'ampoules', 'flacons', 'sachets', 'gellules', 'gélules',
                    'sirop', 'pommade', 'creme', 'crème', 'solution', 'suspension', 'susp'
                ];

                // Nettoyer la requête
                let cleanQuery = query.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
                    .replace(/[?!,;:.]/g, ' ') // Remplacer la ponctuation par des espaces
                    .replace(/\s+/g, ' ') // Normaliser les espaces
                    .trim();

                console.log('Requête nettoyée:', cleanQuery);

                // Supprimer les phrases d'introduction courantes
                const introPatterns = [
                    /^(?:verifie|vérifie|peux-tu|peux tu|pourrais-tu|pourrais tu|est-ce que|est ce que|je voudrais|je veux|donne-moi|donne moi)\s+/i,
                    /^(?:la quantite|la quantité|le stock|le nombre|les infos|information sur)\s+(?:d[' e]|de|des)?\s*/i,
                    /^(?:s'il te plait|svp|stp)\s*/i,
                ];

                introPatterns.forEach(pattern => {
                    cleanQuery = cleanQuery.replace(pattern, '');
                });

                console.log('Après suppression intro:', cleanQuery);

                // Extraire les mots significatifs (min 3 caractères, pas dans stopWords)
                const words = cleanQuery.split(/\s+/)
                    .filter(word => word.length > 2 && !stopWords.includes(word))
                    .map(word => word.replace(/[0-9]+/g, '').trim()) // Enlever les chiffres seuls
                    .filter(word => word.length > 0);

                console.log('Mots filtrés:', words);

                // Détecter les noms composés (ex: "amoxicilline acide clavulanique")
                const compoundNames = [];
                let i = 0;
                while (i < words.length) {
                    // Si un mot peut faire partie d'un nom composé (lettres + possiblement chiffres)
                    if (/^[a-z]+(?:[0-9]+)?$/.test(words[i])) {
                        let compound = words[i];
                        let j = i + 1;

                        // Regrouper avec les mots suivants si ça forme un nom composé probable
                        while (j < words.length &&
                            (words[j].length > 2 || /^[0-9]+(?:mg|g|ml|ui)?$/.test(words[j]))) {
                            compound += ' ' + words[j];
                            j++;
                        }

                        if (j > i + 1) {
                            // C'est un nom composé
                            compoundNames.push(compound);
                            i = j;
                        } else {
                            // Mot seul
                            compoundNames.push(words[i]);
                            i++;
                        }
                    } else {
                        i++;
                    }
                }

                console.log('Noms composés détectés:', compoundNames);

                // Dernier nettoyage : enlever les terminaisons comme "disponible", "stp", etc.
                const finalMedications = compoundNames
                    .map(name => {
                        // Enlever les mots de fin non désirés
                        const unwantedEndings = ['disponible', 'stp', 'svp', 'please', 'restant', 'restante'];
                        let cleanName = name;
                        unwantedEndings.forEach(end => {
                            if (cleanName.endsWith(' ' + end)) {
                                cleanName = cleanName.substring(0, cleanName.length - end.length - 1);
                            }
                        });
                        return cleanName;
                    })
                    .filter(name => {
                        // Garder seulement si ça ressemble à un nom de médicament
                        return name.length > 2 &&
                            !stopWords.includes(name) &&
                            !/^\d+$/.test(name); // Pas que des chiffres
                    });

                console.log('Médicaments finaux:', finalMedications);

                // Si on n'a rien trouvé, essayer une approche plus simple
                if (finalMedications.length === 0) {
                    // Chercher des patterns comme "de X" ou "du X"
                    const patterns = [
                        /(?:de|du|des|d')\s+([a-z]+(?: [a-z]+)*)/g,
                        /(?:pour|avec|sans)\s+([a-z]+(?: [a-z]+)*)/g,
                    ];

                    for (const pattern of patterns) {
                        const matches = cleanQuery.matchAll(pattern);
                        for (const match of matches) {
                            if (match[1] && match[1].length > 3) {
                                finalMedications.push(match[1]);
                            }
                        }
                    }
                }

                // Dédupliquer
                return [...new Set(finalMedications)];
            };

            // Détecter si la question concerne le stock
            if (userMessage.toLowerCase().match(/stock|quantité|reste|disponible/i)) {
                const possibleMedications = extractMedicationNames(userMessage);
                console.log("Médicaments potentiels détectés dans la question:", possibleMedications);
                if (possibleMedications.length > 0) {
                    dynamicInventorySummary = '\n\n🔍 **RECHERCHE SPÉCIFIQUE DEMANDÉE:**\n';

                    // Rechercher chaque médicament potentiel
                    for (const medTerm of possibleMedications) {
                        try {
                            // Recherche dynamique dans l'API
                            await store.fetchArticles({
                                fields: ['nid', 'title', 'field_quantite_stock', 'field_unite'],
                                filters: {
                                    title: {
                                        val: medTerm,
                                        op: 'CONTAINS',
                                    }
                                },
                                pager: 0,
                                offset: 5
                            });

                            const results = store.articles.rows;

                            if (results.length > 0) {
                                dynamicInventorySummary += `\nPour "${medTerm}":\n`;
                                results.slice(0, 3).forEach(article => {
                                    dynamicInventorySummary += `  - ${article.title}: ${article.field_quantite_stock || 0} ${article.field_unite || 'unités'}\n`;
                                });
                            } else {
                                dynamicInventorySummary += `\nAucun résultat pour "${medTerm}"\n`;
                            }
                        } catch (error) {
                            console.error(`Erreur recherche ${medTerm}:`, error);
                        }
                    }
                }
            }
            // === FIN DE L'AJOUT ===

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
            
            CONTEXTE ET DONNÉES DE LA CLINIQUE :
            - Stock actuel: ${inventorySummary}
            - Patients: ${patientListSummary}
            - Consultations récentes: ${consultationSummary}
            - Examens disponibles: ${examSummary}
            - Ventes (Commandes): ${salesSummary}
            
            CONTEXTE DE LA SESSION :
            Patient sélectionné: ${patientContext || 'Aucun'}
            Médicament sélectionné: ${medicationContext || 'Aucun'}`;

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
                    'Authorization': `Bearer ${apiKey}`
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
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
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

        // Gestion patient
        const openPatientModal = () => {
            showPatientModal.value = true
        }

        const closePatientModal = () => {
            showPatientModal.value = false
        }

        const savePatient = (patientData) => {
            patientInfo.value = patientData
            patientCardVisible.value = true
            closePatientModal()
        }

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