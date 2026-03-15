import React, { useState, useMemo, useEffect } from "react";
import { useListEmails, useGetEmailEngagements } from "../../../lib/api.js";
import {
  Search, Mail, ArrowUpRight, ArrowDownLeft, Filter, X,
  ChevronDown, MailOpen, MousePointerClick, Download,
  Clock, User, Tag, Building2, ExternalLink, Copy, CheckCircle2,
} from "lucide-react";
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
  @keyframes el-pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes drawerIn  { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }

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
    transition: box-shadow .2s, border-color .2s, transform .15s;
    cursor: pointer;
    animation: fadeUp .25s ease both;
  }
  .el-email-row:hover {
    border-color: ${BRAND}55 !important;
    box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important;
    transform: translateY(-1px);
  }
  .el-email-row:hover .el-subject { color: ${BRAND}; }
  .el-email-row.el-selected {
    border-color: ${BRAND} !important;
    box-shadow: 0 0 0 3px rgba(102,115,255,0.18), 0 6px 20px rgba(102,115,255,0.15) !important;
  }

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
    white-space: nowrap;
  }
  .el-filter-btn:hover { border-color: ${BRAND}; color: ${BRAND}; }

  .el-dropdown {
    position: absolute; right:0; top: calc(100% + 8px);
    z-index: 50; min-width: 170px;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.18);
    overflow: hidden;
  }
  .el-dd-item {
    width:100%; display:flex; align-items:center; gap:8px;
    padding:10px 16px; font-size:0.875rem; text-align:left;
    transition:background-color .15s;
  }
  .el-dd-item:hover { background-color: var(--bg-primary); }

  /* ── Drawer ── */
  .el-drawer-overlay {
    position: fixed; inset: 0; z-index: 40;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(3px);
    animation: overlayIn .2s ease both;
  }
  .el-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(540px, 100vw);
    z-index: 50;
    overflow-y: auto;
    animation: drawerIn .25s cubic-bezier(.22,.61,.36,1) both;
    display: flex; flex-direction: column;
  }
  .el-drawer-close {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: background-color .15s;
    flex-shrink: 0;
  }
  .el-drawer-close:hover { background-color: var(--bg-primary); }

  .el-meta-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 999px;
    font-size: 0.75rem; font-weight: 600;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
  }

  .el-copy-btn {
    padding: 4px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 700;
    display: flex; align-items: center; gap: 4px;
    transition: background-color .15s, color .15s;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
  }
  .el-copy-btn:hover { border-color: ${BRAND}; color: ${BRAND}; }

  .el-engage-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 999px;
    font-size: 0.75rem; font-weight: 700;
  }
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

// ─── Who Row (single engagement event) ────────────────────────────────────────
function WhoRow({ e, type }) {
  const deviceIcon = e.device === "mobile" ? "📱" : e.device === "tablet" ? "📱" : "🖥";
  const label = type === "open"
    ? `${deviceIcon} ${e.device || "Unknown"} · ${e.os || ""} · ${e.browser || ""}`
    : type === "click"
    ? `${deviceIcon} ${e.linkUrl ? e.linkUrl.replace(/^https?:\/\//, "").slice(0, 40) : "Unknown link"}`
    : `📄 ${e.fileName || "File"} · ${e.device || "Unknown"}`;

  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:`1px solid ${cv("--border-color")}` }}>
      <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(102,115,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"0.7rem", fontWeight:700, color:BRAND }}>
        {(e.openedByEmail || e.openedByName || "?").slice(0,2).toUpperCase()}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ ...textPrimary, fontSize:"0.8rem", fontWeight:600, marginBottom:2 }}>
          {e.openedByName || e.openedByEmail || "Unknown recipient"}
        </p>
        {e.openedByEmail && e.openedByName && (
          <p style={{ ...textMuted, fontSize:"0.7rem", marginBottom:2 }}>{e.openedByEmail}</p>
        )}
        <p style={{ ...textMuted, fontSize:"0.7rem" }}>{label}</p>
        {e.location && <p style={{ ...textMuted, fontSize:"0.7rem" }}>📍 {e.location}</p>}
      </div>
      <span style={{ ...textMuted, fontSize:"0.65rem", whiteSpace:"nowrap", flexShrink:0 }}>
        {e.occurredAt ? new Date(e.occurredAt).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) : ""}
      </span>
    </div>
  );
}

// ─── Email Detail Drawer ──────────────────────────────────────────────────────
function EmailDrawer({ email, onClose }) {
  const [copied, setCopied] = useState(false);

  // Fetch WHO opened detail from backend
  const { data: engData, isLoading: engLoading } = useGetEmailEngagements(email?.id);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!email) return null;

  const isOutbound = email.direction === "outbound";
  const dirGrad    = isOutbound ? BRAND_GRAD : "linear-gradient(135deg,#10b981,#0d9488)";

  const copyEmail = (val) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Use real counts from engagement data if available, fallback to email counts
  const openCount     = engData?.summary?.openCount     ?? email.openCount     ?? 0;
  const clickCount    = engData?.summary?.clickCount    ?? email.clickCount    ?? 0;
  const downloadCount = engData?.summary?.downloadCount ?? email.downloadCount ?? 0;
  const uniqueOpeners = engData?.summary?.uniqueOpeners ?? email.uniqueOpenCount ?? 0;

  const ENGAGEMENT = [
    openCount     > 0 && { label:`Opened ×${openCount}`,       Icon:MailOpen,          bg:"rgba(139,92,246,0.12)", color:"#8b5cf6" },
    clickCount    > 0 && { label:`Clicked ×${clickCount}`,     Icon:MousePointerClick, bg:"rgba(245,158,11,0.12)", color:"#f59e0b" },
    downloadCount > 0 && { label:`Downloaded ×${downloadCount}`, Icon:Download,        bg:"rgba(16,185,129,0.12)", color:"#10b981" },
    uniqueOpeners > 0 && { label:`${uniqueOpeners} unique`,    Icon:User,              bg:"rgba(102,115,255,0.12)", color:BRAND    },
  ].filter(Boolean);

  return (
    <>
      {/* Overlay */}
      <div className="el-drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="el-drawer" style={{ backgroundColor: cv("--bg-secondary"), borderLeft:`1px solid ${cv("--border-color")}` }}>

        {/* Header */}
        <div style={{ background: dirGrad, padding:"20px 22px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, backgroundColor:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isOutbound ? <ArrowUpRight size={15} color="white" /> : <ArrowDownLeft size={15} color="white" />}
              </div>
              <span style={{ color:"rgba(255,255,255,0.85)", fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                {isOutbound ? "Outbound Email" : "Inbound Email"}
              </span>
            </div>
            <button className="el-drawer-close" onClick={onClose} style={{ color:"rgba(255,255,255,0.8)" }}>
              <X size={18} />
            </button>
          </div>
          <h2 style={{ color:"white", fontSize:"1.0625rem", fontWeight:800, lineHeight:1.35, marginBottom:6 }}>
            {email.subject || "(No Subject)"}
          </h2>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.75rem" }}>
            {formatSmartDate(email.sentAt || email.receivedAt || email.createdAt)}
          </span>
        </div>

        {/* Engagement pills */}
        {ENGAGEMENT.length > 0 && (
          <div style={{ padding:"12px 22px", borderBottom:`1px solid ${cv("--border-color")}`, display:"flex", gap:8, flexWrap:"wrap", backgroundColor: cv("--bg-primary") }}>
            {ENGAGEMENT.map((e) => (
              <span key={e.label} className="el-engage-pill" style={{ backgroundColor:e.bg, color:e.color }}>
                <e.Icon size={12} /> {e.label}
              </span>
            ))}
          </div>
        )}

        {/* WHO opened / clicked / downloaded */}
        {isOutbound && (openCount > 0 || clickCount > 0 || downloadCount > 0) && (
          <div style={{ padding:"16px 22px", borderBottom:`1px solid ${cv("--border-color")}` }}>
            {engLoading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ height:12, borderRadius:4, width:"40%", backgroundColor:cv("--border-color"), animation:"el-pulse 1.5s ease infinite" }} />
                {[0,1].map(i => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", backgroundColor:cv("--border-color"), flexShrink:0, animation:`el-pulse 1.5s ease infinite ${i*0.1}s` }} />
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                      <div style={{ height:11, borderRadius:4, width:"60%", backgroundColor:cv("--border-color"), animation:`el-pulse 1.5s ease infinite ${i*0.1}s` }} />
                      <div style={{ height:9,  borderRadius:4, width:"80%", backgroundColor:cv("--border-color"), animation:`el-pulse 1.5s ease infinite ${i*0.15}s`, opacity:.6 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Opens */}
                {engData?.opens?.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <p style={{ ...textMuted, fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
                      Who Opened
                    </p>
                    {engData.opens.map((e, i) => <WhoRow key={e.id || i} e={e} type="open" />)}
                  </div>
                )}
                {/* Clicks */}
                {engData?.clicks?.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <p style={{ ...textMuted, fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
                      Links Clicked
                    </p>
                    {engData.clicks.map((e, i) => <WhoRow key={e.id || i} e={e} type="click" />)}
                  </div>
                )}
                {/* Downloads */}
                {engData?.downloads?.length > 0 && (
                  <div>
                    <p style={{ ...textMuted, fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
                      Files Downloaded
                    </p>
                    {engData.downloads.map((e, i) => <WhoRow key={e.id || i} e={e} type="download" />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Meta info */}
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${cv("--border-color")}`, display:"flex", flexDirection:"column", gap:12 }}>

          {/* From */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background: dirGrad, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <User size={14} color="white" />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ ...textMuted, fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>From</p>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <p style={{ ...textPrimary, fontSize:"0.875rem", fontWeight:600 }}>
                  {email.fromName || email.fromEmail || "Unknown"}
                </p>
                {email.fromEmail && (
                  <button className="el-copy-btn" onClick={() => copyEmail(email.fromEmail)} style={textMuted}>
                    {copied ? <><CheckCircle2 size={10} style={{ color:"#10b981" }} /> Copied</> : <><Copy size={10} /> {email.fromEmail}</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* To */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", backgroundColor: cv("--border-color"), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Mail size={14} style={textMuted} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ ...textMuted, fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>To</p>
              <p style={{ ...textPrimary, fontSize:"0.875rem", fontWeight:600 }}>
                {email.toName || email.toEmail || "Unknown"}
              </p>
              {email.toEmail && email.toEmail !== email.toName && (
                <p style={{ ...textMuted, fontSize:"0.75rem", marginTop:1 }}>{email.toEmail}</p>
              )}
            </div>
          </div>

          {/* Chips row */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4 }}>
            {email.clientName && (
              <span className="el-meta-chip" style={textSecondary}>
                <Building2 size={11} style={{ color:BRAND }} /> {email.clientName}
              </span>
            )}
            {email.accountManagerName && (
              <span className="el-meta-chip" style={textSecondary}>
                <User size={11} style={{ color:"#10b981" }} /> {email.accountManagerName}
              </span>
            )}
            {email.syncMethod && (
              <span className="el-meta-chip" style={textSecondary}>
                <Tag size={11} style={{ color:"#f59e0b" }} /> {email.syncMethod === "bcc" ? "BCC Tracked" : "Outlook Sync"}
              </span>
            )}
            <span className="el-meta-chip" style={textSecondary}>
              <Clock size={11} style={textMuted} /> {formatSmartDate(email.sentAt || email.receivedAt || email.createdAt)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, padding:"20px 22px" }}>
          <p style={{ ...textMuted, fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>
            Message Body
          </p>
          <div style={{
            backgroundColor: cv("--bg-primary"),
            border:`1px solid ${cv("--border-color")}`,
            borderRadius:12, padding:"16px 18px",
            fontSize:"0.875rem", lineHeight:1.7,
            whiteSpace:"pre-wrap", minHeight:160,
            ...textSecondary,
          }}>
            {email.body || email.bodyPreview || email.preview || (
              <span style={{ ...textMuted, fontStyle:"italic" }}>No message body available.</span>
            )}
          </div>

          {/* Outlook sync note */}
          <div style={{ marginTop:16, padding:"10px 14px", borderRadius:10, backgroundColor:"rgba(102,115,255,0.06)", border:`1px solid ${BRAND}22`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
            <span style={{ color:BRAND, fontSize:"0.75rem", fontWeight:600 }}>
              📨 Logged via {email.syncMethod === "bcc" ? "BCC Tracking" : "Outlook Inbox Sync"}
            </span>
            {email.outlookMessageId && (
              <button
                className="el-copy-btn"
                style={{ color:BRAND, borderColor:`${BRAND}44` }}
                onClick={() => copyEmail(email.outlookMessageId)}
              >
                <ExternalLink size={10} /> View in Outlook
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailList() {
  const { data, isLoading } = useListEmails();
  const allEmails = data?.emails || [];

  const [search,      setSearch]   = useState("");
  const [direction,   setDir]      = useState("all");
  const [filterOpen,  setFilter]   = useState(false);
  const [composeOpen, setCompose]  = useState(false);
  const [selectedEmail, setSelected] = useState(null);

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
          <p className="ml-9 text-sm" style={textMuted}>All synced Outlook communications. Click any email to view details.</p>
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
        <p className="text-xs" style={textMuted}>
          {filtered.length} of {allEmails.length} emails{hasFilters && " (filtered)"}
          {selectedEmail && <span style={{ color:BRAND, marginLeft:8 }}>· 1 selected</span>}
        </p>
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
          {filtered.map((email, i) => {
            const isOut      = email.direction === "outbound";
            const isSelected = selectedEmail?.id === email.id;
            return (
              <div
                key={email.id}
                className={`el-email-row ${isSelected ? "el-selected" : ""}`}
                style={{ ...surfaceStyle, animationDelay:`${i*0.03}s` }}
                onClick={() => setSelected(isSelected ? null : email)}
              >
                {/* Direction accent bar */}
                <div className="w-1 shrink-0 rounded-l-xl" style={{ background: isOut ? BRAND_GRAD : "linear-gradient(180deg,#10b981,#0d9488)" }} />

                <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* From/To avatar + name */}
                  <div className="flex items-center gap-3 w-full sm:w-60 shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: isOut ? BRAND_GRAD : "linear-gradient(135deg,#10b981,#0d9488)" }}>
                      {isOut
                        ? <ArrowUpRight size={16} color="white" />
                        : <ArrowDownLeft size={16} color="white" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate" style={textPrimary}>
                        {isOut
                          ? `To: ${email.toName || email.toEmail || "—"}`
                          : `From: ${email.fromName || email.fromEmail || "—"}`}
                      </p>
                      <p className="text-[11px] mt-0.5" style={textMuted}>
                        {formatSmartDate(email.sentAt || email.receivedAt || email.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Subject + Preview */}
                  <div className="flex-1 min-w-0">
                    <h4 className="el-subject text-sm font-semibold truncate transition-colors" style={textPrimary}>{email.subject || "(No Subject)"}</h4>
                    <p className="text-xs truncate mt-0.5" style={textSecondary}>{email.bodyPreview}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {email.clientName && (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: cv("--border-color"), ...textMuted }}>
                        <Building2 size={9} /> {email.clientName}
                      </span>
                    )}
                    {email.openCount > 0 && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor:"rgba(139,92,246,0.12)", color:"#8b5cf6" }}>
                        <MailOpen size={9} /> Opened
                      </span>
                    )}
                    {email.clickCount > 0 && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor:"rgba(245,158,11,0.12)", color:"#f59e0b" }}>
                        <MousePointerClick size={9} /> Clicked
                      </span>
                    )}
                    {/* Click to open hint */}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor:"rgba(102,115,255,0.08)", color:BRAND }}>
                      View →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Email Detail Drawer */}
      <EmailDrawer email={selectedEmail} onClose={() => setSelected(null)} />

      <ComposeEmailModal isOpen={composeOpen} onClose={() => setCompose(false)} />
    </div>
  );
}