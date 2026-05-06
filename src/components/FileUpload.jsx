import { useRef, useState } from 'react'

export default function FileUpload({ onFile, fileName, status }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (files) => {
    if (!files || !files.length) return
    const file = files[0]
    if (!/\.xlsx$/i.test(file.name)) {
      alert('xlsx 파일만 업로드할 수 있습니다.')
      return
    }
    onFile(file)
  }

  return (
    <section
      className={`upload-zone ${dragOver ? 'is-drag' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <div className="upload-eyebrow">
        <span className="dot" /> UPLOAD
      </div>
      <h2 className="upload-title">
        엑셀 파일을 끌어다 놓거나 선택하세요
      </h2>
      <p className="upload-sub">
        .xlsx 형식의 첫 번째 시트 데이터를 자동으로 읽어
        대시보드에 표시합니다.
      </p>
      <div className="upload-actions">
        <button
          className="btn-ink"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          파일 선택
        </button>
        {fileName && (
          <span className="file-pill" title={fileName}>
            {fileName}
          </span>
        )}
      </div>
      {status && <p className="upload-status">{status}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </section>
  )
}
