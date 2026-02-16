<template>
    <div class="bg-white border-t lg:border-t-0 lg:border-l border-gray-200 h-auto">
        <div class="hidden sm:block">
            <div class="p-3 border-b border-gray-200">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-base font-semibold text-gray-900">Commande actuelle</h2>
                    <button class="text-xs text-gray-500 hover:text-primary" @click="clearAll">Tout
                        effacer</button>
                </div>
                <div class="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Client</span>
                        <button class="text-xs text-primary hover:underline" @click="$emit('open-customer-modal')">
                            {{ store.client && store.client.nid ? 'Changer' : 'Ajouter' }}
                        </button>
                    </div>
                    <div class="flex items-center space-x-2 mb-2" v-if="store.client && store.client.nid">
                        <div
                            class="w-8 h-8 bg-primary text-white uppercase rounded-full flex items-center justify-center text-sm font-medium">
                            {{ store.client.title.slice(0, 2) }}
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900 capitalize">{{ store.client.title }}</p>
                            <p class="text-xs text-gray-500">{{ store.client.field_phone }}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 mb-2" v-else>
                        <div class="text-center text-gray-300 w-full">
                            Aucun client sélectionné
                        </div>
                    </div>

                    <div class="flex items-center justify-between" v-if="store.client && store.client.nid">
                        <span class="text-xs text-gray-600">Assurance</span>
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" v-model="insurance"
                                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                            <span class="text-xs font-medium">Non</span>
                        </label>
                    </div>
                    <div class="cursor-pointer" v-if="insurance && articleStore.cardItems.length" @click="openEditPrice">
                        <span class="text-xs text-primary">Modifier les prix</span>
                    </div>
                </div>
                <div class="space-y-2 mb-3 max-h-68 overflow-y-auto" v-if="articleStore.cardItems.length">
                    <div class="flex items-center justify-between py-2 border-b border-gray-100 gap-2"
                        v-for="item in articleStore.cardItems" :key="item.nid">
                        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                            <i class="ri-delete-bin-line text-red-500 text-lg" @click="removeItem(item)"></i>
                        </div>
                        <div class="flex-1 min-w-0 pr-2">
                            <h3 class="font-medium text-gray-900 text-xs truncate">{{ item.title }}</h3>
                            <p class="text-xs text-gray-500">{{ item.field_prix_unitaire }} Ar chacun</p>
                        </div>
                        <div class="flex items-center space-x-1">
                            <button @click="decrementQuantity(item)"
                                class="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 !rounded-button">
                                <i class="ri-subtract-line text-xs"></i>
                            </button>
                            <span class="w-4 text-center font-medium text-xs">{{ item.quantity }}</span>
                            <button @click="incrementQuantity(item)"
                                class="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 !rounded-button">
                                <i class="ri-add-line text-xs"></i>
                            </button>
                        </div>
                        <div class="w-22 text-right font-semibold text-primary text-xs">{{ (item.field_prix_unitaire *
                            item.quantity).toLocaleString() }} Ar</div>
                    </div>
                </div>
                <div class="space-y-2 mb-3 max-h-32 overflow-y-auto text-center" v-else>
                    <p class="py-3 text-gray-400">Aucun article sélectionné</p>
                </div>

                <div class="space-y-1 mb-3">
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-600">Sous-total</span>
                        <span class="font-medium">{{ articleStore.total.toLocaleString() }} Ar</span>
                    </div>
                    <div class="flex justify-between text-xs hidden">
                        <span class="text-gray-600">TVA (20%)</span>
                        <span class="font-medium">6,640 Ar</span>
                    </div>
                    <div class="border-t border-gray-200 pt-1">
                        <div class="flex justify-between text-sm font-semibold">
                            <span>Total</span>
                            <span class="text-primary">{{ articleStore.total.toLocaleString() }} Ar</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-2 mb-3">
                    <button @click="creatOrder"
                        class="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-xs">
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-save-line"></i>
                        </div>
                        <span>Sauvegarder non payé</span>
                    </button>
                </div>
            </div>
            <div class="flex-1 p-3">
                <button
                    class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap"
                    @click="handleFinalizeSale">
                    Finaliser la commande
                </button>
            </div>
        </div>
        <div class="block sm:hidden fixed bottom-0 left-0 right-0 mx-auto bg-white border-t border-gray-200 z-30">
            <div class="px-4 py-3">
                <div class="flex items-center justify-between mb-3 cursor-pointer" @click="isCartOpen = !isCartOpen">
                    <h2 class="text-sm font-semibold text-gray-900">Placer commande actuelle</h2>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-primary font-medium">
                            {{ articleStore.cardItems.length }} articles
                        </span>
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i :class="isCartOpen ? 'ri-arrow-down-s-line text-lg' : 'ri-arrow-up-s-line text-lg'"></i>
                        </div>
                    </div>
                </div>

                <div v-show="isCartOpen">
                    <div class="mb-3 p-2 bg-gray-50 rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">Client</span>
                            <button class="text-xs text-primary hover:underline" @click="$emit('open-customer-modal')">
                                {{ store.client && store.client.nid ? 'Changer' : 'Ajouter' }}
                            </button>
                        </div>
                        <div class="flex items-center space-x-2 mb-2" v-if="store.client && store.client.nid">
                            <div
                                class="w-8 h-8 bg-primary text-white uppercase rounded-full flex items-center justify-center text-sm font-medium">
                                {{ store.client.title.slice(0, 2) }}
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 capitalize">{{ store.client.title }}</p>
                                <p class="text-xs text-gray-500">{{ store.client.field_phone }}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 mb-2" v-else>
                            <div class="text-center text-gray-300 w-full">
                                Aucun client sélectionné
                            </div>
                        </div>

                        <div class="flex items-center justify-between" v-if="store.client && store.client.nid">
                            <span class="text-xs text-gray-600">Assurance</span>
                            <label class="flex items-center space-x-2">
                                <input type="checkbox" v-model="insurance"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                                <span class="text-xs font-medium">Non</span>
                            </label>
                        </div>
                        <div class="cursor-pointer" v-if="insurance && articleStore.cardItems.length" @click="openEditPrice">
                            <span class="text-xs text-primary">Modifier les prix</span>
                        </div>
                    </div>
                    <div class="space-y-2 mb-3 max-h-68 overflow-y-auto" v-if="articleStore.cardItems.length">
                        <div class="flex items-center justify-between py-2 border-b border-gray-100 gap-2"
                            v-for="item in articleStore.cardItems" :key="item.nid">
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                                <i class="ri-delete-bin-line text-red-500 text-lg" @click="removeItem(item)"></i>
                            </div>
                            <div class="flex-1 min-w-0 pr-2">
                                <h3 class="font-medium text-gray-900 text-xs truncate">{{ item.title }}</h3>
                                <p class="text-xs text-gray-500">{{ item.field_prix_unitaire }} Ar chacun</p>
                            </div>
                            <div class="flex items-center space-x-1">
                                <button @click="decrementQuantity(item)"
                                    class="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 !rounded-button">
                                    <i class="ri-subtract-line text-xs"></i>
                                </button>
                                <span class="w-4 text-center font-medium text-xs">{{ item.quantity }}</span>
                                <button @click="incrementQuantity(item)"
                                    class="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 !rounded-button">
                                    <i class="ri-add-line text-xs"></i>
                                </button>
                            </div>
                            <div class="w-22 text-right font-semibold text-primary text-xs">
                                {{ (item.field_prix_unitaire * item.quantity).toLocaleString() }} Ar</div>
                        </div>
                    </div>
                    <div class="space-y-2 mb-3 max-h-32 overflow-y-auto text-center" v-else>
                        <p class="py-3 text-gray-400">Aucun article sélectionné</p>
                    </div>

                    <div class="space-y-1 mb-3">
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-600">Sous-total</span>
                            <span class="font-medium">{{ articleStore.total.toLocaleString() }} Ar</span>
                        </div>
                        <div class="flex justify-between text-xs hidden">
                            <span class="text-gray-600">TVA (20%)</span>
                            <span class="font-medium">6,640 Ar</span>
                        </div>
                        <div class="border-t border-gray-200 pt-1">
                            <div class="flex justify-between text-sm font-semibold">
                                <span>Total</span>
                                <span class="text-primary">{{ articleStore.total.toLocaleString() }} Ar</span>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2 mb-3">
                        <button @click="creatOrder"
                            class="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-xs">
                            <div class="w-4 h-4 flex items-center justify-center">
                                <i class="ri-save-line"></i>
                            </div>
                            <span>Sauvegarder non payé</span>
                        </button>
                    </div>
                    <div class="flex-1">
                        <button
                            class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap"
                            @click="handleFinalizeSale">
                            Finaliser la commande
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="fixed inset-0 bg-black bg-opacity-50 z-50" v-if="editPrice">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Modifier les prix</h3>
                            <button id="close-payment-modal" class="text-gray-400 hover:text-gray-600"
                                @click="closeEditPrice">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <i class="ri-close-line text-xl"></i>
                                </div>
                            </button>
                        </div>
                        <div class="space-y-2 mb-3 max-h-68 overflow-y-auto" v-if="articleStore.cardItems.length">
                            <div class="flex items-center justify-between py-2 border-b border-gray-100 gap-2"
                                v-for="item in articleStore.cardItems" :key="item.nid">
                                <div class="min-w-0 pr-2 w-4/6">
                                    <h3 class="font-medium text-gray-900 text-xs truncate">{{ item.title }}</h3>
                                    <p class="text-xs text-gray-500">{{ item.field_prix_unitaire }} Ar chacun</p>
                                </div>
                                <div class="text-right font-semibold text-xs w-2/6">
                                    <input
                                        class="w-full border border-gray-200 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ps-2 py-1"
                                        type="number" min="0" v-model.number="item.field_prix_unitaire">
                                </div>
                            </div>
                        </div>
                        <div class="flex space-x-3">
                            <button @click="closeEditPrice"
                                class="flex-1 px-2 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap">
                                Annuler
                            </button>
                            <button @click="confirmEditPrice"
                                class="flex-1 px-2 py-1 bg-secondary text-white hover:bg-green-600 !rounded-button font-medium whitespace-nowrap">
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue-sonner';
import { h } from "vue";
import { RouterLink } from "vue-router";
import { useArticleStore, useClientStore, useOrderStore } from '../../stores/index.js';
import { ref, watch } from 'vue';

export default {
    name: 'CardSidebar',
    setup(_, { emit }) {
        const store = useClientStore();
        const articleStore = useArticleStore();
        const isCartOpen = ref(false);
        const insurance = ref(false);
        const editPrice = ref(false);

        watch(isCartOpen, (open) => {
            const bodyStyle = document.body.style;
            if (open) {
                bodyStyle.setProperty('overflow', 'hidden', 'important');
            } else {
                bodyStyle.setProperty('overflow', 'auto', 'important');
            }
        });

        watch(
            () => store.client,
            (client) => {
                if (client && client.field_assurance == 1) {
                    insurance.value = true;
                } else {
                    insurance.value = false;
                }
            },
            { immediate: true }
        );

        watch(insurance, (value) => {
            if (!value) {
                // assurance désactivée → remettre les prix initiaux
                articleStore.cardItems.forEach(item => {
                    if (item._original_price) {
                        item.field_prix_unitaire = item._original_price;
                    }
                });

                articleStore.saveOrder(store.client);
                toast.info("Prix réinitialisés aux valeurs d'origine");
            }
        });

        function incrementQuantity(item) {
            articleStore.incrementQuantity(item);
        }

        function decrementQuantity(item) {
            articleStore.decrementQuantity(item);
        }

        function removeItem(item) {
            articleStore.removeItem(item);
        }

        // Validation client et articles avant de sauvegarder
        function saveCurrentOrder() {
            if (!store.client || !store.client.nid) {
                toast.error("Veuillez sélectionner un client avant de sauvegarder la commande.")
                return null;
            }
            if (!articleStore.cardItems.length) {
                toast.error("Ajoutez au moins un article.")
                return null;
            }
            return articleStore.saveOrder(store.client);
        }

        function handleFinalizeSale() {
            const order = saveCurrentOrder();
            if (order) {
                emit('open-payment-modal');
            }
        }

        const formatDateUS = () => {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const year = now.getFullYear();
            return `${year}-${month}-${day}`;
        };

        const clearAll = () => {
            articleStore.clearCart(false);
            store.client = null
        }

        const closeEditPrice = () => {
            editPrice.value = false;
            restoreOriginalPrices()
        }

        const openEditPrice = () => {
            editPrice.value = true;
        }

        const orderStore = useOrderStore();
        const creatOrder = async function () {
            const order = saveCurrentOrder();
            if (order) {
                try {
                    orderStore.loading = true;
                    const orderToCreate = articleStore.savedOrder;
                    const allArticles = orderToCreate.items.map(item => ({
                        entity_type: "paragraph",
                        bundle: "commande",
                        field_article: item.nid,
                        field_quantite: item.quantity,
                        field_prix_d_achat: item.field_prix_unitaire,
                        field_prix_unitaire: item.field_prix_unitaire,
                    }));

                    const data = {
                        entity_type: "node",
                        bundle: "commande",
                        title: "cmd-" + Date.now(),
                        field_client: orderToCreate.clientId,
                        clientName: orderToCreate.clientName,
                        field_articles: allArticles,
                        field_total_vente: orderToCreate.total,
                        field_date: formatDateUS(),
                        status: 1,
                        field_status: "unpayed"
                    };
                    await orderStore.saveOrderData(data);
                    if (orderStore.error) {
                        toast.error("Une erreur est survenue lors de l'ajout du commande.")
                        return
                    }
                    articleStore.clearCart(true);
                    orderStore.loading = false;
                    toast("Commande ajoutée – non payée.", {
                        class: "!bg-yellow-100 !text-yellow-700",
                        description: h(
                            RouterLink,
                            {
                                to: "/commandes",
                                class: "text-blue-600 underline font-semibold"
                            },
                            { default: () => "Voir la commande" }
                        )
                    });
                } catch (err) {
                    toast.error("Une erreur inattendue est survenue.");
                } finally {
                    orderStore.loading = false;
                }
            }
        }

        const confirmEditPrice = () => {
            // recalcul automatique du total via le store
            articleStore.saveOrder(store.client);

            toast.success("Prix mis à jour !");
            editPrice.value = false;
        };

        const restoreOriginalPrices = () => {
            articleStore.cardItems.forEach(item => {
                if (item._original_price) {
                    item.field_prix_unitaire = item._original_price;
                }
            });
            return articleStore.saveOrder(store.client);
        };


        return {
            store,
            articleStore,
            incrementQuantity,
            decrementQuantity,
            removeItem,
            saveCurrentOrder,
            handleFinalizeSale,
            creatOrder,
            isCartOpen,
            clearAll,
            insurance,
            editPrice,
            closeEditPrice,
            openEditPrice,
            confirmEditPrice,
        }
    }
}
</script>

<style>
.max-h-68 {
    max-height: 22rem;
}
</style>