import React, { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Clock, FileText, CheckCircle2,
  ChevronRight, Download, Filter, Bell, Upload, Search,
  Users, BarChart2, ClipboardCheck, AlertCircle, Eye
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────
const complianceAlerts = [
  { id: 1, staff: 'Sarah Johnson',  type: 'DBS Check',             expires: '14 Feb 2026', daysLeft: -3,  severity: 'expired'  },
  { id: 2, staff: 'Michael Brown',  type: 'Manual Handling',       expires: '16 Feb 2026', daysLeft: -1,  severity: 'expired'  },
  { id: 3, staff: 'Emily Davis',    type: 'First Aid Certificate', expires: '22 Feb 2026', daysLeft: 5,   severity: 'critical' },
  { id: 4, staff: 'James Wilson',   type: 'Right to Work',         expires: '23 Feb 2026', daysLeft: 6,   severity: 'critical' },
  { id: 5, staff: 'Lisa Ahmed',     type: 'GPhC Registration',     expires: '01 Mar 2026', daysLeft: 12,  severity: 'warning'  },
  { id: 6, staff: 'Tom Clarke',     type: 'Indemnity Insurance',   expires: '05 Mar 2026', daysLeft: 16,  severity: 'warning'  },
  { id: 7, staff: 'Anna Patel',     type: 'Safeguarding Level 2',  expires: '20 Mar 2026', daysLeft: 31,  severity: 'advisory' },
  { id: 8, staff: 'David Kim',      type: 'DBS Check',             expires: '25 Mar 2026', daysLeft: 36,  severity: 'advisory' },
];

const docTypes = ['GPhC Reg', 'DBS', 'Indemnity', 'Manual Handling', 'First Aid', 'Right to Work'];
const staffMatrix = [
  { name: 'Sarah Johnson',  docs: [true,  false, true,  true,  true,  true ] },
  { name: 'Mike Williams',  docs: [true,  true,  true,  true,  true,  true ] },
  { name: 'Emma Brown',     docs: [true,  true,  true,  false, true,  true ] },
  { name: 'James Wilson',   docs: [false, true,  true,  true,  true,  false] },
  { name: 'Lisa Ahmed',     docs: [false, true,  true,  true,  false, true ] },
  { name: 'Tom Clarke',     docs: [true,  true,  false, true,  true,  true ] },
];

const policies = [
  { name: 'Information Governance Policy', version: '3.2', deadline: '28 Feb', acknowledged: 38, total: 45 },
  { name: 'Health & Safety Policy',        version: '2.1', deadline: '28 Feb', acknowledged: 42, total: 45 },
  { name: 'Safeguarding Policy',           version: '4.0', deadline: '07 Mar', acknowledged: 35, total: 45 },
  { name: 'Lone Worker Policy',            version: '1.5', deadline: '14 Mar', acknowledged: 20, total: 45 },
  { name: 'Infection Control Protocol',    version: '2.3', deadline: '21 Mar', acknowledged: 45, total: 45 },
];

// ─── KPI Card ─────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, color, badge, badgeColor }) => (
  <div className="bg-secondary rounded-xl p-4 shadow-sm border border-border flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={17} className="text-white" />
      </div>
      {badge && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-text-primary leading-tight">{value}</div>
      <div className="text-xs text-text-secondary font-medium mt-0.5">{label}</div>
    </div>
    {sub && <div className="text-[11px] text-text-muted">{sub}</div>}
  </div>
);

// ─── Severity Badge ───────────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const map = {
    expired:  { label: 'Expired',  cls: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'         },
    critical: { label: 'Critical', cls: 'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' },
    warning:  { label: 'Warning',  cls: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'   },
    advisory: { label: 'Advisory', cls: 'bg-primary text-text-secondary border border-border'                                                                   },
  };
  const { label, cls } = map[severity] || map.advisory;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

// ─── Policy Progress Bar ──────────────────────────────────────────
const PolicyBar = ({ acknowledged, total }) => {
  const pct = Math.round((acknowledged / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-border rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : pct >= 80 ? 'bg-violet-500' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${pct === 100 ? 'text-emerald-600' : pct >= 80 ? 'text-violet-600' : 'text-amber-500'}`}>
        {pct}%
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const ComplianceDashboardFull = () => {
  const [search, setSearch]         = useState('');
  const [severityFilter, setSev]    = useState('all');
  const [activeSection, setSection] = useState('alerts');

  const expiredCount  = complianceAlerts.filter(a => a.severity === 'expired').length;
  const criticalCount = complianceAlerts.filter(a => a.severity === 'critical').length;
  const allStaffDocs  = staffMatrix.flatMap(s => s.docs);
  const compliantDocs = allStaffDocs.filter(Boolean).length;
  const overallScore  = Math.round((compliantDocs / allStaffDocs.length) * 100);

  const filteredAlerts = complianceAlerts
    .filter(a => severityFilter === 'all' || a.severity === severityFilter)
    .filter(a => search === '' ||
      a.staff.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-primary space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-text-primary font-medium">Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Compliance Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Document expiry, audit records & policy acknowledgements</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-text-secondary bg-secondary border border-border px-3 py-2 rounded-lg hover:bg-primary shadow-sm">
            <Eye size={14} />
            <span>Audit Report</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-white bg-violet-600 px-3 py-2 rounded-lg hover:bg-violet-700 shadow-sm">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={ShieldCheck} label="Overall Compliance" value={`${overallScore}%`}
          sub={`${compliantDocs} of ${allStaffDocs.length} docs valid`}
          color="bg-violet-500"
          badge={overallScore >= 95 ? '✓ Target' : 'Below Target'}
          badgeColor={overallScore >= 95
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'}
        />
        <KpiCard
          icon={AlertTriangle} label="Expired Documents" value={expiredCount}
          sub="Immediate action required"
          color="bg-red-500" badge="Action Now" badgeColor="bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400"
        />
        <KpiCard
          icon={Clock} label="Expiring Soon" value={criticalCount}
          sub="Within 7 days"
          color="bg-orange-400" badge="Critical" badgeColor="bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
        />
        <KpiCard
          icon={ClipboardCheck} label="Policy Compliance" value="88%"
          sub="38 of 45 staff acknowledged"
          color="bg-emerald-500" badge="7 Pending" badgeColor="bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
        />
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl p-1 w-fit shadow-sm">
        {[
          { id: 'alerts', label: 'Document Alerts',   count: complianceAlerts.length },
          { id: 'matrix', label: 'Compliance Matrix', count: null },
          { id: 'policy', label: 'Policy Compliance', count: policies.filter(p => p.acknowledged < p.total).length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id)}
            className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              activeSection === tab.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-primary'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeSection === tab.id ? 'bg-white/20 text-white' : 'bg-border text-text-muted'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Section: Document Alerts */}
      {activeSection === 'alerts' && (
        <div className="bg-secondary rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
            <div className="flex-1 relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search staff or document type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div className="flex items-center gap-1 bg-primary rounded-lg p-1">
              {['all', 'expired', 'critical', 'warning', 'advisory'].map(s => (
                <button
                  key={s}
                  onClick={() => setSev(s)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-md capitalize transition-all ${
                    severityFilter === s
                      ? 'bg-secondary text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 px-5 py-4 hover:bg-primary transition-colors ${
                  alert.severity === 'expired' ? 'bg-red-50/30 dark:bg-red-900/10' : ''
                }`}
              >
                <div className={`w-2 h-10 rounded-full shrink-0 ${
                  alert.severity === 'expired'  ? 'bg-red-500'    :
                  alert.severity === 'critical' ? 'bg-orange-400' :
                  alert.severity === 'warning'  ? 'bg-amber-400'  : 'bg-border'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{alert.staff}</span>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">{alert.type}</div>
                  <div className={`text-xs mt-0.5 font-medium ${
                    alert.daysLeft < 0  ? 'text-red-600 dark:text-red-400' :
                    alert.daysLeft <= 7 ? 'text-orange-500 dark:text-orange-400' : 'text-text-muted'
                  }`}>
                    {alert.daysLeft < 0
                      ? `Expired ${Math.abs(alert.daysLeft)} day${Math.abs(alert.daysLeft) !== 1 ? 's' : ''} ago`
                      : `Expires in ${alert.daysLeft} days — ${alert.expires}`}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="text-xs font-semibold text-text-secondary bg-primary px-3 py-1.5 rounded-lg hover:bg-border transition-colors flex items-center gap-1 border border-border">
                    <Bell size={11} />Remind
                  </button>
                  <button className="text-xs font-semibold text-violet-600 bg-violet-50 dark:bg-violet-900/30 px-3 py-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors flex items-center gap-1">
                    <Upload size={11} />Action
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-border bg-primary flex items-center justify-between">
            <span className="text-xs text-text-muted">{filteredAlerts.length} alerts shown</span>
            <button className="text-xs text-violet-600 font-medium hover:underline">Manage All →</button>
          </div>
        </div>
      )}

      {/* Section: Compliance Matrix */}
      {activeSection === 'matrix' && (
        <div className="bg-secondary rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-semibold text-text-primary">Staff Compliance Matrix</h2>
              <p className="text-xs text-text-muted mt-0.5">Green = valid · Red = expired or missing</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-text-secondary bg-primary px-3 py-1.5 rounded-lg hover:bg-border border border-border">
              <Download size={12} />Export PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 font-semibold text-text-secondary bg-primary sticky left-0">
                    Staff Member
                  </th>
                  {docTypes.map((d, i) => (
                    <th key={i} className="px-3 py-3 font-semibold text-text-secondary text-center bg-primary whitespace-nowrap">
                      {d}
                    </th>
                  ))}
                  <th className="px-3 py-3 font-semibold text-text-secondary text-center bg-primary">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staffMatrix.map((staff, i) => {
                  const score = Math.round((staff.docs.filter(Boolean).length / staff.docs.length) * 100);
                  return (
                    <tr key={i} className="hover:bg-primary transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary sticky left-0 bg-secondary">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {staff.name}
                        </div>
                      </td>
                      {staff.docs.map((valid, j) => (
                        <td key={j} className="px-3 py-3.5 text-center">
                          {valid
                            ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs">✓</span>
                            : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs">✗</span>
                          }
                        </td>
                      ))}
                      <td className="px-3 py-3.5 text-center">
                        <span className={`font-bold text-sm ${
                          score === 100 ? 'text-emerald-600' : score >= 80 ? 'text-violet-600' : 'text-red-500'
                        }`}>
                          {score}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section: Policy Compliance */}
      {activeSection === 'policy' && (
        <div className="bg-secondary rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-semibold text-text-primary">Policy Acknowledgements</h2>
              <p className="text-xs text-text-muted mt-0.5">Track who has read and signed each company policy</p>
            </div>
            <button className="text-xs text-violet-600 font-medium bg-violet-50 dark:bg-violet-900/30 px-3 py-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50">
              + Issue New Policy
            </button>
          </div>
          <div className="divide-y divide-border">
            {policies.map((pol, i) => {
              const pct     = Math.round((pol.acknowledged / pol.total) * 100);
              const pending = pol.total - pol.acknowledged;
              return (
                <div key={i} className="px-5 py-4 hover:bg-primary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">{pol.name}</span>
                        <span className="text-[10px] text-text-muted bg-border px-1.5 py-0.5 rounded">v{pol.version}</span>
                        {pct === 100 && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                            Complete
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        Deadline: {pol.deadline} · {pol.acknowledged} of {pol.total} staff acknowledged
                        {pending > 0 && <span className="text-amber-500 dark:text-amber-400 font-medium"> · {pending} pending</span>}
                      </div>
                      <div className="mt-2">
                        <PolicyBar acknowledged={pol.acknowledged} total={pol.total} />
                      </div>
                    </div>
                    {pending > 0 && (
                      <button className="shrink-0 text-xs font-semibold text-text-secondary bg-primary px-3 py-1.5 rounded-lg hover:bg-border transition-colors flex items-center gap-1 border border-border">
                        <Bell size={11} />
                        Remind {pending}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Footer */}
      <div className="bg-secondary rounded-xl p-4 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Compliance KPIs</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Overall Compliance',    value: `${overallScore}%`, target: '≥ 95%',  ok: overallScore >= 95 },
            { label: 'DBS Compliance',         value: '78%',              target: '100%',    ok: false              },
            { label: 'GPhC Registration',      value: '67%',              target: '100%',    ok: false              },
            { label: 'Policy Acknowledgement', value: '88%',              target: '≥ 98%',  ok: false              },
            { label: 'Alert Response Time',    value: '18h',              target: '< 48h',   ok: true               },
          ].map((k, i) => (
            <div key={i} className="text-center">
              <div className={`text-xl font-bold ${k.ok ? 'text-emerald-600' : 'text-red-500'}`}>{k.value}</div>
              <div className="text-[11px] text-text-secondary mt-0.5">{k.label}</div>
              <div className="text-[10px] text-text-muted mt-0.5">Target: {k.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboardFull;