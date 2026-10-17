import React, { useState } from "react";
import { AdminTopBar } from "../components/AdminUI";

export default function SettingsScreen() {
  const [autoMatch, setAutoMatch] = useState(true);
  const [maskedCalling, setMaskedCalling] = useState(true);

  return (
    <div>
      <AdminTopBar title="Platform Settings" subtitle="Platform-wide toggles. These map to server-side config, not client state." />
      <div className="ev-card rounded-2xl divide-y max-w-xl" style={{ borderColor: "#E9E2D6" }}>
        <ToggleRow
          label="Auto-match enquiries to vendors"
          desc="When on, new enquiries are matched to eligible vendors automatically."
          value={autoMatch}
          onChange={setAutoMatch}
        />
        <ToggleRow
          label="Masked calling required"
          desc="When on, Customer ↔ Vendor calls always route through the telecom gateway — no direct numbers ever shown."
          value={maskedCalling}
          onChange={setMaskedCalling}
        />
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 gap-4">
      <div>
        <div className="text-[13.5px] font-semibold ev-ink">{label}</div>
        <div className="text-[12px] ev-muted mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={"w-10 h-6 rounded-full relative ev-tap shrink-0 " + (value ? "ev-bg-accent" : "bg-[#E9E2D6]")}
      >
        <div className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white" style={{ left: value ? "18px" : "3px" }} />
      </button>
    </div>
  );
}
