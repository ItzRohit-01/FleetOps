import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import {
  PerformanceTrendChart,
  UtilizationTrendChart,
  CostTrendChart,
  EmptyReturnTrendChart,
} from '../../components/charts/TrendCharts'

const CORRIDOR_METRICS = [
  { corridor: 'Mumbai ↔ Pune', trips: 142, revenueINR: 2627000, costINR: 1984000, margin: 24.5, onTimeRate: 94.2 },
  { corridor: 'Delhi ↔ Jaipur', trips: 98, revenueINR: 3420000, costINR: 2630000, margin: 23.1, onTimeRate: 91.8 },
  { corridor: 'Ahmedabad ↔ Surat', trips: 86, revenueINR: 1591000, costINR: 1225000, margin: 23.0, onTimeRate: 88.4 },
  { corridor: 'Bengaluru ↔ Hyderabad', trips: 114, revenueINR: 8151000, costINR: 6412000, margin: 21.3, onTimeRate: 89.5 },
  { corridor: 'Chennai ↔ Visakhapatnam', trips: 56, revenueINR: 5359000, costINR: 4320000, margin: 19.4, onTimeRate: 82.1 },
]

export default function AnalyticsOverviewPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Logistics Intelligence & Analytics</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Executive performance indicators, network asset productivity, route profitability, and AI dispatch ROI
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="On-Time Delivery Rate"
          value="89.2%"
          icon="schedule"
          iconColor="#0ea5e9"
          subtext="14-day rolling network average"
          trend={{ value: '+1.5% vs prior window', positive: true }}
        />
        <KpiCard
          label="Fleet Asset Utilization"
          value="80.4%"
          icon="pie_chart"
          iconColor="#10b981"
          subtext="Active transit vs idle depot dwell time"
          trend={{ value: '+3.2%', positive: true }}
        />
        <KpiCard
          label="Average Cost Per Trip"
          value="₹24,150"
          icon="payments"
          iconColor="#8b5cf6"
          subtext="Fuel, toll, maintenance & HOS wages"
          trend={{ value: '-₹650 lower', positive: true }}
        />
        <KpiCard
          label="Empty Return Run Rate"
          value="22.3%"
          icon="sync_alt"
          iconColor="#f59e0b"
          subtext="Target < 20% by Q4 with AI backhauls"
          trend={{ value: '-3.7% reduced', positive: true }}
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <ChartContainer
          title="On-Time Fulfillment Trend (14 Days)"
          subtitle="Percentage of deliveries arriving inside contractual SLAs"
          height={220}
        >
          <PerformanceTrendChart />
        </ChartContainer>

        <ChartContainer
          title="Fleet Capacity Utilization Curve"
          subtitle="Weighted asset productivity across active regional depots"
          height={220}
        >
          <UtilizationTrendChart />
        </ChartContainer>

        <ChartContainer
          title="Trip Cost Variance (14 Days)"
          subtitle="Average operational spend per completed freight run"
          height={220}
        >
          <CostTrendChart />
        </ChartContainer>

        <ChartContainer
          title="Empty Haul Deadhead Trajectory"
          subtitle="Percentage of transit kilometres traveled without revenue cargo"
          height={220}
        >
          <EmptyReturnTrendChart />
        </ChartContainer>
      </PageGrid>

      <SectionCard
        title="Key Commercial Corridors Profitability"
        subtitle="Network volume, revenue yields, cost breakdown, and gross operating margin"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Corridor</th>
                <th className="py-2.5 px-3">Trips (14d)</th>
                <th className="py-2.5 px-3">Gross Revenue</th>
                <th className="py-2.5 px-3">Operating Cost</th>
                <th className="py-2.5 px-3">Operating Margin</th>
                <th className="py-2.5 px-3">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {CORRIDOR_METRICS.map((c, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface">{c.corridor}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{c.trips}</td>
                  <td className="py-3 px-3 font-mono font-medium text-on-surface">₹{(c.revenueINR / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 font-mono text-on-surface-variant">₹{(c.costINR / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-success">+{c.margin}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${c.onTimeRate >= 90 ? 'text-primary' : 'text-amber-600'}`}>
                      {c.onTimeRate}%
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
