import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock, Users, TrendingUp, TrendingDown,
  Calendar, ChevronRight, Download, Filter, RefreshCw, Zap,
  BarChart2, Activity, UserCheck, AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';

// ─── Mock Data ─────────
const weeklyData = [
  { day: 'Mon', filled: 18, unfilled: 2, total: 20 },
  { day: 'Tue', filled: 22, unfilled: 1, total: 23 },
  { day: 'Wed', filled: 19, unfilled: 4, total: 23 },
  { day: 'Thu', filled: 21, unfilled: 2, total: 23 },
  { day: 'Fri', filled: 20, unfilled: 3, total: 23 },
  { day: 'Sat', filled: 14, unfilled: 1, total: 15 },
  { day: 'Sun', filled: 10, unfilled: 2, total: 12 },
];

const gapAlerts = [
  { id: 1, client: 'Sunrise Care Home',    date: 'Today',    time: '07:00–15:00', role: 'HCA',              urgency: 'urgent',  daysLeft: 0 },
  { id: 2, client: 'Oak Valley Practice',  date: 'Today',    time: '14:00–22:00', role: 'RN',               urgency: 'urgent',  daysLeft: 0 },
  { id: 3, client: 'Meadow Health Centre', date: 'Wed 22',   time: '22:00–07:00', role: 'Support Worker',   urgency: 'warning', daysLeft: 2 },
  { id: 4, client: 'Riverside Nursing',    date: 'Thu 08',   time: '08:00–16:00', role: 'HCA',              urgency: 'warning', daysLeft: 3 },
  { id: 5, client: 'Hillcrest Community',  date: 'Fri 15',   time: '15:00–23:00', role: 'Senior Carer',     urgency: 'normal',  daysLeft: 5 },
  { id: 6, client: 'Clacton PCN',          date: 'Sat 09',   time: '09:00–17:00', role: 'Clinical Pharm.',  urgency: 'normal',  daysLeft: 6 },
];

const staffUtil = [
  { name: 'Dr. Sarah Johnson',  dept: 'Clinical',    scheduled: 180, available: 180, util: 100, trend: 'up'   },
  { name: 'Mike Williams',      dept: 'Clinical',    scheduled: 173, available: 180, util: 96,  trend: 'up'   },
  { name: 'Emma Brown',         dept: 'Support',     scheduled: 172, available: 180, util: 95,  trend: 'down' },
  { name: 'James Wilson',       dept: 'Nursing',     scheduled: 144, available: 180, util: 80,  trend: 'down' },
  { name: 'Lisa Ahmed',         dept: 'Admin',       scheduled: 120, available: 180, util: 67,  trend: 'up'   },
  { name: 'Tom Clarke',         dept: 'Nursing',     scheduled: 90,  available: 180, util: 50,  trend: 'down' },
];

const deptUtil = [
  { dept: 'Nursing',    pct: 88, color: '#6366f1' },
  { dept: 'Care Staff', pct: 74, color: '#8b5cf6' },
  { dept: 'Support',    pct: 62, color: '#a78bfa' },
  { dept: 'Admin',      pct: 45, color: '#c4b5fd' },
];

// ─── Mini Bar Chart ─────
const CoverageChart = ({ data, period }) => {
  const max = Math.max(...data.map(d => d.total));
  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map((d, i) => {
        const filledH  = (d.filled  / max) * 100;
        const totalH   = (d.total   / max) * 100;
        const pct      = Math.round((d.filled / d.total) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
              <div className="font-semibold">{d.day}</div>
              <div className="text-green-300">{d.filled} filled</div>
              <div className="text-red-300">{d.unfilled} unfilled</div>
            </div>
            <div className="w-full relative flex flex-col justify-end" style={{ height: '100px' }}>
              {/* Background bar (total) */}
              <div
                className="w-full rounded-t-md bg-gray-100 absolute bottom-0"
                style={{ height: `${totalH}%` }}
              />
              {/* Filled bar */}
              <div
                className={`w-full rounded-t-md absolute bottom-0 transition-all duration-500 ${
                  pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ height: `${filledH}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Donut Chart (SVG) ──
const DonutChart = ({ segments }) => {
  const size = 120;
  const r = 44;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = segments.map(seg => {
    const dash   = (seg.pct / 100) * circumference;
    const gap    = circumference - dash;
    const slice  = { ...seg, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="18" />
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth="18"
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset}
          strokeLinecap="round"
        />
      ))}
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="rotate-90"
        style={{ transform: `rotate(90deg) translate(0px, 0px)`, transformOrigin: `${cx}px ${cy}px` }}
        fontSize="14"
        fontWeight="700"
        fill="#1f2937"
      >
        7%
      </text>
      <text
        x={cx} y={cy + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}
        fontSize="9"
        fill="#6b7280"
      >
        avail
      </text>
    </svg>
  );
};

// ─── KPI Card ───────────
const KpiCard = ({ icon: Icon, label, value, sub, color, badge, badgeColor }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={17} className="text-white" />
      </div>
      {badge && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
    </div>
    {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
  </div>
);

// ─── Urgency Badge ──────
const UrgencyBadge = ({ urgency }) => {
  const map = {
    urgent:  { label: 'Urgent',  cls: 'bg-red-50 text-red-600 border border-red-200'     },
    warning: { label: 'Warning', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
    normal:  { label: 'Normal',  cls: 'bg-gray-50 text-gray-500 border border-gray-200'   },
  };
  const { label, cls } = map[urgency] || map.normal;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

// ─── Util Bar ───────────
const UtilBar = ({ pct }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-violet-500' : 'bg-amber-400'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
    <span className="text-xs font-semibold text-gray-700 w-8 text-right">{pct}%</span>
  </div>
);

//  MAIN COMPONENT
const OperationalDashboard = () => {
  const [period, setPeriod]     = useState('week');
  const [activeTab, setActiveTab] = useState('gaps');

  const totalShifts   = weeklyData.reduce((a, d) => a + d.total, 0);
  const filledShifts  = weeklyData.reduce((a, d) => a + d.filled, 0);
  const unfilledShifts = totalShifts - filledShifts;
  const coveragePct   = totalShifts > 0 ? Math.round((filledShifts / totalShifts) * 100) : 0;
  const urgentCount   = gapAlerts.filter(a => a.urgency === 'urgent').length;

  return (
    <div className="min-h-screen bg-gray-50  space-y-6">

      {/*  Page Header  */}
      <div className="flex items-center justify-between">
        <div>
         
          <h1 className="text-2xl font-bold text-gray-900">Operational Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time workforce deployment & shift coverage</p>
        </div>
        <div className="flex items-center gap-2">
           
         
          <button className="flex items-center gap-1.5 text-sm text-white bg-violet-600 px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={CheckCircle2} label="Shift Fill Rate" value={`${coveragePct}%`}
          sub={`${filledShifts} of ${totalShifts} shifts filled`}
          color="bg-emerald-500" badge="On Target" badgeColor="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          icon={AlertTriangle} label="Unfilled Shifts" value={unfilledShifts}
          sub="This week"
          color="bg-red-400" badge={`${urgentCount} Urgent`} badgeColor="bg-red-50 text-red-600"
        />
        <KpiCard
          icon={Clock} label="Gap Response Time" value="2.4h"
          sub="Avg time to fill"
          color="bg-amber-400" badge="< 4h Target" badgeColor="bg-amber-50 text-amber-600"
        />
        <KpiCard
          icon={Activity} label="Staff Utilization" value="82%"
          sub="340 of 440 hrs used"
          color="bg-violet-500" badge="↑ 3%" badgeColor="bg-violet-50 text-violet-600"
        />
      </div>

      {/* ── Main Content Row ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Shift Coverage Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Shift Coverage Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Filled vs unfilled per day</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['week', 'month'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                    period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-gray-500">Filled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
              <span className="text-xs text-gray-500">Total Scheduled</span>
            </div>
          </div>

          <CoverageChart data={weeklyData} period={period} />

          {/* Coverage Summary */}
          <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{filledShifts}</div>
              <div className="text-[11px] text-gray-400">Filled</div>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="text-lg font-bold text-red-500">{unfilledShifts}</div>
              <div className="text-[11px] text-gray-400">Unfilled</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{totalShifts}</div>
              <div className="text-[11px] text-gray-400">Total</div>
            </div>
          </div>
        </div>

        {/* Staff Utilization Donut */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Staff Utilization</h2>
              <p className="text-xs text-gray-400 mt-0.5">By department breakdown</p>
            </div>
            <button className="text-xs text-violet-600 font-medium hover:underline">View Details →</button>
          </div>

          <div className="flex justify-center mb-4">
            <DonutChart segments={deptUtil} />
          </div>

          <div className="space-y-2.5">
            {deptUtil.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-gray-600 flex-1">{d.dept}</span>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700 w-8 text-right">{d.pct}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>Target: 85%</span>
            <span className="text-amber-500 font-medium">⚠ 2 below threshold</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Gap Alerts + Staff List  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gap Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 text-base">Gap Alerts</h2>
              <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                {gapAlerts.length}
              </span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <Filter size={12} /> Filter
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {gapAlerts.map(alert => (
              <div key={alert.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  alert.urgency === 'urgent' ? 'bg-red-500' : alert.urgency === 'warning' ? 'bg-amber-400' : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{alert.client}</div>
                  <div className="text-[11px] text-gray-400">{alert.date} · {alert.time} · {alert.role}</div>
                </div>
                <UrgencyBadge urgency={alert.urgency} />
                <button className="ml-1 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors shrink-0">
                  Assign
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30">
            <button className="text-xs text-violet-600 font-medium hover:underline">View All Gaps →</button>
          </div>
        </div>

        {/* Staff Utilization List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Individual Utilization</h2>
              <p className="text-xs text-gray-400 mt-0.5">Hours scheduled vs available</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['gaps', 'all'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                    activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {t === 'gaps' ? 'Low Util' : 'All Staff'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {staffUtil
              .filter(s => activeTab === 'all' || s.util < 85)
              .map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-800 truncate">{s.name}</span>
                    {s.trend === 'up'
                      ? <ArrowUp size={11} className="text-emerald-500 shrink-0" />
                      : <ArrowDown size={11} className="text-red-400 shrink-0" />}
                  </div>
                  <div className="text-[11px] text-gray-400">{s.dept} · {s.scheduled}h / {s.available}h</div>
                  <UtilBar pct={s.util} />
                </div>
                {s.util < 70 && (
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0">
                    Low
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30">
            <button className="text-xs text-violet-600 font-medium hover:underline">View All Staff →</button>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Footer ───────────────── */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Operational KPIs — This Week</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Shift Fill Rate',       value: `${coveragePct}%`,  target: '≥ 90%',   ok: coveragePct >= 90  },
            { label: 'Gap Response Time',      value: '2.4h',             target: '< 4h',     ok: true               },
            { label: 'Same-Day Fill Rate',     value: '78%',              target: '≥ 75%',   ok: true               },
            { label: 'Staff Utilization',      value: '82%',              target: '≥ 85%',   ok: false              },
            { label: 'Rota Published On Time', value: '100%',             target: '100%',     ok: true               },
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

export default OperationalDashboard;