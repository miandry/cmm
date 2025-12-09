<template>
    <div v-if="orderToShow">
        <div class="flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl w-full">
                <div class="p-6 pb-0 text-sm">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-gray-900" id="modal-order-title">Détails de la commande
                            #{{ orderToShow.title }}</h3>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">Informations client</h4>
                            <div class="space-y-2">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                        {{ orderToShow.field_client.title.slice(0, 2) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ orderToShow.field_client.title }}</p>
                                        <p class="text-sm text-gray-500" id="modal-customer-phone">{{
                                            orderToShow.field_client.field_phone }}</p>
                                    </div>
                                </div>
                                <div v-if="orderToShow.field_client.field_assurance == 1">
                                    <div class="flex items-center mt-2">
                                        <div class="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                                        <span class="text-sm text-secondary font-medium">Client avec assurance</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">Informations commande</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Numéro :</span>
                                    <span class="font-medium" id="modal-order-number">#{{ orderToShow.title }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Date :</span>
                                    <span class="font-medium" id="modal-order-date">{{
                                        formatDate(orderToShow.field_date, orderToShow.created) }}</span>
                                </div>
                                <div class="flex justify-between" v-if="statusMap[orderToShow.field_status]">
                                    <span class="text-gray-600">Statut :</span>
                                    <span
                                        :class="`px-2 py-1 rounded-full text-xs font-medium ${statusMap[orderToShow.field_status].bg}`"
                                        v-text="`${statusMap[orderToShow.field_status].text}`">

                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <h4 class="font-semibold text-gray-900 mb-3">Produits commandés</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="space-y-3" id="modal-products-list">
                                <div v-for="article in orderToShow.field_articles" :key="article.nid"
                                    class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                    <div class="flex-1">
                                        <p class="font-medium text-gray-900">{{ article.field_article.title }}</p>
                                        <p class="text-sm text-gray-500">Prix unitaire : {{
                                            Number(article.field_prix_unitaire).toLocaleString('fr-MG', {
                                                style: 'currency',
                                                currency: 'MGA'
                                            }) }}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-medium">Qté : {{ article.field_quantite }}</p>
                                        <p class="text-sm text-primary font-semibold"> {{ (article.field_prix_unitaire *
                                            article.field_quantite).toLocaleString('fr-MG', {
                                                style: 'currency',
                                                currency: 'MGA'
                                            }) }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-gray-200">
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Sous-total :</span>
                                        <span class="font-medium">{{ Number(orderToShow.field_total_vente ||
                                            0).toLocaleString('fr-MG', { style: 'currency', currency: 'MGA' }) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">TVA (20%) :</span>
                                        <span class="font-medium">{{ Number((orderToShow.field_total_vente ||
                                            0) * 0.2).toLocaleString('fr-MG', { style: 'currency', currency: 'MGA' })
                                            }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                                        <span>Total :</span>
                                        <span class="text-primary">{{ Number((orderToShow.field_total_vente ||
                                            0) * 1.2).toLocaleString('fr-MG', { style: 'currency', currency: 'MGA' })
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDate } from '../utils/formateDate';
import { usePDF } from "vue3-pdfmake";
import { generateInvoicePdf } from '../utils/invoicePdf.js';
import { useRoute } from 'vue-router';
import { useOrderStore } from '../stores/index.js';
import { onMounted, ref } from 'vue';


export default {
    name: "Facture",
    setup() {
        const route = useRoute()
        const orderStore = useOrderStore()
        const slug = route.params.slug
        const orderToShow = ref(null);

        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_articles',
                'field_client',
                'field_date',
                'field_status',
                'field_total_vente',
                'created'
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                title: {
                    val: slug,
                    op: "="
                },
            },
            values: {
                field_client: ['title', 'nid', 'field_assurance', 'field_phone']
            },
            pager: 0,
            offset: 10
        })

        const fetchOrders = async () => {
            await orderStore.fetchOrders(queryOptions.value);            
        }

        onMounted(async () => {
            await fetchOrders();
            orderToShow.value = orderStore.orders.rows[0]
        })

        const statusMap = {
            unpayed: {
                bg: 'bg-yellow-100 text-yellow-600',
                icon: 'ri-time-line',
                text: 'Non payé',
            },
            cancel: {
                bg: 'bg-red-100 text-red-600',
                icon: 'ri-close-line',
                text: 'Annulée',
            },
            payed: {
                bg: 'bg-green-100 text-green-600',
                icon: 'ri-check-double-line',
                text: 'Payé'

            }
        };

        const pdfMake = usePDF();

        const downloadPdf = () => {
            generateInvoicePdf(props.orderToShow, statusMap, pdfMake);
        };

        return {
            formatDate,
            statusMap,
            downloadPdf,
            orderToShow
        }
    }
}
</script>

<style></style>