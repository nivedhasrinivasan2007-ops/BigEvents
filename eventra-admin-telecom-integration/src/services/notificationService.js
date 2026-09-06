/* =========================================================================
   notificationService — push / SMS / email broadcast and per-user alerts.
========================================================================= */

export async function sendBroadcast(audience, message) {
  // TODO(backend): POST /admin/notifications/broadcast — fans out to
  // push/SMS/email providers server-side.
  return { id: "n_" + Date.now(), audience, message, status: "sent" };
}

export async function notifyUser(userId, message) {
  // TODO(backend): POST /notifications
  return { id: "n_" + Date.now(), userId, message, status: "sent" };
}

export async function listNotifications(filters = {}) {
  // TODO(backend): GET /admin/notifications?…
  return [];
}
