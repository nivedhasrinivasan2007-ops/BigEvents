import React, { useEffect, useRef, useState } from "react";
import {
  getCurrentVendor,
  getVendorProfile,
  onVendorAuthStateChange,
  signInVendor,
  signOutVendor,
  signUpVendor,
} from "./services/authService";
import {
  createQuote,
  getQuotesForVendor,
  getRequirementsForVendor,
  PROTOTYPE_VENDOR_ID,
  registerPrototypeVendor,
  updateRequirementStatus,
  usePrototypeState,
} from "./services/prototypeStore";
import {
  ChevronLeft, ChevronRight, Home, Calendar, Wallet, User, Check, Star,
  MapPin, Users, Clock, ShieldCheck, Send, Plus, ChefHat,
  CircleCheck, X, Sparkles, Bell, ArrowRight, Camera, Info,
  FileText, ClipboardList, Package, Utensils, Phone, MessageCircle,
  Reply, Building2, CreditCard, Upload, MoreHorizontal, Briefcase,
  AlertCircle, Settings as SettingsIcon, LogOut, BadgeCheck, Pencil
} from "lucide-react";

/* ---------------------------------------------------------------
   EVENTRA — Vendor App Prototype (Phase 1 MVP)
   Same design system as the Customer app — separate file, nothing shared code-wise,
   but visually and structurally one product family.
--------------------------------------------------------------- */

const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap');
  .ev { font-family: 'Inter', sans-serif; color: #211E1B; }
  .ev-display { font-family: 'Fraunces', serif; }
  .ev-display-italic { font-family: 'Fraunces', serif; font-style: italic; }
  .ev-bg { background: #FBF8F3; }
  .ev-ink { color: #211E1B; }
  .ev-muted { color: #837B6F; }
  .ev-faint { color: #A79E90; }
  .ev-accent { color: #96114C; }
  .ev-bg-accent { background: #96114C; }
  .ev-bg-accent-soft { background: #FBEAF1; }
  .ev-gold { color: #A9832E; }
  .ev-bg-gold-soft { background: #FBF2E1; }
  .ev-success { color: #2F7A52; }
  .ev-bg-success-soft { background: #E9F5EE; }
  .ev-info { color: #2A6F97; }
  .ev-bg-info-soft { background: #E7F1F8; }
  .ev-danger { color: #B23B4A; }
  .ev-bg-danger-soft { background: #F8DCE0; }
  .ev-border { border-color: #E9E2D6; }
  .ev-card { background: #FFFFFF; border: 1px solid #E9E2D6; }
  .ev-btn-primary { background: #96114C; color: #FFF8F1; font-weight: 600; transition: transform .15s ease, background .15s ease; }
  .ev-btn-primary:active { transform: scale(0.97); background: #7C0E3F; }
  .ev-btn-ghost { background: transparent; color: #96114C; border: 1.5px solid #E9CBDA; font-weight: 600; }
  .ev-btn-ghost:active { transform: scale(0.97); }
  .ev-tap:active { transform: scale(0.97); }
  .ev-scroll::-webkit-scrollbar { display: none; }
  .ev-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes ev-fade-in { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
  .ev-anim { animation: ev-fade-in .28s ease; }
`;

const inr = (n) => "₹" + n.toLocaleString("en-IN");

/* ---------------- Mock data ---------------- */

const IMAGES = {
  food1: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
  buffet: "https://images.unsplash.com/photo-1686853021522-1b0e9a81706e?auto=format&fit=crop&w=800&q=80",
  staff: "https://images.unsplash.com/photo-1719329466711-743e0121235d?auto=format&fit=crop&w=600&q=80",
};

function VendorPhoto({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={className + " ev-bg-accent-soft flex items-center justify-center"}><ChefHat size={22} className="ev-accent" style={{ opacity: 0.6 }} /></div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className + " object-cover"} />;
}

const BUSINESS = {
  name: "Annapoorna Catering Co.",
  owner: "Suresh Kumar",
  phone: "+91 98••• •• 210",
  email: "contact@annapoornacatering.in",
  address: "24, Kasturba Nagar, Adyar",
  city: "Chennai",
  serviceArea: "Chennai, Tambaram, OMR — 25km radius",
  category: "Catering",
  experience: "9 yrs",
  description: "South Indian wedding catering specialists known for authentic sadhya-style service, live counters, and dependable large-scale execution.",
  languages: ["Tamil", "English", "Telugu"],
  eventTypes: ["Wedding", "Reception", "Engagement", "Corporate Event"],
  verification: "Verified",
  rating: 4.8,
  reviewCount: 214,
  image: IMAGES.food1,
};

const KYC_DOCS = [
  { label: "PAN Card", status: "Verified" },
  { label: "Aadhaar / KYC", status: "Verified" },
  { label: "GST Registration", status: "Verified" },
  { label: "FSSAI License", status: "Verified" },
];
const BANK = { accountHolder: "Suresh Kumar", accountLast4: "4521", ifsc: "on file" };

/* =====================================================================
   SHARED CAPACITY ENGINE — v1.0
   This block must stay byte-identical to the copy in eventra-customer-app.jsx.
   There is no cross-file import in this environment, so "shared" means
   "single canonical implementation, duplicated verbatim" rather than one
   physically shared module. When a real backend exists, this whole block
   moves server-side and the duplication problem disappears.
   Canonical model: capacity lives at the team/resource level. A date's
   status is DERIVED from teams + bookings, never stored independently.
===================================================================== */
const capacityEngine = {
  getTeamCapacity: (team) => team.capacity,
  getTotalCapacity: (teams) => teams.reduce((s, t) => s + t.capacity, 0),
  getBookedGuestCount: (bookings, dateKey) => bookings.filter((b) => b.dateKey === dateKey).reduce((s, b) => s + b.guests, 0),
  getRemainingCapacity: (teams, bookings, dateKey) => Math.max(capacityEngine.getTotalCapacity(teams) - capacityEngine.getBookedGuestCount(bookings, dateKey), 0),
  getAvailabilityStatus: (remaining, total) => {
    if (remaining <= 0) return "full";
    if (remaining < total * 0.3) return "limited";
    return "available";
  },
};
// Deterministic "other customers' bookings" texture generator — identical in both files.
function generateFillerBookings(teams, seed) {
  const total = capacityEngine.getTotalCapacity(teams);
  const bookings = [];
  for (let day = 1; day <= 28; day++) {
    const amt = (day * 37 + seed * 53) % (total + 1);
    if (amt > total * 0.15) bookings.push({ dateKey: `2027-02-${String(day).padStart(2, "0")}`, guests: Math.min(amt, total) });
  }
  return bookings;
}

const TEAMS = [
  { id: "t1", name: "Chef Team A", capacity: 300, members: 4, status: "Available" },
  { id: "t2", name: "Chef Team B", capacity: 300, members: 3, status: "Assigned" },
  { id: "t3", name: "Chef Team C", capacity: 200, members: 2, status: "Available" },
];
const TOTAL_CAPACITY = capacityEngine.getTotalCapacity(TEAMS);

const STAFF = [
  { id: "s1", name: "Murugan K.", role: "Chef", team: "Chef Team A", status: "Active" },
  { id: "s2", name: "Lakshmi P.", role: "Assistant Chef", team: "Chef Team A", status: "Active" },
  { id: "s3", name: "Ravi S.", role: "Server", team: "Chef Team A", status: "Active" },
  { id: "s4", name: "Anitha M.", role: "Manager", team: "Chef Team A", status: "Active" },
  { id: "s5", name: "Karthik V.", role: "Chef", team: "Chef Team B", status: "Active" },
  { id: "s6", name: "Divya R.", role: "Server", team: "Chef Team B", status: "On Leave" },
  { id: "s7", name: "Selvam T.", role: "Driver", team: "Chef Team B", status: "Active" },
  { id: "s8", name: "Priya N.", role: "Chef", team: "Chef Team C", status: "Active" },
  { id: "s9", name: "Ganesh B.", role: "Server", team: "Chef Team C", status: "Active" },
];

const RESOURCES = [
  { id: "r1", category: "Plates", label: "Steel dinner plate sets", quantity: 800, status: "Available" },
  { id: "r2", category: "Tables", label: "Round banquet tables (10-seater)", quantity: 40, status: "Assigned" },
  { id: "r3", category: "Serving Equipment", label: "Chafing dishes", quantity: 60, status: "Available" },
  { id: "r4", category: "Cooking Equipment", label: "LPG commercial burners", quantity: 12, status: "Available" },
  { id: "r5", category: "Cooking Equipment", label: "Live dosa counter griddles", quantity: 3, status: "Unavailable" },
  { id: "r6", category: "Vehicles", label: "Catering delivery vans", quantity: 4, status: "Assigned" },
];

// Filler bookings represent other customers' bookings not individually modeled — combined with named BOOKINGS for capacity math.
const FILLER_BOOKINGS = generateFillerBookings(TEAMS, 11);

function bookingsForCapacity(namedBookings) {
  return [...namedBookings.map((b) => ({ dateKey: b.dateKey, guests: b.guests })), { dateKey: "2027-02-14", guests: 350 }, ...FILLER_BOOKINGS];
}
function dayStatus(day, namedBookings) {
  const dateKey = `2027-02-${String(day).padStart(2, "0")}`;
  const bookings = bookingsForCapacity(namedBookings);
  const total = capacityEngine.getTotalCapacity(TEAMS);
  const booked = capacityEngine.getBookedGuestCount(bookings, dateKey);
  const remaining = capacityEngine.getRemainingCapacity(TEAMS, bookings, dateKey);
  const status = capacityEngine.getAvailabilityStatus(remaining, total);
  return { booked, remaining, status };
}
const CAL_STYLE = {
  available: { bg: "#E9F5EE", text: "#2F7A52", dot: "#2F7A52", label: "Available" },
  limited: { bg: "#FBF2E1", text: "#A9832E", dot: "#A9832E", label: "Limited" },
  full: { bg: "#F8DCE0", text: "#B23B4A", dot: "#B23B4A", label: "Fully Booked" },
};

const INITIAL_MENUS = [
  {
    id: "m1", name: "Classic South Indian Wedding Menu",
    categories: [
      { name: "Welcome Drinks", items: [{ name: "Filter Coffee", included: true }, { name: "Buttermilk", included: true }] },
      { name: "Starters", items: [{ name: "Mysore Bonda", included: true }, { name: "Veg Cutlet", included: true }] },
      { name: "Main Course", items: [{ name: "Sambar", included: true }, { name: "Rasam", included: true }, { name: "Kootu", included: true }] },
      { name: "Rice", items: [{ name: "Steamed Rice", included: true }, { name: "Curd Rice", included: true }] },
      { name: "Desserts", items: [{ name: "Payasam", included: true }, { name: "Live Dosa Counter", included: false }] },
    ],
  },
  {
    id: "m2", name: "Premium Multi-Cuisine Menu",
    categories: [
      { name: "Welcome Drinks", items: [{ name: "Mocktails", included: true }] },
      { name: "Starters", items: [{ name: "Paneer Tikka", included: true }, { name: "Spring Rolls", included: true }] },
      { name: "Main Course", items: [{ name: "North Indian Curries", included: true }, { name: "South Indian Curries", included: true }] },
      { name: "Live Counters", items: [{ name: "Chaat Counter", included: true }, { name: "Ice Cream Counter", included: false }] },
    ],
  },
];

const INITIAL_PACKAGES = [
  { id: "p1", tier: "Basic", price: 350, unit: "per person", minGuests: 100, maxGuests: 1000, included: ["Welcome Drink", "2 Starters", "Main Course", "Rice", "Dessert"], excluded: ["Live Counter", "Transportation", "Decoration"] },
  { id: "p2", tier: "Standard", price: 500, unit: "per person", minGuests: 100, maxGuests: 1000, included: ["Welcome Drink", "3 Starters", "Main Course", "Rice", "Bread", "2 Desserts", "Serving Staff"], excluded: ["Live Counter", "Transportation"] },
  { id: "p3", tier: "Premium", price: 750, unit: "per person", minGuests: 150, maxGuests: 1000, included: ["Welcome Drink", "4 Starters", "Main Course", "Live Dosa Counter", "2 Desserts", "Serving Staff", "Premium Crockery"], excluded: ["Transportation", "Décor"] },
  { id: "p4", tier: "Custom", price: null, unit: "Contact Vendor", minGuests: null, maxGuests: null, included: ["Fully customised on request"], excluded: [] },
];

const INITIAL_ENQUIRIES = [
  { id: "e1", customer: "Rahul Mehta", event: "Wedding", date: "18 Mar 2027", location: "Chennai", guests: 500, budget: "₹3,00,000 – ₹4,00,000", notes: "Need Jain food options for 50 guests.", status: "New" },
  { id: "e2", customer: "Kavitha Ramesh", event: "Baby Shower", date: "02 Dec 2026", location: "Chennai", guests: 80, budget: "₹80,000 – ₹1,00,000", notes: "Traditional South Indian menu preferred, low spice for elders.", status: "New" },
  { id: "e3", customer: "Arjun & Divya", event: "Reception", date: "25 Jan 2027", location: "Chennai", guests: 350, budget: "₹2,00,000+", notes: "Looking for live counters and a premium spread.", status: "Contacted" },
];

const INITIAL_QUOTES = [
  { id: "q1", customer: "Rahul Mehta", event: "Wedding", guests: 500, items: [{ label: "Food Package", amount: 250000 }, { label: "Service", amount: 50000 }, { label: "Transportation", amount: 15000 }, { label: "Additional Items", amount: 20000 }], status: "Sent" },
  { id: "q2", customer: "Arjun & Divya", event: "Reception", guests: 350, items: [{ label: "Food Package", amount: 175000 }, { label: "Service", amount: 35000 }], status: "Accepted" },
];

const BOOKINGS = [
  { id: "b1", customer: "Arjun & Divya", event: "Reception", date: "25 Jan 2027", dateKey: "2027-01-25", location: "Chennai", guests: 350, amount: 210000, status: "Confirmed", payment: "Advance Paid", menu: "Premium Multi-Cuisine Menu", chef: "Chef Team B", setup: "3:00 PM", service: "6:00 PM – 11:00 PM" },
  { id: "b2", customer: "Ramesh & Priya", event: "Wedding", date: "14 Feb 2027", dateKey: "2027-02-14", location: "Chennai", guests: 250, amount: 87500, status: "Confirmed", payment: "Advance Paid — ₹44,249", menu: "Classic South Indian Wedding Menu", chef: "Chef Team A", setup: "11:00 AM", service: "1:00 PM – 6:00 PM" },
];

const TRANSACTIONS = [
  { label: "Advance — Ramesh & Priya Wedding", date: "26 Aug 2026", amount: 44249, status: "Received" },
  { label: "Balance due — Ramesh & Priya Wedding", date: "14 Feb 2027", amount: 43751, status: "Pending" },
  { label: "Full settlement — Arjun & Divya Reception", date: "25 Jan 2027", amount: 210000, status: "Received" },
];

const REVIEWS = [
  { customer: "Kavya S.", rating: 5, food: 5, service: 5, professionalism: 4, value: 4, date: "Nov 2025", text: "Exceptional food and the live dosa counter was a huge hit with our guests. Staff were punctual and professional throughout.", reply: null },
  { customer: "Mohan R.", rating: 4, food: 4, service: 5, professionalism: 5, value: 4, date: "Oct 2025", text: "Great service overall, menu customisation for our Jain guests was handled really well.", reply: "Thank you Mohan! It was a pleasure catering your event." },
];

const NOTIFICATIONS = [
  { icon: ClipboardList, tone: "accent", category: "Enquiry", text: "New enquiry from Rahul Mehta — Wedding, 500 guests", time: "2h ago", read: false },
  { icon: CircleCheck, tone: "success", category: "Quote", text: "Arjun & Divya accepted your quote", time: "Yesterday", read: false },
  { icon: Wallet, tone: "success", category: "Payment", text: "Advance payment received — ₹44,249", time: "2 days ago", read: true },
  { icon: Bell, tone: "gold", category: "Event", text: "Event approaching — Ramesh & Priya Wedding in 12 days", time: "3 days ago", read: true },
  { icon: Star, tone: "gold", category: "Booking", text: "New review received — 5 stars from Kavya S.", time: "1 week ago", read: true },
  { icon: ClipboardList, tone: "accent", category: "Enquiry", text: "New enquiry from Kavitha Ramesh — Baby Shower, 80 guests", time: "1 week ago", read: true },
  { icon: SettingsIcon, tone: "gold", category: "System", text: "Your FSSAI license is up for renewal next month", time: "2 weeks ago", read: true },
];
const NOTIFICATION_CATEGORIES = ["All", "Enquiry", "Quote", "Booking", "Payment", "Event", "System"];

/* ---------------- Small building blocks ---------------- */

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold ev-ink shrink-0">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px] h-3">
          <div className="w-[3px] h-[5px] bg-current rounded-sm" /><div className="w-[3px] h-[7px] bg-current rounded-sm" />
          <div className="w-[3px] h-[9px] bg-current rounded-sm" /><div className="w-[3px] h-[11px] bg-current rounded-sm" />
        </div>
        <div className="w-5 h-[10px] border border-current rounded-[3px] relative ml-1">
          <div className="absolute inset-[1.5px] bg-current rounded-[1px]" style={{ width: "70%" }} />
        </div>
      </div>
    </div>
  );
}
function TopBar({ title, onBack, right, sub }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-2 pb-4 shrink-0 ev-bg">
      {onBack ? (
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center ev-card ev-tap shrink-0">
          <ChevronLeft size={18} className="ev-ink" />
        </button>
      ) : <div className="w-9" />}
      <div className="flex-1 min-w-0">
        <div className="ev-display text-[19px] font-semibold ev-ink truncate">{title}</div>
        {sub && <div className="text-[12px] ev-muted truncate">{sub}</div>}
      </div>
      {right || <div className="w-9" />}
    </div>
  );
}
function BottomNav({ active, go }) {
  const items = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "bookings", label: "Bookings", icon: Briefcase },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "more", label: "More", icon: MoreHorizontal },
  ];
  return (
    <div className="shrink-0 ev-card border-t flex items-stretch px-1 pb-2 pt-1.5 md:hidden" style={{ borderTopColor: "#E9E2D6" }}>
      {items.map((it) => {
        const isActive = active === it.id; const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => go(it.id)} className="flex-1 flex flex-col items-center gap-1 py-1 ev-tap">
            <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} className={isActive ? "ev-accent" : "ev-faint"} />
            <span className={"text-[10px] font-medium " + (isActive ? "ev-accent" : "ev-faint")}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
function PrimaryButton({ children, onClick, icon: Icon, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={"ev-btn-primary ev-tap w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[15px] " + (disabled ? "opacity-40" : "")}>
      {children}{Icon && <Icon size={17} />}
    </button>
  );
}
function GhostButton({ children, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className="ev-btn-ghost ev-tap w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[15px]">
      {children}{Icon && <Icon size={17} />}
    </button>
  );
}
function Badge({ children, tone = "accent" }) {
  const map = { accent: "ev-bg-accent-soft ev-accent", gold: "ev-bg-gold-soft ev-gold", success: "ev-bg-success-soft ev-success", info: "ev-bg-info-soft ev-info", danger: "ev-bg-danger-soft ev-danger", neutral: "bg-[#F1EEE7] ev-muted" };
  return <span className={"px-2 py-[3px] rounded-full text-[11px] font-semibold inline-flex items-center gap-1 " + map[tone]}>{children}</span>;
}
function OptionTile({ label, sub, selected, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className={"ev-tap w-full flex items-center gap-3 rounded-2xl p-3.5 mb-2.5 text-left border " + (selected ? "ev-bg-accent-soft" : "ev-card")}
      style={{ borderColor: selected ? "#96114C" : "#E9E2D6" }}>
      {Icon && (
        <div className={"w-9 h-9 rounded-xl flex items-center justify-center shrink-0 " + (selected ? "ev-bg-accent" : "bg-[#F1EEE7]")}>
          <Icon size={16} className={selected ? "text-white" : "ev-muted"} />
        </div>
      )}
      <div className="flex-1"><div className={"text-[14px] font-semibold " + (selected ? "ev-accent" : "ev-ink")}>{label}</div>{sub && <div className="text-[11.5px] ev-muted">{sub}</div>}</div>
      {selected && <Check size={16} className="ev-accent" />}
    </button>
  );
}
function InputField({ label, placeholder, value, onChange = () => {}, type = "text", icon: Icon, inputRef }) {
  return (
    <div className="mb-4">
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">{label}</label>
      <div className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
        {Icon && <Icon size={17} className="ev-accent shrink-0" />}
        <input ref={inputRef} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="bg-transparent outline-none text-[14px] ev-ink flex-1 placeholder:ev-faint" />
      </div>
    </div>
  );
}
function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b" style={{ borderColor: "#EFE9DE" }}>
      <span className="text-[12.5px] ev-muted">{label}</span>
      <span className="text-[13px] font-semibold ev-ink text-right max-w-[62%]">{value}</span>
    </div>
  );
}
function StepDots({ step, total }) {
  return (
    <div className="flex items-center gap-1.5 px-5 pb-3">
      {Array.from({ length: total }).map((_, i) => <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < step ? "#96114C" : "#E9E2D6" }} />)}
    </div>
  );
}
function Screen({ children, nav }) {
  return (
    <div className="flex flex-col h-full ev-bg">
      <div className="flex-1 overflow-y-auto ev-scroll ev-anim">{children}</div>
      {nav}
    </div>
  );
}
function WizardShell({ step, total, title, sub, onBack, children, onNext, nextLabel = "Continue", nextDisabled }) {
  return (
    <Screen>
      <TopBar title={title} sub={sub} onBack={onBack} />
      <StepDots step={step} total={total} />
      <div className="px-5 pb-6">{children}</div>
      <div className="px-5 pb-6 mt-2"><PrimaryButton onClick={onNext} icon={ArrowRight} disabled={nextDisabled}>{nextLabel}</PrimaryButton></div>
    </Screen>
  );
}

/* ================= PRE-AUTH SCREENS ================= */

function VendorLandingScreen({ go }) {
  return (
    <Screen>
      <div className="h-full flex flex-col justify-between px-7 pt-16 pb-10">
        <div>
          <div className="w-14 h-14 rounded-2xl ev-bg-accent flex items-center justify-center mb-6"><span className="ev-display text-white text-2xl font-semibold">E</span></div>
          <div className="ev-display text-[28px] leading-[1.15] font-semibold ev-ink">Grow your catering business</div>
          <div className="ev-display-italic text-[28px] leading-[1.15] ev-accent mb-4">with Eventra.</div>
          <p className="ev-muted text-[14px] leading-relaxed">Get qualified enquiries, send professional quotes, manage bookings and track earnings — all from one dashboard.</p>
        </div>
        <div className="space-y-3">
          <PrimaryButton onClick={() => go("vendorRegister")} icon={ArrowRight}>Register Your Business</PrimaryButton>
          <GhostButton onClick={() => go("vendorLogin")}>I already have an account</GhostButton>
        </div>
      </div>
    </Screen>
  );
}
function VendorLoginScreen({ go, onVendorAuthenticated }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);
  const submit = async () => {
    setLoading(true);
    setError("");
    const password = passwordRef.current?.value || "";
    if (!email.trim() || password.length < 6) {
      setError("Enter a valid email and password.");
      setLoading(false);
      return;
    }
    const { user, error: authError } = await signInVendor(email.trim(), password);
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }
    await onVendorAuthenticated(user);
    setLoading(false);
  };
  return (
    <Screen>
      <TopBar title="Vendor Log In" onBack={() => go("vendorLanding")} />
      <div className="px-5 pb-6">
        <InputField label="Registered Phone Number" placeholder="10-digit mobile number" value={phone} onChange={setPhone} type="tel" icon={Phone} />
        <InputField label="Email" placeholder="you@email.com" value={email} onChange={setEmail} type="email" icon={User} />
        <InputField label="Password" placeholder="Your password" type="password" inputRef={passwordRef} />
        {error && <p className="text-[12px] text-red-600 mb-3">{error}</p>}
        <PrimaryButton onClick={submit} icon={ArrowRight} disabled={!email.trim() || loading}>{loading ? "Signing in..." : "Log In"}</PrimaryButton>
        <p className="text-center text-[12px] ev-muted mt-4">New vendor? <button onClick={() => go("vendorRegister")} className="ev-accent font-semibold">Register here</button></p>
      </div>
    </Screen>
  );
}
function VendorRegisterScreen({ go }) {
  const [biz, setBiz] = useState(""); const [owner, setOwner] = useState(""); const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);
  const canContinue = biz.trim() && owner.trim() && phone.trim().length >= 10 && email.trim();
  const submit = async () => {
    setLoading(true);
    setError("");
    setNotice("");
    const password = passwordRef.current?.value || "";
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    const { requiresEmailConfirmation, error: authError } = await signUpVendor(email.trim(), password, owner.trim(), phone.trim(), { businessName: biz.trim() });
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }
    if (requiresEmailConfirmation) {
      setNotice("Account created. Check your email to confirm your address, then log in.");
      setLoading(false);
      return;
    }
    go("onboard1");
    setLoading(false);
  };
  return (
    <Screen>
      <TopBar title="Register Your Business" onBack={() => go("vendorLanding")} />
      <div className="px-5 pb-6">
        <InputField label="Business Name" placeholder="e.g. Annapoorna Catering Co." value={biz} onChange={setBiz} icon={Building2} />
        <InputField label="Owner Name" placeholder="Your full name" value={owner} onChange={setOwner} icon={User} />
        <InputField label="Phone Number" placeholder="10-digit mobile number" value={phone} onChange={setPhone} type="tel" icon={Phone} />
        <InputField label="Email" placeholder="you@email.com" value={email} onChange={setEmail} type="email" icon={User} />
        <InputField label="Password" placeholder="At least 6 characters" type="password" inputRef={passwordRef} />
        {error && <p className="text-[12px] text-red-600 mb-3">{error}</p>}
        {notice && <p className="text-[12px] ev-success mb-3">{notice}</p>}
        <PrimaryButton onClick={submit} icon={ArrowRight} disabled={!canContinue || loading}>{loading ? "Creating account..." : "Continue to Onboarding"}</PrimaryButton>
      </div>
    </Screen>
  );
}

function Onboard1({ go }) {
  const [name, setName] = useState(BUSINESS.name);
  const [description, setDescription] = useState(BUSINESS.description);
  const [category, setCategory] = useState(BUSINESS.category);
  return (
    <WizardShell step={1} total={5} title="Business Info" sub="Step 1 of 5" onBack={() => go("vendorRegister")} onNext={() => go("onboard2")}>
      <InputField label="Business Name" value={name} onChange={setName} icon={Building2} />
      <InputField label="Business Description" value={description} onChange={setDescription} />
      <InputField label="Vendor Category" value={category} onChange={setCategory} icon={Utensils} />
    </WizardShell>
  );
}
function Onboard2({ go }) {
  const [address, setAddress] = useState(BUSINESS.address);
  const [city, setCity] = useState(BUSINESS.city);
  const [serviceArea, setServiceArea] = useState(BUSINESS.serviceArea);
  return (
    <WizardShell step={2} total={5} title="Address & Service Area" sub="Step 2 of 5" onBack={() => go("onboard1")} onNext={() => go("onboard3")}>
      <InputField label="Business Address" value={address} onChange={setAddress} icon={MapPin} />
      <InputField label="City" value={city} onChange={setCity} />
      <InputField label="Service Area" value={serviceArea} onChange={setServiceArea} />
    </WizardShell>
  );
}
function Onboard3({ go }) {
  const [experience, setExperience] = useState(BUSINESS.experience);
  return (
    <WizardShell step={3} total={5} title="Category & Experience" sub="Step 3 of 5" onBack={() => go("onboard2")} onNext={() => go("onboard4")}>
      <InputField label="Years of Experience" value={experience} onChange={setExperience} icon={Sparkles} />
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Event Types Served</label>
      {BUSINESS.eventTypes.map((t) => <OptionTile key={t} label={t} selected icon={Sparkles} />)}
    </WizardShell>
  );
}
function Onboard4({ go }) {
  return (
    <WizardShell step={4} total={5} title="Documents & KYC" sub="Step 4 of 5" onBack={() => go("onboard3")} onNext={() => go("onboard5")}>
      <p className="text-[13px] ev-muted mb-4">Upload documents for verification. Numbers are never shown publicly.</p>
      {KYC_DOCS.map((d) => (
        <div key={d.label} className="ev-card rounded-2xl p-3.5 mb-2.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl ev-bg-gold-soft flex items-center justify-center shrink-0"><Upload size={15} className="ev-gold" /></div>
          <div className="flex-1"><div className="text-[13px] font-semibold ev-ink">{d.label}</div><div className="text-[11px] ev-muted">Tap to upload</div></div>
          <Badge tone="success"><Check size={11} />{d.status}</Badge>
        </div>
      ))}
    </WizardShell>
  );
}
function Onboard5({ go }) {
  const [accountHolder, setAccountHolder] = useState(BANK.accountHolder);
  const [ifsc, setIfsc] = useState(BANK.ifsc);
  return (
    <WizardShell step={5} total={5} title="Bank Details" sub="Step 5 of 5" onBack={() => go("onboard4")} onNext={() => go("verificationPending")} nextLabel="Submit for Verification">
      <InputField label="Account Holder Name" value={accountHolder} onChange={setAccountHolder} icon={CreditCard} />
      <InputField label="Account Number" value={"•••• •••• " + BANK.accountLast4} onChange={() => {}} />
      <InputField label="IFSC Code" value={ifsc} onChange={setIfsc} />
      <div className="ev-bg-gold-soft rounded-2xl p-3.5 flex gap-2.5">
        <Info size={15} className="ev-gold shrink-0 mt-0.5" />
        <div className="text-[11.5px] ev-muted leading-relaxed">Your bank details are used only for payouts and are never shown to customers.</div>
      </div>
    </WizardShell>
  );
}
function VerificationPendingScreen({ go, onVendorAuthenticated }) {
  return (
    <Screen>
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 rounded-full ev-bg-gold-soft flex items-center justify-center mb-5"><ShieldCheck size={26} className="ev-gold" /></div>
        <div className="ev-display text-[19px] font-semibold ev-ink mb-1">Submitted for Verification</div>
        <p className="text-[13px] ev-muted mb-2 leading-relaxed">Our team typically reviews new vendors within 24–48 hours.</p>
        <Badge tone="gold">Under Review</Badge>
        <div className="mt-8 w-full">
          <PrimaryButton onClick={onVendorAuthenticated} icon={ArrowRight}>Continue to Dashboard</PrimaryButton>
          <p className="text-center text-[10.5px] ev-faint mt-3">In production, dashboard access unlocks only after admin approval.</p>
        </div>
      </div>
    </Screen>
  );
}

/* ================= MAIN APP SCREENS ================= */

function DashboardScreen({ go, viewport = "mobile", vendorProfile }) {
  const isDesktop = viewport === "desktop";
  return (
    <Screen nav={<BottomNav active="dashboard" go={go} />}>
      <div className="px-5 md:px-0 pt-4 md:pt-0 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[13px] ev-muted">Good morning,</div>
            <div className="ev-display text-[21px] md:text-[26px] font-semibold ev-ink">{vendorProfile.fullName || "Vendor"} 👋</div>
          </div>
          <button onClick={() => go("notifications")} className="w-10 h-10 rounded-full ev-card flex items-center justify-center relative ev-tap">
            <Bell size={17} className="ev-ink" /><span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full ev-bg-accent" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button onClick={() => go("enquiries")} className="ev-card rounded-2xl p-3.5 md:p-5 text-left ev-tap">
            <div className="text-[11px] ev-muted mb-1">New Enquiries</div><div className="ev-display text-[22px] md:text-[28px] font-bold ev-accent">{INITIAL_ENQUIRIES.filter(e => e.status === "New").length}</div>
          </button>
          <button onClick={() => go("bookings")} className="ev-card rounded-2xl p-3.5 md:p-5 text-left ev-tap">
            <div className="text-[11px] ev-muted mb-1">Active Bookings</div><div className="ev-display text-[22px] md:text-[28px] font-bold ev-ink">{BOOKINGS.length}</div>
          </button>
          <button onClick={() => go("earnings")} className="ev-card rounded-2xl p-3.5 md:p-5 text-left ev-tap">
            <div className="text-[11px] ev-muted mb-1">Monthly Revenue</div><div className="ev-display text-[17px] md:text-[24px] font-bold ev-success">₹1,25,000</div>
          </button>
          <button onClick={() => go("reviews")} className="ev-card rounded-2xl p-3.5 md:p-5 text-left ev-tap">
            <div className="text-[11px] ev-muted mb-1">Rating</div><div className="ev-display text-[17px] md:text-[24px] font-bold ev-gold flex items-center gap-1"><Star size={15} className="fill-current" />{BUSINESS.rating}</div>
          </button>
        </div>

        <div className="mb-6">
          <div className="text-[13px] font-semibold ev-ink mb-2.5">Quick actions</div>
          <div className="grid grid-cols-4 md:flex md:gap-3 gap-2.5">
            {[{ label: "Add Menu", icon: Utensils, to: "menus" }, { label: "New Package", icon: Package, to: "packages" }, { label: "Availability", icon: Calendar, to: "calendar" }, { label: "New Quote", icon: FileText, to: "enquiries" }].map((a) => (
              <button key={a.label} onClick={() => go(a.to)} className="ev-tap ev-card rounded-2xl p-2.5 md:px-4 md:py-3 flex flex-col md:flex-row items-center gap-1.5 md:gap-2 text-center md:flex-1">
                <div className="w-8 h-8 rounded-full ev-bg-accent-soft flex items-center justify-center shrink-0"><a.icon size={14} className="ev-accent" /></div>
                <span className="text-[10px] md:text-[12.5px] font-medium ev-ink leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={isDesktop ? "grid grid-cols-2 gap-6" : ""}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[13px] font-semibold ev-ink">Upcoming bookings</div>
              <button onClick={() => go("bookings")} className="text-[11.5px] ev-accent font-semibold">See all</button>
            </div>
            <div className="space-y-2.5">
              {BOOKINGS.map((b) => (
                <button key={b.id} onClick={() => go("bookingDetail_" + b.id)} className="ev-tap ev-card rounded-2xl p-3.5 flex items-center gap-3 w-full text-left">
                  <div className="w-10 h-10 rounded-xl ev-bg-gold-soft flex items-center justify-center shrink-0"><Calendar size={16} className="ev-gold" /></div>
                  <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold ev-ink truncate">{b.customer} · {b.event}</div><div className="text-[11.5px] ev-muted">{b.date} · {b.guests} guests</div></div>
                  <ChevronRight size={15} className="ev-faint shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[13px] font-semibold ev-ink mb-2.5">Recent enquiries</div>
            <div className="space-y-2.5">
              {INITIAL_ENQUIRIES.slice(0, 2).map((e) => (
                <div key={e.id} className="flex items-center gap-3 ev-card rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full ev-bg-accent-soft flex items-center justify-center shrink-0"><ClipboardList size={14} className="ev-accent" /></div>
                  <div className="flex-1 text-[12.5px] ev-ink leading-snug">{e.customer} — {e.event}, {e.guests} guests</div>
                  <Badge tone="neutral">{e.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ---- Calendar / Capacity ---- */

function CalendarScreen({ go }) {
  const [selectedDay, setSelectedDay] = useState(14);
  const [blocked, setBlocked] = useState({});
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const isBlocked = !!blocked[selectedDay];
  const d = isBlocked ? { booked: TOTAL_CAPACITY, remaining: 0, status: "full" } : dayStatus(selectedDay, BOOKINGS);
  const s = CAL_STYLE[d.status];

  return (
    <Screen nav={<BottomNav active="calendar" go={go} />}>
      <div className="px-5 pt-4 pb-6">
        <div className="ev-display text-[21px] font-semibold ev-ink mb-0.5">Availability & Capacity</div>
        <div className="text-[12.5px] ev-muted mb-4">February 2027</div>

        <div className="ev-card rounded-2xl p-3.5 mb-4 flex items-center gap-2.5">
          <Users size={16} className="ev-accent shrink-0" />
          <div className="text-[11.5px] ev-muted leading-snug">Total simultaneous capacity: <span className="font-semibold ev-ink">{TOTAL_CAPACITY} guests/day</span> across {TEAMS.length} chef teams.</div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {Object.values(CAL_STYLE).map((v) => (
              <div key={v.label} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: v.dot }} /><span className="text-[10.5px] ev-muted">{v.label}</span></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1.5">{weekDays.map((w) => <div key={w} className="text-[10px] text-center ev-faint font-semibold">{w}</div>)}</div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => {
              const dd = blocked[day] ? { status: "full" } : dayStatus(day, BOOKINGS);
              const ss = CAL_STYLE[dd.status];
              const isSel = day === selectedDay;
              return (
                <button key={day} onClick={() => setSelectedDay(day)} className="ev-tap aspect-square rounded-lg flex items-center justify-center text-[11.5px] font-semibold"
                  style={{ background: isSel ? "#96114C" : ss.bg, color: isSel ? "#fff" : ss.text }}>{day}</button>
              );
            })}
          </div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold ev-ink">Feb {selectedDay}, 2027</span>
            <span className="px-2 py-[3px] rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>{s.label}</span>
          </div>
          <ReviewRow label="Total capacity" value={`${TOTAL_CAPACITY} guests`} />
          <ReviewRow label="Booked" value={`${d.booked} guests`} />
          <ReviewRow label="Remaining" value={`${d.remaining} guests`} />
          <button onClick={() => setBlocked({ ...blocked, [selectedDay]: !isBlocked })} className="ev-tap w-full mt-3">
            <GhostButton>{isBlocked ? "Unblock This Date" : "Block This Date"}</GhostButton>
          </button>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] font-semibold ev-ink">Team capacity breakdown</div>
            <button onClick={() => go("staff")} className="text-[11px] ev-accent font-semibold">Manage Staff</button>
          </div>
          {TEAMS.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#EFE9DE" }}>
              <div><span className="text-[12.5px] ev-ink">{t.name}</span><span className="text-[10.5px] ev-faint ml-2">{t.members} members · {t.status}</span></div>
              <span className="text-[12.5px] font-semibold ev-muted">{t.capacity} guests</span>
            </div>
          ))}
        </div>

        <div className="ev-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] font-semibold ev-ink">Catering resources</div>
            <button onClick={() => go("resources")} className="text-[11px] ev-accent font-semibold">View All</button>
          </div>
          {RESOURCES.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#EFE9DE" }}>
              <span className="text-[12.5px] ev-ink">{r.label}</span>
              <Badge tone={r.status === "Available" ? "success" : r.status === "Assigned" ? "info" : "danger"}>{r.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ---- Bookings / Events ---- */

function BookingsScreen({ go, viewport = "mobile" }) {
  const [tab, setTab] = useState("upcoming");
  const lists = { upcoming: BOOKINGS, completed: [], cancelled: [] };
  const isDesktop = viewport === "desktop";
  return (
    <Screen nav={<BottomNav active="bookings" go={go} />}>
      <div className="px-5 md:px-0 pt-4 md:pt-0 pb-2">
        <div className="ev-display text-[21px] md:text-[26px] font-semibold ev-ink mb-4">Bookings</div>
        <div className="flex gap-2 mb-5">
          {["upcoming", "completed", "cancelled"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={"ev-tap px-3.5 py-1.5 rounded-full text-[12px] font-semibold capitalize " + (tab === t ? "ev-bg-accent text-white" : "ev-card ev-muted")}>{t}</button>
          ))}
        </div>
      </div>
      <div className="px-5 md:px-0 pb-6">
        {lists[tab].length === 0 && <div className="text-center py-16"><Briefcase size={28} className="ev-faint mx-auto mb-2" /><div className="text-[13px] ev-muted">No {tab} bookings</div></div>}
        {isDesktop && lists[tab].length > 0 ? (
          <table className="w-full ev-card rounded-2xl overflow-hidden border-collapse">
            <thead><tr className="text-left text-[11.5px] ev-muted" style={{ background: "#F4EFE6" }}>
              <th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Event</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Guests</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {lists[tab].map((b) => (
                <tr key={b.id} onClick={() => go("bookingDetail_" + b.id)} className="ev-tap cursor-pointer text-[12.5px] border-t" style={{ borderColor: "#EFE9DE" }}>
                  <td className="px-4 py-3 font-semibold ev-ink">{b.customer}</td><td className="px-4 py-3 ev-muted">{b.event}</td><td className="px-4 py-3 ev-muted">{b.date}</td><td className="px-4 py-3 ev-muted">{b.guests}</td><td className="px-4 py-3 font-bold ev-ink">{inr(b.amount)}</td><td className="px-4 py-3"><Badge tone="accent">{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-3">
            {lists[tab].map((b) => (
              <button key={b.id} onClick={() => go("bookingDetail_" + b.id)} className="ev-tap ev-card rounded-2xl p-4 text-left w-full">
                <div className="flex items-center justify-between mb-2"><span className="text-[13.5px] font-semibold ev-ink">{b.customer}</span><Badge tone="accent">{b.status}</Badge></div>
                <div className="text-[12px] ev-muted mb-2.5">{b.event} · {b.date} · {b.guests} guests</div>
                <div className="text-[14px] font-bold ev-ink">{inr(b.amount)}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

function BookingDetailScreen({ go, bookingId }) {
  const b = BOOKINGS.find((x) => x.id === bookingId) || BOOKINGS[0];
  const [notes, setNotes] = useState("Confirm dosa batter quantity 2 days prior.");
  const [assignedTeam, setAssignedTeam] = useState(b.chef);
  return (
    <Screen>
      <TopBar title="Booking Details" onBack={() => go("bookings")} />
      <div className="px-5 pb-6">
        <Badge tone="accent">{b.status}</Badge>
        <div className="ev-display text-[19px] font-semibold ev-ink mt-2 mb-4">{b.customer} — {b.event}</div>
        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="text-[12px] font-semibold ev-ink mb-2">Booking</div>
          <ReviewRow label="Date" value={b.date} /><ReviewRow label="Location" value={b.location} />
          <ReviewRow label="Guests" value={b.guests} /><ReviewRow label="Package / Menu" value={b.menu} />
          <ReviewRow label="Amount" value={inr(b.amount)} /><ReviewRow label="Payment" value={b.payment} />
        </div>
        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3"><Pencil size={14} className="ev-accent" /><div className="text-[12px] font-semibold ev-ink">Manage Event</div></div>
          <label className="text-[12px] ev-muted mb-1.5 block">Assigned team</label>
          <div className="grid grid-cols-1 gap-2 mb-3">
            {TEAMS.map((t) => (
              <button key={t.id} onClick={() => setAssignedTeam(t.name)} className={"ev-tap rounded-xl py-2.5 px-3 text-[12.5px] font-semibold border flex items-center justify-between " + (assignedTeam === t.name ? "ev-bg-accent-soft ev-accent" : "ev-card ev-ink")} style={{ borderColor: assignedTeam === t.name ? "#96114C" : "#E9E2D6" }}>
                <span>{t.name}</span><span className="text-[10.5px] font-normal ev-faint">{t.capacity} guest capacity</span>
              </button>
            ))}
          </div>
          <ReviewRow label="Setup time" value={b.setup} />
          <ReviewRow label="Service window" value={b.service} /><ReviewRow label="Special requirements" value="Low-spice options for elderly guests" />
          <div className="mt-3"><InputField label="Internal notes (vendor only)" value={notes} onChange={setNotes} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <GhostButton onClick={() => go("chatVendor")} icon={MessageCircle}>Message Customer</GhostButton>
          <GhostButton onClick={() => go("calendar")} icon={Calendar}>View on Calendar</GhostButton>
        </div>
      </div>
    </Screen>
  );
}

/* ---- Enquiries / Quotes ---- */

function EnquiriesScreen({ go, setEnquiries, enquiries, prototypeRequirements = [], onUpdatePrototypeRequirement, viewport = "mobile" }) {
  const prototypeEnquiries = prototypeRequirements.map((requirement) => ({
    id: `prototype:${requirement.id}`,
    requirementId: requirement.id,
    customer: requirement.customerName || "Customer",
    event: requirement.eventType,
    date: requirement.eventDate,
    location: requirement.location,
    guests: requirement.guestCount,
    budget: requirement.budget,
    notes: requirement.notes,
    status: requirement.status === "open" ? "New" : requirement.status[0].toUpperCase() + requirement.status.slice(1),
  }));
  const displayedEnquiries = [...prototypeEnquiries, ...enquiries];
  const act = (enquiry, status) => {
    if (enquiry.requirementId) {
      onUpdatePrototypeRequirement(enquiry.requirementId, status.toLowerCase());
      return;
    }
    setEnquiries(enquiries.map((item) => item.id === enquiry.id ? { ...item, status } : item));
  };
  const isDesktop = viewport === "desktop";
  return (
    <Screen>
      <TopBar title="Enquiries" onBack={() => go("more")} />
      <div className="px-5 md:px-0 pb-3 text-[11.5px] ev-muted">Prototype preview only: enquiries and quotes are stored in this browser, not shared with customer accounts or Supabase.</div>
      <div className={"px-5 md:px-0 pb-6 " + (isDesktop ? "grid grid-cols-2 gap-4" : "space-y-3")}>
        {displayedEnquiries.map((e) => (
          <div key={e.id} className="ev-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-[13.5px] font-semibold ev-ink">{e.customer}</span><Badge tone={e.status === "New" ? "gold" : "neutral"}>{e.status}</Badge></div>
            <div className="text-[12px] ev-muted mb-1">{e.event} · {e.date} · {e.location} · {e.guests} guests</div>
            <div className="text-[12px] ev-muted mb-2">Budget: {e.budget}</div>
            <div className="text-[11.5px] ev-ink leading-relaxed mb-3 ev-bg-gold-soft rounded-xl p-2.5">{e.notes}</div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => act(e, "Contacted")} className="ev-tap ev-card rounded-xl py-2 text-[11px] font-semibold ev-ink">Contact</button>
              <button onClick={() => act(e, "Rejected")} className="ev-tap ev-card rounded-xl py-2 text-[11px] font-semibold" style={{ color: "#B23B4A" }}>Reject</button>
              <button onClick={() => go("quoteBuilder_" + e.id)} className="ev-tap rounded-xl py-2 text-[11px] font-semibold ev-bg-accent text-white">Create Quote</button>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function QuoteBuilderScreen({ go, enquiryId, enquiries, setQuotes, quotes, prototypeRequirements = [], vendorProfile }) {
  const prototypeRequirementId = enquiryId.startsWith("prototype:") ? enquiryId.slice("prototype:".length) : null;
  const prototypeRequirement = prototypeRequirements.find((item) => item.id === prototypeRequirementId);
  const e = prototypeRequirement
    ? {
        customer: prototypeRequirement.customerName || "Customer",
        event: prototypeRequirement.eventType,
        date: prototypeRequirement.eventDate,
        location: prototypeRequirement.location,
        guests: prototypeRequirement.guestCount,
        budget: prototypeRequirement.budget,
      }
    : enquiries.find((item) => item.id === enquiryId) || enquiries[0];
  const [items, setItems] = useState([{ label: "Food Package", amount: 0 }]);
  const [label, setLabel] = useState(""); const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const total = items.reduce((s, i) => s + Number(i.amount || 0), 0);
  const addItem = () => { if (!label.trim() || !amount) return; setItems([...items, { label, amount: Number(amount) }]); setLabel(""); setAmount(""); };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const send = () => {
    if (total <= 0) return;
    if (prototypeRequirement) {
      const quote = createQuote({
        requirementId: prototypeRequirement.id,
        vendorId: PROTOTYPE_VENDOR_ID,
        amount: total,
        message: message.trim(),
      });
      if (!quote) return;
    } else {
      setQuotes([...quotes, { id: "q" + (quotes.length + 1), customer: e.customer, event: e.event, guests: e.guests, items, status: "Sent" }]);
    }
    go("quotes");
  };
  return (
    <Screen>
      <TopBar title="Create Quote" sub={e.customer + " · " + e.event} onBack={() => go("enquiries")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-3.5 mb-4"><ReviewRow label="Event" value={e.event} /><ReviewRow label="Guests" value={e.guests} /><ReviewRow label="Date" value={e.date} />{prototypeRequirement && <ReviewRow label="Location" value={e.location} />}</div>
        <div className="text-[12px] font-semibold ev-ink mb-2.5">Line items</div>
        <div className="space-y-2 mb-3">
          {items.map((it, i) => (
            <div key={i} className="ev-card rounded-xl p-3 flex items-center justify-between">
              <span className="text-[12.5px] ev-ink">{it.label}</span>
              <div className="flex items-center gap-2"><span className="text-[13px] font-semibold ev-ink">{inr(it.amount)}</span><button onClick={() => removeItem(i)} className="ev-tap"><X size={14} className="ev-faint" /></button></div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="ev-card rounded-xl px-3 py-2 flex-1"><input value={label} onChange={(e2) => setLabel(e2.target.value)} placeholder="Item (e.g. Transportation)" className="bg-transparent outline-none text-[12.5px] ev-ink w-full placeholder:ev-faint" /></div>
          <div className="ev-card rounded-xl px-3 py-2 w-24"><input value={amount} onChange={(e2) => setAmount(e2.target.value)} placeholder="₹" type="number" className="bg-transparent outline-none text-[12.5px] ev-ink w-full placeholder:ev-faint" /></div>
          <button onClick={addItem} className="ev-tap w-9 h-9 rounded-xl ev-bg-accent flex items-center justify-center shrink-0"><Plus size={15} className="text-white" /></button>
        </div>
        <div className="ev-card rounded-2xl p-4 mb-5 flex items-center justify-between"><span className="text-[14px] font-bold ev-ink">Total</span><span className="ev-display text-[19px] font-bold ev-accent">{inr(total)}</span></div>
        {prototypeRequirement && <div className="ev-card rounded-xl px-3 py-2 mb-4"><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message for the customer (optional)" rows={3} className="bg-transparent outline-none text-[12.5px] ev-ink w-full resize-none placeholder:ev-faint" /></div>}
        <PrimaryButton onClick={send} icon={Send}>Send Quote to Customer</PrimaryButton>
      </div>
    </Screen>
  );
}

function QuotesScreen({ go, quotes, prototypeQuotes = [], prototypeRequirements = [], viewport = "mobile" }) {
  const sharedQuotes = prototypeQuotes.map((quote) => {
    const requirement = prototypeRequirements.find((item) => item.id === quote.requirementId);
    return {
      id: quote.id,
      customer: requirement?.customerName || "Customer",
      event: requirement?.eventType || "Event",
      guests: requirement?.guestCount || "",
      items: [{ label: quote.message || "Quote", amount: quote.amount }],
      status: quote.status[0].toUpperCase() + quote.status.slice(1),
    };
  });
  const displayedQuotes = [...sharedQuotes, ...quotes];
  const toneFor = (s) => s.toLowerCase() === "accepted" ? "success" : s.toLowerCase() === "rejected" ? "danger" : s.toLowerCase() === "sent" ? "accent" : "neutral";
  const isDesktop = viewport === "desktop";
  return (
    <Screen>
      <TopBar title="Quotes" onBack={() => go("more")} />
      {isDesktop ? (
        <div className="px-5 md:px-0 pb-6">
          <table className="w-full ev-card rounded-2xl overflow-hidden border-collapse">
            <thead><tr className="text-left text-[11.5px] ev-muted" style={{ background: "#F4EFE6" }}>
              <th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Event</th><th className="px-4 py-3 font-semibold">Guests</th><th className="px-4 py-3 font-semibold">Line Items</th><th className="px-4 py-3 font-semibold">Total</th><th className="px-4 py-3 font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {displayedQuotes.map((q) => {
                const total = q.items.reduce((s, i) => s + i.amount, 0);
                return (
                  <tr key={q.id} className="text-[12.5px] border-t align-top" style={{ borderColor: "#EFE9DE" }}>
                    <td className="px-4 py-3 font-semibold ev-ink">{q.customer}</td>
                    <td className="px-4 py-3 ev-muted">{q.event}</td>
                    <td className="px-4 py-3 ev-muted">{q.guests}</td>
                    <td className="px-4 py-3 ev-muted">{q.items.map((i) => `${i.label}: ${inr(i.amount)}`).join(" · ")}</td>
                    <td className="px-4 py-3 font-bold ev-accent">{inr(total)}</td>
                    <td className="px-4 py-3"><Badge tone={toneFor(q.status)}>{q.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 pb-6 space-y-3">
          {displayedQuotes.map((q) => {
            const total = q.items.reduce((s, i) => s + i.amount, 0);
            return (
              <div key={q.id} className="ev-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2"><span className="text-[13.5px] font-semibold ev-ink">{q.customer}</span><Badge tone={toneFor(q.status)}>{q.status}</Badge></div>
                <div className="text-[12px] ev-muted mb-2">{q.event} · {q.guests} guests</div>
                <div className="space-y-1 mb-2">{q.items.map((i) => <div key={i.label} className="flex items-center justify-between text-[11.5px] ev-muted"><span>{i.label}</span><span>{inr(i.amount)}</span></div>)}</div>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#EFE9DE" }}><span className="text-[12.5px] font-semibold ev-ink">Total</span><span className="text-[14px] font-bold ev-accent">{inr(total)}</span></div>
              </div>
            );
          })}
        </div>
      )}
    </Screen>
  );
}

/* ---- Menus ---- */

function MenusScreen({ go, menus, setMenus }) {
  return (
    <Screen>
      <TopBar title="Menu Management" onBack={() => go("more")} />
      <div className="px-5 pb-6 space-y-3">
        {menus.map((m) => (
          <button key={m.id} onClick={() => go("menuDetail_" + m.id)} className="ev-tap ev-card rounded-2xl p-4 text-left w-full">
            <div className="flex items-center gap-2.5 mb-1.5"><Utensils size={15} className="ev-accent" /><span className="text-[13.5px] font-semibold ev-ink">{m.name}</span></div>
            <div className="text-[11.5px] ev-muted">{m.categories.length} categories · {m.categories.reduce((s, c) => s + c.items.length, 0)} dishes</div>
          </button>
        ))}
        <button className="ev-tap w-full ev-card rounded-2xl p-4 flex items-center justify-center gap-2" style={{ borderStyle: "dashed" }}>
          <Plus size={16} className="ev-accent" /><span className="text-[13px] font-semibold ev-accent">Create New Menu</span>
        </button>
      </div>
    </Screen>
  );
}

function MenuDetailScreen({ go, menuId, menus, setMenus }) {
  const menu = menus.find((m) => m.id === menuId) || menus[0];
  const [dishInputs, setDishInputs] = useState({});
  const toggleItem = (catIdx, itemIdx) => {
    const next = menus.map((m) => m.id !== menu.id ? m : {
      ...m, categories: m.categories.map((c, ci) => ci !== catIdx ? c : { ...c, items: c.items.map((it, ii) => ii !== itemIdx ? it : { ...it, included: !it.included }) })
    });
    setMenus(next);
  };
  const addDish = (catIdx) => {
    const val = (dishInputs[catIdx] || "").trim(); if (!val) return;
    const next = menus.map((m) => m.id !== menu.id ? m : { ...m, categories: m.categories.map((c, ci) => ci !== catIdx ? c : { ...c, items: [...c.items, { name: val, included: true }] }) });
    setMenus(next); setDishInputs({ ...dishInputs, [catIdx]: "" });
  };
  return (
    <Screen>
      <TopBar title={menu.name} sub="Tap a dish to toggle included / not included" onBack={() => go("menus")} />
      <div className="px-5 pb-6">
        {menu.categories.map((c, ci) => (
          <div key={c.name} className="ev-card rounded-2xl p-4 mb-3">
            <div className="text-[12px] font-semibold ev-ink mb-2.5">{c.name}</div>
            <div className="space-y-1.5 mb-3">
              {c.items.map((it, ii) => (
                <button key={it.name} onClick={() => toggleItem(ci, ii)} className="ev-tap w-full flex items-center justify-between rounded-lg px-2.5 py-1.5" style={{ background: "#FBF8F3" }}>
                  <span className="text-[12.5px] ev-ink">{it.name}</span>
                  {it.included ? <Check size={14} className="ev-success" /> : <X size={14} className="ev-danger" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="ev-card rounded-lg px-2.5 py-1.5 flex-1"><input value={dishInputs[ci] || ""} onChange={(e) => setDishInputs({ ...dishInputs, [ci]: e.target.value })} placeholder="+ Add dish" className="bg-transparent outline-none text-[12px] ev-ink w-full placeholder:ev-faint" /></div>
              <button onClick={() => addDish(ci)} className="ev-tap w-8 h-8 rounded-lg ev-bg-accent flex items-center justify-center shrink-0"><Plus size={13} className="text-white" /></button>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ---- Packages ---- */

function PackagesScreen({ go, packages }) {
  return (
    <Screen>
      <TopBar title="Package Management" onBack={() => go("more")} />
      <div className="px-5 pb-6 space-y-3">
        {packages.map((p) => (
          <button key={p.id} onClick={() => go("packageDetail_" + p.id)} className="ev-tap ev-card rounded-2xl p-4 text-left w-full">
            <div className="flex items-center justify-between mb-1.5"><span className="text-[14px] font-semibold ev-ink">{p.tier}</span>{p.price ? <span className="text-[15px] font-bold ev-accent">{inr(p.price)}/{p.unit.replace("per ", "")}</span> : <Badge tone="gold">{p.unit}</Badge>}</div>
            {p.minGuests && <div className="text-[11.5px] ev-muted">Min {p.minGuests} guests</div>}
          </button>
        ))}
      </div>
    </Screen>
  );
}

function PackageDetailScreen({ go, packageId, packages, setPackages }) {
  const p = packages.find((x) => x.id === packageId) || packages[0];
  const [incInput, setIncInput] = useState(""); const [exInput, setExInput] = useState("");
  const update = (next) => setPackages(packages.map((x) => x.id === p.id ? { ...x, ...next } : x));
  const moveOut = (item) => update({ included: p.included.filter((i) => i !== item), excluded: [...p.excluded, item] });
  const moveIn = (item) => update({ excluded: p.excluded.filter((i) => i !== item), included: [...p.included, item] });
  const removeInc = (item) => update({ included: p.included.filter((i) => i !== item) });
  const removeExc = (item) => update({ excluded: p.excluded.filter((i) => i !== item) });
  const addInc = () => { if (!incInput.trim()) return; update({ included: [...p.included, incInput.trim()] }); setIncInput(""); };
  const addExc = () => { if (!exInput.trim()) return; update({ excluded: [...p.excluded, exInput.trim()] }); setExInput(""); };

  return (
    <Screen>
      <TopBar title={p.tier + " Package"} onBack={() => go("packages")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-4">
          {p.price ? <div className="ev-display text-[24px] font-bold ev-ink mb-1">{inr(p.price)} <span className="text-[13px] font-normal ev-muted">/ {p.unit.replace("per ", "")}</span></div> : <Badge tone="gold">{p.unit}</Badge>}
          {p.minGuests && <div className="text-[12px] ev-muted">Min {p.minGuests} guests · Max {p.maxGuests} guests</div>}
        </div>
        <div className="ev-card rounded-2xl p-4 mb-3">
          <div className="text-[12px] font-semibold ev-success mb-2.5 flex items-center gap-1.5"><Check size={13} /> Included</div>
          <div className="space-y-2 mb-3">
            {p.included.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#FBF8F3" }}>
                <span className="text-[12.5px] ev-ink">{item}</span>
                <div className="flex items-center gap-2"><button onClick={() => moveOut(item)} className="ev-tap text-[10.5px] font-semibold ev-gold">Move →</button><button onClick={() => removeInc(item)} className="ev-tap"><X size={14} className="ev-faint" /></button></div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="ev-card rounded-xl px-3 py-2 flex-1"><input value={incInput} onChange={(e) => setIncInput(e.target.value)} placeholder="+ Add included item" className="bg-transparent outline-none text-[12.5px] ev-ink w-full placeholder:ev-faint" /></div>
            <button onClick={addInc} className="ev-tap w-9 h-9 rounded-xl ev-bg-accent flex items-center justify-center shrink-0"><Plus size={15} className="text-white" /></button>
          </div>
        </div>
        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="text-[12px] font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: "#B23B4A" }}><X size={13} /> Not Included</div>
          <div className="space-y-2 mb-3">
            {p.excluded.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#FBF8F3" }}>
                <span className="text-[12.5px] ev-ink">{item}</span>
                <div className="flex items-center gap-2"><button onClick={() => moveIn(item)} className="ev-tap text-[10.5px] font-semibold ev-success">← Move</button><button onClick={() => removeExc(item)} className="ev-tap"><X size={14} className="ev-faint" /></button></div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="ev-card rounded-xl px-3 py-2 flex-1"><input value={exInput} onChange={(e) => setExInput(e.target.value)} placeholder="+ Add not-included item" className="bg-transparent outline-none text-[12.5px] ev-ink w-full placeholder:ev-faint" /></div>
            <button onClick={addExc} className="ev-tap w-9 h-9 rounded-xl bg-[#F1EEE7] flex items-center justify-center shrink-0"><Plus size={15} className="ev-muted" /></button>
          </div>
        </div>
        <div className="text-[11px] ev-faint">Additional charges (transportation, extra staff, extra hours) can be added per quote in the Quote Builder.</div>
      </div>
    </Screen>
  );
}

/* ---- Profile / Earnings / Reviews / Notifications / Settings / More ---- */

function VendorProfileScreen({ go, vendorProfile }) {
  const business = {
    ...BUSINESS,
    name: vendorProfile.businessName,
    owner: vendorProfile.fullName,
    phone: vendorProfile.phone,
    email: vendorProfile.email,
    city: vendorProfile.city,
    description: vendorProfile.description,
    image: vendorProfile.logoUrl,
  };
  return (
    <Screen>
      <TopBar title="Business Profile" onBack={() => go("more")} right={<button onClick={() => go("editVendorProfile")} className="ev-tap"><Pencil size={16} className="ev-accent" /></button>} />
      <div className="px-5 pb-6">
        <div className="w-full h-36 rounded-2xl overflow-hidden mb-4">{business.image ? <VendorPhoto src={business.image} alt={business.name || "Vendor logo"} className="w-full h-full" /> : <div className="w-full h-full ev-bg-accent-soft flex items-center justify-center"><Building2 size={28} className="ev-accent" /></div>}</div>
        <div className="flex items-center gap-2 mb-1"><span className="ev-display text-[18px] font-semibold ev-ink">{business.name || "Business name not provided"}</span><BadgeCheck size={16} className="ev-success" /></div>
        <div className="text-[12px] ev-muted mb-3">{BUSINESS.category} · {BUSINESS.experience} experience · {business.city || "City not provided"}</div>
        <div className="flex items-center gap-1 mb-4 text-[12.5px]"><Star size={14} className="ev-gold fill-current" /><span className="font-semibold ev-ink">{BUSINESS.rating}</span><span className="ev-muted">({BUSINESS.reviewCount} reviews)</span></div>
        <p className="text-[12.5px] ev-muted leading-relaxed mb-4">{business.description || "No business description provided."}</p>
        <div className="ev-card rounded-2xl p-4 mb-3">
          <ReviewRow label="Owner" value={business.owner || "Name not provided"} /><ReviewRow label="Phone" value={business.phone || "Phone not provided"} /><ReviewRow label="Email" value={business.email || "Email not provided"} />
          <ReviewRow label="Service Area" value={BUSINESS.serviceArea} /><ReviewRow label="Languages" value={BUSINESS.languages.join(", ")} />
        </div>
        <div className="ev-card rounded-2xl p-4 mb-3">
          <div className="text-[12px] font-semibold ev-ink mb-2.5">Verification</div>
          {KYC_DOCS.map((d) => <ReviewRow key={d.label} label={d.label} value={d.status} />)}
        </div>
        <div className="ev-card rounded-2xl p-4">
          <div className="text-[12px] font-semibold ev-ink mb-2">Event Types Served</div>
          <div className="flex flex-wrap gap-2">{BUSINESS.eventTypes.map((t) => <Badge key={t} tone="accent">{t}</Badge>)}</div>
        </div>
      </div>
    </Screen>
  );
}
function EditVendorProfileScreen({ go, vendorProfile, onSaveProfileImage }) {
  const [name, setName] = useState(vendorProfile.businessName);
  const [description, setDescription] = useState(vendorProfile.description);
  const [serviceArea, setServiceArea] = useState(vendorProfile.city);
  const [hours, setHours] = useState("9:00 AM – 9:00 PM");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(vendorProfile.logoUrl);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(vendorProfile.logoUrl);
  }, [vendorProfile.logoUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!acceptedTypes.includes(file.type)) {
      setImageError("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    setImageError("");
    setSelectedImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const save = () => {
    if (selectedImageFile) onSaveProfileImage({ file: selectedImageFile, previewUrl });
    go("vendorProfile");
  };

  return (
    <Screen>
      <TopBar title="Edit Profile" onBack={() => go("vendorProfile")} />
      <div className="px-5 pb-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-2 relative">{previewUrl ? <VendorPhoto src={previewUrl} alt="Vendor logo" className="w-full h-full" /> : <div className="w-full h-full ev-bg-accent-soft flex items-center justify-center"><Building2 size={24} className="ev-accent" /></div>}
            <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Choose profile image" className="absolute bottom-1 right-1 w-7 h-7 rounded-full ev-card flex items-center justify-center"><Camera size={12} className="ev-accent" /></button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
          {imageError && <p className="text-[11px] text-red-600 mb-2">{imageError}</p>}
          <span className="text-[11.5px] ev-muted">Tap to change photos</span>
        </div>
        <InputField label="Business Name" value={name} onChange={setName} icon={Building2} />
        <InputField label="Description" value={description} onChange={setDescription} />
        <InputField label="Service Area" value={serviceArea} onChange={setServiceArea} icon={MapPin} />
        <InputField label="Operating Hours" value={hours} onChange={setHours} icon={Clock} />
        <PrimaryButton onClick={save} icon={Check}>Save Changes</PrimaryButton>
      </div>
    </Screen>
  );
}

function EarningsScreen({ go, viewport = "mobile" }) {
  const isDesktop = viewport === "desktop";
  return (
    <Screen nav={<BottomNav active="earnings" go={go} />}>
      <div className="px-5 md:px-0 pt-4 md:pt-0 pb-6">
        <div className="ev-display text-[21px] md:text-[26px] font-semibold ev-ink mb-4">Earnings</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="ev-card rounded-2xl p-4 md:p-5"><div className="text-[11px] ev-muted mb-1">Total Earnings</div><div className="ev-display text-[18px] md:text-[22px] font-bold ev-ink">₹12,50,000</div></div>
          <div className="ev-card rounded-2xl p-4 md:p-5"><div className="text-[11px] ev-muted mb-1">This Month</div><div className="ev-display text-[18px] md:text-[22px] font-bold ev-success">₹1,25,000</div></div>
          <div className="ev-card rounded-2xl p-4 md:p-5"><div className="text-[11px] ev-muted mb-1">Pending</div><div className="ev-display text-[18px] md:text-[22px] font-bold ev-gold">{inr(43751)}</div></div>
          <div className="ev-card rounded-2xl p-4 md:p-5"><div className="text-[11px] ev-muted mb-1">Withdrawable</div><div className="ev-display text-[18px] md:text-[22px] font-bold ev-accent">₹9,80,000</div></div>
        </div>
        <div className="ev-bg-gold-soft rounded-2xl p-3 flex items-center gap-2.5 mb-5">
          <Info size={15} className="ev-gold shrink-0" /><div className="text-[11px] ev-muted leading-snug">This is prototype mock data — no real transactions are processed. Payment gateway integration comes in a later phase.</div>
        </div>
        <div className="text-[13px] font-semibold ev-ink mb-2.5">Transaction history</div>
        {isDesktop ? (
          <table className="w-full ev-card rounded-2xl overflow-hidden border-collapse">
            <thead><tr className="text-left text-[11.5px] ev-muted" style={{ background: "#F4EFE6" }}>
              <th className="px-4 py-3 font-semibold">Description</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={i} className="text-[12.5px] border-t" style={{ borderColor: "#EFE9DE" }}>
                  <td className="px-4 py-3 font-semibold ev-ink">{t.label}</td><td className="px-4 py-3 ev-muted">{t.date}</td><td className="px-4 py-3 font-bold ev-ink">{inr(t.amount)}</td><td className="px-4 py-3"><Badge tone={t.status === "Received" ? "success" : "gold"}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-2.5">
            {TRANSACTIONS.map((t, i) => (
              <div key={i} className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
                <div className={"w-9 h-9 rounded-xl flex items-center justify-center shrink-0 " + (t.status === "Received" ? "ev-bg-success-soft" : "ev-bg-gold-soft")}><Wallet size={15} className={t.status === "Received" ? "ev-success" : "ev-gold"} /></div>
                <div className="flex-1 min-w-0"><div className="text-[12.5px] font-semibold ev-ink truncate">{t.label}</div><div className="text-[11px] ev-muted">{t.date}</div></div>
                <div className="text-right"><div className="text-[13px] font-bold ev-ink">{inr(t.amount)}</div><Badge tone={t.status === "Received" ? "success" : "gold"}>{t.status}</Badge></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

function ReviewsScreen({ go }) {
  const [replyDraft, setReplyDraft] = useState({});
  const [sentReplies, setSentReplies] = useState({});
  return (
    <Screen>
      <TopBar title="Reviews" onBack={() => go("more")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-4 text-center">
          <div className="ev-display text-[30px] font-bold ev-ink">{BUSINESS.rating}</div>
          <div className="flex justify-center gap-1 mb-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} className={s <= 5 ? "ev-gold fill-current" : "ev-faint"} />)}</div>
          <div className="text-[11.5px] ev-muted">{BUSINESS.reviewCount} reviews</div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-[10.5px] ev-muted">
            <div>Food<br /><span className="font-semibold ev-ink">4.8</span></div><div>Service<br /><span className="font-semibold ev-ink">4.9</span></div>
            <div>Value<br /><span className="font-semibold ev-ink">4.6</span></div><div>Prof.<br /><span className="font-semibold ev-ink">4.7</span></div>
          </div>
        </div>
        {REVIEWS.map((r, i) => (
          <div key={i} className="ev-card rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-1.5"><span className="text-[13px] font-semibold ev-ink">{r.customer}</span><span className="text-[11px] ev-faint">{r.date}</span></div>
            <div className="flex gap-0.5 mb-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className={s <= r.rating ? "ev-gold fill-current" : "ev-faint"} />)}</div>
            <p className="text-[12.5px] ev-muted leading-relaxed mb-2">{r.text}</p>
            {(r.reply || sentReplies[i]) ? (
              <div className="ev-bg-accent-soft rounded-xl p-2.5 flex gap-2"><Reply size={13} className="ev-accent shrink-0 mt-0.5" /><span className="text-[11.5px] ev-ink">{r.reply || sentReplies[i]}</span></div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="ev-card rounded-xl px-3 py-2 flex-1"><input value={replyDraft[i] || ""} onChange={(e) => setReplyDraft({ ...replyDraft, [i]: e.target.value })} placeholder="Write a reply..." className="bg-transparent outline-none text-[12px] ev-ink w-full placeholder:ev-faint" /></div>
                <button onClick={() => { if ((replyDraft[i] || "").trim()) setSentReplies({ ...sentReplies, [i]: replyDraft[i] }); }} className="ev-tap w-8 h-8 rounded-xl ev-bg-accent flex items-center justify-center shrink-0"><Send size={13} className="text-white" /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Screen>
  );
}

function NotificationsScreen({ go }) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? items : items.filter((n) => n.category === filter);
  const markRead = (i) => setItems(items.map((n, idx) => (items.indexOf(visible[i]) === idx ? { ...n, read: true } : n)));
  const unreadCount = items.filter((n) => !n.read).length;
  return (
    <Screen>
      <TopBar title="Notifications" sub={unreadCount ? `${unreadCount} unread` : "All caught up"} onBack={() => go("dashboard")} />
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto ev-scroll">
        {NOTIFICATION_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={"ev-tap shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-semibold " + (filter === c ? "ev-bg-accent text-white" : "ev-card ev-muted")}>{c}</button>
        ))}
      </div>
      <div className="px-5 pb-6 pt-2 space-y-2.5">
        {visible.map((n, i) => (
          <button key={i} onClick={() => markRead(i)} className="ev-tap w-full flex items-center gap-3 ev-card rounded-2xl p-3.5 text-left relative">
            {!n.read && <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full ev-bg-accent" />}
            <div className={"w-9 h-9 rounded-full flex items-center justify-center shrink-0 " + (n.tone === "success" ? "ev-bg-success-soft" : n.tone === "gold" ? "ev-bg-gold-soft" : "ev-bg-accent-soft")}>
              <n.icon size={15} className={n.tone === "success" ? "ev-success" : n.tone === "gold" ? "ev-gold" : "ev-accent"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={"text-[12.5px] leading-snug " + (n.read ? "ev-muted" : "ev-ink font-medium")}>{n.text}</div>
              <div className="flex items-center gap-2 mt-1"><Badge tone="neutral">{n.category}</Badge><span className="text-[10.5px] ev-faint">{n.time}</span></div>
            </div>
          </button>
        ))}
        {visible.length === 0 && <div className="text-center py-16 text-[12.5px] ev-muted">No {filter.toLowerCase()} notifications</div>}
      </div>
    </Screen>
  );
}

function MoreScreen({ go }) {
  const items = [
    { label: "Enquiries", icon: ClipboardList, to: "enquiries" }, { label: "Quotes", icon: FileText, to: "quotes" },
    { label: "Menus", icon: Utensils, to: "menus" }, { label: "Packages", icon: Package, to: "packages" },
    { label: "Business Profile", icon: Building2, to: "vendorProfile" }, { label: "Reviews", icon: Star, to: "reviews" },
    { label: "Notifications", icon: Bell, to: "notifications" }, { label: "Staff & Teams", icon: Users, to: "staff" },
    { label: "Resources", icon: Briefcase, to: "resources" }, { label: "Settings", icon: SettingsIcon, to: "vendorSettings" },
  ];
  return (
    <Screen nav={<BottomNav active="more" go={go} />}>
      <div className="px-5 pt-4 pb-6">
        <div className="ev-display text-[21px] font-semibold ev-ink mb-4">More</div>
        <div className="grid grid-cols-3 gap-3">
          {items.map((it) => (
            <button key={it.label} onClick={() => go(it.to)} className="ev-tap ev-card rounded-2xl p-3.5 flex flex-col items-center gap-2 text-center">
              <div className="w-9 h-9 rounded-full ev-bg-accent-soft flex items-center justify-center"><it.icon size={16} className="ev-accent" /></div>
              <span className="text-[11px] font-medium ev-ink leading-tight">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function StaffScreen({ go, teams, staff, setStaff }) {
  const [nameInput, setNameInput] = useState(""); const [roleInput, setRoleInput] = useState("Server"); const [teamInput, setTeamInput] = useState(teams[0].name);
  const roles = ["Chef", "Assistant Chef", "Server", "Manager", "Driver", "Other"];
  const addStaff = () => {
    if (!nameInput.trim()) return;
    setStaff([...staff, { id: "s" + (staff.length + 1), name: nameInput.trim(), role: roleInput, team: teamInput, status: "Active" }]);
    setNameInput("");
  };
  const toggleStatus = (id) => setStaff(staff.map((s) => s.id === id ? { ...s, status: s.status === "Active" ? "On Leave" : "Active" } : s));
  const removeStaff = (id) => setStaff(staff.filter((s) => s.id !== id));

  return (
    <Screen>
      <TopBar title="Staff & Teams" onBack={() => go("more")} />
      <div className="px-5 pb-6">
        <div className="text-[12px] font-semibold ev-ink mb-2.5">Chef teams</div>
        <div className="space-y-2.5 mb-5">
          {teams.map((t) => (
            <button key={t.id} onClick={() => go("teamDetail_" + t.id)} className="ev-tap ev-card rounded-2xl p-4 text-left w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13.5px] font-semibold ev-ink">{t.name}</span>
                <Badge tone={t.status === "Available" ? "success" : "gold"}>{t.status}</Badge>
              </div>
              <div className="text-[11.5px] ev-muted">Capacity: {t.capacity} guests · {t.members} members</div>
            </button>
          ))}
        </div>

        <div className="text-[12px] font-semibold ev-ink mb-2.5">All staff</div>
        <div className="space-y-2 mb-4">
          {staff.map((s) => (
            <div key={s.id} className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full ev-bg-accent-soft flex items-center justify-center shrink-0 text-[13px] font-semibold ev-accent">{s.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold ev-ink truncate">{s.name}</div>
                <div className="text-[11px] ev-muted">{s.role} · {s.team}</div>
              </div>
              <button onClick={() => toggleStatus(s.id)} className="ev-tap"><Badge tone={s.status === "Active" ? "success" : "gold"}>{s.status}</Badge></button>
              <button onClick={() => removeStaff(s.id)} className="ev-tap"><X size={14} className="ev-faint" /></button>
            </div>
          ))}
        </div>

        <div className="ev-card rounded-2xl p-4">
          <div className="text-[12px] font-semibold ev-ink mb-2.5">Add staff member</div>
          <InputField label="Name" value={nameInput} onChange={setNameInput} icon={User} />
          <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Role</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {roles.map((r) => (
              <button key={r} onClick={() => setRoleInput(r)} className={"ev-tap rounded-xl py-2 text-[11.5px] font-semibold border " + (roleInput === r ? "ev-bg-accent-soft ev-accent" : "ev-card ev-ink")} style={{ borderColor: roleInput === r ? "#96114C" : "#E9E2D6" }}>{r}</button>
            ))}
          </div>
          <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Assign to team</label>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {teams.map((t) => (
              <button key={t.id} onClick={() => setTeamInput(t.name)} className={"ev-tap rounded-xl py-2.5 text-[12.5px] font-semibold border " + (teamInput === t.name ? "ev-bg-accent-soft ev-accent" : "ev-card ev-ink")} style={{ borderColor: teamInput === t.name ? "#96114C" : "#E9E2D6" }}>{t.name}</button>
            ))}
          </div>
          <PrimaryButton onClick={addStaff} icon={Plus}>Add Staff Member</PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}

function TeamDetailScreen({ go, teamId, teams, staff }) {
  const t = teams.find((x) => x.id === teamId) || teams[0];
  const members = staff.filter((s) => s.team === t.name);
  return (
    <Screen>
      <TopBar title={t.name} onBack={() => go("staff")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-4">
          <ReviewRow label="Capacity" value={`${t.capacity} guests`} />
          <ReviewRow label="Members" value={t.members} />
          <ReviewRow label="Status" value={t.status} />
        </div>
        <div className="text-[12px] font-semibold ev-ink mb-2.5">Team roster</div>
        <div className="space-y-2">
          {members.length === 0 && <div className="text-[12px] ev-muted text-center py-6">No staff assigned to this team yet.</div>}
          {members.map((s) => (
            <div key={s.id} className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full ev-bg-accent-soft flex items-center justify-center shrink-0 text-[13px] font-semibold ev-accent">{s.name[0]}</div>
              <div className="flex-1"><div className="text-[12.5px] font-semibold ev-ink">{s.name}</div><div className="text-[11px] ev-muted">{s.role}</div></div>
              <Badge tone={s.status === "Active" ? "success" : "gold"}>{s.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function ResourcesScreen({ go, resources, setResources }) {
  const categories = ["Plates", "Tables", "Serving Equipment", "Cooking Equipment", "Vehicles", "Other"];
  const [label, setLabel] = useState(""); const [category, setCategory] = useState(categories[0]); const [qty, setQty] = useState("");
  const cycleStatus = (id) => setResources(resources.map((r) => r.id !== id ? r : { ...r, status: r.status === "Available" ? "Assigned" : r.status === "Assigned" ? "Unavailable" : "Available" }));
  const addResource = () => {
    if (!label.trim() || !qty) return;
    setResources([...resources, { id: "r" + (resources.length + 1), category, label: label.trim(), quantity: Number(qty), status: "Available" }]);
    setLabel(""); setQty("");
  };
  const toneFor = (status) => status === "Available" ? "success" : status === "Assigned" ? "info" : "danger";

  return (
    <Screen>
      <TopBar title="Catering Resources" onBack={() => go("more")} />
      <div className="px-5 pb-6">
        {categories.map((cat) => {
          const items = resources.filter((r) => r.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} className="mb-4">
              <div className="text-[12px] font-semibold ev-ink mb-2">{cat}</div>
              <div className="space-y-2">
                {items.map((r) => (
                  <div key={r.id} className="ev-card rounded-2xl p-3.5 flex items-center justify-between">
                    <div><div className="text-[12.5px] font-semibold ev-ink">{r.label}</div><div className="text-[11px] ev-muted">Qty: {r.quantity}</div></div>
                    <button onClick={() => cycleStatus(r.id)} className="ev-tap"><Badge tone={toneFor(r.status)}>{r.status}</Badge></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="ev-card rounded-2xl p-4 mt-2">
          <div className="text-[12px] font-semibold ev-ink mb-2.5">Add resource</div>
          <InputField label="Name" placeholder="e.g. Round tables" value={label} onChange={setLabel} />
          <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Category</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={"ev-tap rounded-xl py-2 text-[11.5px] font-semibold border " + (category === c ? "ev-bg-accent-soft ev-accent" : "ev-card ev-ink")} style={{ borderColor: category === c ? "#96114C" : "#E9E2D6" }}>{c}</button>
            ))}
          </div>
          <InputField label="Quantity" value={qty} onChange={setQty} type="number" />
          <PrimaryButton onClick={addResource} icon={Plus}>Add Resource</PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}
function VendorSettingsScreen({ go, onLogout }) {
  const [notif, setNotif] = useState(true); const [autoQuote, setAutoQuote] = useState(false);
  return (
    <Screen>
      <TopBar title="Settings" onBack={() => go("more")} />
      <div className="px-5 pb-6">
        <div className="text-[12px] font-semibold ev-muted mb-2.5 uppercase tracking-wide">Preferences</div>
        <div className="flex items-center justify-between ev-card rounded-2xl p-3.5 mb-2.5">
          <div><div className="text-[13px] font-medium ev-ink">Enquiry notifications</div><div className="text-[11px] ev-muted">New enquiries and quote updates</div></div>
          <button onClick={() => setNotif(!notif)} className={"w-10 h-6 rounded-full relative ev-tap " + (notif ? "ev-bg-accent" : "bg-[#E9E2D6]")}><div className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white" style={{ left: notif ? "18px" : "3px" }} /></button>
        </div>
        <div className="flex items-center justify-between ev-card rounded-2xl p-3.5 mb-5">
          <div><div className="text-[13px] font-medium ev-ink">Auto-decline when fully booked</div><div className="text-[11px] ev-muted">Hide from matching on full-capacity dates</div></div>
          <button onClick={() => setAutoQuote(!autoQuote)} className={"w-10 h-6 rounded-full relative ev-tap " + (autoQuote ? "ev-bg-accent" : "bg-[#E9E2D6]")}><div className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white" style={{ left: autoQuote ? "18px" : "3px" }} /></button>
        </div>
        <button onClick={() => go("vendorProfile")} className="ev-tap w-full ev-card rounded-2xl p-3.5 flex items-center gap-3 mb-2.5"><Building2 size={16} className="ev-accent" /><span className="flex-1 text-left text-[13px] font-medium ev-ink">Business Profile</span><ChevronRight size={15} className="ev-faint" /></button>
        <button className="ev-tap w-full ev-card rounded-2xl p-3.5 flex items-center gap-3"><AlertCircle size={16} className="ev-accent" /><span className="flex-1 text-left text-[13px] font-medium ev-ink">Help & Support</span><ChevronRight size={15} className="ev-faint" /></button>
        <button onClick={onLogout} className="ev-tap w-full text-center py-3.5 mt-5 text-[13px] font-semibold flex items-center justify-center gap-1.5" style={{ color: "#B23B4A" }}><LogOut size={14} /> Log Out</button>
      </div>
    </Screen>
  );
}
function ChatVendorScreen({ go }) {
  const [msgs, setMsgs] = useState([
    { from: "customer", text: "Hi! Can you confirm the setup time for our reception?", time: "4:12 PM" },
    { from: "vendor", text: "Yes, our team will arrive at 3:00 PM for setup, service starts 6:00 PM.", time: "4:20 PM" },
  ]);
  const [input, setInput] = useState("");
  const send = () => { if (!input.trim()) return; setMsgs([...msgs, { from: "vendor", text: input, time: "Now" }]); setInput(""); };
  return (
    <Screen>
      <TopBar title="Arjun & Divya" sub="Reception · 25 Jan 2027" onBack={() => go("bookings")} />
      <div className="flex-1 overflow-y-auto ev-scroll px-5 py-2 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={"flex " + (m.from === "vendor" ? "justify-end" : "justify-start")}>
            <div className={"max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug " + (m.from === "vendor" ? "ev-bg-accent text-white" : "ev-card ev-ink")}>{m.text}<div className={"text-[9.5px] mt-1 " + (m.from === "vendor" ? "text-white/70" : "ev-faint")}>{m.time}</div></div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 flex items-center gap-2 shrink-0 border-t" style={{ borderColor: "#E9E2D6" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message customer..." className="flex-1 ev-card rounded-full px-4 py-2.5 text-[13px] outline-none placeholder:ev-faint" />
        <button onClick={send} className="w-10 h-10 rounded-full ev-bg-accent flex items-center justify-center ev-tap shrink-0"><Send size={15} className="text-white" /></button>
      </div>
    </Screen>
  );
}

/* ================= APP ================= */

function useViewport() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 375);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "bookings", label: "Bookings", icon: Briefcase },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "enquiries", label: "Enquiries", icon: ClipboardList },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "menus", label: "Menus", icon: Utensils },
  { id: "packages", label: "Packages", icon: Package },
  { id: "staff", label: "Staff & Teams", icon: Users },
  { id: "resources", label: "Resources", icon: Briefcase },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "vendorProfile", label: "Profile", icon: Building2 },
  { id: "vendorSettings", label: "Settings", icon: SettingsIcon },
];

function SidebarNav({ active, go, expanded }) {
  return (
    <div className={"shrink-0 h-screen sticky top-0 flex flex-col ev-card border-r py-5 " + (expanded ? "w-64 px-4" : "w-20 px-2 items-center")} style={{ borderRightColor: "#E9E2D6" }}>
      <div className={"flex items-center gap-2 mb-8 " + (expanded ? "px-2" : "")}>
        <div className="w-9 h-9 rounded-xl ev-bg-accent flex items-center justify-center shrink-0"><span className="ev-display text-white text-[16px] font-semibold">E</span></div>
        {expanded && <span className="ev-display text-[16px] font-semibold ev-ink">Eventra Vendor</span>}
      </div>
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto ev-scroll">
        {SIDEBAR_ITEMS.map((it) => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={() => go(it.id)} title={it.label}
              className={"ev-tap flex items-center gap-3 rounded-xl py-2.5 " + (expanded ? "px-3" : "px-0 justify-center") + " " + (isActive ? "ev-bg-accent-soft ev-accent" : "ev-muted")}>
              <it.icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              {expanded && <span className="text-[13px] font-medium">{it.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function EventraVendorApp() {
  const [screen, setScreen] = useState("vendorLanding");
  const [loggedIn, setLoggedIn] = useState(false);
  const [vendorProfile, setVendorProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    city: "",
    description: "",
    logoUrl: "",
  });
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);
  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [staff, setStaff] = useState(STAFF);
  const [resources, setResources] = useState(RESOURCES);
  const prototypeState = usePrototypeState();
  const prototypeRequirements = getRequirementsForVendor(prototypeState, PROTOTYPE_VENDOR_ID).slice().reverse();
  const prototypeQuotes = getQuotesForVendor(prototypeState, PROTOTYPE_VENDOR_ID);
  const sessionTokenRef = useRef(0);
  const logoutInProgressRef = useRef(false);

  useEffect(() => {
    registerPrototypeVendor({
      id: PROTOTYPE_VENDOR_ID,
      businessName: vendorProfile.businessName || "Annapoorna Catering Co.",
      category: "Catering",
      location: vendorProfile.city || "Chennai",
      status: "active",
    });
  }, [vendorProfile.businessName, vendorProfile.city]);

  const loadVendorProfile = async (user, vendorRecord = null) => {
    const resolvedVendorRecord = vendorRecord || (await getVendorProfile(user.id)).profile || null;
    setVendorProfile({
      fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
      email: user.email || "",
      phone: user.user_metadata?.phone || resolvedVendorRecord?.phone || "",
      businessName: resolvedVendorRecord?.business_name || "",
      city: resolvedVendorRecord?.city || "",
      description: resolvedVendorRecord?.description || "",
      logoUrl: resolvedVendorRecord?.logo_url || "",
    });
  };

  const clearVendorSession = () => {
    sessionTokenRef.current += 1;
    setLoggedIn(false);
    setVendorProfile({
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      city: "",
      description: "",
      logoUrl: "",
    });
    setScreen("vendorLanding");
  };

  useEffect(() => {
    let mounted = true;

    const restoreVendorSession = async () => {
      const { user, profile, error } = await getCurrentVendor();
      if (!mounted) return;
      if (error || !user) {
        clearVendorSession();
        return;
      }

      setLoggedIn(true);
      await loadVendorProfile(user, profile);
      setScreen("dashboard");
    };

    restoreVendorSession();
    const unsubscribe = onVendorAuthStateChange(async ({ user }) => {
      if (!mounted) return;

      const syncToken = sessionTokenRef.current + 1;
      sessionTokenRef.current = syncToken;

      if (!user) {
        clearVendorSession();
        return;
      }

      const { profile: vendorRecord, error } = await getVendorProfile(user.id);
      if (!mounted || syncToken !== sessionTokenRef.current) return;

      if (error || !vendorRecord) {
        await signOutVendor();
        clearVendorSession();
        return;
      }

      setLoggedIn(true);
      await loadVendorProfile(user, vendorRecord);
      if (!mounted || syncToken !== sessionTokenRef.current) return;
      setScreen("dashboard");
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleVendorAuthenticated = async (authenticatedUser = null) => {
    let user = authenticatedUser;

    if (!user) {
      const { user: currentUser, error } = await getCurrentVendor();
      if (error || !currentUser) {
        setLoggedIn(false);
        setScreen("vendorLanding");
        return;
      }
      user = currentUser;
    }

    const { profile: vendorRecord, error } = await getVendorProfile(user.id);
    if (error || !vendorRecord) {
      setLoggedIn(false);
      setScreen("vendorLanding");
      return;
    }

    setLoggedIn(true);
    await loadVendorProfile(user, vendorRecord);
    setScreen("dashboard");
  };

  const handleVendorLogout = async () => {
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true;

    try {
      await signOutVendor();
    } finally {
      logoutInProgressRef.current = false;
      clearVendorSession();
    }
  };

  const handleSaveProfileImage = ({ file, previewUrl }) => {
    setVendorProfile((current) => ({ ...current, logoUrl: previewUrl, logoFile: file }));
  };

  const width = useViewport();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;
  const viewport = isMobile ? "mobile" : isDesktop ? "desktop" : "tablet";

  const go = (s) => setScreen(s);

  let content;
  if (screen.startsWith("bookingDetail_")) content = <BookingDetailScreen go={go} bookingId={screen.replace("bookingDetail_", "")} />;
  else if (screen.startsWith("quoteBuilder_")) content = <QuoteBuilderScreen go={go} enquiryId={screen.replace("quoteBuilder_", "")} enquiries={enquiries} setQuotes={setQuotes} quotes={quotes} prototypeRequirements={prototypeRequirements} vendorProfile={vendorProfile} />;
  else if (screen.startsWith("menuDetail_")) content = <MenuDetailScreen go={go} menuId={screen.replace("menuDetail_", "")} menus={menus} setMenus={setMenus} />;
  else if (screen.startsWith("packageDetail_")) content = <PackageDetailScreen go={go} packageId={screen.replace("packageDetail_", "")} packages={packages} setPackages={setPackages} />;
  else if (screen.startsWith("teamDetail_")) content = <TeamDetailScreen go={go} teamId={screen.replace("teamDetail_", "")} teams={TEAMS} staff={staff} />;
  else {
    const map = {
      vendorLanding: <VendorLandingScreen go={go} />,
      vendorLogin: <VendorLoginScreen go={go} onVendorAuthenticated={handleVendorAuthenticated} />,
      vendorRegister: <VendorRegisterScreen go={go} />,
      onboard1: <Onboard1 go={go} />, onboard2: <Onboard2 go={go} />, onboard3: <Onboard3 go={go} />, onboard4: <Onboard4 go={go} />, onboard5: <Onboard5 go={go} />,
      verificationPending: <VerificationPendingScreen go={go} onVendorAuthenticated={handleVendorAuthenticated} />,
      dashboard: <DashboardScreen go={go} viewport={viewport} vendorProfile={vendorProfile} />,
      calendar: <CalendarScreen go={go} />,
      bookings: <BookingsScreen go={go} viewport={viewport} />,
      enquiries: <EnquiriesScreen go={go} enquiries={enquiries} setEnquiries={setEnquiries} prototypeRequirements={prototypeRequirements} onUpdatePrototypeRequirement={updateRequirementStatus} viewport={viewport} />,
      quotes: <QuotesScreen go={go} quotes={quotes} prototypeQuotes={prototypeQuotes} prototypeRequirements={prototypeState.requirements} viewport={viewport} />,
      menus: <MenusScreen go={go} menus={menus} setMenus={setMenus} />,
      packages: <PackagesScreen go={go} packages={packages} />,
      staff: <StaffScreen go={go} teams={TEAMS} staff={staff} setStaff={setStaff} />,
      resources: <ResourcesScreen go={go} resources={resources} setResources={setResources} />,
      vendorProfile: <VendorProfileScreen go={go} vendorProfile={vendorProfile} />,
      editVendorProfile: <EditVendorProfileScreen go={go} vendorProfile={vendorProfile} onSaveProfileImage={handleSaveProfileImage} />,
      earnings: <EarningsScreen go={go} viewport={viewport} />,
      reviews: <ReviewsScreen go={go} />,
      notifications: <NotificationsScreen go={go} />,
      more: <MoreScreen go={go} />,
      vendorSettings: <VendorSettingsScreen go={go} onLogout={handleVendorLogout} />,
      chatVendor: <ChatVendorScreen go={go} />,
    };
    content = map[screen] || <DashboardScreen go={go} viewport={viewport} />;
  }

  const preAuthScreens = ["vendorLanding", "vendorLogin", "vendorRegister", "onboard1", "onboard2", "onboard3", "onboard4", "onboard5", "verificationPending"];
  const showAppShell = loggedIn && !preAuthScreens.includes(screen);

  if (!isMobile && showAppShell) {
    // Tablet / Desktop — genuinely responsive shell: sidebar nav, no phone bezel, wide content area.
    return (
      <div className="ev min-h-screen flex" style={{ background: "#EDE7DC" }}>
        <style>{TOKENS}</style>
        <SidebarNav active={screen} go={go} expanded={isDesktop} />
        <div className="flex-1 min-w-0 ev-bg min-h-screen">
          <div className={"mx-auto min-h-screen " + (isDesktop ? "max-w-6xl px-10 py-8" : "px-5 py-6")}>{content}</div>
        </div>
      </div>
    );
  }

  // Mobile (and pre-auth screens at any width) — full viewport width, no artificial phone frame.
  // Width is capped only from md+ for readability; below md it's edge-to-edge.
  return (
    <div className="ev w-full min-h-screen flex flex-col ev-bg">
      <style>{TOKENS}</style>
      <div className="w-full flex-1 flex flex-col min-h-screen md:max-w-xl md:mx-auto">
        <StatusBar />
        <div className="flex-1 min-h-0 flex flex-col">{content}</div>
      </div>
    </div>
  );
}
