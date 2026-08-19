<template>
    <main class="px-3 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold">Rapports de ventes - Articles</h1>
                <p class="text-sm sm:text-base text-gray-600">Liste des rapports générés lors des ventes</p>
            </div>
            <div class="flex sm:items-center sm:space-x-2">
                <button @click="exportPDF"
                    class="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center sm:justify-normal space-x-2 transition-colors shadow-sm hover:shadow-md order-1 sm:order-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Exporter PDF</span>
                </button>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-4 sm:mb-6">
            <ReportFilters @applyFilter="applyFilter" class="w-full" />
        </div>

        <ReportTable :reports="aggregatedReports" :total="aggregatedTotal" :page="page" :perPage="perPage"
            @pageChange="onPageChange" ref="reportTableRef" />
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ReportFilters from '../components/reports/ReportFilters.vue'
import ReportTable from '../components/reports/ReportTable.vue'
import { useArticleReportsStore } from '../stores/index.js'

export default {
    components: { ReportFilters, ReportTable },
    setup() {
        const store = useArticleReportsStore()
        const page = ref(1)
        const perPage = ref(10000)
        const reportTableRef = ref(null)

        // Fonction pour agréger les données
        const aggregateReports = (data) => {
            if (!data || !data.rows) return { rows: [], total: 0 }

            const aggregatedMap = new Map()

            data.rows.forEach(item => {
                const articleNid = item.field_article?.nid || 'unknown'
                const key = `${articleNid}_${item.field_date}`

                if (aggregatedMap.has(key)) {
                    const existing = aggregatedMap.get(key)
                    existing.field_nombre_vendu = String(
                        parseInt(existing.field_nombre_vendu || 0) +
                        parseInt(item.field_nombre_vendu || 0)
                    )
                } else {
                    aggregatedMap.set(key, {
                        ...item,
                        field_nombre_vendu: String(item.field_nombre_vendu || 0)
                    })
                }
            })

            const aggregatedRows = Array.from(aggregatedMap.values())

            return {
                rows: aggregatedRows,
                total: aggregatedRows.length
            }
        }

        // Computed pour les données agrégées
        const aggregatedReports = computed(() => {
            const rawData = store.reports
            if (!rawData || !rawData.rows) return []

            const aggregated = aggregateReports(rawData)

            return aggregated.rows || []
        })

        const aggregatedTotal = computed(() => {
            return aggregatedReports.value.length
        })

        const queryOptions = ref({
            fields: ['nid', 'field_article', 'field_date', 'field_nombre_vendu'],
            sort: { val: 'field_date', op: 'desc' },
            filters: { status: { val: 1, op: '=' } },
            values: {
                field_article: ['title', 'nid', 'field_total_entree'],
            },
            pager: 0,
            offset: perPage.value
        })

        const fetchReports = async () => {
            try {
                queryOptions.value.pager = page.value - 1
                await store.fetchReports(queryOptions.value)
            } catch (error) {
                console.error('Erreur lors du chargement:', error)
            }
        }

        onMounted(() => {
            fetchReports()
        })

        const applyFilter = async (filter) => {
            // Réinitialiser les filtres
            queryOptions.value.filters = { status: { val: 1, op: '=' } }

            // Appliquer le filtre de période si présent
            if (filter.period) {
                const today = new Date()
                let from, to

                if (filter.period === 'today') {
                    from = today.toISOString().slice(0, 10)
                    to = today.toISOString().slice(0, 10)
                } else if (filter.period === 'week') {
                    const first = new Date(today)
                    first.setDate(today.getDate() - today.getDay() + 1)
                    from = first.toISOString().slice(0, 10)
                    to = new Date().toISOString().slice(0, 10)
                } else if (filter.period === 'month') {
                    const now = new Date()
                    from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
                    to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
                }

                if (from && to) {
                    queryOptions.value.filters.field_date = {
                        val: [from, to],
                        op: 'BETWEEN'
                    }
                }
            }

            // Si des dates personnalisées sont fournies, les utiliser
            if (filter.from && filter.to) {
                queryOptions.value.filters.field_date = {
                    val: [filter.from, filter.to],
                    op: 'BETWEEN'
                }
            }

            page.value = 1
            await fetchReports()
        }

        const onPageChange = async (p) => {
            page.value = p
            await fetchReports()
        }

        // Fonction pour exporter le PDF
        const exportPDF = () => {
            if (reportTableRef.value) {
                reportTableRef.value.exportPDF()
            }
        }

        return {
            aggregatedReports,
            aggregatedTotal,
            page,
            perPage,
            applyFilter,
            onPageChange,
            exportPDF,
            reportTableRef
        }
    }
}
</script>