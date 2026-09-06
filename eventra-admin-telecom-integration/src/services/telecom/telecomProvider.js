/* =========================================================================
   telecomProvider — the interface a real telecom/VoIP adapter implements.
   -------------------------------------------------------------------------
   This file defines the SHAPE of a provider integration (Exotel,
   Knowlarity, Twilio, etc.) — it does not call any real provider, and it
   never will from the frontend. A real implementation of this interface
   lives on the BACKEND, where provider API keys/secrets actually are.

   The frontend only ever talks to maskedCallService.js, which in turn
   talks to a backend endpoint. This file exists so that boundary is
   explicit and typed-by-convention, even before a backend exists.

   Architecture (Part 6 of the brief):

     Customer → BigDay backend → Telecom/VoIP provider → Vendor
     Vendor   → BigDay backend → Telecom/VoIP provider → Customer

   The backend brokers a masked/virtual number pair for the call; neither
   party's real number is ever sent to the frontend, let alone to each
   other.
========================================================================= */

/**
 * @typedef {Object} TelecomProvider
 * @property {(callerId: string, calleeId: string, bookingContext: object) => Promise<{callId: string, maskedNumber: string}>} initiateMaskedCall
 *   Ask the backend to broker a call. Returns a masked number for the
 *   caller's device to dial — never the callee's real number.
 * @property {(callId: string) => Promise<void>} endCall
 * @property {(callId: string) => Promise<{state: string}>} getCallState
 */

/**
 * Placeholder provider used only so the app has *something* to call in
 * dev/demo mode. It never reaches a real telecom network — it just
 * simulates state transitions locally. Swap this out (via env-driven
 * selection on the BACKEND, not here) for a real Exotel/Knowlarity/etc.
 * adapter when telecom integration is ready.
 *
 * @type {TelecomProvider}
 */
export const mockTelecomProvider = {
  async initiateMaskedCall(callerId, calleeId, bookingContext) {
    // TODO(backend): replace with a real call to the telecom provider's
    // click-to-call / masked-number API, from the SERVER, using
    // server-held credentials.
    return {
      callId: "call_" + Date.now(),
      maskedNumber: "+91 4000-000-000", // never a real number in mock mode
    };
  },

  async endCall(callId) {
    // TODO(backend): tell the provider to tear down the call leg.
    return;
  },

  async getCallState(callId) {
    // TODO(backend): poll or receive a webhook for real call state.
    return { state: "ended" };
  },
};
