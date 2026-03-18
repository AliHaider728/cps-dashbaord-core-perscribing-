import React, { useState } from "react";
import { useListTeamMembers, useTriggerOutlookSync } from "../../../lib/api.js";
import {
  Copy, RefreshCw, CheckCircle2, XCircle, Mail, Users,
  UserPlus, Wifi, Shield, Info, X, Clock, ArrowUpRight, ArrowDownLeft, Bell,
} from "lucide-react";
import { getInitials, formatSmartDate } from "../../../lib/utils.js";
import { OutlookConnectModal } from "../../layout/OutlookConnectModal.jsx";

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
  @keyframes et-pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes et-bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(8px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes modalIn   { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ot-spin   { to{transform:rotate(360deg)} }

  .etd { width:5px;height:5px;border-radius:50%;display:inline-block;animation:et-bounce 1.2s ease infinite }
  .etd:nth-child(2){animation-delay:.16s}.etd:nth-child(3){animation-delay:.32s}

  .et-input {
    background-color:var(--bg-secondary); border:1px solid var(--border-color);
    color:var(--text-primary); border-radius:12px; padding:10px 14px;
    font-size:0.875rem; width:100%; outline:none;
    transition:border-color .2s, box-shadow .2s;
  }
  .et-input::placeholder { color:var(--text-muted); }
  .et-input:focus { border-color:${BRAND}; box-shadow:0 0 0 4px rgba(102,115,255,0.12); }

  .et-ghost { background:transparent; transition:background-color .15s; border-radius:10px; }
  .et-ghost:hover { background-color:var(--bg-primary); }

  .et-outline-btn {
    background-color:var(--bg-secondary); border:1px solid var(--border-color);
    color:var(--text-secondary); border-radius:10px; padding:6px 12px;
    font-size:0.75rem; font-weight:600;
    display:flex; align-items:center; gap:5px;
    transition:border-color .15s, color .15s, background-color .15s;
    white-space:nowrap;
  }
  .et-outline-btn:hover { border-color:${BRAND}; color:${BRAND}; background-color:var(--bg-primary); }
  .et-outline-btn:disabled { opacity:0.5; cursor:not-allowed; }

  .et-role-btn {
    width:100%; display:flex; align-items:flex-start; gap:12px; padding:14px;
    border-radius:12px; border:2px solid var(--border-color); text-align:left;
    transition:border-color .15s, background-color .15s;
    background:transparent;
  }
  .et-role-btn:hover { border-color:${BRAND}44; }

  .et-card { transition:transform .2s, box-shadow .2s; }
  .et-card:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.12); }

  .et-bcc-code {
    flex:1; padding:10px 12px; border-radius:10px;
    font-size:0.7rem; word-break:break-all; font-family:monospace; line-height:1.5;
    background:#0f172a; color:#34d399; border:1px solid rgba(52,211,153,0.2);
    user-select:all;
  }
`;

function TeamSkeleton() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
      {[0,1].map((i) => (
        <div key={i} style={{ borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:16, animation:`et-pulse 1.5s ease infinite ${i*0.2}s`, ...surfaceStyle }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", backgroundColor:cv("--border-color") }} />
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ width:"60%", height:14, borderRadius:5, backgroundColor:cv("--border-color") }} />
              <div style={{ width:"80%", height:11, borderRadius:5, backgroundColor:cv("--border-color"), opacity:.6 }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ height:64, borderRadius:12, backgroundColor:cv("--border-color"), opacity:.5 }} />
            <div style={{ height:64, borderRadius:12, backgroundColor:cv("--border-color"), opacity:.5 }} />
          </div>
          <div style={{ height:40, borderRadius:8, backgroundColor:cv("--border-color"), opacity:.4 }} />
        </div>
      ))}
    </div>
  );
}

function DotsLoader({ color = "white" }) {
  return (
    <span style={{ display:"flex", gap:3, alignItems:"center" }}>
      <span className="etd" style={{ background:color }} />
      <span className="etd" style={{ background:color }} />
      <span className="etd" style={{ background:color }} />
    </span>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────
function InviteModal({ isOpen, onClose }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("account_manager");
  const [done,  setDone]  = useState(false);

  const ROLES = [
    { id:"account_manager", label:"Account Manager", desc:"Manages client emails & BCC tracking", Icon:Users,  grad:BRAND_GRAD,                            active_bg:"rgba(102,115,255,0.1)", active_border:BRAND     },
    { id:"admin",           label:"Admin",           desc:"Full access to all modules",           Icon:Shield, grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", active_bg:"rgba(139,92,246,0.1)", active_border:"#8b5cf6" },
    { id:"viewer",          label:"Viewer",          desc:"Read-only access to activity",         Icon:Info,   grad:"linear-gradient(135deg,#64748b,#475569)", active_bg:"rgba(100,116,139,0.1)",active_border:"#64748b" },
  ];

  const reset = () => { setName(""); setEmail(""); setRole("account_manager"); setDone(false); };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:"rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-0" style={{ backdropFilter:"blur(4px)" }} onClick={() => { reset(); onClose(); }} />
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ ...surfaceStyle, animation:"modalIn .18s ease both" }}>
        {done ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor:"rgba(16,185,129,0.12)" }}>
              <CheckCircle2 size={28} style={{ color:"#10b981" }} />
            </div>
            <h3 className="font-bold text-lg mb-1" style={textPrimary}>Invite sent!</h3>
            <p className="text-sm mb-1" style={textSecondary}>An invitation was sent to</p>
            <p className="font-semibold mb-2" style={textPrimary}>{email}</p>
            <p className="text-xs mb-6" style={textMuted}>They'll need to connect Outlook after accepting to enable BCC tracking & inbox sync.</p>
            <button onClick={() => { reset(); onClose(); }} className="w-full py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background:BRAND_GRAD }}>Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
              <div>
                <h3 className="font-bold" style={textPrimary}>Invite Team Member</h3>
                <p className="text-xs mt-0.5" style={textMuted}>They'll get a unique BCC address for email tracking</p>
              </div>
              <button onClick={() => { reset(); onClose(); }} className="p-1.5 rounded-lg et-ghost" style={textMuted}><X size={15} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Full Name *",  val:name,  set:setName,  ph:"Jane Smith",       type:"text"  },
                  { label:"Work Email *", val:email, set:setEmail, ph:"jane@company.com", type:"email" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold mb-1.5" style={textSecondary}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="et-input" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={textSecondary}>Role</label>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)} className="et-role-btn"
                      style={role===r.id ? { backgroundColor:r.active_bg, borderColor:r.active_border } : { backgroundColor:cv("--bg-primary") }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white"
                        style={{ background:role===r.id ? r.grad : cv("--border-color") }}>
                        <r.Icon size={15} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={textPrimary}>{r.label}</p>
                        <p className="text-xs mt-0.5" style={textMuted}>{r.desc}</p>
                      </div>
                      {role===r.id && <CheckCircle2 size={15} style={{ color:r.active_border, marginTop:2, flexShrink:0 }} />}
                    </button>
                  ))}
                </div>
              </div>
              {name && (
                <div className="rounded-xl p-4" style={{ backgroundColor:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)" }}>
                  <p className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color:"#10b981" }}>
                    <Mail size={13} /> Auto-generated BCC address:
                  </p>
                  <code className="text-xs font-mono" style={{ color:"#34d399" }}>
                    activity+{name.toLowerCase().replace(/\s+/g,"-")}@ourcrm.com
                  </code>
                </div>
              )}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl" style={{ backgroundColor:"rgba(102,115,255,0.08)", border:`1px solid ${BRAND}33` }}>
                <Info size={14} style={{ color:BRAND, marginTop:1, flexShrink:0 }} />
                <p className="text-xs" style={{ color:BRAND_DARK }}>
                  {name || "This member"} will need to connect their Outlook account after accepting to enable inbox sync.
                </p>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-4" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
              <button onClick={() => { reset(); onClose(); }} className="flex-1 py-2.5 text-sm font-semibold rounded-xl et-outline-btn justify-center">Cancel</button>
              <button
                onClick={() => { if (name && email) setDone(true); }}
                disabled={!name || !email}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50"
                style={{ background:BRAND_GRAD, boxShadow:"0 4px 12px rgba(102,115,255,0.3)" }}
              >
                <UserPlus size={15} /> Send Invite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page  
export default function EmailTeam() {
  const { data, isLoading, refetch }    = useListTeamMembers();
  const members                         = data?.members || [];
  // FIX: useTriggerOutlookSync expects { memberId } not { data: { memberId } }
  const { mutate: syncOutlook, isPending: isSyncing, variables: syncVars } = useTriggerOutlookSync();
  const [copiedId,     setCopied]  = useState(null);
  const [inviteOpen,   setInvite]  = useState(false);
  // FIX: use real OutlookConnectModal with memberId
  const [outlookModal, setOutlook] = useState({ open: false, member: null });

  const copyBcc = (id, bcc) => {
    navigator.clipboard.writeText(bcc);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const connectedCount = members.filter(m => m.outlookConnected).length;
  const totalSent      = members.reduce((a, m) => a + (m.sentCount     || 0), 0);
  const totalReceived  = members.reduce((a, m) => a + (m.receivedCount || 0), 0);

  const SUMMARY = [
    { Icon:Users,         label:"Members",        value:members.length, grad:BRAND_GRAD,                              glow:"rgba(102,115,255,0.25)" },
    { Icon:Wifi,          label:"Outlook Synced", value:connectedCount, grad:"linear-gradient(135deg,#10b981,#0d9488)", glow:"rgba(16,185,129,0.25)"  },
    { Icon:ArrowUpRight,  label:"Emails Sent",    value:totalSent,      grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", glow:"rgba(139,92,246,0.25)"  },
    { Icon:ArrowDownLeft, label:"Replies Recv.",  value:totalReceived,  grad:"linear-gradient(135deg,#f59e0b,#ea580c)", glow:"rgba(245,158,11,0.25)"  },
  ];

  return (
    <div className="space-y-6">
      <style>{GLOBAL}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background:BRAND_GRAD, boxShadow:"0 4px 10px rgba(102,115,255,0.35)" }}>
              <Users size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Team Coverage</h1>
          </div>
          <p className="ml-9 text-sm" style={textMuted}>Manage Outlook connections, BCC addresses & sync per team member.</p>
        </div>
        <button
          onClick={() => setInvite(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-px"
          style={{ background:BRAND_GRAD, boxShadow:"0 4px 14px rgba(102,115,255,0.35)" }}
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform" style={surfaceStyle}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md text-white" style={{ background:s.grad, boxShadow:`0 4px 10px ${s.glow}` }}>
              <s.Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-extrabold" style={textPrimary}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={textMuted}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sync health banner */}
      {!isLoading && members.length > 0 && connectedCount < members.length && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.3)" }}>
          <Info size={16} style={{ color:"#f59e0b", flexShrink:0 }} />
          <p className="text-sm" style={{ color:"#f59e0b" }}>
            <strong>{members.length - connectedCount} member{members.length - connectedCount > 1 ? "s" : ""}</strong> haven't connected Outlook yet — their emails won't be synced.
          </p>
        </div>
      )}

      {/* Members Grid */}
      {isLoading ? (
        <TeamSkeleton />
      ) : members.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ ...bgStyle, border:`1px dashed ${cv("--border-color")}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor:cv("--border-color") }}>
            <Users size={26} style={textMuted} />
          </div>
          <h3 className="font-bold mb-1" style={textPrimary}>No team members yet</h3>
          <p className="text-sm mb-4" style={textSecondary}>Invite someone to start syncing emails and tracking client communications.</p>
          <button
            onClick={() => setInvite(true)}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
            style={{ background:BRAND_GRAD }}
          >
            <UserPlus size={14} className="inline mr-1.5" /> Invite First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {members.map((m, i) => {
            const isSyncingThis = isSyncing && syncVars?.memberId === m.id;
            return (
              <div
                key={m.id}
                className="et-card rounded-2xl overflow-hidden"
                style={{ ...surfaceStyle, borderTop:`3px solid ${m.outlookConnected ? BRAND : "#f59e0b"}`, animation:`fadeUp .4s ease ${i*0.1}s both` }}
              >
                <div className="p-6">
                  {/* Member Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md shrink-0"
                          style={{ background:BRAND_GRAD }}>
                          {m.avatarInitials || getInitials(m.name)}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                          style={{ backgroundColor: m.outlookConnected ? "#10b981" : "#6b7280", borderColor: cv("--bg-secondary") }} />
                      </div>
                      <div>
                        <h3 className="font-bold" style={textPrimary}>{m.name}</h3>
                        <p className="text-xs mt-0.5" style={textMuted}>{m.role || "Account Manager"}</p>
                        <p className="text-xs" style={textMuted}>{m.email}</p>
                      </div>
                    </div>
                    {m.outlookConnected ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor:"rgba(16,185,129,0.12)", color:"#10b981" }}>
                        <CheckCircle2 size={12} /> Synced
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor:"rgba(245,158,11,0.1)", color:"#f59e0b", border:"1px solid rgba(245,158,11,0.3)" }}>
                        <XCircle size={12} /> Not Connected
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { Icon:Users,         label:"Clients",  value:m.clientCount  || 0, grad:BRAND_GRAD },
                      { Icon:ArrowUpRight,  label:"Sent",     value:m.sentCount    || 0, grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)" },
                      { Icon:ArrowDownLeft, label:"Received", value:m.receivedCount|| 0, grad:"linear-gradient(135deg,#10b981,#0d9488)" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-3 flex flex-col items-center text-center"
                        style={{ ...bgStyle, border:`1px solid ${cv("--border-color")}` }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1 text-white" style={{ background:s.grad }}>
                          <s.Icon size={13} />
                        </div>
                        <p className="text-lg font-extrabold leading-none" style={textPrimary}>{s.value}</p>
                        <p className="text-[9px] font-bold uppercase mt-0.5" style={textMuted}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* BCC Address */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={textMuted}>BCC Tracking Address</label>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor:"rgba(16,185,129,0.1)", color:"#10b981" }}>
                        Auto-logs to client timeline
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="et-bcc-code">
                        {m.bccAddress || `activity+${(m.name || "").toLowerCase().replace(/\s+/g, "-")}@ourcrm.com`}
                      </div>
                      <button
                        onClick={() => copyBcc(m.id, m.bccAddress || "")}
                        className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors"
                        style={surfaceStyle}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = cv("--border-color"); e.currentTarget.style.color = cv("--text-muted"); }}
                      >
                        {copiedId === m.id ? <CheckCircle2 size={15} style={{ color:"#10b981" }} /> : <Copy size={15} style={textMuted} />}
                      </button>
                    </div>
                    <p className="text-[10px] mt-1.5" style={textMuted}>
                      BCC this when sending from Outlook to auto-log under the correct client.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 flex justify-between items-center gap-2 flex-wrap" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={textMuted} />
                      <span className="text-xs" style={textMuted}>
                        {m.lastSyncAt ? `Synced ${formatSmartDate(m.lastSyncAt)}` : "Never synced"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* FIX: real OutlookConnectModal with memberId */}
                      <button
                        onClick={() => setOutlook({ open: true, member: m })}
                        className="et-outline-btn"
                      >
                        <Mail size={12} /> {m.outlookConnected ? "Reconnect" : "Connect Outlook"}
                      </button>
                      {m.outlookConnected && (
                        <button
                          onClick={() => syncOutlook({ memberId: m.id }, { onSuccess: refetch })}
                          disabled={isSyncingThis}
                          className="et-outline-btn"
                        >
                          {isSyncingThis
                            ? <DotsLoader color={cv("--text-muted")} />
                            : <><RefreshCw size={12} /> Sync Now</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <InviteModal isOpen={inviteOpen} onClose={() => setInvite(false)} />

      {/* FIX: Real OutlookConnectModal with proper memberId */}
      <OutlookConnectModal
        isOpen={outlookModal.open}
        memberId={outlookModal.member?.id}
        memberName={outlookModal.member?.name}
        isConnected={outlookModal.member?.outlookConnected}
        onClose={() => setOutlook({ open: false, member: null })}
      />
    </div>
  );
}