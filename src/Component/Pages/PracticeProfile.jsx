import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Hospital, Users, Phone, Mail, MapPin, ChevronRight,
  Shield, UserX, FileText, MessageSquare, Settings, Plus, Clock,
  Star, Edit2, AlertTriangle, Loader2, Network
} from 'lucide-react';
import { getPracticeById } from '../../services/Clientservice.js';


const MOCK_PRACTICE = {
  _id: 'pr1',
  name: 'Oxford Road Medical',
  type: 'Practice',
  address: '88 Oxford Road, Manchester',
  postcode: 'M1 5NH',
  phone: '0161 555 1234',
  email: 'admin@oxfordroad.nhs.uk',
  contactName: 'Jane Webb',
  contactRole: 'Practice Manager',
  pcnId: { name: 'City Centre PCN', _id: 'pcn1' },
  decisionMakers: [
    { name: 'Dr. Paul Owen', role: 'GP Partner', email: 'p.owen@oxfordroad.nhs.uk', phone: '0161 555 1235' },
    { name: 'Jane Webb', role: 'Practice Manager', email: 'j.webb@oxfordroad.nhs.uk', phone: '0161 555 1234' },
  ],
  linkedClinicians: [
    { _id: 'c1', name: 'Dr. Sarah Ahmed', role: 'Clinical Pharmacist' },
    { _id: 'c2', name: 'Tom Richards', role: 'Clinical Pharmacist' },
  ],
  systemRequirements: [
    { system: 'SystmOne', required: true },
    { system: 'AccuRx', required: true },
    { system: 'ICE', required: false },
    { system: 'Softphone', required: true },
  ],
  restrictedClinicians: [],
  documents: [
    { title: 'Site Induction Guide', category: 'SOP', fileUrl: '#', uploadedAt: '2026-01-10' },
    { title: 'Confidentiality Agreement', category: 'Contract', fileUrl: '#', uploadedAt: '2026-01-05' },
  ],
  contactHistory: [
    { _id: 'h1', type: 'Call', summary: 'Discussed cover for upcoming bank holiday', author: 'Ops Team', timestamp: '2026-02-18T10:00:00Z', isStarred: false },
    { _id: 'h2', type: 'Email', summary: 'Sent updated system access request for new starter', author: 'Ops Team', timestamp: '2026-02-12T09:00:00Z', isStarred: true },
  ],
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: Hospital },
  { id: 'clinicians', label: 'Linked Clinicians', icon: Users },
  { id: 'systems', label: 'System Access', icon: Settings },
  { id: 'history', label: 'Contact History', icon: MessageSquare },
  { id: 'restricted', label: 'Restricted', icon: UserX },
  { id: 'documents', label: 'Documents', icon: FileText },
];

const historyTypeColor = {
  Email: 'bg-blue-100 text-blue-700',
  Call: 'bg-green-100 text-green-700',
  Meeting: 'bg-purple-100 text-purple-700',
  Document: 'bg-amber-100 text-amber-700',
  Other: 'bg-gray-100 text-gray-600',
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const PracticeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    getPracticeById(id)
      .then(res => { setPractice(res.data.data); setHistoryItems(res.data.data.contactHistory || []); })
      .catch(() => { setPractice(MOCK_PRACTICE); setHistoryItems(MOCK_PRACTICE.contactHistory); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-core-primary-500" />
    </div>
  );
  if (!practice) return <div className="text-center text-gray-400 py-16">Practice not found</div>;

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(-1)} className="mt-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span
              className="hover:text-core-primary-600 cursor-pointer"
              onClick={() => navigate(`/pcn-profile/${practice.pcnId?._id}`)}
            >
              {practice.pcnId?.name}
            </span>
            <ChevronRight size={12} />
            <span className="text-emerald-600 font-medium">{practice.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Hospital size={20} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{practice.name}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                practice.type === 'Surgery' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>{practice.type}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          <Edit2 size={14} /> Edit
        </button>
      </div>

      {/* Quick info bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl border border-gray-100 px-5 py-3 text-sm text-gray-600">
        {practice.address && <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{practice.address}, {practice.postcode}</span>}
        {practice.phone && <span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{practice.phone}</span>}
        {practice.email && <span className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400" />{practice.email}</span>}
        <span className="flex items-center gap-1.5"><Users size={13} className="text-gray-400" />{practice.linkedClinicians?.length || 0} clinicians</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-gray-100 p-1 rounded-xl">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === t.id ? 'bg-white text-core-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={13} />
            {t.label}
            {t.id === 'restricted' && practice.restrictedClinicians?.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center ml-0.5">
                {practice.restrictedClinicians.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview ──────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Practice Details</h3>
            {[
              { icon: Network, label: 'PCN', value: practice.pcnId?.name },
              { icon: MapPin, label: 'Address', value: `${practice.address || '—'}, ${practice.postcode || ''}` },
              { icon: Phone, label: 'Phone', value: practice.phone || '—' },
              { icon: Mail, label: 'Email', value: practice.email || '—' },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3">
                <row.icon size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-400">{row.label}</div>
                  <div className="text-sm text-gray-700 font-medium">{row.value || '—'}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Decision Makers</h3>
            {(practice.decisionMakers || []).map((dm, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-core-primary-100 flex items-center justify-center text-xs font-bold text-core-primary-600">
                  {dm.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">{dm.name}</div>
                  <div className="text-xs text-gray-400">{dm.role}</div>
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">{dm.email}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Linked Clinicians ─────────────────────────────────────────────────── */}
      {activeTab === 'clinicians' && (
        <div className="space-y-2">
          {(practice.linkedClinicians || []).map(c => (
            <div key={c._id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-core-primary-100 flex items-center justify-center text-sm font-bold text-core-primary-600">
                {c.name?.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{c.name}</div>
                <div className="text-xs text-gray-400">{c.role}</div>
              </div>
            </div>
          ))}
          {(!practice.linkedClinicians || practice.linkedClinicians.length === 0) && (
            <div className="text-center text-gray-400 py-8 text-sm">No clinicians linked to this site</div>
          )}
        </div>
      )}

      {/* ── System Access ─────────────────────────────────────────────────────── */}
      {activeTab === 'systems' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">System access requirements for clinicians at this site</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(practice.systemRequirements || []).map((sys, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${sys.required ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sys.required ? 'bg-blue-50' : 'bg-gray-100'}`}>
                  <Shield size={15} className={sys.required ? 'text-blue-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{sys.system}</div>
                  <div className="text-xs text-gray-400">{sys.required ? 'Required' : 'Optional'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Contact History ───────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
              <Plus size={14} /> Log Communication
            </button>
          </div>
          {historyItems
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(entry => (
              <div key={entry._id} className={`bg-white rounded-xl border px-5 py-4 flex items-start gap-4 ${entry.isStarred ? 'border-amber-200' : 'border-gray-100'}`}>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 mt-0.5 ${historyTypeColor[entry.type] || 'bg-gray-100 text-gray-600'}`}>
                  {entry.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">{entry.summary}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span>{entry.author}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
                {entry.isStarred && <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
              </div>
            ))}
          {historyItems.length === 0 && <div className="text-center text-gray-400 py-8 text-sm">No communications logged</div>}
        </div>
      )}

      {/* ── Restricted ───────────────────────────────────────────────────────── */}
      {activeTab === 'restricted' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertTriangle size={14} className="text-red-500" />
            <p className="text-xs text-red-700">Clinicians flagged as restricted/unsuitable for this practice</p>
          </div>
          {(practice.restrictedClinicians || []).map((rc, i) => (
            <div key={i} className="bg-white rounded-xl border border-red-100 px-5 py-4">
              <div className="font-semibold text-sm text-gray-800">{rc.clinicianName}</div>
              <div className="text-xs text-gray-500 mt-1">{rc.notes}</div>
              <span className="inline-block mt-2 text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-0.5">{rc.reason}</span>
            </div>
          ))}
          {(!practice.restrictedClinicians || practice.restrictedClinicians.length === 0) && (
            <div className="text-center text-gray-400 py-8 text-sm">No restricted clinicians for this practice</div>
          )}
        </div>
      )}

      {/* ── Documents ────────────────────────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          {(practice.documents || []).map((doc, i) => (
            <div key={i} className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-5 py-3.5">
              <FileText size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{doc.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{doc.category} · Uploaded {formatDate(doc.uploadedAt)}</div>
              </div>
              <a href={doc.fileUrl} className="text-xs text-core-primary-600 hover:underline">Download</a>
            </div>
          ))}
          {(!practice.documents || practice.documents.length === 0) && (
            <div className="text-center text-gray-400 py-8 text-sm">
              <FileText size={28} className="mx-auto mb-2 text-gray-200" />
              No documents uploaded yet
            </div>
          )}
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 text-sm text-core-primary-600 font-medium hover:text-core-primary-700">
              <Plus size={14} /> Upload Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeProfile;