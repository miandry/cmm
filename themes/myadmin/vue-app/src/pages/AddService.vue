<template>
    <main class="px-6 py-8 max-w-3xl mx-auto">
        <div class="mb-6">
            <router-link to="/services" class="text-sm text-primary hover:underline mb-2 inline-block">
                ← Retour au catalogue
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900">Ajouter un service</h1>
            <p class="text-sm text-gray-500 mt-1">
                Créez une nouvelle prestation pour la clinique.
            </p>
        </div>
        <SaveService cancel-to="/services" success-to="/services" />
    </main>
</template>

<script>
import SaveService from '../components/services/SaveService.vue';

export default {
    name: 'AddService',
    components: { SaveService },
};
</script>
