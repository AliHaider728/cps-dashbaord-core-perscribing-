import React, { useState, useMemo } from "react";
import { useListEmails } from "../../../lib/api.js";
import { Search, Mail, ArrowUpRight, ArrowDownLeft, Filter, X, ChevronDown } from "lucide-react";
import { formatSmartDate } from "../../../lib/utils.js";
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

// ─── CSS var helpers ──────────────────────────────────────────────────────────
const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"), border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

const BRAND      = "#6673FF";
const BRAND_DARK = "#2F2CCB";
const BRAND_GRAD = `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`;

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL = `
  @keyframes el-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .el-input {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.875rem;
    outline: none;
    width: 100%;
    transition: border-color .2s, box-shadow .2s;
  }
  .el-input::placeholder { color: var(--text-muted); }
  .el-input:focus { border-color: ${BRAND}; box-shadow: 0 0 0 4px rgba(102,115,255,0.12); }

  .el-email-row {
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    transition: box-shadow .2s, border-color .2s;
    cursor: pointer;
    animation: fadeUp .25s ease both;
  }
  .el-email-row:hover { border-color: ${BRAND}55 !important; box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; }
  .el-email-row:hover .el-subject { color: ${BRAND}; }

  .el-filter-btn {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: border-color .15s, color .15s;
  }
  .el-filter-btn:hover { border-color: ${BRAND}; color: ${BRAND}; }

  .el-dropdown {
    position: absolute; right:0; top: calc(100% + 8px);
    z-index: 30; min-width: 170px;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.18);
    overflow: hidden;
  }
  .el-dd-item { width:100%; display:flex; align-items:center; gap:8px; padding:10px 16px; font-size:0.875rem; text-align:left; transition:background-color .15s; }
  .el-dd-item:hover { background-color: var(--bg-primary); }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function EmailSkeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {[0,1,2,3,4].map((i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:14, backgroundColor: cv("--bg-secondary"), border:`1px solid ${cv("--border-color")}`, animation:`el-pulse 1.5s ease infinite ${i*0.1}s` }}>
          <div style={{ width:36, height:36, borderRadius:"50%", backgroundColor: cv("--border-color"), flexShrink:0 }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ width:"45%", height:13, borderRadius:5, backgroundColor: cv("--border-color") }} />
            <div style={{ width:"70%", height:11, borderRadius:5, backgroundColor: cv("--border-color"), opacity:.6 }} />
          </div>
          <div style={{ width:60, height:22, borderRadius:999, backgroundColor: cv("--border-color"), opacity:.5 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DIRECTIONS = [
  { value:"all",      label:"All emails" },
  { value:"outbound", label:"Sent"       },
  { value:"inbound",  label:"Received"   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailList() {
  const { data, isLoading } = useListEmails();
  const allEmails = data?.emails || [];

  const [search,      setSearch]  = useState("");
  const [direction,   setDir]     = useState("all");
  const [filterOpen,  setFilter]  = useState(false);
  const [composeOpen, setCompose] = useState(false);

  const filtered = useMemo(() => allEmails.filter((e) => {
    const q  = search.toLowerCase();
    const ms = !q || [e.subject, e.fromName, e.toName, e.fromEmail, e.clientName, e.bodyPreview].some((v) => v?.toLowerCase().includes(q));
    const md = direction === "all" || e.direction === direction;
    return ms && md;
  }), [allEmails, search, direction]);

  const hasFilters = direction !== "all" || search !== "";

  return (
    <div className="space-y-5">
      <style>{GLOBAL}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background: BRAND_GRAD, boxShadow:"0 4px 10px rgba(102,115,255,0.35)" }}>
              <Mail size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Email Tracking</h1>
          </div>
          <p className="ml-9 text-sm" style={textMuted}>All synced Outlook communications.</p>
        </div>
        <button
          onClick={() => setCompose(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-px"
          style={{ background: BRAND_GRAD, boxShadow:"0 4px 14px rgba(102,115,255,0.35)" }}
        >
          <Mail size={15} /> Compose Email
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1 flex items-center">
          <Search size={15} className="absolute left-3 pointer-events-none" style={textMuted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails, subjects, or clients…"
            className="el-input"
            style={{ paddingLeft:36, paddingRight: search ? 32 : 14 }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5" style={textMuted}><X size={14} /></button>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setFilter((v) => !v)} className="el-filter-btn"
            style={hasFilters ? { borderColor: BRAND, color: BRAND, backgroundColor: cv("--bg-secondary") } : {}}>
            <Filter size={14} />
            {direction === "all" ? "Filter" : DIRECTIONS.find((d) => d.value === direction)?.label}
            <ChevronDown size={13} />
          </button>

          {filterOpen && (
            <div className="el-dropdown">
              {DIRECTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDir(opt.value); setFilter(false); }}
                  className="el-dd-item"
                  style={direction === opt.value ? { backgroundColor: "rgba(102,115,255,0.1)", color: BRAND, fontWeight:700 } : textSecondary}
                >
                  {opt.value === "outbound" && <ArrowUpRight size={14} style={{ color: BRAND }} />}
                  {opt.value === "inbound"  && <ArrowDownLeft size={14} style={{ color:"#10b981" }} />}
                  {opt.value === "all"      && <Mail size={14} style={textMuted} />}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setDir("all"); }}
            className="p-2.5 rounded-xl transition-colors"
            style={{ ...surfaceStyle }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = cv("--border-color"); e.currentTarget.style.color = cv("--text-muted"); }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {!isLoading && (
        <p className="text-xs" style={textMuted}>{filtered.length} of {allEmails.length} emails{hasFilters && " (filtered)"}</p>
      )}

      {/* List */}
      {isLoading ? (
        <EmailSkeleton />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ ...bgStyle, border:`1px dashed ${cv("--border-color")}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: cv("--border-color") }}>
            <Mail size={26} style={textMuted} />
          </div>
          <h3 className="font-bold mb-1" style={textPrimary}>{hasFilters ? "No results found" : "Inbox Empty"}</h3>
          <p className="text-sm max-w-xs mx-auto" style={textSecondary}>
            {hasFilters ? "Try adjusting your search or filter." : "Connect your Outlook account or BCC address to start logging emails."}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setDir("all"); }}
              className="mt-4 px-4 py-2 text-sm font-semibold rounded-xl transition-colors"
              style={{ ...surfaceStyle, ...textSecondary }}
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
              className="el-email-row"
              style={{ ...surfaceStyle, animationDelay:`${i*0.03}s` }}
            >
              {/* Direction accent bar */}
              <div className="w-1 shrink-0 rounded-l-xl" style={{ background: email.direction === "outbound" ? BRAND_GRAD : "linear-gradient(180deg,#10b981,#0d9488)" }} />

              <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* From/To */}
                <div className="flex items-center gap-3 w-full sm:w-56 shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cv("--border-color") }}>
                    {email.direction === "outbound"
                      ? <ArrowUpRight size={16} style={{ color: BRAND }} />
                      : <ArrowDownLeft size={16} style={{ color:"#10b981" }} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate" style={textPrimary}>
                      {email.direction === "outbound"
                        ? `To: ${email.toName   || email.toEmail}`
                        : `From: ${email.fromName || email.fromEmail}`}
                    </p>
                    <p className="text-[11px] mt-0.5" style={textMuted}>
                      {formatSmartDate(email.sentAt || email.receivedAt || email.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Subject + Preview */}
                <div className="flex-1 min-w-0">
                  <h4 className="el-subject text-sm font-semibold truncate transition-colors" style={textPrimary}>{email.subject}</h4>
                  <p className="text-xs truncate mt-0.5" style={textSecondary}>{email.bodyPreview}</p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {email.clientName && (
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: cv("--border-color"), ...textMuted }}>{email.clientName}</span>
                  )}
                  {email.openCount > 0 && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor:"rgba(139,92,246,0.12)", color:"#8b5cf6" }}>Opened</span>
                  )}
                  {email.clickCount > 0 && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor:"rgba(245,158,11,0.12)", color:"#f59e0b" }}>Clicked</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ComposeEmailModal isOpen={composeOpen} onClose={() => setCompose(false)} />
    </div>
  );
}