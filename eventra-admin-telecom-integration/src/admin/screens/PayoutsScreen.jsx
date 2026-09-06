import React from "react";
import { AdminTopBar, DataTable, StatusBadge } from "../components/AdminUI";
import { MOCK_PAYOUTS } from "../mockData";

export default function PayoutsScreen() {
  return (
    <div>
      <AdminTopBar
        title="Vendor Payouts"
        subtitle="Payout requests, gated on verified KYC. Real disbursal happens through a payment provider, never client-side."
      />
      <DataTable
        columns={[
          { key: "vendor", label: "Vendor" },
          { key: "amount", label: "Payout amount" },
          { key: "commission", label: "Commission withheld" },
          { key: "cycle", label: "Cycle" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_PAYOUTS}
      />
    </div>
  );
}
