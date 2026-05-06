import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from 'recharts'
import { formatBillion } from '../utils/parseExcel'

export default function QuarterChart({ data }) {
  return (
    <article className="chart-card">
      <div className="metric-eyebrow">
        <span className="dot" />
        BY QUARTER
      </div>
      <h3 className="section-title">분기별 매출 추이</h3>
      <p className="chart-sub">Q1 → Q4 매출과 영업이익 흐름</p>
      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={data}
            margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CF4500" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#CF4500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E8E2DA" vertical={false} />
            <XAxis
              dataKey="분기"
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
            />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
            <Area
              type="monotone"
              dataKey="매출"
              stroke="#CF4500"
              strokeWidth={2.5}
              fill="url(#revFill)"
            />
            <Line
              type="monotone"
              dataKey="영업이익"
              stroke="#141413"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#141413' }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
