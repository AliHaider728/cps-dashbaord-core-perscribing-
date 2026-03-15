import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListClients, useCreateClient } from "../../../lib/api.js";
import { Spinner } from "../../ui/spinner.jsx";
import { Search, Plus, Building2, Phone, Mail, ChevronRight, X } from "lucide-react";
import { formatSmartDate, getInitials } from "../../../lib/utils.js";

// ─── Add Client Modal ─────────────────────────────────────────────────────────
function AddClientModal({ isOpen, onClose, onSave, isSaving }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
        style={{ animation: "modalIn .18s ease both" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Add New Client</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X size={15} />
          </button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSave(Object.fromEntries(fd)); }}
          className="p-6 space-y-4"
        >
          {[
            { label: "Client Name *",  name: "name",        required: true,  placeholder: "e.g. North London Health" },
            { label: "PCN Number *",   name: "pcnNumber",   required: true,  placeholder: "e.g. PCN-12345" },
            { label: "Surgery Name",   name: "surgeryName", required: false, placeholder: "Optional" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
              <input
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Email", name: "email", type: "email", placeholder: "contact@surgery.com" },
              { label: "Phone", name: "phone", type: "text",  placeholder: "+44..." },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  placeholder={f.placeholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60 transition-all"
              style={{ backgroundColor: "#2563eb" }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#1d4ed8"; }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
            >
              {isSaving ? <Spinner className="w-4 h-4" /> : null}
              Create Client
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(10px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailClients() {
  const navigate = useNavigate();
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);

  const { data, isLoading }                        = useListClients({ search });
  const clients                                    = data?.clients || [];
  const { mutate: createClient, isPending: saving } = useCreateClient();

  const handleSave = (formData) => {
    createClient({ data: formData }, { onSuccess: () => setModal(false) });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients & Surgeries</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage accounts and track communication history.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
          style={{ backgroundColor: "#2563eb" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ borderTop: "4px solid #2563eb" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, PCN, or email…"
              className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X size={14} />
              </button>
            )}
          </div>
          <span className="text-sm text-slate-500 font-medium hidden sm:block">{clients.length} Accounts</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Spinner className="w-8 h-8" /></div>
          ) : clients.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 size={40} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
              <h3 className="font-bold text-slate-900 mb-1">{search ? "No clients found" : "No clients yet"}</h3>
              <p className="text-sm text-slate-500">{search ? "Try a different search." : "Add your first client to get started."}</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  {["Client & PCN", "Contact", "Account Manager", "Last Contacted", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/email-activity/clients/${c.id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}
                        >
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{c.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{c.pcnNumber}</span>
                            {c.surgeryName && <span className="text-xs text-slate-400">{c.surgeryName}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {c.email && <div className="flex items-center gap-1.5 text-xs text-slate-600"><Mail size={11} className="text-slate-400" />{c.email}</div>}
                        {c.phone && <div className="flex items-center gap-1.5 text-xs text-slate-600"><Phone size={11} className="text-slate-400" />{c.phone}</div>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {c.accountManagerName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
                            {getInitials(c.accountManagerName)}
                          </div>
                          <span className="text-sm text-slate-700 font-medium">{c.accountManagerName}</span>
                        </div>
                      ) : <span className="text-sm text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-5 py-4">
                      {c.lastContactedAt ? (
                        <div>
                          <p className="text-sm text-slate-900 font-medium">{formatSmartDate(c.lastContactedAt)}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{c.emailCount || 0} emails</p>
                        </div>
                      ) : <span className="text-sm text-slate-400">Never</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white transition-all ml-auto"
                        style={{ backgroundColor: undefined }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#2563eb"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                      >
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