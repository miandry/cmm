<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Paramètres</h1>
      <p class="text-sm text-gray-500 mt-1">Configuration de l'application.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <router-link
        v-for="item in settingsItems"
        :key="item.path"
        :to="item.path"
        class="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-md transition-all group"
      >
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <i :class="item.icon"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">{{ item.title }}</h2>
            <p class="text-sm text-gray-500 mt-1">{{ item.description }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Parametres",
  computed: {
    settingsItems() {
      return [
        {
          path: "/parametres/menu",
          title: "Menu de navigation",
          description: "Activer ou désactiver les entrées du menu principal.",
          icon: "fas fa-bars",
        },
        {
          path: "/parametres/facture",
          title: "En-tête de facture",
          description: "Nom du cabinet, adresse, contact et NIF affichés sur les factures.",
          icon: "fas fa-file-invoice",
        },
      ];
    },
  },
};
</script>
