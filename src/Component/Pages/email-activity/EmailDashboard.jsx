import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, Mail, MousePointerClick,
  Users, RefreshCw, BarChart3, TrendingUp, AlertCircle,
  Zap, Activity,
} from "lucide-react";
import { useGetStatsOverview } from "../../../lib/api.js";
import { formatRelative } from "../../../lib/utils.js";
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

// ─── CSS-var helpers ──────────────────────────────────────────────────────────
// These consume your index.css custom properties so both
// :root (dark default) and [data-theme="light"] are honoured automatically.

const cv  = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"),  border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

// ─── Global injected styles (theme-aware, no Tailwind dark: needed) ───────────

const GLOBAL_STYLES = `
  /* ── Skeleton pulses ── */
  @keyframes ed-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* ── Stat card per-theme backgrounds ── */
  .sc-blue   { background: rgba(30,27,143,0.18);  border-color: rgba(102,115,255,0.25); }
  .sc-green  { background: rgba(6,78,59,0.22);    border-color: rgba(16,185,129,0.2);  }
  .sc-violet { background: rgba(76,29,149,0.22);  border-color: rgba(139,92,246,0.2);  }
  .sc-amber  { background: rgba(120,53,15,0.22);  border-color: rgba(245,158,11,0.2);  }
  [data-theme="light"] .sc-blue   { background: rgba(238,240,255,0.75); border-color: #B8C0FF; }
  [data-theme="light"] .sc-green  { background: rgba(209,250,229,0.75); border-color: #6ee7b7; }
  [data-theme="light"] .sc-violet { background: rgba(237,233,254,0.75); border-color: #c4b5fd; }
  [data-theme="light"] .sc-amber  { background: rgba(255,251,235,0.75); border-color: #fcd34d; }

  /* stat card value colours */
  .sc-blue   .sc-val { color: #DADFFF; } [data-theme="light"] .sc-blue   .sc-val { color: #15136B; }
  .sc-green  .sc-val { color: #d1fae5; } [data-theme="light"] .sc-green  .sc-val { color: #064e3b; }
  .sc-violet .sc-val { color: #ede9fe; } [data-theme="light"] .sc-violet .sc-val { color: #4c1d95; }
  .sc-amber  .sc-val { color: #fef3c7; } [data-theme="light"] .sc-amber  .sc-val { color: #78350f; }

  /* stat card sub-label colours */
  .sc-blue   .sc-sub { color: #8F9AFF; } [data-theme="light"] .sc-blue   .sc-sub { color: #6673FF; }
  .sc-green  .sc-sub { color: #34d399; } [data-theme="light"] .sc-green  .sc-sub { color: #059669; }
  .sc-violet .sc-sub { color: #a78bfa; } [data-theme="light"] .sc-violet .sc-sub { color: #7c3aed; }
  .sc-amber  .sc-sub { color: #fbbf24; } [data-theme="light"] .sc-amber  .sc-sub { color: #d97706; }

  /* ── Activity rows ── */
  .act-row:hover { background-color: var(--border-color); }
  .act-icon-email_sent     { background: rgba(102,115,255,0.13); }
  .act-icon-email_received { background: rgba(16,185,129,0.13);  }
  .act-icon-engagement     { background: rgba(139,92,246,0.13);  }
  [data-theme="light"] .act-icon-email_sent     { background: #EEF0FF; }
  [data-theme="light"] .act-icon-email_received { background: #d1fae5; }
  [data-theme="light"] .act-icon-engagement     { background: #ede9fe; }

  /* ── Quick action hover ── */
  .qa-btn:hover { background-color: var(--bg-primary); border-color: rgba(102,115,255,0.35) !important; }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => (
          <div key={i} className="h-28 rounded-2xl" style={{ backgroundColor: cv("--border-color"), animation: `ed-pulse 1.5s ease infinite ${i*0.1}s` }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl" style={{ backgroundColor: cv("--border-color"), animation: "ed-pulse 1.5s ease infinite" }} />
        <div className="space-y-4">
          {[0,1].map(i => <div key={i} className="h-32 rounded-2xl" style={{ backgroundColor: cv("--border-color"), animation: `ed-pulse 1.5s ease infinite ${i*0.15}s` }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const STAT_THEMES = {
  blue:   { cls: "sc-blue",   icon: "linear-gradient(135deg,#6673FF,#2F2CCB)", glow: "0 8px 28px rgba(102,115,255,0.35)", shimmer: "#6673FF" },
  green:  { cls: "sc-green",  icon: "linear-gradient(135deg,#10b981,#0d9488)", glow: "0 8px 28px rgba(16,185,129,0.3)",  shimmer: "#10b981" },
  violet: { cls: "sc-violet", icon: "linear-gradient(135deg,#8b5cf6,#7c3aed)", glow: "0 8px 28px rgba(139,92,246,0.3)", shimmer: "#8b5cf6" },
  amber:  { cls: "sc-amber",  icon: "linear-gradient(135deg,#f59e0b,#ea580c)", glow: "0 8px 28px rgba(245,158,11,0.3)", shimmer: "#f59e0b" },
};

function StatCard({ title, value, Icon, theme, delay = 0 }) {
  const t = STAT_THEMES[theme];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${t.cls} group relative rounded-2xl border shadow-sm cursor-default overflow-hidden transition-all duration-300 ease-out`}
      style={{
        animationDelay: `${delay}s`,
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered ? t.glow : "0 1px 6px rgba(0,0,0,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent)" }} />

      <div className="relative p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md"
          style={{ background: t.icon }}>
          <Icon size={20} className="text-white drop-shadow-sm" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="sc-sub text-[11px] font-semibold uppercase tracking-widest mb-1">{title}</p>
          <p className="sc-val text-3xl font-extrabold leading-none tracking-tight">{value}</p>
        </div>
      </div>
      {/* shimmer line */}
      <div className="h-px w-full opacity-20" style={{ background: `linear-gradient(to right, transparent, ${t.shimmer}, transparent)` }} />
    </div>
  );
}

// ─── Engagement Bar ───────────────────────────────────────────────────────────

function EngagementBar({ label, value, gradient }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span style={{ ...textSecondary, fontSize: "0.875rem", fontWeight: 600 }}>{label}</span>
        <span style={{ ...textPrimary,   fontSize: "0.9375rem", fontWeight: 700 }} className="tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: cv("--border-color") }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(value,100)}%`, background: gradient }} />
      </div>
    </div>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

const TYPE_META = {
  email_sent:     { iconColor: "#6673FF", dot: "#6673FF", Icon: <ArrowUpRight size={16} />      },
  email_received: { iconColor: "#10b981", dot: "#10b981", Icon: <ArrowDownLeft size={16} />     },
  engagement:     { iconColor: "#8b5cf6", dot: "#8b5cf6", Icon: <MousePointerClick size={16} /> },
};

function ActivityRow({ a }) {
  const meta = TYPE_META[a.type] || TYPE_META.engagement;
  const typeKey = a.type || "engagement";
  return (
    <div
      className={`act-row flex items-center gap-4 px-5 py-4 border-b last:border-0 transition-colors duration-150`}
      style={{ borderColor: cv("--border-color") }}
    >
      {/* Icon badge */}
      <div
        className={`act-icon-${typeKey} w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors`}
        style={{ color: meta.iconColor, border: `1px solid ${meta.iconColor}30` }}
      >
        {meta.Icon}
      </div>

      {/* Text — LARGER font sizes than before */}
      <div className="flex-1 min-w-0">
        {/* Subject: 15px semibold */}
        <p className="font-semibold truncate leading-snug"
          style={{ ...textPrimary, fontSize: "0.9375rem" }}>
          {a.subject || "Activity Update"}
        </p>
        {/* Preview: 13px */}
        <p className="truncate mt-0.5"
          style={{ ...textSecondary, fontSize: "0.8125rem" }}>
          {a.preview || a.content}
        </p>
      </div>

      {/* Timestamp + dot */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <span className="whitespace-nowrap font-medium" style={{ ...textMuted, fontSize: "0.75rem" }}>
          {formatRelative(a.occurredAt)}
        </span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.dot, opacity: 0.7 }} />
      </div>
    </div>
  );
}

// ─── Reusable section card ────────────────────────────────────────────────────

function SectionCard({ children, className = "", style: extraStyle = {} }) {
  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden ${className}`}
      style={{ ...surfaceStyle, ...extraStyle }}>
      {children}
    </div>
  );
}

// ─── Card header strip ────────────────────────────────────────────────────────

function CardHeader({ iconBg, IconEl, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b"
      style={{ ...bgStyle, borderColor: cv("--border-color") }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
          style={{ background: iconBg }}>
          {IconEl}
        </div>
        <div>
          <p className="font-bold leading-none" style={{ ...textPrimary, fontSize: "0.9375rem" }}>{title}</p>
          {subtitle && <p className="mt-0.5" style={{ ...textMuted, fontSize: "0.75rem" }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmailDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useGetStatsOverview();
  const [composeOpen, setComposeOpen] = useState(false);

  if (isLoading) return <><style>{GLOBAL_STYLES}</style><DashboardSkeleton /></>;

  if (isError) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div className="p-12 text-center rounded-2xl" style={surfaceStyle}>
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-red-500">Could not load dashboard</h3>
          <p className="text-sm mb-5 text-red-400">Check that the backend API is running.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
            style={{ boxShadow: "0 4px 12px rgba(239,68,68,0.35)" }}
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  const STATS = [
    { title: "Emails Sent",     value: stats?.totalEmailsSent     || 0,       Icon: ArrowUpRight,      theme: "blue",   delay: 0    },
    { title: "Emails Received", value: stats?.totalEmailsReceived || 0,       Icon: ArrowDownLeft,     theme: "green",  delay: 0.05 },
    { title: "Avg. Open Rate",  value: `${stats?.openRate  || 0}%`,           Icon: Mail,              theme: "violet", delay: 0.1  },
    { title: "Avg. Click Rate", value: `${stats?.clickRate || 0}%`,           Icon: MousePointerClick, theme: "amber",  delay: 0.15 },
  ];

  return (
    <div className="space-y-6">
      <style>{GLOBAL_STYLES}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg,#6673FF,#2F2CCB)", boxShadow: "0 4px 10px rgba(102,115,255,0.4)" }}>
              <Activity size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Email Activity</h1>
          </div>
          <p className="ml-9 text-sm" style={textMuted}>Overview of all client communications and engagement.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/email-activity/clients")}
            className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm"
            style={{ ...surfaceStyle, ...textSecondary }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6673FF"; e.currentTarget.style.color = "#6673FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = cv("--border-color"); e.currentTarget.style.color = cv("--text-secondary"); }}
          >
            View Clients
          </button>
          <button
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-200 hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#6673FF,#2F2CCB)", boxShadow: "0 4px 14px rgba(102,115,255,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(102,115,255,0.55)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(102,115,255,0.4)"}
          >
            <Mail size={15} /> Compose Email
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity Feed */}
        <SectionCard className="lg:col-span-2">
          <CardHeader
            iconBg="linear-gradient(135deg,#6673FF,#2F2CCB)"
            IconEl={<BarChart3 size={15} className="text-white" />}
            title="Recent Activity"
            subtitle="Latest engagements across all accounts"
            action={
              <button
                onClick={() => navigate("/email-activity/emails")}
                className="text-xs font-bold flex items-center gap-1 transition-colors"
                style={{ color: "#6673FF" }}
                onMouseEnter={e => e.currentTarget.style.color = "#2F2CCB"}
                onMouseLeave={e => e.currentTarget.style.color = "#6673FF"}
              >
                View All <ArrowUpRight size={12} />
              </button>
            }
          />

          {stats?.recentActivity?.length > 0 ? (
            <div>{stats.recentActivity.map((a) => <ActivityRow key={a.id} a={a} />)}</div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: cv("--border-color") }}>
                <TrendingUp size={24} style={textMuted} />
              </div>
              <p className="text-sm font-medium" style={textSecondary}>No recent activity.</p>
              <p className="text-xs mt-1" style={textMuted}>Sync Outlook to get started.</p>
            </div>
          )}
        </SectionCard>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Engagement Overview */}
          <SectionCard className="p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)" }}>
                <TrendingUp size={13} className="text-white" />
              </div>
              <p className="font-bold text-sm" style={textPrimary}>Engagement Overview</p>
            </div>
            <div className="space-y-5">
              <EngagementBar label="Open rate"  value={stats?.openRate  || 0} gradient="linear-gradient(90deg,#8b5cf6,#7c3aed)" />
              <EngagementBar label="Click rate" value={stats?.clickRate || 0} gradient="linear-gradient(90deg,#f59e0b,#ea580c)" />
            </div>
          </SectionCard>

          {/* Outlook Sync Banner — always dark (gradient card, never inverts) */}
          <div className="relative rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 28px rgba(47,44,203,0.4)" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#2F2CCB 0%,#6673FF 55%,#4f46e5 100%)" }} />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />

            <div className="relative p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} style={{ color: "#DADFFF" }} />
                <h3 className="font-bold text-base text-white">Outlook Sync Active</h3>
              </div>
              <p className="mb-4 ml-5" style={{ color: "#B8C0FF", fontSize: "0.6875rem" }}>
                Inbox syncing automatically. BCC tracking is on.
              </p>
              <div className="flex items-center gap-3 rounded-xl p-3.5"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Users size={18} className="text-white" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-blue-700 bg-emerald-400" />
                </div>
                <div>
                  <p className="font-bold uppercase tracking-widest" style={{ color: "#B8C0FF", fontSize: "0.625rem" }}>Active Members</p>
                  <p className="font-extrabold text-2xl text-white leading-tight tracking-tight">{stats?.teamMembersActive || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <SectionCard>
            <div className="px-5 py-3.5 border-b" style={{ ...bgStyle, borderColor: cv("--border-color") }}>
              <p className="font-bold text-sm" style={textPrimary}>Quick Actions</p>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { label: "Add New Client", sub: "Create a PCN / Surgery",    path: "/email-activity/clients", grad: "linear-gradient(135deg,#6673FF,#2F2CCB)", glow: "rgba(102,115,255,0.3)", Icon: Users     },
                { label: "Compose Email",  sub: "Send to any client",         action: () => setComposeOpen(true), grad: "linear-gradient(135deg,#8b5cf6,#7c3aed)", glow: "rgba(139,92,246,0.3)", Icon: Mail  },
                { label: "Team & Sync",    sub: "Manage Outlook connections",  path: "/email-activity/team",    grad: "linear-gradient(135deg,#10b981,#0d9488)", glow: "rgba(16,185,129,0.3)", Icon: RefreshCw },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => q.action ? q.action() : navigate(q.path)}
                  className="qa-btn w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left hover:-translate-y-px group"
                  style={{ borderColor: cv("--border-color"), backgroundColor: "transparent" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{ background: q.grad, boxShadow: `0 4px 12px ${q.glow}` }}>
                    <q.Icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={textPrimary}>{q.label}</p>
                    <p className="text-xs" style={textMuted}>{q.sub}</p>
                  </div>
                  <ArrowUpRight size={13} className="ml-auto" style={textMuted} />
                </button>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>

      <ComposeEmailModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} />
    </div>
  );
}