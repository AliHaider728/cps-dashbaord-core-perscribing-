import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Hospital, Building2, MapPin, Phone, Mail, Calendar,
  FileText, Users, Star, StarOff, Plus, AlertTriangle, CheckCircle2,
  Clock, XCircle, Edit2, ChevronRight, Activity, DollarSign,
  ShieldCheck, MessageSquare, Ban, Settings, ExternalLink
} from 'lucide-react';
import { pcnAPI } from '../../services/api.js';

const TABS = [
  { id: 'overview',    label: 'Overview',          icon: Activity      },
  { id: 'contacts',   label: 'Contacts',           icon: Users         },
  { id: 'practices',  label: 'Practices',          icon: Hospital      },
  { id: 'compliance', label: 'Onboarding',         icon: ShieldCheck   },
  { id: 'documents',  label: 'Documents',          icon: FileText      },
  { id: 'history',    label: 'Contact History',    icon: MessageSquare },
  { id: 'restricted', label: 'Restricted',         icon: Ban           },
  { id: 'meetings',   label: 'Monthly Meetings',   icon: Calendar      },
];

const statusColors = {
  Active:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Expired:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Pending:    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Suspended:  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Terminated: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
};

const onboardingLabels = {
  approvalByCCG: 'CCG Approval',
  ndaSigned: 'NDA Signed',
  dataSharingAgreement: 'Data Sharing Agreement',
  mobilisationPlan: 'Mobilisation Plan',
  mouReceived: 'MOU Received',
  practiceForms: 'Practice Forms',
  prescribingPolicies: 'Prescribing Policies',
  systemAccessCompleted: 'System Access',
  templateInstalled: 'Template Installed',
  reportsImported: 'Reports Imported',
  welcomePackSent: 'Welcome Pack Sent',
};

export default function PCNProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pcn, setPcn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHistoryEntry, setNewHistoryEntry] = useState({ type: 'Email', subject: '', summary: '', direction: 'Outbound' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await pcnAPI.getById(id);
        setPcn(res.data);
      } catch {
        setPcn(MOCK_PCN_DETAIL);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddHistory = async () => {
    try {
      await pcnAPI.addContactHistory(id, newHistoryEntry);
      const res = await pcnAPI.getById(id);
      setPcn(res.data);
      setShowAddHistory(false);
      setNewHistoryEntry({ type: 'Email', subject: '', summary: '', direction: 'Outbound' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-48" />
        <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-xl" />
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  if (!pcn) return <div className="text-center py-16 text-gray-400">PCN not found</div>;

  const onboardingPercent = pcn.onboarding
    ? Math.round(Object.values(pcn.onboarding).filter(Boolean).length / Object.keys(pcn.onboarding).length * 100)
    : 0;

  const daysToRenewal = pcn.contractRenewalDate
    ? Math.ceil((new Date(pcn.contractRenewalDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/pcns')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-core-primary-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to PCNs
      </button>

      {/* PCN Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-core-primary-500/10 to-core-primary-500/5 dark:from-core-primary-900/30 dark:to-core-primary-900/10 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-core-primary-100 dark:bg-core-primary-900/40 rounded-xl flex items-center justify-center shrink-0">
                <Hospital size={22} className="text-core-primary-600 dark:text-core-primary-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{pcn.pcnName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {pcn.pcnCode && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded font-mono">
                      {pcn.pcnCode}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[pcn.contractStatus] || ''}`}>
                    {pcn.contractStatus}
                  </span>
                  {pcn.contractType && (
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                      {pcn.contractType}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shrink-0">
              <Edit2 size={14} />
              Edit PCN
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-700">
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Annual Spend</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {pcn.annualSpend ? `£${pcn.annualSpend.toLocaleString()}` : '—'}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Practices</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {pcn.practices?.length || 0}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Clinicians</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {pcn.activeClinicians?.length || 0}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {daysToRenewal !== null ? 'Days to Renewal' : 'Renewal Date'}
            </p>
            <p className={`text-lg font-bold mt-0.5 ${
              daysToRenewal !== null && daysToRenewal <= 30
                ? 'text-amber-500' : 'text-gray-900 dark:text-white'
            }`}>
              {daysToRenewal !== null
                ? `${daysToRenewal}d`
                : pcn.contractRenewalDate
                  ? new Date(pcn.contractRenewalDate).toLocaleDateString('en-GB')
                  : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-1 min-w-max pb-0">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-core-primary-500 text-core-primary-600 dark:text-core-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">PCN Details</h3>
              <InfoRow icon={Building2} label="ICB" value={pcn.icb?.name || '—'} />
              <InfoRow icon={Users} label="Federation / INT" value={pcn.federation?.name || '—'} />
              <InfoRow icon={MapPin} label="Address" value={
                [pcn.address?.street, pcn.address?.city, pcn.address?.postCode].filter(Boolean).join(', ') || '—'
              } />
              {pcn.contractStartDate && (
                <InfoRow icon={Calendar} label="Contract Start" value={new Date(pcn.contractStartDate).toLocaleDateString('en-GB')} />
              )}
              {pcn.contractRenewalDate && (
                <InfoRow icon={Calendar} label="Renewal Date" value={new Date(pcn.contractRenewalDate).toLocaleDateString('en-GB')} />
              )}
              {pcn.contractExpiryDate && (
                <InfoRow icon={Calendar} label="Expiry Date" value={new Date(pcn.contractExpiryDate).toLocaleDateString('en-GB')} />
              )}
              {pcn.operationsManager && (
                <InfoRow icon={Users} label="Ops Manager" value={`${pcn.operationsManager.firstName} ${pcn.operationsManager.lastName}`} />
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Onboarding Summary</h3>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Overall Completion</span>
                  <span className={`text-sm font-bold ${onboardingPercent === 100 ? 'text-emerald-500' : onboardingPercent >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                    {onboardingPercent}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${onboardingPercent === 100 ? 'bg-emerald-500' : onboardingPercent >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${onboardingPercent}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(onboardingLabels).slice(0, 6).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    {pcn.onboarding?.[key]
                      ? <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      : <XCircle size={13} className="text-red-400 shrink-0" />
                    }
                    <span className="text-gray-600 dark:text-gray-300 truncate">{label}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('compliance')} className="text-xs text-core-primary-500 hover:underline">
                View all checklist items →
              </button>
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Contacts ({pcn.contacts?.length || 0})</h3>
              <button className="flex items-center gap-1.5 text-xs bg-core-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-core-primary-600 transition">
                <Plus size={13} /> Add Contact
              </button>
            </div>
            {(!pcn.contacts || pcn.contacts.length === 0) ? (
              <EmptyState icon={Users} message="No contacts added yet" />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {pcn.contacts.map((c, i) => (
                  <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{c.name}</p>
                        {c.role && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.role}</p>}
                      </div>
                      {c.isPrimary && (
                        <span className="text-xs bg-core-primary-50 dark:bg-core-primary-900/20 text-core-primary-600 dark:text-core-primary-400 px-2 py-0.5 rounded-full">Primary</span>
                      )}
                    </div>
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-core-primary-500 mt-2">
                        <Mail size={11} />{c.email}
                      </a>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Phone size={11} />{c.phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRACTICES TAB */}
        {activeTab === 'practices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Linked Practices ({pcn.practices?.length || 0})</h3>
              <button className="flex items-center gap-1.5 text-xs bg-core-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-core-primary-600 transition">
                <Plus size={13} /> Add Practice
              </button>
            </div>
            {(!pcn.practices || pcn.practices.length === 0) ? (
              <EmptyState icon={Hospital} message="No practices linked to this PCN" />
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-700">
                {pcn.practices.map((p, i) => (
                  <div
                    key={p._id || i}
                    className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 px-2 rounded-lg cursor-pointer transition"
                    onClick={() => navigate(`/practice-profile/${p._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Building2 size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{p.practiceName || 'Practice'}</p>
                        {p.odsCode && <p className="text-xs text-gray-400">{p.odsCode}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.contractStatus && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.contractStatus] || ''}`}>
                          {p.contractStatus}
                        </span>
                      )}
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONBOARDING / COMPLIANCE TAB */}
        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Onboarding Checklist</h3>
              <span className={`text-sm font-bold ${onboardingPercent === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {onboardingPercent}% Complete
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.entries(onboardingLabels).map(([key, label]) => {
                const done = pcn.onboarding?.[key];
                return (
                  <div key={key} className={`flex items-center justify-between p-3 rounded-xl border ${done ? 'border-emerald-100 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-2.5">
                      {done
                        ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        : <XCircle size={16} className="text-red-300 dark:text-red-400 shrink-0" />
                      }
                      <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
                    </div>
                    <span className={`text-xs font-medium ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-400'}`}>
                      {done ? '✓' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Documents ({pcn.documents?.length || 0})</h3>
              <button className="flex items-center gap-1.5 text-xs bg-core-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-core-primary-600 transition">
                <Plus size={13} /> Upload Document
              </button>
            </div>
            {(!pcn.documents || pcn.documents.length === 0) ? (
              <EmptyState icon={FileText} message="No documents uploaded yet" />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {pcn.documents.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.category} · {new Date(d.uploadedAt).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                    {d.fileUrl && (
                      <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-core-primary-500 hover:text-core-primary-600">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTACT HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Contact History ({pcn.contactHistory?.length || 0})
              </h3>
              <button
                onClick={() => setShowAddHistory(true)}
                className="flex items-center gap-1.5 text-xs bg-core-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-core-primary-600 transition"
              >
                <Plus size={13} /> Log Contact
              </button>
            </div>

            {showAddHistory && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 space-y-3">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">New Contact Entry</h4>
                <div className="grid grid-cols-2 gap-3">
                  <select value={newHistoryEntry.type} onChange={e => setNewHistoryEntry(h => ({ ...h, type: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-core-primary-300">
                    {['Email', 'Phone', 'Meeting', 'Document', 'Contract', 'Complaint', 'System Access', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select value={newHistoryEntry.direction} onChange={e => setNewHistoryEntry(h => ({ ...h, direction: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-core-primary-300">
                    <option>Outbound</option>
                    <option>Inbound</option>
                  </select>
                </div>
                <input type="text" placeholder="Subject" value={newHistoryEntry.subject} onChange={e => setNewHistoryEntry(h => ({ ...h, subject: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300" />
                <textarea rows={3} placeholder="Summary / notes" value={newHistoryEntry.summary} onChange={e => setNewHistoryEntry(h => ({ ...h, summary: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-core-primary-300 resize-none" />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowAddHistory(false)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Cancel</button>
                  <button onClick={handleAddHistory} className="px-3 py-1.5 text-sm bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600">Save</button>
                </div>
              </div>
            )}

            {(!pcn.contactHistory || pcn.contactHistory.length === 0) ? (
              <EmptyState icon={MessageSquare} message="No contact history logged yet" />
            ) : (
              <div className="space-y-2">
                {[...pcn.contactHistory].reverse().map((h, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-xl border transition ${h.isStarred ? 'border-amber-200 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                      h.type === 'Email' ? 'bg-blue-500' :
                      h.type === 'Phone' ? 'bg-green-500' :
                      h.type === 'Meeting' ? 'bg-purple-500' :
                      h.type === 'Complaint' ? 'bg-red-500' : 'bg-gray-400'
                    }`}>
                      {h.type[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{h.subject || h.type}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {h.type} · {h.direction} · {new Date(h.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                            {h.createdBy && ` · ${h.createdBy.firstName}`}
                          </p>
                        </div>
                        <button className="text-gray-300 hover:text-amber-400 shrink-0 transition-colors">
                          {h.isStarred ? <Star size={14} fill="currentColor" className="text-amber-400" /> : <StarOff size={14} />}
                        </button>
                      </div>
                      {h.summary && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{h.summary}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESTRICTED CLINICIANS TAB */}
        {activeTab === 'restricted' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Restricted / Unsuitable Clinicians</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Clinicians who cannot be placed at this PCN</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
                <Plus size={13} /> Flag Clinician
              </button>
            </div>
            {(!pcn.restrictedClinicians || pcn.restrictedClinicians.length === 0) ? (
              <EmptyState icon={Ban} message="No restricted clinicians" subtext="All clinicians are eligible for placement at this PCN" />
            ) : (
              <div className="space-y-2">
                {pcn.restrictedClinicians.map((rc, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {rc.clinician?.firstName
                          ? `${rc.clinician.firstName} ${rc.clinician.lastName}`
                          : 'Clinician'
                        }
                      </p>
                      {rc.reason && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rc.reason}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Flagged {new Date(rc.restrictedAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MONTHLY MEETINGS TAB */}
        {activeTab === 'meetings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Meetings</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Client-facing meeting schedule</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs bg-core-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-core-primary-600 transition">
                <Plus size={13} /> Schedule Meeting
              </button>
            </div>
            {(!pcn.monthlyMeetings || pcn.monthlyMeetings.length === 0) ? (
              <EmptyState icon={Calendar} message="No meetings scheduled" />
            ) : (
              <div className="space-y-3">
                {pcn.monthlyMeetings.map((m, i) => (
                  <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(m.meetingDate).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'long', year:'numeric' })}</p>
                      </div>
                      {m.nextMeetingDate && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Next meeting</p>
                          <p className="text-xs font-medium text-core-primary-500">{new Date(m.nextMeetingDate).toLocaleDateString('en-GB')}</p>
                        </div>
                      )}
                    </div>
                    {m.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{m.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={13} className="text-gray-400 dark:text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message, subtext }) => (
  <div className="text-center py-12 text-gray-400 dark:text-gray-500">
    <Icon size={36} className="mx-auto mb-3 opacity-25" />
    <p className="text-sm font-medium">{message}</p>
    {subtext && <p className="text-xs mt-1 opacity-70">{subtext}</p>}
  </div>
);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PCN_DETAIL = {
  _id: '1',
  pcnName: 'Aylesbury Vale PCN',
  pcnCode: 'AVP001',
  contractStatus: 'Active',
  contractType: 'ARRS',
  annualSpend: 250000,
  address: { street: '1 Shannon Road', city: 'Aylesbury', postCode: 'HP21 8TT' },
  icb: { name: 'NHS Bucks, Oxon & Berks West ICB', icbCode: 'BOB001' },
  federation: { name: 'Bucks Health Federation', type: 'Federation' },
  contractStartDate: '2021-07-09',
  contractRenewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  contractExpiryDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
  operationsManager: { firstName: 'Arslan', lastName: 'Shahroz', email: 'arslan@cps.co.uk' },
  contacts: [
    { name: 'Dr. Sarah Ahmed', role: 'GP Lead', email: 'sarah.ahmed@nhs.net', phone: '01234 567890', isPrimary: true },
    { name: 'Zeb Aslam', role: 'PM / Business Manager', email: 'zeb.aslam@nhs.net', phone: '01234 567891', isPrimary: false },
  ],
  practices: [
    { _id: 'p1', practiceName: 'The Mundane Medical Practice', odsCode: 'K82011', contractStatus: 'Active' },
    { _id: 'p2', practiceName: 'Chiltern House Medical Centre', odsCode: 'K82012', contractStatus: 'Active' },
  ],
  activeClinicians: [{ _id: 'c1' }, { _id: 'c2' }],
  onboarding: {
    approvalByCCG: true, ndaSigned: true, dataSharingAgreement: true,
    mobilisationPlan: true, mouReceived: false, practiceForms: true,
    prescribingPolicies: false, systemAccessCompleted: true,
    templateInstalled: true, reportsImported: false, welcomePackSent: true,
  },
  documents: [
    { name: 'NDA 2021', category: 'NDA', fileUrl: '#', uploadedAt: '2021-07-09' },
    { name: 'Mobilisation Plan v2', category: 'Mobilisation Plan', fileUrl: '#', uploadedAt: '2021-07-20' },
  ],
  contactHistory: [
    { type: 'Meeting', subject: 'Monthly Review - Jan 2024', summary: 'Discussed CPPE compliance and upcoming renewal. Action: Send renewal pack.', direction: 'Outbound', isStarred: true, createdAt: '2024-01-15', createdBy: { firstName: 'Arslan' } },
    { type: 'Email', subject: 'System Access Request - New Starter', summary: 'Requested EMIS and AccuRX access for new pharmacist.', direction: 'Outbound', isStarred: false, createdAt: '2024-01-10', createdBy: { firstName: 'Sonia' } },
  ],
  restrictedClinicians: [],
  monthlyMeetings: [
    { title: 'Q1 Review Meeting', meetingDate: '2024-01-15', nextMeetingDate: '2024-02-15', attendees: ['Dr. Sarah Ahmed', 'Arslan Shahroz'], notes: 'Reviewed KPIs and compliance status.' },
  ],
};