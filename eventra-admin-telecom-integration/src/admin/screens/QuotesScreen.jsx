import React from "react";
import { AdminTopBar, DataTable, StatusBadge } from "../components/AdminUI";
import { MOCK_QUOTES } from "../mockData";

export default function QuotesScreen() {
  return (
    <div>
      <AdminTopBar title="Quotes" subtitle="Quotes drafted and sent by vendors. Sending requires verified KYC." />
      <DataTable
        columns={[
          { key: "vendor", label: "Vendor" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount" },
          { key: "sentOn", label: "Sent on" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_QUOTES}
      />
    </div>
  );
}
