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

const REGION_COLORS = [
  '#141413',
  '#CF4500',
  '#9A3A0A',
  '#3860BE',
  '#F37338',
  '#555555',
  '#262627',
]

export default function RegionChart({ data }) {
  return (
    <article className="chart-card">
      <div className="metric-eyebrow">
        <span className="dot" />
        BY REGION
      </div>
      <h3 className="section-title">지역별 매출</h3>
      <p className="chart-sub">권역별 연매출 합계 (백만원 단위)</p>
      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#E8E2DA" vertical={false} />
            <XAxis
              dataKey="지역"
              tick={{ fill: '#141413', fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#D1CDC7' }}
            />
            <YAxis
              tickFormatter={(v) => formatBillion(v)}
              tick={{ fill: '#696969', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: '#FCFBFA',
                border: '1px solid #141413',
                borderRadius: 16,
                fontFamily: 'Sofia Sans, sans-serif',
              }}
              formatter={(value) => formatBillion(Number(value))}
              labelStyle={{ fontWeight: 500 }}
            />
            <Bar dataKey="매출" radius={[12, 12, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
