<template>
  <main class="pt-20 px-4 sm:px-6 pb-6">
    <div class="max-w-5xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6">
        <router-link to="/factures" class="flex items-center text-primary hover:text-blue-700 font-medium text-sm">
          <i class="ri-arrow-left-line mr-2"></i>
          Retour à la liste
        </router-link>
      </div>

      <!-- Header avec Titre et Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Détails de la Facture</h1>
            <p class="text-sm text-gray-600">{{ invoiceData?.field_reference_facture }}</p>
          </div>
          <div class="flex gap-3 flex-col sm:flex-row">
            <button @click="goToFacture"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 !rounded-button font-medium text-sm whitespace-nowrap">
              <i class="ri-printer-line"></i>
              Imprimer
            </button>
            <button @click="openStatusModal"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 !rounded-button font-medium text-sm whitespace-nowrap">
              <i class="ri-pencil-line"></i>
              Modifier le statut
            </button>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Statut:</span>
          <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusBadgeClass(invoiceData?.field_status_invoice)]">
            {{ invoiceData?.field_status_invoice == 1 ? 'Payé' : 'Non Payé' }}
          </span>
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Content -->
      <div v-else-if="invoiceData" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <div class="space-y-6 min-w-0">
            <!-- Articles/Médicaments -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Articles</h2>
                  <p class="text-sm text-gray-500">Détails des produits facturés</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {{ articles.filter(a => a.fromOrder).length }} caisse
                  </span>
                  <span v-if="articles.filter(a => !a.fromOrder).length > 0"
                        class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {{ articles.filter(a => !a.fromOrder).length }} manuel
                  </span>
                  <span class="text-sm text-gray-500">
                    ({{ articles.length }} total)
                  </span>
                </div>
              </div>
              <div v-if="articles && articles.length > 0" class="overflow-x-auto min-w-0">
                <table class="w-full min-w-full table-auto">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Prix unité</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(article, index) in articles" :key="index"
                        :class="article.fromOrder ? 'hover:bg-gray-50 bg-white' : 'hover:bg-amber-50 bg-amber-25'">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>
                            <span>{{ article.description }}</span>
                          </div>
                          <span v-if="!article.fromOrder"
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            autre
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{{ article.quantity }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{{ article.unitPrice.toLocaleString() }} Ar</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold text-primary">
                        <span :class="article.fromOrder ? 'text-primary' : 'text-gray-500'">
                          {{ (article.unitPrice * article.quantity).toLocaleString() }} Ar
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-6 text-gray-500">
                Aucun article disponible
              </div>
              <div v-if="articles && articles.length > 0" class="mt-4 border-t border-gray-200 pt-4">
                <div class="flex justify-between text-sm font-semibold text-gray-900">
                  <span>Total Articles</span>
                  <span>{{ articlesTotal?.toLocaleString() }} Ar</span>
                </div>
              </div>
            </div>

            <!-- Examens -->
            <div v-if="examens && examens.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Examens</h2>
                  <p class="text-sm text-gray-500">Examens facturés</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    {{ examens.filter(e => e.fromOrder).length }} caisse
                  </span>
                  <span v-if="examens.filter(e => !e.fromOrder).length > 0"
                        class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {{ examens.filter(e => !e.fromOrder).length }} manuel
                  </span>
                  <span class="text-sm text-gray-500">
                    ({{ examens.length }} total)
                  </span>
                </div>
              </div>
              <div class="overflow-x-auto min-w-0">
                <table class="w-full min-w-full table-auto">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Prix</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(examen, index) in examens" :key="'examen-' + index"
                        :class="examen.fromOrder ? 'hover:bg-gray-50 bg-white' : 'hover:bg-amber-50 bg-amber-25'">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>
                            <span>{{ examen.description }}</span>
                          </div>
                          <span v-if="!examen.fromOrder"
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            autre
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold text-primary">
                        <span :class="examen.fromOrder ? 'text-primary' : 'text-gray-500'">
                          {{ examen.price.toLocaleString() }} Ar
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="examens && examens.length > 0" class="mt-4 border-t border-gray-200 pt-4">
                <div class="flex justify-between text-sm font-semibold text-gray-900">
                  <span>Total Examens</span>
                  <span>{{ examensTotal?.toLocaleString() }} Ar</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Résumé Financier</h2>
              <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <i class="ri-information-line text-blue-600 mt-0.5"></i>
                  <div class="text-sm text-blue-800">
                    <p class="font-medium">Note importante</p>
                    <p>Les totaux ci-dessous ne tiennent compte que des éléments issus de la caisse. Les articles et examens ajoutés manuellement sont affichés à titre informatif uniquement.</p>
                  </div>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span class="text-gray-600">Articles et Examens</span>
                  <span class="font-medium">{{ (articlesTotal + examensTotal)?.toLocaleString() }} Ar</span>
                </div>
                <div v-if="consultationAmount"
                  class="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span class="text-gray-600">Montant Consultation</span>
                  <span class="font-medium">{{ consultationAmount?.toLocaleString() }} Ar</span>
                </div>
                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span class="text-gray-600">Sous-total</span>
                  <span class="font-medium">{{ subTotal?.toLocaleString() }} Ar</span>
                </div>
                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span class="text-gray-600">TVA ({{ parseNumber(invoiceData?.field_tva_facture) || 0 }}%)</span>
                  <span class="font-medium">{{ tvaAmount?.toLocaleString() }} Ar</span>
                </div>
                <div class="flex justify-between items-center text-lg font-semibold">
                  <span>Total TTC</span>
                  <span class="text-primary">{{ totalTTC?.toLocaleString() }} Ar</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations Patient</h2>
              <div class="space-y-3 text-sm text-gray-700">
                <div>
                  <div class="text-xs text-gray-500">Nom</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_patient_nom }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Dossier</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_patient_dossier || '-' }}</div>
                </div>
                <div v-if="invoiceData?.field_patient_age">
                  <div class="text-xs text-gray-500">Âge</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_patient_age }} ans</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations Facture</h2>
              <div class="space-y-3 text-sm text-gray-700">
                <div>
                  <div class="text-xs text-gray-500">Référence</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_reference_facture }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Commande</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_commande?.title || '-' }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Date</div>
                  <div class="font-medium text-gray-900">{{ formatDate(invoiceData?.field_date_facture) }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Type</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_type === 'caisse' ? 'Caisse' : invoiceData?.field_type === 'ordonnance' ? 'Ordonnance' : invoiceData?.field_type }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Paiement</div>
                  <div class="font-medium text-gray-900">{{ invoiceData?.field_mode_paiement || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <i class="ri-file-text-line text-6xl text-gray-300 mb-4 block"></i>
        <p class="text-gray-600">Facture non trouvée</p>
      </div>
    </div>

    <!-- Modal Changement Statut -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 text-center">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Modal -->
        <div class="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <i class="ri-alert-line text-yellow-600"></i>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">Modifier le statut de la facture</h3>
                <div class="mt-4">
                  <label class="block text-sm text-gray-700 mb-2">Nouveau Statut</label>
                  <select v-model="newStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option :value="0">Non Payé</option>
                    <option :value="1">Payé</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="updateInvoiceStatus" :disabled="updatingStatus" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm">
              {{ updatingStatus ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
            <button @click="closeStatusModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useInvoiceStore } from '../stores/index.js';
import { formatDate } from '../utils/formateDate.js';
import { toast } from 'vue-sonner';

export default {
  name: 'FactureDetails',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const invoiceStore = useInvoiceStore();

    const invoiceData = ref(null);
    const loading = ref(false);
    const showStatusModal = ref(false);
    const newStatus = ref(null);
    const updatingStatus = ref(false);
    const articles = ref([]);
    const examens = ref([]);

    const parseNumber = (value) => {
      const normalized = String(value ?? '').replace(/[\s,]+/g, '').replace(/[^\d.-]/g, '');
      return Number(normalized) || 0;
    };

    // Calculs financiers (seulement pour les éléments de la caisse)
    const articlesTotal = computed(() => {
      if (!articles.value || articles.value.length === 0) return 0;
      return articles.value
        .filter(article => article.fromOrder) // Ne compter que les articles de la caisse
        .reduce((sum, article) => {
          return sum + (parseNumber(article.unitPrice) * parseNumber(article.quantity));
        }, 0);
    });

    const examensTotal = computed(() => {
      if (!examens.value || examens.value.length === 0) return 0;
      return examens.value
        .filter(examen => examen.fromOrder) // Ne compter que les examens de la caisse
        .reduce((sum, examen) => {
          return sum + parseNumber(examen.price);
        }, 0);
    });

    const consultationAmount = computed(() => {
      return parseNumber(invoiceData.value?.field_montant_cons || 0);
    });

    const subTotal = computed(() => {
      return articlesTotal.value + examensTotal.value + consultationAmount.value;
    });

    const tvaAmount = computed(() => {
      const tvaRate = (invoiceData.value?.field_tva_facture || 0) / 100;
      return Math.round(subTotal.value * tvaRate);
    });

    const totalTTC = computed(() => {
      return subTotal.value + tvaAmount.value;
    });

    // Récupérer les détails de la facture
    const getInvoiceDetails = async () => {
      const invoiceId = route.query.invoice || route.params.id;
      if (!invoiceId) {
        toast.error('Aucune facture spécifiée');
        router.push('/factures');
        return;
      }

      loading.value = true;
      try {
        await invoiceStore.fetchInvoice(invoiceId, {
          fields: [
            'nid',
            'field_commande',
            'field_date_facture',
            'field_patient_nom',
            'field_reference_facture',
            'field_patient_age',
            'field_patient_dossier',
            'field_type',
            'field_status_invoice',
            'field_facture_medicaments',
            'field_facture_examens',
            'field_mode_paiement',
            'field_tva_facture',
            'field_articles_commande',
            'field_examens_dans_commande',
            'field_montant_cons'
          ],
        });

        invoiceData.value = invoiceStore.invoice;
        newStatus.value = invoiceData.value?.field_status_invoice;

        // Parser les articles de la commande (ceux de la caisse)
        const caisseArticles = [];
        if (invoiceData.value?.field_articles_commande) {
          try {
            const parsed = invoiceData.value.field_articles_commande;
            if (Array.isArray(parsed)) {
              caisseArticles.push(...parsed.map((item) => ({
                ...item,
                quantity: parseNumber(item.field_quantite || item.quantity),
                unitPrice: parseNumber(item.field_prix_unitaire || item.unitPrice),
                description: item.field_article?.title || item.description || "Produit",
                fromOrder: true, // Indicateur pour les éléments de la caisse
                source: 'caisse'
              })));
            }
          } catch (e) {
            console.error('Erreur parsing articles commande:', e);
          }
        }

        // Parser les articles ajoutés manuellement
        const manualArticles = [];
        if (invoiceData.value?.field_facture_medicaments) {
          try {
            const parsed = JSON.parse(invoiceData.value.field_facture_medicaments);
            if (Array.isArray(parsed)) {
              manualArticles.push(...parsed.map((item) => ({
                ...item,
                quantity: parseNumber(item.quantity),
                unitPrice: parseNumber(item.unitPrice),
                fromOrder: false, // Indicateur pour les éléments ajoutés manuellement
                source: 'manuel'
              })));
            }
          } catch (e) {
            console.error('Erreur parsing articles manuels:', e);
          }
        }

        // Fusionner les articles (caisse d'abord, puis manuels)
        articles.value = [...caisseArticles, ...manualArticles];

        // Parser les examens de la commande (ceux de la caisse)
        const caisseExamens = [];
        if (invoiceData.value?.field_examens_dans_commande) {
          try {
            const parsed = invoiceData.value.field_examens_dans_commande;
            if (Array.isArray(parsed)) {
              caisseExamens.push(...parsed.map((item) => ({
                ...item,
                price: parseNumber(item.field_prix || item.price),
                description: item.field_examen?.title || item.description || "Examen médical",
                fromOrder: true, // Indicateur pour les éléments de la caisse
                source: 'caisse'
              })));
            }
          } catch (e) {
            console.error('Erreur parsing examens commande:', e);
          }
        }

        // Parser les examens ajoutés manuellement
        const manualExamens = [];
        if (invoiceData.value?.field_facture_examens) {
          try {
            const parsed = JSON.parse(invoiceData.value.field_facture_examens);
            if (Array.isArray(parsed)) {
              manualExamens.push(...parsed.map((item) => ({
                ...item,
                price: parseNumber(item.price),
                fromOrder: false, // Indicateur pour les éléments ajoutés manuellement
                source: 'manuel'
              })));
            }
          } catch (e) {
            console.error('Erreur parsing examens manuels:', e);
          }
        }

        // Fusionner les examens (caisse d'abord, puis manuels)
        examens.value = [...caisseExamens, ...manualExamens];
      } catch (error) {
        console.error('Erreur lors de la récupération de la facture:', error);
        toast.error('Erreur lors de la récupération de la facture');
        router.push('/factures');
      } finally {
        loading.value = false;
      }
    };

    // Fonctions pour le modal de statut
    const openStatusModal = () => {
      newStatus.value = invoiceData.value?.field_status_invoice;
      showStatusModal.value = true;
    };

    const closeStatusModal = () => {
      showStatusModal.value = false;
    };

    const updateInvoiceStatus = async () => {
      if (newStatus.value === null) return;
      updatingStatus.value = true;

      try {
        await invoiceStore.saveInvoiceData({
          entity_type: 'node',
          bundle: 'facture',
          nid: invoiceData.value.nid,
          field_status_invoice: newStatus.value,
        });

        if (invoiceStore.error) {
          toast.error('Erreur lors de la mise à jour du statut');
          return;
        }

        // Mettre à jour localement
        invoiceData.value.field_status_invoice = newStatus.value;
        closeStatusModal();
        toast.success('Statut mis à jour avec succès');
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Une erreur est survenue');
      } finally {
        updatingStatus.value = false;
      }
    };

    // Fonction pour aller à l'impression
    const goToFacture = () => {
      const commandeNid = invoiceData.value?.field_commande?.nid;
      const invoiceNid = invoiceData.value?.nid;

      if (commandeNid && invoiceNid) {
        router.push({
          path: '/facture',
          query: {
            key: commandeNid,
            invoice: invoiceNid
          }
        });
      } else {
        toast.error('Informations manquantes pour l\'impression');
      }
    };

    // Fonction pour les styles de badge
    const getStatusBadgeClass = (status) => {
      if (status == 1) {
        return 'bg-green-100 text-green-800';
      } else {
        return 'bg-red-100 text-red-800';
      }
    };

    const getTypeBadgeClass = (type) => {
      if (type === 'caisse') {
        return 'bg-blue-100 text-blue-800';
      } else if (type === 'ordonnance') {
        return 'bg-purple-100 text-purple-800';
      }
      return 'bg-gray-100 text-gray-800';
    };

    onMounted(() => {
      getInvoiceDetails();
    });

    return {
      invoiceData,
      loading,
      articles,
      examens,
      articlesTotal,
      examensTotal,
      consultationAmount,
      subTotal,
      tvaAmount,
      totalTTC,
      showStatusModal,
      newStatus,
      updatingStatus,
      openStatusModal,
      closeStatusModal,
      updateInvoiceStatus,
      goToFacture,
      getStatusBadgeClass,
      getTypeBadgeClass,
      formatDate,
      parseNumber
    };
  }
};
</script>