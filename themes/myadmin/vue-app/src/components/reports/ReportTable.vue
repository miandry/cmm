<template>
    <div>
        <div class="bg-white rounded shadow p-2 sm:p-4 mb-4 overflow-x-auto" id="report-table">
            <table class="w-full text-xs sm:text-sm" id="pdf-table">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="px-2 sm:px-4 py-2 text-left">Article</th>
                        <th class="px-1 sm:px-4 py-2 text-center">Qté total</th>
                        <th class="px-1 sm:px-4 py-2 text-center">Qté vendue</th>
                        <th class="px-1 sm:px-4 py-2 text-center">Qté restante</th>
                        <th class="px-2 sm:px-4 py-2 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in reports" :key="r.nid" class="hover:bg-gray-50 border-b">
                        <td class="px-2 sm:px-4 py-2 max-w-[100px] sm:max-w-none truncate">{{ r.field_article?.title ||
                            '-' }}</td>
                        <td class="px-1 sm:px-4 py-2 text-center">{{ r.field_article?.field_total_entree ?? 0 }}</td>
                        <td class="px-1 sm:px-4 py-2 text-center">{{ r.field_nombre_vendu ?? 0 }}</td>
                        <td class="px-1 sm:px-4 py-2 text-center">{{ (r.field_article?.field_total_entree ?? 0) -
                            (r.field_nombre_vendu ??
                                0) }}</td>
                        <td class="px-2 sm:px-4 py-2 text-xs sm:text-sm">{{ formatDate(r.field_date) }}</td>
                    </tr>
                    <tr v-if="reports.length === 0">
                        <td colspan="5" class="text-center py-4 text-gray-500 text-xs sm:text-sm">Aucune donnée
                            disponible</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="pages > 1" class="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <button @click="changePage(current - 1)" :disabled="current === 1"
                class="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Prev
            </button>
            <button v-for="p in visible" :key="p" @click="changePage(p)" :class="[
                'px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-100',
                { 'font-bold bg-blue-50 border-blue-500': p === current }
            ]">
                {{ p }}
            </button>
            <button @click="changePage(current + 1)" :disabled="current === pages"
                class="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
            </button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { formatDate } from '../../utils/formateDate.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
    name: 'ReportTable',
    props: {
        reports: {
            type: Object,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        },
        page: {
            type: Number,
            default: 1
        },
        perPage: {
            type: Number,
            default: 15
        }
    },
    emits: ['pageChange'],
    setup(props, { emit }) {
        // Calcul de la pagination
        const pages = computed(() => {
            const totalPages = Math.ceil(props.total / props.perPage)
            return Math.max(1, totalPages)
        })

        const current = props.page

        const visible = computed(() => {
            const p = []
            const total = pages.value
            const cur = current

            if (total <= 3) {
                for (let i = 1; i <= total; i++) p.push(i)
            } else if (cur === 1) {
                p.push(1, 2, 3)
            } else if (cur === total) {
                p.push(total - 2, total - 1, total)
            } else {
                p.push(cur - 1, cur, cur + 1)
            }
            return p
        })

        const changePage = (p) => {
            if (p < 1 || p > pages.value) return
            emit('pageChange', p)
        }

        // Fonction d'export PDF
        const exportPDF = () => {
            try {
                // Créer un nouveau document PDF en paysage
                const doc = new jsPDF('landscape', 'mm', 'a4')

                // Ajouter un titre
                doc.setFontSize(18)
                doc.setTextColor(41, 128, 185)
                doc.text('Rapport de ventes - Articles', 14, 20)

                // Ajouter la date d'exportation
                doc.setFontSize(10)
                doc.setTextColor(100, 100, 100)
                const today = new Date()
                const dateStr = today.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                doc.text(`Exporté le : ${dateStr}`, 14, 28)

                // Ajouter un sous-titre avec le nombre de rapports
                doc.setFontSize(9)
                doc.text(`Total des rapports : ${props.reports.length}`, 14, 34)

                // Préparer les données pour le tableau
                const tableData = props.reports.map(r => [
                    r.field_article?.title || '-',
                    (r.field_article?.field_total_entree ?? 0).toString(),
                    (r.field_nombre_vendu ?? 0).toString(),
                    ((r.field_article?.field_total_entree ?? 0) - (r.field_nombre_vendu ?? 0)).toString(),
                    formatDate(r.field_date)
                ])

                // Ajouter le tableau au PDF
                autoTable(doc, {
                    head: [['Article', 'Qté total', 'Qté vendue', 'Qté restante', 'Date']],
                    body: tableData,
                    startY: 40,
                    theme: 'grid',
                    styles: {
                        fontSize: 8,
                        cellPadding: 2,
                        valign: 'middle',
                        halign: 'left'
                    },
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: [255, 255, 255],
                        fontSize: 9,
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    columnStyles: {
                        0: { cellWidth: 'auto', halign: 'left' },
                        1: { cellWidth: 20, halign: 'center' },
                        2: { cellWidth: 20, halign: 'center' },
                        3: { cellWidth: 20, halign: 'center' },
                        4: { cellWidth: 25, halign: 'center' }
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    margin: {
                        top: 40,
                        bottom: 20,
                        left: 10,
                        right: 10
                    },
                    didDrawPage: function (data) {
                        // Ajouter un pied de page
                        doc.setFontSize(8)
                        doc.setTextColor(150, 150, 150)
                        const pageCount = doc.internal.getNumberOfPages()
                        doc.text(
                            `Page ${data.pageNumber} sur ${pageCount}`,
                            data.settings.margin.left,
                            doc.internal.pageSize.height - 10
                        )

                        // Ajouter une ligne de séparation en bas
                        doc.setDrawColor(200, 200, 200)
                        doc.line(
                            data.settings.margin.left,
                            doc.internal.pageSize.height - 15,
                            doc.internal.pageSize.width - data.settings.margin.right,
                            doc.internal.pageSize.height - 15
                        )
                    }
                })

                // Générer le nom du fichier
                const fileName = `rapport_ventes_${today.toISOString().slice(0, 10)}.pdf`

                // Sauvegarder le PDF
                doc.save(fileName)

                console.log('PDF exporté avec succès:', fileName)
            } catch (error) {
                console.error('Erreur lors de l\'export PDF:', error)
                alert('Une erreur est survenue lors de l\'export du PDF. Veuillez réessayer.')
            }
        }

        return {
            pages,
            visible,
            changePage,
            current,
            formatDate,
            exportPDF
        }
    }
}
</script>

<style scoped>
/* Styles optionnels pour le bouton d'export */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Animation du bouton d'export */
button[class*="bg-red-600"]:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

button[class*="bg-red-600"]:active {
    transform: translateY(0);
}

/* Améliorations responsives */
@media (max-width: 640px) {
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
    }

    table {
        min-width: 500px;
    }
}

@media (max-width: 480px) {
    table {
        font-size: 10px;
    }

    th,
    td {
        padding: 4px 6px;
    }
}
</style>