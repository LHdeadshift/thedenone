import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const SECTIONS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Menu", id: "menu" },
  { label: "Gallery", id: "gallery" },
  { label: "Reserve", id: "reserve" },
  { label: "Extras", id: "extras" },
  { label: "Contact", id: "contact" },
];

/**
 * Fixed corner quick-nav: dot-grid icon → slide-out panel.
 * IO-tracked current section, focus-trapped, Esc-dismissible.
 */
export function QuickNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  // Keyboard: Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      // Focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus panel on open
  useEffect(() => {
    if (open && panelRef.current) {
      const firstLink =
        panelRef.current.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Trigger button — dot-grid icon */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Open quick navigation"
        className="fixed top-5 right-5 z-[60] flex flex-col gap-[3px] p-3 group"
      >
        <div className="flex gap-[3px]">
          <span className="block h-[3px] w-[3px] rounded-full bg-bone/70 group-hover:bg-ember transition-colors" />
          <span className="block h-[3px] w-[3px] rounded-full bg-bone/70 group-hover:bg-ember transition-colors" />
        </div>
        <div className="flex gap-[3px]">
          <span className="block h-[3px] w-[3px] rounded-full bg-bone/70 group-hover:bg-ember transition-colors" />
          <span className="block h-[3px] w-[3px] rounded-full bg-bone/70 group-hover:bg-ember transition-colors" />
        </div>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-obsidian/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Quick navigation"
        aria-modal="true"
        className={`fixed top-0 right-0 bottom-0 z-[80] w-72 bg-obsidian border-l border-bone/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <span className="text-[10px] tracking-[0.32em] uppercase text-bone/50">
            Navigate
          </span>
          <button
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close navigation"
            className="p-2 text-bone/60 hover:text-ember transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
          {SECTIONS.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className={`block py-3 text-lg tracking-wide transition-all ${
                active === id
                  ? "text-bone font-semibold underline underline-offset-8 decoration-ember"
                  : "text-bone/50 hover:text-bone"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="px-8 pb-8">
          <div className="border-t border-bone/10 pt-6">
            <span className="font-display text-xl text-bone/60">The Den</span>
            <p className="mt-1 text-[10px] tracking-[0.24em] uppercase text-bone/40">
              McLeod Ganj · Est. 2015
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
