# BigDay / Eventra — Admin + Telecom integration

This zip contains a `src/` tree meant to be **merged into your existing
local project** (the one you run with `npm run dev` in VS Code) — it is
not a new project and doesn't include its own `package.json`.

## What to do with it

1. Copy `src/customer/EventraApp.jsx` and `src/vendor/EventraVendorApp.jsx`
   over your existing Customer/Vendor files — **but check the import paths
   at the top of each file first.** They assume the folder layout below;
   if your real project already has Customer/Vendor somewhere else (e.g.
   directly in `src/`, not `src/customer/`), adjust the `../services/...`
   import paths to match, or move the files to match this layout.
2. Copy the `src/admin/` and `src/services/` folders in as-is.
3. Copy `src/App.jsx` in, or — more likely — merge its routing logic into
   whatever `App.jsx`/`main.jsx` you already have. If you already have
   *any* routing (even a simple one), don't replace it; just add the
   `/admin` branch to it.
4. Confirm your Vite entry point renders `<App />` from `src/App.jsx` (or
   wherever you merged the routing logic to).

## Expected folder layout

```
src/
  App.jsx                  → routes "/", "/vendor", "/admin"
  customer/EventraApp.jsx  → Customer Face (existing, now call-service-wired)
  vendor/EventraVendorApp.jsx → Vendor Face (existing, now KYC + call-service-wired)
  admin/
    AdminApp.jsx            → Admin Face root
    tokens.js                → same design tokens as Customer/Vendor
    mockData.js               → placeholder data for every Admin screen
    components/AdminUI.jsx     → shared sidebar, table, badge, modal, etc.
    screens/*.jsx                → the 15 screens listed in the brief
  services/
    README.md                 → explains the service-boundary pattern
    authService.js, vendorService.js, customerService.js, kycService.js,
    bookingService.js, enquiryService.js, quoteService.js,
    paymentService.js, payoutService.js, notificationService.js,
    disputeService.js, analyticsService.js
    telecom/
      telecomProvider.js        → provider-agnostic interface (mock impl)
      maskedCallService.js       → what Customer/Vendor screens import
      callService.js               → shared call-state machine
```

## Test checklist (Part 18 of the brief)

Once merged and `npm run dev` is running:

- `http://localhost:5173/` → Customer Face loads, existing flows unaffected
- `http://localhost:5173/vendor` → Vendor Face loads, existing flows unaffected
- `http://localhost:5173/admin` → Admin Face loads, sidebar nav works
- Vendor → Enquiries → an enquiry card now has a **Call** button (masked-call
  screen, no numbers shown) alongside Contact/Reject/Quote
- Vendor → Enquiries → Quote → if KYC status (toggle it live in Vendor →
  More → KYC status) isn't "verified", the send button is still clickable
  but shows a warning and blocks the send
- Vendor → Earnings → **Request Payout** is gated the same way — try it
  with KYC set to "pending" or "rejected" first, then "verified"
- Customer → an existing call flow → still numbers-hidden, now routed through
  the same `maskedCallService`
- No console errors, no duplicate React roots, Tailwind still applying to
  all three faces

## What's genuinely NOT done

See the full report in the chat for the complete list — the short version:
this is frontend architecture and UI only. No backend exists yet, so
nothing here is a real payment, a real masked call, or real auth. Every
service file says so at the top and is written so swapping in real
implementations later doesn't require touching the screens that call them.
