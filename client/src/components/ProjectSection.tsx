import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import {
  Globe,
  Sparkles,
  BarChart3,
  PawPrint,
  Code2,
  Layout,
  Calendar,
  Users,
  Heart
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  sparkles: Sparkles,
  chart: BarChart3,
  paw: PawPrint,
  code: Code2,
  layout: Layout,
  calendar: Calendar,
  users: Users,
  heart: Heart,
};

interface ProjectCardProps {
  project: typeof projects[0];
}

function ProjectCard({ project }: ProjectCardProps) {
  const [_, setLocation] = useLocation();
  const Icon = iconMap[project.icon] || Code2;

  const handleClick = () => {
    setLocation(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex w-full flex-col md:flex-row items-start md:items-center rounded-3xl bg-[#1A1A1A]/75 p-4 transition-all duration-300 hover:bg-[#222222] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex w-full items-center gap-6">        
        {/* Text */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-medium font-serif text-white group-hover:text-gray-100 transition-colors">
              {project.name}
            </span>
            {project.type && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-[#888888] bg-white/5">
                {project.type}
              </span>
            )}
          </div>
          <span className="text-sm font-light text-[#888888] group-hover:text-[#999999] transition-colors line-clamp-2">
            {project.shortDescription}
          </span>

          {/* Skills tags - Desktop only usually, but good here if minimal */}
          <div className="flex flex-wrap gap-2 mt-2">
            {project.skills.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs text-[#666666] bg-[#111111] px-2 py-1 rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Arrow */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">
        <svg
          className="size-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export default function ProjectSection() {
  // Show top 5 projects for the main section
  const featuredProjects = projects.slice(0, 5);

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] font-sans selection:bg-white/20">
      {/* Grid Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2a2a2a 1px, transparent 1px),
            linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 md:px-12 py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          {/* Heading */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight text-white mb-6">
                Selected
                <br />
                <span className="text-[#888888]">Works</span>
              </h2>
              <p className="text-[#666666] text-lg max-w-sm mt-8 leading-relaxed">
                A collection of award-winning hackathon projects and professional work, focused on AI, functionality, and clean design.
              </p>
            </motion.div>
          </div>

          {/* Project Cards */}
          <div className="flex flex-col gap-6 w-full max-w-xl lg:ml-auto">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-4 text-center lg:text-left"
            >
              {/* If we had a full projects page, we'd link it here. For now just show top ones. */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}