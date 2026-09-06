/* =========================================================================
   analyticsService — platform metrics for the Admin dashboard/analytics
   screens. Real implementation aggregates over the transaction/booking
   ledger server-side — never computed by summing client-visible mock data.
========================================================================= */

export async function getDashboardKpis() {
  // TODO(backend): GET /admin/analytics/dashboard
  return [];
}

export async function getPlatformAnalytics(range) {
  // TODO(backend): GET /admin/analytics?range=…
  return [];
}
