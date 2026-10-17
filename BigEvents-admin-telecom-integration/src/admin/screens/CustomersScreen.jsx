import React, { useState } from "react";
import { AdminTopBar, DataTable, StatusBadge, FilterBar } from "../components/AdminUI";
import { MOCK_CUSTOMERS } from "../mockData";

export default function CustomersScreen() {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const rows = MOCK_CUSTOMERS.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <AdminTopBar title="Customers" subtitle={`${MOCK_CUSTOMERS.length} registered customers`} onSearch={setQ} />
      <FilterBar
        filters={[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "suspended", label: "Suspended" },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone (masked)" },
          { key: "city", label: "City" },
          { key: "events", label: "Events booked" },
          { key: "joined", label: "Joined" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
        emptyLabel="No customers match this filter."
      />
    </div>
  );
}
