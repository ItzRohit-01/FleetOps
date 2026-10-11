import { recommendations, vehicleById, driverById, jobById } from '../../data/mockData'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import StatusBadge from '../../components/ui/StatusBadge'

const MODEL_BENCHMARKS = [
  { metric: 'Autonomous Recommendation Acceptance Rate', aiScore: '87.4%', humanScore: '—', advantage: '+4.2% QoQ' },
  { metric: 'Mean Time to Dispatch Assignment', aiScore: '4.2 sec', humanScore: '18.5 min', advantage: '264x faster' },
  { metric: 'Route Distance Optimization Reduction', aiScore: '-8.6%', humanScore: '-2.1%', advantage: '4.1x better' },
  { metric: 'Deadhead Backhaul Pairing Precision', aiScore: '68.4%', humanScore: '32.0%', advantage: '+36.4% gain' },
  { metric: 'HOS Rest Compliance Adherence', aiScore: '99.8%', humanScore: '91.2%', advantage: 'Near zero violations' },
]

export default function AIEffectivenessPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Autonomous AI Dispatcher Effectiveness</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Algorithmic accuracy metrics, operator override frequency, decision latency, and neural optimization ROI
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="AI Recommendation Acceptance"
          value="87.4%"
          icon="smart_toy"
          iconColor="#8b5cf6"
          subtext="Approved without modification by dispatchers"
          trend={{ value: '+3.1% this month', positive: true }}
        />
        <KpiCard
          label="Mean Dispatch Decision Time"
          value="4.2 sec"
          icon="bolt"
          iconColor="#0ea5e9"
          subtext="From load ingestion to optimal pairing"
        />
        <KpiCard
          label="Estimated Monthly Net ROI"
          value="₹12.8 Lakhs"
          icon="currency_rupee"
          iconColor="#10b981"
          subtext="Fuel saved & deadhead backhaul revenue"
          trend={{ value: '₹1.4L above forecast', positive: true }}
        />
        <KpiCard
          label="Safety Constraint Compliance"
          value="100.0%"
          icon="verified_user"
          iconColor="#10b981"
          subtext="Zero HOS or capacity constraint violations"
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <SectionCard
          title="Neural Engine vs Manual Operator Benchmarks"
          subtitle="Comparative efficiency analysis across key operational dimensions"
        >
          <div className="space-y-3">
            {MODEL_BENCHMARKS.map((b, i) => (
              <div key={i} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-on-surface">{b.metric}</span>
                  <span className="font-mono font-bold text-primary">{b.advantage}</span>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/30">
                  <span>AI Performance: <strong className="text-on-surface">{b.aiScore}</strong></span>
                  {b.humanScore !== '—' && (
                    <span>Manual Baseline: <strong className="text-on-surface">{b.humanScore}</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Dispatcher Override Reason Distribution"
          subtitle="Analysis of 12.6% manual supervisor interventions"
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-on-surface">Client Specific Vehicle Restriction / Request</span>
                <span className="font-bold text-on-surface">42% (52 trips)</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-on-surface">Driver Personal Preference / Local Route Knowhow</span>
                <span className="font-bold text-on-surface">28% (35 trips)</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-on-surface">Local Unscheduled Road Closure / Toll Strike</span>
                <span className="font-bold text-on-surface">18% (22 trips)</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-danger rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-on-surface">Urgent Priority Re-allocation</span>
                <span className="font-bold text-on-surface">12% (15 trips)</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </SectionCard>
      </PageGrid>

      <SectionCard
        title="Recent Algorithmic Pairing Decisions"
        subtitle="Sampling of automated match decisions and supervisor verdicts"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Decision ID</th>
                <th className="py-2.5 px-3">Job & Customer</th>
                <th className="py-2.5 px-3">Assigned Vehicle</th>
                <th className="py-2.5 px-3">Driver</th>
                <th className="py-2.5 px-3">AI Match Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {recommendations.map(r => {
                const job = jobById(r.jobId)
                const vehicle = vehicleById(r.recommendedVehicleId)
                const driver = driverById(r.recommendedDriverId)
                return (
                  <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-on-surface">{job?.jobNumber}</p>
                      <p className="text-[11px] text-on-surface-variant truncate max-w-[160px]">{job?.customer}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-on-surface">{vehicle?.regNumber}</td>
                    <td className="py-3 px-3 text-on-surface">{driver?.name}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-primary">{r.score}% Match</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
