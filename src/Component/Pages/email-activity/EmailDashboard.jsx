import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, Mail, MousePointerClick,
  Users, RefreshCw, BarChart3, TrendingUp, AlertCircle,
} from "lucide-react";
import { useGetStatsOverview } from "../../../lib/api.js";
import { Spinner } from "../../ui/spinner.jsx";
import { formatRelative } from "../../../lib/utils.js";

// ── Import using the CORRECT named export from ComposeEmailModal.jsx ──────────
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, Icon, iconBg, iconColor, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200"
      style={{ animation: `fadeUp 0.5s ease ${delay}s both`, transform: "translateY(0)" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

// ─── Engagement bar ───────────────────────────────────────────────────────────
function EngagementBar({ label, value, color }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(value, 100)}%`,
            backgroundColor: color,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useGetStatsOverview();
  const [composeOpen, setComposeOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Spinner className="w-8 h-8" />
          <p className="text-sm font-medium animate-pulse">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center rounded-2xl border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
        <AlertCircle size={40} style={{ color: "#dc2626" }} className="mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2" style={{ color: "#7f1d1d" }}>Could not load dashboard</h3>
        <p className="text-sm mb-4" style={{ color: "#dc2626" }}>Check that the backend API is running.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 text-white rounded-xl text-sm font-semibold transition-colors"
          style={{ backgroundColor: "#dc2626" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b91c1c"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#dc2626"}
        >
          Retry
        </button>
      </div>
    );
  }

  const STATS = [
    { title: "Emails Sent",     value: stats?.totalEmailsSent     || 0, Icon: ArrowUpRight,      iconBg: "#eff6ff", iconColor: "#2563eb", delay: 0   },
    { title: "Emails Received", value: stats?.totalEmailsReceived || 0, Icon: ArrowDownLeft,     iconBg: "#ecfdf5", iconColor: "#059669", delay: 0.1 },
    { title: "Avg. Open Rate",  value: `${stats?.openRate  || 0}%`,    Icon: Mail,              iconBg: "#f5f3ff", iconColor: "#7c3aed", delay: 0.2 },
    { title: "Avg. Click Rate", value: `${stats?.clickRate || 0}%`,    Icon: MousePointerClick, iconBg: "#fffbeb", iconColor: "#d97706", delay: 0.3 },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Activity</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of all client communications and engagement.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/email-activity/clients")}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 bg-white transition-all"
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
          >
            View Clients
          </button>
          <button
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all"
            style={{ backgroundColor: "#2563eb" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            <Mail size={16} /> Compose Email
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Activity feed ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-slate-100"
            style={{ backgroundColor: "#f8fafc" }}
          >
            <div>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 size={17} style={{ color: "#2563eb" }} /> Recent Activity
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Latest engagements across all accounts</p>
            </div>
            <button
              onClick={() => navigate("/email-activity/emails")}
              className="text-xs font-semibold transition-colors"
              style={{ color: "#2563eb" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              View All →
            </button>
          </div>

          {stats?.recentActivity?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="px-5 py-4 flex gap-4 transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div className="mt-0.5 shrink-0">
                    {a.type === "email_sent"     && <div className="p-2 rounded-full" style={{ backgroundColor: "#dbeafe" }}><ArrowUpRight size={14} style={{ color: "#2563eb" }} /></div>}
                    {a.type === "email_received" && <div className="p-2 rounded-full" style={{ backgroundColor: "#d1fae5" }}><ArrowDownLeft size={14} style={{ color: "#059669" }} /></div>}
                    {a.type === "engagement"     && <div className="p-2 rounded-full" style={{ backgroundColor: "#ede9fe" }}><MousePointerClick size={14} style={{ color: "#7c3aed" }} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {a.subject || "Activity Update"}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-3">
                        {formatRelative(a.occurredAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{a.preview || a.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <TrendingUp size={36} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
              <p className="text-sm text-slate-500">No recent activity. Sync Outlook to get started.</p>
            </div>
          )}
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Engagement overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="font-semibold text-sm text-slate-900 flex items-center gap-2 mb-4">
              <TrendingUp size={15} style={{ color: "#2563eb" }} /> Engagement Overview
            </p>
            <div className="space-y-4">
              <EngagementBar label="Open rate"  value={stats?.openRate  || 0} color="#7c3aed" />
              <EngagementBar label="Click rate" value={stats?.clickRate || 0} color="#d97706" />
            </div>
          </div>

          {/* Outlook sync banner */}
          <div
            className="rounded-2xl text-white p-6 shadow-lg"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}
          >
            <h3 className="font-bold text-base mb-1">Outlook Sync Active</h3>
            <p className="text-xs mb-5" style={{ color: "#bfdbfe" }}>
              Inbox syncing automatically. BCC tracking is on.
            </p>
            <div
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
            >
              <div className="relative">
                <Users size={20} className="text-white" />
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2"
                  style={{ backgroundColor: "#34d399", borderColor: "#4f46e5" }}
                />
              </div>
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: "#bfdbfe" }}
                >
                  Active Members
                </p>
                <p className="font-bold text-lg leading-tight">{stats?.teamMembersActive || 0}</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Quick Actions</p>
            </div>
            <div className="p-3 space-y-2">
              {[
                { label: "Add New Client", sub: "Create a PCN / Surgery",    path: "/email-activity/clients", iconBg: "#eff6ff", iconColor: "#2563eb", Icon: Users },
                { label: "Compose Email",  sub: "Send to any client",         action: () => setComposeOpen(true), iconBg: "#f5f3ff", iconColor: "#7c3aed", Icon: Mail },
                { label: "Team & Sync",    sub: "Manage Outlook connections",  path: "/email-activity/team",   iconBg: "#ecfdf5", iconColor: "#059669", Icon: RefreshCw },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => q.action ? q.action() : navigate(q.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 transition-all text-left"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.backgroundColor = "#eff6ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: q.iconBg, color: q.iconColor }}
                  >
                    <q.Icon size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{q.label}</p>
                    <p className="text-xs text-slate-500">{q.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Compose modal ─────────────────────────────────────────────── */}
      <ComposeEmailModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}