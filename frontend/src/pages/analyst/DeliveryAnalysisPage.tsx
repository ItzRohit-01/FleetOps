import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid, ChartContainer } from '../../components/ui/ChartContainer'
import { PerformanceTrendChart } from '../../components/charts/TrendCharts'

const DELAY_CAUSES = [
  { reason: 'Highway Congestion & Toll Plaza Queues', occurrences: 28, pct: 44, color: '#0ea5e9' },
  { reason: 'Consignee Loading / Unloading Dwell Time', occurrences: 18, pct: 28, color: '#f59e0b' },
  { reason: 'Mechanical Breakdown / Tyre Blowout', occurrences: 10, pct: 16, color: '#ef4444' },
  { reason: 'Statutory Checkpost / Weight-Bridge Dwell', occurrences: 8, pct: 12, color: '#8b5cf6' },
]

const HUB_DWELL_TIMES = [
  { hub: 'Bhiwandi Hub (Thane)', avgDwellH: 1.8, targetH: 1.2, volume: 54, status: 'Bottleneck' },
  { hub: 'JNPT Port Depot (Navi Mumbai)', avgDwellH: 2.4, targetH: 1.5, volume: 42, status: 'Severe Delay' },
  { hub: 'Kundli Logistics Park (Delhi NCR)', avgDwellH: 1.1, targetH: 1.0, volume: 48, status: 'Optimal' },
  { hub: 'Electronics City (Bengaluru)', avgDwellH: 0.9, targetH: 1.0, volume: 38, status: 'Optimal' },
  { hub: 'Chennai Port Container Terminal', avgDwellH: 2.1, targetH: 1.5, volume: 30, status: 'Bottleneck' },
]

export default function DeliveryAnalysisPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Delivery Fulfillment & SLA Analytics</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Root cause analysis for transit variances, hub turnaround bottlenecks, and customer delivery precision
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Contractual SLA Attainment"
          value="89.2%"
          icon="verified"
          iconColor="#0ea5e9"
          subtext="Target contractual minimum: 90.0%"
        />
        <KpiCard
          label="Average Trip Transit Variance"
          value="+26 mins"
          icon="timelapse"
          iconColor="#f59e0b"
          subtext="Across all scheduled freight routes"
        />
        <KpiCard
          label="Hub Turnaround Dwell"
          value="1.4 hrs"
          icon="warehouse"
          iconColor="#8b5cf6"
          subtext="Dock loading to gate departure interval"
        />
        <KpiCard
          label="First-Attempt Delivery Rate"
          value="98.1%"
          icon="done_all"
          iconColor="#10b981"
          subtext="Successful delivery at receiver bay"
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <ChartContainer
          title="Daily On-Time Delivery Trajectory"
          subtitle="14-day fulfillment precision against 90% SLA baseline"
          height={220}
        >
          <PerformanceTrendChart />
        </ChartContainer>

        <SectionCard
          title="Root Causes of Transit Delays"
          subtitle="Classification of exceptions flagged across 64 delayed trips"
        >
          <div className="space-y-3">
            {DELAY_CAUSES.map((d, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-on-surface">{d.reason}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{d.occurrences} trips</span>
                    <span className="text-[10px] text-on-surface-variant w-8 text-right">({d.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct * 2}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageGrid>

      <SectionCard
        title="Regional Logistics Hub Gate-to-Gate Dwell Performance"
        subtitle="Turnaround times at primary warehouse and port loading docks"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Logistics Hub / Terminal</th>
                <th className="py-2.5 px-3">Weekly Freight Volume</th>
                <th className="py-2.5 px-3">Average Dock Dwell</th>
                <th className="py-2.5 px-3">Target SLA</th>
                <th className="py-2.5 px-3">Operational Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {HUB_DWELL_TIMES.map((h, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface">{h.hub}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{h.volume} trucks</td>
                  <td className="py-3 px-3 font-mono font-medium text-on-surface">{h.avgDwellH} hrs</td>
                  <td className="py-3 px-3 font-mono text-on-surface-variant">{h.targetH} hrs</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      h.status === 'Optimal' ? 'bg-success/10 text-success' :
                      h.status === 'Bottleneck' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
