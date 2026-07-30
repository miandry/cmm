<template>
  <div class="service-card" @click="addToCart">
    <div class="aspect-square mb-1 rounded-md overflow-hidden bg-teal-50 flex items-center justify-center">
      <img v-if="imageUrl" :src="imageUrl" :alt="service.title"
        class="w-full h-full object-cover object-top" loading="lazy" width="400" height="400">
      <i v-else class="ri-stethoscope-line text-3xl text-teal-600"></i>
    </div>
    <h3 class="font-bold text-gray-900 mb-1 text-xs line-clamp-2" style="height: 35px;">{{ service.title }}</h3>
    <div class="mb-1">
      <p class="text-sm font-semibold text-primary">{{ formatPrice(service.field_prix) }}</p>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs text-secondary font-medium truncate">Prestation</span>
      <div class="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceCard',
  props: {
    service: {
      type: Object,
      required: true,
    },
  },
  emits: ['add-to-cart'],
  setup(props, { emit }) {
    const formatPrice = (value) => {
      const price = Number(value) || 0;
      return `${price.toLocaleString()} Ar`;
    };

    const imageUrl = () => {
      const originalUrl = props.service.field_image?.image?.url;
      if (!originalUrl) {
        return null;
      }
      return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=400&h=400&output=webp&q=80&fit=cover`;
    };

    function addToCart() {
      emit('add-to-cart', props.service);
    }

    return {
      addToCart,
      formatPrice,
      imageUrl: imageUrl(),
    };
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-card:active {
  transform: scale(0.98);
}
</style>
