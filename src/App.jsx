import EventraApp from "./BigDay-customer-app";
import EventraVendorApp from "./BigDay-vendor-app";
import EventraAdminApp from "./BigDay-admin-app";
import AdminAuthGuard from "./admin/AdminAuthGuard";

export default function App() {
  const path = window.location.pathname;

  // 🔐 Admin — protected by AdminAuthGuard
  if (path.startsWith("/admin")) {
    return (
      <AdminAuthGuard>
        {({ adminUser, onLogout }) => (
          <EventraAdminApp
            adminUser={adminUser}
            onLogout={onLogout}
          />
        )}
      </AdminAuthGuard>
    );
  }

  // 👨‍💼 Vendor — unchanged
  if (path.startsWith("/vendor")) {
    return <EventraVendorApp />;
  }

  // 👤 Customer — unchanged
  return <EventraApp />;
}