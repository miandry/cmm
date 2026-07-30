<template>
    <main class="px-6 py-8 max-w-3xl mx-auto">
        <div class="mb-6">
            <router-link to="/services" class="text-sm text-primary hover:underline mb-2 inline-block">
                ← Retour au catalogue
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900">Modifier le service</h1>
            <p class="text-sm text-gray-500 mt-1">
                Mettez à jour les informations du service #{{ serviceId }}.
            </p>
        </div>
        <SaveService v-if="serviceId" :service-id="serviceId" cancel-to="/services" success-to="/services" />
    </main>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SaveService from '../components/services/SaveService.vue';

export default {
    name: 'EditService',
    components: { SaveService },
    setup() {
        const route = useRoute();
        const serviceId = computed(() => Number(route.params.id) || null);

        return { serviceId };
    },
};
</script>
