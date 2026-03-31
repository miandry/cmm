<template>
    <div class="space-y-4">
        <Patient :canChange="canChange" class="block lg:hidden" />
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Motif de consultation</label>
            <textarea v-model="form.consultationMotif" rows="3"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Décrivez le motif principal de la consultation..."></textarea>
            <p v-if="errors.consultationMotif" class="text-red-500 text-xs">Le motif est requis</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Température (°C)</label>
                <input type="number" v-model="form.temperature"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="36.5">
                <p v-if="errors.temperature" class="text-red-500 text-xs">La température est invalide</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tension artérielle</label>
                <input type="text" v-model="form.tension"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="120/80">
                <p v-if="errors.tension" class="text-red-500 text-xs">La tension est requise</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                <input type="number" v-model="form.poids"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="70">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Montant du consultation (Ar)</label>
                <div class="relative">
                    <input type="number" placeholder="10000" v-model="form.montant"
                        class="w-full pl-4 pr-10 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                    <div
                        class="w-4 h-4 flex items-center justify-center absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        Ar
                    </div>
                </div>
                <p v-if="errors.montant" class="text-red-500 text-xs">Le montant est invalide</p>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, defineExpose, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import Patient from './Patient.vue';
import { useAppointmentStore } from '../../stores/index.js';

export default {
    name: 'GeneralForm',
    components: {
        Patient
    },
    props: {
        canChange: {
            type: Boolean,
        },
    },
    setup(props) {
        const route = useRoute();
        const appointmentStore = useAppointmentStore();
        const canChange = ref(props.canChange);
        
        const form = reactive({
            consultationMotif: '',
            temperature: '',
            tension: '',
            poids: '',
            montant: '',
        })

        const errors = reactive({
            consultationMotif: false,
            temperature: false,
            tension: false,
            poids: false,
            montant: false,
        });

        watch(
            () => props.canChange,
            (newVal) => {
                canChange.value = newVal
            },
            { immediate: true }
        )

        function validateForm() {
            let isValid = true;

            // Vérifier chaque champ requis
            if (!form.consultationMotif || form.consultationMotif.trim() === '') {
                errors.consultationMotif = true;
                isValid = false;
            } else {
                errors.consultationMotif = false;
            }

            if (!form.temperature || isNaN(form.temperature)) {
                errors.temperature = true;
                isValid = false;
            } else {
                errors.temperature = false;
            }

            if (!form.tension || form.tension.trim() === '') {
                errors.tension = true;
                isValid = false;
            } else {
                errors.tension = false;
            }

            if (
                form.montant === '' ||
                form.montant === null ||
                isNaN(form.montant) ||
                Number(form.montant) <= 0
            ) {
                errors.montant = true;
                isValid = false;
            } else {
                errors.montant = false;
            }

            return isValid;
        }

        function getGeneralFormData() {
            const isValid = validateForm();
            return { ...form, hasError: !isValid };
        }

        function resetForm() {
            form.consultationMotif = '';
            form.temperature = '';
            form.tension = '';
            form.poids = '';
            form.montant = '';
        }

        // edit mode
        function setFormData(consultation) {
            if (!consultation) return;

            form.consultationMotif = consultation.field_motif ?? '';
            form.temperature = consultation.field_temperature ?? '';
            form.tension = consultation.field_tension_arterielle ?? '';
            form.poids = consultation.field_poids ?? '';
            form.montant = consultation.field_montant ?? '';

            // reset erreurs (important en mode edit)
            errors.consultationMotif = false;
            errors.temperature = false;
            errors.tension = false;
            errors.poids = false;
            errors.montant = false;
        }

        // Charger automatiquement le montant depuis le rendez-vous
        async function loadAppointmentMontant() {
            const appointmentId = route.query.appointment;
            if (appointmentId) {
                try {
                    await appointmentStore.fetchAppointment(appointmentId);
                    if (appointmentStore.appointment?.field_montant) {
                        form.montant = appointmentStore.appointment.field_montant;
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement du montant:', error);
                }
            }
        }

        // Initialisation au montage du composant
        onMounted(() => {
            loadAppointmentMontant();
        });

        defineExpose({
            getGeneralFormData,
            resetForm,
            setFormData
        })

        return {
            form,
            getGeneralFormData,
            errors,
            resetForm,
            setFormData,
            canChange,
        }
    }
}
</script>