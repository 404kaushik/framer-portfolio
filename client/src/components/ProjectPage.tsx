import React, { useEffect, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
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
  Heart,
  ArrowLeft,
  Github,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Stagger wrapper for scroll-triggered sections
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectPage() {
  const [match, params] = useRoute('/projects/:slug');
  const slug = match ? params.slug : null;

  const project = projects.find((p) => p.slug === slug);

  // Find next project for navigation
  const nextProject = useMemo(() => {
    if (!project) return null;
    const idx = projects.findIndex((p) => p.slug === project.slug);
    return projects[(idx + 1) % projects.length];
  }, [project]);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white px-4">
        <div className="text-center">
          <p className="text-white/20 text-sm tracking-wide mb-4">404</p>
          <h1 className="mb-6 text-2xl font-light text-white/80">
            Project not found
          </h1>
          <Link href="/">
            <a className="text-white/30 hover:text-white/70 transition-colors text-sm inline-flex items-center gap-2">
              <ArrowLeft className="size-3.5" /> Back home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[project.icon] || Code2;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white/20 relative overflow-hidden">
      {/* ─── Ambient background ─── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {/* Primary orb — uses the project color */}
        <div
          className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full blur-[160px] sm:blur-[200px] opacity-[0.04] animate-drift-1"
          style={{ background: project.heroColor, top: '-10%', right: '-15%' }}
        />
        {/* Secondary orb — complementary position */}
        <div
          className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[140px] sm:blur-[180px] opacity-[0.03] animate-drift-2"
          style={{ background: project.heroColor, bottom: '5%', left: '-20%' }}
        />
        {/* Faint grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ─── Scroll progress line ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px z-50 origin-left"
        style={{
          scaleX: scrollYProgress,
          background: `linear-gradient(90deg, ${project.heroColor}40, ${project.heroColor}90)`,
        }}
      />

      {/* ─── Back navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-5 pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <Link href="/">
            <a className="group inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/70 transition-colors duration-300">
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </a>
          </Link>
        </div>
      </nav>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 md:px-12 pt-28 sm:pt-36 pb-16 sm:pb-24">
        {/* Header */}
        <header className="mb-14 sm:mb-20">
          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs tracking-[0.15em] uppercase text-white/25">
              {project.year}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[11px] sm:text-xs tracking-[0.15em] uppercase text-white/25">
              {project.type}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white/95 mb-6 sm:mb-8 leading-[1.08]"
          >
            {project.name}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-base sm:text-lg md:text-xl text-white/35 font-light leading-relaxed max-w-2xl"
          >
            {project.fullDescription}
          </motion.p>

          {/* Action links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10"
          >
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/8 hover:bg-white/[0.14] text-white/80 hover:text-white text-sm font-light rounded-lg transition-all duration-300"
              >
                View Live
                <ExternalLink className="size-3.5 opacity-50 group-hover:opacity-80 transition-opacity" />
              </a>
            )}
            {project.links?.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-white/70 text-sm font-light transition-colors duration-300"
              >
                <Github className="size-3.5" />
                Source
              </a>
            )}
          </motion.div>
        </header>

        {/* ─── Hero visual ─── */}
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="mb-20 sm:mb-28"
        >
          <Reveal>
            <div
              className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden"
              style={
                !project.heroVideo
                  ? { backgroundColor: project.heroColor + '12' }
                  : undefined
              }
            >
              {project.heroVideo ? (
                <iframe
                  className="absolute inset-0 w-full h-full shadow-2xl shadow-white"
                  src={`https://www.youtube.com/embed/${getYouTubeId(project.heroVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(project.heroVideo)}&controls=0&showinfo=0&modestbranding=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={`${project.name} demo`}
                />
              ) : (
                <>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0A0A0A]/60 z-10" />

                  {/* Soft radial glow */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full blur-[100px] opacity-20"
                    style={{ background: project.heroColor }}
                  />

                  {/* Icon */}
                  <div className="relative z-20 flex items-center justify-center h-full">
                    <div
                      className="size-20 sm:size-24 md:size-28 rounded-2xl sm:rounded-3xl flex items-center justify-center"
                      style={{
                        backgroundColor: project.heroColor + '20',
                        boxShadow: `0 0 80px ${project.heroColor}15`,
                      }}
                    >
                      <Icon className="size-10 sm:size-12 md:size-14 text-white/70" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </motion.div>

        {/* ─── Details ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 sm:gap-y-16 gap-x-8 md:gap-x-16">
          {/* Role */}
          <Reveal delay={0}>
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-white/20 mb-3">
                Role
              </h3>
              <p className="text-base sm:text-lg text-white/70 font-light">
                {project.role}
              </p>
            </div>
          </Reveal>

          {/* Timeline */}
          <Reveal delay={0.05}>
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-white/20 mb-3">
                Timeline
              </h3>
              <p className="text-base sm:text-lg text-white/70 font-light">
                {project.year}
              </p>
            </div>
          </Reveal>

          {/* Type */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-white/20 mb-3">
                Category
              </h3>
              <p className="text-base sm:text-lg text-white/70 font-light">
                {project.type}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Divider */}
        <Reveal className="my-14 sm:my-20">
          <div className="h-px bg-white/6" />
        </Reveal>

        {/* Technologies */}
        <Reveal>
          <div className="mb-14 sm:mb-20">
            <h3 className="text-[11px] tracking-[0.15em] uppercase text-white/20 mb-6">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="px-3.5 py-1.5 rounded-md bg-white/4 text-white text-[13px] font-light"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* About */}
        <Reveal>
          <div className="max-w-2xl mb-20 sm:mb-28">
            <h3 className="text-[11px] tracking-[0.15em] uppercase text-white/20 mb-6">
              About
            </h3>
            <div className="space-y-5 text-base sm:text-lg text-white font-light leading-relaxed">
              <p>{project.fullDescription}</p>
              <p>
                This project demonstrates expertise in{' '}
                {project.skills.slice(0, 3).join(', ')}, solving real-world
                problems through clean, efficient code and thoughtful design.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ─── Next project ─── */}
        {nextProject && (
          <Reveal>
            <div className="border-t border-white/6 pt-14 sm:pt-20">
              <p className="text-[11px] tracking-[0.15em] uppercase text-white/15 mb-6">
                Next project
              </p>
              <Link href={`/projects/${nextProject.slug}`}>
                <a className="group flex items-center justify-between gap-4">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-light text-white/50 group-hover:text-white/90 transition-colors duration-500 tracking-tight">
                    {nextProject.name}
                  </span>
                  <ArrowRight className="size-5 sm:size-6 text-white/15 group-hover:text-white/50 group-hover:translate-x-2 transition-all duration-500 shrink-0" />
                </a>
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
