import { useState } from 'react'
import { SectionCard } from '../../components/ui/ChartContainer'
import { useAppStore } from '../../store/useAppStore'

const ANALYST_REPORTS = [
  { id: 'REP-BI-2026-Q3', title: 'Q3 Enterprise Network Profitability & Route Contribution Ledger', date: '2026-10-08', type: 'Excel Spreadsheet (XLSX)', size: '3.6 MB' },
  { id: 'REP-ESG-2026-09', title: 'Scope 1 & 3 Carbon Emissions Footprint & Green Fleet ESG Pack', date: '2026-10-05', type: 'Formal ESG PDF', size: '2.1 MB' },
  { id: 'REP-AI-2026-09', title: 'Autonomous AI Dispatcher Yield & Empty Run Deadhead Reduction ROI', date: '2026-10-02', type: 'Executive Brief (PDF)', size: '1.4 MB' },
  { id: 'REP-FUEL-2026-W40', title: 'Weekly Highway Fuel Variance & Dynamic Fastag Toll Reconciliation', date: '2026-09-30', type: 'CSV Master Data', size: '780 KB' },
  { id: 'REP-SLA-2026-09', title: 'Consolidated Client Service Level Agreement (SLA) Fulfillment Report', date: '2026-09-28', type: 'Client Audit PDF', size: '2.8 MB' },
]

export default function AnalystReportsPage() {
  const showToast = useAppStore(s => s.showToast)
  const [generating, setGenerating] = useState(false)

  function handleDownload(reportTitle: string) {
    showToast(`Downloading "${reportTitle}"`, 'success')
  }

  function handleGenerateNew() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      showToast('Custom Business Intelligence report generated successfully', 'success')
    }, 1200)
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Analytics Dossiers & BI Exports</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Export structured financial ledger summaries, route efficiency datasets, and ESG sustainability filings
          </p>
        </div>
        <button
          onClick={handleGenerateNew}
          disabled={generating}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined sz-sm" style={{ fontSize: 16 }}>
            {generating ? 'hourglass_top' : 'add_chart'}
          </span>
          {generating ? 'Processing BI Model...' : 'Build Custom Analytical Pack'}
        </button>
      </div>

      <SectionCard
        title="Ready-to-Download Intelligence Packages"
        subtitle="Standard financial, operational, and algorithmic reports compiled for management"
      >
        <div className="divide-y divide-outline-variant/30 text-xs">
          {ANALYST_REPORTS.map(rep => (
            <div key={rep.id} className="py-3.5 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined sz-sm" style={{ fontSize: 20 }}>query_stats</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">{rep.title}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    <span className="font-mono text-primary font-bold">{rep.id}</span> · {rep.type} · {rep.size} · Compiled on {rep.date}
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
