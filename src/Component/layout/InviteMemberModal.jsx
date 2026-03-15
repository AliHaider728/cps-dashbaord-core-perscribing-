import React, { useState } from "react";
import { UserPlus, Mail, Shield, Users, Info, CheckCircle2, X } from "lucide-react";
import { Spinner } from "../UI/Spinner.jsx";

const ROLES = [
  {
    id: "account_manager",
    label: "Account Manager",
    desc:  "Manages client relationships, sends and receives emails",
    Icon:  Users,
    bg: "#eff6ff", color: "#2563eb", border: "#93c5fd",
  },
  {
    id: "admin",
    label: "Admin",
    desc:  "Full access including team management and settings",
    Icon:  Shield,
    bg: "#f5f3ff", color: "#7c3aed", border: "#c4b5fd",
  },
  {
    id: "viewer",
    label: "Viewer",
    desc:  "Read-only access to client timelines and reports",
    Icon:  Info,
    bg: "#f8fafc", color: "#64748b", border: "#e2e8f0",
  },
];

export function InviteMemberModal({ isOpen, onClose, onSuccess }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [role,    setRole]    = useState("account_manager");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); onSuccess?.(); }, 1000);
  };

  const handleClose = () => {
    setName(""); setEmail(""); setRole("account_manager"); setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden"
        style={{ animation: "modalIn .18s ease both" }}
      >
        {success ? (
          /* ── Success ──────────────────────────────────────────────────── */
          <div className="p-12 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#d1fae5" }}
            >
              <CheckCircle2 size={28} style={{ color: "#059669" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite sent!</h3>
            <p className="text-sm text-slate-500 mb-1">An invitation email has been sent to</p>
            <p className="text-sm font-semibold text-slate-900 mb-6">{email}</p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
              style={{ backgroundColor: "#2563eb" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Form ─────────────────────────────────────────────────────── */
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Invite Team Member</h3>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 transition-colors"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                    onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)"; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                      onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)"; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              </div>

              {/* Role picker */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <div className="space-y-2">
                  {ROLES.map((r) => {
                    const active = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className="w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all"
                        style={{
                          backgroundColor: active ? r.bg : "#ffffff",
                          borderColor:     active ? r.border : "#e2e8f0",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor: active ? r.bg : "#f1f5f9",
                            color: active ? r.color : "#94a3b8",
                          }}
                        >
                          <r.Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                        </div>
                        {active && (
                          <CheckCircle2 size={15} style={{ color: r.color, marginTop: 2, flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info box */}
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl border"
                style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
              >
                <Info size={14} style={{ color: "#2563eb", marginTop: 1, flexShrink: 0 }} />
                <p className="text-xs leading-relaxed" style={{ color: "#1e40af" }}>
                  After accepting, <strong>{name || "this member"}</strong> will need to connect their
                  Outlook account to start syncing emails.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name || !email || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
                  style={{ backgroundColor: "#2563eb" }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#1d4ed8"; }}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
                >
                  {loading ? <Spinner className="w-4 h-4" /> : <UserPlus size={15} />}
                  Send Invite
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}