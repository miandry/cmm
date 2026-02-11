<template>
    <div>
        <header class="bg-white border-b border-gray-200 px-6 py-4">
            <div class="max-w-4xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <i class="ri-capsule-line text-white text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-xl font-semibold text-gray-900">Assistant Clinique IA</h1>
                        <p class="text-sm text-gray-500">Recommandations de médicaments basées sur l'inventaire de la
                            clinique</p>
                    </div>
                </div>
                <div class="text-sm text-gray-500">
                    <i class="ri-shield-check-line text-green-500 mr-1"></i>
                    Sécurisé et Confidentiel
                </div>
            </div>
        </header>

        <div class="bg-primary/10 px-6 py-3 border-b border-primary/20">
            <div class="max-w-4xl mx-auto flex items-center">
                <i class="ri-information-line text-primary mr-2"></i>
                <span class="text-sm font-medium text-primary">Pour les Médecins :</span>
                <span class="text-sm text-gray-700 ml-2">Obtenez des suggestions de médicaments basées sur l'inventaire
                    actuel de votre clinique et les besoins des patients</span>
            </div>
        </div>

        <main class="max-w-4xl mx-auto px-6 py-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <!-- Chat Container -->
                <div ref="chatContainer" class="chat-container overflow-y-auto px-6 py-6 space-y-6">
                    <!-- Message de bienvenue -->
                    <div class="flex items-start space-x-3">
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="ri-robot-line text-white text-sm"></i>
                        </div>
                        <div class="message-bubble bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                            <p class="text-gray-800">Bonjour Docteur ! Je suis votre Assistant Clinique IA. Je peux
                                suggérer des médicaments appropriés basés sur l'inventaire actuel de votre clinique et
                                les
                                conditions des patients. Veuillez fournir les symptômes du patient, le diagnostic ou les
                                besoins
                                spécifiques en médicaments.</p>
                            <p class="text-xs text-gray-500 mt-2">Basé sur les données de formulaire et d'inventaire de
                                votre clinique</p>
                        </div>
                    </div>

                    <!-- Messages dynamiques -->
                    <div v-for="(message, index) in messages" :key="index">
                        <!-- Message utilisateur -->
                        <div v-if="message.type === 'user'" class="flex items-start space-x-3 justify-end">
                            <div class="message-bubble bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3">
                                <p>{{ message.content }}</p>
                                <p class="text-xs text-blue-100 mt-2">{{ message.time }}</p>
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
                            <div class="message-bubble bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                                <div class="prose prose-sm max-w-none" v-html="message.content"></div>
                                <p class="text-xs text-gray-500 mt-2">{{ message.time }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Indicateur de frappe -->
                    <div v-show="isTyping" class="typing-indicator active items-start space-x-3">
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="ri-robot-line text-white text-sm"></i>
                        </div>
                        <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
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
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Nom du Patient</p>
                                <p class="text-sm font-medium text-gray-900">{{ patientInfo.name || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Âge</p>
                                <p class="text-sm font-medium text-gray-900">{{ patientInfo.age ? `${patientInfo.age}
                                    ans` : '-' }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Sexe</p>
                                <p class="text-sm font-medium text-gray-900">{{ patientInfo.gender || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Allergies</p>
                                <p class="text-sm font-medium text-gray-900">
                                    {{ patientInfo.allergies || 'Aucune allergie connue' }}</p>
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
                <div class="border-t border-gray-200 px-6 py-4">
                    <div class="flex space-x-3">
                        <div class="flex flex-col space-y-2">
                            <button @click="openPatientModal"
                                class="bg-gray-100 text-gray-600 p-3 !rounded-button hover:bg-gray-200 transition-colors"
                                title="Sélectionner un patient">
                                <i class="ri-user-add-line text-lg"></i>
                            </button>
                            <button @click="openMedicationModal"
                                class="bg-gray-100 text-gray-600 p-3 !rounded-button hover:bg-gray-200 transition-colors"
                                title="Ajouter un médicament">
                                <i class="ri-capsule-line text-lg"></i>
                            </button>
                        </div>
                        <textarea ref="messageInput" v-model="currentMessage" @input="handleInput"
                            @keydown="handleKeyDown"
                            placeholder="Entrez l'état du patient, les symptômes ou les exigences de médication..."
                            class="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            rows="3" maxlength="1000"></textarea>
                        <button @click="sendMessage" :disabled="!canSend"
                            class="bg-primary text-white px-6 py-3 !rounded-button hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap self-end">
                            <i class="ri-send-plane-line text-lg"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <p class="text-xs text-gray-500">Appuyez sur Entrée pour envoyer, Maj+Entrée pour nouvelle ligne
                        </p>
                        <span class="text-xs text-gray-400">{{ currentMessage.length }}/1000</span>
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
import { ref, computed, nextTick } from 'vue'
import PatientModal from '../components/assists/PatientModal.vue';
import MedicationModal from '../components/assists/MedicationModal.vue';

export default {
    name: "Assist",
    components: {
        PatientModal,
        MedicationModal
    },
    setup() {
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
        const sendMessage = () => {
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

            setTimeout(() => {
                const response = generateAIResponse(message)
                messages.value.push({
                    type: 'ai',
                    content: response,
                    time: new Date().toLocaleTimeString()
                })
                isTyping.value = false
                scrollToBottom()
            }, 2000 + Math.random() * 2000)
        }

        const generateAIResponse = (userMessage) => {
            let patientContext = ''

            if (patientCardVisible.value) {
                patientContext = `
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                        <p class="font-medium text-blue-800 mb-2">Analyse basée sur le dossier patient attaché :</p>
                        <div class="text-sm text-blue-700 space-y-1">
                            <p><strong>Patient :</strong> ${patientInfo.value.name} (${patientInfo.value.age} ans)</p>
                            <p><strong>Allergies :</strong> ${patientInfo.value.allergies || 'Aucune allergie connue'}</p>
                            ${patientInfo.value.medications?.length ? `<p><strong>Médicaments actuels :</strong> ${patientInfo.value.medications.join(', ')}</p>` : ''}
                        </div>
                    </div>
                `
            }

            const lowerMessage = userMessage.toLowerCase()

            // Réponses pré-définies
            if (lowerMessage.includes('hypertension') || lowerMessage.includes('tension') || lowerMessage.includes('bp')) {
                return patientContext + getHypertensionResponse()
            } else if (lowerMessage.includes('diabète') || lowerMessage.includes('diabetes') || lowerMessage.includes('glycémie')) {
                return patientContext + getDiabetesResponse()
            } else if (lowerMessage.includes('infection') || lowerMessage.includes('antibiotique') || lowerMessage.includes('pneumonie')) {
                return patientContext + getInfectionResponse()
            } else {
                return patientContext + getDefaultResponse()
            }
        }

        const getHypertensionResponse = () => {
            return `
                <p class="font-medium text-gray-800 mb-3">Recommandations de médicaments pour l'hypertension basées sur l'inventaire de la clinique :</p>
                <div class="bg-green-50 border-l-4 border-green-400 p-3 mb-3">
                    <p class="text-sm"><strong>Statut de l'inventaire :</strong> <span class="text-green-700">Plusieurs options disponibles</span></p>
                </div>
                <p class="font-medium mb-2">Médicaments de première ligne en stock :</p>
                <ul class="list-disc list-inside space-y-2 text-sm mb-3">
                    <li><strong>Lisinopril 10mg/20mg</strong> - Stock : 180 comprimés - Inhibiteur ECA</li>
                    <li><strong>Amlodipine 5mg/10mg</strong> - Stock : 120 comprimés - Bloqueur des canaux calciques</li>
                    <li><strong>Hydrochlorothiazide 25mg</strong> - Stock : 200 comprimés - Diurétique</li>
                </ul>
                <div class="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm">
                    <p><strong>Rappel :</strong> Commencer avec la dose efficace la plus faible.</p>
                </div>
            `
        }

        const getDiabetesResponse = () => {
            return `
                <p class="font-medium text-gray-800 mb-3">Médicaments de gestion du diabète du formulaire de la clinique :</p>
                <div class="bg-green-50 border-l-4 border-green-400 p-3 mb-3">
                    <p class="text-sm"><strong>Statut de l'inventaire :</strong> <span class="text-green-700">Options complètes disponibles</span></p>
                </div>
                <p class="font-medium mb-2">Antidiabétiques oraux en stock :</p>
                <ul class="list-disc list-inside space-y-2 text-sm mb-3">
                    <li><strong>Metformine 500mg/1000mg</strong> - Stock : 240 comprimés - Thérapie de première ligne</li>
                    <li><strong>Glimépiride 2mg/4mg</strong> - Stock : 150 comprimés - Sulfonylurée</li>
                    <li><strong>Sitagliptine 100mg</strong> - Stock : 60 comprimés - Inhibiteur DPP-4</li>
                </ul>
            `
        }

        const getInfectionResponse = () => {
            return `
                <p class="font-medium text-gray-800 mb-3">Sélection d'antibiotiques basée sur le stock actuel :</p>
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                    <p class="text-sm"><strong>Statut de l'inventaire :</strong> <span class="text-yellow-700">Limité - Vérifier les dates</span></p>
                </div>
                <p class="font-medium mb-2">Antibiotiques disponibles :</p>
                <ul class="list-disc list-inside space-y-2 text-sm mb-3">
                    <li><strong>Amoxicilline-Clavulanate 875mg</strong> - Stock : 45 comprimés</li>
                    <li><strong>Azithromycine 250mg</strong> - Stock : 30 comprimés</li>
                    <li><strong>Céphalexine 500mg</strong> - Stock : 80 comprimés</li>
                </ul>
            `
        }

        const getDefaultResponse = () => {
            return `
                <p class="font-medium text-gray-800 mb-3">Veuillez fournir des informations plus spécifiques sur le patient.</p>
                <p class="font-medium mb-2">Inclure les détails sur :</p>
                <ul class="list-disc list-inside space-y-1 text-sm mb-3">
                    <li>Diagnostic principal ou condition</li>
                    <li>Âge du patient et comorbidités</li>
                    <li>Médicaments actuels et allergies</li>
                </ul>
            `
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
            removeSelectedMedication
        }
    }
}
</script>

<style>
.chat-container {
    height: calc(100vh - 200px);
}

.message-bubble {
    max-width: 70%;
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