import { useMemo, useState } from 'react'
import FileUpload from './components/FileUpload'
import MetricCards from './components/MetricCards'
import DataTable from './components/DataTable'
import RegionChart from './components/RegionChart'
import QuarterChart from './components/QuarterChart'
import EntityChart from './components/EntityChart'
import ExportButton from './components/ExportButton'
import { buildAggregates, parseExcelFile } from './utils/parseExcel'

export default function App() {
  const [data, setData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (file) => {
    try {
      setLoading(true)
      setStatus('파일을 읽는 중...')
      const parsed = await parseExcelFile(file)
      setData(parsed)
      setFileName(file.name)
      setStatus(
        `${parsed.sheetName} · ${parsed.rows.length} 행 · ${parsed.headers.length} 열 로드됨`
      )
    } catch (err) {
      console.error(err)
      setStatus('파일을 읽지 못했습니다: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const aggregates = useMemo(
    () => (data ? buildAggregates(data.rows) : null),
    [data]
  )

  return (
    <div className="page">
      <header className="nav-pill">
        <div className="brand">
          <span className="brand-dot brand-dot--red" />
          <span className="brand-dot brand-dot--yellow" />
          <span className="brand-name">POSCO INTL · 분기실적</span>
        </div>
        <nav className="nav-links">
          <a className="nav-link is-active">대시보드</a>
          <a className="nav-link">데이터</a>
          <a className="nav-link">차트</a>
          <a className="nav-link">정보</a>
        </nav>
        <button className="search-btn" aria-label="search">
          ↗
        </button>
      </header>

      <main className="container">
        <section className="hero">
          <div className="eyebrow">
            <span className="dot" />
            EXCEL · DASHBOARD
          </div>
          <h1 className="hero-title">
            엑셀 한 장이면<br />
            글로벌 실적이 보입니다.
          </h1>
          <p className="hero-sub">
            xlsx 파일을 업로드하면 첫 번째 시트의 데이터를 분석해
            지역 · 분기 · 법인별 매출과 영업이익을 즉시 시각화합니다.
          </p>
        </section>

        <FileUpload
          onFile={handleFile}
          fileName={fileName}
          status={loading ? '파일을 읽는 중...' : status}
        />

        {data && aggregates && (
          <>
            <ExportButton fileName={fileName} aggregates={aggregates} />

            <div id="report-area">
              <MetricCards aggregates={aggregates} />

              <section className="charts-grid">
                <RegionChart data={aggregates.regionData} />
                <QuarterChart data={aggregates.quarterData} />
                <EntityChart data={aggregates.entityData} />
              </section>
            </div>

            <DataTable headers={data.headers} rows={data.rows} />
          </>
        )}

        {!data && (
          <section className="empty-hint">
            <div className="metric-eyebrow">
              <span className="dot" />
              GETTING STARTED
            </div>
            <h3 className="section-title">시작하려면 엑셀 파일을 업로드하세요</h3>
            <p className="chart-sub">
              <code>법인명 · 지역 · Q1~Q4매출 · Q1~Q4영업이익</code> 컬럼이 있는
              .xlsx 파일이 가장 잘 동작합니다.
            </p>
          </section>
        )}
      </main>

      <footer className="footer">
        <h2 className="footer-title">
          숫자는 차갑지만, 인사이트는 따뜻합니다.
        </h2>
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-eyebrow">DASHBOARD</div>
            <a>요약 지표</a>
            <a>지역별 매출</a>
            <a>분기 추이</a>
            <a>법인 랭킹</a>
          </div>
          <div className="footer-col">
            <div className="footer-eyebrow">DATA</div>
            <a>원본 테이블</a>
            <a>검색 · 필터</a>
            <a>지역 필터</a>
            <a>부문 필터</a>
          </div>
          <div className="footer-col">
            <div className="footer-eyebrow">STACK</div>
            <a>React + Vite</a>
            <a>SheetJS (xlsx)</a>
            <a>Recharts</a>
            <a>No backend</a>
          </div>
          <div className="footer-col">
            <div className="footer-eyebrow">NOTES</div>
            <a>브라우저에서 직접 처리</a>
            <a>업로드 데이터는 저장되지 않습니다</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Excel Dashboard · Mastercard-inspired design</span>
          <span className="lang-pill">한국어 ▾</span>
        </div>
      </footer>
    </div>
  )
}
