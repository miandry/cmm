<template>
    <div>
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Modifier le statut de la commande</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <div class="w-6 h-6 flex items-center justify-center">
                                <i class="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>

                    <div class="mb-4">
                        <p class="text-sm text-gray-600 mb-5" id="order-info">Commande #{{ orderToEdit.title }}</p>
                        <div class="flex flex-wrap gap-2">
                            <button @click.prevent="changeOrderStatus('payed')"
                                class="flex-1 text-sm px-2 py-1 bg-green-500 text-white hover:bg-green-600 !rounded-button font-medium whitespace-nowrap">
                                Payé
                            </button>
                            <button @click.prevent="changeOrderStatus('unpayed')"
                                class="flex-1 text-sm px-2 py-1 bg-orange-500 text-white hover:bg-orange-600 !rounded-button font-medium whitespace-nowrap">
                                Non payé
                            </button>
                            <button @click.prevent="changeOrderStatus('cancel')"
                                class="flex-1 text-sm px-2 py-1 bg-red-500 text-white hover:bg-red-600 !rounded-button font-medium whitespace-nowrap">
                                Annulée
                            </button>
                        </div>
                    </div>

                    <div class="flex space-x-3">
                        <button @click="closeModal"
                            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap">
                            Annuler la modification
                        </button>
                        <button 
                            class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap hidden">
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useOrderStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';

export default {
    name: "EditStatusModal",
    emits: ['close-edit-status-modal', 'new-status'],
    props: {
        orderToEdit: {
            type: Object,
            required: true,
        }
    },
    setup(props, { emit }) {
        const orderStore = useOrderStore();
        const data = reactive({
            nid: null,
            field_status: null
        });
        const form = reactive({
            entity_type: "node",
            bundle: "commande",
            nid: props.orderToEdit.nid,
            field_status: "",
        });

        const closeModal = () => {
            emit('close-edit-status-modal');
        }

        const changeOrderStatus = async (newStatus) => {
            form.field_status = newStatus;
            console.log(form);
            await orderStore.saveOrderData(form);
            if (orderStore.error) {
                toast.error("Une erreur est survenue lors de la modification.")
                return
            }
            data.nid = form.nid;
            data.field_status = form.field_status;
            emit('new-status', data);
            toast.success("Status changé avec succès.")
            closeModal()
        }

        onMounted(() => form.field_status = props.orderToEdit.field_status)

        return {
            closeModal,
            form,
            changeOrderStatus,
        }
    },
}
</script>

<style></style>