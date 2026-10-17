import React from "react";
import { AdminTopBar, DataTable, StatusBadge } from "../components/AdminUI";
import { MOCK_PAYMENTS } from "../mockData";

export default function PaymentsScreen() {
  return (
    <div>
      <AdminTopBar
        title="Payments"
        subtitle="Customer payments. Every row here should trace back to a verified payment-provider webhook, not client-side state."
      />
      <DataTable
        columns={[
          { key: "customer", label: "Customer" },
          { key: "booking", label: "Booking ID" },
          { key: "amount", label: "Amount" },
          { key: "method", label: "Method" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_PAYMENTS}
      />
    </div>
  );
}
