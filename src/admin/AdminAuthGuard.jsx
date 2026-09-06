import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import { getAdminSession, logoutAdmin } from "./adminAuth";
/* ---------------------------------------------------------------
   EVENTRA — Admin Auth Guard (Phase 1, PROTOTYPE)
   -----------------------------------------------------------------
   Sits in front of EventraAdminApp. Not logged in → renders
   AdminLogin. Logged in → renders the real dashboard (children),
   passing it `adminUser` and `onLogout` so the dashboard can show
   who's logged in and offer a way out.

   TODO(backend): once adminAuth.js's session check talks to a real
   server, this component's shape doesn't need to change — only
   what getAdminSession()/isAdminLoggedIn() do under the hood.
--------------------------------------------------------------- */

export default function AdminAuthGuard({ children }) {
  const [session, setSession] = useState(() => getAdminSession());

  // Re-check on mount in case another tab logged out/in — cheap
  // insurance for a prototype, not a substitute for real
  // server-verified sessions.
  useEffect(() => {
    setSession(getAdminSession());
  }, []);

  const handleLoginSuccess = (admin) => {
    setSession(getAdminSession() || { admin });
  };

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
  };

  if (!session) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // children is a render function so it can receive adminUser/onLogout
  // without this guard needing to know anything about the dashboard's
  // own prop shape beyond that.
  return children({ adminUser: session.admin, onLogout: handleLogout });
}
