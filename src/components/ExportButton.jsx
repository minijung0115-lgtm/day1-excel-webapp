import { useState } from 'react'
import { exportDashboardToPdf } from '../utils/exportPdf'

export default function ExportButton({ fileName, aggregates, disabled }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const onClick = async () => {
    if (busy || disabled) return
    try {
      setBusy(true)
      setMsg('PDF를 생성하는 중...')
      const out = await exportDashboardToPdf({ fileName, aggregates })
      setMsg(`저장됨: ${out}`)
    } catch (err) {
      console.error(err)
      setMsg('PDF 생성 실패: ' + err.message)
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  return (
    <div className="export-bar">
      <div>
        <div className="metric-eyebrow">
          <span className="dot" />
          REPORT
        </div>
        <h3 className="section-title">분석 결과 보고서</h3>
        <p className="chart-sub">
          현재 대시보드의 지표와 차트를 A4 PDF로 저장합니다.
        </p>
      </div>
      <div className="export-actions">
        <button
          className="btn-ink"
          onClick={onClick}
          disabled={disabled || busy}
          type="button"
        >
          {busy ? 'PDF 생성 중...' : 'PDF 보고서 출력'}
        </button>
        {msg && <span className="export-msg">{msg}</span>}
      </div>
    </div>
  )
}
