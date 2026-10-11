import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import { UtilizationTrendChart, CostTrendChart } from '../../components/charts/TrendCharts'
import { todayKpis, dailyMetrics } from '../../data/mockData'
import { formatINR } from '../../lib/utils'

const totalCostEstimate = dailyMetrics.reduce((s, m) => s + m.costPerTripINR * m.totalDeliveries, 0)
const avgCostPerTrip = Math.round(dailyMetrics.reduce((s,m) => s + m.costPerTripINR, 0) / dailyMetrics.length)

export default function BusinessIntelligencePage() {
  return (
    <div className="max-w-[1400px]">
      <KpiGrid cols={4}>
        <KpiCard label="Fleet Utilization" value={`${todayKpis.fleetUtilization}%`} icon="speed" iconColor="text-info" iconBg="bg-info/10" progress={todayKpis.fleetUtilization} trend={{ value: '3%', positive: true }} />
        <KpiCard label="On-Time Rate" value={`${todayKpis.onTimeRate}%`} icon="schedule" iconColor="text-success" iconBg="bg-success/10" progress={todayKpis.onTimeRate} />
        <KpiCard label="Avg Cost / Trip" value={formatINR(avgCostPerTrip)} icon="payments" iconColor="text-warning" iconBg="bg-warning/10" subValue="14-day average" />
        <KpiCard label="Empty Return Rate" value={`${todayKpis.emptyReturnRate}%`} icon="sync_alt" iconColor="text-danger" iconBg="bg-danger/10" subValue="Target: 15%" />
      </KpiGrid>

      <PageGrid className="mb-4">
        <ChartContainer title="Fleet Utilization Trend" subtitle="14 days — available + assigned + on-trip / total" height={240}>
          <UtilizationTrendChart />
        </ChartContainer>
        <ChartContainer title="Cost Per Trip Trend" subtitle="Average operating cost per completed trip (₹)" height={240}>
          <CostTrendChart />
        </ChartContainer>
      </PageGrid>

      <SectionCard title="14-Day Performance Summary" subtitle="Rolling operational metrics" noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                {['Date','Deliveries','On-Time','On-Time %','Utilization','Cost/Trip','Empty Return %'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {[...dailyMetrics].reverse().map(m => (
                <tr key={m.date} className="hover:bg-surface-container-low">
                  <td className="px-4 py-2.5 font-medium text-on-surface">{m.date}</td>
                  <td className="px-4 py-2.5">{m.totalDeliveries}</td>
                  <td className="px-4 py-2.5">{m.onTimeDeliveries}</td>
                  <td className={`px-4 py-2.5 font-semibold ${m.onTimeRate >= 90 ? 'text-success' : m.onTimeRate >= 85 ? 'text-warning' : 'text-danger'}`}>
                    {m.onTimeRate.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2.5">{m.utilization}%</td>
                  <td className="px-4 py-2.5">{formatINR(m.costPerTripINR)}</td>
                  <td className={`px-4 py-2.5 font-semibold ${m.emptyReturnRate <= 20 ? 'text-success' : m.emptyReturnRate <= 25 ? 'text-warning' : 'text-danger'}`}>
                    {m.emptyReturnRate}%
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
