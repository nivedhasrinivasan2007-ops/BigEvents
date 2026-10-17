import React, { useState } from "react";
import { AdminTopBar, DataTable, StatusBadge, AdminModal } from "../components/AdminUI";
import { MOCK_DISPUTES } from "../mockData";

export default function DisputesScreen() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [active, setActive] = useState(null);

  function resolve(id) {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: "resolved" } : d)));
    setActive(null);
  }

  return (
    <div>
      <AdminTopBar title="Disputes" subtitle="Escalations between a customer and a vendor over a booking." />
      <DataTable
        columns={[
          { key: "parties", label: "Parties" },
          { key: "reason", label: "Reason" },
          { key: "opened", label: "Opened" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={disputes}
        onRowClick={setActive}
        emptyLabel="No open disputes."
      />

      {active && (
        <AdminModal
          title={active.parties}
          onClose={() => setActive(null)}
          footer={
            active.status !== "resolved" && (
              <button onClick={() => resolve(active.id)} className="ev-tap ev-btn-primary rounded-xl px-4 py-2 text-[13px]">
                Mark resolved
              </button>
            )
          }
        >
          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between"><span className="ev-muted">Reason</span><span className="ev-ink font-medium">{active.reason}</span></div>
            <div className="flex items-center justify-between"><span className="ev-muted">Opened</span><span className="ev-ink font-medium">{active.opened}</span></div>
            <div className="flex items-center justify-between"><span className="ev-muted">Status</span><StatusBadge status={active.status} /></div>
            <p className="ev-muted pt-2">
              Full dispute history, attached evidence, and refund actions connect through disputeService.js
              once a backend exists.
            </p>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
