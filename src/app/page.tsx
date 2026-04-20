'use client';

import dynamic from 'next/dynamic';

import { ScrollToTopButton } from '@/src/shared/components/ui/scroll-to-top-button';
import WithSmoothScroll from '@/src/shared/hocs/with-smooth-scroll';

const Header = dynamic(() => import('@/src/features/landing/components/header'), { ssr: true });
const HeroSection = dynamic(() => import('@/src/features/landing/components/hero'));
const StatsSection = dynamic(() => import('@/src/features/landing/components/stats'));
const TutorsSection = dynamic(() => import('@/src/features/landing/components/tutor'));
const FeaturesSection = dynamic(() => import('@/src/features/landing/components/features'));
const CTASection = dynamic(() => import('@/src/features/landing/components/cta'));
const FooterSection = dynamic(() => import('@/src/features/landing/components/footer'));

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
