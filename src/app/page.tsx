import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import InteractiveDemo from "@/components/InteractiveDemo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <InteractiveDemo />
      </main>

      <SiteFooter />
    </div>
  );
}
