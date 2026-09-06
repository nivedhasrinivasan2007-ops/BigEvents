import React from "react";
import CustomerApp from "./customer/EventraApp";
import VendorApp from "./vendor/EventraVendorApp";
import AdminApp from "./admin/AdminApp";
import AdminAuthGuard from "./admin/AdminAuthGuard";

/* =========================================================================
   Top-level route split:
     /        → CustomerApp
     /vendor  → VendorApp
     /admin   → AdminApp (protected by AdminAuthGuard)

   Deliberately NOT react-router — the existing apps already do their own
   internal navigation with plain useState.

   Admin authentication is handled only at the /admin level.
   Customer and Vendor are unchanged.
========================================================================= */

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  // 🔐 Admin — protected by AdminAuthGuard
  if (path.startsWith("/admin")) {
    return (
      <AdminAuthGuard>
        {({ adminUser, onLogout }) => (
          <AdminApp
            adminUser={adminUser}
            onLogout={onLogout}
          />
        )}
      </AdminAuthGuard>
    );
  }

  // 👨‍💼 Vendor — unchanged
  if (path.startsWith("/vendor")) {
    return <VendorApp />;
  }

  // 👤 Customer — unchanged
  return <CustomerApp />;
}