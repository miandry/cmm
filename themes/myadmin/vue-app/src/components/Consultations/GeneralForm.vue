<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Motif de consultation</label>
            <textarea v-model="form.consultationMotif" rows="3"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Décrivez le motif principal de la consultation..."></textarea>
            <p v-if="errors.consultationMotif" class="text-red-500 text-xs">Le motif est requis</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
    </div>
</template>

<script>
import { reactive, ref, defineExpose } from 'vue';

export default {
    name: 'GeneralForm',
    setup() {
        const form = reactive({
            consultationMotif: '',
            temperature: '',
            tension: '',
            poids: ''
        })

        const errors = reactive({
            consultationMotif: false,
            temperature: false,
            tension: false,
            poids: false
        });

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

            return isValid;
        }

        function getGeneralFormData() {
            const isValid = validateForm();
            return { ...form, hasError: !isValid };
        }

        defineExpose({
            getGeneralFormData
        })

        return {
            form,
            getGeneralFormData,
            errors
        }
    }
}
</script>

<style></style>