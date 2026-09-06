/* =========================================================================
   customerService — customer profile data.
========================================================================= */

export async function getCustomer(customerId) {
  // TODO(backend): GET /customers/:id
  return { id: customerId };
}

export async function updateCustomerProfile(customerId, patch) {
  // TODO(backend): PATCH /customers/:id
  return { id: customerId, ...patch };
}

export async function listCustomers(filters = {}) {
  // TODO(backend): GET /admin/customers?…  (admin-only, see authService)
  return [];
}
