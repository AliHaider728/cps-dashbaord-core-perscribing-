import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetClient, useGetClientTimeline, useAddNote } from "../../../lib/api.js";
import {
  ArrowLeft, Mail, Phone, Calendar, ArrowUpRight, ArrowDownLeft,
  StickyNote, MousePointerClick, Send, MailOpen, Download,
  Clock, User, Activity, ChevronRight,
} from "lucide-react";
import { formatSmartDate, getInitials } from "../../../lib/utils.js";
import { ComposeEmailModal } from "../../layout/ComposeEmailModal.jsx";

const cv = (v) => `var(${v})`;
const surfaceStyle  = { backgroundColor: cv("--bg-secondary"), border: `1px solid ${cv("--border-color")}` };
const bgStyle       = { backgroundColor: cv("--bg-primary") };
const textPrimary   = { color: cv("--text-primary") };
const textSecondary = { color: cv("--text-secondary") };
const textMuted     = { color: cv("--text-muted") };

const BRAND      = "#6673FF";
const BRAND_DARK = "#2F2CCB";
const BRAND_GRAD = `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`;

const GLOBAL = `
  @keyframes cd-pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes cd-bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  .cd-dot { width:5px;height:5px;border-radius:50%;background:white;display:inline-block;animation:cd-bounce 1.2s ease infinite }
  .cd-dot:nth-child(2){animation-delay:.16s}.cd-dot:nth-child(3){animation-delay:.32s}

  .cd-tab-active { background-color:var(--bg-secondary); color:var(--text-primary); box-shadow:0 1px 4px rgba(0,0,0,0.15); font-weight:700; }
  .cd-tab-idle   { background:transparent; color:var(--text-muted); font-weight:600; }
  .cd-tab-idle:hover { color:var(--text-secondary); }

  .cd-back { background:transparent; transition:color .15s; }
  .cd-back:hover { color:${BRAND}; }

  .cd-textarea {
    background-color:var(--bg-primary); border:1px solid var(--border-color);
    color:var(--text-primary); border-radius:12px; padding:14px;
    font-size:0.875rem; resize:none; outline:none; width:100%;
    transition:border-color .2s, box-shadow .2s; line-height:1.6;
  }
  .cd-textarea::placeholder { color:var(--text-muted); }
  .cd-textarea:focus { border-color:${BRAND}; box-shadow:0 0 0 4px rgba(102,115,255,0.12); }

  .tl-icon-email_sent     { background:rgba(102,115,255,0.12); }
  .tl-icon-email_received { background:rgba(16,185,129,0.12);  }
  .tl-icon-engagement     { background:rgba(139,92,246,0.12);  }
  .tl-icon-note           { background:rgba(245,158,11,0.12);  }
  [data-theme="light"] .tl-icon-email_sent     { background:#EEF0FF; }
  [data-theme="light"] .tl-icon-email_received { background:#d1fae5; }
  [data-theme="light"] .tl-icon-engagement     { background:#ede9fe; }
  [data-theme="light"] .tl-icon-note           { background:#fef3c7; }

  .tl-body { background-color:var(--bg-primary); border:1px solid var(--border-color); border-radius:12px; transition:border-color .2s, transform .15s; }
  .tl-body:hover { border-color:${BRAND}55; transform:translateX(2px); }

  .tl-content-block {
    background-color:var(--bg-secondary); border:1px solid var(--border-color);
    border-radius:10px; padding:12px; font-size:0.875rem;
    white-space:pre-wrap; line-height:1.6;
  }
`;

function PageSkeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:56, height:56, borderRadius:16, backgroundColor:cv("--border-color"), animation:"cd-pulse 1.5s ease infinite" }} />
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ width:180, height:20, borderRadius:6, backgroundColor:cv("--border-color"), animation:"cd-pulse 1.5s ease infinite" }} />
          <div style={{ width:120, height:14, borderRadius:6, backgroundColor:cv("--border-color"), animation:"cd-pulse 1.5s ease infinite .2s", opacity:.6 }} />
        </div>
      </div>
      {[0,1,2].map((i) => (
        <div key={i} style={{ height:90, borderRadius:16, backgroundColor:cv("--border-color"), animation:`cd-pulse 1.5s ease infinite ${i*0.15}s`, opacity:.7 }} />
      ))}
    </div>
  );
}

function TimelineLoader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingTop:8 }}>
      {[0,1,2].map((i) => (
        <div key={i} style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", backgroundColor:cv("--border-color"), flexShrink:0, animation:`cd-pulse 1.5s ease infinite ${i*0.1}s` }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ height:13, borderRadius:6, width:"60%", backgroundColor:cv("--border-color"), animation:`cd-pulse 1.5s ease infinite ${i*0.1}s` }} />
            <div style={{ height:11, borderRadius:6, width:"85%", backgroundColor:cv("--border-color"), animation:`cd-pulse 1.5s ease infinite ${i*0.1+0.15}s`, opacity:.6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DotsLoader() {
  return (
    <span style={{ display:"flex", gap:3, alignItems:"center" }}>
      <span className="cd-dot" /><span className="cd-dot" /><span className="cd-dot" />
    </span>
  );
}

function InfoRow({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor:cv("--border-color") }}>
        <Icon size={14} style={textMuted} />
      </div>
      <div>
        {label && <p className="text-[10px] font-bold uppercase tracking-wide" style={textMuted}>{label}</p>}
        <span className="text-sm font-medium" style={textSecondary}>{value}</span>
      </div>
    </div>
  );
}

const TABS = [
  { value:"all",            label:"All"        },
  { value:"email_sent",     label:"Sent"       },
  { value:"email_received", label:"Received"   },
  { value:"note",           label:"Notes"      },
  { value:"engagement",     label:"Engagement" },
];

const TYPE_CFG = {
  email_sent:     { color:BRAND,     Icon:ArrowUpRight      },
  email_received: { color:"#10b981", Icon:ArrowDownLeft     },
  engagement:     { color:"#8b5cf6", Icon:MousePointerClick },
  note:           { color:"#f59e0b", Icon:StickyNote        },
};

export default function EmailClientDetail() {
  const { id: clientId } = useParams();
  const navigate = useNavigate();

  const [note,        setNote]    = useState("");
  const [filter,      setFilter]  = useState("all");
  const [composeOpen, setCompose] = useState(false);

  const { data: client,   isLoading: loadingClient }            = useGetClient(clientId);
  const { data: timeline, isLoading: loadingTimeline, refetch } = useGetClientTimeline(clientId, { type:filter });
  const { mutate: addNote, isPending: addingNote }              = useAddNote();

  const entries = timeline?.entries || [];

  const handleAddNote = () => {
    if (!note.trim()) return;
    addNote({ data:{ clientId, content:note } }, { onSuccess:() => { setNote(""); refetch(); } });
  };

  if (loadingClient) return <><style>{GLOBAL}</style><PageSkeleton /></>;

  if (!client) {
    return (
      <>
        <style>{GLOBAL}</style>
        <div className="p-12 text-center rounded-2xl" style={surfaceStyle}>
          <h3 className="font-bold mb-2" style={textPrimary}>Client not found</h3>
          <button onClick={() => navigate("/email-activity/clients")} className="text-sm font-semibold" style={{ color:BRAND }}>
            ← Back to Clients
          </button>
        </div>
      </>
    );
  }

  // Engagement counts from entries
  const openCount     = entries.filter(e => e.type==="engagement" && e.engagementType==="open").length;
  const clickCount    = entries.filter(e => e.type==="engagement" && e.engagementType==="click").length;
  const downloadCount = entries.filter(e => e.type==="engagement" && e.engagementType==="download").length;

  return (
    <div className="space-y-6">
      <style>{GLOBAL}</style>

      {/* Back + Header */}
      <div>
        <button onClick={() => navigate("/email-activity/clients")} className="cd-back flex items-center gap-1.5 text-sm font-semibold mb-3" style={textMuted}>
          <ArrowLeft size={15} /> Back to Clients
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shadow-lg shrink-0"
              style={{ background:BRAND_GRAD, boxShadow:"0 8px 20px rgba(102,115,255,0.4)" }}>
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>{client.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background:BRAND_GRAD }}>{client.pcnNumber}</span>
                {client.surgeryName && <span className="text-sm" style={textMuted}>{client.surgeryName}</span>}
              </div>
            </div>
          </div>
          <button onClick={() => setCompose(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-px"
            style={{ background:BRAND_GRAD, boxShadow:"0 4px 14px rgba(102,115,255,0.35)" }}>
            <Mail size={15} /> Email Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24">

          {/* Contact Info */}
          <div className="rounded-2xl overflow-hidden" style={{ ...surfaceStyle, borderTop:`3px solid ${BRAND}` }}>
            <div className="px-5 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
              <p className="font-bold text-sm" style={textPrimary}>Contact Information</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <InfoRow Icon={Mail}     label="Email" value={client.email || "No email provided"} />
              <InfoRow Icon={Phone}    label="Phone" value={client.phone || "No phone provided"} />
              <InfoRow Icon={Calendar} label="Added" value={new Date(client.createdAt).toLocaleDateString("en-GB")} />
            </div>
          </div>

          {/* Account Manager */}
          <div className="rounded-2xl overflow-hidden" style={surfaceStyle}>
            <div className="px-5 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
              <p className="font-bold text-sm" style={textPrimary}>Account Manager</p>
            </div>
            <div className="px-5 py-4">
              {client.accountManagerName ? (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ ...bgStyle, border:`1px solid ${cv("--border-color")}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0" style={{ background:BRAND_GRAD }}>
                    {getInitials(client.accountManagerName)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={textPrimary}>{client.accountManagerName}</p>
                    <p className="text-xs" style={textMuted}>Primary Contact</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-center py-3 rounded-xl" style={{ ...textMuted, border:`1px dashed ${cv("--border-color")}` }}>
                  No account manager assigned
                </p>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="rounded-2xl overflow-hidden" style={surfaceStyle}>
            <div className="px-5 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
              <p className="font-bold text-sm flex items-center gap-2" style={textPrimary}>
                <Activity size={14} style={{ color:BRAND }} /> Activity Summary
              </p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label:"Total events",     value:timeline?.total || 0,                                       color:cv("--text-primary") },
                { label:"Emails sent",      value:entries.filter(e => e.type==="email_sent").length,          color:BRAND               },
                { label:"Replies received", value:entries.filter(e => e.type==="email_received").length,      color:"#10b981"           },
                { label:"Notes logged",     value:entries.filter(e => e.type==="note").length,                color:"#f59e0b"           },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center text-sm">
                  <span style={textMuted}>{s.label}</span>
                  <span className="font-bold" style={{ color:s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Tracking */}
          <div className="rounded-2xl overflow-hidden" style={surfaceStyle}>
            <div className="px-5 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
              <p className="font-bold text-sm" style={textPrimary}>Email Engagement</p>
            </div>
            <div className="px-5 py-4 grid grid-cols-3 gap-2">
              {[
                { Icon:MailOpen,         label:"Opens",     value:openCount,     color:"#8b5cf6", bg:"rgba(139,92,246,0.1)" },
                { Icon:MousePointerClick, label:"Clicks",   value:clickCount,    color:"#f59e0b", bg:"rgba(245,158,11,0.1)" },
                { Icon:Download,          label:"Downloads",value:downloadCount, color:"#10b981", bg:"rgba(16,185,129,0.1)" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor:s.bg, border:`1px solid ${s.color}22` }}>
                  <s.Icon size={14} style={{ color:s.color, margin:"0 auto 4px" }} />
                  <p className="text-lg font-extrabold" style={{ color:s.color }}>{s.value}</p>
                  <p className="text-[9px] font-bold uppercase" style={textMuted}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Note + Timeline */}
        <div className="lg:col-span-2 space-y-5">

          {/* Note Input */}
          <div className="rounded-2xl p-5" style={surfaceStyle}>
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={15} style={{ color:BRAND }} />
              <p className="font-bold text-sm" style={textPrimary}>Log a Note</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add an internal note, update, or follow-up reminder…"
                  rows={4}
                  className="cd-textarea"
                />
                <div className="absolute bottom-3 right-3">
                  <button onClick={handleAddNote} disabled={!note.trim() || addingNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background:BRAND_GRAD }}>
                    {addingNote ? <DotsLoader /> : <><Send size={12} /> Log Note</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2" style={textPrimary}>
                Activity Timeline
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor:cv("--border-color"), ...textMuted }}>
                  {timeline?.total || 0}
                </span>
              </h3>
              <div className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor:cv("--bg-primary") }}>
                {TABS.map((tab) => (
                  <button key={tab.value} onClick={() => setFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filter===tab.value ? "cd-tab-active" : "cd-tab-idle"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingTimeline ? (
              <TimelineLoader />
            ) : entries.length > 0 ? (
              <div className="relative pl-8 space-y-5 pb-8" style={{ borderLeft:`2px solid ${cv("--border-color")}` }}>
                {entries.map((entry, i) => {
                  const cfg     = TYPE_CFG[entry.type] || TYPE_CFG.note;
                  const typeKey = entry.type || "note";
                  return (
                    <div key={entry.id} className="relative group" style={{ animation:`slideIn 0.3s ease ${i*0.06}s both` }}>
                      <div
                        className={`tl-icon-${typeKey} absolute -left-[43px] top-1 w-9 h-9 rounded-full flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform`}
                        style={{ color:cfg.color, border:`2px solid ${cv("--bg-secondary")}` }}>
                        <cfg.Icon size={14} />
                      </div>

                      <div className="tl-body p-5">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm" style={textPrimary}>
                                {entry.type==="email_sent"     ? "Email Sent"
                                  : entry.type==="email_received" ? `Reply from ${entry.fromName || entry.fromEmail || "Client"}`
                                  : entry.type==="engagement"     ? `Client ${entry.engagementType === "open" ? "Opened Email" : entry.engagementType === "click" ? "Clicked Link" : "Downloaded File"}`
                                  : "Note Added"}
                              </span>
                              {/* Engagement badges on email_sent */}
                              {entry.type==="email_sent" && entry.openCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor:"rgba(139,92,246,0.12)", color:"#8b5cf6" }}>
                                  <MailOpen size={9} /> Opened ×{entry.openCount}
                                </span>
                              )}
                              {entry.type==="email_sent" && entry.clickCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor:"rgba(245,158,11,0.12)", color:"#f59e0b" }}>
                                  <MousePointerClick size={9} /> Clicked ×{entry.clickCount}
                                </span>
                              )}
                            </div>
                            {entry.subject && (
                              <p className="text-xs font-semibold mt-0.5" style={textSecondary}>Subject: {entry.subject}</p>
                            )}
                            {entry.accountManagerName && (
                              <p className="text-xs mt-0.5 flex items-center gap-1" style={textMuted}>
                                <User size={9} /> {entry.accountManagerName}
                              </p>
                            )}
                          </div>
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1" style={{ backgroundColor:cv("--border-color"), ...textMuted }}>
                            <Clock size={9} /> {formatSmartDate(entry.occurredAt)}
                          </span>
                        </div>

                        <div className="tl-content-block mt-2" style={textSecondary}>
                          {entry.content || entry.preview || "—"}
                        </div>

                        {(entry.type==="email_sent" || entry.type==="email_received") && (
                          <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
                            <span className="text-[11px] flex items-center gap-1" style={textMuted}>
                              {entry.syncMethod === "bcc" ? "📨 BCC Tracked" : "📥 Outlook Sync"}
                            </span>
                            <button className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color:BRAND }}
                              onClick={() => setCompose(true)}
                              onMouseEnter={e => e.currentTarget.style.textDecoration="underline"}
                              onMouseLeave={e => e.currentTarget.style.textDecoration="none"}>
                              Reply <ChevronRight size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-14 text-center rounded-2xl" style={{ ...bgStyle, border:`1px dashed ${cv("--border-color")}` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor:cv("--border-color") }}>
                  <Mail size={24} style={textMuted} />
                </div>
                <p className="font-medium text-sm" style={textSecondary}>No activity found.</p>
                <p className="text-xs mt-1" style={textMuted}>
                  {filter !== "all" ? "Try switching to 'All'." : "Send an email or log a note to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ComposeEmailModal
        isOpen={composeOpen}
        onClose={() => setCompose(false)}
        defaultClientId={clientId}
        defaultToEmail={client.email || ""}
        defaultToName={client.name}
      />
    </div>
  );
}