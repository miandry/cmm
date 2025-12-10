<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Observations</label>
            <textarea v-model="form.observation" rows="4"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Notez vos observations lors de l'examen physique..."></textarea>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Diagnostic</label>
            <input type="text" v-model="form.diagnostic"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Diagnostic principal">
        </div>
    </div>
</template>

<script>
import { reactive, defineExpose } from 'vue';

export default {
    name: 'ExamenClinique',
    setup() {
        const form = reactive({
            observation: '',
            diagnostic: '',
        })

        function getExamenCliniqueData() {
            return { ...form };
        }

        defineExpose({
            getExamenCliniqueData
        })

        return {
            form,
            getExamenCliniqueData,
        }
    }
}
</script>

<style></style>