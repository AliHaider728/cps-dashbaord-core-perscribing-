import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownLeft, Mail, MousePointerClick,
  Users, RefreshCw, BarChart3, TrendingUp, AlertCircle,
  Zap, Activity, MailOpen, Download, Bell, Eye, Inbox,
} from "lucide-react";
import { useGetStatsOverview, useListNotifications } from "../../../lib/api.js";
import { formatRelative } from "../../../lib/utils.js";
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";
import { ParticleCard, GlobalSpotlight } from "../../MagicBento/MagicBento.jsx";

const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"), border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes ed-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes live-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.5} }
  @keyframes shimmer  { 0%{left:-60%} 100%{left:110%} }
  @keyframes bar-grow { from{width:0} to{width:var(--w)} }

  .ed-font * { font-family:'DM Sans',sans-serif !important; }

  .sc-card {
    position:relative; overflow:hidden; border-radius:18px; border:1px solid;
    cursor:default; transition:transform .25s, box-shadow .25s;
  }
  .sc-card:hover { transform:translateY(-3px); }
  .sc-card::before {
    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
    animation:shimmer 2s ease infinite; pointer-events:none; z-index:1;
  }

  .sc-blue   { background:rgba(30,27,143,0.22);  border-color:rgba(102,115,255,0.35); }
  .sc-green  { background:rgba(6,78,59,0.28);    border-color:rgba(16,185,129,0.3);  }
  .sc-violet { background:rgba(76,29,149,0.28);  border-color:rgba(139,92,246,0.3);  }
  .sc-amber  { background:rgba(120,53,15,0.28);  border-color:rgba(245,158,11,0.3);  }

  [data-theme="light"] .sc-blue   { background:linear-gradient(145deg,#dde3ff,#c7d0ff); border-color:#4f46e5; border-width:1.5px; }
  [data-theme="light"] .sc-green  { background:linear-gradient(145deg,#ccfce8,#a7f3d0); border-color:#059669; border-width:1.5px; }
  [data-theme="light"] .sc-violet { background:linear-gradient(145deg,#ede9fe,#d8d3fe); border-color:#7c3aed; border-width:1.5px; }
  [data-theme="light"] .sc-amber  { background:linear-gradient(145deg,#fef3c7,#fde68a); border-color:#d97706; border-width:1.5px; }

  .sc-blue .sc-val { color:#DADFFF; } .sc-green .sc-val { color:#d1fae5; }
  .sc-violet .sc-val { color:#ede9fe; } .sc-amber .sc-val { color:#fef3c7; }
  .sc-blue .sc-sub { color:#8F9AFF; } .sc-green .sc-sub { color:#34d399; }
  .sc-violet .sc-sub { color:#a78bfa; } .sc-amber .sc-sub { color:#fbbf24; }

  [data-theme="light"] .sc-blue .sc-val   { color:#1e1b8f; } [data-theme="light"] .sc-green .sc-val  { color:#064e3b; }
  [data-theme="light"] .sc-violet .sc-val { color:#3b0764; } [data-theme="light"] .sc-amber .sc-val  { color:#78350f; }
  [data-theme="light"] .sc-blue .sc-sub   { color:#3730a3; } [data-theme="light"] .sc-green .sc-sub  { color:#047857; }
  [data-theme="light"] .sc-violet .sc-sub { color:#5b21b6; } [data-theme="light"] .sc-amber .sc-sub  { color:#92400e; }

  .act-list { position:relative; }
  .act-list::before {
    content:''; position:absolute; left:34px; top:0; bottom:0; width:1px;
    background:linear-gradient(to bottom,transparent,var(--border-color) 10%,var(--border-color) 90%,transparent);
    pointer-events:none; z-index:0;
  }
  [data-theme="light"] .act-list::before { background:linear-gradient(to bottom,transparent,#d1d5db 10%,#d1d5db 90%,transparent); }

  .act-row {
    display:flex; align-items:flex-start; gap:14px; padding:13px 18px;
    cursor:pointer; transition:background .15s;
  }
  .act-row:hover { background-color:var(--border-color); }
  [data-theme="light"] .act-row:hover { background-color:#f3f4f6; }

  .act-icon {
    width:30px; height:30px; border-radius:9px; display:flex; align-items:center;
    justify-content:center; border:1.5px solid; flex-shrink:0; position:relative; z-index:1;
  }
  .act-icon-email_sent     { background:rgba(102,115,255,0.15); border-color:rgba(102,115,255,0.4); color:#818cf8; }
  .act-icon-email_received { background:rgba(16,185,129,0.15);  border-color:rgba(16,185,129,0.4);  color:#34d399; }
  .act-icon-engagement     { background:rgba(139,92,246,0.15);  border-color:rgba(139,92,246,0.4);  color:#a78bfa; }
  .act-icon-note           { background:rgba(245,158,11,0.15);  border-color:rgba(245,158,11,0.4);  color:#fbbf24; }

  [data-theme="light"] .act-icon-email_sent     { background:#e0e7ff; border-color:#4f46e5; color:#3730a3; }
  [data-theme="light"] .act-icon-email_received { background:#d1fae5; border-color:#059669; color:#065f46; }
  [data-theme="light"] .act-icon-engagement     { background:#ede9fe; border-color:#7c3aed; color:#5b21b6; }
  [data-theme="light"] .act-icon-note           { background:#fef3c7; border-color:#d97706; color:#92400e; }

  .eng-track { height:8px; border-radius:99px; overflow:hidden; background:rgba(0,0,0,0.15); }
  [data-theme="light"] .eng-track { background:#e5e7eb; }
  .eng-fill  { height:100%; border-radius:99px; animation:bar-grow .9s cubic-bezier(.16,1,.3,1) both; }

  .qa-row {
    display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:12px;
    border:1px solid transparent; transition:border-color .15s, background .15s, transform .15s;
    cursor:pointer; background:transparent; width:100%; text-align:left;
  }
  .qa-row:hover { background:var(--bg-primary); border-color:rgba(102,115,255,0.3); transform:translateX(2px); }
  [data-theme="light"] .qa-row:hover { background:#f5f3ff; border-color:#6673FF; }

  .live-dot {
    width:7px; height:7px; border-radius:50%; background:#10b981;
    animation:live-dot 2s ease-in-out infinite; display:inline-block;
  }

  .skel { border-radius:12px; background:var(--border-color); animation:ed-pulse 1.5s ease infinite; }

  .ed-pc-content { position:relative; z-index:1; }
  [data-theme="light"] .ed-surface {
    background:#ffffff !important;
    border:1.5px solid #d1d5db !important;
    box-shadow:0 1px 6px rgba(0,0,0,0.07) !important;
  }
`;

function DashboardSkeleton() {
  return (
    <div className="space-y-5 ed-font">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[0,1,2,3].map(i => <div key={i} className="skel" style={{ height:100, animationDelay:`${i*0.1}s` }} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 skel" style={{ height:320 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[0,1,2].map(i => <div key={i} className="skel" style={{ height:90, animationDelay:`${i*0.15}s` }} />)}
        </div>
      </div>
    </div>
  );
}

const STAT_THEMES = {
  blue:   { cls:"sc-blue",   grad:"linear-gradient(135deg,#6673FF,#2F2CCB)", glow:"0 8px 28px rgba(102,115,255,0.45)" },
  green:  { cls:"sc-green",  grad:"linear-gradient(135deg,#10b981,#0d9488)", glow:"0 8px 28px rgba(16,185,129,0.4)"  },
  violet: { cls:"sc-violet", grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", glow:"0 8px 28px rgba(139,92,246,0.4)" },
  amber:  { cls:"sc-amber",  grad:"linear-gradient(135deg,#f59e0b,#ea580c)", glow:"0 8px 28px rgba(245,158,11,0.4)" },
};

function StatCard({ title, value, Icon, theme, sub }) {
  const t = STAT_THEMES[theme];
  const [hov, setHov] = useState(false);
  return (
    <div className={`sc-card ${t.cls}`}
      style={{ boxShadow: hov ? t.glow : "0 2px 6px rgba(0,0,0,0.12)" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position:"absolute", top:-24, right:-24, width:90, height:90, borderRadius:"50%",
                    background:"radial-gradient(circle,rgba(255,255,255,0.08),transparent)", pointerEvents:"none" }} />
      <div style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:14, position:"relative", zIndex:1 }}>
        <div style={{ width:46, height:46, borderRadius:12, background:t.grad, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 4px 12px rgba(0,0,0,0.28)" }}>
          <Icon size={20} color="white" />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p className="sc-sub" style={{ fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{title}</p>
          <p className="sc-val" style={{ fontSize:"1.875rem", fontWeight:800, lineHeight:1, letterSpacing:"-0.025em" }}>{value}</p>
          {sub && <p className="sc-sub" style={{ fontSize:"0.75rem", marginTop:3, opacity:0.8 }}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function EngBar({ label, value, gradient, sub }) {
  const safe = Math.min(Math.max(value || 0, 0), 100);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:7 }}>
        <div>
          <span style={{ ...textSecondary, fontSize:"0.9375rem", fontWeight:600 }}>{label}</span>
          {sub && <span style={{ ...textMuted, fontSize:"0.8125rem", marginLeft:6 }}>{sub}</span>}
        </div>
        <span style={{ ...textPrimary, fontSize:"1rem", fontWeight:800 }} className="tabular-nums">{safe}%</span>
      </div>
      <div className="eng-track">
        <div className="eng-fill" style={{ "--w":`${safe}%`, width:`${safe}%`, background:gradient }} />
      </div>
    </div>
  );
}

const TYPE_META = {
  email_sent:     { dot:"#818cf8", Icon:<ArrowUpRight size={15} />,      label:"Sent"  },
  email_received: { dot:"#34d399", Icon:<ArrowDownLeft size={15} />,     label:"Reply" },
  engagement:     { dot:"#a78bfa", Icon:<MousePointerClick size={15} />, label:"Click" },
  note:           { dot:"#fbbf24", Icon:<MailOpen size={15} />,          label:"Note"  },
};

function ActivityRow({ a, onClick }) {
  const meta    = TYPE_META[a.type] || TYPE_META.engagement;
  const typeKey = a.type || "engagement";
  return (
    <div className="act-row" onClick={() => onClick?.(a)}>
      <div className={`act-icon act-icon-${typeKey}`}>{meta.Icon}</div>
      <div style={{ flex:1, minWidth:0, paddingTop:2 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          <span style={{ ...textPrimary, fontWeight:700, fontSize:"0.9375rem" }} className="truncate">
            {a.subject || meta.label}
          </span>
          {a.type === "email_received" && (
            <span style={{ fontSize:"0.6875rem", fontWeight:700, padding:"2px 7px", borderRadius:99,
                           background:"rgba(16,185,129,0.14)", color:"#10b981" }}>Reply</span>
          )}
          {a.openCount > 0 && (
            <span style={{ fontSize:"0.6875rem", fontWeight:700, padding:"2px 6px", borderRadius:99,
                           display:"flex", alignItems:"center", gap:2,
                           background:"rgba(139,92,246,0.14)", color:"#8b5cf6" }}>
              <MailOpen size={9}/>{a.openCount}
            </span>
          )}
          {a.clickCount > 0 && (
            <span style={{ fontSize:"0.6875rem", fontWeight:700, padding:"2px 6px", borderRadius:99,
                           display:"flex", alignItems:"center", gap:2,
                           background:"rgba(245,158,11,0.14)", color:"#f59e0b" }}>
              <MousePointerClick size={9}/>{a.clickCount}
            </span>
          )}
        </div>
        <p style={{ ...textMuted, fontSize:"0.875rem", marginTop:2 }} className="truncate">
          {a.clientName ? `${a.clientName} · ` : ""}{a.preview || a.content || ""}
        </p>
      </div>
      <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
        <span style={{ ...textMuted, fontSize:"0.8125rem", whiteSpace:"nowrap" }}>{formatRelative(a.occurredAt)}</span>
        <span style={{ width:6, height:6, borderRadius:"50%", background:meta.dot, opacity:.8 }} />
      </div>
    </div>
  );
}

function CardHead({ iconGrad, IconEl, title, sub, action }) {
  return (
    <div style={{ ...bgStyle, borderBottom:`1px solid ${cv("--border-color")}`,
                  padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:11 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:iconGrad, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
          {IconEl}
        </div>
        <div>
          <p style={{ ...textPrimary, fontWeight:700, fontSize:"1rem", lineHeight:1.2 }}>{title}</p>
          {sub && <p style={{ ...textMuted, fontSize:"0.8125rem", marginTop:2 }}>{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

const PC = { glowColor:"102, 115, 255", clickEffect:true, particleCount:10, innerGlow:true };

export default function EmailDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useGetStatsOverview();
  // FIX: get unread count from notifications hook
  const { data: notifData } = useListNotifications();
  const unreadNotifications = notifData?.unreadCount || 0;

  const [composeOpen, setComposeOpen] = useState(false);
  const gridRef = useRef(null);

  if (isLoading) return <><style>{GLOBAL_STYLES}</style><DashboardSkeleton /></>;

  if (isError) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div className="ed-font p-10 text-center rounded-2xl" style={surfaceStyle}>
          <div style={{ width:52, height:52, borderRadius:14, background:"rgba(239,68,68,0.1)",
                        display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <AlertCircle size={26} color="#ef4444" />
          </div>
          <h3 style={{ color:"#ef4444", fontWeight:700, fontSize:"1.125rem", marginBottom:6 }}>Dashboard unavailable</h3>
          <p style={{ color:"#f87171", fontSize:"0.9375rem", marginBottom:18 }}>Check that the backend API is running.</p>
          <button onClick={() => refetch()}
            style={{ padding:"10px 22px", background:"#ef4444", color:"#fff", borderRadius:10,
                     fontSize:"0.9375rem", fontWeight:600, border:"none", cursor:"pointer" }}>Retry</button>
        </div>
      </>
    );
  }

  const STATS = [
    { title:"Emails Sent",     value: stats?.totalEmailsSent     || 0, sub:"Outlook + BCC",     Icon:ArrowUpRight,      theme:"blue"   },
    { title:"Emails Received", value: stats?.totalEmailsReceived || 0, sub:"Replies captured",  Icon:ArrowDownLeft,     theme:"green"  },
    { title:"Avg Open Rate",   value:`${stats?.openRate  || 0}%`,      sub:"Engagement",        Icon:Eye,               theme:"violet" },
    { title:"Avg Click Rate",  value:`${stats?.clickRate || 0}%`,      sub:"Link interactions", Icon:MousePointerClick, theme:"amber"  },
  ];

  const hasActivity = (stats?.recentActivity?.length || 0) > 0;

  // FIX: safe fallback for fields that backend may not return yet
  const replyRate      = stats?.replyRate      || 0;
  const bccTracked     = stats?.bccTrackedCount  || stats?.totalEmailsSent || 0;
  const inboxSynced    = stats?.inboxSyncedCount || stats?.totalEmailsReceived || 0;
  const totalDownloads = stats?.totalDownloads   || 0;

  return (
    <div className="ed-font space-y-5">
      <style>{GLOBAL_STYLES}</style>

      <GlobalSpotlight containerRef={gridRef} spotlightRadius={420} glowColor="102, 115, 255" />

      {/* Header */}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:3 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#6673FF,#2F2CCB)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow:"0 4px 12px rgba(102,115,255,0.45)" }}>
              <Activity size={16} color="white" />
            </div>
            <h1 style={{ ...textPrimary, fontSize:"1.5rem", fontWeight:800, letterSpacing:"-0.025em" }}>Email Activity</h1>
            <span style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99,
                           background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)" }}>
              <span className="live-dot" />
              <span style={{ color:"#10b981", fontSize:"0.6875rem", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase" }}>Live</span>
            </span>
          </div>
          <p style={{ ...textMuted, fontSize:"0.9375rem", paddingLeft:41 }}>Outlook + BCC sync — all client comms in one view</p>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <button onClick={() => navigate("/email-activity/clients")}
            style={{ ...surfaceStyle, ...textSecondary, padding:"8px 16px", borderRadius:10,
                     fontSize:"0.9375rem", fontWeight:600, cursor:"pointer", transition:"all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#6673FF"; e.currentTarget.style.color="#6673FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=cv("--border-color"); e.currentTarget.style.color=cv("--text-secondary"); }}>
            Clients
          </button>

          <button onClick={() => navigate("/email-activity/notifications")}
            style={{ ...surfaceStyle, ...textSecondary, padding:"8px 16px", borderRadius:10, fontSize:"0.9375rem",
                     fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:7,
                     transition:"all .15s", position:"relative" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#6673FF"; e.currentTarget.style.color="#6673FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=cv("--border-color"); e.currentTarget.style.color=cv("--text-secondary"); }}>
            <Bell size={15} /> Notifications
            {unreadNotifications > 0 && (
              <span style={{ position:"absolute", top:-5, right:-5, width:17, height:17, borderRadius:"50%",
                             background:"#ef4444", fontSize:"0.625rem", fontWeight:700, color:"#fff",
                             display:"flex", alignItems:"center", justifyContent:"center" }}>
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </button>

          <button onClick={() => setComposeOpen(true)}
            style={{ background:"linear-gradient(135deg,#6673FF,#2F2CCB)", color:"#fff",
                     padding:"8px 18px", borderRadius:10, fontSize:"0.9375rem", fontWeight:700,
                     border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7,
                     boxShadow:"0 4px 14px rgba(102,115,255,0.45)", transition:"transform .15s" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
            <Mail size={15} /> Compose
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Main Grid */}
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity */}
        <ParticleCard {...PC} className="lg:col-span-2 ed-surface"
          style={{ ...surfaceStyle, borderRadius:18, overflow:"hidden" }}>
          <div className="ed-pc-content">
            <CardHead
              iconGrad="linear-gradient(135deg,#6673FF,#2F2CCB)"
              IconEl={<BarChart3 size={15} color="white" />}
              title="Recent Activity"
              sub="Sent · received · engagement across all accounts"
              action={
                <button onClick={() => navigate("/email-activity/emails")}
                  style={{ color:"#6673FF", fontSize:"0.875rem", fontWeight:700,
                           background:"none", border:"none", cursor:"pointer",
                           display:"flex", alignItems:"center", gap:4 }}
                  onMouseEnter={e => e.currentTarget.style.color="#2F2CCB"}
                  onMouseLeave={e => e.currentTarget.style.color="#6673FF"}>
                  View All <ArrowUpRight size={13} />
                </button>
              }
            />
            {hasActivity ? (
              <div className="act-list" style={{ paddingLeft:4 }}>
                {stats.recentActivity.map(a => (
                  <ActivityRow key={a.id} a={a}
                    onClick={() => a.clientId && navigate(`/email-activity/clients/${a.clientId}`)} />
                ))}
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 18px",
                            borderTop:`1px solid ${cv("--border-color")}` }}>
                <div style={{ width:32, height:32, borderRadius:9, display:"flex", alignItems:"center",
                              justifyContent:"center", background:cv("--border-color"), flexShrink:0 }}>
                  <Inbox size={16} style={textMuted} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ ...textSecondary, fontSize:"0.9375rem", fontWeight:700 }}>No activity yet</p>
                  <p style={{ ...textMuted, fontSize:"0.875rem" }}>Connect Outlook or BCC an email to get started.</p>
                </div>
                <button onClick={() => navigate("/email-activity/team")}
                  style={{ background:"linear-gradient(135deg,#6673FF,#2F2CCB)", color:"#fff",
                           padding:"7px 14px", borderRadius:9, fontSize:"0.875rem", fontWeight:600,
                           border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                  <RefreshCw size={13} /> Connect
                </button>
              </div>
            )}
          </div>
        </ParticleCard>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Engagement */}
          <ParticleCard {...PC} className="ed-surface" style={{ ...surfaceStyle, borderRadius:18, padding:18 }}>
            <div className="ed-pc-content">
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow:"0 2px 8px rgba(139,92,246,0.35)" }}>
                  <TrendingUp size={14} color="white" />
                </div>
                <p style={{ ...textPrimary, fontWeight:700, fontSize:"1rem" }}>Engagement</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <EngBar label="Open rate"  value={stats?.openRate  || 0} gradient="linear-gradient(90deg,#8b5cf6,#7c3aed)" sub="opened"  />
                <EngBar label="Click rate" value={stats?.clickRate || 0} gradient="linear-gradient(90deg,#f59e0b,#ea580c)" sub="clicked" />
                <EngBar label="Reply rate" value={replyRate}             gradient="linear-gradient(90deg,#10b981,#0d9488)" sub="replied" />
              </div>
              <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${cv("--border-color")}`,
                            display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {[
                  { label:"Opens",     val:stats?.totalOpens  || 0, color:"#8b5cf6", Icon:MailOpen          },
                  { label:"Clicks",    val:stats?.totalClicks || 0, color:"#f59e0b", Icon:MousePointerClick  },
                  { label:"Downloads", val:totalDownloads,           color:"#10b981", Icon:Download           },
                ].map(s => (
                  <div key={s.label} style={{ borderRadius:11, padding:"10px 6px", textAlign:"center",
                                              background:cv("--bg-primary"), border:`1px solid ${cv("--border-color")}` }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}>
                      <s.Icon size={14} style={{ color:s.color }} />
                    </div>
                    <p style={{ fontSize:"1.25rem", fontWeight:800, color:s.color, lineHeight:1 }}>{s.val}</p>
                    <p style={{ ...textMuted, fontSize:"0.625rem", fontWeight:700, textTransform:"uppercase",
                                 letterSpacing:"0.06em", marginTop:3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ParticleCard>

          {/* Outlook Sync */}
          <ParticleCard {...PC} innerGlow={false}
            style={{ borderRadius:18, overflow:"hidden", position:"relative",
                     boxShadow:"0 8px 30px rgba(47,44,203,0.5)" }}>
            <div style={{ position:"absolute", inset:0, zIndex:0,
                          background:"linear-gradient(135deg,#1e1c8a 0%,#4f4bef 55%,#3730d9 100%)" }} />
            <div className="ed-pc-content" style={{ position:"relative", zIndex:1, padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                <Zap size={14} color="#c7d2fe" />
                <span style={{ color:"#fff", fontWeight:700, fontSize:"1rem" }}>Outlook Sync</span>
              </div>
              <p style={{ color:"#c7d2fe", fontSize:"0.8125rem", marginBottom:12, paddingLeft:21 }}>
                Inbox syncing + BCC tracking active
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                {[
                  { label:"BCC Tracked",  val: bccTracked  },
                  { label:"Inbox Synced", val: inboxSynced },
                ].map(s => (
                  <div key={s.label} style={{ borderRadius:11, padding:"10px 12px",
                                              background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.15)" }}>
                    <p style={{ color:"#fff", fontWeight:800, fontSize:"1.375rem", lineHeight:1 }}>{s.val}</p>
                    <p style={{ color:"#c7d2fe", fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase",
                                 letterSpacing:"0.07em", marginTop:3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:11, borderRadius:11, padding:"10px 12px",
                             background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.18)",
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Users size={17} color="white" />
                  </div>
                  <span style={{ position:"absolute", top:-1, right:-1, width:11, height:11, borderRadius:"50%",
                                  border:"2px solid #1e1c8a", background:"#10b981" }} />
                </div>
                <div>
                  <p style={{ color:"#c7d2fe", fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Active Members</p>
                  <p style={{ color:"#fff", fontWeight:800, fontSize:"1.5rem", lineHeight:1 }}>
                    {stats?.teamMembersActive || 0}
                  </p>
                </div>
              </div>
            </div>
          </ParticleCard>

          {/* Quick Actions */}
          <ParticleCard {...PC} className="ed-surface" style={{ ...surfaceStyle, borderRadius:18, overflow:"hidden" }}>
            <div className="ed-pc-content">
              <div style={{ ...bgStyle, borderBottom:`1px solid ${cv("--border-color")}`,
                            padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <p style={{ ...textPrimary, fontWeight:700, fontSize:"1rem" }}>Quick Actions</p>
                <span style={{ ...textMuted, fontSize:"0.8125rem" }}>4 shortcuts</span>
              </div>
              <div style={{ padding:"8px" }}>
                {[
                  { label:"Add New Client",  sub:"Create PCN / Surgery",       path:"/email-activity/clients",       grad:"linear-gradient(135deg,#6673FF,#2F2CCB)", Icon:Users     },
                  { label:"Compose Email",   sub:"Send to any client",          action:() => setComposeOpen(true),    grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", Icon:Mail      },
                  { label:"Team & Sync",     sub:"Manage Outlook connections",  path:"/email-activity/team",          grad:"linear-gradient(135deg,#10b981,#0d9488)", Icon:RefreshCw },
                  { label:"Notifications",   sub:"View alerts & engagements",   path:"/email-activity/notifications", grad:"linear-gradient(135deg,#f59e0b,#ea580c)", Icon:Bell      },
                ].map(q => (
                  <button key={q.label} className="qa-row"
                    onClick={() => q.action ? q.action() : navigate(q.path)}>
                    <div style={{ width:36, height:36, borderRadius:10, background:q.grad, flexShrink:0,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  boxShadow:"0 3px 10px rgba(0,0,0,0.22)" }}>
                      <q.Icon size={16} color="white" />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ ...textPrimary, fontSize:"0.9375rem", fontWeight:700, lineHeight:1.2 }}>{q.label}</p>
                      <p style={{ ...textMuted, fontSize:"0.8125rem", marginTop:1 }}>{q.sub}</p>
                    </div>
                    <ArrowUpRight size={14} style={textMuted} />
                  </button>
                ))}
              </div>
            </div>
          </ParticleCard>

        </div>
      </div>

      <ComposeEmailModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} />
    </div>
  );
}