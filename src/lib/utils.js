// src/lib/utils.js

/**
 * Smart date formatter:
 * - Today    → "2:34 PM"
 * - Yesterday → "Yesterday"
 * - This week → "Mon, 2:34 PM"
 * - This year → "12 Mar"
 * - Older     → "12 Mar 2023"
 */
export function formatSmartDate(dateInput) {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  const now       = new Date();
  const diffMs    = now - date;
  const diffMins  = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays  = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1)  return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24 && date.getDate() === now.getDate())
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 1) return "Yesterday";

  if (diffDays < 7)
    return date.toLocaleDateString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" });

  if (date.getFullYear() === now.getFullYear())
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * formatRelative — alias of formatSmartDate
 * Used by EmailDashboard and EmailNotifications
 */
export function formatRelative(dateInput) {
  return formatSmartDate(dateInput);
}

/**
 * Get initials from a full name — max 2 characters
 * e.g. "Alice Johnson" → "AJ"
 */
export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

/**
 * Truncate string to maxLen with ellipsis
 */
export function truncate(str = "", maxLen = 80) {
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

/**
 * Format file size bytes → "245 KB" / "1.2 MB"
 */
export function formatFileSize(bytes = 0) {
  if (bytes < 1024)      return `${bytes} B`;
  if (bytes < 1_048_576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

/**
 * Wrap a plain URL into a CRM tracking URL
 */
export function wrapTrackingLink(url, emailId, recipientEmail) {
  const base = import.meta.env.VITE_API_URL || "https://crm-email-backend.vercel.app/api";
  return `${base}/track/click/${emailId}?url=${encodeURIComponent(url)}&email=${encodeURIComponent(recipientEmail)}`;
}

/**
 * Build pixel tracking img tag for email HTML
 */
export function buildTrackingPixel(emailId, recipientEmail) {
  const base = import.meta.env.VITE_API_URL || "https://crm-email-backend.vercel.app/api";
  return `<img src="${base}/track/open/${emailId}/${encodeURIComponent(recipientEmail)}" width="1" height="1" style="display:none" alt="" />`;
}