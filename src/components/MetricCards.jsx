import { formatBillion, formatNumber } from '../utils/parseExcel'

export default function MetricCards({ aggregates }) {
  const { totalRevenue, totalProfit, margin, entityCount } = aggregates

  const cards = [
    { label: 'TOTAL ENTITIES', value: formatNumber(entityCount), unit: '개 법인' },
    { label: 'ANNUAL REVENUE', value: formatBillion(totalRevenue), unit: '원 (백만 기준)' },
    { label: 'OPERATING PROFIT', value: formatBillion(totalProfit), unit: '원 (백만 기준)' },
    { label: 'OPERATING MARGIN', value: margin.toFixed(2) + '%', unit: '영업이익률' },
  ]

  return (
    <section className="metric-grid">
      {cards.map((c) => (
        <article className="metric-card" key={c.label}>
          <div className="metric-eyebrow">
            <span className="dot" />
            {c.label}
          </div>
          <div className="metric-value">{c.value}</div>
          <div className="metric-unit">{c.unit}</div>
        </article>
      ))}
    </section>
  )
}
