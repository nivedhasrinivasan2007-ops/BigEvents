import { useSyncExternalStore } from "react";

const STORAGE_KEY = "bigday_prototype_marketplace_v1";
export const PROTOTYPE_VENDOR_ID = "v1";

const DEFAULT_VENDORS = [
  {
    id: PROTOTYPE_VENDOR_ID,
    businessName: "Annapoorna Catering Co.",
    category: "Catering",
    location: "Chennai",
    status: "active",
  },
];

const listeners = new Set();

function createEmptyState() {
  return { vendors: DEFAULT_VENDORS, requirements: [], quotes: [] };
}

function readState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createEmptyState();

    const parsed = JSON.parse(stored);
    return {
      vendors: Array.isArray(parsed.vendors) && parsed.vendors.length ? parsed.vendors : DEFAULT_VENDORS,
      requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
    };
  } catch {
    return createEmptyState();
  }
}

let state = readState();

function notify() {
  listeners.forEach((listener) => listener());
}

function save(nextState) {
  state = nextState;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the current-tab prototype usable if browser storage is unavailable.
  }
  notify();
}

function makeId(prefix) {
  const randomId = globalThis.crypto?.randomUUID?.();
  return `${prefix}-${randomId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;
}

function onStorage(event) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  state = readState();
  notify();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", onStorage);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function usePrototypeState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function registerPrototypeVendor(vendor) {
  const existing = state.vendors.find((item) => item.id === vendor.id);
  const nextVendor = { ...existing, ...vendor };
  const vendors = existing
    ? state.vendors.map((item) => (item.id === vendor.id ? nextVendor : item))
    : [...state.vendors, nextVendor];
  save({ ...state, vendors });
  return nextVendor;
}

export function createRequirement(input) {
  const category = input.category || "Catering";
  const normalizedCategory = category.trim().toLowerCase();
  const normalizedLocation = (input.location || "").trim().toLowerCase();
  const matchedVendorIds = state.vendors
    .filter((vendor) => {
      const sameCategory = vendor.category.trim().toLowerCase() === normalizedCategory;
      const vendorLocation = vendor.location.trim().toLowerCase();
      const sameLocation = !normalizedLocation || vendorLocation.includes(normalizedLocation) || normalizedLocation.includes(vendorLocation);
      return vendor.status === "active" && sameCategory && sameLocation;
    })
    .map((vendor) => vendor.id);

  const requirement = {
    ...input,
    id: makeId("requirement"),
    category,
    matchedVendorIds,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  save({ ...state, requirements: [...state.requirements, requirement] });
  return requirement;
}

export function createQuote(input) {
  const amount = Number(input.amount);
  const requirement = state.requirements.find((item) => item.id === input.requirementId);
  if (!requirement || !Number.isFinite(amount) || amount <= 0) return null;

  const quote = {
    ...input,
    id: makeId("quote"),
    amount,
    status: "sent",
    createdAt: new Date().toISOString(),
  };
  const requirements = state.requirements.map((item) =>
    item.id === requirement.id ? { ...item, status: "quoted" } : item
  );
  save({ ...state, requirements, quotes: [...state.quotes, quote] });
  return quote;
}

export function acceptQuote(quoteId, customerId) {
  const quote = state.quotes.find((item) => item.id === quoteId);
  if (!quote) return null;

  const requirement = state.requirements.find((item) => item.id === quote.requirementId);
  if (!requirement || requirement.customerId !== customerId) return null;

  const quotes = state.quotes.map((item) => {
    if (item.requirementId !== requirement.id) return item;
    return { ...item, status: item.id === quoteId ? "accepted" : "not_selected" };
  });
  const requirements = state.requirements.map((item) =>
    item.id === requirement.id ? { ...item, status: "accepted" } : item
  );
  save({ ...state, requirements, quotes });
  return quotes.find((item) => item.id === quoteId);
}

export function updateRequirementStatus(requirementId, status) {
  const requirements = state.requirements.map((item) =>
    item.id === requirementId ? { ...item, status } : item
  );
  save({ ...state, requirements });
}

export function getRequirementsForCustomer(snapshot, customerId) {
  return snapshot.requirements.filter((item) => item.customerId === customerId);
}

export function getRequirementsForVendor(snapshot, vendorId) {
  return snapshot.requirements.filter((item) =>
    item.matchedVendorIds.includes(vendorId) && item.status !== "accepted" && item.status !== "rejected"
  );
}

export function getQuotesForRequirement(snapshot, requirementId) {
  return snapshot.quotes.filter((item) => item.requirementId === requirementId);
}

export function getQuotesForVendor(snapshot, vendorId) {
  return snapshot.quotes.filter((item) => item.vendorId === vendorId);
}