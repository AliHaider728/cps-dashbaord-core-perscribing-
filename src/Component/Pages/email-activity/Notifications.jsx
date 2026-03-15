import React, { useEffect, useCallback, useState } from "react";
import { useListNotifications, useMarkNotificationRead } from "../../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell, MousePointerClick, MailOpen, Download,
  ArrowDownLeft, Check, CheckCheck, RefreshCw,
  ArrowUpRight, Mail, Users, Filter, X,
} from "lucide-react";
import { formatRelative, formatSmartDate } from "../../../lib/utils.js";

const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"), border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

const BRAND      = "#6673FF";
const BRAND_DARK = "#2F2CCB";
const BRAND_GRAD = `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`;

const GLOBAL = `
  @keyframes en-pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes ping      { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2);opacity:0} }

  .en-row { border-radius:16px; overflow:hidden; transition:box-shadow .2s, border-color .2s, transform .15s; }
  .en-row:hover { transform: translateY(-1px); }
  .en-row-unread { box-shadow: 0 4px 16px rgba(102,115,255,0.12); }

  .en-outline-btn {
    display:flex; align-items:center; gap:6px;
    padding:8px 14px; border-radius:12px;
    font-size:0.875rem; font-weight:600;
    background-color:var(--bg-secondary); border:1px solid var(--border-color); color:var(--text-secondary);
    transition:background-color .15s, border-color .15s, color .15s;
    white-space:nowrap;
  }
  .en-outline-btn:hover { background-color:var(--bg-primary); border-color:${BRAND}; color:${BRAND}; }

  .en-mark-btn {
    width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    transition:background-color .15s; color:${BRAND}; flex-shrink:0;
  }
  .en-mark-btn:hover { background-color:rgba(102,115,255,0.12); }

  .en-row-unread-bg { background-color:rgba(102,115,255,0.06); border-color:${BRAND}44 !important; }
  [data-theme="light"] .en-row-unread-bg { background-color:#EEF0FF; border-color:#B8C0FF !important; }

  .en-filter-pill {
    padding:6px 14px; border-radius:999px; font-size:0.8rem; font-weight:700;
    border:1px solid var(--border-color); cursor:pointer;
    transition:background-color .15s, border-color .15s, color .15s;
    background:transparent;
  }
  .en-filter-pill:hover { border-color:${BRAND}; color:${BRAND}; }
  .en-filter-pill.active { background:${BRAND}; color:white; border-color:${BRAND}; }
`;

function NotifSkeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {[0,1,2,3].map((i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderRadius:16, animation:`en-pulse 1.5s ease infinite ${i*0.1}s`, ...surfaceStyle }}>
          <div style={{ width:40, height:40, borderRadius:"50%", backgroundColor:cv("--border-color"), flexShrink:0 }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ width:"50%", height:13, borderRadius:5, backgroundColor:cv("--border-color") }} />
            <div style={{ width:"75%", height:11, borderRadius:5, backgroundColor:cv("--border-color"), opacity:.6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const ICON_MAP = {
  email_opened:    { grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", Icon:MailOpen,         label:"Email Opened"    },
  link_clicked:    { grad:"linear-gradient(135deg,#f59e0b,#ea580c)", Icon:MousePointerClick, label:"Link Clicked"    },
  file_downloaded: { grad:BRAND_GRAD,                                Icon:Download,          label:"File Downloaded" },
  reply_received:  { grad:"linear-gradient(135deg,#10b981,#0d9488)", Icon:ArrowDownLeft,     label:"Reply Received"  },
  email_sent:      { grad:BRAND_GRAD,                                Icon:ArrowUpRight,      label:"Email Sent"      },
  note_added:      { grad:"linear-gradient(135deg,#f59e0b,#ea580c)", Icon:Mail,              label:"Note Added"      },
};

function NotifIcon({ type }) {
  const cfg = ICON_MAP[type] || { grad:cv("--border-color"), Icon:Bell, label:"Notification" };
  return (
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background:cfg.grad }}>
        <cfg.Icon size={17} />
      </div>
    </div>
  );
}

const FILTER_TABS = [
  { value:"all",          label:"All"       },
  { value:"email_opened", label:"Opens"     },
  { value:"link_clicked", label:"Clicks"    },
  { value:"reply_received",label:"Replies"  },
];

export default function EmailNotifications() {
  const queryClient         = useQueryClient();
  const { data, isLoading } = useListNotifications();
  const notifications       = data?.notifications || [];
  const { mutate: markRead } = useMarkNotificationRead();

  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(false);

  const unread = notifications.filter((n) => !n.isRead).length;

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey:["notifications"] });
  }, [queryClient]);

  useEffect(() => {
    const id = setInterval(refetch, 30_000);
    const onVisible = () => { if (document.visibilityState === "visible") refetch(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVisible); };
  }, [refetch]);

  const handleMarkOne = (id) => markRead({ notificationId:id }, { onSuccess:refetch });

  const handleMarkAll = () => {
    setLoading(true);
    const unreadList = notifications.filter((n) => !n.isRead);
    unreadList.forEach((n) => markRead({ notificationId:n.id }, {}));
    setTimeout(() => { refetch(); setLoading(false); }, 600);
  };

  const handleRefresh = () => {
    setLoading(true);
    refetch();
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <style>{GLOBAL}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background:BRAND_GRAD, boxShadow:"0 4px 10px rgba(102,115,255,0.35)" }}>
                <Bell size={14} className="text-white" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background:"#ef4444" }}>
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Notifications</h1>
            </div>
            {unread > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", boxShadow:"0 2px 8px rgba(220,38,38,0.35)" }}>
                {unread} unread
              </span>
            )}
          </div>
          <p className="ml-9 text-sm" style={textMuted}>
            Real-time alerts for email opens, link clicks, downloads & replies.{" "}
            <span className="text-xs opacity-60">Auto-refreshes every 30s</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
         
          {unread > 0 && (
            <button onClick={handleMarkAll} disabled={loading} className="en-outline-btn">
              <CheckCheck size={15} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === "all"
            ? notifications.length
            : notifications.filter(n => n.type === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`en-filter-pill ${filter === tab.value ? "active" : ""}`}
              style={filter !== tab.value ? textSecondary : {}}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: filter === tab.value ? "rgba(255,255,255,0.25)" : cv("--border-color") }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
        {filter !== "all" && (
          <button onClick={() => setFilter("all")} className="en-outline-btn" style={{ padding:"6px 10px" }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Engagement summary strip */}
      {!isLoading && notifications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { type:"email_opened",    label:"Opens",     color:"#8b5cf6", bg:"rgba(139,92,246,0.1)", Icon:MailOpen         },
            { type:"link_clicked",    label:"Clicks",    color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  Icon:MousePointerClick },
            { type:"file_downloaded", label:"Downloads", color:BRAND,     bg:"rgba(102,115,255,0.1)", Icon:Download         },
            { type:"reply_received",  label:"Replies",   color:"#10b981", bg:"rgba(16,185,129,0.1)",  Icon:ArrowDownLeft    },
          ].map((s) => {
            const cnt = notifications.filter(n => n.type === s.type).length;
            return (
              <button key={s.type} onClick={() => setFilter(s.type)}
                className="rounded-xl p-3.5 flex items-center gap-3 text-left transition-all hover:-translate-y-0.5"
                style={{ ...surfaceStyle, ...(filter===s.type ? { borderColor:s.color, backgroundColor:s.bg } : {}) }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor:s.bg }}>
                  <s.Icon size={15} style={{ color:s.color }} />
                </div>
                <div>
                  <p className="text-lg font-extrabold" style={{ color:s.color }}>{cnt}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={textMuted}>{s.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Notifications list */}
      {isLoading ? (
        <NotifSkeleton />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-20 text-center" style={{ ...bgStyle, border:`1px dashed ${cv("--border-color")}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor:cv("--border-color") }}>
            <Bell size={24} style={textMuted} />
          </div>
          <h3 className="font-bold mb-1" style={textPrimary}>
            {filter !== "all" ? `No ${FILTER_TABS.find(t=>t.value===filter)?.label} notifications` : "All Caught Up"}
          </h3>
          <p className="text-sm" style={textSecondary}>
            {filter !== "all" ? "Try a different filter." : "You don't have any new notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif, i) => {
            const cfg = ICON_MAP[notif.type] || { label:"Notification" };
            return (
              <div
                key={notif.id}
                className={`en-row ${notif.isRead ? "" : "en-row-unread en-row-unread-bg"}`}
                style={{ border:`1px solid ${cv("--border-color")}`, animation:`slideIn .3s ease ${i*0.04}s both`, ...(!notif.isRead ? {} : surfaceStyle) }}
              >
                <div className="p-4 sm:p-5 flex gap-4 sm:gap-5 items-start sm:items-center">
                  <NotifIcon type={notif.type} />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3 mb-1 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm" style={{ fontWeight:notif.isRead ? 500 : 700, ...textPrimary }}>
                          {notif.title}
                        </h4>
                        {/* Type badge */}
                        {cfg.label && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:cv("--border-color"), ...textMuted }}>
                            {cfg.label}
                          </span>
                        )}
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor:BRAND }} />
                        )}
                      </div>
                      <span className="text-xs whitespace-nowrap shrink-0" style={textMuted}>
                        {formatSmartDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={notif.isRead ? textSecondary : textPrimary}>{notif.message}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {notif.clientName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor:cv("--border-color"), ...textMuted }}>
                          <Users size={10} /> {notif.clientName}
                        </span>
                      )}
                      {notif.accountManagerName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor:cv("--border-color"), ...textMuted }}>
                          👤 {notif.accountManagerName}
                        </span>
                      )}
                      <span className="text-xs" style={textMuted}>{formatRelative(notif.createdAt)}</span>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <button onClick={() => handleMarkOne(notif.id)} title="Mark as read" className="en-mark-btn">
                      <Check size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}