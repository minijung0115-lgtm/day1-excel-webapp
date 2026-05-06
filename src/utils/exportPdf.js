import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { formatBillion, formatNumber } from './parseExcel'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MARGIN_MM = 12

function todayString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

async function captureElement(el) {
  return html2canvas(el, {
    scale: 2,
    backgroundColor: '#F3F0EE',
    useCORS: true,
    logging: false,
    windowWidth: el.scrollWidth,
  })
}

function addCoverPage(pdf, { fileName, aggregates }) {
  const w = A4_WIDTH_MM
  const h = A4_HEIGHT_MM

  pdf.setFillColor(243, 240, 238)
  pdf.rect(0, 0, w, h, 'F')

  pdf.setFillColor(207, 69, 0)
  pdf.circle(MARGIN_MM + 2, MARGIN_MM + 2, 1.4, 'F')
  pdf.setTextColor(105, 105, 105)
  pdf.setFontSize(10)
  pdf.text('EXCEL DASHBOARD REPORT', MARGIN_MM + 6, MARGIN_MM + 3.2)

  pdf.setTextColor(20, 20, 19)
  pdf.setFontSize(28)
  pdf.text('Quarterly Performance', MARGIN_MM, 60)
  pdf.text('Analytics Report', MARGIN_MM, 72)

  pdf.setFontSize(11)
  pdf.setTextColor(85, 85, 85)
  pdf.text(`Generated: ${todayString()}`, MARGIN_MM, 86)
  if (fileName) pdf.text(`Source: ${fileName}`, MARGIN_MM, 92)

  const summaryY = 120
  const cellW = (w - MARGIN_MM * 2) / 2
  const cellH = 30

  const cells = [
    { label: 'Total Entities', value: formatNumber(aggregates.entityCount) },
    { label: 'Annual Revenue', value: formatBillion(aggregates.totalRevenue) },
    { label: 'Operating Profit', value: formatBillion(aggregates.totalProfit) },
    { label: 'Operating Margin', value: aggregates.margin.toFixed(2) + '%' },
  ]

  cells.forEach((c, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = MARGIN_MM + col * cellW
    const y = summaryY + row * (cellH + 6)
    pdf.setFillColor(252, 251, 250)
    pdf.roundedRect(x, y, cellW - 4, cellH, 4, 4, 'F')
    pdf.setTextColor(105, 105, 105)
    pdf.setFontSize(8)
    pdf.text(c.label.toUpperCase(), x + 6, y + 8)
    pdf.setTextColor(20, 20, 19)
    pdf.setFontSize(20)
    pdf.text(String(c.value), x + 6, y + 22)
  })

  pdf.setFontSize(8)
  pdf.setTextColor(105, 105, 105)
  pdf.text('Excel Dashboard · React + Vite · No backend', MARGIN_MM, h - 10)
}

function addImagePages(pdf, canvas, headerLabel) {
  const pageW = A4_WIDTH_MM
  const pageH = A4_HEIGHT_MM
  const usableW = pageW - MARGIN_MM * 2
  const headerH = 14

  const ratio = canvas.width / usableW
  const fullImgH = canvas.height / ratio
  const slicePxPerPage = (pageH - MARGIN_MM * 2 - headerH) * ratio

  let yPx = 0
  let pageIdx = 0
  while (yPx < canvas.height) {
    const sliceHpx = Math.min(slicePxPerPage, canvas.height - yPx)
    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = sliceHpx
    const ctx = sliceCanvas.getContext('2d')
    ctx.fillStyle = '#F3F0EE'
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
    ctx.drawImage(
      canvas,
      0, yPx, canvas.width, sliceHpx,
      0, 0, canvas.width, sliceHpx
    )
    const imgData = sliceCanvas.toDataURL('image/jpeg', 0.92)

    pdf.addPage()
    pdf.setFillColor(243, 240, 238)
    pdf.rect(0, 0, pageW, pageH, 'F')

    pdf.setFillColor(207, 69, 0)
    pdf.circle(MARGIN_MM + 2, MARGIN_MM + 2, 1.4, 'F')
    pdf.setTextColor(105, 105, 105)
    pdf.setFontSize(9)
    pdf.text(headerLabel, MARGIN_MM + 6, MARGIN_MM + 3.2)

    const sliceImgH = sliceHpx / ratio
    pdf.addImage(
      imgData,
      'JPEG',
      MARGIN_MM,
      MARGIN_MM + headerH,
      usableW,
      sliceImgH
    )

    pdf.setFontSize(8)
    pdf.setTextColor(105, 105, 105)
    pdf.text(`Page ${pageIdx + 2}`, pageW - MARGIN_MM - 14, pageH - 6)

    yPx += sliceHpx
    pageIdx += 1
  }
}

export async function exportDashboardToPdf({ fileName, aggregates }) {
  const target = document.getElementById('report-area')
  if (!target) throw new Error('report-area를 찾을 수 없습니다.')

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  addCoverPage(pdf, { fileName, aggregates })

  const canvas = await captureElement(target)
  addImagePages(pdf, canvas, 'DASHBOARD VISUALS')

  const out = `dashboard-report-${todayString()}.pdf`
  pdf.save(out)
  return out
}
