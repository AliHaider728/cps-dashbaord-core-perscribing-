// ─────────────────────────────────────────────────────────────────────────────
// lib/api.js
// Central API layer — all React Query hooks and Axios calls live here.
//
// Base URL resolution:
//   Development  →  http://localhost:4000/api   (via .env.development)
//   Production   →  https://crm-email-backend.vercel.app/api  (via .env.production)
//
// Both files are committed; Vite picks the right one automatically.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Axios Instance ──────────────────────────────────────────────────────────
// VITE_API_URL is injected by Vite at build time from the matching .env file.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,   // needed if backend uses credentials: true in CORS
});

// ─── Helper: normalise MongoDB _id → id ─────────────────────────────────────
// MongoDB returns `_id`; the frontend expects `id` everywhere.
function normalize(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(normalize);
  const { _id, __v, ...rest } = obj;
  return { id: String(_id ?? rest.id), ...rest };
}

// Recursively normalise all array values inside a response object.
// Special-cases `recentActivity` which is a nested array inside stats.
function normalizeResponse(data) {
  if (Array.isArray(data)) return data.map(normalize);
  const result = {};
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val)) {
      result[key] = val.map(normalize);
    } else if (typeof val === "object" && val !== null) {
      result[key] = normalize(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

// GET /api/stats/overview — dashboard summary cards + recent activity feed
export function useGetStatsOverview() {
  return useQuery({
    queryKey: ["stats", "overview"],
    queryFn: async () => {
      const { data } = await api.get("/stats/overview");
      return normalizeResponse(data);
    },
  });
}

// ─── Clients ─────────────────────────────────────────────────────────────────

// GET /api/clients?search=&accountManagerId=&page=&limit=
export function useListClients(params) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: async () => {
      const { data } = await api.get("/clients", { params });
      return normalizeResponse(data);
    },
  });
}

// GET /api/clients/:id
export function useGetClient(id) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${id}`);
      return normalize(data.client ?? data);
    },
    enabled: !!id,
  });
}

// POST /api/clients  — create a new PCN / Surgery client
export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/clients", data);
      return normalize(res.data.client ?? res.data);
    },
    onSuccess: () => {
      // Refetch the clients list after a new one is created
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// ─── Timeline ────────────────────────────────────────────────────────────────

// GET /api/clients/:clientId/timeline?type=&page=&limit=
export function useGetClientTimeline(clientId, params) {
  return useQuery({
    queryKey: ["timeline", clientId, params],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/timeline`, { params });
      return normalizeResponse(data);
    },
    enabled: !!clientId,
  });
}

// POST /api/notes  — manually log an internal note on a client
export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/notes", data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Refresh only the timeline for the affected client
      queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
    },
  });
}

// ─── Emails ───────────────────────────────────────────────────────────────────

// GET /api/emails?clientId=&accountManagerId=&status=&page=&limit=
export function useListEmails(params) {
  return useQuery({
    queryKey: ["emails", params],
    queryFn: async () => {
      const { data } = await api.get("/emails", { params });
      return normalizeResponse(data);
    },
  });
}

// POST /api/emails  — log a sent or received email (used by ComposeEmailModal)
// Body: { subject, direction, toEmail, toName, fromEmail, fromName,
//         body, bodyPreview, clientId?, accountManagerId?, accountManagerName? }
export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/emails", data);
      return normalize(res.data.email ?? res.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      // Refresh the client's timeline if the email was linked to one
      if (variables.data?.clientId) {
        queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ─── Team ─────────────────────────────────────────────────────────────────────

// GET /api/team — list all team members with their sync status
export function useListTeamMembers() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await api.get("/team");
      return normalizeResponse(data);
    },
  });
}

// POST /api/outlook/sync — trigger Outlook mailbox sync for a team member
// Body: { memberId }
export function useTriggerOutlookSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/outlook/sync", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

// GET /api/notifications?unreadOnly=true&page=&limit=
export function useListNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return normalizeResponse(data);
    },
  });
}

// POST /api/notifications/:notificationId/read  — mark a single notification read
// NOTE: backend uses POST (not PATCH) for this route
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }) => {
      // Backend route: POST /api/notifications/:id/read
      const res = await api.post(`/notifications/${notificationId}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}