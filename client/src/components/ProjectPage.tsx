import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import "react-router-dom";
import { useRoute } from 'wouter';

const projectsData = {
  shelf: {
    name: "Shelf",
    description: "Digital Library for Developers",
    year: "2023",
    type: "Side Project",
    role: "Full-Stack Developer",
    icon: "dots",
    heroColor: "#6b7c6b",
    caseStudy: {
      objective:
        "Create a minimalist, intuitive platform designed to help users effortlessly organize, discover, and manage their digital content, reducing clutter and enhancing productivity.",
      process:
        "My design process for Shelf focused on understanding user habits around digital content and crafting a simple, effective solution. I began by developing a Minimum Viable Product (MVP) based on an initial prototype provided by a befriended UX Designer. This MVP underwent rigorous testing with 15 target users, and their invaluable feedback directly informed subsequent design refinements, culminating in the final product.",
      outcome:
        "The final product successfully reduced digital clutter for users by 40% and increased daily productivity metrics by 25%. User satisfaction scores averaged 4.8/5 in post-launch surveys.",
    },
  },
  locale: {
    name: "Locale",
    description: "Lightweight Content Localization",
    year: "2023",
    type: "Side Project",
    role: "Full-Stack Developer",
    icon: "asterisk",
    heroColor: "#7c6b5c",
    caseStudy: {
      objective:
        "Build a lightweight localization tool that enables developers to easily manage and deploy multilingual content without complex configurations.",
      process:
        "The development focused on creating an intuitive API-first approach. Through iterative testing with development teams, we refined the workflow to minimize friction when adding new languages and managing translations.",
      outcome:
        "Locale reduced localization setup time by 60% compared to traditional solutions, with adoption by over 200 development teams in the first quarter.",
    },
  },
  taskly: {
    name: "Taskly",
    description: "Minimal Task Manager",
    year: "2024",
    type: "Side Project",
    role: "Full-Stack Developer",
    icon: "layers",
    heroColor: "#5c6b7c",
    caseStudy: {
      objective:
        "Design a distraction-free task management application that focuses on simplicity and quick task capture.",
      process:
        "Research into productivity habits revealed that most task apps suffer from feature bloat. Taskly was designed with intentional constraints, focusing only on essential features that drive task completion.",
      outcome:
        "Users reported 35% higher task completion rates compared to their previous tools, with an average session time of just 45 seconds per interaction.",
    },
  },
};

function DotsIcon({ className = "size-8" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-1.5 ${className}`}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`size-2 rounded-full ${
            [0, 1, 2, 3, 5, 6, 8, 9, 10, 11].includes(i) ? "bg-white" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function AsteriskIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  );
}

function LayersIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M2 17l10 5 10-5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 2L2 7l10 5 10-5-10-5z"
        stroke="#93c5fd"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroIllustration({ color, icon }: { color: string; icon: string }) {
  return (
    <div
      className="relative flex h-60 sm:h-72 md:h-80 w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl"
      style={{ backgroundColor: color }}
    >
      {/* Connecting lines with dots - Hidden on mobile for cleaner look */}
      <svg className="absolute inset-0 h-full w-full hidden sm:block" viewBox="0 0 800 320">
        {/* Top line */}
        <line x1="50" y1="120" x2="650" y2="100" stroke="#c5d4c5" strokeWidth="2" />
        <circle cx="650" cy="100" r="12" fill="#c5d4c5" />

        {/* Middle line */}
        <line x1="100" y1="180" x2="280" y2="170" stroke="#c5d4c5" strokeWidth="2" />
        <circle cx="280" cy="170" r="10" fill="#c5d4c5" />

        {/* Bottom line */}
        <line x1="150" y1="240" x2="580" y2="230" stroke="#c5d4c5" strokeWidth="2" />
        <circle cx="580" cy="230" r="12" fill="#c5d4c5" />
      </svg>

      {/* Center icon */}
      <div className="relative z-10 flex size-16 sm:size-20 items-center justify-center rounded-xl sm:rounded-2xl bg-[#1a1a1a]">
        {icon === "dots" && <DotsIcon className="size-8 sm:size-10" />}
        {icon === "asterisk" && <AsteriskIcon className="size-8 sm:size-10" />}
        {icon === "layers" && <LayersIcon className="size-8 sm:size-10" />}
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const [match, params] = useRoute("/projects/:slug");
  const slug = params?.slug as string | undefined;
  const navigate = useNavigate();
  
  const project = slug ? projectsData[slug as keyof typeof projectsData] : null;

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#161616] text-white px-4">
        <div className="text-center">
          <h1 className="mb-4 text-3xl sm:text-4xl font-light">Project Not Found</h1>
          <Link to="/" className="text-[#888888] hover:text-white transition-colors">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#161616] font-light text-white md:pt-12">
      {/* Header */}
      <header className="flex items-center max-w-2xl mx-auto justify-between px-4 sm:px-6 py-4 sm:py-6 md:px-12">
        <Link to="/" className="text-xs sm:text-sm text-[#888888] transition-colors hover:text-white">
          Kaushik's Resume 
        </Link>
        <button className="flex items-center gap-2 text-xs sm:text-sm text-[#888888] transition-colors hover:text-white">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
          <span className="hidden sm:inline">Menu</span>
        </button>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
            {project.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#888888]">
            {project.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="mb-8 sm:mb-10 border-b border-[#333333] pb-6 sm:pb-8">
          <div className="flex items-center justify-between py-2 sm:py-1">
            <span className="text-sm sm:text-base text-[#888888]">Year</span>
            <span className="text-sm sm:text-base text-white">{project.year}</span>
          </div>
          <div className="flex items-center justify-between py-2 sm:py-1">
            <span className="text-sm sm:text-base text-[#888888]">Type of Project</span>
            <span className="text-sm sm:text-base text-white">{project.type}</span>
          </div>
          <div className="flex items-center justify-between py-2 sm:py-1">
            <span className="text-sm sm:text-base text-[#888888]">My Role</span>
            <span className="text-sm sm:text-base text-white">{project.role}</span>
          </div>
        </div>

        {/* Hero Illustration */}
        <HeroIllustration color={project.heroColor} icon={project.icon} />

        {/* Case Study */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="mb-6 sm:mb-8 md:mb-10 text-3xl sm:text-4xl font-light">
            Case Study
          </h2>

          <div className="space-y-8 sm:space-y-10">
            <div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-normal">
                Objective
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#888888]">
                {project.caseStudy.objective}
              </p>
            </div>

            <div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-normal">
                Process
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#888888]">
                {project.caseStudy.process}
              </p>
            </div>

            <div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-normal">
                Outcome
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#888888]">
                {project.caseStudy.outcome}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Projects Link - Mobile Friendly */}
        <div className="mt-12 sm:mt-16 md:mt-20 pt-8 border-t border-[#333333]">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm sm:text-base text-[#888888] hover:text-white transition-colors"
          >
            <svg 
              className="size-4 sm:size-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>
    </main>
  );
}