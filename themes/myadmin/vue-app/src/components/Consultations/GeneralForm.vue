<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Motif de consultation</label>
            <textarea v-model="consultationMotif" rows="3"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Décrivez le motif principal de la consultation..."></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Température (°C)</label>
                <input type="number" v-model="temperature"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="36.5">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tension artérielle</label>
                <input type="text" v-model="tension"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="120/80">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                <input type="number" v-model="poids"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="70">
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style></style>