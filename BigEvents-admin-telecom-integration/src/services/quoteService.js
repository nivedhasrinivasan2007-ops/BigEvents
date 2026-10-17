/* =========================================================================
   quoteService — quote drafting and sending.
   "Send quote to customer" is one of the four actions gated on vendor KYC
   (see kycService.assertVerified). Saving a DRAFT is not gated — Part 5
   of the brief explicitly allows vendors to draft before verification.
========================================================================= */

import { assertVerified } from "./kycService";

export async function saveQuoteDraft(vendorId, payload) {
  // Not KYC-gated — vendors can draft quotes before verification.
  // TODO(backend): POST /quotes (draft)
  return { id: "q_" + Date.now(), status: "draft", vendorId, ...payload };
}

export async function sendQuote(vendorId, quoteId) {
  await assertVerified(vendorId); // UX-layer check only — see kycService header.
  // TODO(backend): POST /quotes/:id/send — backend MUST re-check KYC before
  // actually delivering the quote to the customer.
  return { id: quoteId, status: "sent" };
}

export async function listQuotes(filters = {}) {
  // TODO(backend): GET /admin/quotes?…  or  GET /vendors/:id/quotes
  return [];
}
