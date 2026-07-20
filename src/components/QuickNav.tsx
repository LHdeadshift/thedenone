import { useEffect, useRef } from "react";
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

interface QuickNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeSection: string;
}

/**
 * Slide-out navigation panel.
 * Focus-trapped, Esc-dismissible, highlights active section in bold & bigger font.
 */
export function QuickNav({ open, setOpen, activeSection }: QuickNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard: Esc to close & focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([-1])',
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
  }, [open, setOpen]);

  // Focus panel on open
  useEffect(() => {
    if (open && panelRef.current) {
      const firstLink = panelRef.current.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-obsidian/60 backdrop-blur-sm transition-opacity"
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
          <span className="text-[10px] tracking-[0.32em] uppercase text-bone/50 font-medium">
            Navigation
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="p-2 text-bone/60 hover:text-ember transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
          {SECTIONS.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between py-2.5 tracking-wide transition-all ${
                  isActive
                    ? "text-ember font-bold text-xl tracking-wider pl-2 border-l-2 border-ember bg-ember/5"
                    : "text-bone/60 hover:text-bone font-normal text-base hover:pl-1"
                }`}
              >
                <span>{label}</span>
                {isActive && <span className="h-2 w-2 rounded-full bg-ember animate-pulse" />}
              </a>
            );
          })}
        </nav>

        <div className="px-8 pb-8">
          <div className="border-t border-bone/10 pt-6">
            <span className="font-display text-lg text-bone/70 font-medium">The Den</span>
            <p className="mt-1 text-[10px] tracking-[0.24em] uppercase text-bone/40">
              McLeod Ganj · Est. 2015
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
