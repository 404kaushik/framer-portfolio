import React, { useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
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
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const [_, setLocation] = useLocation();
  const Icon = iconMap[project.icon] || Code2;
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const handleClick = () => {
    setLocation(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex w-full flex-col md:flex-row items-start md:items-center rounded-3xl bg-[#1A1A1A]/75 p-4 transition-colors duration-300 hover:bg-[#222222] cursor-pointer"
      style={{ willChange: "transform, opacity" }}
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
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.08 + 0.3 }}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-[#888888] bg-white/5"
              >
                {project.type}
              </motion.span>
            )}
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 + 0.2 }}
            className="text-sm font-light text-[#888888] group-hover:text-[#999999] transition-colors line-clamp-2"
          >
            {project.shortDescription}
          </motion.span>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {project.skills.slice(0, 3).map((skill, skillIndex) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.08 + 0.35 + skillIndex * 0.06,
                }}
                className="text-xs text-[#666666] bg-[#111111] px-2 py-1 rounded-md"
              >
                {skill}
              </motion.span>
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
  const featuredProjects = projects;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  // Parallax for the grid background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const smoothGridY = useSpring(gridY, { stiffness: 80, damping: 30 });

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen bg-[#0A0A0A] font-sans selection:bg-white/20"
    >
      {/* Grid Background with parallax (overflow clipped independently) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            y: smoothGridY,
            backgroundImage: `
              linear-gradient(to right, #2a2a2a 1px, transparent 1px),
              linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-12 py-24 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          {/* Heading */}
          <div className="lg:sticky lg:top-24" ref={headingRef}>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight text-white mb-6"
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={headingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="inline-block"
                >
                  Selected
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={headingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                  className="text-[#888888] inline-block"
                >
                  Works
                </motion.span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="text-[#666666] text-lg max-w-sm mt-8 leading-relaxed"
              >
                A collection of award-winning hackathon projects and professional work, focused on AI, functionality, and clean design.
              </motion.p>
            </div>
          </div>

          {/* Project Cards */}
          <div ref={cardsRef} className="flex flex-col gap-6 w-full max-w-xl lg:ml-auto">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}