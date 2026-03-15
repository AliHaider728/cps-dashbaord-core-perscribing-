import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Building2, MapPin, ChevronRight, CheckCircle2, Clock,
  XCircle, AlertCircle, Users, Hospital, RefreshCw, Filter
} from 'lucide-react';
import { practiceAPI } from '../../services/api.js';

const statusConfig = {
  Active:      { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  Expired:     { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',         icon: XCircle },
  Pending:     { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',  icon: Clock },
  Suspended:   { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
  Terminated:  { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',         icon: XCircle },
};


const OnboardingBar = ({ onboarding }) => {
  if (!onboarding) return null;
  const keys = Object.keys(onboarding);
  const done = keys.filter(k => onboarding[k]).length;
  const pct = Math.round((done / keys.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
    </div>
  );
};

const PracticesList = () => {
  const navigate = useNavigate();
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [standaloneFilter, setStandaloneFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPractices = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      if (standaloneFilter) params.standalone = standaloneFilter;
      if (search) params.search = search;
      const res = await practiceAPI.getAll(params);
      setPractices(res.data || []);
      setTotalPages(res.pages || 1);
      setTotal(res.total || 0);
    } catch {
      setPractices(MOCK_PRACTICES);
      setTotal(MOCK_PRACTICES.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPractices(); }, [page, statusFilter, standaloneFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchPractices(); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const grouped = standaloneFilter
    ? { all: practices }
    : {
        pcn: practices.filter(p => !p.isStandalone),
        standalone: practices.filter(p => p.isStandalone),
      };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 size={24} className="text-core-primary-500" />
            Practices & Surgeries
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} total practices</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-core-primary-500 hover:bg-core-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Practice
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ODS code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-core-primary-300 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-core-primary-300 transition"
        >
          <option value="">All Statuses</option>
          {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={standaloneFilter}
          onChange={e => { setStandaloneFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-core-primary-300 transition"
        >
          <option value="">All Types</option>
          <option value="false">Under PCN</option>
          <option value="true">Standalone</option>
        </select>
        <button onClick={fetchPractices}
          className="flex items-center gap-2 px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Practices Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      ) : practices.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No practices found</p>
        </div>
      ) : (
        <>
          {/* PCN Practices */}
          {(!standaloneFilter || standaloneFilter === 'false') && grouped.pcn?.length > 0 && (
            <div>
              {!standaloneFilter && (
                <div className="flex items-center gap-2 mb-3">
                  <Hospital size={15} className="text-blue-500" />
                  <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Under PCN ({grouped.pcn.length})</h2>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(standaloneFilter ? practices : grouped.pcn).map(p => (
                  <PracticeCard key={p._id} practice={p} onClick={() => navigate(`/practice-profile/${p._id}`)} />
                ))}
              </div>
            </div>
          )}

          {/* Standalone Practices */}
          {(!standaloneFilter || standaloneFilter === 'true') && grouped.standalone?.length > 0 && (
            <div>
              {!standaloneFilter && (
                <div className="flex items-center gap-2 mb-3 mt-6">
                  <Building2 size={15} className="text-purple-500" />
                  <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Standalone ({grouped.standalone.length})</h2>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {grouped.standalone.map(p => (
                  <PracticeCard key={p._id} practice={p} onClick={() => navigate(`/practice-profile/${p._id}`)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300">
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300">
            Next
          </button>
        </div>
      )}

      {showAddModal && (
        <AddPracticeModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => practiceAPI.create(data).then(() => { setShowAddModal(false); fetchPractices(); }).catch(console.error)}
        />
      )}
    </div>
  );
};

// ─── Practice Card ─────────────────────────────────────────────────────────────
const PracticeCard = ({ practice: p, onClick }) => {
  const cfg = statusConfig[p.contractStatus] || statusConfig.Active;
  const StatusIcon = cfg.icon;
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-core-primary-300 dark:hover:border-core-primary-600 hover:shadow-md cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-core-primary-500 transition-colors truncate leading-tight">
            {p.practiceName}
          </h3>
          {p.odsCode && <p className="text-xs text-gray-400 font-mono mt-0.5">ODS: {p.odsCode}</p>}
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${cfg.color}`}>
          <StatusIcon size={10} />
          {p.contractStatus}
        </div>
      </div>

      {p.isStandalone ? (
        <span className="inline-flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full mb-2">
          <Building2 size={10} /> Standalone
        </span>
      ) : p.pcn ? (
        <div className="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 mb-2">
          <Hospital size={11} />
          <span className="truncate">{typeof p.pcn === 'object' ? p.pcn.pcnName : 'PCN'}</span>
        </div>
      ) : null}

      {p.address?.city && (
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-2">
          <MapPin size={11} />
          <span>{p.address.city}{p.address.postCode ? `, ${p.address.postCode}` : ''}</span>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
        {p.fteAllocation && <span>FTE: {p.fteAllocation.split(' ')[0]}</span>}
        {p.patientListSize && <span>Pts: {p.patientListSize.toLocaleString()}</span>}
        {p.contractType && (
          <span className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{p.contractType}</span>
        )}
      </div>

      {p.onboarding && (
        <div className="mb-2">
          <OnboardingBar onboarding={p.onboarding} />
        </div>
      )}

      <div className="flex items-center justify-end pt-2 border-t border-gray-50 dark:border-gray-700/50">
        <span className="text-xs text-core-primary-500 font-medium flex items-center gap-1">
          View Profile <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
};

// ─── Add Practice Modal ────────────────────────────────────────────────────────
const AddPracticeModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    practiceName: '', odsCode: '', contractStatus: 'Active', contractType: 'ARRS',
    isStandalone: false, gpLead: '', pmBusinessManager: '',
    address: { street: '', city: '', postCode: '' }, icbName: '', fteAllocation: '', patientListSize: '',
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Practice / Surgery</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Practice Name *</label>
            <input type="text" value={form.practiceName} onChange={e => setForm(f => ({ ...f, practiceName: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
              placeholder="e.g. The Mundane Medical Practice" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">ODS Code</label>
              <input type="text" value={form.odsCode} onChange={e => setForm(f => ({ ...f, odsCode: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
                placeholder="e.g. K82011" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Contract Type</label>
              <select value={form.contractType} onChange={e => setForm(f => ({ ...f, contractType: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-core-primary-300">
                {['ARRS', 'EA', 'Direct', 'Mixed'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">GP Lead</label>
              <input type="text" value={form.gpLead} onChange={e => setForm(f => ({ ...f, gpLead: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">FTE Allocation</label>
              <input type="text" value={form.fteAllocation} onChange={e => setForm(f => ({ ...f, fteAllocation: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
                placeholder="e.g. 0.5 FTE" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">ICB Name</label>
            <input type="text" value={form.icbName} onChange={e => setForm(f => ({ ...f, icbName: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
              placeholder="e.g. NHS Bucks, Oxon & Berks West ICB" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">City</label>
              <input type="text" value={form.address.city} onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Post Code</label>
              <input type="text" value={form.address.postCode} onChange={e => setForm(f => ({ ...f, address: { ...f.address, postCode: e.target.value } }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isStandalone} onChange={e => setForm(f => ({ ...f, isStandalone: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-core-primary-500 focus:ring-core-primary-400" />
            <span className="text-sm text-gray-700 dark:text-gray-200">Standalone practice (not under a PCN)</span>
          </label>
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancel
          </button>
          <button onClick={() => { if (form.practiceName) onSave({ ...form, patientListSize: parseInt(form.patientListSize) || 0 }); }}
            className="px-4 py-2 text-sm bg-core-primary-500 hover:bg-core-primary-600 text-white rounded-lg font-medium transition">
            Create Practice
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PRACTICES = [
  {
    _id: 'p1', practiceName: 'The Mundane Medical Practice', odsCode: 'K82011',
    contractStatus: 'Active', contractType: 'ARRS', isStandalone: false,
    pcn: { _id: '1', pcnName: 'Aylesbury Vale PCN' },
    address: { city: 'Aylesbury', postCode: 'HP21 8TT' },
    fteAllocation: '0.5 FTE (20HRS/WEEK)', patientListSize: 50000,
    icbName: 'NHS Bucks, Oxon & Berks West ICB',
    onboarding: { approvalByCCG: true, ndaSigned: true, dataSharingAgreement: true, mobilisationPlan: true, mouReceived: false, practiceForms: true, prescribingPolicies: false, systemAccessCompleted: true, templateInstalled: true, reportsImported: false, welcomePackSent: true },
  },
  {
    _id: 'p2', practiceName: 'Chiltern House Medical Centre', odsCode: 'K82012',
    contractStatus: 'Active', contractType: 'EA', isStandalone: false,
    pcn: { _id: '1', pcnName: 'Aylesbury Vale PCN' },
    address: { city: 'Aylesbury', postCode: 'HP20 1TR' },
    fteAllocation: '1.0 FTE', patientListSize: 32000,
    onboarding: { approvalByCCG: true, ndaSigned: true, dataSharingAgreement: true, mobilisationPlan: true, mouReceived: true, practiceForms: true, prescribingPolicies: true, systemAccessCompleted: true, templateInstalled: true, reportsImported: true, welcomePackSent: true },
  },
  {
    _id: 'p3', practiceName: 'Oxford Direct Surgery', odsCode: 'K82020',
    contractStatus: 'Active', contractType: 'Direct', isStandalone: true,
    address: { city: 'Oxford', postCode: 'OX1 2JD' },
    fteAllocation: '0.6 FTE', patientListSize: 18000,
    onboarding: { approvalByCCG: true, ndaSigned: false, dataSharingAgreement: false, mobilisationPlan: true, mouReceived: false, practiceForms: false, prescribingPolicies: false, systemAccessCompleted: false, templateInstalled: false, reportsImported: false, welcomePackSent: false },
  },
];

export default PracticesList;