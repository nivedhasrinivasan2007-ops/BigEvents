/* ---------------------------------------------------------------
   EVENTRA — Admin Auth (Phase 1, PROTOTYPE)
   -----------------------------------------------------------------
   ⚠️ DEV / PROTOTYPE ONLY — NOT PRODUCTION AUTHENTICATION.

   This is a client-side, hardcoded stand-in for a real backend admin
   login. It exists so /admin can be gated behind *something* while
   the real system doesn't exist yet. It is NOT secure:
     - The "password" is a literal string sitting in this file.
     - Anyone with browser devtools can read it or flip the session
       flag by hand.
     - There is no hashing, no token, no server-side verification.

   TODO(backend) — replace this whole file with:
     - POST /api/admin/login  { email, password }
         → verifies against a real admin user store (hashed passwords)
         → sets an httpOnly, Secure, SameSite cookie holding the
           session — the frontend never sees or touches the token
     - POST /api/admin/logout → clears that cookie server-side
     - A GET /api/admin/session (or similar) check on load, instead
       of the localStorage flag below, so "is logged in" is decided
       by the server, not by trusting the browser.
------------------------------------------------------------------- */

// DEV/PROTOTYPE credentials — never ship these, never reuse them for
// anything real. Swap this whole block out when the backend lands.
const DEV_ADMIN_CREDENTIALS = {
  email: "admin@bigday.dev",
  password: "bigdayAdmin@2007",
};

const SESSION_KEY = "bigday_admin_session";

/**
 * Attempts a prototype admin login.
 * @returns {{ success: true, admin: { name: string, role: string, email: string } } | { success: false, error: string }}
 */
export function loginAdmin(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();

  // TODO(backend): replace this comparison with a real fetch() to
  // POST /api/admin/login and let the server decide, over HTTPS,
  // against hashed credentials — never compare plaintext like this
  // in production.
  if (
    normalizedEmail === DEV_ADMIN_CREDENTIALS.email.toLowerCase() &&
    password === DEV_ADMIN_CREDENTIALS.password
  ) {
    const session = {
      admin: { name: "Admin", role: "Platform Admin", email: DEV_ADMIN_CREDENTIALS.email },
      loggedInAt: Date.now(),
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      // localStorage can fail (private browsing, quota, etc.) — the
      // login still "succeeds" for this render, it just won't
      // survive a refresh. Not worth blocking login over in a
      // prototype.
      console.warn("adminAuth: could not persist session", e);
    }
    return { success: true, admin: session.admin };
  }

  return { success: false, error: "Incorrect email or password." };
}

/** Clears the prototype admin session. */
export function logoutAdmin() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn("adminAuth: could not clear session", e);
  }
  // TODO(backend): also call POST /api/admin/logout so the server
  // invalidates the real session cookie, not just this local flag.
}

/** Returns the current admin session object, or null if logged out. */
export function getAdminSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.admin ? parsed : null;
  } catch (e) {
    return null;
  }
}

/** Convenience boolean check for the guard. */
export function isAdminLoggedIn() {
  return getAdminSession() !== null;
}
