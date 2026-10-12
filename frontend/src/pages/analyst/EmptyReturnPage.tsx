import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid, ChartContainer } from '../../components/ui/ChartContainer'
import { EmptyReturnTrendChart } from '../../components/charts/TrendCharts'
import { formatINR } from '../../lib/utils'
import {
  RotateCcw,
  TrendingDown,
  Flame,
  Sparkles,
  ArrowRight,
  DollarSign,
  Leaf,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react'

const IMBALANCE_LANES = [
  { lane: 'Mumbai → Panaji (Goa)', outboundRuns: 24, returnRuns: 6, emptyPct: 75, lossINR: 198000, remedy: 'Agricultural cashew export backhaul active' },
  { lane: 'Delhi → Chandigarh', outboundRuns: 32, returnRuns: 14, emptyPct: 56, lossINR: 122000, remedy: 'FMCG distributor backhaul negotiated' },
  { lane: 'Chennai → Tiruchirappalli', outboundRuns: 20, returnRuns: 10, emptyPct: 50, lossINR: 96000, remedy: 'Industrial parts reverse logistics' },
  { lane: 'Bengaluru → Mysuru', outboundRuns: 28, returnRuns: 16, emptyPct: 42, lossINR: 64000, remedy: 'Retail packaging return crates' },
]

export default function EmptyReturnPage() {
  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Command Strip */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-warning/10 text-warning rounded-lg">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface">Empty Return & Backhaul Analytics</h1>
            <p className="text-xs text-on-surface-variant">
              Deadhead mileage economics, corridor imbalance remediation, and autonomous return load capture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-success/10 text-success rounded-lg border border-success/20 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 68.4% Backhauls Matched
          </span>
        </div>
      </div>

      {/* KPI Cards with Lucide Icons */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Empty Return Rate"
          value="22.3%"
          icon={<RotateCcw className="w-5 h-5 text-warning" />}
          iconColor="text-warning"
          iconBg="bg-warning/10"
          subtext="Target < 20% by Q4 close"
          trend={{ value: '-3.7% reduced', positive: true }}
          progress={22}
        />
        <KpiCard
          label="Deadhead Kilometres"
          value="18,420 km"
          icon={<TrendingDown className="w-5 h-5 text-danger" />}
          iconColor="text-danger"
          iconBg="bg-danger/10"
          subtext="Unladen transit in last 14 days"
        />
        <KpiCard
          label="Fuel Burn on Deadheads"
          value={formatINR(460500)}
          icon={<Flame className="w-5 h-5 text-red-600" />}
          iconColor="text-red-600"
          iconBg="bg-red-500/10"
          subtext="Diesel consumed without freight revenue"
        />
        <KpiCard
          label="AI Backhaul Matched"
          value="68.4%"
          icon={<Sparkles className="w-5 h-5 text-success" />}
          iconColor="text-success"
          iconBg="bg-success/10"
          subtext="Dynamic backhaul pairing capture"
          trend={{ value: '+12.1% efficiency', positive: true }}
          progress={68}
        />
      </KpiGrid>

      {/* Chart & Economics Grid */}
      <PageGrid cols={2}>
        <ChartContainer
          title="14-Day Empty Return Trajectory"
          subtitle="Progressive reduction in unladen deadhead transit legs"
          height={220}
        >
          <EmptyReturnTrendChart />
        </ChartContainer>

        <SectionCard
          title="Return Freight Economics"
          subtitle="Direct financial contribution generated from reverse logistics pairing"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-success" /> Monthly Backhaul Value Captured
                </span>
                <span className="font-mono text-success font-bold text-sm">₹18.4 Lakhs</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">Freight value unlocked by automated AI backhaul pairing vs unladen repositioning</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-primary" /> Deadhead Fuel Expense Avoided
                </span>
                <span className="font-mono text-primary font-bold text-sm">₹7.2 Lakhs</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">Direct diesel expense saved by eliminating empty runs on major corridors</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Carbon Emissions Offset
                </span>
                <span className="font-mono text-emerald-600 font-bold text-sm">42.8 Tonnes CO₂</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">Sustainability ESG credit from eliminated empty truck transit</p>
            </div>
          </div>
        </SectionCard>
      </PageGrid>

      {/* Asymmetric Corridors Table */}
      <SectionCard
        title="Corridors with High Freight Imbalance"
        subtitle="Asymmetric lanes where outbound demand significantly outpaces reverse cargo"
        noPad
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-4">Freight Corridor</th>
                <th className="py-2.5 px-3">Outbound Trips</th>
                <th className="py-2.5 px-3">Return Freight</th>
                <th className="py-2.5 px-3">Deadhead Imbalance</th>
                <th className="py-2.5 px-3">Estimated Unladen Loss</th>
                <th className="py-2.5 px-4">AI Remediation Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {IMBALANCE_LANES.map((l, i) => (
                <tr key={i} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-on-surface">{l.lane}</td>
                  <td className="py-3 px-3 text-on-surface-variant font-mono">{l.outboundRuns} runs</td>
                  <td className="py-3 px-3 text-on-surface-variant font-mono">{l.returnRuns} runs</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-danger font-mono text-[11px]">{l.emptyPct}% Empty</span>
                      <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-danger rounded-full" style={{ width: `${l.emptyPct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-danger">{formatINR(l.lossINR)}</td>
                  <td className="py-3 px-4 text-on-surface text-[11px]">{l.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
