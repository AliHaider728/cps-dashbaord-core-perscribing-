import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday, isValid } from "date-fns";

// ─── Tailwind class merger ────────────────────────────────────────────────────
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ─── Get 2-letter initials from a name ───────────────────────────────────────
export function getInitials(name) {
  if (!name || typeof name !== "string") return "??";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Smart date: "Today at 2:30 PM" / "Yesterday at …" / "Mar 5, 2024 at …" ──
export function formatSmartDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (!isValid(date)) return "—";

  if (isToday(date))     return `Today at ${format(date, "h:mm a")}`;
  if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

// ─── Relative time: "3 minutes ago" ──────────────────────────────────────────
export function formatRelative(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (!isValid(date)) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}