import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid, ChartContainer } from '../../components/ui/ChartContainer'
import { CostTrendChart } from '../../components/charts/TrendCharts'
import { formatINR } from '../../lib/utils'

const COST_BREAKDOWN = [
  { category: 'Fuel (Diesel / CNG / EV Charging)', pct: 42, amountINR: 4200000, trend: '-2.4%' },
  { category: 'Driver Compensation & Night Allowances', pct: 24, amountINR: 2400000, trend: '+1.1%' },
  { category: 'Maintenance, Tyres & Spares', pct: 14, amountINR: 1400000, trend: '-0.8%' },
  { category: 'Highway Fastag Tolls & State Taxes', pct: 12, amountINR: 1200000, trend: '0.0%' },
  { category: 'Insurance, Depreciation & Overhead', pct: 8, amountINR: 800000, trend: '0.0%' },
]

const CUSTOMER_PROFITABILITY = [
  { client: 'Reliance Retail Ltd', volume: '38 Trips', revenueINR: 703000, costINR: 520000, profitINR: 183000, margin: '26.0%' },
  { client: 'Tata Steel Limited', volume: '24 Trips', revenueINR: 633600, costINR: 480000, profitINR: 153600, margin: '24.2%' },
  { client: 'HPCL Petroleum', volume: '18 Tankers', revenueINR: 702000, costINR: 540000, profitINR: 162000, margin: '23.1%' },
  { client: 'Amazon India Pvt Ltd', volume: '46 Runs', revenueINR: 299000, costINR: 225000, profitINR: 74000, margin: '24.7%' },
  { client: 'Decathlon Sports India', volume: '14 Long-Hauls', revenueINR: 994000, costINR: 780000, profitINR: 214000, margin: '21.5%' },
]

export default function CostProfitabilityPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Operating Cost & Margin Profitability</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Unit economics, fuel cost variances, customer freight margins, and route contribution accounting
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Total Monthly Freight Revenue"
          value="₹1.32 Cr"
          icon="account_balance"
          iconColor="#10b981"
          subtext="Contracted billing across all accounts"
          trend={{ value: '+8.4% YoY', positive: true }}
        />
        <KpiCard
          label="Operating Fleet Expense"
          value="₹1.00 Cr"
          icon="credit_card"
          iconColor="#ef4444"
          subtext="Direct fuel, labor & asset running cost"
        />
        <KpiCard
          label="Gross Operating Profit"
          value="₹32.0 Lakhs"
          icon="trending_up"
          iconColor="#0ea5e9"
          subtext="Before corporate tax & financing"
        />
        <KpiCard
          label="Network Gross Margin"
          value="24.2%"
          icon="percent"
          iconColor="#8b5cf6"
          subtext="Industry median: 19.5%"
          trend={{ value: '+4.7% premium', positive: true }}
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <ChartContainer
          title="14-Day Average Trip Cost Variance"
          subtitle="Operating expense per freight dispatch run"
          height={220}
        >
          <CostTrendChart />
        </ChartContainer>

        <SectionCard
          title="Operating Cost Structure Breakdown"
          subtitle="Proportion of monthly logistics spend by cost head"
        >
          <div className="space-y-3">
            {COST_BREAKDOWN.map((c, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-on-surface">{c.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-on-surface">{formatINR(c.amountINR)}</span>
                    <span className="text-[10px] text-on-surface-variant w-8 text-right">({c.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${c.pct * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageGrid>

      <SectionCard
        title="Enterprise Client Account Contribution"
        subtitle="Gross revenue, operational logistics cost, and net account margin"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3">Client Account</th>
                <th className="py-2.5 px-3">Trip Volume</th>
                <th className="py-2.5 px-3">Billed Revenue</th>
                <th className="py-2.5 px-3">Trip Cost</th>
                <th className="py-2.5 px-3">Contribution Profit</th>
                <th className="py-2.5 px-3">Net Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {CUSTOMER_PROFITABILITY.map((c, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface">{c.client}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{c.volume}</td>
                  <td className="py-3 px-3 font-mono font-medium text-on-surface">{formatINR(c.revenueINR)}</td>
                  <td className="py-3 px-3 font-mono text-on-surface-variant">{formatINR(c.costINR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-success">{formatINR(c.profitINR)}</td>
                  <td className="py-3 px-3 font-bold text-primary">{c.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
