import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid, ChartContainer } from '../../components/ui/ChartContainer'
import { EmptyReturnTrendChart } from '../../components/charts/TrendCharts'
import { formatINR } from '../../lib/utils'

const IMBALANCE_LANES = [
  { lane: 'Mumbai → Panaji (Goa)', outboundRuns: 24, returnRuns: 6, emptyPct: 75, lossINR: 198000, remedy: 'Agricultural export load matching active' },
  { lane: 'Delhi → Chandigarh', outboundRuns: 32, returnRuns: 14, emptyPct: 56, lossINR: 122000, remedy: 'FMCG distributor backhaul negotiated' },
  { lane: 'Chennai → Tiruchirappalli', outboundRuns: 20, returnRuns: 10, emptyPct: 50, lossINR: 96000, remedy: 'Industrial parts reverse logistics' },
  { lane: 'Bengaluru → Mysuru', outboundRuns: 28, returnRuns: 16, emptyPct: 42, lossINR: 64000, remedy: 'Retail packaging return crates' },
]

export default function EmptyReturnPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Empty Return & Backhaul Optimization</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Deadhead mileage analytics, reverse logistics capacity utilization, and AI return-load capture savings
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Empty Return Rate"
          value="22.3%"
          icon="sync_alt"
          iconColor="#f59e0b"
          subtext="Target < 20% by end of quarter"
          trend={{ value: '-3.7% reduced', positive: true }}
        />
        <KpiCard
          label="Deadhead Kilometres"
          value="18,420 km"
          icon="wrong_location"
          iconColor="#ef4444"
          subtext="Unproductive return transit in 14 days"
        />
        <KpiCard
          label="Fuel Burn on Deadheads"
          value={formatINR(460500)}
          icon="local_fire_department"
          iconColor="#dc2626"
          subtext="Direct fuel consumed without revenue"
        />
        <KpiCard
          label="AI Backhaul Matched"
          value="68.4%"
          icon="auto_awesome"
          iconColor="#10b981"
          subtext="Return loads paired dynamically"
          trend={{ value: '+12.1% efficiency', positive: true }}
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <ChartContainer
          title="14-Day Empty Return Trajectory"
          subtitle="Reduction in percentage of deadhead transit legs"
          height={220}
        >
          <EmptyReturnTrendChart />
        </ChartContainer>

        <SectionCard
          title="Return Load Capture Economics"
          subtitle="Financial impact of autonomous return freight pairing"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>Monthly Backhaul Revenue Captured</span>
                <span className="font-mono text-success font-bold">₹18.4 Lakhs</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">Freight value unlocked by automated AI pairing vs empty return travel</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>Deadhead Fuel Expense Avoided</span>
                <span className="font-mono text-primary font-bold">₹7.2 Lakhs</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">Direct diesel saved by eliminating unladen repositioning legs</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>Carbon Emissions Offset</span>
                <span className="font-mono text-emerald-600 font-bold">42.8 Tonnes CO₂</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">Net sustainability credit from eliminated deadhead mileage</p>
            </div>
          </div>
        </SectionCard>
      </PageGrid>

      <SectionCard
        title="Corridors with High Deadhead Imbalance"
        subtitle="Asymmetric lanes with heavy freight demand in only one direction"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Freight Lane</th>
                <th className="py-2.5 px-3">Outbound Trips</th>
                <th className="py-2.5 px-3">Return Freight</th>
                <th className="py-2.5 px-3">Deadhead Rate</th>
                <th className="py-2.5 px-3">Estimated Loss</th>
                <th className="py-2.5 px-3">AI Mitigation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {IMBALANCE_LANES.map((l, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface">{l.lane}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{l.outboundRuns} runs</td>
                  <td className="py-3 px-3 text-on-surface-variant">{l.returnRuns} runs</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-danger">{l.emptyPct}% Empty</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-danger">{formatINR(l.lossINR)}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{l.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
