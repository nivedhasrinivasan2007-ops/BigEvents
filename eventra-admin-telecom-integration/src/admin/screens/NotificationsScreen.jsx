import React, { useState } from "react";
import { Send } from "lucide-react";
import { AdminTopBar, DataTable, StatusBadge } from "../components/AdminUI";
import { MOCK_NOTIFICATIONS } from "../mockData";

export default function NotificationsScreen() {
  const [audience, setAudience] = useState("All Vendors");
  const [title, setTitle] = useState("");
  const [sent, setSent] = useState(MOCK_NOTIFICATIONS);

  function send() {
    if (!title.trim()) return;
    setSent((prev) => [
      { id: "n" + (prev.length + 1), audience, title, sentOn: "Just now", status: "sent" },
      ...prev,
    ]);
    setTitle("");
  }

  return (
    <div>
      <AdminTopBar title="Notifications" subtitle="Broadcast messages to customers or vendors." />

      <div className="ev-card rounded-2xl p-5 mb-6 max-w-xl">
        <label className="text-[12px] font-semibold ev-muted uppercase tracking-wide">New broadcast</label>
        <div className="flex flex-col gap-3 mt-2">
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="ev-card rounded-xl px-3 py-2 text-[13px] ev-ink outline-none"
          >
            <option>All Customers</option>
            <option>All Vendors</option>
            <option>Pending KYC vendors</option>
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Message"
            className="ev-card rounded-xl px-3 py-2 text-[13px] ev-ink outline-none"
          />
          <button onClick={send} className="ev-tap ev-btn-primary rounded-xl px-4 py-2 text-[13px] flex items-center justify-center gap-1.5 self-start">
            <Send size={14} /> Send
          </button>
        </div>
        <p className="text-[12px] ev-muted mt-3">
          Sending here only appends to this session's list — actual delivery (push/SMS/email) routes through
          notificationService.js once a backend exists.
        </p>
      </div>

      <DataTable
        columns={[
          { key: "audience", label: "Audience" },
          { key: "title", label: "Message" },
          { key: "sentOn", label: "Sent" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={sent}
      />
    </div>
  );
}
