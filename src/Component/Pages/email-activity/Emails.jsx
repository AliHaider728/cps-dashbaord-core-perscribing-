import React, { useState, useMemo } from "react";
import { useListEmails } from "../../../lib/api.js";
import { Spinner } from "../../../Component/ui/spinner.jsx";
import { Search, Mail, ArrowUpRight, ArrowDownLeft, Filter, X, ChevronDown } from "lucide-react";
import { formatSmartDate } from "../../../lib/utils.js";

// ── Correct named export ──────────────────────────────────────────────────────
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

const DIRECTIONS = [
  { value: "all",      label: "All emails" },
  { value: "outbound", label: "Sent" },
  { value: "inbound",  label: "Received" },
];

export default function EmailList() {
  const { data, isLoading } = useListEmails();
  const allEmails = data?.emails || [];

  const [search, setSearch]       = useState("");
  const [direction, setDir]       = useState("all");
  const [filterOpen, setFilter]   = useState(false);
  const [composeOpen, setCompose] = useState(false);

  const filtered = useMemo(() => allEmails.filter((e) => {
    const q  = search.toLowerCase();
    const ms = !q || [e.subject, e.fromName, e.toName, e.fromEmail, e.clientName, e.bodyPreview]
      .some((v) => v?.toLowerCase().includes(q));
    const md = direction === "all" || e.direction === direction;
    return ms && md;
  }), [allEmails, search, direction]);

  const hasFilters = direction !== "all" || search !== "";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Tracking</h1>
          <p className="text-sm text-slate-500 mt-0.5">All synced Outlook communications.</p>
        </div>
        <button
          onClick={() => setCompose(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
          style={{ backgroundColor: "#2563eb" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          <Mail size={16} /> Compose Email
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails, subjects, or clients…"
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)"; }}
            onBlur={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
              onMouseEnter={e => e.currentTarget.style.color = "#374151"}
              onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setFilter((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all bg-white"
            style={hasFilters
              ? { borderColor: "#93c5fd", color: "#2563eb" }
              : { borderColor: "#e2e8f0", color: "#475569" }
            }
          >
            <Filter size={14} />
            {direction === "all" ? "Filter" : DIRECTIONS.find((d) => d.value === direction)?.label}
            <ChevronDown size={13} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-12 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {DIRECTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDir(opt.value); setFilter(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors"
                  style={direction === opt.value
                    ? { backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 600 }
                    : { color: "#475569" }
                  }
                  onMouseEnter={e => { if (direction !== opt.value) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                  onMouseLeave={e => { if (direction !== opt.value) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {opt.value === "outbound" && <ArrowUpRight size={14} style={{ color: "#2563eb" }} />}
                  {opt.value === "inbound"  && <ArrowDownLeft size={14} style={{ color: "#059669" }} />}
                  {opt.value === "all"      && <Mail size={14} className="text-slate-400" />}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setDir("all"); }}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 bg-white transition-colors"
            onMouseEnter={e => { e.currentTarget.style.color = "#374151"; e.currentTarget.style.backgroundColor = "#f8fafc"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.backgroundColor = "white"; }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {!isLoading && (
        <p className="text-xs text-slate-400">
          {filtered.length} of {allEmails.length} emails{hasFilters && " (filtered)"}
        </p>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center p-20"><Spinner className="w-10 h-10" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
          <Mail size={40} className="mx-auto mb-3" style={{ color: "#cbd5e1" }} />
          <h3 className="font-bold text-slate-900 mb-1">
            {hasFilters ? "No results found" : "Inbox Empty"}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {hasFilters
              ? "Try adjusting your search or filter."
              : "Connect your Outlook account or BCC address to start logging emails."}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setDir("all"); }}
              className="mt-4 px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 bg-white transition-colors"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((email, i) => (
            <div
              key={email.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer group overflow-hidden flex transition-all"
              style={{ animation: `fadeUp .25s ease ${i * 0.03}s both` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#93c5fd"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div
                className="w-1 shrink-0"
                style={{ backgroundColor: email.direction === "outbound" ? "#3b82f6" : "#10b981" }}
              />
              <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* From/To */}
                <div className="flex items-center gap-3 w-full sm:w-56 shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#f1f5f9" }}
                  >
                    {email.direction === "outbound"
                      ? <ArrowUpRight size={16} style={{ color: "#2563eb" }} />
                      : <ArrowDownLeft size={16} style={{ color: "#059669" }} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {email.direction === "outbound"
                        ? `To: ${email.toName   || email.toEmail}`
                        : `From: ${email.fromName || email.fromEmail}`}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatSmartDate(email.sentAt || email.receivedAt || email.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Subject + preview */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate transition-colors group-hover:text-blue-600">
                    {email.subject}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{email.bodyPreview}</p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {email.clientName && (
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {email.clientName}
                    </span>
                  )}
                  {email.openCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
                    >
                      Opened
                    </span>
                  )}
                  {email.clickCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "#fffbeb", color: "#d97706" }}
                    >
                      Clicked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Compose modal — correct export name ──────────────────────── */}
      <ComposeEmailModal isOpen={composeOpen} onClose={() => setCompose(false)} />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}