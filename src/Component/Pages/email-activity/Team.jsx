import React, { useState } from "react";
import { useListTeamMembers, useTriggerOutlookSync } from "../../../lib/api.js";
import {
  Copy, RefreshCw, CheckCircle2, XCircle, Mail, Users,
  UserPlus, Wifi, Shield, Info, X,
} from "lucide-react";
import { getInitials, formatSmartDate } from "../../../lib/utils.js";

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
  @keyframes et-pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes et-bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
  @keyframes fadeUp    { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
  @keyframes modalIn   { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ot-spin   { to{transform:rotate(360deg)} }

  .etd { width:5px;height:5px;border-radius:50%;display:inline-block;animation:et-bounce 1.2s ease infinite }
  .etd:nth-child(2){animation-delay:.16s}.etd:nth-child(3){animation-delay:.32s}

  .et-input {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.875rem;
    width: 100%;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .et-input::placeholder { color: var(--text-muted); }
  .et-input:focus { border-color: ${BRAND}; box-shadow: 0 0 0 4px rgba(102,115,255,0.12); }

  .et-ghost { background:transparent; transition:background-color .15s; border-radius:10px; }
  .et-ghost:hover { background-color: var(--bg-primary); }

  .et-outline-btn {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: border-color .15s, color .15s, background-color .15s;
  }
  .et-outline-btn:hover { border-color: ${BRAND}; color: ${BRAND}; background-color: var(--bg-primary); }
  .et-outline-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .et-role-btn {
    width:100%; display:flex; align-items:flex-start; gap:12px; padding:14px; border-radius:12px; border:2px solid var(--border-color); text-align:left; transition: border-color .15s, background-color .15s;
  }
  .et-role-btn:hover { border-color: ${BRAND}44; }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function TeamSkeleton() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
      {[0,1].map((i) => (
        <div key={i} style={{ borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:16, animation:`et-pulse 1.5s ease infinite ${i*0.2}s`, ...surfaceStyle }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", backgroundColor: cv("--border-color") }} />
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ width:"60%", height:14, borderRadius:5, backgroundColor: cv("--border-color") }} />
              <div style={{ width:"80%", height:11, borderRadius:5, backgroundColor: cv("--border-color"), opacity:.6 }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ height:64, borderRadius:12, backgroundColor: cv("--border-color"), opacity:.5 }} />
            <div style={{ height:64, borderRadius:12, backgroundColor: cv("--border-color"), opacity:.5 }} />
          </div>
          <div style={{ height:40, borderRadius:8, backgroundColor: cv("--border-color"), opacity:.4 }} />
        </div>
      ))}
    </div>
  );
}

function DotsLoader({ color }) {
  return (
    <span style={{ display:"flex", gap:3, alignItems:"center" }}>
      <span className="etd" style={{ background: color }} />
      <span className="etd" style={{ background: color }} />
      <span className="etd" style={{ background: color }} />
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
    { id:"account_manager", label:"Account Manager", desc:"Manages clients and emails", Icon:Users,  grad: BRAND_GRAD,                          active_bg:"rgba(102,115,255,0.1)", active_border: BRAND     },
    { id:"admin",           label:"Admin",           desc:"Full access",                Icon:Shield, grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", active_bg:"rgba(139,92,246,0.1)", active_border:"#8b5cf6"  },
    { id:"viewer",          label:"Viewer",          desc:"Read-only access",           Icon:Info,   grad:"linear-gradient(135deg,#64748b,#475569)", active_bg:"rgba(100,116,139,0.1)", active_border:"#64748b" },
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
            <p className="font-semibold mb-6" style={textPrimary}>{email}</p>
            <button onClick={() => { reset(); onClose(); }} className="w-full py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: BRAND_GRAD }}>Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:`1px solid ${cv("--border-color")}` }}>
              <h3 className="font-bold" style={textPrimary}>Invite Team Member</h3>
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
                      style={role === r.id ? { backgroundColor: r.active_bg, borderColor: r.active_border } : { backgroundColor: cv("--bg-primary") }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white" style={{ background: role === r.id ? r.grad : cv("--border-color") }}>
                        <r.Icon size={15} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={textPrimary}>{r.label}</p>
                        <p className="text-xs mt-0.5" style={textMuted}>{r.desc}</p>
                      </div>
                      {role === r.id && <CheckCircle2 size={15} style={{ color: r.active_border, marginTop:2, flexShrink:0 }} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl" style={{ backgroundColor:"rgba(102,115,255,0.08)", border:`1px solid ${BRAND}33` }}>
                <Info size={14} style={{ color:BRAND, marginTop:1, flexShrink:0 }} />
                <p className="text-xs" style={{ color: BRAND_DARK }}>{name || "This member"} will need to connect their Outlook account after accepting.</p>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-4" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
              <button onClick={() => { reset(); onClose(); }} className="flex-1 py-2.5 text-sm font-semibold rounded-xl et-outline-btn justify-center" style={textSecondary}>Cancel</button>
              <button onClick={() => { if (name && email) setDone(true); }} disabled={!name || !email}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: BRAND_GRAD, boxShadow:"0 4px 12px rgba(102,115,255,0.3)" }}>
                <UserPlus size={15} /> Send Invite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Outlook Modal ────────────────────────────────────────────────────────────
function OutlookModal({ isOpen, member, onClose }) {
  const [step, setStep] = useState("overview");
  const reset = () => { setStep("overview"); onClose(); };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:"rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-0" style={{ backdropFilter:"blur(4px)" }} onClick={reset} />
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ ...surfaceStyle, animation:"modalIn .18s ease both" }}>
        {step === "overview" && (
          <>
            <div className="p-8 text-white" style={{ background: BRAND_GRAD }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor:"rgba(255,255,255,0.15)" }}>
                <Mail size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Connect Outlook</h3>
              <p className="text-sm" style={{ color:"#DADFFF" }}>Syncing for <strong className="text-white">{member?.name}</strong></p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm leading-relaxed" style={textSecondary}>Connect Microsoft Outlook to automatically log sent emails and capture replies.</p>
              {member?.outlookConnected && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.3)" }}>
                  <CheckCircle2 size={18} style={{ color:"#10b981", flexShrink:0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color:"#10b981" }}>Already connected</p>
                    <p className="text-xs" style={{ color:"#34d399" }}>Reconnect to refresh token</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-2.5 text-sm font-semibold rounded-xl et-outline-btn justify-center" style={textSecondary}>Cancel</button>
                <button onClick={() => setStep("connecting")} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: BRAND_GRAD }}>
                  {member?.outlookConnected ? "Reconnect" : "Get Started"} →
                </button>
              </div>
            </div>
          </>
        )}
        {step === "connecting" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor:"rgba(102,115,255,0.1)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ animation:"ot-spin .8s linear infinite" }}>
                <circle cx="14" cy="14" r="11" stroke="var(--border-color)" strokeWidth="3" />
                <path d="M14 3a11 11 0 0 1 11 11" stroke={BRAND} strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-bold mb-2" style={textPrimary}>Connecting to Microsoft…</h3>
            <p className="text-sm" style={textSecondary}>Authenticating and requesting permissions.</p>
            <button className="mt-6 text-xs transition-colors" style={{ color: BRAND }} onClick={() => setStep("success")}
              onMouseEnter={e => e.currentTarget.style.textDecoration="underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration="none"}>
              (Simulate success →)
            </button>
          </div>
        )}
        {step === "success" && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor:"rgba(16,185,129,0.12)" }}>
              <CheckCircle2 size={28} style={{ color:"#10b981" }} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={textPrimary}>Outlook connected!</h3>
            <p className="text-sm mb-6" style={textSecondary}>Emails for <strong>{member?.name}</strong> will now sync automatically.</p>
            <button onClick={reset} className="w-full py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: BRAND_GRAD }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmailTeam() {
  const { data, isLoading, refetch }                  = useListTeamMembers();
  const members                                       = data?.members || [];
  const { mutate: syncOutlook, isPending: isSyncing } = useTriggerOutlookSync();
  const [copiedId, setCopied]                         = useState(null);
  const [inviteOpen, setInvite]                       = useState(false);
  const [outlookModal, setOutlook]                    = useState({ open:false, member:null });

  const copyBcc = (id, bcc) => {
    navigator.clipboard.writeText(bcc);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const SUMMARY = [
    { Icon:Users, label:"Members",      value: members.length,                                        grad: BRAND_GRAD,                            glow:"rgba(102,115,255,0.25)" },
    { Icon:Wifi,  label:"Synced",       value: members.filter((m) => m.outlookConnected).length,       grad:"linear-gradient(135deg,#10b981,#0d9488)", glow:"rgba(16,185,129,0.25)"  },
    { Icon:Mail,  label:"Total Emails", value: members.reduce((a,m) => a+(m.emailCount||0),0),         grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", glow:"rgba(139,92,246,0.25)"  },
  ];

  return (
    <div className="space-y-6">
      <style>{GLOBAL}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md" style={{ background: BRAND_GRAD, boxShadow:"0 4px 10px rgba(102,115,255,0.35)" }}>
              <Users size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={textPrimary}>Team Coverage</h1>
          </div>
          <p className="ml-9 text-sm" style={textMuted}>Manage team members, Outlook sync, and BCC settings.</p>
        </div>
        <button
          onClick={() => setInvite(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-px"
          style={{ background: BRAND_GRAD, boxShadow:"0 4px 14px rgba(102,115,255,0.35)" }}
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform" style={surfaceStyle}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md text-white" style={{ background: s.grad, boxShadow:`0 4px 10px ${s.glow}` }}>
              <s.Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-extrabold" style={textPrimary}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={textMuted}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Members */}
      {isLoading ? (
        <TeamSkeleton />
      ) : members.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ ...bgStyle, border:`1px dashed ${cv("--border-color")}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: cv("--border-color") }}>
            <Users size={26} style={textMuted} />
          </div>
          <h3 className="font-bold mb-1" style={textPrimary}>No team members yet</h3>
          <p className="text-sm" style={textSecondary}>Invite someone to start syncing emails.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {members.map((m, i) => (
            <div key={m.id} className="rounded-2xl overflow-hidden" style={{ ...surfaceStyle, borderTop:`3px solid ${BRAND}`, animation:`fadeUp .4s ease ${i*0.1}s both` }}>
              <div className="p-6">
                {/* Member Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md shrink-0" style={{ background: BRAND_GRAD }}>
                      {m.avatarInitials || getInitials(m.name)}
                    </div>
                    <div>
                      <h3 className="font-bold" style={textPrimary}>{m.name}</h3>
                      <p className="text-xs mt-0.5" style={textMuted}>{m.role || "Account Manager"} · {m.email}</p>
                    </div>
                  </div>
                  {m.outlookConnected ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor:"rgba(16,185,129,0.12)", color:"#10b981" }}>
                      <CheckCircle2 size={12} /> Synced
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ ...surfaceStyle, ...textMuted }}>
                      <XCircle size={12} /> Disconnected
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { Icon:Users, label:"Clients", value: m.clientCount||0, grad: BRAND_GRAD,                            glow:"rgba(102,115,255,0.2)" },
                    { Icon:Mail,  label:"Emails",  value: m.emailCount ||0, grad:"linear-gradient(135deg,#10b981,#0d9488)", glow:"rgba(16,185,129,0.2)"  },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ ...bgStyle, border:`1px solid ${cv("--border-color")}` }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm" style={{ background:s.grad, boxShadow:`0 3px 8px ${s.glow}` }}>
                        <s.Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold leading-none" style={textPrimary}>{s.value}</p>
                        <p className="text-[10px] font-bold uppercase mt-0.5" style={textMuted}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BCC */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={textMuted}>Unique BCC Address</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2.5 rounded-lg text-xs break-all font-mono" style={{ backgroundColor:"#0f172a", color:"#34d399" }}>
                        {m.bccAddress || `activity+${m.id}@ourcrm.com`}
                      </code>
                      <button onClick={() => copyBcc(m.id, m.bccAddress||"")} className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors" style={surfaceStyle}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = cv("--border-color"); e.currentTarget.style.color = cv("--text-muted"); }}>
                        {copiedId === m.id ? <CheckCircle2 size={15} style={{ color:"#10b981" }} /> : <Copy size={15} style={textMuted} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center gap-2 flex-wrap" style={{ borderTop:`1px solid ${cv("--border-color")}` }}>
                    <span className="text-xs" style={textMuted}>{m.lastSyncAt ? `Last sync: ${formatSmartDate(m.lastSyncAt)}` : "Never synced"}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setOutlook({ open:true, member:m })} className="et-outline-btn">
                        {m.outlookConnected ? "Reconnect" : "Connect Outlook"}
                      </button>
                      {m.outlookConnected && (
                        <button
                          onClick={() => syncOutlook({ data:{ memberId:m.id } }, { onSuccess:refetch })}
                          disabled={isSyncing}
                          className="et-outline-btn"
                        >
                          {isSyncing ? <DotsLoader color={cv("--text-muted")} /> : <><RefreshCw size={12} /> Sync</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <InviteModal isOpen={inviteOpen} onClose={() => setInvite(false)} />
      <OutlookModal isOpen={outlookModal.open} member={outlookModal.member} onClose={() => setOutlook({ open:false, member:null })} />
    </div>
  );
}