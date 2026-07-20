import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Download,
  Users,
  Flame,
  Leaf,
  Award,
  Mountain,
  Utensils,
  Wine,
  Sparkles,
  Soup,
  Drumstick,
  Fish,
  GlassWater,
} from "lucide-react";
import ambienceHero from "@/assets/ambience-hero.png";
import ambience2 from "@/assets/ambience-2.png";
import ambienceTea from "@/assets/ambience-tea.png";
import chefPortrait from "@/assets/chef.png";
import kadaiChicken from "@/assets/kadai-chicken.png";
import { Loader3D } from "@/components/Loader3D";
import { QuickNav } from "@/components/QuickNav";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useActiveSection } from "@/hooks/useActiveSection";

export const PHONE = "8587044000";

// ─── Custom Food Outline Icons ──────────────────────────────────────────
type IconProps = { size?: number; className?: string; strokeWidth?: number };

const TomatoIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 5c-0.8-1.5-2.2-1.5-2.2-1.5s0.8 2.2 0.8 3" />
    <path d="M12 5c0.8-1.5 2.2-1.5 2.2-1.5s-0.8 2.2-0.8 3" />
    <path d="M12 2v3" />
  </svg>
);

const RollIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="8" width="18" height="8" rx="2" transform="rotate(-15 12 12)" />
    <path d="M6 10l3 3m3-3l3 3m3-3l3 3" />
  </svg>
);

const SkewerIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="2" y1="22" x2="22" y2="2" />
    <rect x="7" y="11" width="4" height="4" rx="1" transform="rotate(45 9 13)" />
    <rect x="12" y="6" width="4" height="4" rx="1" transform="rotate(45 14 8)" />
    <rect x="17" y="1" width="4" height="4" rx="1" transform="rotate(45 19 3)" />
  </svg>
);

const RiceIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12h20A10 10 0 0 1 12 22 10 10 0 0 1 2 12z" />
    <path d="M12 2v6" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

const NoodleIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12h20A10 10 0 0 1 12 22 10 10 0 0 1 2 12z" />
    <path d="M6 12c1-3 3-5 6-5s5 2 6 5" />
    <path d="M19 5l-7 14" />
    <path d="M21 7L14 21" />
  </svg>
);

const BreadIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12c0-3.9 3.1-7 7-7h4c3.9 0 7 3.1 7 7v4c0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3v-4z" />
    <path d="M7 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M17 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

function getMenuItemIcon(name: string, category: string): React.ComponentType<IconProps> | null {
  const lowercase = name.toLowerCase();
  
  if (lowercase.includes("tomato")) return TomatoIcon;
  if (lowercase.includes("spring roll")) return RollIcon;
  if (lowercase.includes("paneer") || lowercase.includes("dal") || lowercase.includes("veg") || lowercase.includes("jeera") || lowercase.includes("kofta") || lowercase.includes("aloo") || lowercase.includes("kebab")) return Leaf;
  if (lowercase.includes("chicken") || lowercase.includes("mutton") || lowercase.includes("lamb")) return Drumstick;
  if (lowercase.includes("fish")) return Fish;
  if (lowercase.includes("rice") || lowercase.includes("biryani") || lowercase.includes("pulao")) return RiceIcon;
  if (lowercase.includes("roti") || lowercase.includes("naan") || lowercase.includes("paratha")) return BreadIcon;
  if (lowercase.includes("noodle") || lowercase.includes("fried rice")) return NoodleIcon;
  if (lowercase.includes("coffee") || lowercase.includes("lime") || lowercase.includes("soda") || lowercase.includes("bev")) return GlassWater;
  if (lowercase.includes("jamun") || lowercase.includes("brownie") || lowercase.includes("cream")) return Sparkles;
  
  return null;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<IconProps>> = {
  "Starters": SkewerIcon,
  "Soups": Soup,
  "Vegetarian Mains": Leaf,
  "Non-Vegetarian Mains": Drumstick,
  "Rice & Biryani": RiceIcon,
  "Breads": BreadIcon,
  "Chinese": NoodleIcon,
  "Desserts & Beverages": GlassWater,
};
export const PHONE_DISPLAY = "+91 85870 44000";
export const WA = "918587044000";
export const MAPS_URL = "https://maps.app.goo.gl/NzuvBuMyLjCGQ7UT8";
export const ADDRESS = "McLeod Ganj, Dharamshala, Himachal Pradesh";
export const HOURS = { open: 8, close: 23 }; // 8am – 11pm

export const wa = (msg: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// ─── Menu data ──────────────────────────────────────────────────────────
export type Dish = { name: string; price: number; desc?: string };
export const MENU: { category: string; items: Dish[] }[] = [
  {
    category: "Starters",
    items: [
      { name: "Veg Spring Rolls", price: 180 },
      { name: "Paneer Tikka", price: 320 },
      { name: "Hara Bhara Kebab", price: 280 },
      { name: "Chicken Tikka", price: 380 },
      { name: "Fish Fingers", price: 450 },
    ],
  },
  {
    category: "Soups",
    items: [
      { name: "Tomato Soup", price: 150 },
      { name: "Sweet Corn Soup", price: 170 },
      { name: "Hot & Sour Soup", price: 180 },
      { name: "Chicken Clear Soup", price: 220 },
    ],
  },
  {
    category: "Vegetarian Mains",
    items: [
      { name: "Dal Tadka", price: 250 },
      { name: "Dal Makhani", price: 320 },
      { name: "Jeera Aloo", price: 220 },
      { name: "Mix Veg Curry", price: 280 },
      { name: "Kadai Paneer", price: 340 },
      { name: "Shahi Paneer", price: 350 },
      { name: "Paneer Butter Masala", price: 360 },
      { name: "Palak Paneer", price: 340 },
      { name: "Malai Kofta", price: 360 },
    ],
  },
  {
    category: "Non-Vegetarian Mains",
    items: [
      { name: "Butter Chicken", price: 520 },
      { name: "Chicken Curry", price: 480 },
      { name: "Kadai Chicken", price: 500 },
      { name: "Chicken Tikka Masala", price: 540 },
      { name: "Mutton Rogan Josh", price: 680 },
      { name: "Fish Curry", price: 580 },
    ],
  },
  {
    category: "Rice & Biryani",
    items: [
      { name: "Steamed Rice", price: 180 },
      { name: "Jeera Rice", price: 220 },
      { name: "Veg Pulao", price: 260 },
      { name: "Veg Biryani", price: 320 },
      { name: "Chicken Biryani", price: 480 },
      { name: "Mutton Biryani", price: 620 },
    ],
  },
  {
    category: "Breads",
    items: [
      { name: "Tandoori Roti", price: 35 },
      { name: "Butter Roti", price: 45 },
      { name: "Butter Naan", price: 80 },
      { name: "Garlic Naan", price: 110 },
      { name: "Lachha Paratha", price: 100 },
    ],
  },
  {
    category: "Chinese",
    items: [
      { name: "Veg Hakka Noodles", price: 260 },
      { name: "Chicken Hakka Noodles", price: 340 },
      { name: "Veg Fried Rice", price: 250 },
      { name: "Chicken Fried Rice", price: 320 },
    ],
  },
  {
    category: "Desserts & Beverages",
    items: [
      { name: "Gulab Jamun (2 pcs)", price: 120 },
      { name: "Brownie with Ice Cream", price: 260 },
      { name: "Cold Coffee", price: 180 },
      { name: "Fresh Lime Soda", price: 90 },
    ],
  },
];

export const SIGNATURE: (Dish & { tag: string; blurb: string })[] = [
  { name: "Butter Chicken", price: 520, tag: "House Favourite", blurb: "Slow-simmered tomato, cream, kissed by charcoal." },
  { name: "Mutton Rogan Josh", price: 680, tag: "Kashmiri", blurb: "Deep spice, patience, and mountain lamb." },
  { name: "Paneer Butter Masala", price: 360, tag: "Vegetarian", blurb: "Silken cottage cheese, velvet gravy." },
  { name: "Chicken Biryani", price: 480, tag: "Dum-cooked", blurb: "Long-grain basmati layered over saffron." },
  { name: "Malai Kofta", price: 360, tag: "Editor's Pick", blurb: "Delicate dumplings in a cashew-rich sauce." },
  { name: "Kadai Paneer", price: 340, tag: "Fiery", blurb: "Bell peppers, crushed spice, the wok's roar." },
];

export const PICK_ROTATION = [
  { name: "Mutton Rogan Josh", desc: "Tender lamb braised in Kashmiri chillies and yoghurt." },
  { name: "Butter Chicken", desc: "The dish that made the north famous." },
  { name: "Paneer Butter Masala", desc: "Cream, tomato, cardamom — the trinity." },
  { name: "Chicken Biryani", desc: "Layered dum, saffron, mint, patience." },
  { name: "Kadai Chicken", desc: "Wok-tossed with roasted whole spice." },
  { name: "Malai Kofta", desc: "Cottage-cheese dumplings in a nut-thick gravy." },
  { name: "Fish Curry", desc: "Himalayan trout in mustard and curry leaf." },
];

export const REVIEWS = [
  { text: "Warm, dim, and the butter chicken is exactly right. We walked here twice in one week.", name: "Aditi R.", src: "Google" },
  { text: "A proper meal after a long trek. The mutton rogan josh is worth the climb up.", name: "James P.", src: "TripAdvisor" },
  { text: "Family friendly, quiet corners, and the staff remember your order the next night.", name: "Meera S.", src: "Zomato" },
];

export const GALLERY = [ambienceHero, ambience2, ambienceTea];

// ─── helpers ────────────────────────────────────────────────────────────
export function useOpenStatus() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setOpen(h >= HOURS.open && h < HOURS.close);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}

export function pickOfTheDay(): { name: string; desc: string } {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Number(new Date()) - Number(start);
  const day = Math.floor(diff / 86_400_000);
  return PICK_ROTATION[day % PICK_ROTATION.length];
}

// ─── Reusable UI ────────────────────────────────────────────────────────
export function Btn({
  children,
  variant = "primary",
  href,
  onClick,
  type,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300";
  const styles = {
    primary: "bg-ember text-obsidian hover:bg-bone shadow-md hover:shadow-ember/20",
    ghost: "text-bone hover:text-ember",
    outline: "border border-bone/30 text-bone hover:border-ember hover:text-ember",
  }[variant];
  const cls = `${base} ${styles} ${className}`;
  if (href) {
    if (href.startsWith("/")) {
      return <Link to={href} className={cls} onClick={onClick}>{children}</Link>;
    }
    return <a href={href} className={cls} onClick={onClick}>{children}</a>;
  }
  return <button type={type ?? "button"} onClick={onClick} className={cls}>{children}</button>;
}

export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] tracking-[0.3em] uppercase text-ember font-semibold">
      <span>{children}</span>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────
function Index() {
  const isOpen = useOpenStatus();
  const pick = useMemo(pickOfTheDay, []);
  const activeSection = useActiveSection();
  const [navOpen, setNavOpen] = useState(false);
  const [loaderDone, setLoaderDone] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("den-loaded") === "1";
    }
    return true;
  });

  const handleLoaderDone = () => {
    sessionStorage.setItem("den-loaded", "1");
    setLoaderDone(true);
  };

  // Scroll reveal — runs after loader is done
  useScrollReveal();

  // Re-run scroll reveal when loader finishes (elements now in DOM)
  useEffect(() => {
    if (!loaderDone) return;
    // Small delay to let DOM paint
    const t = setTimeout(() => {
      const els = document.querySelectorAll(".reveal");
      if (!els.length) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      els.forEach((el) => io.observe(el));
    }, 100);
    return () => clearTimeout(t);
  }, [loaderDone]);

  return (
    <>
      {!loaderDone && <Loader3D onDone={handleLoaderDone} />}
      <div className="min-h-screen bg-background text-foreground pb-14 lg:pb-0">
        <Header isOpen={isOpen} onOpenNav={() => setNavOpen(true)} />
        <QuickNav open={navOpen} setOpen={setNavOpen} activeSection="" />
        <Hero isOpen={isOpen} />
        
        {/* Next page link */}
        <div className="mx-auto max-w-7xl px-6 py-12 flex justify-end">
          <Link to="/about" className="group inline-flex items-center gap-2 text-ember hover:text-bone transition-colors text-sm font-medium tracking-wide">
            <span>Continue to Our Story</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Contact isOpen={isOpen} />
        <Footer />
        <MobileCallBar />
      </div>
    </>
  );
}

export function Header({
  isOpen,
  onOpenNav,
}: {
  isOpen: boolean;
  activeSection?: string;
  onOpenNav: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    ["Home", "/", "home"],
    ["About", "/about", "about"],
    ["Menu", "/menu", "menu"],
    ["Gallery", "/gallery", "gallery"],
    ["Reserve", "/reserve", "reserve"],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 py-3.5 ${
        scrolled
          ? "bg-obsidian/90 backdrop-blur-md border-b border-bone/10 shadow-lg"
          : "bg-obsidian/40 backdrop-blur-xs"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex flex-col group">
          <span className="font-display font-medium tracking-wide text-bone text-xl sm:text-2xl group-hover:text-ember transition-colors leading-tight">
            The Den
          </span>
          <span className="text-[9px] tracking-[0.24em] uppercase text-ember/80 font-medium">
            McLeod Ganj · Est. 2015
          </span>
        </Link>

        {/* Desktop Navbar with Section Highlighting & Bold + Bigger Font for Active Section */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {nav.map(([label, href, id]) => {
            const isActive = currentPath === href;
            return (
              <Link
                key={href}
                to={href}
                className={`relative py-1 transition-all duration-300 tracking-[0.24em] uppercase ${
                  isActive
                    ? "text-ember font-bold text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(238,154,84,0.4)] scale-105"
                    : "text-bone/70 hover:text-bone text-[11px] font-normal"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-ember rounded-full shadow-[0_0_8px_#ee9a54]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Top Actions: Phone, WhatsApp, and Browse Toggle - Spaced Cleanly on Mobile! */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase ${isOpen ? "text-glass font-medium" : "text-bone/50"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-glass animate-pulse" : "bg-bone/40"}`} />
            {isOpen ? "Open" : "Closed"}
          </span>
          <a
            href={`tel:${PHONE}`}
            aria-label="Call The Den"
            className="p-2 text-bone/80 hover:text-ember transition-colors rounded-full hover:bg-bone/5"
          >
            <Phone size={18} strokeWidth={1.5} />
          </a>
          <a
            href={wa("Hello! I'd like to make an enquiry with The Den.")}
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp The Den"
            className="p-2 text-bone/80 hover:text-ember transition-colors rounded-full hover:bg-bone/5"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
          </a>
          <button
            onClick={onOpenNav}
            aria-label="Open navigation menu"
            className="p-2 text-bone/80 hover:text-ember transition-colors flex flex-col gap-[3px] ml-1 rounded-full hover:bg-bone/5 group"
          >
            <div className="flex gap-[3px]">
              <span className="block h-[3px] w-[3px] rounded-full bg-bone/90 group-hover:bg-ember transition-colors" />
              <span className="block h-[3px] w-[3px] rounded-full bg-bone/90 group-hover:bg-ember transition-colors" />
            </div>
            <div className="flex gap-[3px]">
              <span className="block h-[3px] w-[3px] rounded-full bg-bone/90 group-hover:bg-ember transition-colors" />
              <span className="block h-[3px] w-[3px] rounded-full bg-bone/90 group-hover:bg-ember transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────
export function Hero({ isOpen }: { isOpen: boolean }) {
  return (
    <section id="home" className="relative min-h-dvh flex flex-col justify-end pb-8 sm:pb-12 overflow-hidden">
      <img
        src={ambienceHero}
        alt="The Den — candlelit interior, McLeod Ganj"
        className="absolute inset-0 h-full w-full object-cover kenburns"
        style={{ filter: "brightness(0.55) saturate(1.05)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/40 to-obsidian" />
      
      {/* Main Hero Content — pushed to the bottom-left to leave space in the middle */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 flex justify-start">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl fade-up text-left">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold leading-[1.1] text-bone text-balance tracking-tight">
            A candlelit table<br />
            <span className="text-ember">in the mountains.</span>
          </h1>
          <p className="mt-2 text-xl sm:text-2xl md:text-3xl text-bone/90 font-accent tracking-wide leading-relaxed">
            Indian · Chinese · Continental — served nightly, by the fire.
          </p>
          
          {/* Main sections pushed to the left, shorter CTA buttons in 2 rows */}
          <div className="mt-4 flex flex-col gap-2 max-w-sm sm:max-w-md">
            <div className="flex gap-2">
              <Btn href="/reserve" className="py-2 px-3 text-[10px] flex-1 sm:flex-initial">Reserve a Table</Btn>
              <Btn href="/about" variant="outline" className="py-2 px-3 text-[10px] flex-1 sm:flex-initial">Our Story</Btn>
            </div>
            <div className="flex gap-2">
              <Btn href="/menu" variant="outline" className="py-2 px-3 text-[10px] flex-1 sm:flex-initial">Explore the Menu <ChevronRight size={11} /></Btn>
              <Btn href="/gallery" variant="outline" className="py-2 px-3 text-[10px] flex-1 sm:flex-initial">Gallery</Btn>
            </div>
          </div>

          {/* Compact, transparent trust strip — 2x2 grid strictly on the left to align with standing figure's height */}
          <div className="mt-5 pt-3 border-t border-bone/15 bg-transparent grid grid-cols-2 gap-x-4 gap-y-3 max-w-[280px] sm:max-w-[320px] text-left">
            <div>
              <div className="flex items-center gap-1 text-ember">
                {[...Array(5)].map((_, i) => <Star key={i} size={9} fill="currentColor" strokeWidth={0} />)}
              </div>
              <div className="mt-0.5 text-[9px] tracking-[0.2em] uppercase text-bone/60">4.7 · 820+ reviews</div>
            </div>
            <div>
              <div className="font-display text-sm text-bone font-medium">{"\u20B9\u20B9"}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-bone/60">Mid-range · {"\u20B9"}500–900</div>
            </div>
            <div>
              <div className={`font-display text-sm font-medium ${isOpen ? "text-glass" : "text-bone/60"}`}>
                {isOpen ? "Open Now" : "Closed"}
              </div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-bone/60">Daily · 8am – 11pm</div>
            </div>
            <div>
              <div className="font-display text-sm text-bone font-medium">10 yrs</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-bone/60">Feeding the town</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Animated counter component ─────────────────────────────────────────
function StatCounter({ target, decimals = 0, suffix = "", label }: { target: number; decimals?: number; suffix?: string; label: string }) {
  const [ref, value] = useCountUp(target, { decimals, suffix });
  return (
    <div>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="font-display text-4xl font-light text-bone">{value}</div>
      <div className="mt-1 text-[10px] tracking-[0.24em] uppercase text-bone/50">{label}</div>
    </div>
  );
}

// ─── About ──────────────────────────────────────────────────────────────
export function About() {
  return (
    <section id="about" className="py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-32 reveal">
          <img src={ambience2} alt="Interior at The Den" className="w-full aspect-[4/5] object-cover" />
        </div>
        <div className="lg:col-span-7 lg:pt-12">
          <div className="reveal"><Overline>Our Story</Overline></div>
          <h2 className="reveal mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-medium leading-tight text-balance">
            Ten years of cooking in McLeod Ganj.
          </h2>
          <div className="reveal mt-6 space-y-4 text-base text-bone/75 leading-relaxed max-w-xl">
            <p>
              The Den opened its doors in 2015 as a warm kitchen with a simple goal:
              to serve authentic, comforting food to locals and travellers returning
              from the mountains.
            </p>
            <p>
              A decade later, our commitment remains unchanged — quality ingredients,
              welcoming ambience, and good food served by the fire.
            </p>
          </div>
          <div className="reveal mt-10 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-bone/10 pt-8">
            <StatCounter target={820} suffix="+" label="Reviews" />
            <StatCounter target={4.7} decimals={1} label="Rating" />
            <StatCounter target={10} label="Years" />
            <StatCounter target={100} suffix="%" label="Family friendly" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Signature dishes ───────────────────────────────────────────────────
export function Signature() {
  return (
    <section className="py-24 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <Overline>Kitchen Favourites</Overline>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium">Signature Dishes</h2>
          </div>
          <a href="#menu" className="text-[11px] tracking-[0.28em] uppercase text-ember hover:text-bone transition-colors inline-flex items-center gap-2 font-medium">
            Full menu <ChevronRight size={14} />
          </a>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {SIGNATURE.map((d, i) => (
            <article
              key={d.name}
              className={`reveal stagger-${i + 1} group cursor-default transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-bone/15 pb-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const ItemIcon = getMenuItemIcon(d.name, "") || Utensils;
                    return <ItemIcon size={18} strokeWidth={1.5} className="text-ember/80 group-hover:text-ember transition-colors shrink-0" />;
                  })()}
                  <h3 className="font-heading text-xl text-bone group-hover:text-ember transition-colors font-medium">{d.name}</h3>
                </div>
                <span className="font-heading text-lg text-ember whitespace-nowrap font-medium">{"\u20B9"}{d.price}</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[10px] tracking-[0.24em] uppercase text-bone/50 font-medium">
                <span>{d.tag}</span>
              </div>
              <p className="mt-3 text-sm text-bone/70 leading-relaxed">{d.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pick of the day + Recipe spotlight ─────────────────────────────────
export function PickAndRecipe({ pick }: { pick: { name: string; desc: string } }) {
  return (
    <section className="py-24 border-t border-bone/10 bg-card">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
        {/* Pick of the day */}
        <div className="reveal relative border border-ember/30 overflow-hidden flex flex-col justify-between">
          <div className="h-60 overflow-hidden relative">
            <img
              src={kadaiChicken}
              alt="Featured Kadai Chicken"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ filter: "brightness(0.9) contrast(1.05)" }}
            />
            <div className="absolute top-4 left-6 bg-card border border-ember/30 px-3 py-1 text-[10px] tracking-[0.28em] uppercase text-ember z-10 font-medium">
              Pick of the Day
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>
          <div className="p-6 sm:p-8 pt-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-ember">
                <Sparkles size={16} strokeWidth={1.5} />
                <span className="text-[10px] tracking-[0.24em] uppercase font-medium">Daily Special</span>
              </div>
              <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-medium leading-tight text-bone">
                {pick.name}
              </h3>
              <p className="mt-3 text-sm text-bone/75 leading-relaxed max-w-md">{pick.desc}</p>
            </div>
            <p className="mt-6 text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">
              Chef's recommendation
            </p>
          </div>
        </div>

        {/* Recipe spotlight */}
        <div className="reveal stagger-2">
          <Overline>Recipe Spotlight</Overline>
          <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-medium">Paneer Butter Masala</h3>
          <p className="mt-2 text-xs text-bone/60">A house favourite prepared fresh daily.</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] tracking-[0.28em] uppercase text-ember font-medium">Ingredients</h4>
              <ul className="mt-3 space-y-1.5 text-bone/75 text-sm">
                {[
                  "250g fresh paneer, cubed",
                  "4 ripe tomatoes",
                  "2 tbsp cashews, soaked",
                  "Fresh cream & butter",
                  "Kasuri methi & aromatic spices",
                ].map((i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="text-ember/60">·</span>{i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.28em] uppercase text-ember font-medium">Preparation</h4>
              <ol className="mt-3 space-y-2 text-bone/75 text-xs leading-relaxed">
                {[
                  "Blanch tomatoes and cashews; blend to smooth purée.",
                  "Sauté spices lightly in butter.",
                  "Simmer sauce until rich and deep in flavor.",
                  "Add fresh paneer, cream, and kasuri methi before serving.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-display text-ember font-medium">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Full menu ──────────────────────────────────────────────────────────
export function FullMenu() {
  const [active, setActive] = useState(MENU[0].category);
  const current = MENU.find((m) => m.category === active) ?? MENU[0];

  return (
    <section id="menu" className="py-24 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 reveal">
            <Overline>Our Menu</Overline>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium leading-tight">
              Explore Our Offerings
            </h2>
            <nav className="mt-8 flex flex-col gap-1.5">
              {MENU.map((s) => {
                const IconComponent = CATEGORY_ICONS[s.category] || Utensils;
                return (
                  <button
                    key={s.category}
                    onClick={() => setActive(s.category)}
                    className={`flex items-center gap-3 text-left py-2.5 pl-4 border-l text-sm tracking-wide transition-all ${
                      active === s.category
                        ? "border-ember text-ember bg-ember/5 font-medium"
                        : "border-bone/10 text-bone/60 hover:text-bone hover:border-bone/40 hover:bg-bone/5"
                    }`}
                  >
                    <IconComponent size={16} strokeWidth={1.5} className="shrink-0" />
                    <span>{s.category}</span>
                  </button>
                );
              })}
            </nav>
            <a
              href="/menu.pdf"
              download
              className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-ember hover:text-bone transition-colors font-medium"
            >
              <Download size={14} /> Download PDF Menu
            </a>
          </div>

          <div className="lg:col-span-8 reveal stagger-2">
            <div className="border-t border-bone/10 pt-6">
              <h3 className="font-heading text-2xl text-bone mb-6 font-medium">{current.category}</h3>
              <ul className="divide-y divide-bone/10">
                {current.items.map((d) => {
                  const ItemIcon = getMenuItemIcon(d.name, current.category) || CATEGORY_ICONS[current.category] || Utensils;
                  return (
                    <li key={d.name} className="py-4 flex items-baseline gap-4 group">
                      <div className="flex items-center gap-3 flex-1">
                        <ItemIcon size={16} strokeWidth={1.5} className="text-ember/70 shrink-0 group-hover:text-ember transition-colors" />
                        <span className="font-heading text-base sm:text-lg text-bone group-hover:text-ember transition-colors font-normal">{d.name}</span>
                      </div>
                      <span className="hidden sm:block flex-1 border-b border-dotted border-bone/20 mb-1" />
                      <span className="font-heading text-base sm:text-lg text-ember whitespace-nowrap font-medium">{"\u20B9"}{d.price}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Why us ─────────────────────────────────────────────────────────────
export function WhyUs() {
  const items = [
    [Flame, "Tandoor to table", "Char, smoke, and speed — served hot and fresh."],
    [Leaf, "Local mountain produce", "Sourced from Kangra valley farms whenever in season."],
    [Wine, "Selected beverages", "A thoughtful list of beverages, teas, and refreshes."],
    [Users, "Family-friendly", "Welcoming space for families, groups, and solo diners."],
    [Mountain, "Locals-first", "Ten years of serving regular patrons in McLeod Ganj."],
    [Award, "Highly rated", "4.7 average rating across Google, Zomato and Tripadvisor."],
    [Utensils, "Multi-cuisine", "North Indian, Chinese and Continental favourites."],
    [Clock, "Open daily", "Open 8am to 11pm, 365 days a year."],
  ] as const;
  return (
    <section className="py-24 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal">
          <Overline>Why Visit</Overline>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium">Reasons to Come Back</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {items.map(([Icon, title, blurb], i) => (
            <div key={title} className={`reveal stagger-${i + 1}`}>
              <Icon size={20} strokeWidth={1.25} className="text-ember" />
              <h3 className="mt-3 font-heading text-lg text-bone font-medium">{title}</h3>
              <p className="mt-1.5 text-xs text-bone/65 leading-relaxed">{blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chef ───────────────────────────────────────────────────────────────
export function Chef() {
  return (
    <section className="py-24 border-t border-bone/10 bg-card">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 reveal">
          <img src={chefPortrait} alt="Head Chef, The Den" className="w-full aspect-[4/5] object-cover" />
        </div>
        <div className="lg:col-span-7 lg:pl-6">
          <div className="reveal"><Overline>Meet Our Chef</Overline></div>
          <h2 className="reveal mt-3 font-heading text-3xl sm:text-4xl font-medium leading-tight">
            Passion in Every Dish
          </h2>
          <p className="reveal mt-6 text-base text-bone/75 leading-relaxed max-w-lg">
            Our head chef brings over fifteen years of culinary expertise spanning North Indian,
            Chinese, and Continental cuisines — bringing rich flavours and consistent quality to
            every plate served at The Den.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────
export function Testimonials() {
  return (
    <section className="py-24 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal"><Overline>Guest Reviews</Overline></div>
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <figure key={r.name} className={`reveal stagger-${i + 1} border border-bone/10 p-6 bg-card/40`}>
              <blockquote className="font-sans text-sm sm:text-base leading-relaxed text-bone/90">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-4 text-[10px] tracking-[0.24em] uppercase text-ember font-medium">
                — {r.name} · {r.src}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ────────────────────────────────────────────────────────────
export function Gallery() {
  const captions = ["Main dining space", "Mountain view ambience", "Warm evening lighting"];
  return (
    <section id="gallery" className="py-24 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal">
          <Overline>Inside The Den</Overline>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium">Ambience & Gallery</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {GALLERY.map((src, i) => (
            <figure key={i} className={`reveal stagger-${i + 1} group relative overflow-hidden`}>
              <img
                src={src}
                alt={captions[i]}
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "brightness(0.9) contrast(1.05)" }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-obsidian to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] tracking-[0.24em] uppercase text-bone font-medium">{captions[i]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Extras: Party booking + reviews showcase ──────────────────────────
export function Extras() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", guests: "", occasion: "Birthday" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = `Hi The Den — I'd like to enquire about a private event.

Name: ${form.name}
Phone: ${form.phone}
Date: ${form.date}
Guests: ${form.guests}
Occasion: ${form.occasion}`;
    window.open(wa(msg), "_blank");
  };
  return (
    <section id="extras" className="py-24 border-t border-bone/10 bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 reveal">
            <Overline>Parties & Private Events</Overline>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-medium leading-tight">
              Host Your Gathering
            </h2>
            <p className="mt-4 text-sm text-bone/70 leading-relaxed max-w-md">
              Birthdays, anniversaries, corporate gatherings, and family dinners. We host groups
              of 10 to 60 with customized set menus.
            </p>
            <dl className="mt-8 space-y-3 text-sm">
              {[
                ["Capacity", "10 – 60 guests"],
                ["Occasions", "Birthdays · Anniversaries · Corporate · Gatherings"],
                ["Response", "Quick confirmation over WhatsApp or call"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[100px_1fr] gap-4 border-b border-bone/10 pb-2.5">
                  <dt className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">{k}</dt>
                  <dd className="text-bone/85 text-xs">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <form onSubmit={submit} className="lg:col-span-7 reveal stagger-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              <Field label="Guest count" type="number" value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">Occasion</label>
              <select
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                className="mt-2 w-full bg-transparent border-b border-bone/20 py-2 text-bone text-sm focus:outline-none focus:border-ember"
              >
                {["Birthday", "Anniversary", "Corporate", "Wedding", "Other"].map((o) => (
                  <option key={o} className="bg-obsidian">{o}</option>
                ))}
              </select>
            </div>
            <div className="pt-3 flex flex-wrap gap-3 items-center">
              <Btn type="submit"><MessageCircle size={14} /> Enquire via WhatsApp</Btn>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", required = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={120}
        className="mt-2 w-full bg-transparent border-b border-bone/20 py-2 text-bone text-sm focus:outline-none focus:border-ember transition-colors"
      />
    </label>
  );
}

// ─── Reserve ────────────────────────────────────────────────────────────
export function Reserve() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "19:30", guests: "2" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = `Hi The Den — I'd like to reserve a table.

Name: ${form.name}
Phone: ${form.phone}
Date: ${form.date}
Time: ${form.time}
Guests: ${form.guests}`;
    window.open(wa(msg), "_blank");
  };
  return (
    <section id="reserve" className="py-24 border-t border-bone/10">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="reveal"><Overline>Reservations</Overline></div>
        <h2 className="reveal mt-3 font-heading text-3xl sm:text-4xl font-medium leading-tight text-balance">
          Book Your Table
        </h2>
        <form onSubmit={submit} className="reveal stagger-2 mt-10 grid sm:grid-cols-2 gap-5 text-left">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <Field label="Time" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
          <div className="sm:col-span-2">
            <label className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">Guests</label>
            <select
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className="mt-2 w-full bg-transparent border-b border-bone/20 py-2 text-bone text-sm focus:outline-none focus:border-ember"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((g) => (
                <option key={g} className="bg-obsidian">{g} {g === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Btn type="submit"><MessageCircle size={14} /> Send via WhatsApp</Btn>
            <span className="text-xs text-bone/60">
              Prefer to call? <a href={`tel:${PHONE}`} className="text-ember hover:text-bone underline underline-offset-4">{PHONE_DISPLAY}</a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

// ─── Contact ────────────────────────────────────────────────────────────
export function Contact({ isOpen }: { isOpen: boolean }) {
  return (
    <section id="contact" className="py-24 border-t border-bone/10 bg-card">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="reveal"><Overline>Visit Us</Overline></div>
          <h2 className="reveal mt-3 font-heading text-3xl sm:text-4xl font-medium">Location & Contact</h2>

          <div className="reveal stagger-2 mt-8 space-y-6">
            <div className="flex gap-4">
              <MapPin size={18} className="text-ember mt-1 shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">Address</div>
                <div className="mt-1 text-sm text-bone">{ADDRESS}</div>
                <a href={MAPS_URL} target="_blank" rel="noopener" className="mt-1.5 inline-block text-xs tracking-[0.2em] uppercase text-ember hover:text-bone font-medium">
                  Get directions
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone size={18} className="text-ember mt-1 shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">Phone & WhatsApp</div>
                <a href={`tel:${PHONE}`} className="mt-1 block text-sm text-bone hover:text-ember">{PHONE_DISPLAY}</a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={18} className="text-ember mt-1 shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-medium">Hours</div>
                <div className="mt-1 text-sm text-bone">Daily · 8:00 am – 11:00 pm</div>
                <div className={`mt-1 text-xs ${isOpen ? "text-glass" : "text-bone/50"}`}>
                  {isOpen ? "Open right now" : "Closed at the moment"}
                </div>
              </div>
            </div>
          </div>

          <div className="reveal stagger-3 mt-12 border border-ember/30 p-6">
            <div className="text-[10px] tracking-[0.28em] uppercase text-ember font-medium">Confirm your booking</div>
            <div className="mt-2 font-display text-xl text-bone leading-snug">
              Call or WhatsApp us directly for immediate confirmation.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Btn href={`tel:${PHONE}`}><Phone size={14} /> Call {PHONE_DISPLAY}</Btn>
              <Btn href={wa("Hi, I'd like to confirm a booking at The Den.")} variant="outline"><MessageCircle size={14} /> WhatsApp</Btn>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 reveal stagger-2">
          <div className="aspect-[4/3] w-full overflow-hidden border border-bone/10">
            <iframe
              title="The Den — McLeod Ganj"
              src="https://www.google.com/maps?q=McLeod+Ganj+Dharamshala&output=embed"
              className="h-full w-full grayscale contrast-125"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-bone/10 py-16">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-heading text-3xl text-bone">The Den</div>
          <p className="mt-3 text-sm text-bone/60 italic max-w-xs">
            A candlelit table in the mountains. McLeod Ganj, since 2015.
          </p>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 mb-4">Visit</div>
          <div className="text-sm text-bone/75 space-y-2">
            <div>{ADDRESS}</div>
            <div>Daily · 8am – 11pm</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 mb-4">Explore</div>
          <div className="text-sm space-y-2 font-normal">
            <Link to="/" className="block text-bone/75 hover:text-ember transition-colors">Home</Link>
            <Link to="/about" className="block text-bone/75 hover:text-ember transition-colors">Our Story & About</Link>
            <Link to="/menu" className="block text-bone/75 hover:text-ember transition-colors">Our Menu</Link>
            <Link to="/gallery" className="block text-bone/75 hover:text-ember transition-colors">Gallery & Reviews</Link>
            <Link to="/reserve" className="block text-bone/75 hover:text-ember transition-colors">Reserve a Table</Link>
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 mb-4">Contact</div>
          <div className="text-sm space-y-2">
            <a href={`tel:${PHONE}`} className="block text-bone hover:text-ember">{PHONE_DISPLAY}</a>
            <a href={wa("Hello The Den!")} target="_blank" rel="noopener" className="block text-bone hover:text-ember">WhatsApp us</a>
            <a href={MAPS_URL} target="_blank" rel="noopener" className="block text-bone hover:text-ember">Get directions</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-12 pt-8 border-t border-bone/10 flex flex-wrap justify-between gap-4 text-xs text-bone/40">
        <span>© {new Date().getFullYear()} The Den, McLeod Ganj. All rights reserved.</span>
        <span className="italic">Built with candlelight.</span>
      </div>
    </footer>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

// ─── Mobile sticky call bar ─────────────────────────────────────────────
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-obsidian/95 backdrop-blur border-t border-bone/10 grid grid-cols-2">
      <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 py-4 text-xs tracking-[0.2em] uppercase text-bone">
        <Phone size={14} /> Call
      </a>
      <a href={wa("Hello The Den!")} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 py-4 text-xs tracking-[0.2em] uppercase text-obsidian bg-ember">
        <MessageCircle size={14} /> WhatsApp
      </a>
    </div>
  );
}
