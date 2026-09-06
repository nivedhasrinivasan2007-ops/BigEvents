/* =========================================================================
   callService — the call-state machine shared by Customer and Vendor call
   UI (Part 7 of the brief). Neither app talks to telecom infrastructure
   directly — both go through maskedCallService.js, and both render UI
   driven by these states.
========================================================================= */

export const CALL_STATES = Object.freeze({
  INCOMING: "incoming",
  ACCEPTED: "accepted",
  CONNECTED: "connected",
  ENDED: "ended",
  MISSED: "missed",
  DECLINED: "declined",
});

// Valid transitions, so UI and any future backend event handler agree on
// what's allowed. Not enforced automatically here — components/handlers
// should check this before moving state.
export const CALL_TRANSITIONS = {
  [CALL_STATES.INCOMING]: [CALL_STATES.ACCEPTED, CALL_STATES.DECLINED, CALL_STATES.MISSED],
  [CALL_STATES.ACCEPTED]: [CALL_STATES.CONNECTED, CALL_STATES.ENDED],
  [CALL_STATES.CONNECTED]: [CALL_STATES.ENDED],
  [CALL_STATES.ENDED]: [],
  [CALL_STATES.MISSED]: [],
  [CALL_STATES.DECLINED]: [],
};

export function canTransition(from, to) {
  return (CALL_TRANSITIONS[from] || []).includes(to);
}

export const CALL_STATE_LABELS = {
  [CALL_STATES.INCOMING]: "Incoming call",
  [CALL_STATES.ACCEPTED]: "Connecting…",
  [CALL_STATES.CONNECTED]: "Connected",
  [CALL_STATES.ENDED]: "Call ended",
  [CALL_STATES.MISSED]: "Missed call",
  [CALL_STATES.DECLINED]: "Call declined",
};
