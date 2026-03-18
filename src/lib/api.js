import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Axios Instance 
const BASE_URL = import.meta.env.VITE_API_URL || "https://crm-email-backend.vercel.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Helper: normalize MongoDB _id → id  
function normalize(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(normalize);
  const { _id, __v, ...rest } = obj;
  return { id: String(_id ?? rest.id ?? ""), ...rest };
}

function normalizeResponse(data) {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(normalize);
  const result = {};
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val)) {
      result[key] = val.map(normalize);
    } else if (val && typeof val === "object" && !(val instanceof Date)) {
      result[key] = normalize(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ─── Stats  
export function useGetStatsOverview() {
  return useQuery({
    queryKey: ["stats", "overview"],
    queryFn: async () => {
      const { data } = await api.get("/stats/overview");
      // recentActivity is an array — normalize separately
      return {
        ...data,
        recentActivity: (data.recentActivity || []).map(normalize),
      };
    },
    staleTime: 60_000,
  });
}

// ─── Clients ───────
export function useListClients(params) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: async () => {
      const { data } = await api.get("/clients", { params });
      return {
        ...data,
        clients: (data.clients || []).map(normalize),
      };
    },
  });
}

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

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/clients", data);
      return normalize(res.data.client ?? res.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clientId) => {
      await api.delete(`/clients/${clientId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
}

// ─── Timeline ──────
export function useGetClientTimeline(clientId, params) {
  return useQuery({
    queryKey: ["timeline", clientId, params],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/timeline`, { params });
      return {
        ...data,
        entries: (data.entries || []).map(normalize),
      };
    },
    enabled: !!clientId,
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/notes", data);
      return normalize(res.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
    },
  });
}

// ─── Emails ────────
export function useListEmails(params) {
  return useQuery({
    queryKey: ["emails", params],
    queryFn: async () => {
      const { data } = await api.get("/emails", { params });
      return {
        ...data,
        emails: (data.emails || []).map(normalize),
      };
    },
  });
}

export function useGetEmail(emailId) {
  return useQuery({
    queryKey: ["emails", emailId],
    queryFn: async () => {
      const { data } = await api.get(`/emails/${emailId}`);
      return normalize(data);
    },
    enabled: !!emailId,
  });
}

// ─── FIX: Email Engagements      ──────
// Backend returns: { engagements: [ { type: 'open'|'click'|'download', ...} ] }
// EmailList/EmailDrawer expects: { opens[], clicks[], downloads[], summary{} }
export function useGetEmailEngagements(emailId) {
  return useQuery({
    queryKey: ["email-engagements", emailId],
    queryFn: async () => {
      const { data } = await api.get(`/emails/${emailId}/engagements`);
      const all = (data.engagements || []).map(normalize);

      const opens     = all.filter((e) => e.type === "open");
      const clicks    = all.filter((e) => e.type === "click");
      const downloads = all.filter((e) => e.type === "download");

      // Unique openers by email address
      const uniqueOpeners = new Set(opens.map((e) => e.openedByEmail).filter(Boolean)).size;

      return {
        engagements: all,
        opens,
        clicks,
        downloads,
        // FIX: summary object that EmailDrawer reads
        summary: {
          openCount:      opens.length,
          clickCount:     clicks.length,
          downloadCount:  downloads.length,
          uniqueOpeners,
        },
      };
    },
    enabled:   !!emailId,
    staleTime: 30_000,
  });
}

// ─── Track Email (manual, API-based)     ─────
export function useTrackEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ emailId, type, openedByEmail, linkUrl, fileName }) => {
      // FIX: backend expects 'type' not 'eventType'
      const res = await api.post(`/emails/${emailId}/track`, {
        type,
        openedByEmail,
        linkUrl,
        fileName,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-engagements", variables.emailId] });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── FIX: Send Email — correct route is POST /emails not /emails/send  
export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      // FIX: route was /emails/send — correct route is POST /emails
      const res = await api.post("/emails", {
        ...data,
        direction:  "outbound",
        syncMethod: "manual",
        sentAt:     new Date().toISOString(),
        isRead:     true,
      });
      return normalize(res.data.email ?? res.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      if (variables.data?.clientId) {
        queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ─── Team  ─
export function useListTeamMembers() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await api.get("/team");
      return {
        ...data,
        members: (data.members || []).map(normalize),
      };
    },
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/team", data);
      return normalize(res.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  });
}

// ─── Outlook Sync ──
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
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// FIX: returns the real Microsoft OAuth URL for redirecting the browser
export function getOutlookAuthUrl(memberId) {
  return `${BASE_URL}/outlook/auth/${memberId}`;
}

// ─── Notifications ─
export function useListNotifications(params) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const { data } = await api.get("/notifications", { params });
      return {
        ...data,
        notifications: (data.notifications || []).map(normalize),
      };
    },
    refetchInterval: 30_000,   // auto-poll every 30s
  });
}

// ─── FIX: method was PATCH, backend expects POST /:id/read   ──
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }) => {
      // FIX: was api.patch — backend route is POST /notifications/:id/read
      const res = await api.post(`/notifications/${notificationId}/read`);
      return normalize(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── Mark ALL notifications read (bulk helper)    ─────
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds) => {
      await Promise.all(
        notificationIds.map((id) => api.post(`/notifications/${id}/read`))
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}