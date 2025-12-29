<template>
  <div class="p-4 md:p-6">
    <PageLoader v-if="store.loading" />
    <rapportClients />
    <tableClients :clients="store.clients" @searchKeyWords="onSearch" @filterBy="onfilter" @paginate="onPagination"
      @show="showModal" :closeDetailsPannel="closeDetailsPannel" @detailsClosed="closeDetailsPannel = false"
      ref="tableClientRef" :key="tableKey" @editPatient="editPatient" @deleteSelected="deleteSelected" />
    <!-- Client Modal -->
    <client-modal @close="closeModal" @show="showModal" :patientToEdit="patientToEdit"
      class="fixed inset-0 bg-black bg-opacity-50 z-50" v-if="modalVisible" />
  </div>
</template>
<script>
import { nextTick, onMounted, ref } from 'vue';
import { useClientStore } from '../stores/index.js';
import tableClients from '../components/clients/tableClients.vue';
import rapportClients from '../components/clients/rapportClients.vue';
import PageLoader from '../components/PageLoader.vue';
import ClientModal from '../components/clients/ClientModal.vue';
import { toast } from 'vue-sonner';


export default {
  name: "Clients",
  components: { tableClients, PageLoader, rapportClients, ClientModal },
  setup() {
    const modalVisible = ref(false);
    const closeDetailsPannel = ref(false);
    const store = useClientStore();
    const tableClientRef = ref(null);
    const tableKey = ref(0);
    const patientToEdit = ref({});
    
    // Paramètres dynamiques de la requête
    const queryOptions = ref({
      fields: [
        'nid',
        'title',
        'field_phone',
        'field_assurance',
        'field_adresse',
        'field_age',
        'created',
        'field_allergies',
        'field_contact_d_urgence',
        'field_email',
        'field_notes_medicales',
        'field_sexe',
        'field_consultation',
        'field_last_consultation_status'
      ],
      sort: { val: 'nid', op: 'desc' },
      filters: {},
      values: {
        field_consultation: ['title', 'nid', 'field_consultation_status']
      },
      pager: 0,
      offset: 10
    })

    const fetchClients = async () => {
      await store.fetchClients(queryOptions.value);
    }

    const onSearch = async (value) => {
      queryOptions.value.pager = 0;
      updateFilter('title', value, 'CONTAINS')
      fetchClients()
    }

    const onfilter = async (value) => {
      queryOptions.value.pager = 0;
      if (value == "all") {
        value = null;
      }
      if (value === "draft") {
        updateFilter('field_last_consultation_status', value)
        updateFilter('field_assurance', null)
      } else {
        updateFilter('field_assurance', value)
        updateFilter('field_last_consultation_status', null)
      }
      fetchClients()
    }

    const onPagination = async (value) => {
      queryOptions.value.pager = value - 1;
      fetchClients()
    }

    const updateFilter = (key, value, op = null) => {
      if (value === null || value === undefined || value === '') {
        delete queryOptions.value.filters[key];
      } else {
        queryOptions.value.filters[key] = { val: value, op };
      }
    }

    // Modal functions
    const showModal = (client = null) => {
      if (client) {
        patientToEdit.value = { ...client };
      } else {
        patientToEdit.value = {};
      }
      modalVisible.value = true;
    };

    const closeModal = async (data) => {
      modalVisible.value = false;
      if (data.type == 'cancel') { // cancel hide modal
        return;
      }
      if (!data.patientData) { // add client
        queryOptions.value.pager = 0;
        queryOptions.value.filters = {};
        await fetchClients();

        // Reset UI interne du tableau
        if (tableClientRef.value?.resetFilterUi) {
          tableClientRef.value.resetFilterUi();
        }

        // rerender complet du composant tableClients
        tableKey.value++;
      } else { // edit client
        // mettre a jour le patient modifier dans le store pour l'affichege
        store.clients
        const updated = data.patientData;
        // Trouver l’index dans store.clients
        const index = store.clients.rows.findIndex(c => c.nid == updated.nid);

        if (index != -1) {
          // Remplacer la ligne
          store.clients.rows[index] = updated;
        }
        closeDetailsPannel.value = true;
      }
    };

    const deleteSelected = async (ids) => {
      await store.destroyClients(ids);
      if (store.error) {
        toast.error('Des erreurs sont survenue lors de la suppression')
        return;
      }

      toast.success('Suppression réussi!')
    }

    onMounted(() => fetchClients());

    return {
      store,
      queryOptions,
      onSearch,
      onfilter,
      onPagination,
      modalVisible,
      showModal,
      closeModal,
      tableKey,
      patientToEdit,
      closeDetailsPannel,
      deleteSelected
    }
  }

}
</script>
