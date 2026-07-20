import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Header,
  About,
  Chef,
  WhyUs,
  Contact,
  Footer,
  MobileCallBar,
  useOpenStatus,
} from "./index";
import { QuickNav } from "@/components/QuickNav";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const isOpen = useOpenStatus();
  const [navOpen, setNavOpen] = useState(false);
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
        <About />
        <Chef />
        <WhyUs />
      </div>

      {/* Next page link */}
      <div className="mx-auto max-w-7xl px-6 py-12 flex justify-end">
        <Link
          to="/menu"
          className="group inline-flex items-center gap-2 text-ember hover:text-bone transition-colors text-sm font-medium tracking-wide"
        >
          <span>Explore Our Menu</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <Contact isOpen={isOpen} />
      <Footer />
      <MobileCallBar />
    </div>
  );
}
