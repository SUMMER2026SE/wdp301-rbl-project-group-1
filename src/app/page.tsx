import HeroSection from "@/src/features/landing/components/hero";
import StatsSection from "@/src/features/landing/components/stats";
import TutorsSection from "@/src/features/landing/components/tutor";
import FeaturesSection from "@/src/features/landing/components/features";
import CTASection from "@/src/features/landing/components/cta";
import FooterSection from "@/src/features/landing/components/footer";
import Header from "@/src/features/landing/components/header";
import WithSmoothScroll from "@/src/shared/hocs/with-smooth-scroll";
import { ScrollToTopButton } from "../shared/components/ui/scroll-to-top-button";

export default function Home() {
  return (
    <WithSmoothScroll>
      <div className="relative min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <HeroSection id="hero" />
          <StatsSection id="stats" />
          <TutorsSection id="tutors" />
          <FeaturesSection id="features" />
          <CTASection id="cta" />
        </main>
        <FooterSection id="contact-us" />
        <ScrollToTopButton />
      </div>
    </WithSmoothScroll>
  );
}
