<template>
    <div v-if="orderToShow" class="p-4">
        <!-- Bouton d'impression -->
        <div class="fixed top-4 right-4 no-print z-50">
            <div class="flex gap-2">
                <button @click="printInvoice"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimer
                </button>
                <button @click="smartBack"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors">
                    <i class="ri-arrow-left-line"></i>
                    Revenir 456
                </button>
            </div>
        </div>

        <!-- Facture A5 -->
        <div class="sheet-a5 p-5 relative flex flex-col justify-between print-colors-fix">
            <div>
                <!-- En-tête -->
                <div class="flex justify-between items-start pb-2 mb-4 font-sans">
                    <div class="w-2/3">
                        <h1 class="text-lg font-bold text-medical-blue uppercase tracking-wide leading-tight">
                            {{ cabinet.nom }}
                        </h1>
                        <p class="text-sm font-medium text-gray-600 leading-tight f-normal">
                            {{ cabinet.titre }}
                        </p>
                        <div class="text-[11px] text-gray-500 leading-snug mt-1">
                            <p class="font-bold text-medical-blue inline mr-3">
                                {{ cabinet.centre }}
                            </p>
                            <span class="inline f-normal">{{ cabinet.adresse }}</span>
                            <p class="mt-[2px] f-normal">{{ cabinet.contact }}</p>
                            <p class="mt-[2px] text-[9px] f-normal">{{ cabinet.immat }}</p>
                        </div>
                    </div>

                    <div class="w-1/3 text-right pt-1 text-sm">
                        <h2 class="font-extrabold text-medical-blue text-xl uppercase leading-none mb-1">FACTURE</h2>
                        <p class="text-[10px] text-gray-600 leading-tight">
                            <span class="f-normal">Réf. :</span>
                            <span class="editable-field" contenteditable="true" @blur="updateFactureRef"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'factureRef')"
                                @input="preventVueUpdate($event)" ref="factureRefField">
                                {{ factureRef }}
                            </span>
                        </p>
                        <div class="text-[10px] text-gray-600 leading-tight mt-1">
                            <span class="f-normal">{{ cabinet.ville }}, le</span>
                            <span class="editable-field" contenteditable="true" @blur="updateCurrentDate"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'currentDate')"
                                @input="preventVueUpdate($event)" ref="currentDateField">
                                {{ currentDate }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="border-b-4 border-double border-medical-blue mb-4 hidden"></div>

                <!-- Informations patient -->
                <div class="bg-medical-gray rounded-md p-2.5 mb-4 print:bg-transparent print:p-0 print:mb-3">
                    <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-snug">
                        <div class="flex-1 min-w-[180px]">
                            <span class="font-sans font-bold text-medical-blue inline-block">Client :</span>
                            <span class="editable-field font-bold text-base" contenteditable="true"
                                @blur="updatePatientNom" @keydown.enter="saveAndBlur($event)"
                                @focus="handleFocus($event, 'patientNom')" @input="preventVueUpdate($event)"
                                ref="patientNomField">
                                {{ patient.nom }}
                            </span>
                        </div>
                        <div>
                            <span class="font-sans font-bold text-medical-blue">Âge :</span>
                            <span class="editable-field" contenteditable="true" @blur="updatePatientAge"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'patientAge')"
                                @input="preventVueUpdate($event)" ref="patientAgeField">
                                {{ patient.age }}
                            </span>
                        </div>
                        <div>
                            <span class="font-sans font-bold text-medical-blue">Dossier :</span>
                            <span class="editable-field" contenteditable="true" @blur="updatePatientDossier"
                                @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'patientDossier')"
                                @input="preventVueUpdate($event)" ref="patientDossierField">
                                {{ patient.dossier }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Liste des articles -->
                <div class="mb-4">
                    <div v-if="articles.length > 0"
                        class="flex font-sans text-xs font-bold text-medical-blue border-b-2 border-medical-blue py-1 uppercase">
                        <div class="w-3/5 pl-1 f-header">Description de l'article</div>
                        <div class="w-1/5 text-center f-header">Qté</div>
                        <div class="w-2/5 numeric-col pr-1 f-header">Prix Unitaire</div>
                        <div class="w-2/5 numeric-col pr-1 f-header">Total HT</div>
                    </div>

                    <div class="space-y-0.5">
                        <div v-for="(article, index) in articles" :key="'article-' + index"
                            class="flex text-xs border-b border-gray-100 items-center group table-field">
                            <div class="w-3/5 pr-2 pl-1 flex items-center">
                                <span class="editable-field font-medium text-medical-red" contenteditable="true"
                                    @blur="(e) => updateArticleDescription(index, e)"
                                    @keydown.enter="saveAndBlur($event)"
                                    @focus="(e) => handleArticleFocus(e, index, 'description')"
                                    @input="preventVueUpdate($event)"
                                    :ref="el => setArticleFieldRef(el, 'description', index, 'articles')">
                                    {{ article.description }}
                                </span>
                                <button @click="removeArticle(index, 'articles')"
                                    class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg transition-opacity ml-1 opacity-0 group-hover:opacity-100 align-text-bottom">×</button>
                            </div>
                            <div class="w-1/5 text-center">
                                <span class="editable-field text-gray-700" contenteditable="true"
                                    @blur="(e) => updateArticleQuantity(index, e)" @keydown.enter="saveAndBlur($event)"
                                    @focus="(e) => handleArticleFocus(e, index, 'quantity')"
                                    @input="preventVueUpdate($event)"
                                    :ref="el => setArticleFieldRef(el, 'quantity', index, 'articles')">
                                    {{ article.quantity }}
                                </span>
                            </div>
                            <div class="w-2/5 numeric-col pr-1">
                                <span class="editable-field text-gray-700" contenteditable="true"
                                    @blur="(e) => updateArticlePrice(index, e)" @keydown.enter="saveAndBlur($event)"
                                    @focus="(e) => handleArticleFocus(e, index, 'price')"
                                    @input="preventVueUpdate($event)"
                                    :ref="el => setArticleFieldRef(el, 'price', index, 'articles')">
                                    {{ formatCurrencyDisplay(article.unitPrice) }}
                                </span>
                            </div>
                            <div class="w-2/5 numeric-col pr-1 font-bold">
                                <span class="item-total">{{ formatCurrency(article.quantity * article.unitPrice, false)
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-2 no-print">
                        <button @click="addArticle"
                            class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors mr-2">
                            <span class="text-lg mr-1 leading-none">+</span> Ajouter un article
                        </button>
                    </div>

                    <!-- Section Examens -->
                    <div v-if="examens.length > 0" class="mt-6">
                        <div
                            class="flex font-sans text-xs font-bold text-medical-blue border-b-2 border-medical-blue py-1 uppercase">
                            <div class="w-3/5 pl-1 f-header">Examens Médicaux</div>
                            <div class="w-1/5 text-center f-header">Qté</div>
                            <div class="w-2/5 numeric-col pr-1 f-header">Prix Unitaire</div>
                            <div class="w-2/5 numeric-col pr-1 f-header">Total HT</div>
                        </div>
                        <div class="space-y-0.5">
                            <div v-for="(examen, index) in examens" :key="'examen-' + index"
                                class="flex text-xs border-b border-gray-100 items-center group table-field">
                                <div class="w-3/5 pr-2 pl-1 flex items-center">
                                    <span class="editable-field font-medium text-medical-blue" contenteditable="true"
                                        @blur="(e) => updateExamenDescription(index, e)"
                                        @keydown.enter="saveAndBlur($event)"
                                        @focus="(e) => handleExamenFocus(e, index, 'description')"
                                        @input="preventVueUpdate($event)"
                                        :ref="el => setExamenFieldRef(el, 'description', index)">
                                        {{ examen.description }}
                                    </span>
                                    <button @click="removeExamen(index)"
                                        class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg transition-opacity ml-1 opacity-0 group-hover:opacity-100 align-text-bottom">×</button>
                                </div>
                                <div class="w-1/5 text-center">
                                    <span class="text-gray-700">1</span>
                                </div>
                                <div class="w-2/5 numeric-col pr-1">
                                    <span class="editable-field text-gray-700" contenteditable="true"
                                        @blur="(e) => updateExamenPrice(index, e)" @keydown.enter="saveAndBlur($event)"
                                        @focus="(e) => handleExamenFocus(e, index, 'price')"
                                        @input="preventVueUpdate($event)"
                                        :ref="el => setExamenFieldRef(el, 'price', index)">
                                        {{ formatCurrencyDisplay(examen.price) }}
                                    </span>
                                </div>
                                <div class="w-2/5 numeric-col pr-1 font-bold">
                                    <span class="item-total">{{ formatCurrency(examen.price, false) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-2 no-print">
                        <button @click="addExamen"
                            class="flex items-center text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition-colors">
                            <span class="text-lg mr-1 leading-none">+</span> Ajouter un examen
                        </button>
                    </div>
                </div>

                <!-- Totaux -->
                <div class="flex justify-end mt-4">
                    <div class="w-2/3 text-xs">
                        <div class="flex justify-between py-1 border-t border-gray-300">
                            <span class="font-medium text-gray-700">Sous-Total Produits (HT) :</span>
                            <span class="font-bold numeric-col">{{ formatCurrency(articlesSubTotal) }}</span>
                        </div>

                        <div v-if="examens.length > 0" class="flex justify-between py-1 border-t border-gray-300">
                            <span class="font-medium text-gray-700">Sous-Total Examens (HT) :</span>
                            <span class="font-bold numeric-col">{{ formatCurrency(examensSubTotal) }}</span>
                        </div>

                        <div class="flex justify-between py-1 border-t border-gray-300">
                            <span class="font-medium text-gray-700">Total HT :</span>
                            <span id="sub-total" class="font-bold numeric-col">{{ formatCurrency(subTotal) }}</span>
                        </div>

                        <div class="flex justify-between py-1 border-t border-gray-300">
                            <span class="font-medium text-gray-700">TVA (
                                <span class="editable-field" contenteditable="true" @blur="updateTvaRate"
                                    @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'tvaRate')"
                                    @input="preventVueUpdate($event)" ref="tvaRateField">
                                    {{ tvaRate }}%
                                </span>
                                ) :</span>
                            <span id="tva-amount" class="font-bold numeric-col">{{ formatCurrency(tvaAmount) }}</span>
                        </div>

                        <div class="flex justify-between py-1 border-y-2 border-medical-blue mt-1">
                            <span class="font-bold text-medical-blue text-sm uppercase">Montant Total TTC :</span>
                            <span id="grand-total" class="font-extrabold text-medical-blue text-lg numeric-col">{{
                                formatCurrency(grandTotal) }}</span>
                        </div>

                        <div class="text-[10px] mt-2 text-gray-500 text-right">
                            Mode de Paiement :
                            <span class="editable-field text-gray-700" contenteditable="true"
                                @blur="updatePaymentMethod" @keydown.enter="saveAndBlur($event)"
                                @focus="handleFocus($event, 'paymentMethod')" @input="preventVueUpdate($event)"
                                ref="paymentMethodField">
                                {{ paymentMethod }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="mt-4 border-t border-dashed border-gray-300 pt-2">
                    <h3 class="font-sans text-xs font-bold text-medical-blue uppercase mb-1">Notes et Conditions</h3>
                    <p class="editable-field text-xs text-gray-700 leading-snug" contenteditable="true"
                        @blur="updateInvoiceNotes" @keydown.enter="saveAndBlur($event, true)"
                        @focus="handleFocus($event, 'invoiceNotes')" @input="preventVueUpdate($event)"
                        ref="invoiceNotesField">
                        {{ invoiceNotes }}
                    </p>
                </div>
            </div>

            <!-- Signature -->
            <div class="mt-0 pt-3 border-t border-gray-200 text-right">
                <p class="text-xs italic text-gray-500 mb-1">Signature du Pharmacien / Vendeur</p>
                <div class="inline-block w-40 h-12 border border-gray-300 rounded print:border-none"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/index.js';
import { onMounted, ref, computed, watch, nextTick } from 'vue';

export default {
    name: "Facture",
    setup() {
        const route = useRoute()
        const orderStore = useOrderStore()
        const slug = route.params.slug
        const orderToShow = ref(null);
        const router = useRouter()

        const smartBack = () => {
            if (window.history.length > 1) {
                router.back()
            } else {
                router.push({ name: 'commandes' })
            }
        }
        // Stocker les valeurs originales pour éviter les conflits
        const editingValues = ref({});

        // Références aux champs
        const factureRefField = ref(null);
        const currentDateField = ref(null);
        const patientNomField = ref(null);
        const patientAgeField = ref(null);
        const patientDossierField = ref(null);
        const tvaRateField = ref(null);
        const paymentMethodField = ref(null);
        const invoiceNotesField = ref(null);
        const articleFields = ref([]);
        const examenFields = ref([]);

        // Données de la facture
        const cabinet = ref({
            ville: "Tsiroanomandidy",
            nom: "Pharmacie / CENTRE MÉDICAL VONJY AINA",
            titre: "Facturation et Paiements",
            centre: "VENTE PHARMACEUTIQUE",
            adresse: "3TH3 Tsarahoana, Tsiroanomandidy",
            contact: "033 24 427 30 – 034 06 015 13",
            immat: "NIF: 30024 555 38 / STAT: 65201 14 2016 0 00199"
        });

        const patient = ref({
            nom: "",
            age: "",
            dossier: ""
        });

        const articles = ref([]);
        const examens = ref([]);
        const factureRef = ref("");
        const currentDate = ref("");
        const tvaRate = ref(20);
        const paymentMethod = ref("Espèces / Chèque");
        const invoiceNotes = ref("Paiement dû à réception de la facture. Les médicaments non utilisés ne sont pas remboursables.");

        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_articles',
                'field_examens_order',
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
        });

        const fetchOrders = async () => {
            await orderStore.fetchOrders(queryOptions.value);
        };

        onMounted(async () => {
            await fetchOrders();
            if (orderStore.orders.rows && orderStore.orders.rows.length > 0) {
                orderToShow.value = orderStore.orders.rows[0];
                updateFactureData();
            }
        });

        // Fonction pour référencer les champs d'articles
        function setArticleFieldRef(el, type, index, category = 'articles') {
            if (!el) return;
            if (!articleFields.value[index]) {
                articleFields.value[index] = {};
            }
            articleFields.value[index][type] = el;
        }

        // Fonction pour référencer les champs d'examens
        function setExamenFieldRef(el, type, index) {
            if (!el) return;
            if (!examenFields.value[index]) {
                examenFields.value[index] = {};
            }
            examenFields.value[index][type] = el;
        }

        // Empêcher Vue de mettre à jour pendant l'édition
        function preventVueUpdate(event) {
            // Ne rien faire - laisser le DOM gérer l'édition
            // On sauvegarde seulement au blur
        }

        // Gérer le focus - sauvegarder la valeur actuelle
        function handleFocus(event, fieldName) {
            // Stocker la valeur originale
            editingValues.value[fieldName] = event.target.textContent;

            // Sélectionner tout le texte pour faciliter l'édition
            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Gérer le focus pour les articles
        function handleArticleFocus(event, index, fieldType) {
            const fieldName = `article_${index}_${fieldType}`;
            editingValues.value[fieldName] = event.target.textContent;

            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Gérer le focus pour les examens
        function handleExamenFocus(event, index, fieldType) {
            const fieldName = `examen_${index}_${fieldType}`;
            editingValues.value[fieldName] = event.target.textContent;

            nextTick(() => {
                selectAllText(event.target);
            });
        }

        // Sélectionner tout le texte dans un élément
        function selectAllText(element) {
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Sauvegarder et perdre le focus
        function saveAndBlur(event, isTextarea = false) {
            if (!isTextarea) {
                event.preventDefault();
            }
            event.target.blur();
        }

        // Fonction pour parser les articles
        function parseArticles(articlesData) {
            if (!articlesData) return [];

            try {
                if (typeof articlesData === 'string') {
                    const parsed = JSON.parse(articlesData);
                    if (Array.isArray(parsed)) {
                        return parsed.map(item => ({
                            description: item.field_article?.title || item.description || "Produit",
                            quantity: item.field_quantite || item.quantity || 1,
                            unitPrice: item.field_prix_unitaire || item.unitPrice || 0
                        }));
                    }
                }

                if (Array.isArray(articlesData)) {
                    return articlesData.map(item => ({
                        description: item.field_article?.title || item.description || "Produit",
                        quantity: item.field_quantite || item.quantity || 1,
                        unitPrice: item.field_prix_unitaire || item.unitPrice || 0
                    }));
                }
            } catch (e) {
                console.error("Erreur parsing articles:", e);
            }

            return [];
        }

        // Fonction pour parser les examens
        function parseExamens(examensData) {
            if (!examensData) return [];

            try {
                if (typeof examensData === 'string') {
                    const parsed = JSON.parse(examensData);
                    if (Array.isArray(parsed)) {
                        return parsed.map(item => ({
                            description: item.field_examen?.title || "Examen médical",
                            price: parseFloat(item.field_prix) || 0
                        }));
                    }
                }

                if (Array.isArray(examensData)) {
                    return examensData.map(item => ({
                        description: item.field_examen?.title || "Examen médical",
                        price: parseFloat(item.field_prix) || 0
                    }));
                }
            } catch (e) {
                console.error("Erreur parsing examens:", e);
            }

            return [];
        }

        // Mettre à jour les données de la facture
        function updateFactureData() {
            if (!orderToShow.value) return;

            factureRef.value = `${orderToShow.value.title || orderToShow.value.nid || 'REF'}`;
            currentDate.value = orderToShow.value.field_date || new Date().toLocaleDateString('fr-FR');

            patient.value.nom = orderToShow.value.field_client?.title || "";
            patient.value.dossier = orderToShow.value.title || "";

            articles.value = parseArticles(orderToShow.value.field_articles);
            examens.value = parseExamens(orderToShow.value.field_examens_order);
        }

        // Fonctions de mise à jour - appelées seulement au blur
        function updateFactureRef(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.factureRef) {
                factureRef.value = newValue;
            }
        }

        function updateCurrentDate(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.currentDate) {
                currentDate.value = newValue;
            }
        }

        function updatePatientNom(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.patientNom) {
                patient.value.nom = newValue;
            }
        }

        function updatePatientAge(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.patientAge) {
                patient.value.age = newValue;
            }
        }

        function updatePatientDossier(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.patientDossier) {
                patient.value.dossier = newValue;
            }
        }

        function updateArticleDescription(index, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `article_${index}_description`;

            if (newValue && newValue !== editingValues.value[oldValueKey]) {
                if (articles.value[index]) {
                    articles.value[index].description = newValue;
                }
            }
        }

        function updateArticleQuantity(index, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `article_${index}_quantity`;

            if (newValue !== editingValues.value[oldValueKey]) {
                const quantity = cleanNumericText(newValue);
                if (articles.value[index]) {
                    articles.value[index].quantity = quantity;
                }
            }
        }

        function updateArticlePrice(index, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `article_${index}_price`;

            if (newValue !== editingValues.value[oldValueKey]) {
                const price = cleanNumericText(newValue);
                if (articles.value[index]) {
                    articles.value[index].unitPrice = price;
                }
            }
        }

        function updateExamenDescription(index, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `examen_${index}_description`;

            if (newValue && newValue !== editingValues.value[oldValueKey]) {
                if (examens.value[index]) {
                    examens.value[index].description = newValue;
                }
            }
        }

        function updateExamenPrice(index, event) {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `examen_${index}_price`;

            if (newValue !== editingValues.value[oldValueKey]) {
                const price = cleanNumericText(newValue);
                if (examens.value[index]) {
                    examens.value[index].price = price;
                }
            }
        }

        function updateTvaRate(event) {
            const newValue = event.target.textContent.trim();
            if (newValue !== editingValues.value.tvaRate) {
                const rateText = newValue.replace('%', '').trim();
                const rate = cleanNumericText(rateText);
                tvaRate.value = rate;
            }
        }

        function updatePaymentMethod(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.paymentMethod) {
                paymentMethod.value = newValue;
            }
        }

        function updateInvoiceNotes(event) {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.invoiceNotes) {
                invoiceNotes.value = newValue;
            }
        }

        // Calcul des totaux
        const articlesSubTotal = computed(() => {
            return articles.value.reduce((total, article) => {
                return total + (article.quantity * article.unitPrice);
            }, 0);
        });

        const examensSubTotal = computed(() => {
            return examens.value.reduce((total, examen) => {
                return total + examen.price;
            }, 0);
        });

        const subTotal = computed(() => {
            return articlesSubTotal.value + examensSubTotal.value;
        });

        const tvaAmount = computed(() => {
            return subTotal.value * (tvaRate.value / 100);
        });

        const grandTotal = computed(() => {
            return subTotal.value + tvaAmount.value;
        });

        // Fonctions de gestion des articles et examens
        function addArticle() {
            articles.value.push({
                description: "Nouveau produit",
                quantity: 1,
                unitPrice: 0
            });

            // Focus sur le nouveau champ de description après ajout
            nextTick(() => {
                const lastIndex = articles.value.length - 1;
                const field = articleFields.value[lastIndex]?.description;
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        }

        function addExamen() {
            examens.value.push({
                description: "Nouvel examen",
                price: 0
            });

            // Focus sur le nouveau champ de description après ajout
            nextTick(() => {
                const lastIndex = examens.value.length - 1;
                const field = examenFields.value[lastIndex]?.description;
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        }

        function removeArticle(index) {
            articles.value.splice(index, 1);
            articleFields.value.splice(index, 1);
        }

        function removeExamen(index) {
            examens.value.splice(index, 1);
            examenFields.value.splice(index, 1);
        }

        // Formatage monétaire
        function formatCurrency(value, showCurrency = true) {
            const number = parseFloat(value);
            if (isNaN(number)) return showCurrency ? "0.00 MGA" : "0.00";

            const formatted = number.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
            });

            return showCurrency ? `${formatted} MGA` : formatted;
        }

        // Formatage pour l'affichage seulement (sans MGA)
        function formatCurrencyDisplay(value) {
            const number = parseFloat(value);
            if (isNaN(number)) return "0.00";

            return number.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
            });
        }

        // Nettoyage des valeurs numériques
        function cleanNumericText(text) {
            const cleaned = text.toString().replace(',', '.').replace(/[^\d.-]/g, '');
            const number = parseFloat(cleaned);
            return isNaN(number) ? 0 : number;
        }

        // Impression
        function printInvoice() {
            window.print();
        }

        // Surveiller les changements des articles et examens
        watch([articles, examens], () => {
            // Forcer le recalcul des totaux
        }, { deep: true });

        // Surveiller les changements de l'order
        watch(() => orderStore.orders, (newOrders) => {
            if (newOrders.rows && newOrders.rows.length > 0) {
                orderToShow.value = newOrders.rows[0];
                updateFactureData();
            }
        });

        return {
            orderToShow,
            cabinet,
            patient,
            articles,
            examens,
            factureRef,
            currentDate,
            tvaRate,
            paymentMethod,
            invoiceNotes,
            articlesSubTotal,
            examensSubTotal,
            subTotal,
            tvaAmount,
            grandTotal,
            addArticle,
            addExamen,
            removeArticle,
            removeExamen,
            formatCurrency,
            formatCurrencyDisplay,
            printInvoice,
            saveAndBlur,
            updateFactureRef,
            updateCurrentDate,
            updatePatientNom,
            updatePatientAge,
            updatePatientDossier,
            updateArticleDescription,
            updateArticleQuantity,
            updateArticlePrice,
            updateExamenDescription,
            updateExamenPrice,
            updateTvaRate,
            updatePaymentMethod,
            updateInvoiceNotes,
            setArticleFieldRef,
            setExamenFieldRef,
            handleFocus,
            handleArticleFocus,
            handleExamenFocus,
            preventVueUpdate,
            // Références
            factureRefField,
            currentDateField,
            patientNomField,
            patientAgeField,
            patientDossierField,
            tvaRateField,
            paymentMethodField,
            invoiceNotesField,
            smartBack
        };
    }
}
</script>

<style scoped>
/* CSS Spécifique pour le format papier A5 */
@page {
    size: A5;
    margin: 0;
}

body {
    background-color: #e5e7eb;
}

/* La feuille A5 exacte */
.sheet-a5 {
    width: 148mm;
    min-height: 210mm;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Comportement des champs éditables */
.editable-field {
    outline: none;
    min-width: 20px;
    display: inline-block;
    padding: 0 2px;
    cursor: text;
    border-bottom: 1px dashed transparent;
    transition: all 0.2s ease;
}

.editable-field[contenteditable="true"]:hover {
    border-bottom: 1px dashed #9ca3af;
    background-color: #f8fafc;
}

.editable-field[contenteditable="true"]:focus {
    border-bottom: 1px solid #0A346C;
    background-color: #f0f9ff;
    outline: none;
}

/* Champs dans le tableau */
.table-field .editable-field[contenteditable="true"] {
    border: 1px dashed transparent;
    border-radius: 3px;
    padding: 1px 3px;
    min-width: 30px;
}

.table-field .editable-field[contenteditable="true"]:hover {
    border: 1px dashed #cbd5e1;
    background-color: #f8fafc;
}

.table-field .editable-field[contenteditable="true"]:focus {
    border: 1px solid #0A346C;
    background-color: #f0f9ff;
}

/* Pour les champs numériques dans le tableau */
.table-field .editable-field[contenteditable="true"]:focus {
    font-family: 'Courier New', monospace;
}

/* Assurer que les totaux du tableau sont bien alignés à droite */
.numeric-col {
    text-align: right;
}

/* --- STYLES D'IMPRESSION CRITIQUES pour la compacité --- */
@media print {

    html,
    body {
        width: 148mm;
        height: 210mm;
        margin: 0 !important;
        padding: 0 !important;
    }

    .p-4 {
        padding: 0 !important;
    }

    .sheet-a5 {
        padding: 8mm !important;
        margin: 0 auto;
        width: 148mm;
        min-height: 210mm;
        box-shadow: none;
        border: none;
    }

    .sheet-a5 {
        transform: scale(0.95);
        transform-origin: top center;
    }

    .sheet-a5 * {
        line-height: 1.2 !important;
    }

    .no-print {
        display: none !important;
    }

    .editable-field[contenteditable="true"] {
        border-bottom: none !important;
        background-color: transparent !important;
        border: none !important;
    }

    /* FORCER LES COULEURS (Firefox) */
    * {
        -moz-print-color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    .table-field {
        padding-top: 2px !important;
        padding-bottom: 2px !important;
    }

    .print-colors-fix .text-medical-blue,
    .f-header {
        color: #0A346C !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    /* Répétez pour toutes les couleurs */
    .print-colors-fix .text-medical-red {
        color: #CC0000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    .f-normal {
        color: #4b5563 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        font-weight: normal !important;
    }


}

/* Classes Tailwind custom */
.font-serif {
    font-family: "Times New Roman", Times, serif;
}

.font-sans {
    font-family: Helvetica, Arial, sans-serif;
}

.text-medical-blue {
    color: #0A346C;
}

.text-medical-red {
    color: #CC0000;
}

.bg-medical-gray {
    background-color: #F3F4F6;
}

.border-medical-blue {
    border-color: #0A346C;
}

/* Empêcher les sauts de ligne indésirables */
.editable-field br {
    display: none;
}

/* Pour les notes (textarea-like) */
.editable-field[contenteditable="true"].multiline {
    white-space: pre-wrap;
    min-height: 40px;
    display: block;
}
</style>