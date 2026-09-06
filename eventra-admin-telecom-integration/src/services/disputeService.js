/* =========================================================================
   disputeService — customer/vendor dispute records.
========================================================================= */

export async function openDispute(bookingId, raisedBy, reason) {
  // TODO(backend): POST /disputes
  return { id: "d_" + Date.now(), bookingId, raisedBy, reason, status: "open" };
}

export async function resolveDispute(disputeId, resolutionNote) {
  // TODO(backend): POST /admin/disputes/:id/resolve — admin-only.
  return { id: disputeId, status: "resolved", resolutionNote };
}

export async function listDisputes(filters = {}) {
  // TODO(backend): GET /admin/disputes?…
  return [];
}
