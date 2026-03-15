import React, { useState } from 'react';
import {
  Umbrella, Users, Clock, CheckCircle2, AlertTriangle, TrendingUp,
  ChevronRight, Download, Filter, Calendar, ArrowUp, ArrowDown,
  Building2, Hospital, BarChart2, ThumbsUp, ThumbsDown, Bell
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const pcnLeave = [
  { staff: 'Sarah Johnson',  pcn: 'Richmond PCN',     type: 'Annual Leave',  from: '18 Feb', to: '21 Feb', status: 'approved',  shiftsAffected: 4, shiftsCovered: 4  },
  { staff: 'James Wilson',   pcn: 'Westfield Network',type: 'Sick Leave',    from: '17 Feb', to: '17 Feb', status: 'approved',  shiftsAffected: 1, shiftsCovered: 1  },
  { staff: 'Emma Brown',     pcn: 'Richmond PCN',     type: 'Training Leave',from: '19 Feb', to: '19 Feb', status: 'approved',  shiftsAffected: 1, shiftsCovered: 1  },
  { staff: 'Mike Williams',  pcn: 'Clacton PCN',      type: 'Annual Leave',  from: '20 Feb', to: '24 Feb', status: 'pending',   shiftsAffected: 5, shiftsCovered: 0  },
  { staff: 'Anna Patel',     pcn: 'Westfield Network',type: 'Annual Leave',  from: '25 Feb', to: '26 Feb', status: 'pending',   shiftsAffected: 2, shiftsCovered: 0  },
];

const nonPcnLeave = [
  { staff: 'Tom Clarke',   client: 'Sunrise Care Home',   type: 'Sick Leave',   from: '17 Feb', to: '18 Feb', status: 'approved',  coverTime: '3h',  covered: true  },
  { staff: 'Lisa Ahmed',   client: 'Oak Valley Practice', type: 'Annual Leave', from: '20 Feb', to: '21 Feb', status: 'approved',  coverTime: '6h',  covered: true  },
  { staff: 'David Kim',    client: 'Hillcrest Community', type: 'Annual Leave', from: '22 Feb', to: '26 Feb', status: 'pending',   coverTime: '—',   covered: false },
  { staff: 'Grace Lee',    client: 'Riverside Nursing',   type: 'Emergency',    from: '17 Feb', to: '17 Feb', status: 'approved',  coverTime: '1.5h',covered: true  },
];

const monthlyLeaveData = [
  { month: 'Sep', pcnDays: 12, nonPcnDays: 6  },
  { month: 'Oct', pcnDays: 18, nonPcnDays: 9  },
  { month: 'Nov', pcnDays: 22, nonPcnDays: 11 },
  { month: 'Dec', pcnDays: 30, nonPcnDays: 14 },
  { month: 'Jan', pcnDays: 24, nonPcnDays: 10 },
  { month: 'Feb', pcnDays: 16, nonPcnDays: 8  },
];

const calendarLeave = [
  { initials: 'SJ', name: 'Sarah Johnson',  color: 'bg-violet-100 text-violet-700',  start: 18, end: 21 },
  { initials: 'JW', name: 'James Wilson',   color: 'bg-blue-100 text-blue-700',      start: 17, end: 17 },
  { initials: 'EB', name: 'Emma Brown',     color: 'bg-emerald-100 text-emerald-700', start: 19, end: 19 },
  { initials: 'MW', name: 'Mike Williams',  color: 'bg-amber-100 text-amber-700',    start: 20, end: 24 },
  { initials: 'AP', name: 'Anna Patel',     color: 'bg-pink-100 text-pink-700',      start: 25, end: 26 },
];

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

// ─── Status Pill ──────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const map = {
    approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-600 border border-amber-200'       },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border border-red-200'             },
  };
  const { label, cls } = map[status] || map.pending;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

// ─── Leave Type Badge ─────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const typeColors = {
    'Annual Leave':  'bg-violet-50 text-violet-600',
    'Sick Leave':    'bg-red-50 text-red-500',
    'Training Leave':'bg-blue-50 text-blue-600',
    'Emergency':     'bg-orange-50 text-orange-600',
    'Compassionate': 'bg-pink-50 text-pink-600',
  };
  const cls = typeColors[type] || 'bg-gray-50 text-gray-500';
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{type}</span>;
};

// ─── Mini Trend Chart ─────────────────────────────────────────────────────────
const LeaveTrendChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.pcnDays + d.nonPcnDays));
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => {
        const pcnH   = (d.pcnDays / max) * 100;
        const npcnH  = (d.nonPcnDays / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
              <span className="text-violet-300">PCN: {d.pcnDays}d</span>
              {' · '}
              <span className="text-blue-300">Other: {d.nonPcnDays}d</span>
            </div>
            <div className="w-full flex flex-col justify-end overflow-hidden rounded-t-sm" style={{ height: '90px' }}>
              <div
                className={`w-full ${isLast ? 'bg-violet-500' : 'bg-violet-200'} transition-all duration-500`}
                style={{ height: `${pcnH}%` }}
              />
              <div
                className={`w-full ${isLast ? 'bg-blue-400' : 'bg-blue-100'} transition-all duration-500`}
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

// ─── Mini Calendar View ───────────────────────────────────────────────────────
const CalendarStrip = ({ leaves }) => {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Day headers */}
        <div className="grid grid-cols-28 gap-px mb-1" style={{ gridTemplateColumns: `repeat(28, 1fr)` }}>
          {days.map(d => (
            <div key={d} className={`text-center text-[9px] font-medium py-0.5 rounded-sm ${
              d === 17 ? 'text-violet-600 font-bold' : 'text-gray-400'
            }`}>
              {d}
            </div>
          ))}
        </div>
        {/* Staff rows */}
        <div className="space-y-1.5">
          {leaves.map((l, i) => (
            <div key={i} className="relative flex items-center gap-2">
              <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(28, 1fr)`, flex: 1 }}>
                {days.map(d => (
                  <div
                    key={d}
                    className={`h-5 rounded-sm text-[8px] flex items-center justify-center font-semibold transition-all ${
                      d >= l.start && d <= l.end
                        ? `${l.color} opacity-90`
                        : 'bg-gray-50'
                    } ${d === l.start ? 'rounded-l-md' : ''} ${d === l.end ? 'rounded-r-md' : ''}`}
                  >
                    {d === l.start ? l.initials : ''}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {leaves.map((l, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${l.color.split(' ')[0]}`} />
              <span className="text-[10px] text-gray-500">{l.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const LeaveAbsenceDashboard = () => {
  const [activeTab, setTab] = useState('pcn');

  const totalPcnLeave   = pcnLeave.length;
  const pendingApprovals = [...pcnLeave, ...nonPcnLeave].filter(l => l.status === 'pending').length;
  const coveredCount    = pcnLeave.filter(l => l.shiftsCovered === l.shiftsAffected && l.status === 'approved').length;
  const avgCoverTime    = '4.2h';

  return (
    <div className="min-h-screen bg-gray-50  space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          
          <h1 className="text-2xl font-bold text-gray-900">Leave & Absence Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">PCN & Non-PCN leave tracking, coverage & KPIs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-semibold text-white bg-violet-600 px-3 py-2 rounded-lg hover:bg-violet-700 shadow-sm">
            + Add Leave Request
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 shadow-sm">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={CheckCircle2} label="Shifts Covered Despite Leave" value="91%"
          sub="11 of 12 affected shifts covered"
          color="bg-emerald-500" badge="✓ ≥ 90% Target" badgeColor="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          icon={Clock} label="Avg Approval Time" value="8h"
          sub="Leave request to decision"
          color="bg-violet-500" badge="< 24h ✓" badgeColor="bg-violet-50 text-violet-600"
        />
        <KpiCard
          icon={AlertTriangle} label="Pending Approvals" value={pendingApprovals}
          sub="Awaiting admin decision"
          color="bg-amber-400" badge="Action Needed" badgeColor="bg-amber-50 text-amber-600"
        />
        <KpiCard
          icon={Umbrella} label="Avg Cover Response" value={avgCoverTime}
          sub="From approval to cover assigned"
          color="bg-blue-500" badge="< 8h ✓" badgeColor="bg-blue-50 text-blue-600"
        />
      </div>

      {/* ── Top Row: Calendar + Trend ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Leave Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">February 2026 — Leave Calendar</h2>
              <p className="text-xs text-gray-400 mt-0.5">All approved & pending leave overlaid on rota</p>
            </div>
            <select className="text-xs text-gray-600 bg-gray-100 border-0 px-2.5 py-1.5 rounded-lg focus:outline-none">
              <option>February 2026</option>
              <option>March 2026</option>
            </select>
          </div>
          <CalendarStrip leaves={calendarLeave} />
        </div>

        {/* Leave Trend */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Leave Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months — days taken</p>
            </div>
          </div>
          <LeaveTrendChart data={monthlyLeaveData} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
              <span className="text-xs text-gray-500">PCN Staff</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-400" />
              <span className="text-xs text-gray-500">Standalone</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs: PCN vs Non-PCN ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-4 px-5 pt-4 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTab('pcn')}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md transition-all ${
                activeTab === 'pcn'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Hospital size={14} />
              PCN Clients
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'pcn' ? 'bg-violet-100 text-violet-600' : 'bg-gray-200 text-gray-500'}`}>
                {pcnLeave.length}
              </span>
            </button>
            <button
              onClick={() => setTab('nonpcn')}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md transition-all ${
                activeTab === 'nonpcn'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 size={14} />
              Non-PCN Clients
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'nonpcn' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                {nonPcnLeave.length}
              </span>
            </button>
          </div>
        </div>

        {/* PCN Leave Table */}
        {activeTab === 'pcn' && (
          <div>
            <div className="divide-y divide-gray-50">
              {pcnLeave.map((l, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {l.staff.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{l.staff}</span>
                      <TypeBadge type={l.type} />
                      <StatusPill status={l.status} />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {l.pcn} · {l.from} – {l.to}
                    </div>
                  </div>
                  {/* Shift Coverage */}
                  <div className="text-center shrink-0">
                    <div className={`text-sm font-bold ${l.shiftsCovered === l.shiftsAffected ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {l.shiftsCovered}/{l.shiftsAffected}
                    </div>
                    <div className="text-[10px] text-gray-400">shifts covered</div>
                  </div>
                  {/* Actions for pending */}
                  {l.status === 'pending' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition-colors">
                        <ThumbsUp size={11} />
                        Approve
                      </button>
                      <button className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 border border-red-200 transition-colors">
                        <ThumbsDown size={11} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* PCN Summary */}
            <div className="px-5 py-3 bg-violet-50/40 border-t border-violet-100 flex items-center gap-6">
              <div className="text-xs text-violet-700 font-medium">
                PCN KPI: <span className="font-bold">
                  {Math.round((pcnLeave.filter(l => l.shiftsCovered === l.shiftsAffected && l.status === 'approved').length
                    / pcnLeave.filter(l => l.status === 'approved').length) * 100)}%
                </span> rota gaps filled on time
              </div>
              <div className="h-4 w-px bg-violet-200" />
              <div className="text-xs text-violet-600">
                {pcnLeave.reduce((a, l) => a + l.shiftsAffected, 0)} total shifts affected this month
              </div>
            </div>
          </div>
        )}

        {/* Non-PCN Leave Table */}
        {activeTab === 'nonpcn' && (
          <div>
            <div className="divide-y divide-gray-50">
              {nonPcnLeave.map((l, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {l.staff.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{l.staff}</span>
                      <TypeBadge type={l.type} />
                      <StatusPill status={l.status} />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {l.client} · {l.from} – {l.to}
                    </div>
                  </div>
                  {/* Cover Time */}
                  <div className="text-center shrink-0">
                    <div className={`text-sm font-bold ${l.covered ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {l.coverTime}
                    </div>
                    <div className="text-[10px] text-gray-400">cover time</div>
                  </div>
                  {/* Cover status */}
                  <div className="shrink-0">
                    {l.covered
                      ? <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">Covered ✓</span>
                      : <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">Pending Cover</span>
                    }
                  </div>
                  {/* Actions for pending */}
                  {l.status === 'pending' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition-colors">
                        <ThumbsUp size={11} />
                        Approve
                      </button>
                      <button className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 border border-red-200 transition-colors">
                        <ThumbsDown size={11} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Non-PCN Summary */}
            <div className="px-5 py-3 bg-blue-50/40 border-t border-blue-100 flex items-center gap-6">
              <div className="text-xs text-blue-700 font-medium">
                Avg cover time: <span className="font-bold">3.5h</span> after approval
              </div>
              <div className="h-4 w-px bg-blue-200" />
              <div className="text-xs text-blue-600">
                {nonPcnLeave.filter(l => l.covered).length}/{nonPcnLeave.length} requests covered
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── KPI Summary Footer ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Leave & Absence KPIs — February 2026</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: '% Shifts Covered',         value: '91%',   target: '≥ 90%',  ok: true  },
            { label: 'Avg Approval Time',         value: '8h',    target: '< 24h',  ok: true  },
            { label: 'Avg Time to Cover',         value: '4.2h',  target: '< 8h',   ok: true  },
            { label: 'Client Complaints (Leave)', value: '0%',    target: '< 2%',   ok: true  },
            { label: 'Rest Period Compliance',    value: '100%',  target: '100%',   ok: true  },
            { label: 'PCN Gap Fill Rate',         value: '88%',   target: '≥ 95%',  ok: false },
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

export default LeaveAbsenceDashboard;