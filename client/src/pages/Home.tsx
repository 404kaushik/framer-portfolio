import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ProficienciesSection } from '@/components/ProficienciesSection';
import { WorkSection } from '@/components/WorkSection';
import { EducationSection } from '@/components/EducationSection';
import { AwardSection } from '@/components/AwardSection';
import ProjectSection from '@/components/ProjectSection';
import { ContactSection } from '@/components/ContactSection';

export default function Home() {
  const portfolio = {
    name: 'Riya Jaykar',
    about: {
      highlights: [
        'Full-Stack Developer',
        'Based in Berlin',
        '5+ Years Experience',
        'Open to Work',
      ],
      description: 
        `When I\'m not coding, you\'ll find me on the tennis court, gaming, or sharing a good meal with friends.`,
    },
    proficiencies: [
      { category: 'Skills', items: ['API Design', 'Frontend Architecture'] },
    ],
    work: [
      {
        company: 'Designed Securities Ltd.',
        position: 'Software Engineer',
        period: '2025 - Now',
        location: 'Toronto',
        description: 'Building scalable web applications and leading frontend architecture decisions.',
      },
      {
        company: 'Junior Achievement Northeast Ontario',
        position: 'Research Data Assistant',
        period: '2020 - 2022',
        location: 'Petborough',
        description: 'Developed and maintained multiple client projects using React and Node.js.',
      },
    ],
    education: [
      {
        institution: 'University of Toronto',
        degree: 'Bachelor of Science in Computer Science',
        period: '2016 - 2020',
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141417] text-foreground">
      <Navigation />
      <HeroSection name={portfolio.name} />
      <ProficienciesSection />
      <WorkSection items={portfolio.work} />
      <EducationSection items={portfolio.education} />
      <AwardSection />
      <ProjectSection />
      <ContactSection email="riyajaykar@example.com" socialLinks={{
        linkedin: 'https://www.linkedin.com/in/riyajaykar',
        instagram: 'https://www.instagram.com/riyaajaykarr',
      }} />
    </div>
  );
}
