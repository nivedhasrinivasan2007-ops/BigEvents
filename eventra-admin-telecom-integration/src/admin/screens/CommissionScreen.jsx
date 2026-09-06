import React, { useState } from "react";
import { AdminTopBar } from "../components/AdminUI";

/*
  Commission is a platform-wide setting today (single default rate) with
  room for category-level overrides. The actual rate applied to a booking
  must be resolved and stored server-side at the time of the transaction —
  this screen only edits the configured rate, it doesn't calculate anything.
*/

export default function CommissionScreen() {
  const [defaultRate, setDefaultRate] = useState(10);
  const [categoryRates] = useState([{ category: "Catering", rate: 10 }]);

  return (
    <div>
      <AdminTopBar title="Commission" subtitle="Platform commission configuration." />

      <div className="ev-card rounded-2xl p-5 mb-6 max-w-md">
        <label className="text-[12px] font-semibold ev-muted uppercase tracking-wide">Default commission rate</label>
        <div className="flex items-center gap-3 mt-2">
          <input
            type="number"
            value={defaultRate}
            onChange={(e) => setDefaultRate(Number(e.target.value))}
            className="ev-card rounded-xl px-3 py-2 w-24 text-[14px] font-semibold ev-ink outline-none"
          />
          <span className="ev-muted text-[13px]">% of booking value</span>
        </div>
        <p className="text-[12px] ev-muted mt-3">
          Changing this only updates the configured value shown here. The rate that actually applies to a
          transaction must be resolved and locked server-side at booking time (see commission handling in
          paymentService.js).
        </p>
      </div>

      <h2 className="text-[14px] font-semibold ev-ink mb-3">Category overrides</h2>
      <div className="ev-card rounded-2xl divide-y" style={{ borderColor: "#E9E2D6" }}>
        {categoryRates.map((c) => (
          <div key={c.category} className="flex items-center justify-between px-4 py-3 text-[13px]">
            <span className="ev-ink font-medium">{c.category}</span>
            <span className="ev-muted">{c.rate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
