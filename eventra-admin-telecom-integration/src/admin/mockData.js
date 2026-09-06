/* =========================================================================
   ADMIN MOCK DATA
   -------------------------------------------------------------------------
   Every array here stands in for a future service call (see src/services/).
   None of this is persisted or real — it exists so the Admin UI has
   something to render. When wiring up the backend, replace the import of
   this file in each screen with a call to the matching service function.
========================================================================= */

export const MOCK_CUSTOMERS = [
  { id: "c1", name: "Ritika Menon", phone: "•••• 4821", city: "Chennai", events: 2, joined: "12 Jan 2026", status: "active" },
  { id: "c2", name: "Arvind Sethi", phone: "•••• 7710", city: "Bengaluru", events: 1, joined: "03 Feb 2026", status: "active" },
  { id: "c3", name: "Priya Kannan", phone: "•••• 2290", city: "Chennai", events: 0, joined: "18 Feb 2026", status: "active" },
  { id: "c4", name: "Sameer Iyer", phone: "•••• 5561", city: "Coimbatore", events: 3, joined: "22 Nov 2025", status: "suspended" },
];

export const MOCK_VENDORS = [
  { id: "v1", business: "Chettinad Feasts Catering", owner: "Meena R.", city: "Chennai", category: "Catering", kyc: "verified", bookings: 18, status: "active" },
  { id: "v2", business: "The Banana Leaf Co.", owner: "Suresh K.", city: "Chennai", category: "Catering", kyc: "pending", bookings: 0, status: "active" },
  { id: "v3", business: "Spice Route Events", owner: "Fathima N.", city: "Coimbatore", category: "Catering", kyc: "rejected", bookings: 2, status: "active" },
  { id: "v4", business: "Royal Cauvery Caterers", owner: "Dinesh V.", city: "Bengaluru", category: "Catering", kyc: "verified", bookings: 41, status: "active" },
];

export const MOCK_KYC_QUEUE = [
  { id: "k1", vendor: "The Banana Leaf Co.", docType: "GST + Aadhaar", submitted: "01 Sep 2026", status: "pending" },
  { id: "k2", vendor: "Spice Route Events", docType: "FSSAI License", submitted: "28 Aug 2026", status: "rejected", reason: "Document illegible — resubmission requested" },
  { id: "k3", vendor: "Marina Catering Co.", docType: "GST + Aadhaar", submitted: "30 Aug 2026", status: "pending" },
];

export const MOCK_BOOKINGS = [
  { id: "bk1", customer: "Ritika Menon", vendor: "Chettinad Feasts Catering", event: "Wedding · 450 guests", date: "14 Nov 2026", amount: "₹4,85,000", status: "confirmed" },
  { id: "bk2", customer: "Arvind Sethi", vendor: "Royal Cauvery Caterers", event: "Corporate · 120 guests", date: "22 Oct 2026", amount: "₹1,20,000", status: "confirmed" },
  { id: "bk3", customer: "Sameer Iyer", vendor: "Chettinad Feasts Catering", event: "Birthday · 60 guests", date: "05 Oct 2026", amount: "₹68,000", status: "cancelled" },
];

export const MOCK_ENQUIRIES = [
  { id: "e1", customer: "Priya Kannan", category: "Catering", city: "Chennai", date: "20 Sep 2026", matchedVendors: 4, status: "open" },
  { id: "e2", customer: "Arvind Sethi", category: "Catering", city: "Bengaluru", date: "18 Sep 2026", matchedVendors: 6, status: "open" },
];

export const MOCK_QUOTES = [
  { id: "q1", vendor: "Chettinad Feasts Catering", customer: "Ritika Menon", amount: "₹4,85,000", sentOn: "10 Sep 2026", status: "accepted" },
  { id: "q2", vendor: "The Banana Leaf Co.", customer: "Priya Kannan", amount: "—", sentOn: "—", status: "draft" },
];

export const MOCK_PAYMENTS = [
  { id: "p1", customer: "Ritika Menon", booking: "bk1", amount: "₹1,45,500", method: "UPI", date: "12 Sep 2026", status: "paid" },
  { id: "p2", customer: "Arvind Sethi", booking: "bk2", amount: "₹36,000", method: "Card", date: "05 Sep 2026", status: "paid" },
  { id: "p3", customer: "Sameer Iyer", booking: "bk3", amount: "₹68,000", method: "UPI", date: "01 Sep 2026", status: "failed" },
];

export const MOCK_PAYOUTS = [
  { id: "po1", vendor: "Chettinad Feasts Catering", amount: "₹4,36,500", commission: "₹48,500 (10%)", cycle: "1–15 Sep", status: "processing" },
  { id: "po2", vendor: "Royal Cauvery Caterers", amount: "₹1,08,000", commission: "₹12,000 (10%)", cycle: "1–15 Sep", status: "paid" },
];

export const MOCK_DISPUTES = [
  { id: "d1", parties: "Sameer Iyer vs Chettinad Feasts Catering", reason: "Booking cancelled, refund pending", opened: "02 Sep 2026", status: "open" },
];

export const MOCK_SUPPORT = [
  { id: "s1", from: "Priya Kannan (Customer)", subject: "Vendor not responding to enquiry", opened: "01 Sep 2026", status: "open" },
  { id: "s2", from: "Suresh K. (Vendor)", subject: "KYC document re-upload not working", opened: "31 Aug 2026", status: "resolved" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", audience: "All Vendors", title: "Payout cycle moved to 1st & 15th", sentOn: "28 Aug 2026", status: "sent" },
  { id: "n2", audience: "Pending KYC vendors", title: "Reminder: complete KYC to start quoting", sentOn: "30 Aug 2026", status: "sent" },
];

export const MOCK_KPIS = {
  dashboard: [
    { label: "GMV (this month)", value: "₹18.4L", delta: "+12% vs last month", tone: "up" },
    { label: "Active Bookings", value: "62", delta: "+5 this week", tone: "up" },
    { label: "Pending KYC", value: "3", delta: "Needs review", tone: "down" },
    { label: "Open Disputes", value: "1", delta: "1 unresolved", tone: "down" },
  ],
  analytics: [
    { label: "Take Rate", value: "10.2%" },
    { label: "Avg. Booking Value", value: "₹1.9L" },
    { label: "Vendor Retention (90d)", value: "88%" },
    { label: "Enquiry → Booking", value: "24%" },
  ],
};
