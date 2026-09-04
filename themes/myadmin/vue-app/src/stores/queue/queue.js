import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { getQueueTickets, saveQueueTicket } from "../../services/queue.js";

export const useQueueStore = defineStore("queue", () => {
  const tickets = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);

  async function fetchTickets(options) {
    loading.value = true;
    error.value = null;
    try {
      const response = await getQueueTickets(buildQueryParams(options));
      tickets.value = response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTicketStatus(ticketId, status) {
    loading.value = true;
    error.value = null;
    try {
      await saveQueueTicket({
        entity_type: "node",
        bundle: "fil_d_attentes",
        nid: ticketId,
        field_status_fil: status,
      });
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { tickets, loading, error, fetchTickets, updateTicketStatus };
});
