<template>
  <div class="article-card" @click="addToCart">
    <div class="aspect-square mb-1 rounded-md overflow-hidden">
      <img :src="getOptimizedImage()" :alt="article.title" class="w-full h-full object-cover object-top" loading="lazy"
        width="400" height="400">
    </div>
    <h3 class="font-bold text-gray-900 mb-1 text-xs line-clamp-2" style="height: 35px;">{{ article.title }}</h3>
    <div class="mb-1">
      <p class="text-sm font-semibold text-primary price-display">{{ article.field_prix_unitaire }} Ar</p>
      <p class="text-xs text-gray-500 insurance-price hidden">Prix assurance: {{ article.field_nombre_par_unite }} Ar
      </p>
    </div>
    <div class="flex items-center justify-between" v-if="article.field_quantite_stock > 10">
      <span class="text-xs text-secondary font-medium truncate">
        En stock : {{ article.field_quantite_stock }}
      </span>
      <div class="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
    </div>

    <div class="flex items-center justify-between" v-else-if="article.field_quantite_stock > 0">
      <span class="text-xs text-orange-500 font-medium">
        En stock : {{ article.field_quantite_stock }}
      </span>
      <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
    </div>

    <div class="flex items-center justify-between" v-else>
      <span class="text-xs text-red-500 font-medium">Rupture de stock</span>
      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',

  // Définition des props
  props: {
    article: {
      type: Object,
      required: true
    }
  },

  // Déclaration des événements émis
  emits: ['add-to-cart'],

  setup(props, { emit }) {

    // Fonction pour émettre l'événement vers le parent
    function addToCart() {
      emit('add-to-cart', props.article)
    }

    // Fonction pour obtenir l'image optimisée
    function getOptimizedImage() {
      const originalUrl = props.article.field_image?.image?.url
      const defaultImage = '/sites/default/files/2025-12/defaultProductImagePng.png'

      // Si pas d'image, retourner l'image par défaut
      if (!originalUrl) {
        return defaultImage
      }

      // Compression via Cloudflare Images
      // w=400 : largeur de 400px (taille de votre conteneur)
      // h=400 : hauteur de 400px
      // output=webp : conversion en format WebP (plus léger)
      // q=80 : qualité à 80% (bon équilibre qualité/poids)
      // fit=cover : recadrage pour remplir le conteneur
      return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=400&h=400&output=webp&q=80&fit=cover`
    }

    // Tout ce qu'on retourne ici sera accessible dans le template
    return {
      addToCart,
      getOptimizedImage
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:active {
  transform: scale(0.98);
}

.article-card {
  /* max-width: 145px; */
  /* min-width: 140px; */
}
</style>