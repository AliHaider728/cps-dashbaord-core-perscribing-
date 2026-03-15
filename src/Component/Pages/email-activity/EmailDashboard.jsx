import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, Mail, MousePointerClick,
  Users, RefreshCw, BarChart3, TrendingUp, AlertCircle,
  Zap, Activity, MailOpen, Download, Bell, Eye,
} from "lucide-react";
import { useGetStatsOverview } from "../../../lib/api.js";
import { formatRelative } from "../../../lib/utils.js";
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"),  border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

const GLOBAL_STYLES = `
  @keyframes ed-pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes ed-fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ed-slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

  .sc-blue   { background: rgba(30,27,143,0.18);  border-color: rgba(102,115,255,0.25); }
  .sc-green  { background: rgba(6,78,59,0.22);    border-color: rgba(16,185,129,0.2);  }
  .sc-violet { background: rgba(76,29,149,0.22);  border-color: rgba(139,92,246,0.2);  }
  .sc-amber  { background: rgba(120,53,15,0.22);  border-color: rgba(245,158,11,0.2);  }
  [data-theme="light"] .sc-blue   { background: rgba(238,240,255,0.75); border-color: #B8C0FF; }
  [data-theme="light"] .sc-green  { background: rgba(209,250,229,0.75); border-color: #6ee7b7; }
  [data-theme="light"] .sc-violet { background: rgba(237,233,254,0.75); border-color: #c4b5fd; }
  [data-theme="light"] .sc-amber  { background: rgba(255,251,235,0.75); border-color: #fcd34d; }

  .sc-blue   .sc-val { color: #DADFFF; } [data-theme="light"] .sc-blue   .sc-val { color: #15136B; }
  .sc-green  .sc-val { color: #d1fae5; } [data-theme="light"] .sc-green  .sc-val { color: #064e3b; }
  .sc-violet .sc-val { color: #ede9fe; } [data-theme="light"] .sc-violet .sc-val { color: #4c1d95; }
  .sc-amber  .sc-val { color: #fef3c7; } [data-theme="light"] .sc-amber  .sc-val { color: #78350f; }

  .sc-blue   .sc-sub { color: #8F9AFF; } [data-theme="light"] .sc-blue   .sc-sub { color: #6673FF; }
  .sc-green  .sc-sub { color: #34d399; } [data-theme="light"] .sc-green  .sc-sub { color: #059669; }
  .sc-violet .sc-sub { color: #a78bfa; } [data-theme="light"] .sc-violet .sc-sub { color: #7c3aed; }
  .sc-amber  .sc-sub { color: #fbbf24; } [data-theme="light"] .sc-amber  .sc-sub { color: #d97706; }

  .act-row { transition: background-color .15s; cursor: pointer; }
  .act-row:hover { background-color: var(--border-color); }

  .act-icon-email_sent     { background: rgba(102,115,255,0.13); }
  .act-icon-email_received { background: rgba(16,185,129,0.13);  }
  .act-icon-engagement     { background: rgba(139,92,246,0.13);  }
  .act-icon-note           { background: rgba(245,158,11,0.13);  }
  [data-theme="light"] .act-icon-email_sent     { background: #EEF0FF; }
  [data-theme="light"] .act-icon-email_received { background: #d1fae5; }
  [data-theme="light"] .act-icon-engagement     { background: #ede9fe; }
  [data-theme="light"] .act-icon-note           { background: #fef3c7; }

  .qa-btn { transition: background-color .2s, border-color .2s, transform .15s; }
  .qa-btn:hover { background-color: var(--bg-primary) !important; border-color: rgba(102,115,255,0.35) !important; transform: translateY(-1px); }
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
  blue:   { cls: "sc-blue",   icon: "linear-gradient(135deg,#6673FF,#2F2CCB)", glow: "0 8px 28px rgba(102,115,255,0.35)" },
  green:  { cls: "sc-green",  icon: "linear-gradient(135deg,#10b981,#0d9488)", glow: "0 8px 28px rgba(16,185,129,0.3)"  },
  violet: { cls: "sc-violet", icon: "linear-gradient(135deg,#8b5cf6,#7c3aed)", glow: "0 8px 28px rgba(139,92,246,0.3)" },
  amber:  { cls: "sc-amber",  icon: "linear-gradient(135deg,#f59e0b,#ea580c)", glow: "0 8px 28px rgba(245,158,11,0.3)" },
};

function StatCard({ title, value, Icon, theme, sub, delay = 0 }) {
  const t = STAT_THEMES[theme];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${t.cls} group relative rounded-2xl border shadow-sm cursor-default overflow-hidden transition-all duration-300 ease-out`}
      style={{ transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0)", boxShadow: hovered ? t.glow : "0 1px 6px rgba(0,0,0,0.12)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-10" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.9),transparent)" }} />
      <div className="relative p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md" style={{ background: t.icon }}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="sc-sub text-[11px] font-semibold uppercase tracking-widest mb-1">{title}</p>
          <p className="sc-val text-3xl font-extrabold leading-none tracking-tight">{value}</p>
          {sub && <p className="sc-sub text-[11px] mt-1 opacity-80">{sub}</p>}
        </div>
      </div>
      <div className="h-px w-full opacity-20" style={{ background: `linear-gradient(to right,transparent,white,transparent)` }} />
    </div>
  );
}

// ─── Engagement Bar ───────────────────────────────────────────────────────────
function EngagementBar({ label, value, gradient, sub }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <span style={{ ...textSecondary, fontSize: "0.875rem", fontWeight: 600 }}>{label}</span>
          {sub && <span style={{ ...textMuted, fontSize: "0.7rem", marginLeft:6 }}>{sub}</span>}
        </div>
        <span style={{ ...textPrimary, fontSize: "0.9375rem", fontWeight: 700 }} className="tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: cv("--border-color") }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(value,100)}%`, background: gradient }} />
      </div>
    </div>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────
const TYPE_META = {
  email_sent:     { iconColor: "#6673FF", dot: "#6673FF", Icon: <ArrowUpRight size={16} />,       label: "Email Sent"     },
  email_received: { iconColor: "#10b981", dot: "#10b981", Icon: <ArrowDownLeft size={16} />,      label: "Reply Received" },
  engagement:     { iconColor: "#8b5cf6", dot: "#8b5cf6", Icon: <MousePointerClick size={16} />,  label: "Engagement"     },
  note:           { iconColor: "#f59e0b", dot: "#f59e0b", Icon: <MailOpen size={16} />,           label: "Note"           },
};

function ActivityRow({ a, onClick }) {
  const meta   = TYPE_META[a.type] || TYPE_META.engagement;
  const typeKey = a.type || "engagement";
  return (
    <div
      className={`act-row flex items-center gap-4 px-5 py-4 border-b last:border-0 transition-colors duration-150`}
      style={{ borderColor: cv("--border-color") }}
      onClick={() => onClick && onClick(a)}
    >
      <div className={`act-icon-${typeKey} w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors`}
        style={{ color: meta.iconColor, border: `1px solid ${meta.iconColor}30` }}>
        {meta.Icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold truncate leading-snug" style={{ ...textPrimary, fontSize: "0.9375rem" }}>
            {a.subject || meta.label}
          </p>
          {a.type === "email_received" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:"rgba(16,185,129,0.12)", color:"#10b981" }}>Reply</span>
          )}
        </div>
        <p className="truncate mt-0.5" style={{ ...textSecondary, fontSize: "0.8125rem" }}>
          {a.clientName ? `${a.clientName} · ` : ""}{a.preview || a.content || ""}
        </p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <span className="whitespace-nowrap font-medium" style={{ ...textMuted, fontSize: "0.75rem" }}>{formatRelative(a.occurredAt)}</span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.dot, opacity: 0.7 }} />
      </div>
    </div>
  );
}

function SectionCard({ children, className = "", style: extraStyle = {} }) {
  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden ${className}`} style={{ ...surfaceStyle, ...extraStyle }}>
      {children}
    </div>
  );
}

function CardHeader({ iconBg, IconEl, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ ...bgStyle, borderColor: cv("--border-color") }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: iconBg }}>{IconEl}</div>
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
  const { data: stats, isLoading, isError, refetch } = useGetStatsOverview();
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
          <button onClick={() => refetch()} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
            Retry
          </button>
        </div>
      </>
    );
  }

  const STATS = [
    { title:"Emails Sent",     value: stats?.totalEmailsSent     || 0, sub: "Via Outlook + BCC",    Icon: ArrowUpRight,      theme:"blue",   delay:0    },
    { title:"Emails Received", value: stats?.totalEmailsReceived || 0, sub: "Replies captured",     Icon: ArrowDownLeft,     theme:"green",  delay:0.05 },
    { title:"Avg Open Rate",   value: `${stats?.openRate  || 0}%`,     sub: "Engagement tracking",  Icon: Eye,               theme:"violet", delay:0.1  },
    { title:"Avg Click Rate",  value: `${stats?.clickRate || 0}%`,     sub: "Link interactions",    Icon: MousePointerClick, theme:"amber",  delay:0.15 },
  ];

  return (
    <div className="space-y-6">
      <style>{GLOBAL_STYLES}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background:"linear-gradient(135deg,#6673FF,#2F2CCB)", boxShadow:"0 4px 10px rgba(102,115,255,0.4)" }}>
              <Activity size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Email Activity</h1>
          </div>
          <p className="ml-9 text-sm" style={textMuted}>Overview of all client communications — Outlook + BCC synced.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/email-activity/clients")} className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm"
            style={{ ...surfaceStyle, ...textSecondary }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#6673FF"; e.currentTarget.style.color="#6673FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=cv("--border-color"); e.currentTarget.style.color=cv("--text-secondary"); }}>
            View Clients
          </button>
          <button onClick={() => navigate("/email-activity/notifications")} className="relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm flex items-center gap-2"
            style={{ ...surfaceStyle, ...textSecondary }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#6673FF"; e.currentTarget.style.color="#6673FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=cv("--border-color"); e.currentTarget.style.color=cv("--text-secondary"); }}>
            <Bell size={14} /> Notifications
            {stats?.unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background:"#ef4444" }}>
                {stats.unreadNotifications}
              </span>
            )}
          </button>
          <button onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-200 hover:-translate-y-px"
            style={{ background:"linear-gradient(135deg,#6673FF,#2F2CCB)", boxShadow:"0 4px 14px rgba(102,115,255,0.4)" }}>
            <Mail size={15} /> Compose
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity Feed */}
        <SectionCard className="lg:col-span-2">
          <CardHeader
            iconBg="linear-gradient(135deg,#6673FF,#2F2CCB)"
            IconEl={<BarChart3 size={15} className="text-white" />}
            title="Recent Activity"
            subtitle="Latest across all accounts — sent, received, engagement"
            action={
              <button onClick={() => navigate("/email-activity/emails")}
                className="text-xs font-bold flex items-center gap-1 transition-colors" style={{ color:"#6673FF" }}
                onMouseEnter={e => e.currentTarget.style.color="#2F2CCB"}
                onMouseLeave={e => e.currentTarget.style.color="#6673FF"}>
                View All <ArrowUpRight size={12} />
              </button>
            }
          />
          {stats?.recentActivity?.length > 0 ? (
            <div>
              {stats.recentActivity.map((a) => (
                <ActivityRow key={a.id} a={a} onClick={() => navigate(`/email-activity/clients/${a.clientId}`)} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: cv("--border-color") }}>
                <TrendingUp size={24} style={textMuted} />
              </div>
              <p className="text-sm font-medium" style={textSecondary}>No recent activity.</p>
              <p className="text-xs mt-1" style={textMuted}>Connect Outlook or send via BCC to get started.</p>
            </div>
          )}
        </SectionCard>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Engagement Overview */}
          <SectionCard className="p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm" style={{ background:"linear-gradient(135deg,#8b5cf6,#7c3aed)" }}>
                <TrendingUp size={13} className="text-white" />
              </div>
              <p className="font-bold text-sm" style={textPrimary}>Engagement Overview</p>
            </div>
            <div className="space-y-5">
              <EngagementBar label="Open rate"     value={stats?.openRate    || 0} gradient="linear-gradient(90deg,#8b5cf6,#7c3aed)" sub="emails opened" />
              <EngagementBar label="Click rate"    value={stats?.clickRate   || 0} gradient="linear-gradient(90deg,#f59e0b,#ea580c)" sub="links clicked" />
              <EngagementBar label="Reply rate"    value={stats?.replyRate   || 0} gradient="linear-gradient(90deg,#10b981,#0d9488)" sub="replies received" />
            </div>
            <div className="mt-5 pt-4 grid grid-cols-3 gap-2" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
              {[
                { label:"Opens",     val: stats?.totalOpens     || 0, color:"#8b5cf6", Icon: MailOpen },
                { label:"Clicks",    val: stats?.totalClicks    || 0, color:"#f59e0b", Icon: MousePointerClick },
                { label:"Downloads", val: stats?.totalDownloads || 0, color:"#10b981", Icon: Download },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: cv("--bg-primary"), border:`1px solid ${cv("--border-color")}` }}>
                  <s.Icon size={14} style={{ color:s.color, margin:"0 auto 4px" }} />
                  <p className="text-lg font-extrabold" style={{ color:s.color }}>{s.val}</p>
                  <p className="text-[10px] font-bold uppercase" style={textMuted}>{s.label}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Outlook Sync Banner */}
          <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow:"0 8px 28px rgba(47,44,203,0.4)" }}>
            <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#2F2CCB 0%,#6673FF 55%,#4f46e5 100%)" }} />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background:"rgba(255,255,255,0.05)" }} />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full" style={{ background:"rgba(255,255,255,0.05)" }} />
            <div className="relative p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} style={{ color:"#DADFFF" }} />
                <h3 className="font-bold text-base text-white">Outlook Sync Active</h3>
              </div>
              <p className="mb-4 ml-5" style={{ color:"#B8C0FF", fontSize:"0.6875rem" }}>
                Inbox syncing + BCC tracking enabled.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label:"BCC Tracked",    val: stats?.bccTrackedCount    || 0 },
                  { label:"Inbox Synced",   val: stats?.inboxSyncedCount   || 0 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)" }}>
                    <p className="font-extrabold text-xl text-white">{s.val}</p>
                    <p style={{ color:"#B8C0FF", fontSize:"0.625rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-xl p-3.5" style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)" }}>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"rgba(255,255,255,0.15)" }}>
                    <Users size={18} className="text-white" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-blue-700 bg-emerald-400" />
                </div>
                <div>
                  <p className="font-bold uppercase tracking-widest" style={{ color:"#B8C0FF", fontSize:"0.625rem" }}>Active Members</p>
                  <p className="font-extrabold text-2xl text-white leading-tight">{stats?.teamMembersActive || 0}</p>
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
                { label:"Add New Client",    sub:"Create a PCN / Surgery",           path:"/email-activity/clients",       grad:"linear-gradient(135deg,#6673FF,#2F2CCB)", Icon:Users        },
                { label:"Compose Email",     sub:"Send to any client",               action:() => setComposeOpen(true),    grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", Icon:Mail         },
                { label:"Team & Sync",       sub:"Manage Outlook connections",       path:"/email-activity/team",          grad:"linear-gradient(135deg,#10b981,#0d9488)", Icon:RefreshCw    },
                { label:"Notifications",     sub:"View alerts & engagements",        path:"/email-activity/notifications", grad:"linear-gradient(135deg,#f59e0b,#ea580c)", Icon:Bell         },
              ].map((q) => (
                <button key={q.label} onClick={() => q.action ? q.action() : navigate(q.path)}
                  className="qa-btn w-full flex items-center gap-3 p-3 rounded-xl border text-left group"
                  style={{ borderColor:cv("--border-color"), backgroundColor:"transparent" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{ background:q.grad, boxShadow:`0 4px 12px rgba(0,0,0,0.2)` }}>
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