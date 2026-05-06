import { useMemo, useState } from 'react'
import { formatNumber } from '../utils/parseExcel'

const NUMERIC_COLS = new Set([
  '지분율(%)',
  '임직원수',
  'Q1매출',
  'Q2매출',
  'Q3매출',
  'Q4매출',
  '연매출',
  'Q1영업이익',
  'Q2영업이익',
  'Q3영업이익',
  'Q4영업이익',
  '연영업이익',
])

const COMPUTED_FOR = {
  연매출: '_연매출',
  연영업이익: '_연영업이익',
}

export default function DataTable({ headers, rows }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('전체')
  const [sector, setSector] = useState('전체')

  const visibleHeaders = useMemo(
    () => headers.filter((h) => h && !h.startsWith('_')),
    [headers]
  )

  const regions = useMemo(
    () => ['전체', ...Array.from(new Set(rows.map((r) => r['지역']).filter(Boolean)))],
    [rows]
  )
  const sectors = useMemo(
    () => ['전체', ...Array.from(new Set(rows.map((r) => r['사업부문']).filter(Boolean)))],
    [rows]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (region !== '전체' && r['지역'] !== region) return false
      if (sector !== '전체' && r['사업부문'] !== sector) return false
      if (!q) return true
      return Object.values(r).some((v) =>
        String(v ?? '').toLowerCase().includes(q)
      )
    })
  }, [rows, query, region, sector])

  const renderCell = (row, header) => {
    const computedKey = COMPUTED_FOR[header]
    let value = computedKey && row[computedKey] !== undefined ? row[computedKey] : row[header]
    if (NUMERIC_COLS.has(header)) {
      const n = typeof value === 'number' ? value : Number(value)
      if (Number.isFinite(n)) return formatNumber(n)
    }
    if (value === null || value === undefined) return '-'
    return String(value)
  }

  return (
    <section className="table-card">
      <header className="table-header">
        <div>
          <div className="metric-eyebrow">
            <span className="dot" />
            DATA TABLE
          </div>
          <h3 className="section-title">원본 데이터</h3>
        </div>
        <div className="table-controls">
          <input
            className="search-input"
            placeholder="법인명 · 국가 · 제품 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="select-pill"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                지역: {r}
              </option>
            ))}
          </select>
          <select
            className="select-pill"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                부문: {s}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="table-meta">
        총 <strong>{filtered.length}</strong> / {rows.length} 건
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {visibleHeaders.map((h) => (
                <th key={h} className={NUMERIC_COLS.has(h) ? 'num' : ''}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx}>
                {visibleHeaders.map((h) => (
                  <td key={h} className={NUMERIC_COLS.has(h) ? 'num' : ''}>
                    {renderCell(row, h)}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={visibleHeaders.length} className="empty">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
