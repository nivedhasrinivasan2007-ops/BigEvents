/* =========================================================================
   payoutService — vendor payouts.
   "Requesting payouts" is one of the four actions gated on vendor KYC
   (see kycService.assertVerified). Commission split is resolved
   server-side at payout time, not calculated in the frontend.
========================================================================= */

import { assertVerified } from "./kycService";

export async function requestPayout(vendorId, cycleId) {
  await assertVerified(vendorId); // UX-layer check only — see kycService header.
  // TODO(backend): POST /payouts — server resolves commission, calls the
  // payment provider's payout/transfer API. No provider secrets here.
  return { id: "po_" + Date.now(), vendorId, cycleId, status: "processing" };
}

export async function getPayoutStatus(payoutId) {
  // TODO(backend): GET /payouts/:id
  return { id: payoutId, status: "processing" };
}

export async function listPayouts(filters = {}) {
  // TODO(backend): GET /admin/payouts?…  or  GET /vendors/:id/payouts
  return [];
}
