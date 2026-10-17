/* =========================================================================
   enquiryService — customer requirement capture → vendor matching.
========================================================================= */

export async function createEnquiry(payload) {
  // TODO(backend): POST /enquiries — triggers server-side vendor matching.
  return { id: "e_" + Date.now(), status: "open", ...payload };
}

export async function getMatchedVendors(enquiryId) {
  // TODO(backend): GET /enquiries/:id/matches
  return [];
}

export async function listEnquiries(filters = {}) {
  // TODO(backend): GET /admin/enquiries?…  or  GET /vendors/:id/enquiries
  return [];
}
