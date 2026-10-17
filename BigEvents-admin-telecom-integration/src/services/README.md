# services/

Every file in this folder is a **boundary**, not a backend. Each exported
function currently returns mock/local data (often just echoing back what
was passed in, occasionally reading from `src/admin/mockData.js`). Nothing
here is persisted anywhere real.

The point of having these functions at all — instead of components reading
mock arrays directly — is so that wiring up the real backend later is a
one-file change per service: swap the mock implementation for a `fetch`/
API-client call, keep the same function signature, and every screen that
imports it keeps working unmodified.

Rules every service in this folder follows:

- **No secrets, no provider credentials, ever.** Telecom keys, payment
  provider keys, etc. belong in backend environment variables, never in
  this frontend codebase.
- **No fake success pretending to be real.** Where a function stands in
  for something that needs a verified backend action (a payment, a payout,
  a KYC verification with real legal weight), it's commented as such —
  it's a UI stand-in, not a claim that the action really happened.
- **Async by default.** Every exported function returns a Promise (even
  though the mock body resolves instantly), so call sites don't need to
  change when the mock is replaced with a real network call.

## Files

| File | Responsibility |
|---|---|
| `authService.js` | Login/session/role for the three roles (CUSTOMER, VENDOR, ADMIN). |
| `vendorService.js` | Vendor profile, business data. |
| `customerService.js` | Customer profile data. |
| `kycService.js` | KYC status machine (PENDING / VERIFIED / REJECTED) + the gate used by other services. |
| `bookingService.js` | Booking lifecycle. |
| `enquiryService.js` | Customer enquiries → vendor matching. |
| `quoteService.js` | Quote drafting/sending — sending is KYC-gated. |
| `paymentService.js` | Customer payments — real implementation is provider-webhook driven, never client-confirmed. |
| `payoutService.js` | Vendor payouts — KYC-gated, commission-aware. |
| `notificationService.js` | Push/SMS/email broadcast. |
| `disputeService.js` | Dispute records between customer and vendor. |
| `analyticsService.js` | Platform metrics. |
| `telecom/telecomProvider.js` | Provider-agnostic interface a real telecom/VoIP adapter would implement. |
| `telecom/maskedCallService.js` | App-facing masked-calling API — the thing screens actually import. |
| `telecom/callService.js` | Call-state machine shared by Customer and Vendor call UI. |
