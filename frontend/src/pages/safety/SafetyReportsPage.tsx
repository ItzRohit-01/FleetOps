import { useState } from 'react'
import { SectionCard } from '../../components/ui/ChartContainer'
import { useAppStore } from '../../store/useAppStore'

const REPORTS = [
  { id: 'REP-SAF-2026-10', title: 'Monthly Fleet Incident & Safety Audit (October 2026)', date: '2026-10-10', type: 'Executive PDF', size: '2.4 MB', status: 'Ready' },
  { id: 'REP-HOS-2026-W41', title: 'Weekly Hours of Service (HOS) Fatigue Compliance Register', date: '2026-10-09', type: 'Spreadsheet (XLSX)', size: '840 KB', status: 'Ready' },
  { id: 'REP-RTO-2026-Q3', title: 'Statutory RTO Fitness & National Permit Parity Report', date: '2026-10-01', type: 'Government Audit PDF', size: '4.1 MB', status: 'Ready' },
  { id: 'REP-INS-2026-09', title: 'Commercial Insurance Claim Dossier & Damage Assessor Log', date: '2026-09-30', type: 'Legal Dossier (PDF)', size: '1.8 MB', status: 'Ready' },
  { id: 'REP-TEL-2026-09', title: 'Telematics Speeding & Harsh Event Summary Matrix', date: '2026-09-28', type: 'CSV Dataset', size: '512 KB', status: 'Ready' },
]

export default function SafetyReportsPage() {
  const showToast = useAppStore(s => s.showToast)
  const [generating, setGenerating] = useState(false)

  function handleDownload(reportTitle: string) {
    showToast(`Downloading "${reportTitle}"`, 'success')
  }

  function handleGenerateNew() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      showToast('New Safety Compliance Audit dossier compiled successfully', 'success')
    }, 1200)
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Safety Audits & Statutory Reports</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Download certified audit packages for ministry RTO compliance, insurers, and corporate health & safety
          </p>
        </div>
        <button
          onClick={handleGenerateNew}
          disabled={generating}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined sz-sm" style={{ fontSize: 16 }}>
            {generating ? 'hourglass_top' : 'post_add'}
          </span>
          {generating ? 'Compiling Dossier...' : 'Generate New Audit Report'}
        </button>
      </div>

      <SectionCard
        title="Archived Certified Reports"
        subtitle="Formal safety records and compliance submissions ready for download"
      >
        <div className="divide-y divide-outline-variant/30 text-xs">
          {REPORTS.map(rep => (
            <div key={rep.id} className="py-3.5 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined sz-sm" style={{ fontSize: 20 }}>description</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">{rep.title}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    <span className="font-mono text-primary font-bold">{rep.id}</span> · {rep.type} · {rep.size} · Generated on {rep.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(rep.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-container-low hover:bg-surface-container-high text-primary border border-outline-variant/60 transition-colors"
              >
                <span className="material-symbols-outlined sz-sm" style={{ fontSize: 16 }}>download</span>
                Download
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
