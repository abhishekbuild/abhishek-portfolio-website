export const revalidate = 3600;

import HeroSection from "@/components/HeroSection";
import PerspectivesSection from "@/components/PerspectivesSection";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import WritingSection from "@/components/WritingSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PerspectivesSection />
      <FeaturedWorkSection />
      <WritingSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
