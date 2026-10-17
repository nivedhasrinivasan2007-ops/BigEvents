/* =========================================================================
   paymentService — customer payments.
   -------------------------------------------------------------------------
   "Receiving payments" is one of the four actions gated on vendor KYC
   (see kycService.assertVerified) — a booking can't move money to an
   unverified vendor.

   Real flow (Part 12 of the brief):
     Customer payment → server → payment provider → verified webhook →
     transaction/ledger entry → commission split → vendor earnings → payout.

   Nothing in this file should ever be treated as a real payment result.
   There is intentionally no "markPaymentSuccess" function here — a
   payment's true status can only ever come from a verified provider
   webhook hitting the backend, never from the client claiming success.
========================================================================= */

import { assertVerified } from "./kycService";

export async function initiatePayment(bookingId, vendorId, amount) {
  await assertVerified(vendorId); // UX-layer check only — see kycService header.
  // TODO(backend): POST /payments/initiate — returns a provider session/
  // intent for the frontend to redirect into. The frontend never sees
  // provider secrets.
  return { id: "pay_" + Date.now(), bookingId, amount, status: "processing" };
}

export async function getPaymentStatus(paymentId) {
  // TODO(backend): GET /payments/:id — status is set by the backend only
  // in response to a verified provider webhook, never by the client.
  return { id: paymentId, status: "processing" };
}

export async function listPayments(filters = {}) {
  // TODO(backend): GET /admin/payments?…
  return [];
}
