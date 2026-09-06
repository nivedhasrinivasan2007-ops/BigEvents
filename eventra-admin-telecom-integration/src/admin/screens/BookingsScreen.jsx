import React, { useState } from "react";
import { AdminTopBar, DataTable, StatusBadge, FilterBar } from "../components/AdminUI";
import { MOCK_BOOKINGS } from "../mockData";

export default function BookingsScreen() {
  const [filter, setFilter] = useState("all");
  const rows = MOCK_BOOKINGS.filter((b) => filter === "all" || b.status === filter);

  return (
    <div>
      <AdminTopBar title="Bookings" subtitle="All confirmed and cancelled bookings across the platform." />
      <FilterBar
        filters={[
          { id: "all", label: "All" },
          { id: "confirmed", label: "Confirmed" },
          { id: "cancelled", label: "Cancelled" },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "customer", label: "Customer" },
          { key: "vendor", label: "Vendor" },
          { key: "event", label: "Event" },
          { key: "date", label: "Date" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
      />
    </div>
  );
}
