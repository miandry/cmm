<template>
    <div>
        <page-loader v-if="isLoading" />
        <div v-if="orderToShow" class="p-4">

            <!-- Boutons d'impression et de navigation -->
            <!-- Boutons d'action - Responsive -->
            <div class="fixed top-4 right-4 no-print z-50">
                <div class="flex flex-row sm:flex-row gap-2">
                    <!-- Bouton Imprimer -->
                    <button @click="printInvoice" class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold sm:font-bold 
                               py-2 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded shadow-md hover:shadow-lg 
                               flex items-center justify-center gap-1 sm:gap-2 transition-all duration-200 
                               min-w-[44px] min-h-[44px] touch-manipulation" aria-label="Imprimer la facture">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span class="text-xs sm:text-sm font-medium hidden sm:inline">Imprimer</span>
                        <span class="text-xs sm:text-sm font-medium sm:hidden">Imp.</span>
                    </button>

                    <!-- Bouton Sauvegarder -->
                    <button @click="saveInvoice" class="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold sm:font-bold 
                       py-2 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded shadow-md hover:shadow-lg 
                       flex items-center justify-center gap-1 sm:gap-2 transition-all duration-200 
                       min-w-[44px] min-h-[44px] touch-manipulation" aria-label="Sauvegarder la facture">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span class="text-xs sm:text-sm font-medium hidden sm:inline">
                            {{ isEditingInvoice ? 'Enregistrer modification' : 'Sauvegarder' }}
                        </span>
                        <span class="text-xs sm:text-sm font-medium sm:hidden">
                            {{ isEditingInvoice ? 'Enregistrer modification' : 'Sauvegarder' }}
                        </span>
                    </button>

                    <!-- Bouton Revenir -->
                    <button @click="smartBack" class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold sm:font-bold 
                               py-2 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded shadow-md hover:shadow-lg 
                               flex items-center justify-center gap-1 sm:gap-2 transition-all duration-200 
                               min-w-[44px] min-h-[44px] touch-manipulation"
                        aria-label="Revenir à la liste des commandes">
                        <i class="ri-arrow-left-line text-base sm:text-lg" aria-hidden="true"></i>
                        <span class="text-xs sm:text-sm font-medium hidden sm:inline">Revenir</span>
                        <span class="text-xs sm:text-sm font-medium sm:hidden">Revenir</span>
                    </button>
                </div>
            </div>

            <!-- Sélecteur de type de facture - caché si field_type = 'caisse' -->
            <div v-if="fieldType !== 'caisse'"
                class="fixed top-4 left-1/2 transform -translate-x-1/2 no-print z-50 w-[90%] max-w-sm mx-auto">
                <div class="flex gap-1 bg-white/95 backdrop-blur-sm p-1 rounded-full shadow-lg border border-gray-200">
                    <button @click="showMedicaments = true; currentPage = 1" :class="[
                        'flex items-center justify-center px-3 py-2 md:px-4 md:py-2 rounded-full font-medium transition-all duration-200 flex-1 min-w-0',
                        showMedicaments
                            ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                    ]" :aria-pressed="showMedicaments" aria-label="Afficher les médicaments">
                        <i class="ri-medicine-bottle-line text-sm md:text-base mr-1 md:mr-2"></i>
                        <span class="text-xs md:text-sm font-medium truncate">Médicaments</span>
                        <span v-if="articles.length > 0"
                            class="ml-1 md:ml-2 text-[10px] md:text-xs bg-white/20 px-1.5 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                            {{ articles.length }}
                        </span>
                    </button>

                    <button @click="showMedicaments = false; currentPage = 1" :class="[
                        'flex items-center justify-center px-3 py-2 md:px-4 md:py-2 rounded-full font-medium transition-all duration-200 flex-1 min-w-0',
                        !showMedicaments
                            ? 'bg-green-600 text-white shadow-md transform scale-[1.02]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                    ]" :aria-pressed="!showMedicaments" aria-label="Afficher les examens">
                        <i class="ri-stethoscope-line text-sm md:text-base mr-1 md:mr-2"></i>
                        <span class="text-xs md:text-sm font-medium truncate">Examens</span>
                        <span v-if="examens.length > 0"
                            class="ml-1 md:ml-2 text-[10px] md:text-xs bg-white/20 px-1.5 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                            {{ examens.length }}
                        </span>
                    </button>
                </div>

                <!-- Indicateur visuel pour mobile -->
                <div v-if="isMobile" class="mt-2 text-center">
                    <div class="text-[10px] text-gray-500 font-medium">
                        {{ showMedicaments ? 'Médicaments' : 'Examens' }} - Page {{ currentPage }}/{{ totalPages }}
                    </div>
                </div>
            </div>

            <!-- Badge informatif quand c'est une caisse -->
            <div v-if="fieldType === 'caisse'"
                class="fixed top-4 left-1/2 transform -translate-x-1/2 no-print z-50 w-[90%] max-w-sm mx-auto">
                <div class="bg-blue-600 text-white p-2 rounded-full shadow-lg border border-gray-200 text-center">
                    <i class="ri-medicine-bottle-line text-sm md:text-base mr-2"></i>
                    <span class="text-xs md:text-sm font-medium">Médicaments (Caisse)</span>
                </div>
            </div>

            <!-- Contrôles de pagination -->
            <div v-if="totalPages > 1" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 no-print z-50">
                <div
                    class="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="ri-arrow-left-line"></i>
                    </button>

                    <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-700">{{ showMedicaments ? 'Médicaments' : 'Examens' }}</span>
                        <span class="font-bold text-blue-600">{{ currentPage }}</span>
                        <span class="text-gray-500">sur</span>
                        <span class="font-bold text-gray-700">{{ totalPages }}</span>
                    </div>

                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="ri-arrow-right-line"></i>
                    </button>
                </div>
            </div>

            <!-- Popup de confirmation pour nouvelle page -->
            <div v-if="showConfirmPopup"
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] no-print">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-[90%] mx-4 overflow-hidden">
                    <div class="p-5">
                        <p class="text-center text-gray-600 mb-4">
                            Voulez-vous créer une nouvelle page pour ajouter cet élément ?
                        </p>
                        <div class="flex gap-3 justify-center mt-6">
                            <button @click="cancelAddItem"
                                class="flex-1 text-sm px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 !rounded-button font-medium whitespace-nowrap">
                                Annuler
                            </button>
                            <button @click="confirmAddItem"
                                class="flex-1 text-sm px-4 py-2 bg-green-500 text-white hover:bg-green-600 !rounded-button font-medium whitespace-nowrap">
                                Continuer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Affichage de la page courante -->
            <div v-for="page in [currentPage]" :key="page">
                <div class="sheet-a5 p-5 relative flex flex-col justify-between print-colors-fix">
                    <div>
                        <div class="mb-12 no-print"></div>
                        <!-- En-tête (identique sur toutes les pages) -->
                        <div class="flex justify-between items-start pb-2 mb-4 font-sans">
                            <div class="w-2/3">
                                <h1 class="text-sm font-bold text-medical-blue uppercase tracking-wide leading-tight">
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
                                <h2 class="font-extrabold text-medical-blue text-sm uppercase leading-none mb-1">
                                    FACTURE
                                </h2>
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

                        <!-- Numéro de page et type de facture -->
                        <div class="absolute top-5 right-5 text-[9px] text-gray-400 font-medium">
                            {{ showMedicaments ? 'Médicaments' : 'Examens' }} - Page {{ currentPage }}/{{ totalPages }}
                        </div>

                        <!-- Informations patient (uniquement sur la première page) -->
                        <div v-if="currentPage === 1"
                            class="bg-medical-gray rounded-md p-2.5 mb-4 print:bg-transparent print:p-0 print:mb-3">
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
                                        @keydown.enter="saveAndBlur($event)"
                                        @focus="handleFocus($event, 'patientDossier')" @input="preventVueUpdate($event)"
                                        ref="patientDossierField">
                                        {{ patient.dossier }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Liste des articles ou examens selon le type sélectionné -->
                        <div class="mb-4">
                            <!-- SECTION MÉDICAMENTS -->
                            <div v-if="showMedicaments">
                                <div v-if="pagedMedicaments.length > 0"
                                    class="flex font-sans text-xs font-bold text-medical-blue border-b-2 border-medical-blue py-1 uppercase">
                                    <div class="w-4/5 pl-1 f-header">Désignation</div>
                                    <div class="w-1/5 text-center f-header">Qté</div>
                                    <div class="w-1/5 numeric-col pr-1 f-header">P.U</div>
                                    <div class="w-1/5 numeric-col pr-1 f-header">Total HT</div>
                                </div>
                                <div class="space-y-0.5">
                                    <div v-for="(article, index) in pagedMedicaments"
                                        :key="'article-' + getArticleIndex(index)"
                                        class="flex text-xs border-b border-gray-100 items-center group table-field">
                                        <div class="w-4/5 pr-2 pl-1 flex items-center min-w-0">
                                            <!-- <span
                                                class="editable-field font-medium text-medical-red truncate-ellipsis single-line"
                                                contenteditable="true"
                                                @blur="(e) => updateArticleDescription(getArticleIndex(index), e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleArticleFocus(e, getArticleIndex(index), 'description')"
                                                @input="preventVueUpdate($event)"
                                                :ref="el => setArticleFieldRef(el, 'description', getArticleIndex(index), 'articles')"
                                                :title="article.description">
                                                {{ article.description }}
                                            </span> -->
                                            <span
                                                class="font-medium text-medical-red truncate-ellipsis single-line py-1">
                                                {{ article.description }}
                                            </span>
                                            <button v-if="fieldType !== 'caisse'"
                                                @click="removeArticle(getArticleIndex(index), 'articles')"
                                                class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg transition-opacity ml-1 opacity-0 group-hover:opacity-100 align-text-bottom flex-shrink-0">×</button>
                                        </div>
                                        <div class="w-1/5 text-center">
                                            <!-- <span class="editable-field text-gray-700" contenteditable="true"
                                                @blur="(e) => updateArticleQuantity(getArticleIndex(index), e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleArticleFocus(e, getArticleIndex(index), 'quantity')"
                                                @input="preventVueUpdate($event)"
                                                :ref="el => setArticleFieldRef(el, 'quantity', getArticleIndex(index), 'articles')">
                                                {{ article.quantity }}
                                            </span> -->
                                            <span class="text-gray-700">
                                                {{ article.quantity }}
                                            </span>
                                        </div>
                                        <div class="w-1/5 numeric-col pr-1">
                                            <!-- <span class="editable-field text-gray-700" contenteditable="true"
                                                @blur="(e) => updateArticlePrice(getArticleIndex(index), e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleArticleFocus(e, getArticleIndex(index), 'price')"
                                                @input="preventVueUpdate($event)"
                                                :ref="el => setArticleFieldRef(el, 'price', getArticleIndex(index), 'articles')">
                                                {{ formatCurrencyDisplay(article.unitPrice) }}
                                            </span> -->
                                            <span class="text-gray-700">
                                                {{ formatCurrencyDisplay(article.unitPrice) }}
                                            </span>
                                        </div>
                                        <div class="w-1/5 numeric-col pr-1 font-bold">
                                            <span class="item-total">{{ formatCurrency(article.quantity *
                                                article.unitPrice,
                                                false) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Message si page vide (après suppression) -->
                                <div v-if="pagedMedicaments.length === 0 && currentPage <= totalPages && articles.length > 0"
                                    class="text-center py-8 text-gray-400 italic">
                                    <i class="ri-medicine-bottle-line text-3xl mb-2"></i>
                                    <p>Page vide - Retour à la page précédente...</p>
                                </div>

                                <!-- Message si aucun médicament du tout -->
                                <div v-if="articles.length === 0 && currentPage === 1"
                                    class="text-center py-8 text-gray-400 italic">
                                    <i class="ri-medicine-bottle-line text-3xl mb-2"></i>
                                    <p>Aucun médicament dans cette facture</p>
                                </div>
                            </div>

                            <!-- SECTION EXAMENS -->
                            <div v-if="!showMedicaments">
                                <div v-if="pagedExamens.length > 0"
                                    class="flex font-sans text-xs font-bold text-medical-blue border-b-2 border-medical-blue py-1 uppercase">
                                    <div class="w-3/5 pl-1 f-header">Désignation</div>
                                    <div class="w-1/5 text-center f-header">Qté</div>
                                    <div class="w-2/5 numeric-col pr-1 f-header">Prix Unitaire</div>
                                    <div class="w-2/5 numeric-col pr-1 f-header">Total HT</div>
                                </div>

                                <div class="space-y-0.5">
                                    <div v-for="(examen, index) in pagedExamens"
                                        :key="'examen-' + getExamenIndex(index)"
                                        class="flex text-xs border-b border-gray-100 items-center group table-field">
                                        <div class="w-3/5 pr-2 pl-1 flex items-center">
                                            <span class="editable-field font-medium text-medical-blue"
                                                contenteditable="true"
                                                @blur="(e) => updateExamenDescription(getExamenIndex(index), e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleExamenFocus(e, getExamenIndex(index), 'description')"
                                                @input="preventVueUpdate($event)"
                                                :ref="el => setExamenFieldRef(el, 'description', getExamenIndex(index))">
                                                {{ examen.description }}
                                            </span>
                                            <button @click="removeExamen(getExamenIndex(index))"
                                                class="no-print text-red-400 hover:text-red-600 font-bold px-2 text-lg transition-opacity ml-1 opacity-0 group-hover:opacity-100 align-text-bottom">×</button>
                                        </div>
                                        <div class="w-1/5 text-center">
                                            <span class="text-gray-700">1</span>
                                        </div>
                                        <div class="w-2/5 numeric-col pr-1">
                                            <span class="editable-field text-gray-700" contenteditable="true"
                                                @blur="(e) => updateExamenPrice(getExamenIndex(index), e)"
                                                @keydown.enter="saveAndBlur($event)"
                                                @focus="(e) => handleExamenFocus(e, getExamenIndex(index), 'price')"
                                                @input="preventVueUpdate($event)"
                                                :ref="el => setExamenFieldRef(el, 'price', getExamenIndex(index))">
                                                {{ formatCurrencyDisplay(examen.price) }}
                                            </span>
                                        </div>
                                        <div class="w-2/5 numeric-col pr-1 font-bold">
                                            <span class="item-total">{{ formatCurrency(examen.price, false) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Message si page vide (après suppression) -->
                                <div v-if="pagedExamens.length === 0 && currentPage <= totalPages && examens.length > 0"
                                    class="text-center py-8 text-gray-400 italic">
                                    <i class="ri-stethoscope-line text-3xl mb-2"></i>
                                    <p>Page vide - Retour à la page précédente...</p>
                                </div>

                                <!-- Message si aucun examen du tout -->
                                <div v-if="examens.length === 0 && currentPage === 1"
                                    class="text-center py-8 text-gray-400 italic">
                                    <i class="ri-stethoscope-line text-3xl mb-2"></i>
                                    <p>Aucun examen dans cette facture</p>
                                </div>
                            </div>

                            <!-- Boutons d'ajout (uniquement sur la dernière page) - cachés si caisse -->
                            <div v-if="currentPage === totalPages && fieldType !== 'caisse'" class="mt-2 no-print">
                                <button v-if="showMedicaments" @click="addArticleWithPageCheck"
                                    class="flex items-center text-xs font-bold text-medical-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">
                                    <i class="ri-add-line mr-1"></i> Ajouter un médicament
                                </button>
                                <button v-if="!showMedicaments" @click="addExamenWithPageCheck"
                                    class="flex items-center text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition-colors">
                                    <i class="ri-add-line mr-1"></i> Ajouter un examen
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- PIED DE PAGE POUR CHAQUE PAGE -->
                    <div>
                        <!-- Totaux pour la page courante -->
                        <div class="flex justify-end">
                            <div class="w-2/3 text-xs">
                                <!-- Total HT de la page -->
                                <div v-if="pageSubTotal > 0" class="flex justify-between py-1">
                                    <span class="font-medium text-gray-700">Total HT Page :</span>
                                    <span class="font-bold numeric-col">{{ formatCurrency(pageSubTotal) }}</span>
                                </div>

                                <!-- Remise pour la page courante -->
                                <div v-if="pageSubTotal > 0" class="flex justify-between py-1 border-t border-gray-300">
                                    <span class="font-medium text-gray-700">Remise (
                                        <span class="editable-field" contenteditable="true" @blur="updateRemiseRate"
                                            @keydown.enter="saveAndBlur($event)"
                                            @focus="handleFocus($event, 'remiseRate')" @input="preventVueUpdate($event)"
                                            ref="remiseRateField">
                                            {{ remiseRate }}%
                                        </span>
                                        ) Page :
                                    </span>
                                    <span class="font-bold numeric-col text-green-600">- {{
                                        formatCurrency(pageRemiseAmount) }}</span>
                                </div>

                                <!-- TVA pour la page courante -->
                                <div v-if="pageSubTotal > 0" class="flex justify-between py-1 border-t border-gray-300"
                                    :class="{ 'no-print': tvaRate == 0 }">
                                    <span class="font-medium text-gray-700">TVA (
                                        <span class="editable-field" contenteditable="true" @blur="updateTvaRate"
                                            @keydown.enter="saveAndBlur($event)" @focus="handleFocus($event, 'tvaRate')"
                                            @input="preventVueUpdate($event)" ref="tvaRateField">
                                            {{ tvaRate }}%
                                        </span>
                                        ) Page :
                                    </span>
                                    <span class="font-bold numeric-col">{{ formatCurrency(pageTvaAmount) }}</span>
                                </div>

                                <!-- Montant TTC de la page -->
                                <div v-if="pageSubTotal > 0"
                                    class="flex justify-between py-1 border-y-2 border-medical-blue mt-1">
                                    <span class="font-bold text-medical-blue text-xs uppercase">Total Page TTC :</span>
                                    <span class="font-extrabold text-medical-blue text-xs numeric-col">{{
                                        formatCurrency(pageTotalAfterRemise) }}</span>
                                    <!--  pageGrandTotal -->
                                </div>

                                <!-- Mode de paiement -->
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

                        <!-- Notes et conditions -->
                        <div class="mt-4 border-t border-dashed border-gray-300 pt-2">
                            <h3 class="font-sans text-xs font-bold text-medical-blue uppercase mb-1">Notes et Conditions
                            </h3>
                            <p class="editable-field text-xs text-gray-700 leading-snug" contenteditable="true"
                                @blur="updateInvoiceNotes" @keydown.enter="saveAndBlur($event, true)"
                                @focus="handleFocus($event, 'invoiceNotes')" @input="preventVueUpdate($event)"
                                ref="invoiceNotesField">
                                {{ invoiceNotes }}
                            </p>
                        </div>

                        <!-- Signature -->
                        <div class="mt-4 pt-3 border-t border-gray-200 text-right">
                            <p class="text-xs italic text-gray-500 mb-1">Signature du Pharmacien / Vendeur</p>
                            <div class="inline-block w-40 h-12 border border-gray-300 rounded print:border-none"></div>
                        </div>
                    </div>
                </div>

                <!-- Saut de page pour l'impression -->
                <div v-if="currentPage < totalPages" class="page-break print:hidden"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore, useInvoiceStore } from '../stores/index.js';
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { toast } from 'vue-sonner';
import PageLoader from '../components/PageLoader.vue';
import { defaultInvoiceHeader, getInvoiceHeader } from '../services/invoiceHeader.js';

export default {
    name: "Facture",
    components: {
        PageLoader
    },
    setup() {
        const route = useRoute()
        const orderStore = useOrderStore()
        const slug = route.query.key

        const invoiceId = ref(route.query.invoice || null)
        const isEditingInvoice = ref(false)

        const orderToShow = ref(null);
        const router = useRouter()

        // Variables pour gérer l'affichage
        const showMedicaments = ref(true);
        const fieldType = ref(''); // Ajout pour stocker field_type

        // Variables de pagination
        const currentPage = ref(1);
        const itemsPerPage = ref(10);

        // Variables pour la popup de confirmation
        const showConfirmPopup = ref(false);
        const pendingItemType = ref(null);

        // Stocker les valeurs originales pour éviter les conflits
        const editingValues = ref({});

        // Références aux champs
        const factureRefField = ref(null);
        const currentDateField = ref(null);
        const patientNomField = ref(null);
        const patientAgeField = ref(null);
        const patientDossierField = ref(null);
        const tvaRateField = ref(null);
        const remiseRateField = ref(null);
        const paymentMethodField = ref(null);
        const invoiceNotesField = ref(null);
        const articleFields = ref([]);
        const examenFields = ref([]);

        const isMobile = ref(false);

        const checkMobile = () => {
            isMobile.value = window.innerWidth < 768;
        };

        const cabinet = ref({ ...defaultInvoiceHeader });

        const loadCabinetHeader = async () => {
            try {
                const response = await getInvoiceHeader();
                if (response.data?.status && response.data?.data) {
                    cabinet.value = { ...defaultInvoiceHeader, ...response.data.data };
                }
            } catch (error) {
                console.error('Impossible de charger l\'en-tête de facture:', error);
            }
        };

        const patient = ref({
            nom: "",
            age: "",
            dossier: ""
        });

        const articles = ref([]);
        const examens = ref([]);
        const factureRef = ref("");
        const currentDate = ref("");
        const tvaRate = ref(0);
        const remiseRate = ref(0);
        const paymentMethod = ref("Espèces / Chèque");
        const invoiceNotes = ref("Paiement dû à réception de la facture. Les médicaments non utilisés ne sont pas remboursables.");

        // ============== PAGINATION ==============

        const totalPages = computed(() => {
            const itemsToShow = showMedicaments.value ? articles.value.length : examens.value.length;
            if (itemsToShow === 0) return 1;
            const pagesNeeded = Math.ceil(itemsToShow / itemsPerPage.value);
            return Math.max(pagesNeeded, 1);
        });

        const isCurrentPageFull = computed(() => {
            const itemsCount = showMedicaments.value ?
                articles.value.length - ((currentPage.value - 1) * itemsPerPage.value) :
                examens.value.length - ((currentPage.value - 1) * itemsPerPage.value);
            return itemsCount >= itemsPerPage.value;
        });

        const pagedMedicaments = computed(() => {
            if (!showMedicaments.value) return [];
            const itemsToShow = articles.value;
            if (itemsToShow.length === 0) return [];
            if (currentPage.value < totalPages.value) {
                const startIndex = (currentPage.value - 1) * itemsPerPage.value;
                const endIndex = startIndex + itemsPerPage.value;
                return itemsToShow.slice(startIndex, endIndex);
            } else {
                const itemsAlreadyShown = (currentPage.value - 1) * itemsPerPage.value;
                return itemsToShow.slice(itemsAlreadyShown);
            }
        });

        const pagedExamens = computed(() => {
            if (showMedicaments.value) return [];
            const itemsToShow = examens.value;
            if (itemsToShow.length === 0) return [];
            if (currentPage.value < totalPages.value) {
                const startIndex = (currentPage.value - 1) * itemsPerPage.value;
                const endIndex = startIndex + itemsPerPage.value;
                return itemsToShow.slice(startIndex, endIndex);
            } else {
                const itemsAlreadyShown = (currentPage.value - 1) * itemsPerPage.value;
                return itemsToShow.slice(itemsAlreadyShown);
            }
        });

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

        const pageSubTotal = computed(() => {
            if (showMedicaments.value) {
                return pagedMedicaments.value.reduce((total, article) => {
                    return total + (article.quantity * article.unitPrice);
                }, 0);
            } else {
                return pagedExamens.value.reduce((total, examen) => {
                    return total + examen.price;
                }, 0);
            }
        });

        const pageRemiseAmount = computed(() => {
            if (pageSubTotal.value === 0) return 0;
            return pageSubTotal.value * (remiseRate.value / 100);
        });

        const pageTotalAfterRemise = computed(() => {
            return pageSubTotal.value - pageRemiseAmount.value;
        });

        const pageTvaAmount = computed(() => {
            if (pageTotalAfterRemise.value === 0) return 0;
            return pageTotalAfterRemise.value * (tvaRate.value / 100);
        });

        const pageGrandTotal = computed(() => {
            return pageTotalAfterRemise.value + pageTvaAmount.value;
        });

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const getArticleIndex = (pageIndex) => {
            const startIndex = (currentPage.value - 1) * itemsPerPage.value;
            return startIndex + pageIndex;
        };

        const getExamenIndex = (pageIndex) => {
            const startIndex = (currentPage.value - 1) * itemsPerPage.value;
            return startIndex + pageIndex;
        };

        const smartBack = () => {
            if (window.history.length > 1) {
                router.back()
            } else {
                router.push({ name: 'commandes' })
            }
        };

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
                'field_type',
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

        // ============== INITIALISATION ==============

        onMounted(async () => {
            await loadCabinetHeader();

            if (invoiceId.value) {
                try {
                    await invoiceStore.fetchInvoice(invoiceId.value, {});
                    if (invoiceStore.error) {
                        toast.error("Une erreur est survenu lors du chargement")
                        return;
                    }
                    loadExistingInvoice(invoiceStore.invoice)
                    isEditingInvoice.value = true;

                    // Récupérer field_type depuis la facture
                    fieldType.value = invoiceStore.invoice.field_type || '';

                    // Si c'est une caisse, forcer l'affichage des médicaments
                    if (fieldType.value === 'caisse') {
                        showMedicaments.value = true;
                    }
                } catch (error) {
                    console.error(error)
                }
            } else {
                await fetchOrders();
                if (orderStore.orders.rows && orderStore.orders.rows.length > 0) {
                    orderToShow.value = orderStore.orders.rows[0];
                    updateFactureData();

                    // Récupérer field_type depuis la commande
                    fieldType.value = orderToShow.value.field_type || '';

                    // Si c'est une caisse, forcer l'affichage des médicaments
                    if (fieldType.value === 'caisse') {
                        showMedicaments.value = true;
                    } else {
                        if (articles.value.length > 0) {
                            showMedicaments.value = true;
                        } else if (examens.value.length > 0) {
                            showMedicaments.value = false;
                        }
                    }
                }
            }

            checkMobile();
            window.addEventListener('resize', checkMobile);
        });

        const loadExistingInvoice = (data) => {
            factureRef.value = data.field_reference_facture || "";
            currentDate.value = data.field_date_facture || new Date().toLocaleDateString('fr-FR');

            patient.value = {
                nom: data.field_patient_nom || "",
                age: data.field_patient_age || "",
                dossier: data.field_patient_dossier || ""
            };

            // Charger les articles de la commande (avec fromOrder: true)
            articles.value = parseArticles(data.field_articles_commande);

            // Charger les articles sauvegardés précédemment dans field_facture_medicaments (avec fromOrder: false)
            if (data.field_facture_medicaments) {
                const savedArticles = (() => {
                    const articlesData = data.field_facture_medicaments;
                    if (!articlesData) return [];
                    try {
                        const parsed = typeof articlesData === 'string' ? JSON.parse(articlesData) : articlesData;
                        if (Array.isArray(parsed)) {
                            return parsed.map(item => ({
                                description: item.field_article?.title || item.description || "Produit",
                                quantity: item.field_quantite || item.quantity || 1,
                                unitPrice: item.field_prix_unitaire || item.unitPrice || 0,
                                isNew: false,
                                fromOrder: false
                            }));
                        }
                    } catch (e) {
                        console.error("Erreur parsing articles sauvegardés:", e);
                    }
                    return [];
                })();
                articles.value = [...articles.value, ...savedArticles];
            }

            // Charger les examens de la commande (avec fromOrder: true)
            examens.value = parseExamens(data.field_examens_dans_commande);

            // Charger les examens sauvegardés précédemment dans field_facture_examens (avec fromOrder: false)
            if (data.field_facture_examens) {
                const savedExamens = (() => {
                    const examensData = data.field_facture_examens;
                    if (!examensData) return [];
                    try {
                        const parsed = typeof examensData === 'string' ? JSON.parse(examensData) : examensData;
                        if (Array.isArray(parsed)) {
                            return parsed.map(item => ({
                                description: item.field_examen?.title || "Examen médical",
                                price: parseFloat(item.field_prix) || 0,
                                isNew: false,
                                fromOrder: false
                            }));
                        }
                    } catch (e) {
                        console.error("Erreur parsing examens sauvegardés:", e);
                    }
                    return [];
                })();
                examens.value = [...examens.value, ...savedExamens];
            }

            tvaRate.value = data.field_tva_facture || 0;
            remiseRate.value = data.field_remise_facture || 0;
            paymentMethod.value = data.field_mode_paiement || "Espèces / Chèque";
            invoiceNotes.value = data.field_notes || "Paiement dû à réception de la facture. Les médicaments non utilisés ne sont pas remboursables.";

            if (data.field_commande) {
                orderToShow.value = { nid: data.field_commande };
            }
        };

        // ============== GESTION DES CHAMPS ÉDITABLES ==============

        const setArticleFieldRef = (el, type, index, category = 'articles') => {
            if (!el) return;
            if (!articleFields.value[index]) {
                articleFields.value[index] = {};
            }
            articleFields.value[index][type] = el;
        };

        const setExamenFieldRef = (el, type, index) => {
            if (!el) return;
            if (!examenFields.value[index]) {
                examenFields.value[index] = {};
            }
            examenFields.value[index][type] = el;
        };

        const preventVueUpdate = (event) => { };

        const handleFocus = (event, fieldName) => {
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        };

        const handleArticleFocus = (event, index, fieldType) => {
            const fieldName = `article_${index}_${fieldType}`;
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        };

        const handleExamenFocus = (event, index, fieldType) => {
            const fieldName = `examen_${index}_${fieldType}`;
            editingValues.value[fieldName] = event.target.textContent;
            nextTick(() => {
                selectAllText(event.target);
            });
        };

        const selectAllText = (element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        };

        const saveAndBlur = (event, isTextarea = false) => {
            if (!isTextarea) {
                event.preventDefault();
            }
            event.target.blur();
        };

        // ============== PARSING DES DONNÉES ==============

        const parseArticles = (articlesData) => {
            if (!articlesData) return [];
            try {
                if (typeof articlesData === 'string') {
                    const parsed = JSON.parse(articlesData);
                    if (Array.isArray(parsed)) {
                        return parsed.map(item => ({
                            description: item.field_article?.title || item.description || "Produit",
                            quantity: item.field_quantite || item.quantity || 1,
                            unitPrice: item.field_prix_unitaire || item.unitPrice || 0,
                            isNew: false,
                            fromOrder: true
                        }));
                    }
                }
                if (Array.isArray(articlesData)) {
                    return articlesData.map(item => ({
                        description: item.field_article?.title || item.description || "Produit",
                        quantity: item.field_quantite || item.quantity || 1,
                        unitPrice: item.field_prix_unitaire || item.unitPrice || 0,
                        isNew: false,
                        fromOrder: true
                    }));
                }
            } catch (e) {
                console.error("Erreur parsing articles:", e);
            }
            return [];
        };

        const parseExamens = (examensData) => {
            if (!examensData) return [];
            try {
                if (typeof examensData === 'string') {
                    const parsed = JSON.parse(examensData);
                    if (Array.isArray(parsed)) {
                        return parsed.map(item => ({
                            description: item.field_examen?.title || "Examen médical",
                            price: parseFloat(item.field_prix) || 0,
                            isNew: false,
                            fromOrder: true
                        }));
                    }
                }
                if (Array.isArray(examensData)) {
                    return examensData.map(item => ({
                        description: item.field_examen?.title || "Examen médical",
                        price: parseFloat(item.field_prix) || 0,
                        isNew: false,
                        fromOrder: true
                    }));
                }
            } catch (e) {
                console.error("Erreur parsing examens:", e);
            }
            return [];
        };

        const updateFactureData = () => {
            if (!orderToShow.value) return;
            factureRef.value = `${orderToShow.value.title || orderToShow.value.nid || 'REF'}`;
            currentDate.value = orderToShow.value.field_date || new Date().toLocaleDateString('fr-FR');
            patient.value.nom = orderToShow.value.field_client?.title || "";
            patient.value.dossier = orderToShow.value.title || "";
            articles.value = parseArticles(orderToShow.value.field_articles);
            examens.value = parseExamens(orderToShow.value.field_examens_order);
            currentPage.value = 1;
        };

        // ============== MISE À JOUR DES CHAMPS ÉDITABLES ==============

        const updateFactureRef = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.factureRef) {
                factureRef.value = newValue;
            }
        };

        const updateCurrentDate = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.currentDate) {
                currentDate.value = newValue;
            }
        };

        const updatePatientNom = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.patientNom) {
                patient.value.nom = newValue;
            }
        };

        const updatePatientAge = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.patientAge) {
                patient.value.age = newValue;
            }
        };

        const updatePatientDossier = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.patientDossier) {
                patient.value.dossier = newValue;
            }
        };

        const updateArticleDescription = (index, event) => {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `article_${index}_description`;
            if (newValue && newValue !== editingValues.value[oldValueKey]) {
                if (articles.value[index]) {
                    articles.value[index].description = newValue;
                }
            }
        };

        const updateArticleQuantity = (index, event) => {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `article_${index}_quantity`;
            if (newValue !== editingValues.value[oldValueKey]) {
                const quantity = cleanNumericText(newValue);
                if (articles.value[index]) {
                    articles.value[index].quantity = quantity;
                }
            }
        };

        const updateArticlePrice = (index, event) => {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `article_${index}_price`;
            if (newValue !== editingValues.value[oldValueKey]) {
                const price = cleanNumericText(newValue);
                if (articles.value[index]) {
                    articles.value[index].unitPrice = price;
                }
            }
        };

        const updateExamenDescription = (index, event) => {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `examen_${index}_description`;
            if (newValue && newValue !== editingValues.value[oldValueKey]) {
                if (examens.value[index]) {
                    examens.value[index].description = newValue;
                }
            }
        };

        const updateExamenPrice = (index, event) => {
            const newValue = event.target.textContent.trim();
            const oldValueKey = `examen_${index}_price`;
            if (newValue !== editingValues.value[oldValueKey]) {
                const price = cleanNumericText(newValue);
                if (examens.value[index]) {
                    examens.value[index].price = price;
                }
            }
        };

        const updateTvaRate = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue !== editingValues.value.tvaRate) {
                const rateText = newValue.replace('%', '').trim();
                const rate = cleanNumericText(rateText);
                tvaRate.value = rate;
            }
        };

        const updateRemiseRate = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue !== editingValues.value.remiseRate) {
                const rateText = newValue.replace('%', '').trim();
                const rate = cleanNumericText(rateText);
                remiseRate.value = rate;
            }
        };

        const updatePaymentMethod = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.paymentMethod) {
                paymentMethod.value = newValue;
            }
        };

        const updateInvoiceNotes = (event) => {
            const newValue = event.target.textContent.trim();
            if (newValue && newValue !== editingValues.value.invoiceNotes) {
                invoiceNotes.value = newValue;
            }
        };

        // ============== GESTION DES ARTICLES ET EXAMENS ==============

        const addArticleWithPageCheck = () => {
            if (isCurrentPageFull.value) {
                pendingItemType.value = 'article';
                showConfirmPopup.value = true;
            } else {
                addArticle();
            }
        };

        const addExamenWithPageCheck = () => {
            if (isCurrentPageFull.value) {
                pendingItemType.value = 'examen';
                showConfirmPopup.value = true;
            } else {
                addExamen();
            }
        };

        const confirmAddItem = () => {
            showConfirmPopup.value = false;
            if (pendingItemType.value === 'article') {
                addArticle();
            } else if (pendingItemType.value === 'examen') {
                addExamen();
            }
            pendingItemType.value = null;
        };

        const cancelAddItem = () => {
            showConfirmPopup.value = false;
            pendingItemType.value = null;
        };

        const addArticle = () => {
            articles.value.push({
                description: "Nouveau produit",
                quantity: 1,
                unitPrice: 0,
                isNew: true
            });
            if (currentPage.value !== totalPages.value) {
                currentPage.value = totalPages.value;
            }
            nextTick(() => {
                const lastIndex = articles.value.length - 1;
                const field = articleFields.value[lastIndex]?.description;
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        };

        const addExamen = () => {
            examens.value.push({
                description: "Nouvel examen",
                price: 0,
                isNew: true
            });
            if (currentPage.value !== totalPages.value) {
                currentPage.value = totalPages.value;
            }
            nextTick(() => {
                const lastIndex = examens.value.length - 1;
                const field = examenFields.value[lastIndex]?.description;
                if (field) {
                    field.focus();
                    selectAllText(field);
                }
            });
        };

        const removeArticle = (index) => {
            articles.value.splice(index, 1);
            articleFields.value.splice(index, 1);
            adjustPaginationAfterRemoval();
        };

        const removeExamen = (index) => {
            examens.value.splice(index, 1);
            examenFields.value.splice(index, 1);
            adjustPaginationAfterRemoval();
        };

        const adjustPaginationAfterRemoval = () => {
            nextTick(() => {
                if (currentPage.value > totalPages.value) {
                    currentPage.value = totalPages.value;
                }
                const itemsCount = showMedicaments.value ? articles.value.length : examens.value.length;
                const currentItems = showMedicaments.value ? pagedMedicaments.value : pagedExamens.value;
                if (currentItems.length === 0 && itemsCount > 0 && currentPage.value > 1) {
                    currentPage.value = currentPage.value - 1;
                }
            });
        };

        // ============== FORMATAGE ==============

        const formatCurrency = (value, showCurrency = true) => {
            const number = parseFloat(value);
            if (isNaN(number)) return showCurrency ? "0.00 MGA" : "0.00";
            const formatted = number.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
            });
            return showCurrency ? `${formatted} MGA` : formatted;
        };

        const formatCurrencyDisplay = (value) => {
            const number = parseFloat(value);
            if (isNaN(number)) return "0.00";
            return number.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
            });
        };

        const cleanNumericText = (text) => {
            const cleaned = text.toString().replace(',', '.').replace(/[^\d.-]/g, '');
            const number = parseFloat(cleaned);
            return isNaN(number) ? 0 : number;
        };

        const printInvoice = () => {
            window.print();
        };

        // ============== SURVEILLANCE ==============

        watch(showMedicaments, () => {
            currentPage.value = 1;
        });

        watch([articles, examens], () => {
            adjustPaginationAfterRemoval();
        }, { deep: true });

        watch(totalPages, (newTotalPages, oldTotalPages) => {
            if (newTotalPages < oldTotalPages && currentPage.value > newTotalPages) {
                currentPage.value = newTotalPages;
            }
            if (newTotalPages < oldTotalPages && newTotalPages > 0) {
                adjustPaginationAfterRemoval();
            }
        });

        watch(() => orderStore.orders, (newOrders) => {
            if (newOrders.rows && newOrders.rows.length > 0) {
                orderToShow.value = newOrders.rows[0];
                updateFactureData();
            }
        });

        const invoiceStore = useInvoiceStore();
        const isLoading = ref(false);

        const saveInvoice = async () => {
            isLoading.value = true;
            try {
                // Filtrer les articles et examens pour sauvegarder SEULEMENT les éléments ajoutés manuellement
                // (ceux qui ne viennent pas de la commande: fromOrder !== true)
                const newArticles = articles.value.filter(article => article.fromOrder !== true);
                const newExamens = examens.value.filter(examen => examen.fromOrder !== true);

                const payload = {
                    entity_type: "node",
                    bundle: "facture",
                    status: 1,
                    field_commande: orderToShow.value?.nid || "",
                    field_date_facture: currentDate.value,
                    field_facture_examens: JSON.stringify(newExamens),
                    field_mode_paiement: paymentMethod.value,
                    field_facture_medicaments: JSON.stringify(newArticles),
                    field_notes: invoiceNotes.value,
                    field_patient_dossier: patient.value.dossier,
                    field_patient_nom: patient.value.nom,
                    field_patient_age: patient.value.age,
                    field_reference_facture: factureRef.value,
                    field_tva_facture: tvaRate.value,
                    field_remise_facture: remiseRate.value,
                };

                if (!isEditingInvoice.value || !invoiceId.value) {
                    payload.title = `facture-${Date.now()}`;
                }

                if (isEditingInvoice.value && invoiceId.value) {
                    payload.nid = invoiceId.value;
                }

                await invoiceStore.saveInvoiceData(payload)
                if (invoiceStore.error) {
                    toast.error("Une erreur est survenue lors de l'enregistrement du facture.")
                    return;
                }

                toast.success("Facture enregistré avec succès")
            } catch (error) {
                console.log('erreur: ', error)
            } finally {
                isLoading.value = false;
            }
        }

        return {
            showMedicaments,
            showConfirmPopup,
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
            currentPage,
            totalPages,
            pagedMedicaments,
            pagedExamens,
            pageSubTotal,
            pageTvaAmount,
            pageGrandTotal,
            addArticleWithPageCheck,
            addExamenWithPageCheck,
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
            confirmAddItem,
            cancelAddItem,
            nextPage,
            prevPage,
            getArticleIndex,
            getExamenIndex,
            factureRefField,
            currentDateField,
            patientNomField,
            patientAgeField,
            patientDossierField,
            tvaRateField,
            paymentMethodField,
            invoiceNotesField,
            smartBack,
            isMobile,
            saveInvoice,
            isEditingInvoice,
            isLoading,
            fieldType,

            remiseRate,
            remiseRateField,
            pageRemiseAmount,
            pageTotalAfterRemise,
            updateRemiseRate,
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
    min-height: 200mm;
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

/* Sauts de page pour l'impression */
.page-break {
    page-break-after: always;
}

/* Lors de l'impression, afficher toutes les pages */
@media print {

    /* Masquer les contrôles de pagination */
    .no-print {
        display: none !important;
    }

    /* S'assurer que chaque feuille A5 est une page séparée */
    .sheet-a5 {
        page-break-after: always;
        margin-bottom: 0;
    }

    /* Dernière page n'a pas de saut */
    .sheet-a5:last-child {
        page-break-after: auto;
    }
}

/* Style pour le compteur de page */
.page-counter {
    position: absolute;
    top: 8mm;
    right: 8mm;
    font-size: 9px;
    color: #666;
}

/* Style pour l'impression des pages multiples */
@media print {
    body {
        overflow: visible !important;
        height: auto !important;
    }

    /* Afficher le compteur de page en impression */
    .page-counter {
        position: fixed;
        top: 5mm;
        right: 8mm;
        font-size: 8px;
        color: #999;
    }
}

/* Style pour les boutons de sélection */
.tab-selector {
    transition: all 0.3s ease;
}

.tab-selector.active {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Animation pour le changement de tab */
.tab-content {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Style pour les compteurs */
.item-count {
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 999px;
}

/* Style pour les messages vides */
.empty-state {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

/* Style pour l'impression - masquer les boutons de navigation */
@media print {

    .tab-selector,
    .tab-navigation {
        display: none !important;
    }

    /* Afficher toutes les sections en impression */
    .print-full-invoice .medicaments-section,
    .print-full-invoice .examens-section {
        display: block !important;
    }
}

/* Styles responsives pour mobile */
@media (max-width: 768px) {

    /* Ajustement du conteneur de facture pour mobile */
    .p-4 {
        padding: 1rem !important;
    }

    /* Meilleur affichage du sélecteur */
    .sheet-a5 {
        width: 100%;
        max-width: 148mm;
        min-height: auto;
        padding: 4mm !important;
        transform: none !important;
    }

    /* Ajustement des textes pour mobile */
    .text-lg {
        font-size: 1rem !important;
    }

    .text-sm {
        font-size: 0.875rem !important;
    }

    .text-xs {
        font-size: 0.75rem !important;
    }

    /* Ajustement des champs éditables */
    .editable-field {
        padding: 0 1px;
        font-size: 0.8rem;
    }

    /* Ajustement du tableau pour mobile */
    .table-field {
        font-size: 0.7rem !important;
        padding: 2px 0 !important;
    }

    .f-header {
        font-size: 0.7rem !important;
        padding: 2px 0 !important;
    }

    /* Ajustement des boutons de pagination */
    .fixed.bottom-4 {
        bottom: 2rem !important;
        width: 90% !important;
    }

    /* Ajustement des boutons d'action */
    .fixed.top-4.right-4 {
        top: 1rem !important;
        right: 1rem !important;
    }

    /* Cache le numéro de page en haut à droite sur mobile */
    .absolute.top-5.right-5 {
        display: none;
    }
}

/* Styles spécifiques pour très petits écrans */
@media (max-width: 480px) {

    /* Réduction supplémentaire des paddings */
    .sheet-a5 {
        padding: 3mm !important;
    }

    /* Ajustement des titres */
    h1.text-lg {
        font-size: 0.9rem !important;
        line-height: 1.2 !important;
    }

    h2.font-extrabold {
        font-size: 1rem !important;
    }

    /* Ajustement des informations patient */
    .bg-medical-gray {
        padding: 0.5rem !important;
    }

    /* Ajustement des colonnes du tableau */
    .w-3\/5 {
        width: 40% !important;
    }

    .w-1\/5 {
        width: 15% !important;
    }

    .w-2\/5 {
        width: 20% !important;
    }

    /* Ajustement des totaux */
    .w-2\/3 {
        width: 100% !important;
    }

    /* Boutons d'action plus petits */
    .fixed.top-4.right-4 .flex {
        flex-direction: column;
        gap: 0.5rem;
    }

    .fixed.top-4.right-4 button {
        padding: 0.5rem 0.75rem !important;
        font-size: 0.75rem !important;
    }
}

/* Amélioration de l'accessibilité tactile */
button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

/* Animation douce pour les transitions */
button,
.editable-field,
.tab-selector {
    transition: all 0.2s ease-in-out;
}

/* Pour les écrans d'impression, réinitialiser les styles mobiles */
@media print {
    .sheet-a5 {
        padding: 8mm !important;
        width: 140mm !important;
        max-height: 205mm !important;
    }

    .text-lg {
        font-size: 1.125rem !important;
    }

    .table-field {
        font-size: 0.75rem !important;
    }

    /* Réafficher le numéro de page pour l'impression */
    .absolute.top-5.right-5 {
        display: block !important;
    }
}

/* Styles responsives pour les boutons d'action */
@media (max-width: 640px) {
    .fixed.top-4.right-4 {
        top: 0.75rem !important;
        right: 0.75rem !important;
    }

    .fixed.top-4.right-4 .flex {
        gap: 0.5rem !important;
    }

    /* Ajustement pour les très petits écrans */
    @media (max-width: 360px) {
        .fixed.top-4.right-4 {
            top: 0.5rem !important;
            right: 0.5rem !important;
        }

        .fixed.top-4.right-4 button {
            padding: 0.5rem !important;
            min-width: 40px !important;
            min-height: 40px !important;
        }

        .fixed.top-4.right-4 .ri-arrow-left-line {
            font-size: 0.875rem !important;
        }

        .fixed.top-4.right-4 svg {
            width: 0.875rem !important;
            height: 0.875rem !important;
        }
    }
}

/* Ajustement pour tablettes */
@media (min-width: 641px) and (max-width: 768px) {
    .fixed.top-4.right-4 {
        top: 1rem !important;
        right: 1rem !important;
    }

    .fixed.top-4.right-4 button {
        padding: 0.625rem 1rem !important;
    }
}

/* Styles d'accessibilité et UX améliorés */
.touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
}

button:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
}

button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Pour les appareils avec hover (desktop) */
@media (hover: hover) {
    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}

/* Pour les appareils sans hover (mobile) */
@media (hover: none) {
    button:active {
        transform: scale(0.95);
    }
}

/* Amélioration de la visibilité sur fond clair */
.shadow-md {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.hover\:shadow-lg:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Assurer une taille minimale pour les doigts sur mobile */
.min-w-\[44px\] {
    min-width: 44px;
}

.min-h-\[44px\] {
    min-height: 44px;
}

/* Ajustement des transitions pour mobile */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

/* Pour l'impression, cacher correctement */
@media print {
    .no-print {
        display: none !important;
    }

    /* S'assurer que rien ne dépasse */
    body {
        overflow: hidden !important;
    }
}

/* Correction pour le z-index sur mobile */
.z-50 {
    z-index: 50;
}

/* S'assurer que les boutons sont au-dessus de tout sur mobile */
@media (max-width: 768px) {
    .fixed.top-4.right-4 {
        z-index: 100;
    }
}

/* Styles pour la colonne description seulement */
.truncate-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    min-width: 0;
    flex: 1;
}

.single-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

/* Quand on édite la description, on montre tout le texte */
.editable-field.font-medium.text-medical-red[contenteditable="true"]:focus,
.editable-field.font-medium.text-medical-blue[contenteditable="true"]:focus {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    position: relative;
    z-index: 10;
    background-color: #f0f9ff;
    border: 1px solid #0A346C;
    border-radius: 3px;
    padding: 1px 3px;
    max-width: none;
    min-width: 50px;
    word-break: break-word;
}

/* Pour le conteneur de la description */
.w-3\/5.pr-2.pl-1 {
    overflow: hidden;
}

/* Style pour la remise (vert) */
.text-green-600 {
    color: #16a34a;
}

/* Pour le bouton de suppression à côté */
.flex-shrink-0 {
    flex-shrink: 0;
}

/* Ajustement pour mobile */
@media (max-width: 768px) {
    .truncate-ellipsis {
        max-width: calc(100% - 28px);
        /* Réserve l'espace pour le bouton × (20px + 8px de marge) */
    }

    .editable-field.font-medium[contenteditable="true"]:focus {
        font-size: 0.8rem;
        min-width: 40px;
    }
}

/* Pour l'impression */
@media print {
    .truncate-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 55mm;
        /* Largeur adaptée pour l'impression A5 */
    }

    /* Cacher le tooltip à l'impression */
    [title] {
        text-decoration: none !important;
    }

    .text-green-600 {
        color: #16a34a !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }
}
</style>