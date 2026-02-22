import HeroSection from "@/components/home/HeroSection";
import MarqueeBar from "@/components/home/MarqueeBar";
import StatsBar from "@/components/home/StatsBar";
import CollectionGrid from "@/components/home/CollectionGrid";
import ServicesSection from "@/components/home/ServicesSection";
import BrandsSection from "@/components/home/BrandsSection";
import AboutSection from "@/components/home/AboutSection";
import AppointmentCTA from "@/components/home/AppointmentCTA";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TipsSection from "@/components/home/TipsSection";

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <MarqueeBar />
      <StatsBar />
      <CollectionGrid />
      <ServicesSection />
      <BrandsSection />
      <AboutSection />
      <TestimonialsSection />
      <TipsSection />
      <AppointmentCTA />
    </div>
  );
}
