import EventraApp from "./BigDay-customer-app";
import EventraVendorApp from "./BigDay-vendor-app";
import EventraAdminApp from "./BigDay-admin-app";
import AdminAuthGuard from "./admin/AdminAuthGuard";

export default function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = window.location.pathname;
  const path =
    pathname === basePath
      ? "/"
      : pathname.startsWith(`${basePath}/`)
        ? pathname.slice(basePath.length)
        : pathname;

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