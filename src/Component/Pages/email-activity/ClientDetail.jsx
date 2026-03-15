import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetClient, useGetClientTimeline, useAddNote } from "../../../lib/api.js";
import { Spinner } from "../../ui/spinner.jsx";
import {
  ArrowLeft, Mail, Phone, Calendar,
  ArrowUpRight, ArrowDownLeft, StickyNote,
  MousePointerClick, Send,
} from "lucide-react";
import { formatSmartDate, getInitials } from "../../../lib/utils.js";

// ── Correct named export ──────────────────────────────────────────────────────
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

const TABS = [
  { value: "all",            label: "All" },
  { value: "email_sent",     label: "Sent" },
  { value: "email_received", label: "Received" },
  { value: "note",           label: "Notes" },
  { value: "engagement",     label: "Engagement" },
];

const TYPE_CFG = {
  email_sent:     { bg: "#eff6ff", color: "#2563eb", Icon: ArrowUpRight },
  email_received: { bg: "#ecfdf5", color: "#059669", Icon: ArrowDownLeft },
  engagement:     { bg: "#f5f3ff", color: "#7c3aed", Icon: MousePointerClick },
  note:           { bg: "#fffbeb", color: "#d97706", Icon: StickyNote },
};

function InfoRow({ Icon, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#f1f5f9" }}
      >
        <Icon size={14} style={{ color: "#64748b" }} />
      </div>
      <span className="text-sm text-slate-600 font-medium">{value}</span>
    </div>
  );
}

export default function EmailClientDetail() {
  const { id: clientId } = useParams();
  const navigate         = useNavigate();

  const [note,          setNote]     = useState("");
  const [filter,        setFilter]   = useState("all");
  const [composeOpen, setCompose]    = useState(false);

  const { data: client,   isLoading: loadingClient }                    = useGetClient(clientId);
  const { data: timeline, isLoading: loadingTimeline, refetch }         = useGetClientTimeline(clientId, { type: filter });
  const { mutate: addNote, isPending: addingNote }                      = useAddNote();

  const entries = timeline?.entries || [];

  const handleAddNote = () => {
    if (!note.trim()) return;
    addNote(
      { data: { clientId, content: note } },
      { onSuccess: () => { setNote(""); refetch(); } }
    );
  };

  if (loadingClient) {
    return <div className="flex justify-center p-20"><Spinner className="w-10 h-10" /></div>;
  }

  if (!client) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Mail size={40} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
        <h3 className="font-bold text-slate-900 mb-2">Client not found</h3>
        <p className="text-sm text-slate-500 mb-4">
          This client may have been removed or the URL is incorrect.
        </p>
        <button
          onClick={() => navigate("/email-activity/clients")}
          className="text-sm font-semibold transition-colors"
          style={{ color: "#2563eb" }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
        >
          ← Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Back + header ─────────────────────────────────────────────── */}
      <div>
        <button
          onClick={() => navigate("/email-activity/clients")}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-3 transition-colors"
          onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
          onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
        >
          <ArrowLeft size={15} /> Back to Clients
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}
            >
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: "#1e293b" }}
                >
                  {client.pcnNumber}
                </span>
                {client.surgeryName && (
                  <span className="text-sm text-slate-500">{client.surgeryName}</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCompose(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
            style={{ backgroundColor: "#2563eb" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            <Mail size={15} /> Email Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-24">

          {/* Contact info */}
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            style={{ borderTop: "4px solid #2563eb" }}
          >
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Contact Information</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <InfoRow Icon={Mail}     value={client.email || "No email provided"} />
              <InfoRow Icon={Phone}    value={client.phone || "No phone provided"} />
              <InfoRow Icon={Calendar} value={`Added ${new Date(client.createdAt).toLocaleDateString("en-GB")}`} />
            </div>
          </div>

          {/* Account manager */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Account Manager</p>
            </div>
            <div className="px-5 py-4">
              {client.accountManagerName ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
                  >
                    {getInitials(client.accountManagerName)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{client.accountManagerName}</p>
                    <p className="text-xs text-slate-500">Primary Contact</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic text-center py-3 rounded-xl border border-dashed border-slate-200">
                  No account manager assigned
                </p>
              )}
            </div>
          </div>

          {/* Activity summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Activity Summary</p>
            </div>
            <div className="px-5 py-4 space-y-2.5">
              {[
                { label: "Total events",     value: timeline?.total || 0,                                      color: "#0f172a" },
                { label: "Emails sent",      value: entries.filter((e) => e.type === "email_sent").length,     color: "#2563eb" },
                { label: "Replies received", value: entries.filter((e) => e.type === "email_received").length, color: "#059669" },
                { label: "Notes logged",     value: entries.filter((e) => e.type === "note").length,           color: "#d97706" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: note + timeline ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Note input */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex gap-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <StickyNote size={15} style={{ color: "#64748b" }} />
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Log a note or internal update…"
                  rows={4}
                  className="w-full p-4 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl resize-none outline-none transition-all leading-relaxed border border-slate-200"
                  style={{ backgroundColor: "#f8fafc" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)"; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={handleAddNote}
                    disabled={!note.trim() || addingNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#2563eb" }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#1d4ed8"; }}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
                  >
                    {addingNote ? <Spinner className="w-3.5 h-3.5" /> : <Send size={12} />}
                    Log Note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline header + filter tabs */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                Activity Timeline
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {timeline?.total || 0}
                </span>
              </h3>

              <div
                className="flex items-center gap-1 rounded-xl p-1"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={
                      filter === tab.value
                        ? { backgroundColor: "white", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                        : { backgroundColor: "transparent", color: "#64748b" }
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingTimeline ? (
              <div className="py-10 flex justify-center"><Spinner className="w-8 h-8" /></div>
            ) : entries.length > 0 ? (
              <div
                className="relative pl-8 space-y-6 pb-8"
                style={{ borderLeft: "2px solid #e2e8f0" }}
              >
                {entries.map((entry, i) => {
                  const cfg = TYPE_CFG[entry.type] || TYPE_CFG.note;
                  return (
                    <div
                      key={entry.id}
                      className="relative group"
                      style={{ animation: `slideIn 0.3s ease ${i * 0.06}s both` }}
                    >
                      {/* Timeline dot */}
                      <div
                        className="absolute -left-[43px] top-1 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        <cfg.Icon size={14} />
                      </div>

                      <div
                        className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#93c5fd"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                      >
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900">
                                {entry.type === "email_sent"
                                  ? "You sent an email"
                                  : entry.type === "email_received"
                                  ? `${entry.fromName || entry.fromEmail || "Client"} replied`
                                  : entry.type === "engagement"
                                  ? "Client Engagement"
                                  : "Note Added"}
                              </span>
                              {entry.type === "email_sent" && entry.openCount > 0 && (
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                                >
                                  Opened
                                </span>
                              )}
                            </div>
                            {entry.subject && (
                              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                                Subject: {entry.subject}
                              </p>
                            )}
                          </div>
                          <span
                            className="text-[11px] font-medium text-slate-400 px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{ backgroundColor: "#f1f5f9" }}
                          >
                            {formatSmartDate(entry.occurredAt)}
                          </span>
                        </div>

                        <div
                          className="mt-2 text-sm text-slate-600 p-3 rounded-lg whitespace-pre-wrap leading-relaxed"
                          style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}
                        >
                          {entry.content || entry.preview || "—"}
                        </div>

                        {(entry.type === "email_sent" || entry.type === "email_received") && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Logged via Outlook Sync</span>
                            <button
                              className="text-xs font-semibold transition-colors"
                              style={{ color: "#2563eb" }}
                              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                            >
                              View Full Email
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="py-14 text-center rounded-2xl border border-dashed border-slate-200"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <Mail size={36} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
                <p className="font-medium text-slate-500 text-sm">No activity found.</p>
                <p className="text-xs text-slate-400 mt-1">
                  {filter !== "all"
                    ? "Try switching to 'All'."
                    : "Send an email or add a note to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*
        ── ComposeEmailModal ─────────────────────────────────────────────────
        Props use the names defined in ComposeEmailModal.jsx:
          defaultToEmail  (not defaultTo)
          defaultToName
          defaultClientId
      */}
      <ComposeEmailModal
        isOpen={composeOpen}
        onClose={() => setCompose(false)}
        defaultClientId={clientId}
        defaultToEmail={client.email || ""}
        defaultToName={client.name}
      />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}