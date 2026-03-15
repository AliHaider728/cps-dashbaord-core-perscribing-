import React, { useEffect, useCallback } from "react";
import { useListNotifications, useMarkNotificationRead } from "../../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell, MousePointerClick, MailOpen, Download,
  ArrowDownLeft, Check, CheckCheck, RefreshCw,
} from "lucide-react";
import { formatRelative } from "../../../lib/utils.js";

// ─── CSS var helpers ──────────────────────────────────────────────────────────
const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"), border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

const BRAND      = "#6673FF";
const BRAND_DARK = "#2F2CCB";
const BRAND_GRAD = `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`;

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL = `
  @keyframes en-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

  .en-row { border-radius:16px; overflow:hidden; transition:box-shadow .2s, border-color .2s; }
  .en-row-unread { box-shadow: 0 4px 16px rgba(102,115,255,0.12); }

  .en-outline-btn {
    display:flex; align-items:center; gap:6px;
    padding: 8px 14px; border-radius:12px;
    font-size:0.875rem; font-weight:600;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    transition: background-color .15s, border-color .15s, color .15s;
  }
  .en-outline-btn:hover { background-color:var(--bg-primary); border-color:${BRAND}; color:${BRAND}; }

  .en-mark-btn {
    width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    transition:background-color .15s;
    color: ${BRAND};
    flex-shrink:0;
  }
  .en-mark-btn:hover { background-color: rgba(102,115,255,0.12); }

  /* unread row backgrounds — theme-aware */
  .en-row-unread-bg { background-color: rgba(102,115,255,0.06); border-color: ${BRAND}44 !important; }
  [data-theme="light"] .en-row-unread-bg { background-color: #EEF0FF; border-color: #B8C0FF !important; }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function NotifSkeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {[0,1,2,3].map((i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderRadius:16, animation:`en-pulse 1.5s ease infinite ${i*0.1}s`, ...surfaceStyle }}>
          <div style={{ width:40, height:40, borderRadius:"50%", backgroundColor: cv("--border-color"), flexShrink:0 }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ width:"50%", height:13, borderRadius:5, backgroundColor: cv("--border-color") }} />
            <div style={{ width:"75%", height:11, borderRadius:5, backgroundColor: cv("--border-color"), opacity:.6 }} />
            <div style={{ width:"20%", height:10, borderRadius:4, backgroundColor: cv("--border-color"), opacity:.4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const ICON_MAP = {
  email_opened:    { grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", Icon:MailOpen        },
  link_clicked:    { grad:"linear-gradient(135deg,#f59e0b,#ea580c)", Icon:MousePointerClick },
  file_downloaded: { grad: BRAND_GRAD,                               Icon:Download         },
  reply_received:  { grad:"linear-gradient(135deg,#10b981,#0d9488)", Icon:ArrowDownLeft    },
};

function NotifIcon({ type }) {
  const cfg = ICON_MAP[type] || { grad: cv("--border-color"), Icon:Bell };
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm" style={{ background: cfg.grad }}>
      <cfg.Icon size={17} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmailNotifications() {
  const queryClient         = useQueryClient();
  const { data, isLoading } = useListNotifications();
  const notifications       = data?.notifications || [];
  const unread              = notifications.filter((n) => !n.isRead).length;
  const { mutate: markRead } = useMarkNotificationRead();

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
    notifications.filter((n) => !n.isRead).forEach((n) => markRead({ notificationId:n.id }, {}));
    setTimeout(refetch, 500);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <style>{GLOBAL}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background: BRAND_GRAD, boxShadow:"0 4px 10px rgba(102,115,255,0.35)" }}>
                <Bell size={14} className="text-white" />
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
            Real-time alerts for email engagements and replies.{" "}
            <span className="text-xs" style={{ ...textMuted, opacity:.7 }}>Auto-refreshes every 30s</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={refetch} className="en-outline-btn">
            <RefreshCw size={14} /> Refresh
          </button>
          {unread > 0 && (
            <button onClick={handleMarkAll} className="en-outline-btn">
              <CheckCheck size={15} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <NotifSkeleton />
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl p-20 text-center" style={{ ...bgStyle, border:`1px dashed ${cv("--border-color")}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: cv("--border-color") }}>
            <Bell size={24} style={textMuted} />
          </div>
          <h3 className="font-bold mb-1" style={textPrimary}>All Caught Up</h3>
          <p className="text-sm" style={textSecondary}>You don't have any new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <div
              key={notif.id}
              className={`en-row ${notif.isRead ? "" : "en-row-unread en-row-unread-bg"}`}
              style={{ border:`1px solid ${cv("--border-color")}`, animation:`slideIn .3s ease ${i*0.04}s both`, ...(!notif.isRead ? {} : surfaceStyle) }}
            >
              <div className="p-4 sm:p-5 flex gap-4 sm:gap-5 items-start sm:items-center">
                <NotifIcon type={notif.type} />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <h4 className="text-sm truncate" style={{ fontWeight: notif.isRead ? 500 : 700, ...textPrimary }}>
                      {notif.title}
                    </h4>
                    <span className="text-xs whitespace-nowrap shrink-0" style={textMuted}>{formatRelative(notif.createdAt)}</span>
                  </div>
                  <p className="text-sm mb-2" style={notif.isRead ? textSecondary : textPrimary}>{notif.message}</p>
                  {notif.clientName && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: cv("--border-color"), ...textMuted }}>
                      {notif.clientName}
                    </span>
                  )}
                </div>

                {!notif.isRead && (
                  <button onClick={() => handleMarkOne(notif.id)} title="Mark as read" className="en-mark-btn">
                    <Check size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
      )}
    </div>
  );
}