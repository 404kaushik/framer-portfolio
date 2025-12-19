import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const projects = [
  {
    name: "Shelf",
    description: "Digital Library for Developers",
    icon: "dots",
    slug: "shelf",
  },
  {
    name: "Locale",
    description: "Lightweight Content Localization",
    icon: "asterisk",
    slug: "locale",
  },
  {
    name: "Taskly",
    description: "Minimal Task Manager",
    icon: "layers",
    slug: "taskly",
  },
];

function DotsIcon() {
  return (
    <div className="grid grid-cols-4 gap-1">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`size-1.5 rounded-full ${
            [0, 1, 2, 3, 5, 6, 8, 9, 10, 11].includes(i) ? "bg-white" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function AsteriskIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none">
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

interface ProjectCardProps {
  project: typeof projects[0];
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.slug}`);
  };

  return (
    <div
      className="group relative flex h-[88px] w-full items-center rounded-2xl border border-[#333333] bg-[#222222]/80 backdrop-blur-sm transition-all duration-300 hover:border-[#444444] cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Default State - Text and Icon */}
      <div
        className={`flex w-full items-center gap-4 px-5 py-4 transition-transform duration-300 ${
          isHovered ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Icon Container */}
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a]">
          {project.icon === "dots" && <DotsIcon />}
          {project.icon === "asterisk" && <AsteriskIcon />}
          {project.icon === "layers" && <LayersIcon />}
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-lg font-normal text-white">{project.name}</span>
          <span className="text-sm text-[#888888]">{project.description}</span>
        </div>
      </div>

      {/* Hover State - View Button and Icon */}
      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-between px-5 py-4 transition-transform duration-300 ${
          isHovered ? "translate-x-0" : "translate-x-80"
        }`}
      >
        {/* View Button */}
        <div className="flex items-center gap-2 rounded-xl bg-[#1a1a1a] px-6 py-4">
          <span className="text-base font-normal text-white">View</span>
          <span className="text-white">→</span>
        </div>

        {/* Icon Container */}
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a]">
          {project.icon === "dots" && <DotsIcon />}
          {project.icon === "asterisk" && <AsteriskIcon />}
          {project.icon === "layers" && <LayersIcon />}
        </div>
      </div>
    </div>
  );
}

export default function ProjectSection() {
  return (
    <section className="relative flex items-center min-h-screen bg-[#161616] font-light">
      {/* Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 mt-4 md:mt-12"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2a2a2a 1px, transparent 1px),
            linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-2xl">
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
          {/* Heading */}
          <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-white">Projects</h2>
          {/* Project Cards */}
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}