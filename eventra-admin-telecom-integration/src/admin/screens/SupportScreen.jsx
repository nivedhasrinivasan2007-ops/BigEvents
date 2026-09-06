import React, { useState } from "react";
import { AdminTopBar, DataTable, StatusBadge, FilterBar } from "../components/AdminUI";
import { MOCK_SUPPORT } from "../mockData";

export default function SupportScreen() {
  const [filter, setFilter] = useState("all");
  const rows = MOCK_SUPPORT.filter((s) => filter === "all" || s.status === filter);

  return (
    <div>
      <AdminTopBar title="Support" subtitle="Tickets raised by customers and vendors." />
      <FilterBar
        filters={[
          { id: "all", label: "All" },
          { id: "open", label: "Open" },
          { id: "resolved", label: "Resolved" },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "from", label: "From" },
          { key: "subject", label: "Subject" },
          { key: "opened", label: "Opened" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
      />
    </div>
  );
}
