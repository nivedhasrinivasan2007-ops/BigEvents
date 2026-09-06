import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Home, FileText, MessageCircle, Calendar,
  User, Check, Star, MapPin, Users, Clock, ShieldCheck, Send, Plus,
  Minus, ChefHat, IndianRupee, CircleCheck, X, Sparkles,
  TrendingDown, Bell, CalendarCheck, Wallet, CreditCard, Smartphone,
  Building2, ArrowRight, CheckCheck, Camera, Info, Phone, PhoneOff, Pencil, ListChecks
} from "lucide-react";

/* ---------------------------------------------------------------
   EVENTRA — Customer App Prototype
   Requirement → Match → Quote → Compare → Negotiate → Book → Pay → Review
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
  .ev-border { border-color: #E9E2D6; }
  .ev-card { background: #FFFFFF; border: 1px solid #E9E2D6; }

  .ev-btn-primary {
    background: #96114C; color: #FFF8F1; font-weight: 600;
    transition: transform .15s ease, background .15s ease;
  }
  .ev-btn-primary:active { transform: scale(0.97); background: #7C0E3F; }
  .ev-btn-ghost {
    background: transparent; color: #96114C; border: 1.5px solid #E9CBDA; font-weight: 600;
  }
  .ev-btn-ghost:active { transform: scale(0.97); }

  .ev-stub {
    position: relative;
  }
  .ev-stub::before {
    content: "";
    position: absolute;
    left: 0; right: 0; top: var(--perf-top, 88px);
    height: 0;
    border-top: 1.5px dashed #E3D9C8;
  }
  .ev-stub::after {
    content: "";
    position: absolute;
    left: -8px; top: calc(var(--perf-top, 88px) - 8px);
    width: 16px; height: 16px; border-radius: 999px; background: #FBF8F3;
    border: 1px solid #E9E2D6;
    box-shadow: 392px 0 0 -1px #E9E2D6;
  }

  .ev-scroll::-webkit-scrollbar { display: none; }
  .ev-scroll { -ms-overflow-style: none; scrollbar-width: none; }

  .ev-tap:active { transform: scale(0.97); }

  @keyframes ev-fade-in { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
  .ev-anim { animation: ev-fade-in .28s ease; }

  @keyframes ev-pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(150,17,76,0.25); }
    100% { box-shadow: 0 0 0 14px rgba(150,17,76,0); }
  }
  .ev-pulse { animation: ev-pulse-ring 1.6s infinite; }
`;

/* ---------------- Mock data ---------------- */

const IMAGES = {
  food1: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
  buffet: "https://images.unsplash.com/photo-1686853021522-1b0e9a81706e?auto=format&fit=crop&w=800&q=80",
  staff: "https://images.unsplash.com/photo-1719329466711-743e0121235d?auto=format&fit=crop&w=600&q=80",
  tableSetting: "https://images.unsplash.com/photo-1505366055494-2268a382e017?auto=format&fit=crop&w=600&q=80",
};

function VendorImage({ src, alt, className = "", rounded = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={className + " ev-bg-accent-soft flex items-center justify-center " + rounded}>
        <ChefHat size={22} className="ev-accent" style={{ opacity: 0.6 }} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className + " object-cover " + rounded}
    />
  );
}

const VENDORS = [
  {
    id: "v1",
    name: "Annapoorna Catering Co.",
    tagline: "South Indian Wedding Specialists",
    image: IMAGES.food1,
    rating: 4.8,
    reviews: 214,
    events: "250+ events",
    location: "Adyar, Chennai",
    verified: true,
    experience: "9 yrs",
    price: 85000,
    perGuest: 340,
    package: "Classic South Indian Wedding Package",
    inclusions: ["Welcome Drink", "Live dosa counter", "5-course sit-down meal", "Buffet staff (12)", "Banana leaf service", "Filter coffee counter"],
    exclusions: ["Crockery upgrade", "Live grill counter", "Décor for buffet table", "Transportation"],
    minGuests: 150,
    notes: "Extra live counters available at additional cost.",
    staff: 12,
    duration: "5 hrs service window",
    status: "New",
  },
  {
    id: "v2",
    name: "Grand Feast Catering",
    tagline: "Multi-cuisine Premium Events",
    image: IMAGES.buffet,
    rating: 4.9,
    reviews: 341,
    events: "400+ events",
    location: "T. Nagar, Chennai",
    verified: true,
    experience: "12 yrs",
    price: 92000,
    perGuest: 368,
    package: "Premium Multi-Cuisine Package",
    inclusions: ["Welcome Drink", "North + South Indian counters", "Live chaat counter", "Dessert station", "Premium crockery", "Buffet staff (15)"],
    exclusions: ["Alcohol service", "Imported cheese counter", "Transportation"],
    minGuests: 200,
    notes: "Menu can be customised per region on request.",
    staff: 15,
    duration: "6 hrs service window",
    status: "New",
  },
  {
    id: "v3",
    name: "Coastal Spice Catering",
    tagline: "Regional & Coastal Cuisine",
    image: IMAGES.food1,
    rating: 4.6,
    reviews: 128,
    events: "150+ events",
    location: "Mylapore, Chennai",
    verified: true,
    experience: "6 yrs",
    price: 78000,
    perGuest: 312,
    package: "Coastal Vegetarian Feast",
    inclusions: ["Welcome Drink", "Traditional sadhya-style service", "Live dosa counter", "Buffet staff (10)", "Banana leaf service"],
    exclusions: ["Live grill counter", "Premium dessert station", "Transportation"],
    minGuests: 80,
    notes: "Coastal specials available for an additional per-plate charge.",
    staff: 10,
    duration: "4.5 hrs service window",
    status: "New",
  },
];

const inr = (n) => "₹" + n.toLocaleString("en-IN");

/* =====================================================================
   SHARED CAPACITY ENGINE — v1.0
   This block must stay byte-identical to the copy in eventra-vendor-app.jsx.
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

// Per-vendor team data — v1 mirrors eventra-vendor-app.jsx's TEAMS exactly (same business, same capacity, single source of truth).
const TEAMS_BY_VENDOR = {
  v1: [{ id: "t1", name: "Chef Team A", capacity: 300, members: 4, status: "Available" }, { id: "t2", name: "Chef Team B", capacity: 300, members: 3, status: "Assigned" }, { id: "t3", name: "Chef Team C", capacity: 200, members: 2, status: "Available" }],
  v2: [{ id: "t1", name: "Chef Team A", capacity: 400, members: 5 }, { id: "t2", name: "Chef Team B", capacity: 350, members: 4 }, { id: "t3", name: "Chef Team C", capacity: 250, members: 3 }],
  v3: [{ id: "t1", name: "Chef Team A", capacity: 200, members: 3 }, { id: "t2", name: "Chef Team B", capacity: 150, members: 2 }],
};
// Named bookings (v1's real ones mirror the Vendor app's BOOKINGS b1/b2) + deterministic filler + narrative overrides for the demo date.
const BOOKINGS_BY_VENDOR = {
  v1: [{ dateKey: "2027-01-25", guests: 350 }, { dateKey: "2027-02-14", guests: 250 }, { dateKey: "2027-02-14", guests: 350 }, ...generateFillerBookings(TEAMS_BY_VENDOR.v1, 11)],
  v2: [{ dateKey: "2027-02-14", guests: 150 }, ...generateFillerBookings(TEAMS_BY_VENDOR.v2, 23)],
  v3: [{ dateKey: "2027-02-14", guests: 350 }, ...generateFillerBookings(TEAMS_BY_VENDOR.v3, 37)],
};

const MATCH = {
  v1: { score: 95, reasons: ["Serves your event category — Catering", "Based in Chennai, near your venue", "Verified vendor with 250+ completed events", "Limited slots left for 14 Feb — act soon"] },
  v2: { score: 89, reasons: ["Serves your event category — Catering", "Based in Chennai, near your venue", "Verified vendor with 400+ completed events", "Open availability for 14 Feb"] },
  v3: { score: 91, reasons: ["Serves your event category — Catering", "Based in Chennai, near your venue", "Verified vendor with 150+ completed events", "Fully booked for 14 Feb — suggest an alternate date"] },
};

function getDateStatus(vendorId, day) {
  const teams = TEAMS_BY_VENDOR[vendorId];
  const bookings = BOOKINGS_BY_VENDOR[vendorId];
  const dateKey = `2027-02-${String(day).padStart(2, "0")}`;
  const total = capacityEngine.getTotalCapacity(teams);
  const booked = capacityEngine.getBookedGuestCount(bookings, dateKey);
  const remaining = capacityEngine.getRemainingCapacity(teams, bookings, dateKey);
  const status = capacityEngine.getAvailabilityStatus(remaining, total);
  return { booked, total, remaining, status };
}
const STATUS_STYLE = {
  available: { bg: "#E9F5EE", text: "#2F7A52", label: "Available" },
  limited: { bg: "#FBF2E1", text: "#A9832E", label: "Limited" },
  full: { bg: "#F8DCE0", text: "#B23B4A", label: "Fully Booked" },
};

function AvailabilityPill({ vendorId, day = 14, compact }) {
  const d = getDateStatus(vendorId, day);
  const s = STATUS_STYLE[d.status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {compact ? s.label : `${s.label} for your date`}
    </span>
  );
}

function useCountdown(hoursFromNow) {
  const [target] = useState(() => Date.now() + hoursFromNow * 3600 * 1000);
  const [left, setLeft] = useState(target - Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(target - Date.now(), 0)), 30000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  return { h, m };
}

const REQUIREMENT_STAGES = [
  { label: "Requirement Created", time: "Today, 9:12 AM", done: true },
  { label: "Matching Vendors", time: "Today, 9:12 AM", done: true },
  { label: "Quotes Received", time: "Today, 11:40 AM", done: true },
  { label: "Comparing Proposals", time: "In progress", done: true, current: true },
  { label: "Negotiating", time: "Not started", done: false },
  { label: "Proposal Accepted", time: "Not started", done: false },
  { label: "Payment & Booking", time: "Not started", done: false },
  { label: "Event Completed", time: "Not started", done: false },
  { label: "Review Submitted", time: "Not started", done: false },
];

/* ---------------- Small building blocks ---------------- */

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold ev-ink shrink-0">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px] h-3">
          <div className="w-[3px] h-[5px] bg-current rounded-sm" />
          <div className="w-[3px] h-[7px] bg-current rounded-sm" />
          <div className="w-[3px] h-[9px] bg-current rounded-sm" />
          <div className="w-[3px] h-[11px] bg-current rounded-sm" />
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
    { id: "home", label: "Home", icon: Home },
    { id: "proposals", label: "Proposals", icon: FileText },
    { id: "chat", label: "Messages", icon: MessageCircle },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div className="shrink-0 ev-card border-t flex items-stretch px-1 pb-2 pt-1.5 md:hidden" style={{ borderTopColor: "#E9E2D6" }}>
      {items.map((it) => {
        const isActive = active === it.id;
        const Icon = it.icon;
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

/* ---------------- Tablet / desktop navigation ---------------- */

function useViewport() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 375);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const SIDEBAR_NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "proposals", label: "Proposals", icon: FileText },
  { id: "chat", label: "Messages", icon: MessageCircle },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

function SidebarNav({ active, go, expanded }) {
  return (
    <div className={"shrink-0 h-screen sticky top-0 flex flex-col ev-card border-r py-5 " + (expanded ? "w-64 px-4" : "w-20 px-2 items-center")} style={{ borderRightColor: "#E9E2D6" }}>
      <div className={"flex items-center gap-2 mb-8 " + (expanded ? "px-2" : "")}>
        <div className="w-9 h-9 rounded-xl ev-bg-accent flex items-center justify-center shrink-0"><span className="ev-display text-white text-[16px] font-semibold">E</span></div>
        {expanded && <span className="ev-display text-[16px] font-semibold ev-ink">Eventra</span>}
      </div>
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto ev-scroll">
        {SIDEBAR_NAV_ITEMS.map((it) => {
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

function PrimaryButton({ children, onClick, icon: Icon, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={"ev-btn-primary ev-tap w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[15px] " + (disabled ? "opacity-40" : "")}
    >
      {children}
      {Icon && <Icon size={17} />}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className="ev-btn-ghost ev-tap w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[15px]">
      {children}
      {Icon && <Icon size={17} />}
    </button>
  );
}

function Badge({ children, tone = "accent" }) {
  const map = {
    accent: "ev-bg-accent-soft ev-accent",
    gold: "ev-bg-gold-soft ev-gold",
    success: "ev-bg-success-soft ev-success",
    neutral: "bg-[#F1EEE7] ev-muted",
  };
  return <span className={"px-2 py-[3px] rounded-full text-[11px] font-semibold inline-flex items-center gap-1 " + map[tone]}>{children}</span>;
}

function StepDots({ step, total }) {
  return (
    <div className="flex items-center gap-1.5 px-5 pb-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < step ? "#96114C" : "#E9E2D6" }} />
      ))}
    </div>
  );
}

/* ---------------- Screen wrapper ---------------- */

function Screen({ children, nav }) {
  return (
    <div className="flex flex-col h-full ev-bg">
      <div className="flex-1 overflow-y-auto ev-scroll ev-anim">{children}</div>
      {nav}
    </div>
  );
}

/* ================= SCREENS ================= */

function LandingScreen({ go }) {
  return (
    <Screen>
      <div className="h-full flex flex-col justify-between px-7 pt-16 pb-10">
        <div>
          <div className="w-14 h-14 rounded-2xl ev-bg-accent flex items-center justify-center mb-6">
            <span className="ev-display text-white text-2xl font-semibold">E</span>
          </div>
          <div className="ev-display text-[30px] leading-[1.15] font-semibold ev-ink">
            Describe your event once.
          </div>
          <div className="ev-display-italic text-[30px] leading-[1.15] ev-accent mb-4">
            Let vendors come to you.
          </div>
          <p className="ev-muted text-[14px] leading-relaxed">
            Eventra matches you with verified caterers, collects private quotes, and helps you compare on value — not just price.
          </p>
        </div>

        <div className="space-y-3">
          <PrimaryButton onClick={() => go("signUp")} icon={ArrowRight}>Create Account</PrimaryButton>
          <GhostButton onClick={() => go("signIn")}>I already have an account</GhostButton>
          <p className="text-center text-[11px] ev-faint pt-2">By continuing you agree to Eventra's Terms & Privacy Policy</p>
        </div>
      </div>
    </Screen>
  );
}

function InputField({ label, placeholder, value, onChange, type = "text", icon: Icon }) {
  return (
    <div className="mb-4">
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">{label}</label>
      <div className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
        {Icon && <Icon size={17} className="ev-accent shrink-0" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="bg-transparent outline-none text-[14px] ev-ink flex-1 placeholder:ev-faint" />
      </div>
    </div>
  );
}

function SignUpScreen({ go, setUserName }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const canContinue = name.trim().length > 1 && phone.trim().length >= 10;
  const submit = () => {
    setUserName(name.trim().split(" ")[0] ? name.trim() : name.trim());
    go("home");
  };
  return (
    <Screen>
      <TopBar title="Create Account" onBack={() => go("landing")} />
      <div className="px-5 pb-6">
        <p className="text-[13px] ev-muted mb-5">Let's start with your name so vendors know who they're working with.</p>
        <InputField label="Full Name" placeholder="e.g. Priya Raman" value={name} onChange={setName} icon={User} />
        <InputField label="Phone Number" placeholder="10-digit mobile number" value={phone} onChange={setPhone} type="tel" icon={Smartphone} />
        <InputField label="Email (optional)" placeholder="you@email.com" value={email} onChange={setEmail} type="email" />
        <PrimaryButton onClick={submit} icon={ArrowRight} disabled={!canContinue}>Create Account</PrimaryButton>
        <p className="text-center text-[12px] ev-muted mt-4">Already have an account? <button onClick={() => go("signIn")} className="ev-accent font-semibold">Log in</button></p>
      </div>
    </Screen>
  );
}

function SignInScreen({ go, setUserName }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const canContinue = name.trim().length > 1 && phone.trim().length >= 10;
  const submit = () => {
    setUserName(name.trim());
    go("home");
  };
  return (
    <Screen>
      <TopBar title="Log In" onBack={() => go("landing")} />
      <div className="px-5 pb-6">
        <p className="text-[13px] ev-muted mb-5">Welcome back — confirm your details to continue.</p>
        <InputField label="Full Name" placeholder="e.g. Priya Raman" value={name} onChange={setName} icon={User} />
        <InputField label="Phone Number" placeholder="10-digit mobile number" value={phone} onChange={setPhone} type="tel" icon={Smartphone} />
        <PrimaryButton onClick={submit} icon={ArrowRight} disabled={!canContinue}>Log In</PrimaryButton>
        <p className="text-center text-[12px] ev-muted mt-4">New to Eventra? <button onClick={() => go("signUp")} className="ev-accent font-semibold">Create an account</button></p>
      </div>
    </Screen>
  );
}

function HomeScreen({ go, userName }) {
  return (
    <Screen nav={<BottomNav active="home" go={go} />}>
      <div className="px-5 pt-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[13px] ev-muted">Good evening,</div>
            <div className="ev-display text-[22px] font-semibold ev-ink">{userName || "there"}</div>
          </div>
          <button className="w-10 h-10 rounded-full ev-card flex items-center justify-center relative ev-tap">
            <Bell size={17} className="ev-ink" />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full ev-bg-accent" />
          </button>
        </div>

        <button onClick={() => go("wizard1")} className="w-full ev-tap rounded-3xl p-5 text-left mb-5" style={{ background: "linear-gradient(135deg,#96114C,#6E0D39)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#F6C9DB]" />
            <span className="text-[12px] font-semibold text-[#F6C9DB] uppercase tracking-wide">New requirement</span>
          </div>
          <div className="ev-display text-white text-[19px] font-semibold leading-snug mb-1">Plan your next event</div>
          <div className="text-[13px] text-[#F0C7D8]">Tell us what you need — we'll bring the quotes to you</div>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3.5 py-2 text-white text-[13px] font-medium">
            Create Requirement <ArrowRight size={14} />
          </div>
        </button>

        <div className="mb-6">
          <div className="text-[13px] font-semibold ev-ink mb-2.5">Your event</div>
          <button onClick={() => go("requirementTimeline")} className="ev-tap ev-card rounded-2xl p-4 flex items-center gap-3 w-full text-left">
            <div className="w-11 h-11 rounded-xl ev-bg-gold-soft flex items-center justify-center shrink-0">
              <Calendar size={18} className="ev-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold ev-ink">Ramesh & Priya's Wedding</div>
              <div className="text-[12px] ev-muted">14 Feb 2027 · Chennai · 250 guests</div>
            </div>
            <Badge tone="gold">3 quotes</Badge>
            <ChevronRight size={16} className="ev-faint shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => go("proposals")} className="ev-card rounded-2xl p-4 text-left ev-tap">
            <FileText size={18} className="ev-accent mb-2" />
            <div className="text-[13px] font-semibold ev-ink">3 New Proposals</div>
            <div className="text-[11px] ev-muted">Catering quotes ready</div>
          </button>
          <button onClick={() => go("chat")} className="ev-card rounded-2xl p-4 text-left ev-tap">
            <MessageCircle size={18} className="ev-gold mb-2" />
            <div className="text-[13px] font-semibold ev-ink">1 Negotiation</div>
            <div className="text-[11px] ev-muted">Pending your reply</div>
          </button>
        </div>

        <div>
          <div className="text-[13px] font-semibold ev-ink mb-2.5">Recent activity</div>
          <div className="space-y-2.5">
            {[
              { icon: CircleCheck, text: "Grand Feast Catering sent a proposal", time: "2h ago", tone: "success" },
              { icon: MessageCircle, text: "Annapoorna countered your offer", time: "Yesterday", tone: "accent" },
              { icon: ShieldCheck, text: "Coastal Spice Catering is verified", time: "2 days ago", tone: "gold" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 ev-card rounded-xl p-3">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 " + (a.tone === "success" ? "ev-bg-success-soft" : a.tone === "gold" ? "ev-bg-gold-soft" : "ev-bg-accent-soft")}>
                  <a.icon size={14} className={a.tone === "success" ? "ev-success" : a.tone === "gold" ? "ev-gold" : "ev-accent"} />
                </div>
                <div className="flex-1 text-[12.5px] ev-ink leading-snug">{a.text}</div>
                <div className="text-[11px] ev-faint shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ---- Requirement wizard ---- */

function WizardShell({ step, total, title, sub, onBack, children, onNext, nextLabel = "Continue", nextDisabled }) {
  return (
    <Screen>
      <TopBar title={title} sub={sub} onBack={onBack} />
      <StepDots step={step} total={total} />
      <div className="px-5 pb-6">{children}</div>
      <div className="px-5 pb-6 mt-2">
        <PrimaryButton onClick={onNext} icon={ArrowRight} disabled={nextDisabled}>{nextLabel}</PrimaryButton>
      </div>
    </Screen>
  );
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
      <div className="flex-1">
        <div className={"text-[14px] font-semibold " + (selected ? "ev-accent" : "ev-ink")}>{label}</div>
        {sub && <div className="text-[11.5px] ev-muted">{sub}</div>}
      </div>
      {selected && <Check size={16} className="ev-accent" />}
    </button>
  );
}

function Wizard1({ data, setData, go }) {
  const [types, setTypes] = useState(["Wedding", "Reception", "Engagement", "Birthday", "Corporate Event", "Housewarming"]);
  const [customInput, setCustomInput] = useState("");
  const selected = data.types || [];
  const toggle = (t) => {
    const cur = selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t];
    setData({ ...data, types: cur });
  };
  const selectAll = () => setData({ ...data, types: types.slice() });
  const addCustom = () => {
    const t = customInput.trim();
    if (!t) return;
    if (!types.includes(t)) setTypes([...types, t]);
    setData({ ...data, types: [...selected, t] });
    setCustomInput("");
  };
  return (
    <WizardShell step={1} total={5} title="Event Type" sub="Step 1 of 5" onBack={() => go("home")}
      onNext={() => go("wizard2")} nextDisabled={selected.length === 0}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] ev-muted flex-1 pr-3">Select one or more events — this helps us match the right vendors.</p>
        <button onClick={selectAll} className="ev-tap text-[12px] font-semibold ev-accent shrink-0">Select All</button>
      </div>
      {types.map((t) => (
        <OptionTile key={t} label={t} selected={selected.includes(t)} onClick={() => toggle(t)} icon={Sparkles} />
      ))}
      <div className="flex items-center gap-2 mt-1">
        <div className="ev-card rounded-2xl p-3 flex-1">
          <input value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="+ Add Event (e.g. Mehendi)"
            className="bg-transparent outline-none text-[13px] ev-ink w-full placeholder:ev-faint" />
        </div>
        <button onClick={addCustom} className="ev-tap w-11 h-11 rounded-2xl ev-bg-accent flex items-center justify-center shrink-0">
          <Plus size={16} className="text-white" />
        </button>
      </div>
    </WizardShell>
  );
}

function Wizard2({ data, setData, go }) {
  const guestRanges = ["50–100", "100–250", "250–500", "500+"];
  return (
    <WizardShell step={2} total={5} title="Date, Location & Guests" sub="Step 2 of 5" onBack={() => go("wizard1")}
      onNext={() => go("wizard3")} nextDisabled={!data.date || !data.city || !data.guests}>
      <div className="mb-4">
        <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Event Date</label>
        <div className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
          <Calendar size={17} className="ev-accent" />
          <input type="date" defaultValue="2027-02-14" onChange={(e) => setData({ ...data, date: e.target.value })}
            className="bg-transparent outline-none text-[14px] ev-ink flex-1" />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-[12px] font-semibold ev-muted mb-1.5 block">City / Venue</label>
        <div className="ev-card rounded-2xl p-3.5 flex items-center gap-3">
          <MapPin size={17} className="ev-accent" />
          <input placeholder="e.g. Chennai — ITC Grand Chola" defaultValue="Chennai"
            onChange={(e) => setData({ ...data, city: e.target.value })}
            className="bg-transparent outline-none text-[14px] ev-ink flex-1 placeholder:ev-faint" />
        </div>
      </div>
      <div>
        <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Guest Count</label>
        <div className="grid grid-cols-2 gap-2.5">
          {guestRanges.map((g) => (
            <button key={g} onClick={() => setData({ ...data, guests: g })}
              className={"ev-tap rounded-xl py-3 text-[13.5px] font-semibold border " + (data.guests === g ? "ev-bg-accent-soft ev-accent" : "ev-card ev-ink")}
              style={{ borderColor: data.guests === g ? "#96114C" : "#E9E2D6" }}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </WizardShell>
  );
}

function Wizard3({ data, setData, go }) {
  const foodTypes = ["Vegetarian", "Non-Vegetarian", "Both"];
  const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const toggleMeal = (m) => {
    const cur = data.meals || [];
    setData({ ...data, meals: cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m] });
  };
  return (
    <WizardShell step={3} total={5} title="Catering Requirements" sub="Step 3 of 5" onBack={() => go("wizard2")}
      onNext={() => go("wizard4")} nextDisabled={!data.food || !(data.meals && data.meals.length)}>
      <div className="ev-card rounded-2xl p-3.5 mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg ev-bg-gold-soft flex items-center justify-center shrink-0">
          <ChefHat size={15} className="ev-gold" />
        </div>
        <div className="text-[12px] ev-muted">Catering is Eventra's MVP category — more services coming soon.</div>
      </div>
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Food Type</label>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {foodTypes.map((f) => (
          <button key={f} onClick={() => setData({ ...data, food: f })}
            className={"ev-tap rounded-xl py-2.5 text-[12.5px] font-semibold border " + (data.food === f ? "ev-bg-accent-soft ev-accent" : "ev-card ev-ink")}
            style={{ borderColor: data.food === f ? "#96114C" : "#E9E2D6" }}>
            {f}
          </button>
        ))}
      </div>
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Meals Required</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {meals.map((m) => (
          <OptionTile key={m} label={m} selected={(data.meals || []).includes(m)} onClick={() => toggleMeal(m)} />
        ))}
      </div>
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Cuisine Preference</label>
      <div className="ev-card rounded-2xl p-3.5">
        <input placeholder="e.g. South Indian, live dosa counter"
          defaultValue="South Indian vegetarian, live dosa counter"
          onChange={(e) => setData({ ...data, cuisine: e.target.value })}
          className="bg-transparent outline-none text-[14px] ev-ink w-full placeholder:ev-faint" />
      </div>
    </WizardShell>
  );
}

function Wizard4({ data, setData, go }) {
  const budgets = ["Under ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹2,00,000", "₹2,00,000+"];
  return (
    <WizardShell step={4} total={5} title="Budget" sub="Step 4 of 5" onBack={() => go("wizard3")}
      onNext={() => go("wizard5")} nextDisabled={!data.budget}>
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Approximate Budget</label>
      {budgets.map((b) => (
        <OptionTile key={b} label={b} selected={data.budget === b} onClick={() => setData({ ...data, budget: b })} icon={IndianRupee} />
      ))}
      <button onClick={() => setData({ ...data, flexible: !data.flexible })}
        className="w-full flex items-center justify-between ev-card rounded-2xl p-3.5 mt-2">
        <div className="text-[13px] font-medium ev-ink">Flexible on budget for the right vendor</div>
        <div className={"w-10 h-6 rounded-full relative transition-colors " + (data.flexible ? "ev-bg-accent" : "bg-[#E9E2D6]")}>
          <div className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: data.flexible ? "18px" : "3px" }} />
        </div>
      </button>
    </WizardShell>
  );
}

function Wizard5({ data, setData, go }) {
  return (
    <WizardShell step={5} total={5} title="Special Requirements" sub="Step 5 of 5" onBack={() => go("wizard4")}
      onNext={() => go("reviewReq")} nextLabel="Review Requirement">
      <label className="text-[12px] font-semibold ev-muted mb-1.5 block">Anything else vendors should know?</label>
      <div className="ev-card rounded-2xl p-3.5">
        <textarea rows={6} defaultValue="Need traditional South Indian vegetarian catering with a live dosa counter. Please account for elderly guests with low-spice options."
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          className="bg-transparent outline-none text-[14px] ev-ink w-full resize-none placeholder:ev-faint" />
      </div>
    </WizardShell>
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

function ReviewRequirementScreen({ data, go }) {
  return (
    <Screen>
      <TopBar title="Review Requirement" sub="Confirm before requesting quotes" onBack={() => go("wizard5")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-4">
          <ReviewRow label="Event(s)" value={(data.types && data.types.length ? data.types.join(", ") : "Wedding")} />
          <ReviewRow label="Date" value={data.date || "14 Feb 2027"} />
          <ReviewRow label="Location" value={data.city || "Chennai"} />
          <ReviewRow label="Guests" value={data.guests || "250–500"} />
          <ReviewRow label="Service" value="Catering" />
          <ReviewRow label="Food" value={`${data.food || "Vegetarian"} · ${(data.meals || ["Lunch", "Dinner"]).join(", ")}`} />
          <ReviewRow label="Cuisine" value={data.cuisine || "South Indian, live dosa counter"} />
          <ReviewRow label="Budget" value={data.budget || "₹50,000 – ₹1,00,000"} />
          <div className="pt-2.5">
            <span className="text-[12.5px] ev-muted block mb-1">Special requirements</span>
            <span className="text-[13px] ev-ink leading-relaxed">{data.notes || "Need traditional South Indian vegetarian catering with a live dosa counter."}</span>
          </div>
        </div>
        <div className="ev-card rounded-2xl p-3.5 flex gap-2.5 mb-6">
          <Info size={16} className="ev-gold shrink-0 mt-0.5" />
          <div className="text-[12px] ev-muted leading-relaxed">Your requirement is sent to <span className="font-semibold ev-ink">verified caterers only</span>. They'll submit private proposals — your budget stays confidential.</div>
        </div>
        <PrimaryButton onClick={() => go("matching")} icon={ArrowRight}>Request Quotes</PrimaryButton>
      </div>
    </Screen>
  );
}

function MatchingScreen({ go }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  React.useEffect(() => {
    const timers = checks.map((_, i) => setTimeout(() => {
      setChecks((c) => { const n = [...c]; n[i] = true; return n; });
    }, 500 + i * 550));
    const done = setTimeout(() => go("proposals"), 500 + checks.length * 550 + 700);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);
  const steps = ["Requirement created", "Finding relevant vendors", "Checking availability", "Matching verified caterers"];
  return (
    <Screen>
      <div className="h-full flex flex-col items-center justify-center px-8">
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full ev-bg-accent-soft flex items-center justify-center ev-pulse">
            <Sparkles size={28} className="ev-accent" />
          </div>
        </div>
        <div className="ev-display text-[19px] font-semibold ev-ink mb-1 text-center">Your requirement is live</div>
        <div className="text-[13px] ev-muted mb-8 text-center">This usually takes a few seconds</div>
        <div className="w-full space-y-3.5">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={"w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors " + (checks[i] ? "ev-bg-success-soft" : "bg-[#F1EEE7]")}>
                {checks[i] ? <Check size={13} className="ev-success" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#C7BFAF]" />}
              </div>
              <span className={"text-[13.5px] transition-colors " + (checks[i] ? "ev-ink font-medium" : "ev-faint")}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function ProposalsScreen({ go, setSelectedVendor }) {
  const { h, m } = useCountdown(30);
  return (
    <Screen nav={<BottomNav active="proposals" go={go} />}>
      <div className="px-5 pt-4 pb-2">
        <div className="ev-display text-[21px] font-semibold ev-ink mb-0.5">Proposals for your event</div>
        <div className="text-[12.5px] ev-muted mb-4">3 verified caterers responded · Ramesh & Priya's Wedding</div>

        <div className="ev-bg-accent-soft rounded-2xl p-3 flex items-center gap-2.5 mb-3">
          <Clock size={16} className="ev-accent shrink-0" />
          <div className="text-[11.5px] ev-ink leading-snug flex-1">
            <span className="font-semibold">Quote window closes in {h}h {m}m</span>
            <span className="ev-muted"> — any remaining vendors can respond until then</span>
          </div>
        </div>

        <div className="ev-bg-gold-soft rounded-2xl p-3 flex items-center gap-2.5 mb-5">
          <ShieldCheck size={16} className="ev-gold shrink-0" />
          <div className="text-[11.5px] ev-muted leading-snug"><span className="font-semibold ev-ink">Private proposals</span> — vendors can't see each other's pricing.</div>
        </div>
      </div>
      <div className="px-5 pb-4 space-y-4">
        {VENDORS.map((v) => (
          <button key={v.id} onClick={() => { setSelectedVendor(v.id); go("proposalDetail"); }}
            className="ev-tap ev-card rounded-2xl p-4 text-left w-full block relative">
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                  <VendorImage src={v.image} alt={v.name} className="w-full h-full" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold ev-ink flex items-center gap-1.5">
                    {v.name}
                    {v.verified && <ShieldCheck size={13} className="ev-success" />}
                  </div>
                  <div className="text-[11px] ev-muted">{v.tagline}</div>
                </div>
              </div>
              <Badge tone="gold">{MATCH[v.id].score}% Match</Badge>
            </div>
            <div className="flex items-center gap-3 text-[11.5px] ev-muted mb-2 flex-wrap">
              <span className="flex items-center gap-1"><Star size={12} className="ev-gold fill-current" />{v.rating} ({v.reviews})</span>
              <span>·</span>
              <span>{v.events}</span>
              <span>·</span>
              <span>{v.location}</span>
            </div>
            <div className="mb-3"><AvailabilityPill vendorId={v.id} /></div>
            <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "#FBF8F3" }}>
              <div>
                <div className="text-[16px] font-bold ev-ink">{inr(v.price)}</div>
                <div className="text-[11px] ev-muted">{v.package}</div>
              </div>
              <ChevronRight size={18} className="ev-faint" />
            </div>
          </button>
        ))}
      </div>
      <div className="px-5 pb-6">
        <PrimaryButton onClick={() => go("compare")} icon={ArrowRight}>Compare Proposals</PrimaryButton>
      </div>
    </Screen>
  );
}

function ProposalDetailScreen({ go, selectedVendor, packages }) {
  const v = VENDORS.find((x) => x.id === selectedVendor) || VENDORS[0];
  const pkg = packages[v.id];
  return (
    <Screen>
      <TopBar title="Proposal" onBack={() => go("proposals")} right={<Badge tone="success"><ShieldCheck size={11} />Verified</Badge>} />
      <div className="px-5 pb-6">
        <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
          <VendorImage src={v.image} alt={v.name} className="w-full h-full" />
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2" style={{ borderColor: "#fff", marginTop: -36, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            <VendorImage src={v.image} alt={v.name} className="w-full h-full" />
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-semibold ev-ink">{v.name}</div>
            <div className="text-[12px] ev-muted mb-1">{v.location} · {v.experience} experience</div>
            <div className="flex items-center gap-1 text-[12px]"><Star size={13} className="ev-gold fill-current" /><span className="font-semibold ev-ink">{v.rating}</span><span className="ev-muted">({v.reviews} reviews)</span></div>
          </div>
        </div>

        <div className="ev-card ev-stub rounded-2xl p-4 mb-2" style={{ "--perf-top": "116px" }}>
          <div className="flex items-center justify-between mb-2">
            <Badge tone="accent">Private Proposal</Badge>
            <AvailabilityPill vendorId={v.id} compact />
          </div>
          <div className="ev-display text-[26px] font-bold ev-ink mt-2">{inr(v.price)}</div>
          <div className="text-[12px] ev-muted mb-1">{inr(v.perGuest)} per guest · {v.package}</div>
          <div className="text-[11px] ev-faint mb-5">Minimum {pkg.minGuests} guests</div>

          <div className="pt-4">
            <div className="text-[12px] font-semibold ev-ink mb-2">What's Included</div>
            <div className="space-y-1.5 mb-4">
              {pkg.included.map((i) => (
                <div key={i} className="flex items-center gap-2 text-[12.5px] ev-muted">
                  <Check size={13} className="ev-success shrink-0" /> {i}
                </div>
              ))}
            </div>
            <div className="text-[12px] font-semibold ev-ink mb-2">What's Not Included</div>
            <div className="space-y-1.5 mb-4">
              {pkg.notIncluded.map((i) => (
                <div key={i} className="flex items-center gap-2 text-[12.5px] ev-muted">
                  <X size={13} className="ev-faint shrink-0" /> {i}
                </div>
              ))}
            </div>
            {pkg.notes && (
              <div className="ev-bg-gold-soft rounded-xl p-3 mb-2">
                <div className="text-[11px] ev-muted leading-relaxed"><span className="font-semibold ev-ink">Note: </span>{pkg.notes}</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="flex items-center gap-1.5 ev-muted"><Users size={13} /> {v.staff} staff included</div>
              <div className="flex items-center gap-1.5 ev-muted"><Clock size={13} /> {v.duration}</div>
            </div>
          </div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="ev-accent" />
            <div className="text-[12px] font-semibold ev-ink">Why this vendor matches you</div>
          </div>
          <div className="space-y-2">
            {MATCH[v.id].reasons.map((r) => (
              <div key={r} className="flex items-start gap-2 text-[12px] ev-muted leading-snug">
                <Check size={13} className="ev-success shrink-0 mt-[1px]" /> {r}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => go("vendorAvailability")} className="ev-tap w-full ev-card rounded-2xl p-3.5 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl ev-bg-accent-soft flex items-center justify-center shrink-0">
            <Calendar size={16} className="ev-accent" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-semibold ev-ink">View Availability & Capacity</div>
            <div className="text-[11px] ev-muted">Full month calendar for this vendor</div>
          </div>
          <ChevronRight size={16} className="ev-faint" />
        </button>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="text-[12px] font-semibold ev-ink mb-3">Past work</div>
          <div className="grid grid-cols-2 gap-2">
            {[v.image, IMAGES.buffet, IMAGES.tableSetting, IMAGES.food1].slice(0, 4).map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <VendorImage src={img} alt={`${v.name} past event ${i + 1}`} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="text-[12px] font-semibold ev-ink mb-3">On-ground team</div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <VendorImage src={IMAGES.staff} alt="Catering staff" className="w-full h-full" />
            </div>
            <div className="flex-1">
              <div className="text-[12.5px] ev-ink font-medium leading-snug">{v.staff} trained service staff, including a lead chef and 2 live-counter specialists</div>
              <div className="text-[11px] ev-muted mt-1">Uniformed · Background verified · Assigned 48 hrs before your event</div>
            </div>
          </div>
        </div>

        <div className="text-[11px] ev-faint mb-5">Terms: 50% advance to confirm booking, balance due on event day. Cancellations within 7 days incur a 20% fee.</div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <GhostButton onClick={() => go("compare")}>Compare</GhostButton>
          <GhostButton onClick={() => go("chat")} icon={MessageCircle}>Chat</GhostButton>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <GhostButton onClick={() => go("negotiate")}>Negotiate</GhostButton>
          <PrimaryButton onClick={() => go("accept")}>Accept</PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}

function CompareScreen({ go, setSelectedVendor }) {
  const rows = [
    { label: "Rating", key: (v) => `${v.rating} ★ (${v.reviews})` },
    { label: "Experience", key: (v) => v.experience },
    { label: "Total Price", key: (v) => inr(v.price), highlight: true },
    { label: "Per Guest", key: (v) => inr(v.perGuest) },
    { label: "Staff", key: (v) => `${v.staff} incl.` },
    { label: "Duration", key: (v) => v.duration },
  ];
  return (
    <Screen>
      <TopBar title="Compare Proposals" sub="Value, not just price" onBack={() => go("proposals")} />
      <div className="pb-6">
        <div className="overflow-x-auto ev-scroll px-5">
          <div className="flex gap-3 mb-4" style={{ minWidth: "560px" }}>
            <div className="w-[110px] shrink-0" />
            {VENDORS.map((v) => (
              <div key={v.id} className="flex-1 ev-card rounded-2xl p-3 text-center min-w-[130px]">
                <div className="w-9 h-9 rounded-xl ev-bg-accent-soft flex items-center justify-center mx-auto mb-1.5">
                  <ChefHat size={15} className="ev-accent" />
                </div>
                <div className="text-[11.5px] font-semibold ev-ink leading-tight">{v.name}</div>
              </div>
            ))}
          </div>
          <div style={{ minWidth: "560px" }}>
            {rows.map((r, ri) => (
              <div key={r.label} className={"flex gap-3 items-center px-0 py-2.5" + (ri % 2 === 0 ? "" : "")}
                style={{ background: ri % 2 === 0 ? "transparent" : "#F4EFE6", borderRadius: 12 }}>
                <div className="w-[110px] shrink-0 text-[11.5px] font-semibold ev-muted pl-2">{r.label}</div>
                {VENDORS.map((v) => (
                  <div key={v.id} className={"flex-1 text-center text-[12.5px] min-w-[130px] " + (r.highlight ? "font-bold ev-accent" : "font-medium ev-ink")}>
                    {r.key(v)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 mt-5 space-y-2.5">
          {VENDORS.map((v) => (
            <button key={v.id} onClick={() => { setSelectedVendor(v.id); go("proposalDetail"); }}
              className="ev-tap w-full ev-card rounded-xl p-3 flex items-center justify-between">
              <span className="text-[12.5px] font-semibold ev-ink">Open {v.name.split(" ")[0]}'s Proposal</span>
              <ChevronRight size={16} className="ev-faint" />
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ---- Chat / Negotiate ---- */

function ChatScreen({ go, selectedVendor }) {
  const v = VENDORS.find((x) => x.id === selectedVendor) || VENDORS[0];
  const discussedPrice = v.price + 5000;
  const [msgs, setMsgs] = useState([
    { from: "vendor", text: `Namaste! Thank you for considering ${v.name} for your wedding.`, time: "10:02 AM" },
    { from: "system", text: `Proposal sent · ${inr(v.price)}`, time: "10:03 AM" },
    { from: "customer", text: "Thanks! Can you include a live chaat counter as well?", time: "10:15 AM" },
    { from: "vendor", text: `Yes, we can add that. It would bring the total to ${inr(discussedPrice)} for 250 guests.`, time: "10:18 AM" },
    { from: "system", text: "Guest count confirmed: 250", time: "10:19 AM" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const vendorReplyFor = (text) => {
    const t = text.toLowerCase();
    if (t.includes("price") || t.includes("cost") || t.includes("₹") || t.includes("budget") || t.includes("discount") || t.includes("cheap")) {
      return "We can work with your budget — happy to discuss this on the Negotiate screen so it's tracked properly.";
    }
    if (t.includes("menu") || t.includes("food") || t.includes("dish") || t.includes("cuisine") || t.includes("dosa") || t.includes("chaat")) {
      return "Sure, we can customise the menu for your guests. I'll share an updated menu list shortly.";
    }
    if (t.includes("guest") || t.includes("people") || t.includes("count")) {
      return "Noted on the guest count — our packages scale per-person, so pricing will adjust accordingly.";
    }
    if (t.includes("date") || t.includes("time") || t.includes("available") || t.includes("availability")) {
      return "Let me check our calendar for that date and confirm availability within the hour.";
    }
    if (t.includes("thank")) {
      return "You're most welcome! Looking forward to being part of your event.";
    }
    return "Thanks for the message — I'll get back to you shortly with the details.";
  };

  const send = () => {
    if (!input.trim()) return;
    const userText = input;
    setMsgs((m) => [...m, { from: "customer", text: userText, time: "Now" }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "vendor", text: vendorReplyFor(userText), time: "Now" }]);
    }, 1100);
  };
  return (
    <Screen>
      <TopBar title={v.name} sub={`Active proposal · ${inr(discussedPrice)}`} onBack={() => go("home")}
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => go("call")} className="ev-tap w-9 h-9 rounded-full ev-card flex items-center justify-center">
              <Phone size={14} className="ev-accent" />
            </button>
            <button onClick={() => go("negotiate")} className="ev-tap"><Badge tone="accent">Negotiate</Badge></button>
          </div>
        } />
      <div className="flex-1 overflow-y-auto ev-scroll px-5 py-2 space-y-3">
        {msgs.map((m, i) => m.from === "system" ? (
          <div key={i} className="text-center">
            <span className="text-[10.5px] ev-muted ev-bg-gold-soft px-2.5 py-1 rounded-full inline-block">{m.text}</span>
          </div>
        ) : (
          <div key={i} className={"flex " + (m.from === "customer" ? "justify-end" : "justify-start")}>
            <div className={"max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug " + (m.from === "customer" ? "ev-bg-accent text-white" : "ev-card ev-ink")}>
              {m.text}
              <div className={"text-[9.5px] mt-1 " + (m.from === "customer" ? "text-white/70" : "ev-faint")}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start ev-anim">
            <div className="ev-card rounded-2xl px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full ev-faint inline-block" style={{ background: "#A79E90", animation: "ev-fade-in .6s infinite alternate" }} />
              <span className="w-1.5 h-1.5 rounded-full ev-faint inline-block" style={{ background: "#A79E90", animation: "ev-fade-in .6s infinite alternate .15s" }} />
              <span className="w-1.5 h-1.5 rounded-full ev-faint inline-block" style={{ background: "#A79E90", animation: "ev-fade-in .6s infinite alternate .3s" }} />
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-3 flex items-center gap-2 shrink-0 border-t" style={{ borderColor: "#E9E2D6" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message vendor..."
          className="flex-1 ev-card rounded-full px-4 py-2.5 text-[13px] outline-none placeholder:ev-faint" />
        <button onClick={send} className="w-10 h-10 rounded-full ev-bg-accent flex items-center justify-center ev-tap shrink-0">
          <Send size={15} className="text-white" />
        </button>
      </div>
    </Screen>
  );
}

function NegotiateScreen({ go }) {
  const [offer, setOffer] = useState(85000);
  const [sent, setSent] = useState(false);
  const original = 90000;
  return (
    <Screen>
      <TopBar title="Negotiate" sub="Annapoorna Catering Co." onBack={() => go("chat")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[12.5px] ev-muted">Original proposal</span>
            <span className="text-[15px] font-bold ev-ink">{inr(original)}</span>
          </div>
          {sent && (
            <div className="flex items-center justify-between mb-3.5 ev-anim">
              <span className="text-[12.5px] ev-muted">Your offer</span>
              <span className="text-[15px] font-bold ev-accent">{inr(offer)}</span>
            </div>
          )}
          {sent && (
            <div className="flex items-center justify-between ev-anim">
              <span className="text-[12.5px] ev-muted">Vendor counter-offer</span>
              <span className="text-[15px] font-bold ev-gold">{inr(offer + 2500)}</span>
            </div>
          )}
        </div>

        {!sent ? (
          <>
            <div className="text-[13px] font-semibold ev-ink mb-3">Your offer</div>
            <div className="ev-card rounded-2xl p-5 flex items-center justify-center gap-6 mb-2">
              <button onClick={() => setOffer(Math.max(60000, offer - 2500))} className="w-10 h-10 rounded-full ev-bg-accent-soft flex items-center justify-center ev-tap">
                <Minus size={16} className="ev-accent" />
              </button>
              <div className="ev-display text-[24px] font-bold ev-ink">{inr(offer)}</div>
              <button onClick={() => setOffer(offer + 2500)} className="w-10 h-10 rounded-full ev-bg-accent-soft flex items-center justify-center ev-tap">
                <Plus size={16} className="ev-accent" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11.5px] ev-muted mb-6">
              <TrendingDown size={13} className="ev-success" /> {Math.round((1 - offer / original) * 100)}% below asking
            </div>
            <PrimaryButton onClick={() => setSent(true)} icon={Send}>Send Offer</PrimaryButton>
          </>
        ) : (
          <div className="ev-anim">
            <Badge tone="accent">Countered</Badge>
            <div className="ev-display text-[17px] font-semibold ev-ink mt-3 mb-1">Vendor countered at {inr(offer + 2500)}</div>
            <p className="text-[12.5px] ev-muted mb-5 leading-relaxed">"We can offer {inr(offer + 2500)} including the live chaat counter for 250 guests — this is our best value package."</p>
            <div className="grid grid-cols-2 gap-3">
              <GhostButton onClick={() => setSent(false)}>Counter Again</GhostButton>
              <PrimaryButton onClick={() => go("accept")}>Accept {inr(offer + 2500)}</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}

function AcceptScreen({ go }) {
  return (
    <Screen>
      <TopBar title="Confirm Proposal" onBack={() => go("negotiate")} />
      <div className="px-5 pb-6">
        <div className="w-14 h-14 rounded-2xl ev-bg-success-soft flex items-center justify-center mb-4">
          <CircleCheck size={24} className="ev-success" />
        </div>
        <div className="ev-display text-[19px] font-semibold ev-ink mb-1">You're about to book</div>
        <p className="text-[13px] ev-muted mb-5">Review the final agreed details before proceeding to payment.</p>
        <div className="ev-card rounded-2xl p-4 mb-6">
          <ReviewRow label="Vendor" value="Annapoorna Catering Co." />
          <ReviewRow label="Package" value="Classic South Indian + Live Chaat" />
          <ReviewRow label="Final Agreed Price" value={inr(87500)} />
          <ReviewRow label="Event Date" value="14 Feb 2027" />
          <ReviewRow label="Guests" value="250" />
          <ReviewRow label="Location" value="Chennai" />
        </div>
        <div className="ev-bg-gold-soft rounded-2xl p-3.5 flex gap-2.5 mb-6">
          <Info size={15} className="ev-gold shrink-0 mt-0.5" />
          <div className="text-[11.5px] ev-muted leading-relaxed">50% advance ({inr(43750)}) is due now to confirm this booking. The remainder is due on the event day.</div>
        </div>
        <PrimaryButton onClick={() => go("payment")} icon={ArrowRight}>Continue to Payment</PrimaryButton>
      </div>
    </Screen>
  );
}

function PaymentScreen({ go }) {
  const [method, setMethod] = useState("upi");
  const methods = [
    { id: "upi", label: "UPI", icon: Smartphone },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
  ];
  return (
    <Screen>
      <TopBar title="Payment" onBack={() => go("accept")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-5">
          <div className="text-[12px] font-semibold ev-ink mb-3">Booking summary</div>
          <ReviewRow label="Vendor" value="Annapoorna Catering Co." />
          <ReviewRow label="Package" value="Classic + Live Chaat" />
          <ReviewRow label="Agreed amount" value={inr(87500)} />
          <ReviewRow label="Advance due now (50%)" value={inr(43750)} />
          <ReviewRow label="Platform fee" value={inr(499)} />
          <div className="flex items-center justify-between pt-3">
            <span className="text-[13.5px] font-bold ev-ink">Total payable now</span>
            <span className="ev-display text-[18px] font-bold ev-accent">{inr(44249)}</span>
          </div>
        </div>

        <div className="text-[12px] font-semibold ev-ink mb-2.5">Payment method</div>
        <div className="space-y-2.5 mb-6">
          {methods.map((m) => (
            <OptionTile key={m.id} label={m.label} selected={method === m.id} onClick={() => setMethod(m.id)} icon={m.icon} />
          ))}
        </div>
        <PrimaryButton onClick={() => go("paying")} icon={Wallet}>Pay {inr(44249)}</PrimaryButton>
        <p className="text-center text-[10.5px] ev-faint mt-3">This is a prototype — no real payment will be processed.</p>
      </div>
    </Screen>
  );
}

function PayingScreen({ go }) {
  React.useEffect(() => {
    const t = setTimeout(() => go("bookingConfirmed"), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <Screen>
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#F1DDE7] border-t-[#96114C] animate-spin mb-6" />
        <div className="ev-display text-[16px] font-semibold ev-ink">Processing payment…</div>
        <div className="text-[12px] ev-muted mt-1">Please don't close the app</div>
      </div>
    </Screen>
  );
}

function BookingConfirmedScreen({ go }) {
  return (
    <Screen>
      <div className="px-6 pt-10 pb-6">
        <div className="w-16 h-16 rounded-full ev-bg-success-soft flex items-center justify-center mx-auto mb-5">
          <CheckCheck size={28} className="ev-success" />
        </div>
        <div className="ev-display text-[22px] font-semibold ev-ink text-center mb-1">Booking Confirmed</div>
        <div className="text-[12.5px] ev-muted text-center mb-6">Booking ID: EVT-2027-04821</div>

        <div className="ev-card ev-stub rounded-2xl p-4 mb-6" style={{ "--perf-top": "80px" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl ev-bg-accent-soft flex items-center justify-center"><ChefHat size={16} className="ev-accent" /></div>
            <div className="text-[13.5px] font-semibold ev-ink">Annapoorna Catering Co.</div>
          </div>
          <div className="pt-4">
            <ReviewRow label="Service" value="Classic South Indian + Live Chaat" />
            <ReviewRow label="Date" value="14 Feb 2027" />
            <ReviewRow label="Location" value="Chennai" />
            <ReviewRow label="Guests" value="250" />
            <ReviewRow label="Amount paid" value={inr(44249)} />
            <ReviewRow label="Balance due (event day)" value={inr(43751)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <GhostButton onClick={() => go("bookingDetail")}>View Booking</GhostButton>
          <GhostButton onClick={() => go("chat")} icon={MessageCircle}>Message Vendor</GhostButton>
        </div>
        <PrimaryButton onClick={() => go("home")} icon={Home}>Back to Home</PrimaryButton>
      </div>
    </Screen>
  );
}

function BookingsScreen({ go }) {
  const [tab, setTab] = useState("upcoming");
  const bookings = {
    upcoming: [{ event: "Ramesh & Priya's Wedding", vendor: "Annapoorna Catering Co.", date: "14 Feb 2027", amount: 87500, status: "Confirmed" }],
    completed: [{ event: "Kavya's Baby Shower", vendor: "Coastal Spice Catering", date: "02 Nov 2025", amount: 42000, status: "Completed" }],
    cancelled: [],
  };
  return (
    <Screen nav={<BottomNav active="bookings" go={go} />}>
      <div className="px-5 pt-4 pb-2">
        <div className="ev-display text-[21px] font-semibold ev-ink mb-4">Bookings</div>
        <div className="flex gap-2 mb-5">
          {["upcoming", "completed", "cancelled"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={"ev-tap px-3.5 py-1.5 rounded-full text-[12px] font-semibold capitalize " + (tab === t ? "ev-bg-accent text-white" : "ev-card ev-muted")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6 space-y-3">
        {bookings[tab].length === 0 && (
          <div className="text-center py-16">
            <Calendar size={28} className="ev-faint mx-auto mb-2" />
            <div className="text-[13px] ev-muted">No {tab} bookings yet</div>
          </div>
        )}
        {bookings[tab].map((b, i) => (
          <button key={i} onClick={() => go("bookingDetail")} className="ev-tap ev-card rounded-2xl p-4 text-left w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13.5px] font-semibold ev-ink">{b.event}</span>
              <Badge tone={b.status === "Confirmed" ? "accent" : "success"}>{b.status}</Badge>
            </div>
            <div className="text-[12px] ev-muted mb-2.5">{b.vendor} · {b.date}</div>
            <div className="text-[14px] font-bold ev-ink">{inr(b.amount)}</div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

function BookingDetailScreen({ go }) {
  return (
    <Screen>
      <TopBar title="Booking Details" onBack={() => go("bookings")} />
      <div className="px-5 pb-6">
        <Badge tone="accent">Confirmed</Badge>
        <div className="ev-display text-[19px] font-semibold ev-ink mt-2 mb-4">Ramesh & Priya's Wedding</div>
        <div className="ev-card rounded-2xl p-4 mb-4">
          <ReviewRow label="Booking ID" value="EVT-2027-04821" />
          <ReviewRow label="Vendor" value="Annapoorna Catering Co." />
          <ReviewRow label="Package" value="Classic + Live Chaat" />
          <ReviewRow label="Date" value="14 Feb 2027" />
          <ReviewRow label="Location" value="Chennai" />
          <ReviewRow label="Guests" value="250" />
          <ReviewRow label="Total amount" value={inr(87500)} />
          <ReviewRow label="Amount paid" value={inr(44249)} />
          <ReviewRow label="Balance due" value={inr(43751)} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <GhostButton onClick={() => go("chat")} icon={MessageCircle}>Message Vendor</GhostButton>
          <GhostButton onClick={() => go("bookings")} icon={CalendarCheck}>Add to Calendar</GhostButton>
        </div>
        <PrimaryButton onClick={() => go("review")} icon={Star}>Mark Complete & Review</PrimaryButton>
      </div>
    </Screen>
  );
}

function ReviewScreen({ go }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <Screen>
      <TopBar title="Rate your experience" onBack={() => go("bookingDetail")} />
      <div className="px-5 pb-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl ev-bg-accent-soft flex items-center justify-center mx-auto mb-3">
            <ChefHat size={22} className="ev-accent" />
          </div>
          <div className="ev-display text-[17px] font-semibold ev-ink">How was Annapoorna Catering?</div>
          <div className="text-[12px] ev-muted">Ramesh & Priya's Wedding · 14 Feb 2027</div>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)} className="ev-tap">
              <Star size={30} className={s <= rating ? "ev-gold fill-current" : "ev-faint"} />
            </button>
          ))}
        </div>
        {[["Food quality", 5], ["Service", 5], ["Professionalism", 4], ["Value for money", 4]].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between mb-3">
            <span className="text-[13px] ev-ink">{label}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className={s <= val ? "ev-gold fill-current" : "ev-faint"} />)}
            </div>
          </div>
        ))}
        <div className="ev-card rounded-2xl p-3.5 my-4">
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Share details about the food, service and setup..."
            className="bg-transparent outline-none text-[13.5px] ev-ink w-full resize-none placeholder:ev-faint" />
        </div>
        <button className="w-full ev-card rounded-2xl p-3.5 flex items-center justify-center gap-2 mb-2 ev-tap">
          <Camera size={16} className="ev-muted" />
          <span className="text-[12.5px] ev-muted font-medium">Add photos (optional)</span>
        </button>
        <Badge tone="success"><ShieldCheck size={11} />Verified Booking Review</Badge>
        <div className="mt-4">
          <PrimaryButton onClick={() => go("reviewDone")} icon={Check}>Submit Review</PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}

function ReviewDoneScreen({ go }) {
  return (
    <Screen>
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 rounded-full ev-bg-success-soft flex items-center justify-center mb-5">
          <Check size={26} className="ev-success" />
        </div>
        <div className="ev-display text-[19px] font-semibold ev-ink mb-1">Thank you for your review</div>
        <p className="text-[13px] ev-muted mb-8 leading-relaxed">Your verified review helps future customers choose with confidence — and helps great vendors grow.</p>
        <PrimaryButton onClick={() => go("home")} icon={Home}>Back to Home</PrimaryButton>
      </div>
    </Screen>
  );
}

function CapacityLegend() {
  return (
    <div className="flex items-center gap-4 mb-4">
      {Object.entries(STATUS_STYLE).map(([k, s]) => (
        <div key={k} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.text }} />
          <span className="text-[11px] ev-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function VendorAvailabilityScreen({ go, selectedVendor }) {
  const v = VENDORS.find((x) => x.id === selectedVendor) || VENDORS[0];
  const teams = TEAMS_BY_VENDOR[v.id];
  const bookings = BOOKINGS_BY_VENDOR[v.id];
  const total = capacityEngine.getTotalCapacity(teams);
  const [selectedDay, setSelectedDay] = useState(14);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startOffset = 0; // Feb 1, 2027 assumed Monday for this prototype
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const d = getDateStatus(v.id, selectedDay);
  const s = STATUS_STYLE[d.status];
  const selDateLabel = `${selectedDay} Feb 2027`;

  return (
    <Screen>
      <TopBar title="Availability & Capacity" sub={v.name} onBack={() => go("proposalDetail")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-3.5 mb-4 flex items-center gap-2.5">
          <Users size={16} className="ev-accent shrink-0" />
          <div className="text-[11.5px] ev-muted leading-snug">This vendor can serve up to <span className="font-semibold ev-ink">{total} guests/day</span> across {teams.length} chef teams. A date auto-marks <span className="font-semibold ev-ink">Fully Booked</span> once that capacity is reached.</div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="ev-display text-[15px] font-semibold ev-ink">February 2027</span>
          </div>
          <CapacityLegend />
          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {weekDays.map((w) => <div key={w} className="text-[10px] text-center ev-faint font-semibold">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: startOffset }).map((_, i) => <div key={"e" + i} />)}
            {days.map((day) => {
              const dd = getDateStatus(v.id, day);
              const ss = STATUS_STYLE[dd.status];
              const isSel = day === selectedDay;
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className="ev-tap aspect-square rounded-lg flex items-center justify-center text-[11.5px] font-semibold"
                  style={{ background: isSel ? "#96114C" : ss.bg, color: isSel ? "#fff" : ss.text }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold ev-ink">{selDateLabel}</span>
            <span className="px-2 py-[3px] rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>{s.label}</span>
          </div>
          <ReviewRow label="Total capacity" value={`${total} guests`} />
          <ReviewRow label="Booked" value={`${d.booked} guests`} />
          <ReviewRow label="Remaining" value={`${d.remaining} guests`} />
          {d.status === "full" && (
            <div className="ev-bg-accent-soft rounded-xl p-3 mt-3 text-[11.5px] ev-accent font-medium">
              Fully booked for this date — try requesting an alternate date or comparing another vendor.
            </div>
          )}
        </div>

        <div className="ev-card rounded-2xl p-4">
          <div className="text-[12px] font-semibold ev-ink mb-3">Team capacity breakdown</div>
          {teams.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#EFE9DE" }}>
              <span className="text-[12.5px] ev-ink">{t.name}</span><span className="text-[12.5px] font-semibold ev-muted">{t.capacity} guests</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function RequirementTimelineScreen({ go }) {
  return (
    <Screen>
      <TopBar title="Requirement Status" sub="Ramesh & Priya's Wedding" onBack={() => go("home")} />
      <div className="px-5 pb-6">
        <div className="ev-card rounded-2xl p-4 mb-5">
          {REQUIREMENT_STAGES.map((stage, i) => (
            <div key={stage.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={"w-6 h-6 rounded-full flex items-center justify-center shrink-0 " + (stage.done ? "ev-bg-accent" : "bg-[#F1EEE7]")}>
                  {stage.done ? <Check size={12} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#C7BFAF]" />}
                </div>
                {i < REQUIREMENT_STAGES.length - 1 && (
                  <div className="w-[2px] flex-1 my-0.5" style={{ background: stage.done && REQUIREMENT_STAGES[i + 1].done ? "#96114C" : "#E9E2D6", minHeight: 24 }} />
                )}
              </div>
              <div className={"pb-5 " + (stage.current ? "" : "")}>
                <div className={"text-[13.5px] font-semibold " + (stage.done ? "ev-ink" : "ev-faint")}>
                  {stage.label} {stage.current && <span className="ev-accent text-[11px] font-semibold ml-1">· Current</span>}
                </div>
                <div className="text-[11.5px] ev-muted">{stage.time}</div>
              </div>
            </div>
          ))}
        </div>
        <PrimaryButton onClick={() => go("proposals")} icon={ArrowRight}>View Proposals</PrimaryButton>
      </div>
    </Screen>
  );
}

function ManagePackageScreen({ go, packages, setPackages }) {
  const [vendorId, setVendorId] = useState("v1");
  const [incInput, setIncInput] = useState("");
  const [exInput, setExInput] = useState("");
  const pkg = packages[vendorId];
  const v = VENDORS.find((x) => x.id === vendorId);

  const update = (next) => setPackages({ ...packages, [vendorId]: { ...pkg, ...next } });
  const moveToNotIncluded = (item) => update({ included: pkg.included.filter((i) => i !== item), notIncluded: [...pkg.notIncluded, item] });
  const moveToIncluded = (item) => update({ notIncluded: pkg.notIncluded.filter((i) => i !== item), included: [...pkg.included, item] });
  const removeIncluded = (item) => update({ included: pkg.included.filter((i) => i !== item) });
  const removeNotIncluded = (item) => update({ notIncluded: pkg.notIncluded.filter((i) => i !== item) });
  const addIncluded = () => { if (!incInput.trim()) return; update({ included: [...pkg.included, incInput.trim()] }); setIncInput(""); };
  const addNotIncluded = () => { if (!exInput.trim()) return; update({ notIncluded: [...pkg.notIncluded, exInput.trim()] }); setExInput(""); };

  return (
    <Screen>
      <TopBar title="Manage Package" sub="Vendor View · Preview" onBack={() => go("settings")} />
      <div className="px-5 pb-6">
        <div className="ev-bg-gold-soft rounded-2xl p-3 flex items-center gap-2.5 mb-4">
          <Pencil size={15} className="ev-gold shrink-0" />
          <div className="text-[11.5px] ev-muted leading-snug">This previews the vendor's package editor. Changes update the customer's proposal view instantly.</div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto ev-scroll">
          {VENDORS.map((x) => (
            <button key={x.id} onClick={() => setVendorId(x.id)}
              className={"ev-tap shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold " + (vendorId === x.id ? "ev-bg-accent text-white" : "ev-card ev-muted")}>
              {x.name.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="text-[13px] font-semibold ev-ink">{v.package}</div>
          <div className="text-[12px] ev-muted">{inr(v.perGuest)} / plate · Minimum {pkg.minGuests} guests</div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-3">
          <div className="text-[12px] font-semibold ev-success mb-2.5 flex items-center gap-1.5"><Check size={13} /> Included</div>
          <div className="space-y-2 mb-3">
            {pkg.included.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#FBF8F3" }}>
                <span className="text-[12.5px] ev-ink">{item}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveToNotIncluded(item)} className="ev-tap text-[10.5px] font-semibold ev-gold">Move →</button>
                  <button onClick={() => removeIncluded(item)} className="ev-tap"><X size={14} className="ev-faint" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="ev-card rounded-xl px-3 py-2 flex-1">
              <input value={incInput} onChange={(e) => setIncInput(e.target.value)} placeholder="+ Add included item"
                className="bg-transparent outline-none text-[12.5px] ev-ink w-full placeholder:ev-faint" />
            </div>
            <button onClick={addIncluded} className="ev-tap w-9 h-9 rounded-xl ev-bg-accent flex items-center justify-center shrink-0"><Plus size={15} className="text-white" /></button>
          </div>
        </div>

        <div className="ev-card rounded-2xl p-4 mb-4">
          <div className="text-[12px] font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: "#B23B4A" }}><X size={13} /> Not Included</div>
          <div className="space-y-2 mb-3">
            {pkg.notIncluded.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#FBF8F3" }}>
                <span className="text-[12.5px] ev-ink">{item}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveToIncluded(item)} className="ev-tap text-[10.5px] font-semibold ev-success">← Move</button>
                  <button onClick={() => removeNotIncluded(item)} className="ev-tap"><X size={14} className="ev-faint" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="ev-card rounded-xl px-3 py-2 flex-1">
              <input value={exInput} onChange={(e) => setExInput(e.target.value)} placeholder="+ Add not-included item"
                className="bg-transparent outline-none text-[12.5px] ev-ink w-full placeholder:ev-faint" />
            </div>
            <button onClick={addNotIncluded} className="ev-tap w-9 h-9 rounded-xl bg-[#F1EEE7] flex items-center justify-center shrink-0"><Plus size={15} className="ev-muted" /></button>
          </div>
        </div>

        <GhostButton onClick={() => go("proposalDetail")}>Preview Customer View</GhostButton>
      </div>
    </Screen>
  );
}

function CallScreen({ go, selectedVendor }) {
  const v = VENDORS.find((x) => x.id === selectedVendor) || VENDORS[0];
  const [status, setStatus] = useState("calling");
  const [seconds, setSeconds] = useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setStatus("connected"), 2200);
    return () => clearTimeout(t);
  }, []);
  React.useEffect(() => {
    if (status !== "connected") return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [status]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Screen>
      <div className="h-full flex flex-col items-center justify-between px-8 py-14" style={{ background: "#161412" }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <ShieldCheck size={13} style={{ color: "#D9B876" }} />
          <span className="text-[11px] font-medium" style={{ color: "#D9B876" }}>Eventra Protected Call · Numbers hidden</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-5" style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.08)" }}>
            <VendorImage src={v.image} alt={v.name} className="w-full h-full" />
          </div>
          <div className="ev-display text-white text-[19px] font-semibold mb-1">{v.name}</div>
          <div className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            {status === "calling" ? "Calling…" : `Connected · ${fmt(seconds)}`}
          </div>
          <div className="text-[10.5px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>Call session EVT-CALL-58213</div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button onClick={() => go("chat")} className="ev-tap w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#C43B4E" }}>
            <PhoneOff size={22} className="text-white" />
          </button>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>End Call</span>
        </div>
      </div>
    </Screen>
  );
}

function ProfileScreen({ go, userName }) {
  const items = [
    { label: "My Requirements", icon: FileText, screen: "myRequirements" },
    { label: "Payments", icon: Wallet, screen: "payments" },
    { label: "Saved Vendors", icon: Star, screen: "savedVendors" },
    { label: "Settings", icon: User, screen: "settings" },
  ];
  const displayName = userName || "Guest";
  return (
    <Screen nav={<BottomNav active="profile" go={go} />}>
      <div className="px-5 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full ev-bg-accent flex items-center justify-center text-white ev-display text-[19px] font-semibold">{displayName[0].toUpperCase()}</div>
          <div>
            <div className="text-[16px] font-semibold ev-ink">{displayName}</div>
            <div className="text-[12px] ev-muted">{displayName.toLowerCase().replace(/\s+/g, ".")}@email.com</div>
          </div>
        </div>
        <div className="space-y-2.5">
          {items.map((it) => (
            <button key={it.label} onClick={() => go(it.screen)} className="ev-tap w-full ev-card rounded-2xl p-3.5 flex items-center gap-3">
              <it.icon size={17} className="ev-accent" />
              <span className="flex-1 text-left text-[13.5px] font-medium ev-ink">{it.label}</span>
              <ChevronRight size={16} className="ev-faint" />
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function MyRequirementsScreen({ go }) {
  const reqs = [
    { title: "Ramesh & Priya's Wedding", date: "14 Feb 2027", city: "Chennai", guests: "250 guests", status: "3 Quotes Received", tone: "accent" },
    { title: "Kavya's Baby Shower", date: "02 Nov 2025", city: "Chennai", guests: "80 guests", status: "Completed", tone: "success" },
  ];
  return (
    <Screen>
      <TopBar title="My Requirements" onBack={() => go("profile")} />
      <div className="px-5 pb-6 space-y-3">
        {reqs.map((r, i) => (
          <div key={i} className="ev-card rounded-2xl p-4">
            <button onClick={() => go(r.status === "Completed" ? "bookingDetail" : "proposals")} className="ev-tap text-left w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13.5px] font-semibold ev-ink">{r.title}</span>
                <Badge tone={r.tone}>{r.status}</Badge>
              </div>
              <div className="text-[12px] ev-muted">{r.date} · {r.city} · {r.guests}</div>
            </button>
            {r.status !== "Completed" && (
              <button onClick={() => go("requirementTimeline")} className="ev-tap mt-3 pt-3 border-t w-full flex items-center justify-between" style={{ borderColor: "#EFE9DE" }}>
                <span className="text-[12px] font-semibold ev-accent">Track Status</span>
                <ChevronRight size={14} className="ev-accent" />
              </button>
            )}
          </div>
        ))}
        <button onClick={() => go("wizard1")} className="ev-tap w-full ev-card rounded-2xl p-4 flex items-center justify-center gap-2 border-dashed" style={{ borderStyle: "dashed" }}>
          <Plus size={16} className="ev-accent" />
          <span className="text-[13px] font-semibold ev-accent">New Requirement</span>
        </button>
      </div>
    </Screen>
  );
}

function PaymentsScreen({ go }) {
  const payments = [
    { label: "Advance — Annapoorna Catering", date: "26 Aug 2026", amount: 44249, status: "Paid" },
    { label: "Balance due — Annapoorna Catering", date: "14 Feb 2027", amount: 43751, status: "Upcoming" },
    { label: "Full payment — Coastal Spice Catering", date: "02 Nov 2025", amount: 42000, status: "Paid" },
  ];
  return (
    <Screen>
      <TopBar title="Payments" onBack={() => go("profile")} />
      <div className="px-5 pb-6 space-y-3">
        {payments.map((p, i) => (
          <div key={i} className="ev-card rounded-2xl p-4 flex items-center gap-3">
            <div className={"w-9 h-9 rounded-xl flex items-center justify-center shrink-0 " + (p.status === "Paid" ? "ev-bg-success-soft" : "ev-bg-gold-soft")}>
              <Wallet size={15} className={p.status === "Paid" ? "ev-success" : "ev-gold"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold ev-ink truncate">{p.label}</div>
              <div className="text-[11.5px] ev-muted">{p.date}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[13.5px] font-bold ev-ink">{inr(p.amount)}</div>
              <Badge tone={p.status === "Paid" ? "success" : "gold"}>{p.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function SavedVendorsScreen({ go, setSelectedVendor }) {
  return (
    <Screen>
      <TopBar title="Saved Vendors" onBack={() => go("profile")} />
      <div className="px-5 pb-6 space-y-3">
        {VENDORS.map((v) => (
          <button key={v.id} onClick={() => { setSelectedVendor(v.id); go("proposalDetail"); }} className="ev-tap ev-card rounded-2xl p-4 flex items-center gap-3 w-full text-left">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <VendorImage src={v.image} alt={v.name} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold ev-ink flex items-center gap-1.5">{v.name}{v.verified && <ShieldCheck size={12} className="ev-success" />}</div>
              <div className="text-[11.5px] ev-muted">{v.location} · <Star size={10} className="inline ev-gold fill-current" /> {v.rating}</div>
            </div>
            <ChevronRight size={16} className="ev-faint" />
          </button>
        ))}
      </div>
    </Screen>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between ev-card rounded-2xl p-3.5 mb-2.5">
      <div>
        <div className="text-[13px] font-medium ev-ink">{label}</div>
        {sub && <div className="text-[11px] ev-muted">{sub}</div>}
      </div>
      <button onClick={onChange} className={"w-10 h-6 rounded-full relative transition-colors ev-tap " + (value ? "ev-bg-accent" : "bg-[#E9E2D6]")}>
        <div className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: value ? "18px" : "3px" }} />
      </button>
    </div>
  );
}

function SettingsScreen({ go }) {
  const [notif, setNotif] = useState(true);
  const [email, setEmail] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const rows = [
    { label: "Edit Profile", icon: User, screen: "editProfile" },
    { label: "Manage Addresses", icon: MapPin, screen: "addresses" },
    { label: "Language — English", icon: Info, screen: "language" },
    { label: "Help & Support", icon: MessageCircle, screen: "help" },
  ];
  return (
    <Screen>
      <TopBar title="Settings" onBack={() => go("profile")} />
      <div className="px-5 pb-6">
        <div className="text-[12px] font-semibold ev-muted mb-2.5 uppercase tracking-wide">Notifications</div>
        <ToggleRow label="Push notifications" sub="Proposals, negotiation updates" value={notif} onChange={() => setNotif(!notif)} />
        <ToggleRow label="Email updates" sub="Booking confirmations, receipts" value={email} onChange={() => setEmail(!email)} />
        <ToggleRow label="WhatsApp updates" sub="Quick alerts on WhatsApp" value={whatsapp} onChange={() => setWhatsapp(!whatsapp)} />
        <div className="text-[12px] font-semibold ev-muted mb-2.5 mt-5 uppercase tracking-wide">Account</div>
        <div className="space-y-2.5">
          {rows.map((r) => (
            <button key={r.label} onClick={() => go(r.screen)} className="ev-tap w-full ev-card rounded-2xl p-3.5 flex items-center gap-3">
              <r.icon size={16} className="ev-accent" />
              <span className="flex-1 text-left text-[13px] font-medium ev-ink">{r.label}</span>
              <ChevronRight size={15} className="ev-faint" />
            </button>
          ))}
        </div>
        <button onClick={() => go("landing")} className="ev-tap w-full text-center py-3.5 mt-5 text-[13px] font-semibold" style={{ color: "#B23B4A" }}>Log Out</button>

        <div className="text-[12px] font-semibold ev-muted mb-2.5 mt-6 uppercase tracking-wide">Prototype Tools</div>
        <button onClick={() => go("managePackage")} className="ev-tap w-full ev-card rounded-2xl p-3.5 flex items-center gap-3">
          <ListChecks size={16} className="ev-gold" />
          <span className="flex-1 text-left text-[13px] font-medium ev-ink">Vendor Package Editor (Preview)</span>
          <ChevronRight size={15} className="ev-faint" />
        </button>
      </div>
    </Screen>
  );
}

function EditProfileScreen({ go, userName, setUserName }) {
  const [name, setName] = useState(userName || "");
  const [phone, setPhone] = useState("98765 43210");
  const [email, setEmail] = useState((userName || "guest").toLowerCase().replace(/\s+/g, ".") + "@email.com");
  const save = () => { if (name.trim()) setUserName(name.trim()); go("settings"); };
  return (
    <Screen>
      <TopBar title="Edit Profile" onBack={() => go("settings")} />
      <div className="px-5 pb-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full ev-bg-accent flex items-center justify-center text-white ev-display text-[26px] font-semibold mb-2 relative">
            {(name || "G")[0].toUpperCase()}
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full ev-card flex items-center justify-center border-2" style={{ borderColor: "#FBF8F3" }}>
              <Camera size={12} className="ev-accent" />
            </div>
          </div>
          <span className="text-[11.5px] ev-muted">Tap to change photo</span>
        </div>
        <InputField label="Full Name" value={name} onChange={setName} icon={User} />
        <InputField label="Phone Number" value={phone} onChange={setPhone} type="tel" icon={Smartphone} />
        <InputField label="Email" value={email} onChange={setEmail} type="email" />
        <PrimaryButton onClick={save} icon={Check}>Save Changes</PrimaryButton>
      </div>
    </Screen>
  );
}

function AddressesScreen({ go }) {
  const [addresses] = useState([
    { label: "Home", detail: "12, Kasturba Nagar, Adyar, Chennai 600020", tag: "Default" },
    { label: "Venue — ITC Grand Chola", detail: "63, Mount Rd, Guindy, Chennai 600032", tag: "Event Venue" },
  ]);
  return (
    <Screen>
      <TopBar title="Manage Addresses" onBack={() => go("settings")} />
      <div className="px-5 pb-6 space-y-3">
        {addresses.map((a, i) => (
          <div key={i} className="ev-card rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl ev-bg-accent-soft flex items-center justify-center shrink-0">
              <MapPin size={15} className="ev-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-semibold ev-ink">{a.label}</span>
                <Badge tone="neutral">{a.tag}</Badge>
              </div>
              <div className="text-[12px] ev-muted leading-snug">{a.detail}</div>
            </div>
          </div>
        ))}
        <button className="ev-tap w-full ev-card rounded-2xl p-4 flex items-center justify-center gap-2" style={{ borderStyle: "dashed" }}>
          <Plus size={16} className="ev-accent" />
          <span className="text-[13px] font-semibold ev-accent">Add New Address</span>
        </button>
      </div>
    </Screen>
  );
}

function LanguageScreen({ go }) {
  const [lang, setLang] = useState("English");
  const langs = ["English", "தமிழ் (Tamil)", "हिन्दी (Hindi)", "తెలుగు (Telugu)", "ಕನ್ನಡ (Kannada)"];
  return (
    <Screen>
      <TopBar title="Language" onBack={() => go("settings")} />
      <div className="px-5 pb-6">
        {langs.map((l) => (
          <OptionTile key={l} label={l} selected={lang === l} onClick={() => setLang(l)} />
        ))}
        <div className="mt-3">
          <PrimaryButton onClick={() => go("settings")} icon={Check}>Save</PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}

function HelpSupportScreen({ go }) {
  const faqs = [
    { q: "How do private proposals work?", a: "Vendors can't see each other's pricing. Each quote is sent privately to you." },
    { q: "When is payment due?", a: "50% advance on booking confirmation, balance on the event day." },
    { q: "Can I cancel a booking?", a: "Yes — cancellations within 7 days of the event incur a 20% fee." },
  ];
  return (
    <Screen>
      <TopBar title="Help & Support" onBack={() => go("settings")} />
      <div className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button className="ev-tap ev-card rounded-2xl p-4 flex flex-col items-center gap-1.5">
            <MessageCircle size={18} className="ev-accent" />
            <span className="text-[12px] font-semibold ev-ink">Chat with us</span>
          </button>
          <button className="ev-tap ev-card rounded-2xl p-4 flex flex-col items-center gap-1.5">
            <Smartphone size={18} className="ev-accent" />
            <span className="text-[12px] font-semibold ev-ink">Call support</span>
          </button>
        </div>
        <div className="text-[12px] font-semibold ev-muted mb-2.5 uppercase tracking-wide">Frequently asked</div>
        <div className="space-y-2.5">
          {faqs.map((f) => (
            <div key={f.q} className="ev-card rounded-2xl p-3.5">
              <div className="text-[13px] font-semibold ev-ink mb-1">{f.q}</div>
              <div className="text-[12px] ev-muted leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ================= APP ================= */

export default function EventraApp() {
  const [screen, setScreen] = useState("landing");
  const [selectedVendor, setSelectedVendor] = useState("v1");
  const [reqData, setReqData] = useState({});
  const [userName, setUserName] = useState("");
  const [packages, setPackages] = useState(() =>
    VENDORS.reduce((acc, v) => {
      acc[v.id] = { included: [...v.inclusions], notIncluded: [...v.exclusions], minGuests: v.minGuests, notes: v.notes };
      return acc;
    }, {})
  );

  const screens = {
    landing: <LandingScreen go={setScreen} />,
    signUp: <SignUpScreen go={setScreen} setUserName={setUserName} />,
    signIn: <SignInScreen go={setScreen} setUserName={setUserName} />,
    home: <HomeScreen go={setScreen} userName={userName} />,
    wizard1: <Wizard1 data={reqData} setData={setReqData} go={setScreen} />,
    wizard2: <Wizard2 data={reqData} setData={setReqData} go={setScreen} />,
    wizard3: <Wizard3 data={reqData} setData={setReqData} go={setScreen} />,
    wizard4: <Wizard4 data={reqData} setData={setReqData} go={setScreen} />,
    wizard5: <Wizard5 data={reqData} setData={setReqData} go={setScreen} />,
    reviewReq: <ReviewRequirementScreen data={reqData} go={setScreen} />,
    matching: <MatchingScreen go={setScreen} />,
    proposals: <ProposalsScreen go={setScreen} setSelectedVendor={setSelectedVendor} />,
    proposalDetail: <ProposalDetailScreen go={setScreen} selectedVendor={selectedVendor} packages={packages} />,
    vendorAvailability: <VendorAvailabilityScreen go={setScreen} selectedVendor={selectedVendor} />,
    requirementTimeline: <RequirementTimelineScreen go={setScreen} />,
    compare: <CompareScreen go={setScreen} setSelectedVendor={setSelectedVendor} />,
    chat: <ChatScreen go={setScreen} selectedVendor={selectedVendor} />,
    call: <CallScreen go={setScreen} selectedVendor={selectedVendor} />,
    negotiate: <NegotiateScreen go={setScreen} />,
    accept: <AcceptScreen go={setScreen} />,
    payment: <PaymentScreen go={setScreen} />,
    paying: <PayingScreen go={setScreen} />,
    bookingConfirmed: <BookingConfirmedScreen go={setScreen} />,
    bookings: <BookingsScreen go={setScreen} />,
    bookingDetail: <BookingDetailScreen go={setScreen} />,
    review: <ReviewScreen go={setScreen} />,
    reviewDone: <ReviewDoneScreen go={setScreen} />,
    profile: <ProfileScreen go={setScreen} userName={userName} />,
    myRequirements: <MyRequirementsScreen go={setScreen} />,
    payments: <PaymentsScreen go={setScreen} />,
    savedVendors: <SavedVendorsScreen go={setScreen} setSelectedVendor={setSelectedVendor} />,
    settings: <SettingsScreen go={setScreen} />,
    editProfile: <EditProfileScreen go={setScreen} userName={userName} setUserName={setUserName} />,
    addresses: <AddressesScreen go={setScreen} />,
    language: <LanguageScreen go={setScreen} />,
    help: <HelpSupportScreen go={setScreen} />,
    managePackage: <ManagePackageScreen go={setScreen} packages={packages} setPackages={setPackages} />,
  };

  const width = useViewport();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  const preAuthScreens = ["landing", "signUp", "signIn"];
  const showAppShell = !preAuthScreens.includes(screen);

  if (!isMobile && showAppShell) {
    // Tablet / Desktop — sidebar nav, no phone bezel, wide content area.
    return (
      <div className="ev min-h-screen flex" style={{ background: "#EDE7DC" }}>
        <style>{TOKENS}</style>
        <SidebarNav active={screen} go={setScreen} expanded={isDesktop} />
        <div className="flex-1 min-w-0 ev-bg min-h-screen">
          <div className={"mx-auto min-h-screen " + (isDesktop ? "max-w-6xl px-10 py-8" : "px-5 py-6")}>{screens[screen]}</div>
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
        <div className="flex-1 min-h-0 flex flex-col">{screens[screen]}</div>
      </div>
    </div>
  );
}
