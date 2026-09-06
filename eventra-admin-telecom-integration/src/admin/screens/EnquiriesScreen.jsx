import React from "react";
import { AdminTopBar, DataTable, StatusBadge } from "../components/AdminUI";
import { MOCK_ENQUIRIES } from "../mockData";

export default function EnquiriesScreen() {
  return (
    <div>
      <AdminTopBar title="Enquiries" subtitle="Customer requirements currently being matched to vendors." />
      <DataTable
        columns={[
          { key: "customer", label: "Customer" },
          { key: "category", label: "Category" },
          { key: "city", label: "City" },
          { key: "date", label: "Event date" },
          { key: "matchedVendors", label: "Matched vendors" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={MOCK_ENQUIRIES}
      />
    </div>
  );
}
