import React, { useState } from "react";
import {
  LayoutDashboard, Users, Building2, ShieldCheck, ShieldX, CalendarCheck, ClipboardList,
  FileText, Wallet, Percent, Banknote, AlertTriangle, LifeBuoy, Bell,
  BarChart3, Settings as SettingsIcon, Search, Send,
} from "lucide-react";

/* ---------------------------------------------------------------
   EVENTRA — Admin App Prototype
   Platform control center: Dashboard, Customers, Vendors, Vendor KYC,
   Bookings, Enquiries, Quotes, Payments, Commission, Payouts,
   Disputes, Support, Notifications, Analytics, Platform Settings.

   Same single-file pattern as the Customer and Vendor apps — drop this
   file in next to them and mount it at /admin. See the routing note at
   the bottom of this file for how the three apps fit together.

   Everything under MOCK DATA stands in for a future backend call. None
   of it is persisted or real. Where an action would need real backend
   enforcement (KYC verification, a payout, a payment), it's called out
   in a comment rather than pretending to be real — see the Vendor app's
   KYC gate (More → KYC status) for the customer/vendor side of this
   same rule.
--------------------------------------------------------------- */

const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap');
  .ev { font-family: 'Inter', sans-serif; color: #211E1B; }
  .ev-display { font-family: 'Fraunces', serif; }
  .ev-display-italic { font-family: 'Fraunces', serif; font-style: italic; }
  .ev-bg { background: #FBF8F3; }
  .ev-ink { color: #211E1B; }
  .ev-muted { color: #837B6F; }
  .ev-faint { color: #A79E90; }
  .ev-accent { color: #96114C; }
  .ev-bg-accent { background: #96114C; }
  .ev-bg-accent-soft { background: #FBEAF1; }
  .ev-gold { color: #A9832E; }
  .ev-bg-gold-soft { background: #FBF2E1; }
  .ev-success { color: #2F7A52; }
  .ev-bg-success-soft { background: #E9F5EE; }
  .ev-info { color: #2A6F97; }
  .ev-bg-info-soft { background: #E7F1F8; }
  .ev-danger { color: #B23B4A; }
  .ev-bg-danger-soft { background: #F8DCE0; }
  .ev-card { background: #FFFFFF; border: 1px solid #E9E2D6; }
  .ev-btn-primary { background: #96114C; color: #FFF8F1; font-weight: 600; transition: transform .15s ease, background .15s ease; }
  .ev-btn-primary:active { transform: scale(0.97); background: #7C0E3F; }
  .ev-btn-ghost { background: transparent; color: #96114C; border: 1.5px solid #E9CBDA; font-weight: 600; }
  .ev-btn-ghost:active { transform: scale(0.97); }
  .ev-tap:active { transform: scale(0.97); }
  .ev-scroll::-webkit-scrollbar { display: none; }
  .ev-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes ev-fade-in { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
  .ev-anim { animation: ev-fade-in .28s ease; }
`;

/* ================= MOCK DATA ================= */
/* Every array here stands in for a future service call. Replace the
   relevant piece with a real API/fetch when a backend exists — the
   screens below don't need to change shape, just where the data
   comes from. */

const MOCK_CUSTOMERS = [
  { id: "c1", name: "Ritika Menon", phone: "•••• 4821", city: "Chennai", events: 2, joined: "12 Jan 2026", status: "active" },
  { id: "c2", name: "Arvind Sethi", phone: "•••• 7710", city: "Bengaluru", events: 1, joined: "03 Feb 2026", status: "active" },
  { id: "c3", name: "Priya Kannan", phone: "•••• 2290", city: "Chennai", events: 0, joined: "18 Feb 2026", status: "active" },
  { id: "c4", name: "Sameer Iyer", phone: "•••• 5561", city: "Coimbatore", events: 3, joined: "22 Nov 2025", status: "suspended" },
];

const MOCK_VENDORS = [
  { id: "v1", business: "Chettinad Feasts Catering", owner: "Meena R.", city: "Chennai", category: "Catering", kyc: "verified", bookings: 18, status: "active" },
  { id: "v2", business: "The Banana Leaf Co.", owner: "Suresh K.", city: "Chennai", category: "Catering", kyc: "pending", bookings: 0, status: "active" },
  { id: "v3", business: "Spice Route Events", owner: "Fathima N.", city: "Coimbatore", category: "Catering", kyc: "rejected", bookings: 2, status: "active" },
  { id: "v4", business: "Royal Cauvery Caterers", owner: "Dinesh V.", city: "Bengaluru", category: "Catering", kyc: "verified", bookings: 41, status: "active" },
];

const MOCK_KYC_QUEUE = [
  { id: "k1", vendor: "The Banana Leaf Co.", docType: "GST + Aadhaar", submitted: "01 Sep 2026", status: "pending" },
  { id: "k2", vendor: "Spice Route Events", docType: "FSSAI License", submitted: "28 Aug 2026", status: "rejected", reason: "Document illegible — resubmission requested" },
  { id: "k3", vendor: "Marina Catering Co.", docType: "GST + Aadhaar", submitted: "30 Aug 2026", status: "pending" },
];

const MOCK_BOOKINGS = [
  { id: "bk1", customer: "Ritika Menon", vendor: "Chettinad Feasts Catering", event: "Wedding · 450 guests", date: "14 Nov 2026", amount: "₹4,85,000", status: "confirmed" },
  { id: "bk2", customer: "Arvind Sethi", vendor: "Royal Cauvery Caterers", event: "Corporate · 120 guests", date: "22 Oct 2026", amount: "₹1,20,000", status: "confirmed" },
  { id: "bk3", customer: "Sameer Iyer", vendor: "Chettinad Feasts Catering", event: "Birthday · 60 guests", date: "05 Oct 2026", amount: "₹68,000", status: "cancelled" },
];

const MOCK_ENQUIRIES = [
  { id: "e1", customer: "Priya Kannan", category: "Catering", city: "Chennai", date: "20 Sep 2026", matchedVendors: 4, status: "open" },
  { id: "e2", customer: "Arvind Sethi", category: "Catering", city: "Bengaluru", date: "18 Sep 2026", matchedVendors: 6, status: "open" },
];

const MOCK_QUOTES = [
  { id: "q1", vendor: "Chettinad Feasts Catering", customer: "Ritika Menon", amount: "₹4,85,000", sentOn: "10 Sep 2026", status: "accepted" },
  { id: "q2", vendor: "The Banana Leaf Co.", customer: "Priya Kannan", amount: "—", sentOn: "—", status: "draft" },
];

const MOCK_PAYMENTS = [
  { id: "p1", customer: "Ritika Menon", booking: "bk1", amount: "₹1,45,500", method: "UPI", date: "12 Sep 2026", status: "paid" },
  { id: "p2", customer: "Arvind Sethi", booking: "bk2", amount: "₹36,000", method: "Card", date: "05 Sep 2026", status: "paid" },
  { id: "p3", customer: "Sameer Iyer", booking: "bk3", amount: "₹68,000", method: "UPI", date: "01 Sep 2026", status: "failed" },
];

const MOCK_PAYOUTS = [
  { id: "po1", vendor: "Chettinad Feasts Catering", amount: "₹4,36,500", commission: "₹48,500 (10%)", cycle: "1–15 Sep", status: "processing" },
  { id: "po2", vendor: "Royal Cauvery Caterers", amount: "₹1,08,000", commission: "₹12,000 (10%)", cycle: "1–15 Sep", status: "paid" },
];

const MOCK_DISPUTES = [
  { id: "d1", parties: "Sameer Iyer vs Chettinad Feasts Catering", reason: "Booking cancelled, refund pending", opened: "02 Sep 2026", status: "open" },
];

const MOCK_SUPPORT = [
  { id: "s1", from: "Priya Kannan (Customer)", subject: "Vendor not responding to enquiry", opened: "01 Sep 2026", status: "open" },
  { id: "s2", from: "Suresh K. (Vendor)", subject: "KYC document re-upload not working", opened: "31 Aug 2026", status: "resolved" },
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", audience: "All Vendors", title: "Payout cycle moved to 1st & 15th", sentOn: "28 Aug 2026", status: "sent" },
  { id: "n2", audience: "Pending KYC vendors", title: "Reminder: complete KYC to start quoting", sentOn: "30 Aug 2026", status: "sent" },
];

const MOCK_KPIS = {
  dashboard: [
    { label: "GMV (this month)", value: "₹18.4L", delta: "+12% vs last month", tone: "up" },
    { label: "Active Bookings", value: "62", delta: "+5 this week", tone: "up" },
    { label: "Pending KYC", value: "3", delta: "Needs review", tone: "down" },
    { label: "Open Disputes", value: "1", delta: "1 unresolved", tone: "down" },
  ],
  analytics: [
    { label: "Take Rate", value: "10.2%" },
    { label: "Avg. Booking Value", value: "₹1.9L" },
    { label: "Vendor Retention (90d)", value: "88%" },
    { label: "Enquiry → Booking", value: "24%" },
  ],
};

/* ================= KYC status (mirrors Vendor app) ================= */

const KYC_STATUS = { PENDING: "pending", VERIFIED: "verified", REJECTED: "rejected" };

/* ================= SHARED UI ================= */

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "kyc", label: "Vendor KYC", icon: ShieldCheck },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "enquiries", label: "Enquiries", icon: ClipboardList },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "commission", label: "Commission", icon: Percent },
  { id: "payouts", label: "Vendor Payouts", icon: Banknote },
  { id: "disputes", label: "Disputes", icon: AlertTriangle },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Platform Settings", icon: SettingsIcon },
];

function AdminSidebar({ active, go, expanded, adminUser }) {
  return (
    <div
      className={"shrink-0 h-screen sticky top-0 flex flex-col ev-card border-r py-5 " + (expanded ? "w-64 px-4" : "w-[72px] px-2 items-center")}
      style={{ borderRightColor: "#E9E2D6" }}
    >
      <div className={"flex items-center gap-2 mb-6 " + (expanded ? "px-2" : "")}>
        <div className="w-9 h-9 rounded-xl ev-bg-accent flex items-center justify-center shrink-0">
          <span className="ev-display text-white text-[16px] font-semibold">E</span>
        </div>
        {expanded && (
          <div className="leading-tight">
            <div className="ev-display text-[15px] font-semibold ev-ink">Eventra</div>
            <div className="text-[10.5px] font-semibold tracking-wide ev-faint uppercase">Admin Console</div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto ev-scroll">
        {ADMIN_NAV.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              title={it.label}
              className={"ev-tap flex items-center gap-3 rounded-xl py-2.5 text-left " + (expanded ? "px-3" : "px-0 justify-center") + " " + (isActive ? "ev-bg-accent-soft ev-accent" : "ev-muted")}
            >
              <it.icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              {expanded && <span className="text-[13px] font-medium">{it.label}</span>}
            </button>
          );
        })}
      </div>
      <div className={"pt-3 border-t mt-2 " + (expanded ? "px-2" : "")} style={{ borderTopColor: "#E9E2D6" }}>
        <div className={"flex items-center gap-2 " + (expanded ? "" : "justify-center")}>
          <div className="w-8 h-8 rounded-full ev-bg-accent-soft ev-accent flex items-center justify-center text-[12px] font-semibold shrink-0">
            {(adminUser?.name || "A").slice(0, 1).toUpperCase()}
          </div>
          {expanded && (
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold ev-ink truncate">{adminUser?.name || "Admin"}</div>
              <div className="text-[10.5px] ev-faint truncate">{adminUser?.role || "Platform Admin"}</div>
            </div>
          )}
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
          className={"ev-tap shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold " + (active === it.id ? "ev-bg-accent text-white" : "ev-muted")}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function AdminTopBar({ title, subtitle, onSearch, right }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="ev-display text-[22px] font-semibold ev-ink leading-tight">{title}</h1>
        {subtitle && <p className="text-[13px] ev-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {onSearch && (
          <div className="flex items-center gap-2 ev-card rounded-xl px-3 py-2 min-w-[220px]">
            <Search size={15} className="ev-faint" />
            <input onChange={(e) => onSearch(e.target.value)} placeholder="Search…" className="bg-transparent outline-none text-[13px] w-full ev-ink placeholder:ev-faint" />
          </div>
        )}
        {right}
      </div>
    </div>
  );
}

function KPICard({ label, value, delta, tone = "neutral", icon: Icon }) {
  const toneClass = tone === "up" ? "ev-success" : tone === "down" ? "ev-danger" : "ev-muted";
  return (
    <div className="ev-card rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold ev-muted uppercase tracking-wide">{label}</span>
        {Icon && <Icon size={16} className="ev-faint" />}
      </div>
      <div className="ev-display text-[24px] font-semibold ev-ink">{value}</div>
      {delta && <div className={"text-[12px] font-medium " + toneClass}>{delta}</div>}
    </div>
  );
}

const STATUS_STYLES = {
  verified: "ev-bg-success-soft ev-success", active: "ev-bg-success-soft ev-success", paid: "ev-bg-success-soft ev-success", resolved: "ev-bg-success-soft ev-success",
  pending: "ev-bg-gold-soft ev-gold", in_review: "ev-bg-gold-soft ev-gold", processing: "ev-bg-gold-soft ev-gold", open: "ev-bg-gold-soft ev-gold",
  rejected: "ev-bg-danger-soft ev-danger", failed: "ev-bg-danger-soft ev-danger", disputed: "ev-bg-danger-soft ev-danger", cancelled: "ev-bg-danger-soft ev-danger",
  info: "ev-bg-info-soft ev-info", draft: "ev-bg-info-soft ev-info",
};

function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase().replace(/\s+/g, "_");
  const cls = STATUS_STYLES[key] || "ev-bg-info-soft ev-info";
  return <span className={"inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize " + cls}>{String(status || "").replace(/_/g, " ")}</span>;
}

function FilterBar({ filters, active, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={"ev-tap px-3 py-1.5 rounded-full text-[12.5px] font-semibold border " + (active === f.id ? "ev-bg-accent text-white border-transparent" : "ev-card ev-muted")}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function DataTable({ columns, rows, emptyLabel = "Nothing here yet.", onRowClick }) {
  if (!rows.length) return <div className="ev-card rounded-2xl p-10 text-center text-[13px] ev-muted">{emptyLabel}</div>;
  return (
    <div className="ev-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b" style={{ borderColor: "#E9E2D6" }}>
              {columns.map((c) => (
                <th key={c.key} className="text-left px-4 py-3 font-semibold ev-muted uppercase text-[11px] tracking-wide whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? i} onClick={() => onRowClick && onRowClick(row)} className={"border-b last:border-0 " + (onRowClick ? "cursor-pointer hover:bg-[#FBF3F6]" : "")} style={{ borderColor: "#F1ECE1" }}>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle whitespace-nowrap">{c.render ? c.render(row) : row[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminModal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="ev-card rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col ev-anim">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E9E2D6" }}>
          <h3 className="ev-display text-[16px] font-semibold ev-ink">{title}</h3>
          <button onClick={onClose} className="ev-tap ev-muted text-[13px]">Close</button>
        </div>
        <div className="px-5 py-4 overflow-y-auto ev-scroll">{children}</div>
        {footer && <div className="px-5 py-4 border-t flex items-center justify-end gap-2" style={{ borderColor: "#E9E2D6" }}>{footer}</div>}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="ev-muted">{label}</span>
      <span className="ev-ink font-medium">{value}</span>
    </div>
  );
}

/* ================= SCREENS ================= */

function DashboardScreen({ go }) {
  return (
    <div>
      <AdminTopBar title="Dashboard" subtitle="Platform overview, at a glance." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIS.dashboard.map((k) => <KPICard key={k.label} {...k} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold ev-ink">Recent bookings</h2>
            <button onClick={() => go("bookings")} className="text-[12.5px] font-semibold ev-accent">View all</button>
          </div>
          <DataTable
            columns={[
              { key: "customer", label: "Customer" }, { key: "vendor", label: "Vendor" }, { key: "amount", label: "Amount" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={MOCK_BOOKINGS}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold ev-ink">KYC queue</h2>
            <button onClick={() => go("kyc")} className="text-[12.5px] font-semibold ev-accent">Review all</button>
          </div>
          <DataTable
            columns={[
              { key: "vendor", label: "Vendor" }, { key: "docType", label: "Documents" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={MOCK_KYC_QUEUE}
          />
        </div>
      </div>
    </div>
  );
}

function CustomersScreen() {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const rows = MOCK_CUSTOMERS.filter((c) => (filter === "all" || c.status === filter) && (!q || c.name.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <AdminTopBar title="Customers" subtitle={`${MOCK_CUSTOMERS.length} registered customers`} onSearch={setQ} />
      <FilterBar filters={[{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "suspended", label: "Suspended" }]} active={filter} onChange={setFilter} />
      <DataTable
        columns={[
          { key: "name", label: "Name" }, { key: "phone", label: "Phone (masked)" }, { key: "city", label: "City" },
          { key: "events", label: "Events booked" }, { key: "joined", label: "Joined" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
        emptyLabel="No customers match this filter."
      />
    </div>
  );
}

function VendorsScreen({ go }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const rows = MOCK_VENDORS.filter((v) => (filter === "all" || v.kyc === filter) && (!q || v.business.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <AdminTopBar title="Vendors" subtitle={`${MOCK_VENDORS.length} registered vendors`} onSearch={setQ} />
      <FilterBar
        filters={[{ id: "all", label: "All" }, { id: "verified", label: "KYC verified" }, { id: "pending", label: "KYC pending" }, { id: "rejected", label: "KYC rejected" }]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "business", label: "Business" }, { key: "owner", label: "Owner" }, { key: "city", label: "City" }, { key: "category", label: "Category" },
          { key: "bookings", label: "Bookings" }, { key: "kyc", label: "KYC", render: (r) => <StatusBadge status={r.kyc} /> },
        ]}
        rows={rows}
        onRowClick={() => go("kyc")}
        emptyLabel="No vendors match this filter."
      />
    </div>
  );
}

function VendorKYCScreen() {
  const [queue, setQueue] = useState(MOCK_KYC_QUEUE);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);

  // Enforcement point for the KYC business rule: a vendor can't send a
  // quote, confirm a booking, receive a payment, or request a payout
  // until an admin sets their status to VERIFIED here. The real gate is
  // server-side (see the Vendor app's kycStatus / More screen) — this
  // screen only records the decision, it doesn't enforce anything itself.
  function decide(id, decision, reason) {
    setQueue((prev) => prev.map((k) => (k.id === id ? { ...k, status: decision, reason: reason || null } : k)));
    setActive(null);
    // TODO(backend): POST /admin/kyc/:id/review — admin-only, re-authorized server-side.
  }

  const rows = queue.filter((k) => filter === "all" || k.status === filter);

  return (
    <div>
      <AdminTopBar title="Vendor KYC" subtitle="Verify vendor documents before they can quote, book, or get paid." />
      <FilterBar
        filters={[{ id: "all", label: "All" }, { id: KYC_STATUS.PENDING, label: "Pending" }, { id: KYC_STATUS.VERIFIED, label: "Verified" }, { id: KYC_STATUS.REJECTED, label: "Rejected" }]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "vendor", label: "Vendor" }, { key: "docType", label: "Documents" }, { key: "submitted", label: "Submitted" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
        onRowClick={(r) => setActive(r)}
        emptyLabel="No KYC submissions in this state."
      />
      {active && (
        <AdminModal
          title={active.vendor}
          onClose={() => setActive(null)}
          footer={
            <>
              <button onClick={() => decide(active.id, KYC_STATUS.REJECTED, "Documents did not meet requirements")} className="ev-tap ev-btn-ghost rounded-xl px-4 py-2 text-[13px] flex items-center gap-1.5">
                <ShieldX size={15} /> Reject
              </button>
              <button onClick={() => decide(active.id, KYC_STATUS.VERIFIED)} className="ev-tap ev-btn-primary rounded-xl px-4 py-2 text-[13px] flex items-center gap-1.5">
                <ShieldCheck size={15} /> Verify
              </button>
            </>
          }
        >
          <div className="space-y-3 text-[13px]">
            <Row label="Documents" value={active.docType} />
            <Row label="Submitted" value={active.submitted} />
            <Row label="Current status" value={<StatusBadge status={active.status} />} />
            {active.reason && <Row label="Last reviewer note" value={active.reason} />}
            <p className="ev-muted pt-2">Document previews would render here once file storage / upload is wired to a real backend.</p>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

function BookingsScreen() {
  const [filter, setFilter] = useState("all");
  const rows = MOCK_BOOKINGS.filter((b) => filter === "all" || b.status === filter);
  return (
    <div>
      <AdminTopBar title="Bookings" subtitle="All confirmed and cancelled bookings across the platform." />
      <FilterBar filters={[{ id: "all", label: "All" }, { id: "confirmed", label: "Confirmed" }, { id: "cancelled", label: "Cancelled" }]} active={filter} onChange={setFilter} />
      <DataTable
        columns={[
          { key: "customer", label: "Customer" }, { key: "vendor", label: "Vendor" }, { key: "event", label: "Event" }, { key: "date", label: "Date" }, { key: "amount", label: "Amount" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
      />
    </div>
  );
}

function EnquiriesScreen() {
  return (
    <div>
      <AdminTopBar title="Enquiries" subtitle="Customer requirements currently being matched to vendors." />
      <DataTable
        columns={[
          { key: "customer", label: "Customer" }, { key: "category", label: "Category" }, { key: "city", label: "City" }, { key: "date", label: "Event date" }, { key: "matchedVendors", label: "Matched vendors" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_ENQUIRIES}
      />
    </div>
  );
}

function QuotesScreen() {
  return (
    <div>
      <AdminTopBar title="Quotes" subtitle="Quotes drafted and sent by vendors. Sending requires verified KYC." />
      <DataTable
        columns={[
          { key: "vendor", label: "Vendor" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "sentOn", label: "Sent on" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_QUOTES}
      />
    </div>
  );
}

function PaymentsScreen() {
  return (
    <div>
      <AdminTopBar title="Payments" subtitle="Customer payments. Every row here should trace back to a verified payment-provider webhook, not client-side state." />
      <DataTable
        columns={[
          { key: "customer", label: "Customer" }, { key: "booking", label: "Booking ID" }, { key: "amount", label: "Amount" }, { key: "method", label: "Method" }, { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_PAYMENTS}
      />
    </div>
  );
}

function CommissionScreen() {
  const [defaultRate, setDefaultRate] = useState(10);
  const categoryRates = [{ category: "Catering", rate: 10 }];
  return (
    <div>
      <AdminTopBar title="Commission" subtitle="Platform commission configuration." />
      <div className="ev-card rounded-2xl p-5 mb-6 max-w-md">
        <label className="text-[12px] font-semibold ev-muted uppercase tracking-wide">Default commission rate</label>
        <div className="flex items-center gap-3 mt-2">
          <input type="number" value={defaultRate} onChange={(e) => setDefaultRate(Number(e.target.value))} className="ev-card rounded-xl px-3 py-2 w-24 text-[14px] font-semibold ev-ink outline-none" />
          <span className="ev-muted text-[13px]">% of booking value</span>
        </div>
        <p className="text-[12px] ev-muted mt-3">
          Changing this only updates the configured value shown here. The rate that actually applies to a transaction must be resolved and locked server-side at booking time.
        </p>
      </div>
      <h2 className="text-[14px] font-semibold ev-ink mb-3">Category overrides</h2>
      <div className="ev-card rounded-2xl divide-y" style={{ borderColor: "#E9E2D6" }}>
        {categoryRates.map((c) => (
          <div key={c.category} className="flex items-center justify-between px-4 py-3 text-[13px]">
            <span className="ev-ink font-medium">{c.category}</span>
            <span className="ev-muted">{c.rate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayoutsScreen() {
  return (
    <div>
      <AdminTopBar title="Vendor Payouts" subtitle="Payout requests, gated on verified KYC. Real disbursal happens through a payment provider, never client-side." />
      <DataTable
        columns={[
          { key: "vendor", label: "Vendor" }, { key: "amount", label: "Payout amount" }, { key: "commission", label: "Commission withheld" }, { key: "cycle", label: "Cycle" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_PAYOUTS}
      />
    </div>
  );
}

function DisputesScreen() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [active, setActive] = useState(null);
  const resolve = (id) => { setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: "resolved" } : d))); setActive(null); };
  return (
    <div>
      <AdminTopBar title="Disputes" subtitle="Escalations between a customer and a vendor over a booking." />
      <DataTable
        columns={[
          { key: "parties", label: "Parties" }, { key: "reason", label: "Reason" }, { key: "opened", label: "Opened" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={disputes}
        onRowClick={setActive}
        emptyLabel="No open disputes."
      />
      {active && (
        <AdminModal
          title={active.parties}
          onClose={() => setActive(null)}
          footer={active.status !== "resolved" && <button onClick={() => resolve(active.id)} className="ev-tap ev-btn-primary rounded-xl px-4 py-2 text-[13px]">Mark resolved</button>}
        >
          <div className="space-y-3 text-[13px]">
            <Row label="Reason" value={active.reason} />
            <Row label="Opened" value={active.opened} />
            <Row label="Status" value={<StatusBadge status={active.status} />} />
            <p className="ev-muted pt-2">Full dispute history, evidence, and refund actions connect to a real backend once one exists.</p>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

function SupportScreen() {
  const [filter, setFilter] = useState("all");
  const rows = MOCK_SUPPORT.filter((s) => filter === "all" || s.status === filter);
  return (
    <div>
      <AdminTopBar title="Support" subtitle="Tickets raised by customers and vendors." />
      <FilterBar filters={[{ id: "all", label: "All" }, { id: "open", label: "Open" }, { id: "resolved", label: "Resolved" }]} active={filter} onChange={setFilter} />
      <DataTable
        columns={[
          { key: "from", label: "From" }, { key: "subject", label: "Subject" }, { key: "opened", label: "Opened" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
      />
    </div>
  );
}

function NotificationsScreen() {
  const [audience, setAudience] = useState("All Vendors");
  const [title, setTitle] = useState("");
  const [sent, setSent] = useState(MOCK_NOTIFICATIONS);
  const send = () => {
    if (!title.trim()) return;
    setSent((prev) => [{ id: "n" + (prev.length + 1), audience, title, sentOn: "Just now", status: "sent" }, ...prev]);
    setTitle("");
  };
  return (
    <div>
      <AdminTopBar title="Notifications" subtitle="Broadcast messages to customers or vendors." />
      <div className="ev-card rounded-2xl p-5 mb-6 max-w-xl">
        <label className="text-[12px] font-semibold ev-muted uppercase tracking-wide">New broadcast</label>
        <div className="flex flex-col gap-3 mt-2">
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className="ev-card rounded-xl px-3 py-2 text-[13px] ev-ink outline-none">
            <option>All Customers</option>
            <option>All Vendors</option>
            <option>Pending KYC vendors</option>
          </select>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Message" className="ev-card rounded-xl px-3 py-2 text-[13px] ev-ink outline-none" />
          <button onClick={send} className="ev-tap ev-btn-primary rounded-xl px-4 py-2 text-[13px] flex items-center justify-center gap-1.5 self-start">
            <Send size={14} /> Send
          </button>
        </div>
        <p className="text-[12px] ev-muted mt-3">Sending here only appends to this session's list — real delivery routes through a backend once one exists.</p>
      </div>
      <DataTable
        columns={[
          { key: "audience", label: "Audience" }, { key: "title", label: "Message" }, { key: "sentOn", label: "Sent" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={sent}
      />
    </div>
  );
}

function AnalyticsScreen() {
  return (
    <div>
      <AdminTopBar title="Analytics" subtitle="Platform health metrics." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIS.analytics.map((k) => <KPICard key={k.label} {...k} />)}
      </div>
      <div className="ev-card rounded-2xl p-10 text-center text-[13px] ev-muted">
        Charts (GMV trend, category breakdown, vendor leaderboard) render here once real transaction data exists.
      </div>
    </div>
  );
}

function SettingsScreen() {
  const [autoMatch, setAutoMatch] = useState(true);
  const [maskedCalling, setMaskedCalling] = useState(true);
  return (
    <div>
      <AdminTopBar title="Platform Settings" subtitle="Platform-wide toggles. These map to server-side config, not client state." />
      <div className="ev-card rounded-2xl divide-y max-w-xl" style={{ borderColor: "#E9E2D6" }}>
        <ToggleRow label="Auto-match enquiries to vendors" desc="When on, new enquiries are matched to eligible vendors automatically." value={autoMatch} onChange={setAutoMatch} />
        <ToggleRow label="Masked calling required" desc="When on, Customer ↔ Vendor calls always route through the telecom gateway — no direct numbers ever shown." value={maskedCalling} onChange={setMaskedCalling} />
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 gap-4">
      <div>
        <div className="text-[13.5px] font-semibold ev-ink">{label}</div>
        <div className="text-[12px] ev-muted mt-0.5">{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} className={"w-10 h-6 rounded-full relative ev-tap shrink-0 " + (value ? "ev-bg-accent" : "bg-[#E9E2D6]")}>
        <div className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white" style={{ left: value ? "18px" : "3px" }} />
      </button>
    </div>
  );
}

/* ================= ROOT ================= */

const SCREENS = {
  dashboard: DashboardScreen, customers: CustomersScreen, vendors: VendorsScreen, kyc: VendorKYCScreen,
  bookings: BookingsScreen, enquiries: EnquiriesScreen, quotes: QuotesScreen, payments: PaymentsScreen,
  commission: CommissionScreen, payouts: PayoutsScreen, disputes: DisputesScreen, support: SupportScreen,
  notifications: NotificationsScreen, analytics: AnalyticsScreen, settings: SettingsScreen,
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

export default function EventraAdminApp({ adminUser = { name: "Admin", role: "Platform Admin" } }) {
  const [screen, setScreen] = useState("dashboard");
  const width = useViewport();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const ActiveScreen = SCREENS[screen] || DashboardScreen;

  return (
    <div className="ev min-h-screen flex" style={{ background: "#EDE7DC" }}>
      <style>{TOKENS}</style>
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

/* ---------------------------------------------------------------
   ROUTING (mirrors how you'd mount the Customer/Vendor apps)
   ---------------------------------------------------------------
   In App.jsx:

     import EventraApp from "./eventra-customer-app";
     import EventraVendorApp from "./eventra-vendor-app";
     import EventraAdminApp from "./eventra-admin-app";

     export default function App() {
       const path = window.location.pathname;
       if (path.startsWith("/admin")) return <EventraAdminApp />;
       if (path.startsWith("/vendor")) return <EventraVendorApp />;
       return <EventraApp />;
     }

   No router library needed for this — same reasoning as the other two
   apps: each app already does its own internal screen navigation with
   plain useState, so all App.jsx needs to decide is which of the three
   top-level apps to mount.
--------------------------------------------------------------- */
