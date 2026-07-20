import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Header,
  Signature,
  PickAndRecipe,
  FullMenu,
  Contact,
  Footer,
  MobileCallBar,
  useOpenStatus,
  pickOfTheDay,
} from "./index";
import { QuickNav } from "@/components/QuickNav";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
});

function MenuPage() {
  const isOpen = useOpenStatus();
  const [navOpen, setNavOpen] = useState(false);
  const pick = useMemo(pickOfTheDay, []);
  useScrollReveal();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-14 lg:pb-0">
      <Header isOpen={isOpen} onOpenNav={() => setNavOpen(true)} />
      <QuickNav open={navOpen} setOpen={setNavOpen} activeSection="" />

      {/* Main Content Sections */}
      <div className="pt-16 sm:pt-20">
        <Signature />
        <PickAndRecipe pick={pick} />
        <FullMenu />
      </div>

      {/* Next page link */}
      <div className="mx-auto max-w-7xl px-6 py-12 flex justify-end">
        <Link
          to="/gallery"
          className="group inline-flex items-center gap-2 text-ember hover:text-bone transition-colors text-sm font-medium tracking-wide"
        >
          <span>Explore Ambience & Gallery</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <Contact isOpen={isOpen} />
      <Footer />
      <MobileCallBar />
    </div>
  );
}
