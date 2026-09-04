<template>
    <main class="pt-20 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 class="text-lg font-semibold text-gray-900">File d'attente</h1>
                            <p class="text-xs text-gray-500">Suivi des clients en attente de service</p>
                        </div>
                        <div class="relative w-full sm:w-48">
                            <input v-model="selectedDate" type="date" @change="filterByDate"
                                class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                            <i class="ri-calendar-line absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID / Ticket
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services
                                    commandés</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="queueStore.loading">
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div
                                        class="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-3">
                                    </div>
                                    <p class="text-sm text-gray-500">Chargement de la file d'attente...</p>
                                </td>
                            </tr>
                            <tr v-else-if="!queueStore.tickets.rows?.length">
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <i class="ri-time-line text-3xl text-gray-300"></i>
                                    <p class="text-sm font-medium text-gray-900 mt-3">Aucun ticket pour cette date</p>
                                </td>
                            </tr>
                            <tr v-for="ticket in queueStore.tickets.rows" v-else :key="ticket.nid"
                                class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-semibold text-gray-900">#{{ ticket.nid }}</div>
                                    <div class="text-xs text-gray-500">{{ ticket.title || 'Ticket sans titre' }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ ticket.field_client?.title ||
                                        'Client inconnu' }}</div>
                                    <div class="text-xs text-gray-500">{{ ticket.field_client?.field_phone || '' }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 min-w-64">
                                    <div v-if="servicesFor(ticket).length" class="flex flex-wrap gap-1">
                                        <span v-for="service in servicesFor(ticket)" :key="service.key"
                                            class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                            {{ service.title }}
                                        </span>
                                    </div>
                                    <span v-else class="text-sm text-gray-400">Aucun service</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div>{{ formatDateTime(ticket.field_date_ticket).date }}</div>
                                    <div class="text-xs text-gray-500">{{ formatDateTime(ticket.field_date_ticket).time
                                    }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex flex-col gap-2 w-44">

                                        <!-- Voir commande + Imprimer sur la même ligne -->
                                        <div class="flex gap-2">
                                            <button type="button" @click="openOrderModal(ticket)"
                                                :disabled="orderStore.loading"
                                                class="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-primary bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-medium disabled:opacity-50"
                                                title="Voir la commande liée">
                                                <i class="ri-eye-line"></i>
                                                <span>Voir</span>
                                            </button>

                                            <button type="button" @click="printTicket(ticket)"
                                                class="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium"
                                                title="Imprimer le ticket">
                                                <i class="ri-printer-line"></i>
                                                <span>Imprimer</span>
                                            </button>
                                        </div>

                                        <!-- Statut en dessous -->
                                        <button type="button" @click="openStatusModal(ticket)"
                                            :disabled="updatingId === ticket.nid"
                                            class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                                            :class="statusClass(ticket.field_status_fil)" title="Modifier le statut">
                                            <span class="w-3 h-3 rounded-full border-2 border-current"></span>
                                            {{ statusLabel(ticket.field_status_fil) }}
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="totalPages > 1"
                    class="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-4">
                    <div class="text-sm text-gray-500">Affichage de {{ startIndex }} à {{ endIndex }} sur {{
                        queueStore.tickets.total || 0 }} tickets</div>
                    <div class="flex items-center gap-2">
                        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                            <i class="ri-arrow-left-s-line"></i>
                        </button>
                        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                            :disabled="page === '...'" class="px-3 py-2 rounded-md text-sm font-medium"
                            :class="page === currentPage ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'">
                            {{ page }}
                        </button>
                        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                            <i class="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="statusTicket" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-5">
                    <h2 class="text-lg font-semibold text-gray-900">Modifier le statut</h2>
                    <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeStatusModal">
                        <i class="ri-close-line text-xl"></i>
                    </button>
                </div>
                <p class="text-sm text-gray-500 mb-4">Ticket #{{ statusTicket.nid }}</p>
                <div class="space-y-3">
                    <label v-for="status in statusOptions" :key="status.value"
                        class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        :class="selectedStatus === status.value ? 'border-primary bg-blue-50' : 'border-gray-200'">
                        <input v-model="selectedStatus" type="radio" :value="status.value"
                            class="w-4 h-4 text-primary focus:ring-primary">
                        <span class="text-sm font-medium text-gray-800">{{ status.label }}</span>
                    </label>
                </div>
                <div class="flex gap-3 mt-6">
                    <button type="button"
                        class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        @click="closeStatusModal">Annuler</button>
                    <button type="button" class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                        :disabled="updatingId === statusTicket.nid" @click="confirmStatusChange">Confirmer</button>
                </div>
            </div>
        </div>

        <!-- Modal modifié avec une condition supplémentaire -->
        <div v-if="orderStore.order?.nid && showOrderModal"
            class="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <ShowOrderModal :order-to-show="orderStore.order" @close-details-modal="closeOrderModal"
                @show-edit-status-modal="closeOrderModal" :hide-status-action="true" />
        </div>

        <div v-if="printTicketData" class="thermal-ticket" aria-hidden="true">
            <div class="thermal-ticket__brand">File d'attente</div>
            <div class="thermal-ticket__title">{{ printTicketData.title || `Ticket #${printTicketData.nid}` }}</div>
            <div class="thermal-ticket__rule"></div>
            <div class="thermal-ticket__row">
                <span>Date</span>
                <strong>{{ formatDateTime(printTicketData.field_date_ticket).date }}</strong>
            </div>
            <div class="thermal-ticket__row">
                <span>Heure</span>
                <strong>{{ formatDateTime(printTicketData.field_date_ticket).time }}</strong>
            </div>
            <div class="thermal-ticket__row">
                <span>Client</span>
                <strong>{{ printTicketData.field_client?.title || 'Client inconnu' }}</strong>
            </div>
            <div class="thermal-ticket__rule"></div>
            <p class="thermal-ticket__message">Veuillez patienter. Votre numéro sera appelé dès que le service sera
                prêt.</p>
            <p class="thermal-ticket__footer">Merci de votre patience.</p>
        </div>
    </main>
</template>

<script>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useOrderStore, useQueueStore } from '../stores/index.js';
import ShowOrderModal from '../components/orders/ShowOrderModal.vue';

const STATUS_FLOW = ['pending', 'in_process', 'finished'];

export default {
    name: 'QueueList',
    components: { ShowOrderModal },
    setup() {
        const queueStore = useQueueStore();
        const orderStore = useOrderStore();
        const perPage = 15;
        const currentPage = ref(1);
        const selectedDate = ref(toLocalDateInput(new Date()));
        const updatingId = ref(null);
        const statusTicket = ref(null);
        const printTicketData = ref(null);
        const selectedStatus = ref('pending');
        // Nouvelle variable pour contrôler l'affichage du modal
        const showOrderModal = ref(false);
        const statusOptions = [
            { value: 'pending', label: 'En attente' },
            { value: 'in_process', label: 'En cours' },
            { value: 'finished', label: 'Terminé' },
        ];
        const queryOptions = ref({
            fields: ['nid', 'title', 'field_client', 'field_commande_nid', 'field_service', 'field_date_ticket', 'field_status_fil'],
            values: {
                field_client: ['nid', 'title', 'field_phone'],
                field_service: ['nid', 'title'],
                field_commande_nid: ['nid', 'field_articles'],
            },
            sort: { val: 'nid', op: 'ASC' },
            filters: {},
            pager: 0,
            offset: perPage,
        });

        const totalPages = computed(() => Math.ceil((queueStore.tickets.total || 0) / perPage));
        const startIndex = computed(() => queueStore.tickets.rows?.length ? (currentPage.value - 1) * perPage + 1 : 0);
        const endIndex = computed(() => queueStore.tickets.rows?.length ? Math.min(currentPage.value * perPage, queueStore.tickets.total || 0) : 0);
        const visiblePages = computed(() => {
            const total = totalPages.value;
            if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
            if (currentPage.value <= 3) return [1, 2, 3, 4, '...', total];
            if (currentPage.value >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
            return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', total];
        });

        function toUtcValue(date) {
            return new Date(date).toISOString().slice(0, 19);
        }

        function applyDateFilter() {
            const start = new Date(`${selectedDate.value}T00:00:00`);
            const end = new Date(`${selectedDate.value}T23:59:59`);
            queryOptions.value.filters.field_date_ticket = {
                val: [toUtcValue(start), toUtcValue(end)],
                op: 'BETWEEN',
            };
        }

        async function fetchTickets() {
            applyDateFilter();
            await queueStore.fetchTickets(queryOptions.value);
        }

        function filterByDate() {
            currentPage.value = 1;
            queryOptions.value.pager = 0;
            fetchTickets();
        }

        function goToPage(page) {
            if (page === '...' || page < 1 || page > totalPages.value) return;
            currentPage.value = page;
            queryOptions.value.pager = page - 1;
            fetchTickets();
        }

        function servicesFor(ticket) {
            const articles = ticket.field_commande_nid?.field_articles;
            if (Array.isArray(articles) && articles.length) {
                return articles.map((article, index) => ({
                    key: article.nid || article.id || index,
                    title: article.field_article?.title || article.title || `Service #${article.field_article?.nid || article.field_article || ''}`,
                }));
            }
            const service = ticket.field_service;
            return service?.title ? [{ key: service.nid, title: service.title }] : [];
        }

        function formatDateTime(value) {
            if (!value) return '-';
            const date = new Date(value.includes('T') && !/[Z+-]\d{2}:?\d{2}$/.test(value) ? `${value}Z` : value);
            if (Number.isNaN(date.getTime())) return { date: value, time: '' };
            return {
                date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h '),
            };
        }

        function statusLabel(status) {
            return { pending: 'En attente', in_process: 'En cours', finished: 'Terminé' }[status] || 'En attente';
        }

        function nextStatusLabel(status) {
            return statusLabel(STATUS_FLOW[(STATUS_FLOW.indexOf(status) + 1) % STATUS_FLOW.length]);
        }

        function statusClass(status) {
            return {
                pending: 'bg-yellow-100 text-yellow-800',
                in_process: 'bg-blue-100 text-blue-800',
                finished: 'bg-green-100 text-green-800',
            }[status] || 'bg-yellow-100 text-yellow-800';
        }

        function openStatusModal(ticket) {
            statusTicket.value = ticket;
            selectedStatus.value = STATUS_FLOW.includes(ticket.field_status_fil) ? ticket.field_status_fil : 'pending';
        }

        function closeStatusModal() {
            statusTicket.value = null;
        }

        async function confirmStatusChange() {
            const ticket = statusTicket.value;
            if (!ticket) return;
            updatingId.value = ticket.nid;
            try {
                await queueStore.updateTicketStatus(ticket.nid, selectedStatus.value);
                ticket.field_status_fil = selectedStatus.value;
                closeStatusModal();
            } catch (error) {
                toast.error('Impossible de mettre à jour le statut du ticket.');
            } finally {
                updatingId.value = null;
            }
        }

        async function openOrderModal(ticket) {
            const orderId = ticket.field_commande_nid?.nid || ticket.field_commande_nid?.target_id || ticket.field_commande_nid;
            if (!orderId) {
                toast.error('Aucune commande liée à ce ticket.');
                return;
            }
            // Réinitialiser l'état avant de charger
            showOrderModal.value = false;
            orderStore.order = null;

            await orderStore.fetchOrder(orderId, {
                fields: ['nid', 'title', 'field_articles', 'field_examens_order', 'field_client', 'field_date', 'field_status', 'field_total_vente', 'created', 'field_facture', 'field_type'],
                values: { field_client: ['title', 'nid', 'field_assurance', 'field_phone'] },
            });

            // Afficher le modal uniquement si la commande a été chargée avec succès
            if (orderStore.order?.nid) {
                showOrderModal.value = true;
            }
        }

        function closeOrderModal() {
            showOrderModal.value = false;
            orderStore.order = null;
        }

        async function printTicket(ticket) {
            printTicketData.value = ticket;
            await nextTick();
            window.print();
        }

        function clearPrintTicket() {
            printTicketData.value = null;
        }

        onMounted(fetchTickets);
        onMounted(() => window.addEventListener('afterprint', clearPrintTicket));
        onBeforeUnmount(() => window.removeEventListener('afterprint', clearPrintTicket));

        return {
            queueStore, orderStore, currentPage, selectedDate, updatingId, totalPages, startIndex, endIndex, visiblePages,
            statusTicket, selectedStatus, statusOptions, filterByDate, goToPage, servicesFor, formatDateTime,
            statusLabel, nextStatusLabel, statusClass, openStatusModal, closeStatusModal, confirmStatusChange,
            openOrderModal, closeOrderModal, printTicket, printTicketData,
            showOrderModal, // Ajouter à l'export
        };
    },
};

function toLocalDateInput(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
</script>

<style>
.thermal-ticket {
    display: none;
}

@media print {
    @page {
        size: 80mm auto;
        margin: 0;
    }

    body * {
        visibility: hidden !important;
    }

    .thermal-ticket,
    .thermal-ticket * {
        visibility: visible !important;
    }

    .thermal-ticket {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 80mm;
        box-sizing: border-box;
        padding: 6mm 5mm;
        color: #111827;
        background: #fff;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.35;
        text-align: center;
    }

    .thermal-ticket__brand {
        font-size: 15px;
        font-weight: 700;
        text-transform: uppercase;
    }

    .thermal-ticket__title {
        margin-top: 5mm;
        font-size: 18px;
        font-weight: 700;
        overflow-wrap: anywhere;
    }

    .thermal-ticket__rule {
        margin: 4mm 0;
        border-top: 1px dashed #111827;
    }

    .thermal-ticket__row {
        display: flex;
        justify-content: space-between;
        gap: 4mm;
        margin: 2mm 0;
        text-align: left;
    }

    .thermal-ticket__row strong {
        text-align: right;
        overflow-wrap: anywhere;
    }

    .thermal-ticket__message {
        margin: 5mm 0 0;
        font-size: 13px;
    }

    .thermal-ticket__footer {
        margin: 5mm 0 0;
        font-weight: 700;
    }
}
</style>