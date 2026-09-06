/* =========================================================================
   bookingService — booking lifecycle.
   "Confirm booking" is one of the four actions gated on vendor KYC
   (see kycService.assertVerified).
========================================================================= */

import { assertVerified } from "./kycService";

export async function createBookingDraft(payload) {
  // TODO(backend): POST /bookings (draft)
  return { id: "bk_" + Date.now(), status: "draft", ...payload };
}

export async function confirmBooking(bookingId, vendorId) {
  await assertVerified(vendorId); // UX-layer check only — see kycService header.
  // TODO(backend): POST /bookings/:id/confirm — backend MUST re-check KYC.
  return { id: bookingId, status: "confirmed" };
}

export async function cancelBooking(bookingId, reason) {
  // TODO(backend): POST /bookings/:id/cancel
  return { id: bookingId, status: "cancelled", reason };
}

export async function listBookings(filters = {}) {
  // TODO(backend): GET /admin/bookings?…  or  GET /vendors/:id/bookings
  return [];
}
