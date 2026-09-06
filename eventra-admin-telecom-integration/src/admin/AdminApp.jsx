import React, { useState } from "react";
import { TOKENS } from "./tokens";
import { AdminSidebar, ADMIN_NAV } from "./components/AdminUI";

import DashboardScreen from "./screens/DashboardScreen";
import CustomersScreen from "./screens/CustomersScreen";
import VendorsScreen from "./screens/VendorsScreen";
import VendorKYCScreen from "./screens/VendorKYCScreen";
import BookingsScreen from "./screens/BookingsScreen";
import EnquiriesScreen from "./screens/EnquiriesScreen";
import QuotesScreen from "./screens/QuotesScreen";
import PaymentsScreen from "./screens/PaymentsScreen";
import CommissionScreen from "./screens/CommissionScreen";
import PayoutsScreen from "./screens/PayoutsScreen";
import DisputesScreen from "./screens/DisputesScreen";
import SupportScreen from "./screens/SupportScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import SettingsScreen from "./screens/SettingsScreen";

/* =========================================================================
   ADMIN APP — mounted at /admin (see src/App.jsx)
   -------------------------------------------------------------------------
   Deliberately a separate module/root from Customer and Vendor: own file
   tree (screens/, components/, mockData.js), own shell (sidebar-first,
   desktop-oriented), same design tokens for visual consistency. Nothing
   here shares state with Customer/Vendor at the React level — in
   production all three read from the same backend instead.

   ROUTING NOTE: this file owns *in-admin* navigation only (which admin
   screen is showing), the same lightweight useState-based pattern the
   Customer/Vendor apps already use — no router library needed for that.
   Getting *to* /admin in the first place is handled one level up, in
   src/App.jsx.
========================================================================= */

const SCREENS = {
  dashboard: DashboardScreen,
  customers: CustomersScreen,
  vendors: VendorsScreen,
  kyc: VendorKYCScreen,
  bookings: BookingsScreen,
  enquiries: EnquiriesScreen,
  quotes: QuotesScreen,
  payments: PaymentsScreen,
  commission: CommissionScreen,
  payouts: PayoutsScreen,
  disputes: DisputesScreen,
  support: SupportScreen,
  notifications: NotificationsScreen,
  analytics: AnalyticsScreen,
  settings: SettingsScreen,
};

function useViewport() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export default function AdminApp({ adminUser = { name: "Admin", role: "Platform Admin" } }) {
  const [screen, setScreen] = useState("dashboard");
  const width = useViewport();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const ActiveScreen = SCREENS[screen] || DashboardScreen;

  return (
    <div className="ev min-h-screen flex" style={{ background: "#EDE7DC" }}>
      <style>{TOKENS}</style>

      {/* Sidebar: hidden below md — a full desktop-style sidebar doesn't fit a
          phone screen, and Admin is used far more on desktop/tablet than
          mobile. A simple top nav takes over below. */}
      <div className="hidden md:flex">
        <AdminSidebar active={screen} go={setScreen} expanded={isDesktop} adminUser={adminUser} />
      </div>

      <div className="flex-1 min-w-0 ev-bg min-h-screen">
        {isMobile && <MobileTopNav active={screen} go={setScreen} />}
        <div className={"mx-auto min-h-screen " + (isDesktop ? "max-w-7xl px-10 py-8" : "px-5 py-6")}>
          <ActiveScreen go={setScreen} />
        </div>
      </div>
    </div>
  );
}

function MobileTopNav({ active, go }) {
  return (
    <div className="sticky top-0 z-10 ev-card border-b flex items-center gap-1 px-3 py-2 overflow-x-auto ev-scroll" style={{ borderColor: "#E9E2D6" }}>
      {ADMIN_NAV.map((it) => (
        <button
          key={it.id}
          onClick={() => go(it.id)}
          className={
            "ev-tap shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold " +
            (active === it.id ? "ev-bg-accent text-white" : "ev-muted")
          }
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
