import React, { useState } from "react";
import { useListTeamMembers, useTriggerOutlookSync } from "../../../lib/api.js";
import { Spinner } from "../../ui/spinner.jsx";
import {
  Copy, RefreshCw, CheckCircle2, XCircle, Mail, Users,
  UserPlus, Wifi, Shield, Info, X,
} from "lucide-react";
import { getInitials, formatSmartDate } from "../../../lib/utils.js";

// ─── Inline Invite Modal ──────────────────────────────────────────────────────
function InviteModal({ isOpen, onClose }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("account_manager");
  const [done,  setDone]  = useState(false);

  const ROLES = [
    { id: "account_manager", label: "Account Manager", desc: "Manages clients and emails", Icon: Users,  bg: "#eff6ff", color: "#2563eb", border: "#93c5fd" },
    { id: "admin",           label: "Admin",           desc: "Full access",                Icon: Shield, bg: "#f5f3ff", color: "#7c3aed", border: "#c4b5fd" },
    { id: "viewer",          label: "Viewer",          desc: "Read-only access",           Icon: Info,   bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
  ];

  const reset = () => { setName(""); setEmail(""); setRole("account_manager"); setDone(false); };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={() => { reset(); onClose(); }}
      />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden"
        style={{ animation: "modalIn .18s ease both" }}
      >
        {done ? (
          /* Success */
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#d1fae5" }}>
              <CheckCircle2 size={28} style={{ color: "#059669" }} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Invite sent!</h3>
            <p className="text-sm text-slate-500 mb-1">An invitation was sent to</p>
            <p className="font-semibold text-slate-900 mb-6">{email}</p>
            <button
              onClick={() => { reset(); onClose(); }}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
              style={{ backgroundColor: "#2563eb" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Invite Team Member</h3>
              <button
                onClick={() => { reset(); onClose(); }}
                className="p-1.5 rounded-lg text-slate-400 transition-colors"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name *",  val: name,  set: setName,  ph: "Jane Smith",       type: "text"  },
                  { label: "Work Email *", val: email, set: setEmail, ph: "jane@company.com", type: "email" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.ph}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                      onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)"; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className="w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all"
                      style={role === r.id
                        ? { backgroundColor: r.bg, borderColor: r.border }
                        : { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }
                      }
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={role === r.id
                          ? { backgroundColor: r.bg, color: r.color }
                          : { backgroundColor: "#f1f5f9", color: "#94a3b8" }
                        }
                      >
                        <r.Icon size={15} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                      </div>
                      {role === r.id && <CheckCircle2 size={15} style={{ color: r.color, marginTop: 2, flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl border"
                style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
              >
                <Info size={14} style={{ color: "#2563eb", marginTop: 1, flexShrink: 0 }} />
                <p className="text-xs" style={{ color: "#1d4ed8" }}>
                  {name || "This member"} will need to connect their Outlook account after accepting.
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6 border-t border-slate-100 pt-4">
              <button
                onClick={() => { reset(); onClose(); }}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl transition-colors"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Cancel
              </button>
              <button
                onClick={() => { if (name && email) setDone(true); }}
                disabled={!name || !email}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ backgroundColor: "#2563eb" }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#1d4ed8"; }}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                <UserPlus size={15} /> Send Invite
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes modalIn { from { opacity:0; transform:translateY(10px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

// ─── Inline Outlook Connect Modal ─────────────────────────────────────────────
function OutlookModal({ isOpen, member, onClose }) {
  const [step, setStep] = useState("overview");
  const reset = () => { setStep("overview"); onClose(); };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={reset}
      />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        style={{ animation: "modalIn .18s ease both" }}
      >
        {step === "overview" && (
          <>
            <div
              className="p-8 text-white"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Mail size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Connect Outlook</h3>
              <p className="text-sm" style={{ color: "#bfdbfe" }}>
                Syncing for <strong className="text-white">{member?.name}</strong>
              </p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect Microsoft Outlook to automatically log sent emails and capture replies.
              </p>
              {member?.outlookConnected && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}
                >
                  <CheckCircle2 size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#14532d" }}>Already connected</p>
                    <p className="text-xs" style={{ color: "#15803d" }}>Reconnect to refresh token</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("connecting")}
                  className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
                  style={{ backgroundColor: "#2563eb" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
                >
                  {member?.outlookConnected ? "Reconnect" : "Get Started"} →
                </button>
              </div>
            </div>
          </>
        )}

        {step === "connecting" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#eff6ff" }}>
              <Spinner className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Connecting to Microsoft…</h3>
            <p className="text-sm text-slate-500">Authenticating and requesting permissions.</p>
            <button className="mt-6 text-xs transition-colors" style={{ color: "#2563eb" }} onClick={() => setStep("success")}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              (Simulate success →)
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#d1fae5" }}>
              <CheckCircle2 size={28} style={{ color: "#059669" }} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Outlook connected!</h3>
            <p className="text-sm text-slate-500 mb-6">
              Emails for <strong>{member?.name}</strong> will now sync automatically.
            </p>
            <button
              onClick={reset}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
              style={{ backgroundColor: "#2563eb" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
            >
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn { from { opacity:0; transform:translateY(10px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailTeam() {
  const { data, isLoading, refetch }                              = useListTeamMembers();
  const members                                                   = data?.members || [];
  const { mutate: syncOutlook, isPending: isSyncing }             = useTriggerOutlookSync();
  const [copiedId, setCopied]                                     = useState(null);
  const [inviteOpen, setInvite]                                   = useState(false);
  const [outlookModal, setOutlook]                                = useState({ open: false, member: null });

  const copyBcc = (id, bcc) => {
    navigator.clipboard.writeText(bcc);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const SUMMARY = [
    { Icon: Users, label: "Members",      value: members.length,                                        bg: "#eff6ff", color: "#2563eb" },
    { Icon: Wifi,  label: "Synced",       value: members.filter((m) => m.outlookConnected).length,       bg: "#ecfdf5", color: "#059669" },
    { Icon: Mail,  label: "Total Emails", value: members.reduce((a, m) => a + (m.emailCount || 0), 0),  bg: "#f5f3ff", color: "#7c3aed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Coverage</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage team members, Outlook sync, and BCC settings.</p>
        </div>
        <button
          onClick={() => setInvite(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
          style={{ backgroundColor: "#2563eb" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              <s.Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Members */}
      {isLoading ? (
        <div className="flex justify-center p-20"><Spinner className="w-10 h-10" /></div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
          <Users size={40} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
          <h3 className="font-bold text-slate-900 mb-1">No team members yet</h3>
          <p className="text-sm text-slate-500">Invite someone to start syncing emails.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {members.map((m, i) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              style={{ borderTop: "4px solid #1e293b", animation: `fadeUp .4s ease ${i * 0.1}s both` }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center text-lg font-bold text-slate-700 shrink-0">
                      {m.avatarInitials || getInitials(m.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{m.name}</h3>
                      <p className="text-xs text-slate-500">{m.role || "Account Manager"} · {m.email}</p>
                    </div>
                  </div>
                  {m.outlookConnected ? (
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
                    >
                      <CheckCircle2 size={12} /> Synced
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 text-slate-500">
                      <XCircle size={12} /> Disconnected
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { Icon: Users, label: "Clients", value: m.clientCount || 0, bg: "#eff6ff", color: "#2563eb" },
                    { Icon: Mail,  label: "Emails",  value: m.emailCount  || 0, bg: "#ecfdf5", color: "#059669" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-4 border border-slate-100 flex items-center gap-3" style={{ backgroundColor: "#f8fafc" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                        <s.Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BCC */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Unique BCC Address
                    </label>
                    <div className="flex items-center gap-2">
                      <code
                        className="flex-1 p-2.5 rounded-lg text-xs break-all font-mono"
                        style={{ backgroundColor: "#0f172a", color: "#34d399" }}
                      >
                        {m.bccAddress || `activity+${m.id}@ourcrm.com`}
                      </code>
                      <button
                        onClick={() => copyBcc(m.id, m.bccAddress || "")}
                        className="w-9 h-9 shrink-0 border border-slate-200 rounded-xl flex items-center justify-center transition-colors"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        {copiedId === m.id
                          ? <CheckCircle2 size={15} style={{ color: "#059669" }} />
                          : <Copy size={15} className="text-slate-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400">
                      {m.lastSyncAt ? `Last sync: ${formatSmartDate(m.lastSyncAt)}` : "Never synced"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOutlook({ open: true, member: m })}
                        className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 bg-white transition-colors"
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.color = "#2563eb"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
                      >
                        {m.outlookConnected ? "Reconnect" : "Connect Outlook"}
                      </button>
                      {m.outlookConnected && (
                        <button
                          onClick={() => syncOutlook({ data: { memberId: m.id } }, { onSuccess: refetch })}
                          disabled={isSyncing}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 bg-white transition-colors disabled:opacity-50"
                          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                        >
                          <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} /> Sync
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <InviteModal isOpen={inviteOpen} onClose={() => setInvite(false)} />
      <OutlookModal
        isOpen={outlookModal.open}
        member={outlookModal.member}
        onClose={() => setOutlook({ open: false, member: null })}
      />

      <style>{`@keyframes fadeUp { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}