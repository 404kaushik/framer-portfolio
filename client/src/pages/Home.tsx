import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import ProjectSection from '@/components/ProjectSection';
import { WorkSection } from '@/components/WorkSection';
import { ProficienciesSection } from '@/components/ProficienciesSection';
import { EducationSection } from '@/components/EducationSection';
import { GitHubSection } from '@/components/GitHubSection';
import { ContactSection } from '@/components/ContactSection';
import { WeatherBackground } from '@/components/WeatherBackground';
import { WeatherProvider } from '@/contexts/WeatherContext';
import { Footer } from '@/components/Footer';
import { useSmoothScroll } from '@/lib/smoothScroll';

/** Order follows what a recruiter looks for: the work, then the roles, then the rest. */
export default function Home() {
  useSmoothScroll();
  return (
    <WeatherProvider>
      <div className="min-h-screen overflow-x-clip bg-[#141417] text-foreground">
        <WeatherBackground />
        <div className="relative z-10">
          <Navigation />
          <main>
            <HeroSection />
            <ProjectSection />
            <WorkSection />
            <ProficienciesSection />
            <EducationSection />
            <GitHubSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </div>
    </WeatherProvider>
  );
}
