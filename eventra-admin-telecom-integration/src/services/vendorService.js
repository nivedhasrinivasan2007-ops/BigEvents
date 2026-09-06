/* =========================================================================
   vendorService — vendor profile & business data.
========================================================================= */

export async function getVendor(vendorId) {
  // TODO(backend): GET /vendors/:id
  return { id: vendorId };
}

export async function updateVendorProfile(vendorId, patch) {
  // TODO(backend): PATCH /vendors/:id
  return { id: vendorId, ...patch };
}

export async function listVendors(filters = {}) {
  // TODO(backend): GET /admin/vendors?…  (admin-only, see authService)
  return [];
}
