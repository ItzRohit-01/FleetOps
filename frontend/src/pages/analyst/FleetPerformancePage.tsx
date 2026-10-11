import { vehicles } from '../../data/mockData'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid, ChartContainer } from '../../components/ui/ChartContainer'
import { UtilizationTrendChart } from '../../components/charts/TrendCharts'

const CATEGORY_STATS = [
  { type: 'Heavy Truck (25–55t)', count: 22, utilization: 84, avgMileage: '3.4 km/L', costPerKm: '₹38.5' },
  { type: 'Medium Truck (9–15t)', count: 12, utilization: 81, avgMileage: '5.2 km/L', costPerKm: '₹26.2' },
  { type: 'Light Truck (7–11t)', count: 4, utilization: 76, avgMileage: '6.8 km/L', costPerKm: '₹20.4' },
  { type: 'Petroleum Tanker', count: 4, utilization: 88, avgMileage: '3.1 km/L', costPerKm: '₹42.0' },
  { type: 'Delivery Van & EV', count: 6, utilization: 72, avgMileage: '12.4 km/kg', costPerKm: '₹14.8' },
]

export default function FleetPerformancePage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Fleet Asset Telematics & Performance</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Vehicle productivity metrics, fuel efficiency, preventative maintenance uptime, and operating expense by tonnage
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Total Fleet Size"
          value={vehicles.length}
          icon="local_shipping"
          iconColor="#0ea5e9"
          subtext="41 active / 5 in workshop / 2 offline"
        />
        <KpiCard
          label="Mean Distance / Vehicle"
          value="4,820 km"
          icon="navigation"
          iconColor="#10b981"
          subtext="Monthly average across commercial fleet"
        />
        <KpiCard
          label="Fuel Efficiency Benchmark"
          value="4.1 km/L"
          icon="local_gas_station"
          iconColor="#f59e0b"
          subtext="+4.8% improvement via route optimization"
          trend={{ value: '+4.8%', positive: true }}
        />
        <KpiCard
          label="Fleet Availability Rate"
          value="89.6%"
          icon="build"
          iconColor="#8b5cf6"
          subtext="Uptime maintained above 85% SLA"
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <ChartContainer
          title="Daily Fleet Utilization Trend"
          subtitle="Proportion of fleet actively engaged in scheduled freight"
          height={220}
        >
          <UtilizationTrendChart />
        </ChartContainer>

        <SectionCard
          title="Vehicle Class Efficiency Matrix"
          subtitle="Tonnage group performance and operating parameters"
        >
          <div className="space-y-3">
            {CATEGORY_STATS.map((cat, i) => (
              <div key={i} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-on-surface">{cat.type}</span>
                  <span className="font-semibold text-primary">{cat.count} Units</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/30">
                  <div>Util: <strong className="text-on-surface">{cat.utilization}%</strong></div>
                  <div>Efficiency: <strong className="text-on-surface">{cat.avgMileage}</strong></div>
                  <div>Cost: <strong className="text-on-surface">{cat.costPerKm}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageGrid>

      <SectionCard
        title="Active Fleet Vehicle Telematics Inventory"
        subtitle="Individual vehicle odometer, service schedules, and fuel type logs"
      >
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-lowest z-10">
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Reg Number</th>
                <th className="py-2.5 px-3">Make / Model</th>
                <th className="py-2.5 px-3">Tonnage</th>
                <th className="py-2.5 px-3">Fuel Type</th>
                <th className="py-2.5 px-3">Odometer</th>
                <th className="py-2.5 px-3">Depot</th>
                <th className="py-2.5 px-3">Next Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-primary">{v.regNumber}</td>
                  <td className="py-2 px-3 text-on-surface">{v.make} {v.model} ({v.year})</td>
                  <td className="py-2 px-3 text-on-surface-variant">{(v.capacityKg / 1000).toFixed(1)}t</td>
                  <td className="py-2 px-3 uppercase text-[10px] font-semibold">{v.fuelType}</td>
                  <td className="py-2 px-3 font-mono text-on-surface">{v.mileageKm.toLocaleString()} km</td>
                  <td className="py-2 px-3 text-on-surface-variant">{v.depot}</td>
                  <td className="py-2 px-3 font-mono text-on-surface-variant">{v.nextServiceDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
