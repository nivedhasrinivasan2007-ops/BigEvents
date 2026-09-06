import React from "react";
import {
  LayoutDashboard, Users, Building2, ShieldCheck, CalendarCheck, ClipboardList,
  FileText, Wallet, Percent, Banknote, AlertTriangle, LifeBuoy, Bell,
  BarChart3, Settings as SettingsIcon, Search, ChevronDown, LogOut,
} from "lucide-react";

/* =========================================================================
   Admin shared UI primitives.
   Same visual language as the Customer/Vendor apps (see ../tokens.js) —
   deliberately a *different* shell (sidebar-first, dense, table-heavy)
   because Admin is a platform console, not a consumer/vendor mobile app.
========================================================================= */

export const ADMIN_NAV = [
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

export function AdminSidebar({ active, go, expanded, adminUser }) {
  return (
    <div
      className={
        "shrink-0 h-screen sticky top-0 flex flex-col ev-card border-r py-5 " +
        (expanded ? "w-64 px-4" : "w-[72px] px-2 items-center")
      }
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
              className={
                "ev-tap flex items-center gap-3 rounded-xl py-2.5 text-left " +
                (expanded ? "px-3" : "px-0 justify-center") +
                " " +
                (isActive ? "ev-bg-accent-soft ev-accent" : "ev-muted")
              }
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

export function AdminTopBar({ title, subtitle, onSearch, right }) {
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
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search…"
              className="bg-transparent outline-none text-[13px] w-full ev-ink placeholder:ev-faint"
            />
          </div>
        )}
        {right}
      </div>
    </div>
  );
}

export function KPICard({ label, value, delta, tone = "neutral", icon: Icon }) {
  const toneClass =
    tone === "up" ? "ev-success" : tone === "down" ? "ev-danger" : "ev-muted";
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
  verified: "ev-bg-success-soft ev-success",
  active: "ev-bg-success-soft ev-success",
  paid: "ev-bg-success-soft ev-success",
  resolved: "ev-bg-success-soft ev-success",
  pending: "ev-bg-gold-soft ev-gold",
  in_review: "ev-bg-gold-soft ev-gold",
  processing: "ev-bg-gold-soft ev-gold",
  open: "ev-bg-gold-soft ev-gold",
  rejected: "ev-bg-danger-soft ev-danger",
  failed: "ev-bg-danger-soft ev-danger",
  disputed: "ev-bg-danger-soft ev-danger",
  cancelled: "ev-bg-danger-soft ev-danger",
  info: "ev-bg-info-soft ev-info",
  draft: "ev-bg-info-soft ev-info",
};

export function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase().replace(/\s+/g, "_");
  const cls = STATUS_STYLES[key] || "ev-bg-info-soft ev-info";
  return (
    <span className={"inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize " + cls}>
      {String(status || "").replace(/_/g, " ")}
    </span>
  );
}

export function FilterBar({ filters, active, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={
            "ev-tap px-3 py-1.5 rounded-full text-[12.5px] font-semibold border " +
            (active === f.id
              ? "ev-bg-accent text-white border-transparent"
              : "ev-card ev-muted")
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export function DataTable({ columns, rows, emptyLabel = "Nothing here yet.", onRowClick }) {
  if (!rows.length) {
    return (
      <div className="ev-card rounded-2xl p-10 text-center text-[13px] ev-muted">{emptyLabel}</div>
    );
  }
  return (
    <div className="ev-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b" style={{ borderColor: "#E9E2D6" }}>
              {columns.map((c) => (
                <th key={c.key} className="text-left px-4 py-3 font-semibold ev-muted uppercase text-[11px] tracking-wide whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick && onRowClick(row)}
                className={"border-b last:border-0 " + (onRowClick ? "cursor-pointer hover:bg-[#FBF3F6]" : "")}
                style={{ borderColor: "#F1ECE1" }}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle whitespace-nowrap">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminModal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="ev-card rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col ev-anim">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E9E2D6" }}>
          <h3 className="ev-display text-[16px] font-semibold ev-ink">{title}</h3>
          <button onClick={onClose} className="ev-tap ev-muted text-[13px]">Close</button>
        </div>
        <div className="px-5 py-4 overflow-y-auto ev-scroll">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t flex items-center justify-end gap-2" style={{ borderColor: "#E9E2D6" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
