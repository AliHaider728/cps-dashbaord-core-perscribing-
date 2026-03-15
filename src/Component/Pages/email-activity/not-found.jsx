import React from "react";
import { useNavigate } from "react-router-dom";

const cv = (v) => `var(${v})`;

const GLOBAL = `
  @keyframes nf-float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes nf-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .nf-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: nf-fadeUp .4s ease both;
  }

  .nf-btn {
    width:100%; padding:12px 16px;
    font-size:0.9375rem; font-weight:700;
    color:white; border-radius:14px;
    background: linear-gradient(135deg,#6673FF,#2F2CCB);
    box-shadow: 0 4px 16px rgba(102,115,255,0.4);
    transition: box-shadow .2s, transform .2s;
  }
  .nf-btn:hover { box-shadow: 0 8px 24px rgba(102,115,255,0.55); transform: translateY(-2px); }
`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>{GLOBAL}</style>
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: cv("--bg-primary") }}
      >
        <div className="nf-card text-center">
          {/* Floating icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.12),rgba(239,68,68,0.06))", border:"1px solid rgba(239,68,68,0.2)", animation:"nf-float 3s ease-in-out infinite" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.75">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
            </svg>
          </div>

          {/* 404 badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor:"rgba(102,115,255,0.1)", color:"#6673FF", border:"1px solid rgba(102,115,255,0.2)" }}>
            Error 404
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: cv("--text-primary") }}>
            Page Not Found
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: cv("--text-secondary") }}>
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <button onClick={() => navigate("/")} className="nf-btn">
            ← Go to Dashboard
          </button>

          <button
            onClick={() => window.history.back()}
            className="mt-3 w-full py-2.5 text-sm font-semibold rounded-xl transition-colors"
            style={{ color: cv("--text-muted"), backgroundColor:"transparent" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = cv("--bg-primary"); e.currentTarget.style.color = cv("--text-secondary"); }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = cv("--text-muted"); }}
          >
            Go back
          </button>
        </div>
      </div>
    </>
  );
}