import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListClients, useCreateClient } from "../../../lib/api.js";
import { Search, Plus, Building2, Phone, Mail, ChevronRight, X, Users } from "lucide-react";
import { formatSmartDate, getInitials } from "../../../lib/utils.js";

// ─── CSS var helpers ──────────────────────────────────────────────────────────
const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"), border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };
const borderStyle   = { borderColor: cv("--border-color") };

const BRAND       = "#6673FF";
const BRAND_DARK  = "#2F2CCB";
const BRAND_GRAD  = `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`;

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL = `
  @keyframes ec-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes ec-modalIn { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ec-fadeUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ec-bounce  { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }

  .ec-input {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.875rem;
    width: 100%;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .ec-input::placeholder { color: var(--text-muted); }
  .ec-input:focus { border-color: ${BRAND}; box-shadow: 0 0 0 4px rgba(102,115,255,0.12); }

  .ec-label { color: var(--text-secondary); font-size: 0.8125rem; font-weight: 600; display: block; margin-bottom: 6px; }

  .ec-row { transition: background-color .15s; cursor: pointer; border-bottom: 1px solid var(--border-color); }
  .ec-row:hover { background-color: var(--bg-primary); }
  .ec-row:last-child { border-bottom: none; }

  .ec-chevron { color: var(--text-muted); transition: background-color .15s, color .15s; }
  .ec-row:hover .ec-chevron { color: ${BRAND}; }

  .ec-name { font-size: 0.9rem; font-weight: 600; transition: color .15s; }
  .ec-row:hover .ec-name { color: ${BRAND}; }

  .ec-dot { width:5px;height:5px;border-radius:50%;background:white;display:inline-block;animation:ec-bounce 1.2s ease infinite }
  .ec-dot:nth-child(2){animation-delay:.16s}.ec-dot:nth-child(3){animation-delay:.32s}

  .ec-ghost-btn { background: transparent; transition: background-color .15s, border-color .15s, color .15s; }
  .ec-ghost-btn:hover { background-color: var(--bg-primary); }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div style={{ padding: "12px 0" }}>
      {[0,1,2,3,4].map((i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderBottom:`1px solid ${cv("--border-color")}`, animation:`ec-pulse 1.5s ease infinite ${i*0.1}s` }}>
          <div style={{ width:40, height:40, borderRadius:12, backgroundColor: cv("--border-color"), flexShrink:0 }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
            <div style={{ width:"40%", height:13, borderRadius:5, backgroundColor: cv("--border-color") }} />
            <div style={{ width:"25%", height:11, borderRadius:5, backgroundColor: cv("--border-color"), opacity:.6 }} />
          </div>
          <div style={{ width:100, height:12, borderRadius:5, backgroundColor: cv("--border-color"), opacity:.5 }} />
          <div style={{ width:80,  height:12, borderRadius:5, backgroundColor: cv("--border-color"), opacity:.5 }} />
        </div>
      ))}
    </div>
  );
}

function SaveLoader() {
  return (
    <span style={{ display:"flex", gap:3, alignItems:"center" }}>
      <span className="ec-dot" /><span className="ec-dot" /><span className="ec-dot" />
    </span>
  );
}

// ─── Add Client Modal ─────────────────────────────────────────────────────────
function AddClientModal({ isOpen, onClose, onSave, isSaving }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }} onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ ...surfaceStyle, animation:"ec-modalIn .18s ease both" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
          <h3 className="font-bold text-base" style={textPrimary}>Add New Client</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg ec-ghost-btn" style={textMuted}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSave(Object.fromEntries(fd)); }} className="p-6 space-y-4">
          {[
            { label:"Client Name *",  name:"name",        required:true,  placeholder:"e.g. North London Health" },
            { label:"PCN Number *",   name:"pcnNumber",   required:true,  placeholder:"e.g. PCN-12345" },
            { label:"Surgery Name",   name:"surgeryName", required:false, placeholder:"Optional" },
          ].map((f) => (
            <div key={f.name}>
              <label className="ec-label">{f.label}</label>
              <input name={f.name} required={f.required} placeholder={f.placeholder} className="ec-input" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label:"Email", name:"email", type:"email", placeholder:"contact@surgery.com" },
              { label:"Phone", name:"phone", type:"text",  placeholder:"+44..." },
            ].map((f) => (
              <div key={f.name}>
                <label className="ec-label">{f.label}</label>
                <input type={f.type} name={f.name} placeholder={f.placeholder} className="ec-input" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-2" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-xl ec-ghost-btn" style={textSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60 transition-all"
              style={{ background: BRAND_GRAD, boxShadow:"0 4px 12px rgba(102,115,255,0.35)" }}>
              {isSaving ? <SaveLoader /> : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailClients() {
  const navigate = useNavigate();
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);

  const { data, isLoading }                         = useListClients({ search });
  const clients                                     = data?.clients || [];
  const { mutate: createClient, isPending: saving } = useCreateClient();

  const handleSave = (formData) => {
    createClient({ data: formData }, { onSuccess: () => setModal(false) });
  };

  return (
    <div className="space-y-5">
      <style>{GLOBAL}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background: BRAND_GRAD, boxShadow:"0 4px 10px rgba(102,115,255,0.35)" }}>
              <Users size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Clients & Surgeries</h1>
          </div>
          <p className="ml-9 text-sm" style={textMuted}>Manage accounts and track communication history.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-px"
          style={{ background: BRAND_GRAD, boxShadow:"0 4px 14px rgba(102,115,255,0.35)" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(102,115,255,0.5)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(102,115,255,0.35)"}
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Card */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ ...surfaceStyle, borderTop:`3px solid ${BRAND}` }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3" style={{ ...bgStyle, borderBottom:`1px solid ${cv("--border-color")}` }}>
          <div className="relative max-w-sm w-full flex items-center">
            <Search size={15} className="absolute left-3 pointer-events-none" style={textMuted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, PCN, or email…"
              className="ec-input"
              style={{ paddingLeft: 36, paddingRight: search ? 32 : 14 }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5" style={textMuted}>
                <X size={14} />
              </button>
            )}
          </div>
          <span className="text-sm font-medium hidden sm:block" style={textMuted}>{clients.length} Accounts</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton />
          ) : clients.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: cv("--border-color") }}>
                <Building2 size={26} style={textMuted} />
              </div>
              <h3 className="font-bold mb-1" style={textPrimary}>{search ? "No clients found" : "No clients yet"}</h3>
              <p className="text-sm" style={textSecondary}>{search ? "Try a different search." : "Add your first client to get started."}</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr style={{ ...bgStyle, borderBottom:`1px solid ${cv("--border-color")}` }}>
                  {["Client & PCN","Contact","Account Manager","Last Contacted",""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={textMuted}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="ec-row" onClick={() => navigate(`/email-activity/clients/${c.id}`)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 text-white shadow-sm" style={{ background: BRAND_GRAD }}>
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <p className="ec-name" style={textPrimary}>{c.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cv("--border-color"), ...textMuted }}>{c.pcnNumber}</span>
                            {c.surgeryName && <span className="text-xs" style={textMuted}>{c.surgeryName}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {c.email && <div className="flex items-center gap-1.5 text-xs" style={textSecondary}><Mail size={11} style={textMuted} />{c.email}</div>}
                        {c.phone && <div className="flex items-center gap-1.5 text-xs" style={textSecondary}><Phone size={11} style={textMuted} />{c.phone}</div>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {c.accountManagerName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: BRAND_GRAD }}>
                            {getInitials(c.accountManagerName)}
                          </div>
                          <span className="text-sm font-medium" style={textSecondary}>{c.accountManagerName}</span>
                        </div>
                      ) : <span className="text-sm italic" style={textMuted}>Unassigned</span>}
                    </td>
                    <td className="px-5 py-4">
                      {c.lastContactedAt ? (
                        <div>
                          <p className="text-sm font-medium" style={textPrimary}>{formatSmartDate(c.lastContactedAt)}</p>
                          <p className="text-xs mt-0.5" style={textMuted}>{c.emailCount || 0} emails</p>
                        </div>
                      ) : <span className="text-sm italic" style={textMuted}>Never</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="ec-chevron w-8 h-8 rounded-full flex items-center justify-center ml-auto">
                        <ChevronRight size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddClientModal isOpen={modalOpen} onClose={() => setModal(false)} onSave={handleSave} isSaving={saving} />
    </div>
  );
}