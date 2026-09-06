/* =========================================================================
   maskedCallService — the app-facing calling API.
   -------------------------------------------------------------------------
   Customer and Vendor screens import THIS file, never telecomProvider.js
   directly. This indirection is the actual "provider abstraction" Part 8
   of the brief asks for: swapping Exotel for Knowlarity (or anything else)
   later means changing which provider telecomProvider.js delegates to on
   the backend — this file's exported functions and their signatures don't
   need to change.

   No personal phone number ever passes through this file or anything that
   calls it. Only opaque user IDs go in; only a masked number (or nothing)
   comes out.
========================================================================= */

import { mockTelecomProvider } from "./telecomProvider";
import { CALL_STATES } from "./callService";

// Swap this for a real backend-selected provider once one exists.
// This binding itself is intentionally the only place a provider is chosen.
const provider = mockTelecomProvider;

export async function startMaskedCall({ fromUserId, toUserId, bookingId }) {
  // TODO(backend): this whole function should really be a single backend
  // endpoint call (POST /calls/start) — the frontend shouldn't even talk
  // to telecomProvider.js indirection once a backend exists; it should
  // just hit that endpoint and get back { callId, maskedNumber, state }.
  const { callId, maskedNumber } = await provider.initiateMaskedCall(fromUserId, toUserId, { bookingId });
  return { callId, maskedNumber, state: CALL_STATES.INCOMING };
}

export async function endMaskedCall(callId) {
  await provider.endCall(callId);
  return { callId, state: CALL_STATES.ENDED };
}

export async function getCallState(callId) {
  const { state } = await provider.getCallState(callId);
  return state;
}
