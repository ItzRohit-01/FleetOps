import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import { IncidentTrendChart } from '../../components/charts/TrendCharts'
import { IncidentSeverityChart } from '../../components/charts/FleetStatusChart'

const DEPOT_SAFETY_LEAGUE = [
  { depot: 'Bengaluru Hub', trips: 142, incidents: 0, score: 98, status: 'Exemplary' },
  { depot: 'Jaipur Depot', trips: 98, incidents: 1, score: 95, status: 'Good' },
  { depot: 'Hyderabad Central', trips: 114, incidents: 0, score: 97, status: 'Exemplary' },
  { depot: 'Pune Industrial', trips: 168, incidents: 1, score: 91, status: 'Good' },
  { depot: 'Mumbai North', trips: 220, incidents: 2, score: 88, status: 'Standard' },
  { depot: 'Delhi NCR Hub', trips: 195, incidents: 3, score: 82, status: 'Review Needed' },
  { depot: 'Ahmedabad Logistics', trips: 130, incidents: 3, score: 79, status: 'Action Required' },
  { depot: 'Chennai Port', trips: 112, incidents: 2, score: 81, status: 'Review Needed' },
]

export default function RiskTrendsPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Historical Safety & Risk Trends</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Longitudinal analysis of safety benchmarks, depot accident patterns, and incident reduction curves
        </p>
      </div>

      <PageGrid cols={2}>
        <ChartContainer
          title="14-Day Fleet Incident Frequency"
          subtitle="Daily trend showing spike events and mitigation stabilization"
          height={240}
        >
          <IncidentTrendChart />
        </ChartContainer>

        <ChartContainer
          title="Incident Classification by Severity"
          subtitle="Severity distribution across all logged safety events"
          height={240}
        >
          <IncidentSeverityChart />
        </ChartContainer>
      </PageGrid>

      <SectionCard
        title="Depot Safety League Table"
        subtitle="Ranked performance benchmark across regional operating bases"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Depot Location</th>
                <th className="py-2.5 px-3">Completed Trips (30d)</th>
                <th className="py-2.5 px-3">Incidents Logged</th>
                <th className="py-2.5 px-3">Safety Index</th>
                <th className="py-2.5 px-3">Audit Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {DEPOT_SAFETY_LEAGUE.map((d, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface">{d.depot}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{d.trips} trips</td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${d.incidents === 0 ? 'text-success' : d.incidents >= 3 ? 'text-danger' : 'text-warning'}`}>
                      {d.incidents}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">{d.score} / 100</span>
                      <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.score >= 90 ? 'bg-success' : d.score >= 80 ? 'bg-primary' : 'bg-danger'}`}
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      d.status === 'Exemplary' ? 'bg-success/10 text-success' :
                      d.status === 'Good' ? 'bg-primary/10 text-primary' :
                      d.status === 'Review Needed' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                    }`}>
                      {d.status}
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
