import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, FileText, AlertCircle,
  ChevronRight, Download, Filter, ArrowUp, ArrowDown,
  PoundSterling, BarChart2, PieChart, Wallet, Clock, Send
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const monthlyRevenue = [
  { month: 'Jan', pcn: 28000, nonPcn: 12000 },
  { month: 'Feb', pcn: 31000, nonPcn: 14000 },
  { month: 'Mar', pcn: 27000, nonPcn: 11000 },
  { month: 'Apr', pcn: 33000, nonPcn: 15000 },
  { month: 'May', pcn: 35000, nonPcn: 16000 },
  { month: 'Jun', pcn: 38000, nonPcn: 18500 },
];

const clients = [
  { name: 'Richmond PCN',       type: 'PCN',        contract: 45000, invoiced: 38000, received: 35000, outstanding: 3000,  margin: 31 },
  { name: 'Westfield Network',  type: 'PCN',        contract: 38000, invoiced: 32000, received: 30000, outstanding: 2000,  margin: 28 },
  { name: 'Clacton PCN',        type: 'PCN',        contract: 29000, invoiced: 25000, received: 25000, outstanding: 0,     margin: 35 },
  { name: 'Oak Valley Practice',type: 'Standalone', contract: 18000, invoiced: 16000, received: 12000, outstanding: 4000,  margin: 22 },
  { name: 'Sunrise Care Home',  type: 'Standalone', contract: 14000, invoiced: 14000, received: 9000,  outstanding: 5000,  margin: 18 },
  { name: 'Hillcrest Community',type: 'Standalone', contract: 11000, invoiced: 10000, received: 10000, outstanding: 0,     margin: 24 },
];

const invoices = [
  { id: 'INV-2026-0532', client: 'Hillcrest Community', issued: '01 Feb', due: '03 Feb', amount: 5000, daysOverdue: 14, status: 'overdue'  },
  { id: 'INV-2026-0531', client: 'Oak Valley Practice',  issued: '05 Feb', due: '05 Feb', amount: 4000, daysOverdue: 12, status: 'overdue'  },
  { id: 'INV-2026-0529', client: 'Sunrise Care Home',   issued: '10 Feb', due: '10 Feb', amount: 3000, daysOverdue: 7,  status: 'overdue'  },
  { id: 'INV-2026-0530', client: 'Richmond PCN',         issued: '12 Feb', due: '14 Feb', amount: 3000, daysOverdue: 3,  status: 'overdue'  },
  { id: 'INV-2026-0533', client: 'Westfield Network',    issued: '15 Feb', due: '20 Feb', amount: 2000, daysOverdue: 0,  status: 'sent'     },
];

const costBreakdown = [
  { category: 'Clinical Staff Pay',  amount: 22400, budget: 24000, pct: 93 },
  { category: 'Support Staff Pay',   amount: 8600,  budget: 10000, pct: 86 },
  { category: 'Admin Pay',           amount: 3200,  budget: 4000,  pct: 80 },
  { category: 'Training & Compliance', amount: 1800, budget: 2000, pct: 90 },
  { category: 'Travel & Expenses',   amount: 600,   budget: 1000,  pct: 60 },
];

const profitMargins = clients.map(c => ({ ...c, cost: Math.round(c.invoiced * (1 - c.margin / 100)) }));

const fmt = (n) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n}`;

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────
const RevenueChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.pcn + d.nonPcn));
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => {
        const totalH  = ((d.pcn + d.nonPcn) / max) * 100;
        const pcnH    = (d.pcn  / (d.pcn + d.nonPcn)) * totalH;
        const npcnH   = (d.nonPcn / (d.pcn + d.nonPcn)) * totalH;
        const isLast  = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
              <div className="font-semibold">{d.month}</div>
              <div className="text-violet-300">PCN: {fmt(d.pcn)}</div>
              <div className="text-blue-300">Other: {fmt(d.nonPcn)}</div>
              <div className="text-white font-semibold">Total: {fmt(d.pcn + d.nonPcn)}</div>
            </div>
            <div className="w-full flex flex-col justify-end overflow-hidden rounded-t-md" style={{ height: '120px' }}>
              <div
                className={`w-full transition-all duration-500 ${isLast ? 'bg-violet-500' : 'bg-violet-200'}`}
                style={{ height: `${pcnH}%` }}
              />
              <div
                className={`w-full transition-all duration-500 ${isLast ? 'bg-blue-400' : 'bg-blue-200'}`}
                style={{ height: `${npcnH}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, color, badge, badgeColor }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={17} className="text-white" />
      </div>
      {badge && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
    </div>
    {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
  </div>
);

// ─── Cost Row ─────────────────────────────────────────────────────────────────
const CostRow = ({ category, amount, budget, pct }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700 truncate">{category}</span>
        <span className="text-xs text-gray-500 shrink-0 ml-2">{fmt(amount)} / {fmt(budget)}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : pct >= 75 ? 'bg-amber-400' : 'bg-emerald-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
    <span className={`text-xs font-bold shrink-0 w-8 text-right ${pct >= 90 ? 'text-red-500' : pct >= 75 ? 'text-amber-500' : 'text-emerald-600'}`}>
      {pct}%
    </span>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, daysOverdue }) => {
  if (status === 'overdue') return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
      {daysOverdue}d overdue
    </span>
  );
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
      Sent
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const FinancialDashboard = () => {
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('overview');

  const totalRevenue    = clients.reduce((a, c) => a + c.invoiced, 0);
  const totalReceived   = clients.reduce((a, c) => a + c.received, 0);
  const totalOutstanding = clients.reduce((a, c) => a + c.outstanding, 0);
  const avgMargin       = Math.round(clients.reduce((a, c) => a + c.margin, 0) / clients.length);

  const filteredInvoices = invoiceFilter === 'overdue'
    ? invoices.filter(i => i.status === 'overdue')
    : invoices;

  return (
    <div className="min-h-screen bg-gray-50  space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Revenue, costs, profitability & invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
          </select>
          <button className="flex items-center gap-1.5 text-sm text-white bg-violet-600 px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={TrendingUp} label="Total Revenue" value={fmt(totalRevenue)}
          sub="+12% MoM"
          color="bg-emerald-500" badge="+12% MoM" badgeColor="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          icon={Wallet} label="Received" value={fmt(totalReceived)}
          sub={`${Math.round((totalReceived / totalRevenue) * 100)}% collection rate`}
          color="bg-violet-500" badge="On Track" badgeColor="bg-violet-50 text-violet-600"
        />
        <KpiCard
          icon={AlertCircle} label="Outstanding" value={fmt(totalOutstanding)}
          sub={`${invoices.filter(i => i.status === 'overdue').length} overdue invoices`}
          color="bg-red-400" badge="Action Needed" badgeColor="bg-red-50 text-red-600"
        />
        <KpiCard
          icon={BarChart2} label="Avg Profit Margin" value={`${avgMargin}%`}
          sub="Across all clients"
          color="bg-blue-500" badge={avgMargin >= 25 ? '✓ Target' : '↓ Below'} badgeColor={avgMargin >= 25 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
        />
      </div>

      {/* ── Revenue & Costs Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Monthly Revenue</h2>
              <p className="text-xs text-gray-400 mt-0.5">PCN contracts vs Standalone clients</p>
            </div>
            <button className="text-xs text-violet-600 font-medium hover:underline">View Report →</button>
          </div>
          <div className="flex items-center gap-4 my-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-violet-500" />
              <span className="text-xs text-gray-500">PCN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-400" />
              <span className="text-xs text-gray-500">Standalone</span>
            </div>
          </div>
          <RevenueChart data={monthlyRevenue} />
          <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">£450k</div>
              <div className="text-[11px] text-gray-400">Total Revenue</div>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="text-sm font-bold text-gray-900">£650k</div>
              <div className="text-[11px] text-gray-400">Contract Value</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-emerald-600">+12%</div>
              <div className="text-[11px] text-gray-400">Month on Month</div>
            </div>
          </div>
        </div>

        {/* Cost Monitoring */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Cost vs Budget</h2>
              <p className="text-xs text-gray-400 mt-0.5">Current month spend</p>
            </div>
          </div>
          <div className="space-y-4">
            {costBreakdown.map((c, i) => (
              <CostRow key={i} {...c} />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-900">
                £{((costBreakdown.reduce((a, c) => a + c.amount, 0)) / 1000).toFixed(1)}k
              </div>
              <div className="text-[11px] text-gray-400">Total spend</div>
            </div>
            <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
              ⚠ 2 over 90%
            </span>
          </div>
        </div>
      </div>

      {/* ── Profitability + Invoices Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profit Margins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Profitability Snapshot</h2>
              <p className="text-xs text-gray-400 mt-0.5">Margin per client — target ≥ 25%</p>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <Filter size={12} /> Sort
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {profitMargins.sort((a, b) => b.margin - a.margin).map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.margin >= 25 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800 truncate">{c.name}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      c.type === 'PCN'
                        ? 'bg-violet-50 text-violet-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>{c.type}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Revenue: {fmt(c.invoiced)} · Cost: {fmt(c.cost)}
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div
                      className={`h-1.5 rounded-full ${c.margin >= 25 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      style={{ width: `${c.margin}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-bold ${c.margin >= 25 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {c.margin}%
                  </div>
                  <div className="text-[10px] text-gray-400">margin</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 text-base">Outstanding Invoices</h2>
              <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                £{(totalOutstanding / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['all', 'overdue'].map(f => (
                <button
                  key={f}
                  onClick={() => setInvoiceFilter(f)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                    invoiceFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {f === 'all' ? 'All' : 'Overdue'}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {filteredInvoices.map(inv => (
              <div key={inv.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 truncate">{inv.client}</span>
                    <span className="text-sm font-bold text-gray-900 shrink-0 ml-2">{fmt(inv.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-gray-400">{inv.id} · Due {inv.due}</span>
                    <StatusBadge status={inv.status} daysOverdue={inv.daysOverdue} />
                  </div>
                </div>
                <button className="ml-2 text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1.5 rounded-lg hover:bg-violet-100 transition-colors shrink-0 flex items-center gap-1">
                  <Send size={11} />
                  Remind
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <span className="text-xs text-gray-400">{filteredInvoices.length} invoices</span>
            <button className="text-xs text-violet-600 font-medium hover:underline">View All Invoices →</button>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Footer ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Financial KPIs — This Month</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Monthly Revenue',         value: fmt(totalRevenue),  target: '≥ Budget',    ok: true  },
            { label: 'Invoice Collection Rate',  value: '92%',              target: '≥ 95%',        ok: false },
            { label: 'Avg Days to Pay',          value: '22 days',          target: '< 25 days',    ok: true  },
            { label: 'Profit Margin',            value: `${avgMargin}%`,    target: '≥ 25%',        ok: avgMargin >= 25 },
            { label: 'Cost vs Budget',           value: '87%',              target: '≤ 100%',       ok: true  },
          ].map((k, i) => (
            <div key={i} className="text-center">
              <div className={`text-xl font-bold ${k.ok ? 'text-emerald-600' : 'text-amber-500'}`}>{k.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{k.label}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Target: {k.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;