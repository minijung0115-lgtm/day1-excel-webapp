import * as XLSX from 'xlsx'

const HEADER_HINTS = ['법인명', '법인코드', '지역', 'Q1매출', '연매출']

function findHeaderRowIndex(rows) {
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const row = rows[i] || []
    const hits = row.filter((cell) =>
      HEADER_HINTS.some((h) => String(cell ?? '').trim() === h)
    ).length
    if (hits >= 2) return i
  }
  return 0
}

function toNumber(v) {
  if (v === null || v === undefined || v === '') return 0
  if (typeof v === 'number') return v
  const n = Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export async function parseExcelFile(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]
  const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })

  const headerIdx = findHeaderRowIndex(aoa)
  const headers = (aoa[headerIdx] || []).map((h) =>
    h == null ? '' : String(h).trim()
  )

  const rows = []
  for (let r = headerIdx + 1; r < aoa.length; r++) {
    const raw = aoa[r] || []
    if (raw.every((c) => c === null || c === undefined || c === '')) continue
    const obj = {}
    headers.forEach((h, i) => {
      if (h) obj[h] = raw[i] ?? null
    })
    if (!obj['법인명'] && !obj['법인코드']) continue
    rows.push(obj)
  }

  const enriched = rows.map((row) => {
    const q1 = toNumber(row['Q1매출'])
    const q2 = toNumber(row['Q2매출'])
    const q3 = toNumber(row['Q3매출'])
    const q4 = toNumber(row['Q4매출'])
    const op1 = toNumber(row['Q1영업이익'])
    const op2 = toNumber(row['Q2영업이익'])
    const op3 = toNumber(row['Q3영업이익'])
    const op4 = toNumber(row['Q4영업이익'])
    return {
      ...row,
      _연매출: q1 + q2 + q3 + q4,
      _연영업이익: op1 + op2 + op3 + op4,
      _Q1매출: q1,
      _Q2매출: q2,
      _Q3매출: q3,
      _Q4매출: q4,
      _Q1영업이익: op1,
      _Q2영업이익: op2,
      _Q3영업이익: op3,
      _Q4영업이익: op4,
    }
  })

  return {
    sheetName: firstSheetName,
    headers: headers.filter(Boolean),
    rows: enriched,
  }
}

export function buildAggregates(rows) {
  const totalRevenue = rows.reduce((s, r) => s + r._연매출, 0)
  const totalProfit = rows.reduce((s, r) => s + r._연영업이익, 0)
  const margin = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0

  const byRegion = {}
  rows.forEach((r) => {
    const key = r['지역'] || '기타'
    if (!byRegion[key]) byRegion[key] = { 지역: key, 매출: 0, 영업이익: 0, 법인수: 0 }
    byRegion[key].매출 += r._연매출
    byRegion[key].영업이익 += r._연영업이익
    byRegion[key].법인수 += 1
  })
  const regionData = Object.values(byRegion).sort((a, b) => b.매출 - a.매출)

  const quarterData = ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => ({
    분기: q,
    매출: rows.reduce((s, r) => s + r[`_${q}매출`], 0),
    영업이익: rows.reduce((s, r) => s + r[`_${q}영업이익`], 0),
  }))

  const entityData = rows
    .map((r) => ({
      법인명: r['법인명'] || r['법인코드'] || '-',
      매출: r._연매출,
      영업이익: r._연영업이익,
    }))
    .sort((a, b) => b.영업이익 - a.영업이익)
    .slice(0, 10)

  return {
    totalRevenue,
    totalProfit,
    margin,
    entityCount: rows.length,
    regionData,
    quarterData,
    entityData,
  }
}

export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-'
  return Math.round(n).toLocaleString('ko-KR')
}

export function formatBillion(n) {
  if (!Number.isFinite(n)) return '-'
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + '조'
  if (Math.abs(n) >= 10_000) return (n / 10_000).toFixed(1) + '억'
  return formatNumber(n) + '백만'
}
