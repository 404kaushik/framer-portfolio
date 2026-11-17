import type { IconType } from 'react-icons';
import {
  SiCss3,
  SiFlask,
  SiFramer,
  SiGooglegemini,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPerplexity,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si';

/** Real brand marks in their own colours (lightened where the brand is black, for the dark page). */
const TECH: Record<string, { icon: IconType; color: string }> = {
  'Next.js': { icon: SiNextdotjs, color: '#ffffff' },
  React: { icon: SiReact, color: '#61dafb' },
  'React.js': { icon: SiReact, color: '#61dafb' },
  TypeScript: { icon: SiTypescript, color: '#3178c6' },
  JavaScript: { icon: SiJavascript, color: '#f7df1e' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#38bdf8' },
  MongoDB: { icon: SiMongodb, color: '#47a248' },
  Python: { icon: SiPython, color: '#4b8bbe' },
  Flask: { icon: SiFlask, color: '#e2e2e2' },
  'Node.js': { icon: SiNodedotjs, color: '#5fa04e' },
  Supabase: { icon: SiSupabase, color: '#3ecf8e' },
  'Perplexity API': { icon: SiPerplexity, color: '#20b8cd' },
  'Gemini API': { icon: SiGooglegemini, color: '#4796e3' },
  'Framer Motion': { icon: SiFramer, color: '#e2e2e2' },
  'Three.js': { icon: SiThreedotjs, color: '#e2e2e2' },
  PostgreSQL: { icon: SiPostgresql, color: '#6b9bd1' },
  CSS: { icon: SiCss3, color: '#2965f1' },
};

export function TechChip({ name }: { name: string }) {
  const tech = TECH[name];
  const Icon = tech?.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-xs text-[#a3a3a3]">
      {Icon && <Icon className="h-3 w-3 shrink-0" style={{ color: tech.color }} aria-hidden="true" />}
      {name}
    </span>
  );
}
