import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { useListNotifications } from "../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";

// ─── Internal polling hook ────────────────────────────────────────────────────
function useNotificationPolling({ intervalMs = 30000, onNew } = {}) {
  const queryClient = useQueryClient();
  const { data }    = useListNotifications();
  const prevCount   = useRef(null);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  // Poll on interval + re-fetch when tab becomes visible
  useEffect(() => {
    const id = setInterval(refetch, intervalMs);
    const onVisible = () => { if (document.visibilityState === "visible") refetch(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVisible); };
  }, [intervalMs, refetch]);

  // Fire onNew when unread count increases
  useEffect(() => {
    const list  = data?.notifications ?? [];
    const count = list.filter((n) => !n.isRead).length;
    if (prevCount.current !== null && count > prevCount.current) {
      const latest = list.find((n) => !n.isRead);
      onNew?.(count - prevCount.current, latest?.title ?? "New notification");
    }
    prevCount.current = count;
  }, [data, onNew]);
}

// ─── Toast component ──────────────────────────────────────────────────────────
export function NotificationToast() {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  useNotificationPolling({
    intervalMs: 30000,
    onNew: (count, title) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((p) => [...p, { id, title, count }]);
      // Auto-dismiss after 6 s
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 6000);
    },
  });

  const dismiss = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          style={{ animation: "toastSlideUp 0.2s ease both" }}
        >
          {/* Progress bar that shrinks over 6 s */}
          <div
            className="h-0.5"
            style={{
              backgroundColor: "#2563eb",
              animation: "toastShrink 6s linear forwards",
            }}
          />

          <div className="flex items-start gap-3 p-4">
            {/* Bell icon */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <Bell size={15} style={{ color: "#2563eb" }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{toast.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {toast.count} new alert{toast.count > 1 ? "s" : ""}
              </p>
              <button
                onClick={() => { dismiss(toast.id); navigate("/email-activity/notifications"); }}
                className="text-xs font-semibold mt-1 block transition-colors"
                style={{ color: "#2563eb" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >
                View notifications →
              </button>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => dismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 transition-colors shrink-0"
              onMouseEnter={e => e.currentTarget.style.color = "#374151"}
              onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}