import React, { useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function ProjectPage() {
  const [match, params] = useRoute("/projects/:slug");
  const slug = match ? params.slug : null;

  // Find project by slug
  const project = projects.find(p => p.slug === slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white px-4">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-light">Project Not Found</h1>
          <Link href="/">
            <a className="text-[#888888] hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="size-4" /> Go back home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[project.icon] || Code2;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white/20">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 pointer-events-none">
        <div className="flex justify-between items-center max-w-7xl mx-auto pointer-events-auto">
          <Link href="/">
            <a className="group flex items-center gap-2 text-sm text-[#888888] hover:text-white transition-colors bg-[#1A1A1A]/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 hover:border-white/10 cursor-pointer">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Back
            </a>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-12 pt-32 pb-20 max-w-5xl">

        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium tracking-wider uppercase text-[#888888]">
              {project.year}
            </span>
            <span className="size-1 rounded-full bg-[#333333]" />
            <span className="text-sm font-medium tracking-wider uppercase text-[#888888]">
              {project.type}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-8">
            {project.name}
          </h1>

          <p className="text-xl md:text-2xl text-[#A1A1A1] font-light leading-relaxed max-w-2xl">
            {project.fullDescription}
          </p>
        </motion.div>

        {/* Links & Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-16"
        >
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              View Live <ExternalLink className="size-4" />
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#222] text-white border border-white/10 rounded-full font-medium hover:bg-[#333] transition-colors"
            >
              <Github className="size-4" /> Source Code
            </a>
          )}
        </motion.div>

        {/* Visual Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-16 flex items-center justify-center bg-[#0A0A0A]"
          style={!project.heroVideo ? { backgroundColor: project.heroColor + '20' } : undefined}
        >
          {project.heroVideo ? (
            <iframe
              className="absolute inset-0 w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${getYouTubeId(project.heroVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(project.heroVideo)}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={`${project.name} video`}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]/80 z-10" />

              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 blur-3xl rounded-full mix-blend-overlay" />
              </div>

              {/* Central Hero Icon */}
              <div className="relative z-20 flex flex-col items-center gap-6">
                <div
                  className="size-24 md:size-32 rounded-3xl flex items-center justify-center shadow-2xl"
                  style={{ backgroundColor: project.heroColor }}
                >
                  <Icon className="size-12 md:size-16 text-white drop-shadow-md" />
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-24 border-t border-white/10 pt-16">
          <div className="md:col-span-1 space-y-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-[#666] mb-4">Role</h3>
              <p className="text-lg text-white">{project.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-[#666] mb-4">Timeline</h3>
              <p className="text-lg text-white">{project.year}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-12">
              <h3 className="text-sm font-medium uppercase tracking-wider text-[#666] mb-6">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-lg bg-[#1A1A1A] border border-white/5 text-[#CCC] text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-[#666] mb-6">About the Project</h3>
              <div className="prose prose-invert prose-lg max-w-none text-[#A1A1A1]">
                <p>{project.fullDescription}</p>
                <p className="mt-4">
                  This project demonstrates a focus on {project.skills.slice(0, 3).join(', ')}, aiming to solve real-world problems through clean, efficient code and intuitive user interfaces.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}