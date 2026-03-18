import React, { useState } from "react";
import {
  Mail, Shield, CheckCircle2, ExternalLink, AlertCircle,
  ChevronRight, Lock, Eye, RefreshCw,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "https://crm-email-backend.vercel.app/api";

function Spinner({ className = "" }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

const PERMS = [
  { Icon: Mail,      label: "Read sent emails", desc: "Sync outbound emails to client timelines",   bg: "#eff6ff", color: "#2563eb" },
  { Icon: Eye,       label: "Read inbox",        desc: "Capture replies even without BCC",          bg: "#f5f3ff", color: "#7c3aed" },
  { Icon: RefreshCw, label: "Offline access",    desc: "Background sync without re-authenticating", bg: "#ecfdf5", color: "#059669" },
  { Icon: Lock,      label: "No write access",   desc: "We never send emails on your behalf",       bg: "#f8fafc", color: "#64748b" },
];

export function OutlookConnectModal({ isOpen, onClose, memberId, memberName, isConnected = false }) {
  const [step, setStep] = useState("overview");

  // FIX: Real OAuth redirect instead of simulation
  const handleConnect = () => {
    if (!memberId) {
      console.error("No memberId provided to OutlookConnectModal");
      return;
    }
    // Redirect to backend OAuth initiation endpoint
    // Backend will redirect to Microsoft login and callback will handle token storage
    window.location.href = `${BASE_URL}/outlook/auth/${memberId}`;
  };

  const handleClose = () => { setStep("overview"); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-0" style={{ backdropFilter: "blur(4px)" }} onClick={handleClose} />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        style={{ animation: "modalIn .18s ease both" }}
      >
        {/* OVERVIEW */}
        {step === "overview" && (
          <>
            <div className="relative overflow-hidden p-8 text-white" style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}>
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <Mail size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold mb-1">Connect Outlook</h2>
                <p className="text-sm" style={{ color: "#bfdbfe" }}>
                  Syncing for <strong className="text-white">{memberName}</strong>
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect your Microsoft Outlook account to automatically log all sent emails and capture replies in client activity timelines.
              </p>

              {isConnected && (
                <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}>
                  <CheckCircle2 size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#14532d" }}>Already connected</p>
                    <p className="text-xs" style={{ color: "#15803d" }}>Reconnect to refresh token</p>
                  </div>
                </div>
              )}

              {!memberId && (
                <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ backgroundColor: "#fef2f2", borderColor: "#fca5a5" }}>
                  <AlertCircle size={14} style={{ color: "#dc2626" }} />
                  <p className="text-xs text-red-700">Member ID not found. Please try again.</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={handleClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => setStep("permissions")}
                  disabled={!memberId}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#2563eb" }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#1d4ed8"; }}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
                >
                  {isConnected ? "Reconnect" : "Get Started"} <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* PERMISSIONS */}
        {step === "permissions" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={18} style={{ color: "#2563eb" }} />
              <h2 className="text-lg font-bold text-slate-900">Permissions required</h2>
            </div>
            <p className="text-sm text-slate-500">We'll request these Microsoft Graph API scopes:</p>

            <div className="space-y-2">
              {PERMS.map((p) => (
                <div key={p.label} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100" style={{ backgroundColor: "#f8fafc" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: p.bg, color: p.color }}>
                    <p.Icon size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{p.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                  </div>
                  <CheckCircle2 size={14} style={{ color: "#059669", marginTop: 2, flexShrink: 0 }} />
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl border" style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}>
              <AlertCircle size={14} style={{ color: "#d97706", marginTop: 1, flexShrink: 0 }} />
              <p className="text-xs" style={{ color: "#92400e" }}>
                You'll be redirected to Microsoft's login page. Your credentials are never stored by us — only an OAuth token.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setStep("overview")} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button
                onClick={handleConnect}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
                style={{ backgroundColor: "#2563eb" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                <ExternalLink size={14} /> Connect with Microsoft
              </button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#fef2f2" }}>
              <AlertCircle size={28} style={{ color: "#dc2626" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connection failed</h3>
            <p className="text-sm text-slate-500 mb-6">Something went wrong. Please try again or contact support.</p>
            <div className="flex gap-3 w-full">
              <button onClick={handleClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => setStep("permissions")}
                className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
                style={{ backgroundColor: "#2563eb" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                Try again
              </button>
            </div>
          </div>
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