import React from "react";
import { AdminTopBar, KPICard, DataTable, StatusBadge } from "../components/AdminUI";
import { MOCK_KPIS, MOCK_BOOKINGS, MOCK_KYC_QUEUE } from "../mockData";

export default function DashboardScreen({ go }) {
  return (
    <div>
      <AdminTopBar title="Dashboard" subtitle="Platform overview, at a glance." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIS.dashboard.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold ev-ink">Recent bookings</h2>
            <button onClick={() => go("bookings")} className="text-[12.5px] font-semibold ev-accent">View all</button>
          </div>
          <DataTable
            columns={[
              { key: "customer", label: "Customer" },
              { key: "vendor", label: "Vendor" },
              { key: "amount", label: "Amount" },
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
              { key: "vendor", label: "Vendor" },
              { key: "docType", label: "Documents" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={MOCK_KYC_QUEUE}
          />
        </div>
      </div>
    </div>
  );
}
