import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Filter, Hospital, MapPin, Calendar,
  ChevronRight, AlertCircle, CheckCircle2, Clock, XCircle,
  Building, Users, TrendingUp, RefreshCw
} from 'lucide-react';
import { pcnAPI } from '../../services/api.js';


const statusConfig = {
  Active:      { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  Expired:     { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',         icon: XCircle },
  Pending:     { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',  icon: Clock },
  Suspended:   { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
  Terminated:  { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',         icon: XCircle },
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const OnboardingBar = ({ onboarding }) => {
  if (!onboarding) return null;
  const keys = Object.keys(onboarding);
  const done = keys.filter(k => onboarding[k]).length;
  const pct = Math.round((done / keys.length) * 100);
  const color = pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
    </div>
  );
};

const PCNsList = () => {
  const navigate = useNavigate();
  const [pcns, setPcns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPCNs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await pcnAPI.getAll(params);
      setPcns(res.data || []);
      setTotalPages(res.pages || 1);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message);
      // Use mock data in development
      setPcns(MOCK_PCNS);
      setTotal(MOCK_PCNS.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCNs();
  }, [page, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPCNs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const stats = {
    total,
    active: pcns.filter(p => p.contractStatus === 'Active').length,
    expiring: pcns.filter(p => {
      if (!p.contractRenewalDate) return false;
      const days = Math.ceil((new Date(p.contractRenewalDate) - new Date()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days >= 0;
    }).length,
    pending: pcns.filter(p => p.contractStatus === 'Pending').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hospital size={24} className="text-core-primary-500" />
            PCN Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Primary Care Networks — {total} total records
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-core-primary-500 hover:bg-core-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <Plus size={16} />
          Add PCN
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total PCNs"   value={total}         icon={Hospital}    color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard label="Active"        value={stats.active}  icon={CheckCircle2} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard label="Renewing Soon" value={stats.expiring} icon={Calendar}    color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <StatCard label="Pending"       value={stats.pending} icon={Clock}       color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search PCN name, code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-core-primary-300 focus:border-core-primary-400 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-core-primary-300 transition"
        >
          <option value="">All Statuses</option>
          {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={fetchPCNs}
          className="flex items-center gap-2 px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* PCN Cards Grid */}
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
      ) : pcns.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Hospital size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No PCNs found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new PCN</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pcns.map(pcn => {
            const cfg = statusConfig[pcn.contractStatus] || statusConfig.Active;
            const StatusIcon = cfg.icon;
            const daysToRenewal = pcn.contractRenewalDate
              ? Math.ceil((new Date(pcn.contractRenewalDate) - new Date()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={pcn._id}
                onClick={() => navigate(`/pcn-profile/${pcn._id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-core-primary-300 dark:hover:border-core-primary-600 hover:shadow-md cursor-pointer transition-all duration-200 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-core-primary-500 transition-colors truncate">
                      {pcn.pcnName}
                    </h3>
                    {pcn.pcnCode && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Code: {pcn.pcnCode}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${cfg.color}`}>
                    <StatusIcon size={10} />
                    {pcn.contractStatus}
                  </div>
                </div>

                {/* ICB / Federation */}
                {(pcn.icb || pcn.federation) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 space-y-0.5">
                    {pcn.icb && (
                      <div className="flex items-center gap-1 truncate">
                        <Building size={11} className="shrink-0" />
                        <span className="truncate">{pcn.icb.name}</span>
                      </div>
                    )}
                    {pcn.federation && (
                      <div className="flex items-center gap-1 truncate">
                        <Users size={11} className="shrink-0" />
                        <span className="truncate">{pcn.federation.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Address */}
                {pcn.address?.city && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-3">
                    <MapPin size={11} />
                    <span>{pcn.address.city}{pcn.address.postCode ? `, ${pcn.address.postCode}` : ''}</span>
                  </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Hospital size={11} />
                    <span>{pcn.practices?.length || 0} Practices</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={11} />
                    <span>{pcn.activeClinicians?.length || 0} Clinicians</span>
                  </div>
                  {pcn.annualSpend > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp size={11} />
                      <span>£{(pcn.annualSpend / 1000).toFixed(0)}k</span>
                    </div>
                  )}
                </div>

                {/* Onboarding progress */}
                {pcn.onboarding && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Onboarding</p>
                    <OnboardingBar onboarding={pcn.onboarding} />
                  </div>
                )}

                {/* Renewal warning */}
                {daysToRenewal !== null && daysToRenewal <= 30 && daysToRenewal >= 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-2 py-1.5 mb-2">
                    <AlertCircle size={12} />
                    <span>Renews in {daysToRenewal} day{daysToRenewal !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* View button */}
                <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                  <span className="text-xs text-core-primary-500 group-hover:text-core-primary-600 font-medium flex items-center gap-1">
                    View Profile <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Add PCN Modal */}
      {showAddModal && (
        <AddPCNModal onClose={() => setShowAddModal(false)} onSave={(data) => {
          pcnAPI.create(data).then(() => { setShowAddModal(false); fetchPCNs(); }).catch(console.error);
        }} />
      )}
    </div>
  );
};

// ─── Add PCN Modal ────────────────────────────────────────────────────────────
const AddPCNModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    pcnName: '', pcnCode: '', contractStatus: 'Active', contractType: 'ARRS',
    address: { street: '', city: '', postCode: '' },
    annualSpend: '',
    contractRenewalDate: '', contractExpiryDate: '',
  });

  const handleSubmit = () => {
    if (!form.pcnName.trim()) return;
    onSave({ ...form, annualSpend: parseFloat(form.annualSpend) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New PCN</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Primary Care Network record</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">PCN Name *</label>
            <input
              type="text"
              value={form.pcnName}
              onChange={e => setForm(f => ({ ...f, pcnName: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
              placeholder="e.g. Aylesbury PCN"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">PCN Code</label>
              <input type="text" value={form.pcnCode} onChange={e => setForm(f => ({ ...f, pcnCode: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
                placeholder="e.g. PCN001" />
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
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Status</label>
              <select value={form.contractStatus} onChange={e => setForm(f => ({ ...f, contractStatus: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-core-primary-300">
                {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Annual Spend (£)</label>
              <input type="number" value={form.annualSpend} onChange={e => setForm(f => ({ ...f, annualSpend: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
                placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">City</label>
            <input type="text" value={form.address.city} onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300"
              placeholder="e.g. Aylesbury" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Renewal Date</label>
              <input type="date" value={form.contractRenewalDate} onChange={e => setForm(f => ({ ...f, contractRenewalDate: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Expiry Date</label>
              <input type="date" value={form.contractExpiryDate} onChange={e => setForm(f => ({ ...f, contractExpiryDate: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-core-primary-500 hover:bg-core-primary-600 text-white rounded-lg font-medium transition">
            Create PCN
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MOCK DATA for development (no backend) ───────────────────────────────────
const MOCK_PCNS = [
  {
    _id: '1', pcnName: 'Aylesbury Vale PCN', pcnCode: 'AVP001',
    contractStatus: 'Active', contractType: 'ARRS', annualSpend: 250000,
    address: { city: 'Aylesbury', postCode: 'HP21 8TT' },
    icb: { name: 'NHS Bucks, Oxon & Berks West ICB' },
    federation: { name: 'Bucks Federation' },
    practices: [{ _id: 'p1' }, { _id: 'p2' }, { _id: 'p3' }],
    activeClinicians: [{ _id: 'c1' }, { _id: 'c2' }],
    contractRenewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    onboarding: { approvalByCCG: true, ndaSigned: true, dataSharingAgreement: true, mobilisationPlan: true, mouReceived: false, practiceForms: true, prescribingPolicies: false, systemAccessCompleted: true, templateInstalled: true, reportsImported: false, welcomePackSent: true },
  },
  {
    _id: '2', pcnName: 'South Buckinghamshire PCN', pcnCode: 'SBP001',
    contractStatus: 'Active', contractType: 'EA', annualSpend: 180000,
    address: { city: 'High Wycombe', postCode: 'HP11 2DU' },
    icb: { name: 'NHS Bucks, Oxon & Berks West ICB' },
    practices: [{ _id: 'p4' }, { _id: 'p5' }],
    activeClinicians: [{ _id: 'c3' }],
    contractRenewalDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    onboarding: { approvalByCCG: true, ndaSigned: true, dataSharingAgreement: true, mobilisationPlan: true, mouReceived: true, practiceForms: true, prescribingPolicies: true, systemAccessCompleted: true, templateInstalled: true, reportsImported: true, welcomePackSent: true },
  },
  {
    _id: '3', pcnName: 'Oxford North PCN', pcnCode: 'ONP001',
    contractStatus: 'Pending', contractType: 'Direct', annualSpend: 0,
    address: { city: 'Oxford', postCode: 'OX2 6HE' },
    practices: [],
    activeClinicians: [],
    contractRenewalDate: null,
    onboarding: { approvalByCCG: false, ndaSigned: false, dataSharingAgreement: false, mobilisationPlan: false, mouReceived: false, practiceForms: false, prescribingPolicies: false, systemAccessCompleted: false, templateInstalled: false, reportsImported: false, welcomePackSent: false },
  },
  {
    _id: '4', pcnName: 'Swindon Central PCN', pcnCode: 'SCP001',
    contractStatus: 'Expired', contractType: 'ARRS', annualSpend: 120000,
    address: { city: 'Swindon', postCode: 'SN1 3AB' },
    practices: [{ _id: 'p6' }],
    activeClinicians: [],
    contractRenewalDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    onboarding: { approvalByCCG: true, ndaSigned: true, dataSharingAgreement: true, mobilisationPlan: true, mouReceived: true, practiceForms: true, prescribingPolicies: true, systemAccessCompleted: true, templateInstalled: true, reportsImported: true, welcomePackSent: true },
  },
];

export default PCNsList;