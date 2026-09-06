import React, { useState } from "react";
import { AdminTopBar, DataTable, StatusBadge, FilterBar } from "../components/AdminUI";
import { MOCK_VENDORS } from "../mockData";

export default function VendorsScreen({ go }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const rows = MOCK_VENDORS.filter((v) => {
    if (filter !== "all" && v.kyc !== filter) return false;
    if (q && !v.business.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <AdminTopBar title="Vendors" subtitle={`${MOCK_VENDORS.length} registered vendors`} onSearch={setQ} />
      <FilterBar
        filters={[
          { id: "all", label: "All" },
          { id: "verified", label: "KYC verified" },
          { id: "pending", label: "KYC pending" },
          { id: "rejected", label: "KYC rejected" },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "business", label: "Business" },
          { key: "owner", label: "Owner" },
          { key: "city", label: "City" },
          { key: "category", label: "Category" },
          { key: "bookings", label: "Bookings" },
          { key: "kyc", label: "KYC", render: (r) => <StatusBadge status={r.kyc} /> },
        ]}
        rows={rows}
        onRowClick={() => go("kyc")}
        emptyLabel="No vendors match this filter."
      />
    </div>
  );
}
