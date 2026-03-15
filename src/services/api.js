// ─────────────────────────────────────────────────────────────────────────────
// CPS CRM — Central API Service
// All backend calls go through here. Token is read from localStorage.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api';

const getHeaders = () => {
  const token = localStorage.getItem('cps_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

const get   = (url)        => fetch(url, { headers: getHeaders() }).then(handleRes);
const post  = (url, body)  => fetch(url, { method:'POST',   headers:getHeaders(), body:JSON.stringify(body) }).then(handleRes);
const put   = (url, body)  => fetch(url, { method:'PUT',    headers:getHeaders(), body:JSON.stringify(body) }).then(handleRes);
const patch = (url, body)  => fetch(url, { method:'PATCH',  headers:getHeaders(), body:JSON.stringify(body) }).then(handleRes);
const del   = (url)        => fetch(url, { method:'DELETE', headers:getHeaders() }).then(handleRes);
const q     = (p = {})     => { const s = new URLSearchParams(p).toString(); return s ? `?${s}` : ''; };

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (creds) => post(`${BASE_URL}/auth/login`,    creds),
  register: (data)  => post(`${BASE_URL}/auth/register`, data),
  getMe:    ()      => get(`${BASE_URL}/auth/me`),
};

// ── USERS ─────────────────────────────────────────────────────────────────────
export const userAPI = {
  getAll:          (params)        => get(`${BASE_URL}/users${q(params)}`),
  getById:         (id)            => get(`${BASE_URL}/users/${id}`),
  update:          (id, data)      => put(`${BASE_URL}/users/${id}`, data),
  toggleActive:    (id)            => patch(`${BASE_URL}/users/${id}/toggle-active`),
  changePassword:  (id, data)      => patch(`${BASE_URL}/users/${id}/change-password`, data),
};

// ── PCNs ──────────────────────────────────────────────────────────────────────
export const pcnAPI = {
  getAll:   (params)    => get(`${BASE_URL}/pcns${q(params)}`),
  getById:  (id)        => get(`${BASE_URL}/pcns/${id}`),
  getStats: (id)        => get(`${BASE_URL}/pcns/${id}/stats`),
  create:   (data)      => post(`${BASE_URL}/pcns`, data),
  update:   (id, data)  => put(`${BASE_URL}/pcns/${id}`, data),
  delete:   (id)        => del(`${BASE_URL}/pcns/${id}`),

  updateOnboarding: (id, data)      => patch(`${BASE_URL}/pcns/${id}/onboarding`, data),
  updateContacts:   (id, contacts)  => patch(`${BASE_URL}/pcns/${id}/contacts`, { contacts }),

  getContactHistory: (id, params)   => get(`${BASE_URL}/pcns/${id}/contact-history${q(params)}`),
  addContactHistory: (id, entry)    => post(`${BASE_URL}/pcns/${id}/contact-history`, entry),
  toggleStar:        (pid, hid)     => patch(`${BASE_URL}/pcns/${pid}/contact-history/${hid}/star`),

  addRestricted:    (id, data)  => post(`${BASE_URL}/pcns/${id}/restricted-clinicians`, data),
  removeRestricted: (id, rcId)  => del(`${BASE_URL}/pcns/${id}/restricted-clinicians/${rcId}`),

  addMeeting: (id, data) => post(`${BASE_URL}/pcns/${id}/monthly-meetings`, data),

  getDocs:   (id)       => get(`${BASE_URL}/pcns/${id}/documents`),
  uploadDoc: (id, data) => post(`${BASE_URL}/pcns/${id}/documents`, data),
};

// ── PRACTICES ─────────────────────────────────────────────────────────────────
export const practiceAPI = {
  getAll:   (params)    => get(`${BASE_URL}/practices${q(params)}`),
  getById:  (id)        => get(`${BASE_URL}/practices/${id}`),
  create:   (data)      => post(`${BASE_URL}/practices`, data),
  update:   (id, data)  => put(`${BASE_URL}/practices/${id}`, data),
  delete:   (id)        => del(`${BASE_URL}/practices/${id}`),

  updateOnboarding:   (id, data)      => patch(`${BASE_URL}/practices/${id}/onboarding`, data),
  updateSystemAccess: (id, data)      => patch(`${BASE_URL}/practices/${id}/system-access`, data),
  updateContacts:     (id, contacts)  => patch(`${BASE_URL}/practices/${id}/contacts`, { contacts }),

  getContactHistory: (id, params)   => get(`${BASE_URL}/practices/${id}/contact-history${q(params)}`),
  addContactHistory: (id, entry)    => post(`${BASE_URL}/practices/${id}/contact-history`, entry),
  toggleStar:        (pid, hid)     => patch(`${BASE_URL}/practices/${pid}/contact-history/${hid}/star`),

  addRestricted:    (id, data)  => post(`${BASE_URL}/practices/${id}/restricted-clinicians`, data),
  removeRestricted: (id, rcId)  => del(`${BASE_URL}/practices/${id}/restricted-clinicians/${rcId}`),

  getDocs:   (id)       => get(`${BASE_URL}/practices/${id}/documents`),
  uploadDoc: (id, data) => post(`${BASE_URL}/practices/${id}/documents`, data),
};

// ── CLINICIANS ────────────────────────────────────────────────────────────────
export const clinicianAPI = {
  getAll:   (params)    => get(`${BASE_URL}/clinicians${q(params)}`),
  getById:  (id)        => get(`${BASE_URL}/clinicians/${id}`),
  create:   (data)      => post(`${BASE_URL}/clinicians`, data),
  update:   (id, data)  => put(`${BASE_URL}/clinicians/${id}`, data),
  delete:   (id)        => del(`${BASE_URL}/clinicians/${id}`),

  updateCompliance: (id, data)    => patch(`${BASE_URL}/clinicians/${id}/compliance`, data),
  assignPCN:        (id, data)    => patch(`${BASE_URL}/clinicians/${id}/assign-pcn`, data),
  assignPractice:   (id, data)    => patch(`${BASE_URL}/clinicians/${id}/assign-practice`, data),

  getSystemAccess:    (id)        => get(`${BASE_URL}/clinicians/${id}/system-access`),
  addSystemAccess:    (id, data)  => post(`${BASE_URL}/clinicians/${id}/system-access`, data),
  updateSystemAccess: (id, accessId, data) => patch(`${BASE_URL}/clinicians/${id}/system-access/${accessId}`, data),

  getStats: () => get(`${BASE_URL}/clinicians/stats/overview`),
};

// ── HIERARCHY — ICB + FEDERATION ─────────────────────────────────────────────
export const hierarchyAPI = {
  getICBs:           ()           => get(`${BASE_URL}/icbs`),
  createICB:         (data)       => post(`${BASE_URL}/icbs`, data),
  updateICB:         (id, data)   => put(`${BASE_URL}/icbs/${id}`, data),
  getFederations:    (icbId)      => get(`${BASE_URL}/federations${icbId ? `?icb=${icbId}` : ''}`),
  createFederation:  (data)       => post(`${BASE_URL}/federations`, data),
  updateFederation:  (id, data)   => put(`${BASE_URL}/federations/${id}`, data),
};

// ── REPORTS / ROLL-UP ─────────────────────────────────────────────────────────
export const reportsAPI = {
  // ICB → Federation → PCN → Practices full roll-up
  hierarchyRollup:    (icbId)   => get(`${BASE_URL}/reports/hierarchy-rollup${icbId ? `?icbId=${icbId}` : ''}`),
  // Practices → PCN roll-up with comms history
  pcnRollup:          (pcnId)   => get(`${BASE_URL}/reports/pcn-rollup/${pcnId}`),
  // Contract status breakdown + renewing soon
  contractOverview:   ()        => get(`${BASE_URL}/reports/contract-overview`),
  // Onboarding % across all PCNs + Practices
  onboardingOverview: ()        => get(`${BASE_URL}/reports/onboarding-overview`),
  // Clinician placement across PCNs + Practices
  clinicianPlacement: ()        => get(`${BASE_URL}/reports/clinician-placement`),
};

export default { authAPI, userAPI, pcnAPI, practiceAPI, clinicianAPI, hierarchyAPI, reportsAPI };