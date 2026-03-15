import React, { useState } from "react";
import {
  Mail, Shield, CheckCircle2, ExternalLink, AlertCircle,
  ChevronRight, Lock, Eye, RefreshCw, X,
} from "lucide-react";
import { Spinner } from "../UI/Spinner.jsx";

const PERMS = [
  { Icon: Mail,      label: "Read sent emails",   desc: "Sync outbound emails to client timelines",  bg: "#eff6ff", color: "#2563eb" },
  { Icon: Eye,       label: "Read inbox",          desc: "Capture replies even without BCC",          bg: "#f5f3ff", color: "#7c3aed" },
  { Icon: RefreshCw, label: "Offline access",      desc: "Background sync without re-authenticating", bg: "#ecfdf5", color: "#059669" },
  { Icon: Lock,      label: "No write access",     desc: "We never send emails on your behalf",       bg: "#f8fafc", color: "#64748b" },
];

export function OutlookConnectModal({ isOpen, onClose, memberId, memberName, isConnected = false }) {
  const [step, setStep] = useState("overview");
  // steps: overview | permissions | connecting | success | error

  const handleConnect = () => {
    setStep("connecting");
    // Replace with real redirect: window.location.href = `/api/outlook/connect/${memberId}`;
    setTimeout(() => setStep("success"), 2200);
  };

  const handleClose = () => { setStep("overview"); onClose(); };

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
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        style={{ animation: "modalIn .18s ease both" }}
      >

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {step === "overview" && (
          <>
            <div
              className="relative overflow-hidden p-8 text-white"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}
            >
              <div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              />
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
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
                Connect your Microsoft Outlook account to automatically log all sent emails and
                capture replies in client activity timelines.
              </p>

              {isConnected && (
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

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("permissions")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
                  style={{ backgroundColor: "#2563eb" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
                >
                  {isConnected ? "Reconnect" : "Get Started"} <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── PERMISSIONS ──────────────────────────────────────────────── */}
        {step === "permissions" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={18} style={{ color: "#2563eb" }} />
              <h2 className="text-lg font-bold text-slate-900">Permissions required</h2>
            </div>
            <p className="text-sm text-slate-500">We'll request these Microsoft Graph API scopes:</p>

            <div className="space-y-2">
              {PERMS.map((p) => (
                <div
                  key={p.label}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: p.bg, color: p.color }}
                  >
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

            <div
              className="flex items-start gap-2 p-3 rounded-xl border"
              style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
            >
              <AlertCircle size={14} style={{ color: "#d97706", marginTop: 1, flexShrink: 0 }} />
              <p className="text-xs" style={{ color: "#92400e" }}>
                You'll be redirected to Microsoft's login page. Your credentials are never stored.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setStep("overview")}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl transition-colors"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
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

        {/* ── CONNECTING ───────────────────────────────────────────────── */}
        {step === "connecting" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <Spinner className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connecting to Microsoft…</h3>
            <p className="text-sm text-slate-500">Authenticating and requesting permissions.</p>
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────────────────── */}
        {step === "success" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#d1fae5" }}
            >
              <CheckCircle2 size={28} style={{ color: "#059669" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Outlook connected!</h3>
            <p className="text-sm text-slate-500 mb-6">
              Emails for <strong>{memberName}</strong> will now sync automatically.
              Initial sync may take a few minutes.
            </p>
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
        )}

        {/* ── ERROR ────────────────────────────────────────────────────── */}
        {step === "error" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#fef2f2" }}
            >
              <AlertCircle size={28} style={{ color: "#dc2626" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connection failed</h3>
            <p className="text-sm text-slate-500 mb-6">
              Something went wrong. Please try again or contact support.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl transition-colors"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
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