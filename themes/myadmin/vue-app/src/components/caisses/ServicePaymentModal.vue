<template>
    <div id="service-payment-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Finaliser le paiement</h3>
                        <button @click="$emit('close-payment-modal')" class="text-gray-400 hover:text-gray-600">
                            <i class="ri-close-line text-xl"></i>
                        </button>
                    </div>
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-gray-600">Total à payer</span>
                            <span class="font-semibold text-primary">{{ orderToCreate.total.toLocaleString() }} Ar</span>
                        </div>
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-gray-600">Montant reçu</span>
                            <span class="font-medium">{{ formattedAmountReceived }} Ar</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Monnaie à rendre</span>
                            <span class="font-medium text-secondary">{{ changeDue >= 0 ? changeDue.toLocaleString() + ' Ar' : '0 Ar' }}</span>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="grid grid-cols-3 gap-2">
                            <button v-for="n in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']" :key="n"
                                @pointerdown.prevent="handleNumpadClick(n)"
                                class="h-12 bg-gray-100 hover:bg-gray-200 !rounded-button font-semibold text-lg">
                                {{ n }}
                            </button>
                            <button @pointerdown.prevent="startDelete" @pointerup="stopDelete"
                                @pointerleave="stopDelete" @pointercancel="stopDelete"
                                class="h-12 bg-red-100 hover:bg-red-200 text-red-600 !rounded-button font-semibold text-lg flex items-center justify-center">
                                <i class="ri-delete-back-2-line"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="$emit('close-payment-modal')"
                            class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium">Annuler</button>
                        <button @click="saveOrder"
                            class="flex-1 px-4 py-3 bg-secondary text-white hover:bg-green-600 !rounded-button font-medium">Confirmer la vente</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue-sonner';
import { useOrderStore, useServiceStore } from '../../stores/index.js';
import { buildServiceCommandeLineItems } from '../../services/service.js';
import { ref, computed, onMounted, onBeforeUnmount, h } from 'vue';
import { RouterLink } from 'vue-router';

export default {
    name: 'ServicePaymentModal',
    emits: ['close-payment-modal'],
    setup(_, { emit }) {
        const serviceStore = useServiceStore();
        const orderStore = useOrderStore();
        const orderToCreate = serviceStore.savedOrder;
        const amountReceived = ref('');

        const changeDue = computed(() => {
            const total = orderToCreate?.total || 0;
            const received = parseFloat(amountReceived.value.replace(/,/g, '')) || 0;
            return received - total;
        });

        const formattedAmountReceived = computed(() => {
            if (!amountReceived.value) return '0';
            const numeric = parseFloat(amountReceived.value.replace(/\s/g, '')) || 0;
            return numeric.toLocaleString('fr-FR');
        });

        const handleNumpadClick = (value) => {
            amountReceived.value += value;
        };

        const formatDateUS = () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        };

        const buildLineItems = () => buildServiceCommandeLineItems(orderToCreate?.items || []);

        const saveOrder = async () => {
            const received = parseFloat(amountReceived.value.replace(/,/g, '')) || 0;
            if (received < orderToCreate.total) {
                toast.warning('Le montant reçu est insuffisant.');
                return;
            }

            try {
                orderStore.loading = true;
                const orderData = {
                    entity_type: 'node',
                    bundle: 'commande',
                    title: 'cmd-srv-' + Date.now(),
                    field_client: orderToCreate.clientId,
                    clientName: orderToCreate.clientName,
                    field_articles: buildLineItems(),
                    field_total_vente: orderToCreate.total,
                    field_date: formatDateUS(),
                    status: 1,
                    field_status: 'payed',
                    field_type: 'caisse',
                };

                const invoiceData = {
                    entity_type: 'node',
                    bundle: 'facture',
                    status: 1,
                    title: `facture-srv-${Date.now()}`,
                    field_date_facture: new Date().toLocaleDateString('en-En'),
                    field_mode_paiement: 'Espèces / Chèque',
                    field_patient_dossier: orderData.title,
                    field_patient_nom: orderToCreate.clientName,
                    field_reference_facture: orderData.title,
                    field_articles_commande: buildLineItems(),
                    field_total_vente: orderToCreate.total,
                    field_tva_facture: 20,
                    field_type: 'caisse',
                    field_status_invoice: 1,
                };

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
                emit('close-payment-modal');
                toast.success('Vente services enregistrée !', {
                    description: h(RouterLink, { to: '/commandes', class: 'text-blue-600 underline font-semibold' }, { default: () => 'Voir la commande' }),
                });
            } catch (err) {
                toast.error('Une erreur inattendue est survenue.');
            } finally {
                orderStore.loading = false;
            }
        };

        let deleteInterval = null;
        const startDelete = () => {
            amountReceived.value = amountReceived.value.slice(0, -1);
            deleteInterval = setInterval(() => {
                amountReceived.value = amountReceived.value.slice(0, -1);
            }, 360);
        };
        const stopDelete = () => {
            if (deleteInterval) {
                clearInterval(deleteInterval);
                deleteInterval = null;
            }
        };

        const handleKeydown = (e) => {
            if (/^[0-9.]$/.test(e.key)) amountReceived.value += e.key;
            else if (e.key === 'Backspace' || e.key === 'Delete') amountReceived.value = amountReceived.value.slice(0, -1);
            else if (e.key === 'Enter') saveOrder();
            else if (e.key === 'Escape') emit('close-payment-modal');
        };

        onMounted(() => window.addEventListener('keydown', handleKeydown));
        onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));

        return {
            orderToCreate,
            amountReceived,
            changeDue,
            formattedAmountReceived,
            handleNumpadClick,
            saveOrder,
            startDelete,
            stopDelete,
        };
    },
};
</script>
