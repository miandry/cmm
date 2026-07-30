<template>
    <div class="bg-white border-t lg:border-t-0 lg:border-l border-gray-200 h-auto">
        <div class="hidden sm:block">
            <div class="p-3 border-b border-gray-200">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-base font-semibold text-gray-900">Commande services</h2>
                    <button class="text-xs text-gray-500 hover:text-primary" @click="clearAll">Tout effacer</button>
                </div>
                <div class="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Client</span>
                        <button class="text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            :disabled="store.loading" @click="openCustomerModal">
                            <i v-if="store.loading" class="ri-loader-4-line animate-spin"></i>
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
                        <div class="text-center text-gray-300 w-full">Aucun client sélectionné</div>
                    </div>
                    <div class="flex items-center justify-between" v-if="store.client && store.client.nid">
                        <span class="text-xs text-gray-600">Assurance</span>
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" v-model="insurance"
                                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                            <span class="text-xs font-medium">Non</span>
                        </label>
                    </div>
                    <div class="cursor-pointer" v-if="insurance && serviceStore.cardItems.length"
                        @click="openEditPrice">
                        <span class="text-xs text-primary">Modifier les prix</span>
                    </div>
                </div>

                <div class="space-y-2 mb-3 max-h-68 overflow-y-auto" v-if="serviceStore.cardItems.length">
                    <div v-for="item in serviceStore.cardItems" :key="item.nid"
                        class="py-2 border-b border-gray-100">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
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
                            <div class="w-22 text-right font-semibold text-primary text-xs whitespace-nowrap">
                                {{ (item.field_prix_unitaire * item.quantity).toLocaleString() }} Ar
                            </div>
                        </div>
                        <div class="mt-2 pl-10">
                            <button type="button" @click="openPraticienModal(item)"
                                class="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-left hover:border-primary flex items-center justify-between gap-2">
                                <span class="truncate" :class="serviceStore.getPraticienLabel(item) ? 'text-gray-900' : 'text-gray-400'">
                                    {{ serviceStore.getPraticienLabel(item) || 'Choisir un praticien' }}
                                </span>
                                <i class="ri-user-search-line text-primary flex-shrink-0"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="space-y-2 mb-3 max-h-32 overflow-y-auto text-center" v-else>
                    <p class="py-3 text-gray-400">Aucun service sélectionné</p>
                </div>

                <div class="space-y-1 mb-3">
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-600">Sous-total</span>
                        <span class="font-medium">{{ serviceStore.total.toLocaleString() }} Ar</span>
                    </div>
                    <div class="border-t border-gray-200 pt-1">
                        <div class="flex justify-between text-sm font-semibold">
                            <span>Total</span>
                            <span class="text-primary">{{ serviceStore.total.toLocaleString() }} Ar</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-2 mb-3">
                    <button @click="creatOrder"
                        class="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-xs">
                        <i class="ri-save-line"></i>
                        <span>Sauvegarder non payé</span>
                    </button>
                </div>
            </div>
            <div class="flex-1 p-3">
                <button
                    class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap"
                    @click="handleFinalizeSale">
                    Finaliser la vente
                </button>
            </div>
        </div>

        <div class="block sm:hidden fixed bottom-0 left-0 right-0 mx-auto bg-white border-t border-gray-200 z-30">
            <div class="px-4 py-3">
                <div class="flex items-center justify-between mb-3 cursor-pointer" @click="isCartOpen = !isCartOpen">
                    <h2 class="text-sm font-semibold text-gray-900">Placer commande actuelle</h2>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-primary font-medium">
                            {{ serviceStore.cardItems.length }} service{{ serviceStore.cardItems.length > 1 ? 's' : '' }}
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
                            <button class="text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                :disabled="store.loading" @click="openCustomerModal">
                                <i v-if="store.loading" class="ri-loader-4-line animate-spin"></i>
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
                            <div class="text-center text-gray-300 w-full">Aucun client sélectionné</div>
                        </div>

                        <div class="flex items-center justify-between" v-if="store.client && store.client.nid">
                            <span class="text-xs text-gray-600">Assurance</span>
                            <label class="flex items-center space-x-2">
                                <input type="checkbox" v-model="insurance"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                                <span class="text-xs font-medium">Non</span>
                            </label>
                        </div>
                        <div class="cursor-pointer" v-if="insurance && serviceStore.cardItems.length"
                            @click="openEditPrice">
                            <span class="text-xs text-primary">Modifier les prix</span>
                        </div>
                    </div>

                    <div class="space-y-2 mb-3 max-h-68 overflow-y-auto" v-if="serviceStore.cardItems.length">
                        <div v-for="item in serviceStore.cardItems" :key="item.nid"
                            class="py-2 border-b border-gray-100">
                            <div class="flex items-center justify-between gap-2">
                                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
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
                                <div class="w-22 text-right font-semibold text-primary text-xs whitespace-nowrap">
                                    {{ (item.field_prix_unitaire * item.quantity).toLocaleString() }} Ar
                                </div>
                            </div>
                            <div class="mt-2 pl-10">
                                <button type="button" @click="openPraticienModal(item)"
                                    class="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-left hover:border-primary flex items-center justify-between gap-2">
                                    <span class="truncate" :class="serviceStore.getPraticienLabel(item) ? 'text-gray-900' : 'text-gray-400'">
                                        {{ serviceStore.getPraticienLabel(item) || 'Choisir un praticien' }}
                                    </span>
                                    <i class="ri-user-search-line text-primary flex-shrink-0"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2 mb-3 max-h-32 overflow-y-auto text-center" v-else>
                        <p class="py-3 text-gray-400">Aucun service sélectionné</p>
                    </div>

                    <div class="space-y-1 mb-3">
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-600">Sous-total</span>
                            <span class="font-medium">{{ serviceStore.total.toLocaleString() }} Ar</span>
                        </div>
                        <div class="border-t border-gray-200 pt-1">
                            <div class="flex justify-between text-sm font-semibold">
                                <span>Total</span>
                                <span class="text-primary">{{ serviceStore.total.toLocaleString() }} Ar</span>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2 mb-3">
                        <button @click="creatOrder"
                            class="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 !rounded-button font-medium whitespace-nowrap flex items-center justify-center space-x-2 text-xs">
                            <i class="ri-save-line"></i>
                            <span>Sauvegarder non payé</span>
                        </button>
                    </div>
                    <div class="flex-1">
                        <button
                            class="w-full py-2 bg-secondary hover:bg-green-600 text-white !rounded-button font-semibold text-sm whitespace-nowrap"
                            @click="handleFinalizeSale">
                            Finaliser la vente
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <PraticienSelectModal v-if="showPraticienModal" :cart-item="activePraticienItem"
            @close="closePraticienModal" @selected="onPraticienSelected" />

        <div class="fixed inset-0 bg-black bg-opacity-50 z-50" v-if="editPrice">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Modifier les prix</h3>
                        <button @click="closeEditPrice" class="text-gray-400 hover:text-gray-600">
                            <i class="ri-close-line text-xl"></i>
                        </button>
                    </div>
                    <div class="space-y-2 mb-4 max-h-68 overflow-y-auto">
                        <div v-for="item in serviceStore.cardItems" :key="item.nid"
                            class="flex items-center justify-between gap-2 py-2 border-b border-gray-100">
                            <span class="text-xs font-medium truncate flex-1">{{ item.title }}</span>
                            <input type="number" min="0" v-model.number="item.field_prix_unitaire"
                                class="w-28 border border-gray-200 rounded-lg px-2 py-1 text-sm">
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="closeEditPrice"
                            class="flex-1 px-2 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">Annuler</button>
                        <button @click="confirmEditPrice"
                            class="flex-1 px-2 py-2 bg-secondary text-white hover:bg-green-600 rounded-lg text-sm">Confirmer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue-sonner';
import { h, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useClientStore, useOrderStore, useServiceStore } from '../../stores/index.js';
import { buildServiceCommandeLineItems } from '../../services/service.js';
import PraticienSelectModal from './PraticienSelectModal.vue';

export default {
    name: 'ServiceCartSidebar',
    components: { PraticienSelectModal },
    emits: ['open-customer-modal', 'open-payment-modal'],
    setup(_, { emit }) {
        const store = useClientStore();
        const serviceStore = useServiceStore();
        const orderStore = useOrderStore();
        const isCartOpen = ref(false);
        const insurance = ref(false);
        const editPrice = ref(false);
        const showPraticienModal = ref(false);
        const activePraticienItem = ref(null);

        const openCustomerModal = () => {
            if (store.loading) {
                return;
            }
            emit('open-customer-modal');
        };

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
            { immediate: true },
        );

        watch(
            () => serviceStore.pendingPraticienItem,
            (item) => {
                if (item) {
                    openPraticienModal(item);
                }
            },
        );

        watch(insurance, (value) => {
            if (!value) {
                serviceStore.cardItems.forEach((item) => {
                    if (item._original_price !== undefined) {
                        item.field_prix_unitaire = item._original_price;
                    }
                });
                if (store.client?.nid) {
                    serviceStore.saveOrder(store.client);
                }
                toast.info("Prix réinitialisés aux valeurs d'origine");
            }
        });

        const openPraticienModal = (item) => {
            activePraticienItem.value = item;
            showPraticienModal.value = true;
        };

        const closePraticienModal = () => {
            showPraticienModal.value = false;
            activePraticienItem.value = null;
            serviceStore.clearPendingPraticienItem();
        };

        const onPraticienSelected = (praticien) => {
            if (activePraticienItem.value) {
                serviceStore.setItemPraticien(activePraticienItem.value, praticien);
                if (store.client?.nid) {
                    serviceStore.saveOrder(store.client);
                }
            }
        };

        const buildLineItems = () => buildServiceCommandeLineItems(serviceStore.savedOrder?.items || serviceStore.cardItems);

        const buildOrderPayload = (status, titlePrefix = 'cmd-srv-') => ({
            entity_type: 'node',
            bundle: 'commande',
            title: titlePrefix + Date.now(),
            field_client: serviceStore.savedOrder.clientId,
            clientName: serviceStore.savedOrder.clientName,
            field_articles: buildLineItems(),
            field_total_vente: serviceStore.savedOrder.total,
            field_date: formatDateUS(),
            status: 1,
            field_status: status,
            field_type: 'caisse',
        });

        const buildInvoicePayload = (orderTitle, paid) => ({
            entity_type: 'node',
            bundle: 'facture',
            status: 1,
            title: `facture-srv-${Date.now()}`,
            field_date_facture: new Date().toLocaleDateString('en-En'),
            field_mode_paiement: 'Espèces / Chèque',
            field_patient_dossier: orderTitle,
            field_patient_nom: serviceStore.savedOrder.clientName,
            field_reference_facture: orderTitle,
            field_articles_commande: buildLineItems(),
            field_total_vente: serviceStore.savedOrder.total,
            field_tva_facture: 20,
            field_type: 'caisse',
            field_status_invoice: paid ? 1 : 0,
        });

        function saveCurrentOrder() {
            if (!store.client || !store.client.nid) {
                toast.error('Veuillez sélectionner un client avant de sauvegarder la commande.');
                return null;
            }
            if (!serviceStore.cardItems.length) {
                toast.error('Ajoutez au moins un service.');
                return null;
            }
            return serviceStore.saveOrder(store.client);
        }

        function handleFinalizeSale() {
            if (saveCurrentOrder()) {
                emit('open-payment-modal');
            }
        }

        const formatDateUS = () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        };

        const clearAll = () => {
            serviceStore.clearCart(false);
            store.client = null;
        };

        const creatOrder = async () => {
            if (!saveCurrentOrder()) return;

            try {
                orderStore.loading = true;
                const orderData = buildOrderPayload('unpayed');
                const invoiceData = buildInvoicePayload(orderData.title, false);

                const response = await fetch('/api/clinic/create-order-with-invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ order: orderData, invoice: invoiceData }),
                });
                const result = await response.json();

                if (!response.ok || !result.status) {
                    toast.error(result.message || 'Erreur lors de la création de la commande');
                    return;
                }

                serviceStore.clearCart(true);
                toast('Commande services – non payée.', {
                    class: '!bg-yellow-100 !text-yellow-700',
                    description: h(RouterLink, { to: '/commandes', class: 'text-blue-600 underline font-semibold' }, { default: () => 'Voir la commande' }),
                });
            } catch (err) {
                toast.error('Une erreur inattendue est survenue.');
            } finally {
                orderStore.loading = false;
            }
        };

        const openEditPrice = () => { editPrice.value = true; };
        const closeEditPrice = () => {
            serviceStore.cardItems.forEach((item) => {
                if (item._original_price !== undefined) {
                    item.field_prix_unitaire = item._original_price;
                }
            });
            if (store.client?.nid) serviceStore.saveOrder(store.client);
            editPrice.value = false;
        };
        const confirmEditPrice = () => {
            if (store.client?.nid) serviceStore.saveOrder(store.client);
            toast.success('Prix mis à jour !');
            editPrice.value = false;
        };

        onMounted(() => {
            serviceStore.fetchPraticiens({
                fields: ['nid', 'title', 'field_actif', 'status'],
                filters: {
                    status: { val: 1, op: '=' },
                    field_actif: { val: 1, op: '=' },
                },
                sort: { val: 'title', op: 'asc' },
                pager: 0,
                offset: 500,
            });
        });

        return {
            store,
            serviceStore,
            isCartOpen,
            insurance,
            editPrice,
            incrementQuantity: (item) => serviceStore.incrementQuantity(item),
            decrementQuantity: (item) => serviceStore.decrementQuantity(item),
            removeItem: (item) => serviceStore.removeItem(item),
            handleFinalizeSale,
            creatOrder,
            clearAll,
            openEditPrice,
            closeEditPrice,
            confirmEditPrice,
            openCustomerModal,
            showPraticienModal,
            activePraticienItem,
            openPraticienModal,
            closePraticienModal,
            onPraticienSelected,
        };
    },
};
</script>

<style>
.max-h-68 {
    max-height: 22rem;
}
</style>
