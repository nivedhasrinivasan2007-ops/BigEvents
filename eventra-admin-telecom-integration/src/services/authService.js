/* =========================================================================
   authService — CUSTOMER / VENDOR / ADMIN session boundary.
   -------------------------------------------------------------------------
   Frontend route guards built from this are UX only. The real authorization
   boundary is server-side: every request to an admin/*, vendor/*, or
   customer/* API must independently verify the caller's role and identity
   against the session/token — a hidden route is not a secured route.
========================================================================= */

const ROLES = Object.freeze({
  CUSTOMER: "CUSTOMER",
  VENDOR: "VENDOR",
  ADMIN: "ADMIN",
});

export { ROLES };

// Mock in-memory session. Replace with a real token/cookie-backed session
// once auth has a backend (e.g. httpOnly session cookie + a /me endpoint).
let _session = null;

export async function login(role, identifier) {
  // TODO(backend): POST /auth/login — verify credentials/OTP server-side,
  // return a signed session token. Never trust a client-supplied role.
  _session = { role, id: identifier, name: identifier };
  return _session;
}

export async function logout() {
  _session = null;
}

export async function getSession() {
  return _session;
}

export async function requireRole(role) {
  // Frontend convenience only — see file header. The backend must re-check
  // this on every request, not trust that the UI enforced it.
  if (!_session || _session.role !== role) {
    throw new Error(`Not authorized: expected role ${role}`);
  }
  return _session;
}
