import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Hospital, Network, ChevronRight, ChevronDown,
  Users, PoundSterling, MapPin, Phone, Mail, Plus,
  Search, Filter, AlertTriangle, Loader2
} from 'lucide-react';
import { getHierarchyOverview } from '../../../services/Clientservice.js';



// ─── Seed / mock data for UI demo when backend not connected ──────────────────
const MOCK_HIERARCHY = [
  {
    _id: 'icb1', name: 'NHS Greater Manchester ICB', code: 'ICB-42',
    federations: [
      {
        _id: 'fed1', name: 'Manchester Federation', type: 'Federation',
        pcns: [
          {
            _id: 'pcn1', name: 'City Centre PCN', annualSpend: 285000, activeClinicians: [{}, {}, {}, {}],
            practices: [
              { _id: 'pr1', name: 'Oxford Road Medical', type: 'Practice' },
              { _id: 'pr2', name: 'Piccadilly Surgery', type: 'Surgery' },
              { _id: 'pr3', name: 'Ancoats Health Centre', type: 'Practice' },
            ],
          },
          {
            _id: 'pcn2', name: 'North Manchester PCN', annualSpend: 192000, activeClinicians: [{}, {}],
            practices: [
              { _id: 'pr4', name: 'Moston Lane Practice', type: 'Practice' },
              { _id: 'pr5', name: 'Harpurhey Surgery', type: 'Surgery' },
            ],
          },
        ],
      },
      {
        _id: 'fed2', name: 'Salford INT', type: 'INT',
        pcns: [
          {
            _id: 'pcn3', name: 'Salford Central PCN', annualSpend: 147000, activeClinicians: [{}, {}, {}],
            practices: [
              { _id: 'pr6', name: 'Salford Health Centre', type: 'Practice' },
            ],
          },
        ],
      },
    ],
  },
  {
    _id: 'icb2', name: 'NHS South Yorkshire ICB', code: 'ICB-23',
    federations: [
      {
        _id: 'fed3', name: 'Sheffield Federation', type: 'Federation',
        pcns: [
          {
            _id: 'pcn4', name: 'Sheffield Central PCN', annualSpend: 220000, activeClinicians: [{}, {}, {}],
            practices: [
              { _id: 'pr7', name: 'St Georges Practice', type: 'Practice' },
              { _id: 'pr8', name: 'Walkley Surgery', type: 'Surgery' },
            ],
          },
        ],
      },
    ],
  },
];

const typeBadge = (type) => {
  const map = {
    Federation: 'bg-blue-50 text-blue-700 border-blue-200',
    INT: 'bg-purple-50 text-purple-700 border-purple-200',
    Both: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Practice: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Surgery: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${map[type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {type}
    </span>
  );
};

const formatCurrency = (n) =>
  n ? `£${Number(n).toLocaleString('en-GB')}` : '—';

// ─── Practice Row 
const PracticeRow = ({ practice, navigate }) => (
  <div
    onClick={() => navigate(`/practice-profile/${practice._id}`)}
    className="flex items-center gap-3 px-4 py-3 ml-14 mr-4 mb-1.5 rounded-lg
               bg-white border border-gray-100 hover:border-core-primary-200
               hover:bg-core-primary-50/30 cursor-pointer transition-all group"
  >
    <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
      <Hospital size={14} className="text-emerald-600" />
    </div>
    <span className="text-sm font-medium text-gray-700 flex-1 group-hover:text-core-primary-600 transition-colors">
      {practice.name}
    </span>
    {typeBadge(practice.type || 'Practice')}
    <ChevronRight size={14} className="text-gray-300 group-hover:text-core-primary-400 transition-colors" />
  </div>
);

// ─── PCN Row 
const PCNRow = ({ pcn, navigate }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1.5">
      <div
        className={`flex items-center gap-3 px-4 py-3 ml-7 mr-4 rounded-lg border cursor-pointer transition-all group
          ${open ? 'bg-core-primary-50 border-core-primary-200' : 'bg-white border-gray-100 hover:border-core-primary-200 hover:bg-core-primary-50/30'}`}
      >
        {/* Expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="w-5 h-5 flex items-center justify-center shrink-0"
        >
          {pcn.practices?.length > 0
            ? open ? <ChevronDown size={14} className="text-core-primary-500" /> : <ChevronRight size={14} className="text-gray-400" />
            : <span className="w-3 h-px bg-gray-300 inline-block" />}
        </button>

        {/* Icon */}
        <div className="w-7 h-7 rounded-md bg-core-primary-50 border border-core-primary-100 flex items-center justify-center shrink-0">
          <Network size={14} className="text-core-primary-500" />
        </div>

        {/* Name + click to profile */}
        <span
          className="text-sm font-semibold text-gray-800 flex-1 hover:text-core-primary-600 transition-colors"
          onClick={() => navigate(`/pcn-profile/${pcn._id}`)}
        >
          {pcn.name}
        </span>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            <span>{pcn.activeClinicians?.length || 0} clinicians</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <PoundSterling size={12} />
            <span>{formatCurrency(pcn.annualSpend)}/yr</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Hospital size={12} />
            <span>{pcn.practices?.length || 0} sites</span>
          </div>
        </div>

        <ChevronRight
          size={14}
          className="text-gray-300 group-hover:text-core-primary-400 transition-colors ml-1 cursor-pointer"
          onClick={() => navigate(`/pcn-profile/${pcn._id}`)}
        />
      </div>

      {/* Practices drill-down */}
      {open && pcn.practices?.length > 0 && (
        <div className="mt-1">
          {pcn.practices.map(pr => (
            <PracticeRow key={pr._id} practice={pr} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Federation Row  
const FederationRow = ({ federation, navigate }) => {
  const [open, setOpen] = useState(false);
  const totalClinicians = federation.pcns?.reduce((s, p) => s + (p.activeClinicians?.length || 0), 0) || 0;
  const totalSpend = federation.pcns?.reduce((s, p) => s + (p.annualSpend || 0), 0) || 0;

  return (
    <div className="mb-2">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 ml-4 mr-4 rounded-xl border cursor-pointer transition-all
          ${open ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'}`}
      >
        <button onClick={() => setOpen(!open)} className="w-5 h-5 flex items-center justify-center shrink-0">
          {federation.pcns?.length > 0
            ? open ? <ChevronDown size={14} className="text-blue-600" /> : <ChevronRight size={14} className="text-gray-400" />
            : <span className="w-3 h-px bg-gray-300 inline-block" />}
        </button>

        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <Building2 size={15} className="text-blue-600" />
        </div>

        <span className="text-sm font-bold text-gray-800 flex-1">{federation.name}</span>

        {typeBadge(federation.type || 'Federation')}

        <div className="hidden sm:flex items-center gap-4">
          <span className="text-xs text-gray-500">{federation.pcns?.length || 0} PCNs</span>
          <span className="text-xs text-gray-500">{totalClinicians} clinicians</span>
          <span className="text-xs text-gray-500">{formatCurrency(totalSpend)}</span>
        </div>
      </div>

      {open && federation.pcns?.length > 0 && (
        <div className="mt-1.5">
          {federation.pcns.map(pcn => (
            <PCNRow key={pcn._id} pcn={pcn} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ICB Block ───
const ICBBlock = ({ icb, navigate }) => {
  const [open, setOpen] = useState(true);
  const totalPCNs = icb.federations?.reduce((s, f) => s + (f.pcns?.length || 0), 0) || 0;
  const totalClinicians = icb.federations?.reduce((s, f) =>
    s + f.pcns?.reduce((ss, p) => ss + (p.activeClinicians?.length || 0), 0), 0) || 0;

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* ICB Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white"
      >
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-bold text-base">{icb.name}</div>
          <div className="text-xs text-gray-300 mt-0.5">{icb.code} · {icb.federations?.length || 0} federations · {totalPCNs} PCNs · {totalClinicians} clinicians</div>
        </div>
        {open ? <ChevronDown size={18} className="text-white/70" /> : <ChevronRight size={18} className="text-white/70" />}
      </button>

      {/* Federations */}
      {open && (
        <div className="bg-gray-50/50 py-3">
          {icb.federations?.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No federations yet</p>
          )}
          {icb.federations?.map(fed => (
            <FederationRow key={fed._id} federation={fed} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ───
const ClientHierarchy = () => {
  const navigate = useNavigate();
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('hierarchy');  // hierarchy | pcns | practices

  useEffect(() => {
    getHierarchyOverview()
      .then(res => setHierarchy(res.data.data))
      .catch(() => {
        // Use mock data if backend not connected
        setHierarchy(MOCK_HIERARCHY);
        setError('Using demo data — backend not connected');
      })
      .finally(() => setLoading(false));
  }, []);

  // Flat lists for tab views
  const allPCNs = hierarchy.flatMap(icb =>
    icb.federations?.flatMap(f => f.pcns?.map(p => ({ ...p, federationName: f.name, icbName: icb.name })) || []) || []
  );
  const allPractices = allPCNs.flatMap(pcn =>
    pcn.practices?.map(pr => ({ ...pr, pcnName: pcn.name, federationName: pcn.federationName })) || []
  );

  const filteredHierarchy = hierarchy;  // full hierarchy always shown (search applied within ICB blocks)

  const filteredPCNs = allPCNs.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.federationName?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPractices = allPractices.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.pcnName?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'hierarchy', label: 'Hierarchy View' },
    { id: 'pcns', label: `PCNs (${allPCNs.length})` },
    { id: 'practices', label: `Practices & Surgeries (${allPractices.length})` },
  ];

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Client Hierarchy</h1>
          <p className="text-sm text-gray-500 mt-0.5">ICB → Federation / INT → PCN → Practice / Surgery</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/pcn-new')}
            className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white text-sm font-medium rounded-lg hover:bg-core-primary-600 transition-colors"
          >
            <Plus size={15} />
            Add PCN
          </button>
          <button
            onClick={() => navigate('/practice-new')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus size={15} />
            Add Practice
          </button>
        </div>
      </div>

      {/* Demo warning */}
      / {error && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-700">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}
      

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'ICBs', value: hierarchy.length, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Federations / INTs', value: hierarchy.reduce((s, i) => s + (i.federations?.length || 0), 0), color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'PCNs', value: allPCNs.length, color: 'text-core-primary-600', bg: 'bg-core-primary-50' },
          { label: 'Practices & Surgeries', value: allPractices.length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 border border-white`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>


      {/* Tabs Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === t.id
                  ? 'bg-white text-core-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {activeTab !== 'hierarchy' && (
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-core-primary-400 w-56"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-core-primary-500" />
        </div>
      ) : (
        <>
          {/* Hierarchy View */}
          {activeTab === 'hierarchy' && (
            <div>
              {filteredHierarchy.map(icb => (
                <ICBBlock key={icb._id} icb={icb} navigate={navigate} />
              ))}
            </div>
          )}

          {/* PCNs flat list */}
          {activeTab === 'pcns' && (
            <div className="space-y-2">
              {filteredPCNs.map(pcn => (
                <div
                  key={pcn._id}
                  onClick={() => navigate(`/pcn-profile/${pcn._id}`)}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-core-primary-200 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-core-primary-50 border border-core-primary-100 flex items-center justify-center shrink-0">
                    <Network size={18} className="text-core-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-sm group-hover:text-core-primary-600 transition-colors">{pcn.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">{pcn.federationName} · {pcn.icbName}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users size={12} />{pcn.activeClinicians?.length || 0}</span>
                    <span className="flex items-center gap-1"><PoundSterling size={12} />{formatCurrency(pcn.annualSpend)}</span>
                    <span className="flex items-center gap-1"><Hospital size={12} />{pcn.practices?.length || 0} sites</span>
                  </div>
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-core-primary-400 transition-colors" />
                </div>
              ))}
              {filteredPCNs.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No PCNs found</p>}
            </div>
          )}

          {/* Practices flat list */}
          {activeTab === 'practices' && (
            <div className="space-y-2">
              {filteredPractices.map(pr => (
                <div
                  key={pr._id}
                  onClick={() => navigate(`/practice-profile/${pr._id}`)}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-emerald-200 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Hospital size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-sm group-hover:text-emerald-700 transition-colors">{pr.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">PCN: {pr.pcnName} · {pr.federationName}</div>
                  </div>
                  {typeBadge(pr.type || 'Practice')}
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-emerald-400 transition-colors" />
                </div>
              ))}
              {filteredPractices.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No practices found</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientHierarchy;