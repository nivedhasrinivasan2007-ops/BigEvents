import React from "react";
import { AdminTopBar, KPICard } from "../components/AdminUI";
import { MOCK_KPIS } from "../mockData";

export default function AnalyticsScreen() {
  return (
    <div>
      <AdminTopBar title="Analytics" subtitle="Platform health metrics." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIS.analytics.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>
      <div className="ev-card rounded-2xl p-10 text-center text-[13px] ev-muted">
        Charts (GMV trend, category breakdown, vendor leaderboard) render here once analyticsService.js is
        backed by real transaction data.
      </div>
    </div>
  );
}
