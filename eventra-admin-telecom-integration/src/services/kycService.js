/* =========================================================================
   kycService — the single source of truth for a vendor's KYC status,
   and the gate other services check before letting a vendor:
     - send a quote
     - confirm a booking
     - receive a payment
     - request a payout

   This file is deliberately the ONLY place that business rule is encoded.
   Every other service that needs to enforce it imports assertVerified()
   from here rather than re-checking status itself — so there's one place
   to get it right, and one place a backend implementation replaces.
========================================================================= */

export const KYC_STATUS = Object.freeze({
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
});

// Mock store: vendorId -> status. Replace with a real table/collection.
const _kycStore = new Map([
  ["v1", KYC_STATUS.VERIFIED],
  ["v2", KYC_STATUS.PENDING],
  ["v3", KYC_STATUS.REJECTED],
  ["v4", KYC_STATUS.VERIFIED],
]);

export async function getKycStatus(vendorId) {
  // TODO(backend): GET /vendors/:id/kyc
  return _kycStore.get(vendorId) || KYC_STATUS.PENDING;
}

export async function reviewKyc(submissionId, decision, reason) {
  // TODO(backend): POST /admin/kyc/:submissionId/review — admin-only,
  // must be re-authorized server-side (see authService.requireRole).
  return { id: submissionId, status: decision, reason: reason || null };
}

/**
 * Throws unless the vendor's KYC is VERIFIED. Call this at the top of any
 * action that Part 5 of the brief gates on KYC (sending a quote, confirming
 * a booking, receiving a payment, requesting a payout).
 *
 * IMPORTANT: this check running in the browser is a UX convenience (so the
 * Vendor Face can disable a button and explain why). It is NOT the real
 * enforcement. The backend endpoint behind each of those actions must
 * perform this same check independently before doing anything — a vendor
 * who bypasses the frontend must still be rejected server-side.
 */
export async function assertVerified(vendorId) {
  const status = await getKycStatus(vendorId);
  if (status !== KYC_STATUS.VERIFIED) {
    const err = new Error(`Vendor ${vendorId} is not KYC-verified (status: ${status})`);
    err.code = "KYC_NOT_VERIFIED";
    err.status = status;
    throw err;
  }
  return true;
}
