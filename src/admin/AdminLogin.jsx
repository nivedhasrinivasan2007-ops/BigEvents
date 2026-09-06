import React, { useState } from "react";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { loginAdmin } from "./adminAuth";

/* ---------------------------------------------------------------
   EVENTRA — Admin Login (Phase 1, PROTOTYPE)
   -----------------------------------------------------------------
   Uses the same brand tokens (ev-*) defined in BigDay-admin-app.jsx.
   Those classes are global (injected via <style>{TOKENS}</style> by
   the admin app / guard), so this file doesn't redefine them.

   ⚠️ Backed by adminAuth.js's DEV/PROTOTYPE credential check — see
   that file for the TODO(backend) notes on replacing it with a real
   login endpoint.
--------------------------------------------------------------- */

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Synchronous today since it's a local check — kept in a
    // setTimeout-free async-shaped call so swapping in a real
    // fetch() later (TODO(backend) in adminAuth.js) doesn't require
    // touching this component's flow.
    const result = loginAdmin(email, password);
    setSubmitting(false);

    if (result.success) {
      onLoginSuccess(result.admin);
    } else {
      setError(result.error || "Login failed.");
    }
  };

  return (
    <div className="ev min-h-screen flex items-center justify-center px-5" style={{ background: "#EDE7DC" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-xl ev-bg-accent flex items-center justify-center shrink-0 mb-3">
            <span className="ev-display text-white text-[18px] font-semibold">E</span>
          </div>
          <div className="ev-display text-[19px] font-semibold ev-ink">Eventra</div>
          <div className="text-[11px] font-semibold tracking-wide ev-faint uppercase mt-0.5">Admin Console</div>
        </div>

        <form onSubmit={handleSubmit} className="ev-card rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-semibold ev-muted uppercase tracking-wide">Email</label>
            <div className="flex items-center gap-2 ev-card rounded-xl px-3 py-2.5 mt-1.5">
              <Mail size={15} className="ev-faint shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bigday.dev"
                autoComplete="username"
                required
                className="bg-transparent outline-none text-[13.5px] w-full ev-ink placeholder:ev-faint"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold ev-muted uppercase tracking-wide">Password</label>
            <div className="flex items-center gap-2 ev-card rounded-xl px-3 py-2.5 mt-1.5">
              <Lock size={15} className="ev-faint shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="bg-transparent outline-none text-[13.5px] w-full ev-ink placeholder:ev-faint"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 ev-bg-danger-soft ev-danger rounded-xl px-3 py-2 text-[12.5px] font-medium">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="ev-tap ev-btn-primary rounded-xl px-4 py-2.5 text-[13.5px] mt-1 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-[11.5px] ev-faint text-center leading-snug">
            Prototype login — dev credentials only, not a real account system yet.
          </p>
        </form>
      </div>
    </div>
  );
}
