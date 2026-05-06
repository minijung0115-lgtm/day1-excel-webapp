import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatBillion } from '../utils/parseExcel'

export default function EntityChart({ data }) {
  const trimmed = data.map((d) => ({
    ...d,
    label: d.법인명.length > 22 ? d.법인명.slice(0, 22) + '…' : d.법인명,
  }))

  return (
    <article className="chart-card chart-card--wide">
      <div className="metric-eyebrow">
        <span className="dot" />
        BY ENTITY
      </div>
      <h3 className="section-title">법인별 영업이익 (Top 10)</h3>
      <p className="chart-sub">연 영업이익 기준 상위 10개 법인</p>
      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height={Math.max(360, trimmed.length * 36)}>
          <BarChart
            data={trimmed}
            layout="vertical"
            margin={{ top: 8, right: 32, left: 12, bottom: 8 }}
          >
            <CartesianGrid stroke="#E8E2DA" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => formatBillion(v)}
              tick={{ fill: '#696969', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="label"
              type="category"
              tick={{ fill: '#141413', fontSize: 12, fontWeight: 450 }}
              tickLine={false}
              axisLine={{ stroke: '#D1CDC7' }}
              width={220}
            />
            <Tooltip
              contentStyle={{
                background: '#FCFBFA',
                border: '1px solid #141413',
                borderRadius: 16,
                fontFamily: 'Sofia Sans, sans-serif',
              }}
              formatter={(value) => formatBillion(Number(value))}
            />
            <Bar dataKey="영업이익" radius={[0, 12, 12, 0]}>
              {trimmed.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.영업이익 >= 0 ? '#141413' : '#CF4500'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
