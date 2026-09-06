import React, { useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { AdminTopBar, DataTable, StatusBadge, FilterBar, AdminModal } from "../components/AdminUI";
import { MOCK_KYC_QUEUE } from "../mockData";
import { KYC_STATUS, reviewKyc } from "../../services/kycService";

/*
  This screen is the enforcement point for the business rule in Part 5 of
  the brief: a vendor cannot send a quote, confirm a booking, receive a
  payment, or request a payout until an admin has set their KYC status to
  VERIFIED here. The actual gate lives server-side (see kycService.js) —
  this screen only calls into that boundary, it doesn't enforce anything
  itself.
*/

export default function VendorKYCScreen() {
  const [queue, setQueue] = useState(MOCK_KYC_QUEUE);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);

  const rows = queue.filter((k) => filter === "all" || k.status === filter);

  async function decide(id, decision, reason) {
    const updated = await reviewKyc(id, decision, reason); // TODO: backend-enforced in production
    setQueue((prev) => prev.map((k) => (k.id === id ? { ...k, status: updated.status, reason: updated.reason } : k)));
    setActive(null);
  }

  return (
    <div>
      <AdminTopBar title="Vendor KYC" subtitle="Verify vendor documents before they can quote, book, or get paid." />
      <FilterBar
        filters={[
          { id: "all", label: "All" },
          { id: KYC_STATUS.PENDING, label: "Pending" },
          { id: KYC_STATUS.VERIFIED, label: "Verified" },
          { id: KYC_STATUS.REJECTED, label: "Rejected" },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        columns={[
          { key: "vendor", label: "Vendor" },
          { key: "docType", label: "Documents" },
          { key: "submitted", label: "Submitted" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
        onRowClick={(r) => setActive(r)}
        emptyLabel="No KYC submissions in this state."
      />

      {active && (
        <AdminModal
          title={active.vendor}
          onClose={() => setActive(null)}
          footer={
            <>
              <button
                onClick={() => decide(active.id, KYC_STATUS.REJECTED, "Documents did not meet requirements")}
                className="ev-tap ev-btn-ghost rounded-xl px-4 py-2 text-[13px] flex items-center gap-1.5"
              >
                <ShieldX size={15} /> Reject
              </button>
              <button
                onClick={() => decide(active.id, KYC_STATUS.VERIFIED)}
                className="ev-tap ev-btn-primary rounded-xl px-4 py-2 text-[13px] flex items-center gap-1.5"
              >
                <ShieldCheck size={15} /> Verify
              </button>
            </>
          }
        >
          <div className="space-y-3 text-[13px]">
            <Row label="Documents" value={active.docType} />
            <Row label="Submitted" value={active.submitted} />
            <Row label="Current status" value={<StatusBadge status={active.status} />} />
            {active.reason && <Row label="Last reviewer note" value={active.reason} />}
            <p className="ev-muted pt-2">
              Document previews would render here once file storage / upload is wired to a real backend.
            </p>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="ev-muted">{label}</span>
      <span className="ev-ink font-medium">{value}</span>
    </div>
  );
}
