import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5175/api' });

// ─── ICB ───────────────
export const getAllICBs = () => API.get('/clients/icbs');
export const createICB = (data) => API.post('/clients/icbs', data);
export const updateICB = (id, data) => API.put(`/clients/icbs/${id}`, data);

// ─── FEDERATIONS ───────
export const getAllFederations = (icbId) => API.get('/clients/federations', { params: icbId ? { icbId } : {} });
export const createFederation = (data) => API.post('/clients/federations', data);
export const getFederationById = (id) => API.get(`/clients/federations/${id}`);
export const updateFederation = (id, data) => API.put(`/clients/federations/${id}`, data);

// ─── PCN ─────
export const getAllPCNs = (params) => API.get('/clients/pcns', { params });
export const createPCN = (data) => API.post('/clients/pcns', data);
export const getPCNById = (id) => API.get(`/clients/pcns/${id}`);
export const updatePCN = (id, data) => API.put(`/clients/pcns/${id}`, data);
export const getPCNContactHistory = (id) => API.get(`/clients/pcns/${id}/contact-history`);
export const addPCNContactHistory = (id, data) => API.post(`/clients/pcns/${id}/contact-history`, data);
export const toggleStarEntry = (pcnId, entryId) => API.put(`/clients/pcns/${pcnId}/contact-history/${entryId}/star`);
export const addPCNRestrictedClinician = (id, data) => API.post(`/clients/pcns/${id}/restricted-clinicians`, data);
export const removePCNRestrictedClinician = (pcnId, clinicianId) => API.delete(`/clients/pcns/${pcnId}/restricted-clinicians/${clinicianId}`);

// ─── PRACTICE 
export const getAllPractices = (pcnId) => API.get('/clients/practices', { params: pcnId ? { pcnId } : {} });
export const createPractice = (data) => API.post('/clients/practices', data);
export const getPracticeById = (id) => API.get(`/clients/practices/${id}`);
export const updatePractice = (id, data) => API.put(`/clients/practices/${id}`, data);
export const addPracticeRestrictedClinician = (id, data) => API.post(`/clients/practices/${id}/restricted-clinicians`, data);
export const addPracticeContactHistory = (id, data) => API.post(`/clients/practices/${id}/contact-history`, data);

// ─── HIERARCHY OVERVIEW 
export const getHierarchyOverview = () => API.get('/clients/hierarchy');