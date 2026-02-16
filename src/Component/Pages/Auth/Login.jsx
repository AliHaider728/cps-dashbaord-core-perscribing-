import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');

        * { box-sizing: border-box; }

        .login-root {
          min-height: 100vh;
          height: 100vh;
          overflow: hidden;
          display: flex;
          font-family: 'Nunito', sans-serif;
          background: #f8f9fa;
        }

        /* ─── LEFT PANEL ─── */
        .left-panel {
          display: none;
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: flex-end;
          padding: 52px 52px 52px 52px;
          background-image: url('https://i.pinimg.com/1200x/64/1c/ac/641cac9f98694e52723708948353b2f9.jpg');
          background-size: cover;
          background-position: center;
        }
        @media (min-width: 1024px) {
          .left-panel { display: flex; width: 50%; }
        }

        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(155deg, rgba(37,99,235,0.8) 0%, rgba(29,78,216,0.8) 40%, rgba(59,130,246,0.8) 70%, rgba(30,64,175,0.8) 100%);
          z-index: 1;
        }

        /* geometric blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
          z-index: 2;
        }
        .blob-1 { width: 380px; height: 380px; background: #bfdbfe; top: -80px; right: -60px; animation-delay: 0s; }
        .blob-2 { width: 260px; height: 260px; background: #93c5fd; bottom: 80px; left: -40px; animation-delay: -3s; }
        .blob-3 { width: 200px; height: 200px; background: #dbeafe; top: 40%; left: 30%; animation-delay: -5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-28px) scale(1.05); }
        }

        /* grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 2;
        }

        .left-content {
          position: relative;
          z-index: 10;
        }

        .left-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 52px;
        }
        .left-logo img {
          height: 90px;
          width: auto;
          object-fit: contain;
        }

        .left-tagline {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .left-tagline em {
          font-style: italic;
          color: #bfdbfe;
        }

        .left-sub {
          color: rgba(255,255,255,1);
          font-size: 1rem;
          line-height: 1.65;
          margin-bottom: 48px;
          max-width: 380px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        /* stat cards */
        .stat-row {
          display: flex;
          gap: 14px;
        }
        .stat-card {
          flex: 1;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border-radius: 14px;
          padding: 18px 16px;
        }
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #bfdbfe;
          line-height: 1;
          margin-bottom: 6px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .stat-label {
          color: rgba(255,255,255,0.85);
          font-size: 0.72rem;
          line-height: 1.4;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        /* ─── RIGHT PANEL ─── */
        .right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 24px;
          background: #fff;
          position: relative;
          overflow: hidden;
        }

        /* subtle background texture */
        .right-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 70% 10%, rgba(37,99,235,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .form-wrapper {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
        }

        /* mobile logo */
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          margin-bottom: 36px;
        }
        .mobile-logo img { height: 60px; width: auto; object-fit: contain; }
        @media (min-width: 1024px) { .mobile-logo { display: none; } }

        /* form header */
        .form-header {
          margin-bottom: 36px;
        }
        .form-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }
        .form-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        /* accent bar */
        .accent-bar {
          width: 48px;
          height: 4px;
          background: linear-gradient(90deg, #2563eb, #bfdbfe);
          border-radius: 4px;
          margin-bottom: 10px;
        }

        /* form fields */
        .form-group { margin-bottom: 22px; }
        .form-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 7px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .input-wrap { position: relative; }
        .form-input {
          width: 100%;
          padding: 13px 44px 13px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          color: #1e293b;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }
        .form-input::placeholder { color: #94a3b8; }
        .form-input:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          width: 18px;
          height: 18px;
        }
        .toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .toggle-btn:hover { color: #2563eb; }

        /* remember + forgot */
        .row-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .check-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .check-wrap input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #2563eb;
          cursor: pointer;
        }
        .check-wrap label {
          font-size: 0.88rem;
          color: #475569;
          cursor: pointer;
          font-weight: 500;
        }
        .forgot-link {
          font-size: 0.88rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .forgot-link:hover { color: #1d4ed8; text-decoration: underline; }

        /* submit button */
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          letter-spacing: 0.04em;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.35);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        /* contact admin */
        .contact-admin {
          text-align: center;
          padding: 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          font-size: 0.88rem;
          color: #475569;
        }
        .contact-admin a {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
        }
        .contact-admin a:hover { text-decoration: underline; }

        /* footer */
        .form-footer {
          margin-top: 40px;
          text-align: center;
        }
        .shiny-text {
          font-family: 'Nunito', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          position: relative;
          display: inline-block;
          overflow: hidden;
        }
        .shiny-text::after {
          content: "";
          position: absolute;
          top: 0; left: -150%;
          width: 150%; height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%);
          animation: shine 3.5s linear infinite;
        }
        @keyframes shine { 0% { left: -150%; } 100% { left: 150%; } }

        /* NHS badge */
        .nhs-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 20px;
          padding: 6px 14px 6px 10px;
          font-size: 0.75rem;
          color: #065f46;
          font-weight: 700;
          margin-top: 16px;
          letter-spacing: 0.02em;
        }
        .nhs-dot {
          width: 8px; height: 8px;
          background: #2563eb;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>

      <div className="login-root">
        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="grid-overlay" />

          <div className="left-content">
            <div className="left-logo">
              <img
                src="https://coreprescribingsolutions.co.uk/wp-content/themes/core-prescribing/images/core-prescribing-logo.png"
                alt="Core Prescribing Solutions"
              />
            </div>

            <h1 className="left-tagline">
              Delivering <em>clinical excellence</em> across primary care.
            </h1>
            <p className="left-sub">
              The CPS Intranet gives your team secure, centralised access to
              rota management, staff records, compliance tools, and PCN
              performance dashboards — all in one place.
            </p>

            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-number">25+</div>
                <div className="stat-label">Years combined NHS experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">PCNs</div>
                <div className="stat-label">Nationwide network supported</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Managed pharmacist model</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="form-wrapper">

            {/* Mobile logo */}
            <div className="mobile-logo">
              <img
                src="https://coreprescribingsolutions.co.uk/wp-content/themes/core-prescribing/images/core-prescribing-logo.png"
                alt="CPS Logo"
              />
            </div>

            {/* Form header */}
            <div className="form-header">
              <div className="accent-bar" />
              <h2>Welcome back</h2>
              <p>Sign in to your CPS Intranet account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrap">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="you@coreprescribing.co.uk"
                  />
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="row-meta">
                <div className="check-wrap">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                <div className="btn-inner">
                  {loading ? (
                    <>
                      <div className="spinner" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>

              <div className="divider">OR</div>

              <div className="contact-admin">
                Don't have access?{" "}
                <a href="mailto:admin@coreprescribingsolutions.co.uk">
                  Contact your administrator
                </a>
              </div>
            </form>

            {/* Footer */}
            <div className="form-footer">
              <span className="shiny-text">Powered by TecnoSphere</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="nhs-badge">
                  <div className="nhs-dot" />
                  NHS Primary Care Partner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;