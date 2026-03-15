import React, { useEffect, useCallback } from "react";
import { useListNotifications, useMarkNotificationRead } from "../../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell, MousePointerClick, MailOpen, Download,
  ArrowDownLeft, Check, CheckCheck, RefreshCw,
} from "lucide-react";
import { formatRelative } from "../../../lib/utils.js";

// ─── Manual loader ────────────────────────────────────────────────────────────

function NotifSkeleton() {
  return (
    <>
      <style>{`@keyframes en-pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 20px",
              borderRadius: 16, border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              animation: `en-pulse 1.5s ease infinite ${i * 0.1}s`,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#f1f5f9", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ width: "50%", height: 13, borderRadius: 5, backgroundColor: "#e2e8f0" }} />
              <div style={{ width: "75%", height: 11, borderRadius: 5, backgroundColor: "#f1f5f9" }} />
              <div style={{ width: "20%", height: 10, borderRadius: 4, backgroundColor: "#f1f5f9" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP = {
  email_opened:    { bg: "#f5f3ff", color: "#7c3aed", Icon: MailOpen },
  link_clicked:    { bg: "#fffbeb", color: "#d97706", Icon: MousePointerClick },
  file_downloaded: { bg: "#eff6ff", color: "#2563eb", Icon: Download },
  reply_received:  { bg: "#ecfdf5", color: "#059669", Icon: ArrowDownLeft },
};

function NotifIcon({ type }) {
  const cfg = ICON_MAP[type] || { bg: "#f1f5f9", color: "#64748b", Icon: Bell };
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <cfg.Icon size={18} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmailNotifications() {
  const queryClient          = useQueryClient();
  const { data, isLoading }  = useListNotifications();
  const notifications        = data?.notifications || [];
  const unread               = notifications.filter((n) => !n.isRead).length;
  const { mutate: markRead } = useMarkNotificationRead();

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  // 30s polling + visibility re-fetch
  useEffect(() => {
    const id = setInterval(refetch, 30_000);
    const onVisible = () => { if (document.visibilityState === "visible") refetch(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVisible); };
  }, [refetch]);

  const handleMarkOne = (id) => markRead({ notificationId: id }, { onSuccess: refetch });

  const handleMarkAll = () => {
    notifications.filter((n) => !n.isRead).forEach((n) => markRead({ notificationId: n.id }, {}));
    setTimeout(refetch, 500);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unread > 0 && (
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "#dc2626" }}
              >
                {unread} unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time alerts for email engagements and replies.{" "}
            <span className="text-xs text-slate-400">Auto-refreshes every 30s</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 bg-white transition-colors"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          {unread > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 bg-white transition-colors"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
            >
              <CheckCheck size={15} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <NotifSkeleton />
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-20 text-center shadow-sm">
          <Bell size={40} className="mx-auto mb-4" style={{ color: "#e2e8f0" }} />
          <h3 className="font-bold text-slate-900 mb-1">All Caught Up</h3>
          <p className="text-sm text-slate-500">You don't have any new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <div
              key={notif.id}
              className="rounded-2xl border overflow-hidden transition-all"
              style={{
                backgroundColor: notif.isRead ? "#ffffff" : "#eff6ff",
                borderColor:     notif.isRead ? "#e2e8f0" : "#bfdbfe",
                boxShadow:       notif.isRead ? "0 1px 3px rgba(0,0,0,0.06)" : "0 4px 12px rgba(37,99,235,0.1)",
                animation:       `slideIn .3s ease ${i * 0.04}s both`,
              }}
            >
              <div className="p-4 sm:p-5 flex gap-4 sm:gap-5 items-start sm:items-center">
                <NotifIcon type={notif.type} />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <h4
                      className="text-sm truncate"
                      style={{
                        fontWeight: notif.isRead ? 500 : 700,
                        color:      notif.isRead ? "#374151" : "#111827",
                      }}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                      {formatRelative(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: notif.isRead ? "#6b7280" : "#374151" }}>
                    {notif.message}
                  </p>
                  {notif.clientName && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {notif.clientName}
                    </span>
                  )}
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkOne(notif.id)}
                    title="Mark as read"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0"
                    style={{ color: "#2563eb" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#dbeafe"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Check size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
      `}</style>
    </div>
  );
}