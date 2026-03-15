import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex mb-4 gap-3 items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#fef2f2" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">404 — Page Not Found</h1>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          The page you're looking for doesn't exist or was moved.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 px-4 text-white text-sm font-semibold rounded-xl transition-colors"
            style={{ backgroundColor: "#2563eb" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}