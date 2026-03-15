import React, { useState, useEffect } from "react";
import {
  Mail, Send, Copy, CheckCircle2, Info,
  Paperclip, X, ChevronDown,
} from "lucide-react";
import { useSendEmail, useListClients, useListTeamMembers } from "../../lib/api.js";

// ─── Manual DotsLoader (replaces Spinner) ────────────────────────────────────

function DotsLoader() {
  return (
    <>
      <style>{`
        @keyframes ce-bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        .ced{width:4px;height:4px;border-radius:50%;background:white;display:inline-block;animation:ce-bounce 1.2s ease infinite}
        .ced:nth-child(2){animation-delay:.16s}.ced:nth-child(3){animation-delay:.32s}
      `}</style>
      <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <span className="ced" /><span className="ced" /><span className="ced" />
      </span>
    </>
  );
}

// ─── ComposeEmailModal ────────────────────────────────────────────────────────

export function ComposeEmailModal({
  isOpen, onClose,
  defaultClientId = "",
  defaultToEmail  = "",
  defaultToName   = "",
  defaultSubject  = "",
}) {
  const [to,             setTo]             = useState(defaultToEmail);
  const [toName,         setToName]         = useState(defaultToName);
  const [subject,        setSubject]        = useState(defaultSubject);
  const [body,           setBody]           = useState("");
  const [clientId,       setClientId]       = useState(defaultClientId);
  const [showBcc,        setShowBcc]        = useState(true);
  const [bccCopied,      setBccCopied]      = useState(false);
  const [showClientDrop, setShowClientDrop] = useState(false);
  const [attachments,    setAttachments]    = useState([]);

  const { data: clientsData }                              = useListClients({});
  const { data: teamData }                                 = useListTeamMembers();
  const { mutate: sendEmail, isPending: isSending }        = useSendEmail?.() || { mutate: () => {}, isPending: false };

  const currentMember = teamData?.members?.[0];
  const bccAddress    = currentMember?.bccAddress || `activity+${currentMember?.id || "user"}@ourcrm.com`;

  useEffect(() => {
    if (isOpen) {
      setTo(defaultToEmail);
      setToName(defaultToName);
      setSubject(defaultSubject);
      setClientId(defaultClientId);
      setBody("");
      setAttachments([]);
    }
  }, [isOpen, defaultToEmail, defaultToName, defaultSubject, defaultClientId]);

  const copyBcc = () => {
    navigator.clipboard.writeText(bccAddress);
    setBccCopied(true);
    setTimeout(() => setBccCopied(false), 2000);
  };

  const selectedClient = clientsData?.clients?.find((c) => c.id === clientId);
  const isValid        = to.trim() && subject.trim() && body.trim();

  const handleSend = () => {
    if (!isValid) return;
    sendEmail(
      { data: { to, toName, subject, body, clientId: clientId || undefined, bcc: bccAddress } },
      { onSuccess: onClose }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes ce-modal-in { from { opacity:0; transform:translateY(12px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .ce-input-row { display:flex; align-items:center; gap:12px; padding:12px 24px; border-bottom:1px solid #f1f5f9; }
        .ce-label { font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; width:48px; flex-shrink:0; }
        .ce-bare-input { flex:1; font-size:14px; outline:none; color:#0f172a; background:transparent; }
        .ce-bare-input::placeholder { color:#94a3b8; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Modal panel */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 672,
            backgroundColor: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            animation: "ce-modal-in .18s ease both",
          }}
        >
          {/* Dark header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", backgroundColor: "#0f172a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={16} color="#60a5fa" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>New Email</span>
            </div>
            <button
              onClick={onClose}
              style={{ padding: 6, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <X size={16} />
            </button>
          </div>

          {/* ── To ── */}
          <div className="ce-input-row">
            <span className="ce-label">To</span>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="ce-bare-input"
            />
            {/* Link client dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowClientDrop((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 8,
                  fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                  backgroundColor: selectedClient ? "#eff6ff" : "#f1f5f9",
                  color: selectedClient ? "#2563eb" : "#64748b",
                  transition: "background .15s",
                }}
              >
                {selectedClient ? selectedClient.name : "Link client"}
                <ChevronDown size={12} />
              </button>

              {showClientDrop && (
                <div style={{
                  position: "absolute", right: 0, top: 38, zIndex: 50,
                  width: 256, backgroundColor: "#fff",
                  border: "1px solid #e2e8f0", borderRadius: 14,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em" }}>Link to client</p>
                  </div>
                  <div style={{ maxHeight: 192, overflowY: "auto" }}>
                    {clientsData?.clients?.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setClientId(c.id);
                          if (!to) setTo(c.email || "");
                          if (!toName) setToName(c.name);
                          setShowClientDrop(false);
                        }}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", margin: 0 }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{c.email || "No email"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Subject ── */}
          <div className="ce-input-row">
            <span className="ce-label">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="ce-bare-input"
              style={{ fontWeight: 500 }}
            />
          </div>

          {/* ── BCC ── */}
          <div className="ce-input-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <button
              onClick={() => setShowBcc((v) => !v)}
              style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em", width: 48, flexShrink: 0, background: "transparent", border: "none", cursor: "pointer", padding: 0, transition: "color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
            >
              BCC
            </button>
            {showBcc && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <code style={{ flex: 1, fontSize: 12, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 8, color: "#059669", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {bccAddress}
                </code>
                <button
                  onClick={copyBcc}
                  style={{ padding: 6, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {bccCopied
                    ? <CheckCircle2 size={16} color="#059669" />
                    : <Copy size={16} />}
                </button>
                {/* Tooltip */}
                <div style={{ position: "relative", display: "flex" }}>
                  <Info size={14} color="#cbd5e1" style={{ cursor: "help" }} />
                  <div style={{
                    position: "absolute", right: 0, bottom: 22, width: 224,
                    backgroundColor: "#0f172a", color: "#fff", fontSize: 12,
                    padding: "10px 12px", borderRadius: 10,
                    opacity: 0, transition: "opacity .2s", pointerEvents: "none",
                    lineHeight: 1.5, zIndex: 50,
                  }}
                    className="ce-tooltip"
                  >
                    Adding this BCC automatically logs the email under the correct client in the activity timeline.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "16px 24px" }}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              autoFocus
              style={{
                width: "100%", minHeight: 200, resize: "none",
                fontSize: 14, color: "#1e293b", lineHeight: 1.7,
                outline: "none", border: "none", background: "transparent",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* ── Attachments ── */}
          {attachments.length > 0 && (
            <div style={{ padding: "0 24px 12px", display: "flex", flexWrap: "wrap", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
              {attachments.map((file, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", backgroundColor: "#f1f5f9", borderRadius: 8, fontSize: 12, color: "#475569" }}>
                  <Paperclip size={12} color="#94a3b8" />
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                  <button
                    onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0, transition: "color .15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", backgroundColor: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Attachment button */}
              <label style={{ padding: 8, borderRadius: 8, cursor: "pointer", color: "#94a3b8", display: "flex", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <Paperclip size={16} />
                <input type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) setAttachments((p) => [...p, ...Array.from(e.target.files)]); }} />
              </label>

              {/* Linked client badge */}
              {selectedClient && (
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
                  Linked: {selectedClient.name}
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{body.length} chars</span>

              {/* Discard */}
              <button
                onClick={onClose}
                style={{ padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#475569", backgroundColor: "transparent", border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Discard
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!isValid || isSending}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", fontSize: 13, fontWeight: 600,
                  color: "#fff", backgroundColor: "#2563eb",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  opacity: (!isValid || isSending) ? 0.5 : 1,
                  transition: "background .15s",
                }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#1d4ed8"; }}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                {isSending ? <DotsLoader /> : <><Send size={14} /> Send</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ce-tooltip { opacity: 0 !important; }
        *:hover > .ce-tooltip { opacity: 1 !important; }
      `}</style>
    </>
  );
}