import React, { useEffect, useCallback, useState } from "react";
import { useListNotifications, useMarkNotificationRead } from "../../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import { formatRelative } from "../../../lib/utils.js";

// ─── Manual SVG Icons ────────────────────────────────────────────────────────

function IconBell({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconMailOpen({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
    </svg>
  );
}

function IconMousePointer({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function IconDownload({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconArrowDownLeft({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 14 4 9 9 4" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function IconCheck({ size = 15, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCheckCheck({ size = 15, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </svg>
  );
}

function IconRefreshCw({ size = 14, color = "currentColor", spinning = false }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: spinning ? "notif-spin 0.6s linear" : "none" }}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

// ─── Icon Config Map ──────────────────────────────────────────────────────────

const ICON_MAP = {
  email_opened:    { bg: "#f5f3ff", color: "#7c3aed", Icon: IconMailOpen },
  link_clicked:    { bg: "#fffbeb", color: "#d97706", Icon: IconMousePointer },
  file_downloaded: { bg: "#eff6ff", color: "#2563eb", Icon: IconDownload },
  reply_received:  { bg: "#ecfdf5", color: "#059669", Icon: IconArrowDownLeft },
};

// ─── Notification Icon ────────────────────────────────────────────────────────

function NotifIcon({ type }) {
  const cfg = ICON_MAP[type] || { bg: "#f1f5f9", color: "#64748b", Icon: IconBell };
  return (
    <div
      style={{
        width: 40, height: 40, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        backgroundColor: cfg.bg,
        color: cfg.color,
      }}
    >
      <cfg.Icon size={18} color={cfg.color} />
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 16, border: "1px solid #e2e8f0",
      backgroundColor: "#fff", padding: "18px 20px",
      display: "flex", gap: 16, alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        backgroundColor: "#f1f5f9",
        animation: "notif-pulse 1.5s ease-in-out infinite",
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          height: 13, borderRadius: 6, width: "55%",
          backgroundColor: "#f1f5f9",
          animation: "notif-pulse 1.5s ease-in-out infinite",
        }} />
        <div style={{
          height: 11, borderRadius: 6, width: "80%",
          backgroundColor: "#f1f5f9",
          animation: "notif-pulse 1.5s ease-in-out infinite 0.2s",
        }} />
        <div style={{
          height: 10, borderRadius: 4, width: "25%",
          backgroundColor: "#f1f5f9",
          animation: "notif-pulse 1.5s ease-in-out infinite 0.4s",
        }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmailNotifications() {
  const queryClient             = useQueryClient();
  const { data, isLoading }     = useListNotifications();
  const notifications           = data?.notifications || [];
  const unread                  = notifications.filter((n) => !n.isRead).length;
  const { mutate: markRead }    = useMarkNotificationRead();
  const [spinning, setSpinning] = useState(false);

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

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 650);
    refetch();
  };

  const handleMarkOne = (id) =>
    markRead({ notificationId: id }, { onSuccess: refetch });

  const handleMarkAll = () => {
    notifications.filter((n) => !n.isRead).forEach((n) =>
      markRead({ notificationId: n.id }, {})
    );
    setTimeout(refetch, 500);
  };

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes notif-slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes notif-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes notif-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .notif-action-btn:hover { background-color: #f8fafc !important; }
        .notif-mark-btn:hover   { background-color: #dbeafe !important; }
      `}</style>

      <div style={{ maxWidth: 896, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "flex-start", gap: 16,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Notifications
              </h1>
              {unread > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  padding: "2px 10px", borderRadius: 999,
                  backgroundColor: "#dc2626", color: "#fff",
                }}>
                  {unread} unread
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              Real-time alerts for email engagements and replies.{" "}
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Auto-refreshes every 30s</span>
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {/* Refresh button */}
            <button
              className="notif-action-btn"
              onClick={handleRefresh}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", fontSize: 13, fontWeight: 600,
                border: "1px solid #e2e8f0", borderRadius: 12,
                color: "#475569", backgroundColor: "#fff",
                cursor: "pointer", transition: "background-color 0.15s",
              }}
            >
              <IconRefreshCw size={14} spinning={spinning} />
              Refresh
            </button>

            {/* Mark All Read button */}
            {unread > 0 && (
              <button
                className="notif-action-btn"
                onClick={handleMarkAll}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", fontSize: 13, fontWeight: 600,
                  border: "1px solid #e2e8f0", borderRadius: 12,
                  color: "#475569", backgroundColor: "#fff",
                  cursor: "pointer", transition: "background-color 0.15s",
                }}
              >
                <IconCheckCheck size={15} />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          /* Loading skeletons instead of spinner */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>

        ) : notifications.length === 0 ? (
          /* Empty state */
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            border: "1.5px dashed #e2e8f0",
            padding: "80px 20px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <div style={{ color: "#e2e8f0", display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <IconBell size={40} color="#e2e8f0" />
            </div>
            <h3 style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>All Caught Up</h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>You don't have any new notifications.</p>
          </div>

        ) : (
          /* Notification cards */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((notif, i) => (
              <div
                key={notif.id}
                style={{
                  borderRadius: 16,
                  border: `1px solid ${notif.isRead ? "#e2e8f0" : "#bfdbfe"}`,
                  backgroundColor: notif.isRead ? "#ffffff" : "#eff6ff",
                  boxShadow: notif.isRead
                    ? "0 1px 3px rgba(0,0,0,0.06)"
                    : "0 4px 12px rgba(37,99,235,0.1)",
                  overflow: "hidden",
                  animation: `notif-slideIn 0.3s ease ${i * 0.04}s both`,
                }}
              >
                <div style={{
                  padding: "14px 20px",
                  display: "flex", gap: 16, alignItems: "center",
                }}>
                  <NotifIcon type={notif.type} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title + time */}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", gap: 12, marginBottom: 3,
                    }}>
                      <h4 style={{
                        fontSize: 14,
                        fontWeight: notif.isRead ? 500 : 700,
                        color: notif.isRead ? "#374151" : "#111827",
                        margin: 0,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {notif.title}
                      </h4>
                      <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {formatRelative(notif.createdAt)}
                      </span>
                    </div>

                    {/* Message */}
                    <p style={{
                      fontSize: 13, margin: "0 0 6px",
                      color: notif.isRead ? "#6b7280" : "#374151",
                    }}>
                      {notif.message}
                    </p>

                    {/* Client name badge */}
                    {notif.clientName && (
                      <span style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "2px 8px", borderRadius: 4,
                        fontSize: 11, fontWeight: 500,
                        backgroundColor: "#f1f5f9", color: "#475569",
                      }}>
                        {notif.clientName}
                      </span>
                    )}
                  </div>

                  {/* Mark as read button */}
                  {!notif.isRead && (
                    <button
                      className="notif-mark-btn"
                      onClick={() => handleMarkOne(notif.id)}
                      title="Mark as read"
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "none", cursor: "pointer",
                        backgroundColor: "transparent",
                        color: "#2563eb", flexShrink: 0,
                        transition: "background-color 0.15s",
                      }}
                    >
                      <IconCheck size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}