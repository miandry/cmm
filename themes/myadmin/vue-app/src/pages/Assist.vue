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

                            <!-- Aide Idéale / Suggestions -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                <div class="col-span-1 sm:col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Suggestions rapides</div>
                                
                                <button @click="selectPrompt('Fais-moi un résumé des stocks critiques (faible quantité)')" 
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <i class="ri-error-warning-line text-red-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Stocks critiques</div>
                                    </div>
                                </button>

                                <button @click="selectPrompt('Quelles sont les dernières consultations enregistrées ?')" 
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <i class="ri-stethoscope-line text-blue-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Dernières consultations</div>
                                    </div>
                                </button>

                                <button @click="selectPrompt('Donne-moi la liste des examens disponibles avec leurs prix')" 
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                            <i class="ri-test-tube-line text-green-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Examens & Tarifs</div>
                                    </div>
                                </button>

                                <button @click="selectPrompt('Quelles ont été les dernières ventes réalisées ?')" 
                                    class="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                            <i class="ri-shopping-bag-2-line text-purple-500"></i>
                                        </div>
                                        <div class="text-[13px] font-medium text-gray-700">Historique des ventes</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Messages dynamiques -->
                    <div v-for="(message, index) in messages" :key="index">
                        <!-- Message utilisateur -->
                        <div v-if="message.type === 'user'" class="flex items-start space-x-3 justify-end">
                            <div class="message-bubble bg-primary text-white rounded-2xl rounded-tr-sm px-3 md:px-4 py-2 md:py-3">
                                <p class="text-[13px] md:text-sm">{{ message.content }}</p>
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
import { useArticleStore, useClientStore, useConsultationStore, useExamenStore, useOrderStore } from '../stores/index.js';

export default {
    name: "Assist",
    components: {
        PatientModal,
        MedicationModal
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

        // État des messages
        const messages = ref([])
        const currentMessage = ref('')
        const isTyping = ref(false)

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
            return currentMessage.value.trim().length > 0 && currentMessage.value.length <= 1000
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
            const message = currentMessage.value.trim()
            if (!message) return

            // Ajouter le message utilisateur
            messages.value.push({
                type: 'user',
                content: message,
                time: new Date().toLocaleTimeString()
            })

            currentMessage.value = ''
            nextTick(() => {
                if (messageInput.value) {
                    messageInput.value.style.height = 'auto'
                }
            })

            // Simuler la réponse IA
            isTyping.value = true
            scrollToBottom()

            try {
                const response = await generateAIResponse(message)
                messages.value.push({
                    type: 'ai',
                    content: response,
                    time: new Date().toLocaleTimeString()
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

        const generateAIResponse = async (userMessage) => {
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

            const systemPrompt = `Tu es un Assistant Clinique IA aidant un médecin dans une pharmacie. Ta tâche est de suggérer des médicaments et des soins appropriés basés sur l'inventaire RÉEL, les dossiers patients, les consultations récentes, les examens disponibles et l'historique des ventes.
            Tu as accès à une base de données clinique et commerciale riche comprenant le stock de médicaments, les patients enregistrés, l'historique des consultations, le catalogue des examens médicaux et l'historique des ventes (commandes).
            Sois professionnel, concis et indique toujours que tes suggestions doivent être validées par un professionnel de santé.
            Réponds toujours en français.
            Réponds en format HTML simple (utilisant uniquement des balises <p>, <ul>, <li>, <strong>, <div>).
            
            CONTEXTE PATIENT ACTUEL : ${patientContext || 'Aucun patient spécifique attaché.'} 
            CONTEXTE MÉDICAMENT ACTUEL : ${medicationContext || 'Aucun médicament spécifique sélectionné.'}
            
            LISTE DES PATIENTS ENREGISTRÉS :
            ${patientListSummary || 'Liste des patients non disponible.'}

            INVENTAIRE ACTUEL DE LA CLINIQUE (MÉDICAMENTS) :
            ${inventorySummary || 'Inventaire non disponible pour le moment.'}

            DERNIÈRES CONSULTATIONS ENREGISTRÉES :
            ${consultationSummary || 'Aucune consultation récente.'}

            CATALOGUE DES EXAMENS DISPONIBLES :
            ${examSummary || 'Aucun examen disponible.'}

            HISTORIQUE DES VENTES RÉCENTES (COMMANDES) :
            ${salesSummary || 'Aucun historique de vente disponible.'}
            
            S'il te plaît, utilise prioritairement ces données réelles pour tes recommandations. Réfère-toi aux patients, aux consultations passées ou aux tendances de vente si cela est pertinent pour aider le médecin.`;

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
                        { role: 'user', content: userMessage }
                    ],
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

            // État
            messages,
            currentMessage,
            isTyping,
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
            closeMedicationModal,
            addMedication,
            removeSelectedMedication,
            selectPrompt
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