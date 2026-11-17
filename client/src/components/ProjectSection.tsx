import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { projects } from '../data/projects';
import { TechChip } from '@/lib/tech';

type Project = (typeof projects)[number] & { award?: string };

/** Real captures of the projects (Devpost galleries, demo videos, live sites). */
const IMAGES = new Set(['sdglearn', 'timetable-sweetie', 'mydog8it', 'supernova', 'finvision', 'gift-for-gf']);
// Poster colours that stay clear of violet (the page's palette rule).
const POSTER: Record<string, string> = { tbsa: '#2d6aa6' };

const imageFor = (slug: string) => (IMAGES.has(slug) ? `/images/projects/${slug}.webp` : null);

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'wins', label: 'Award winners', test: (p: Project) => p.type === 'Hackathon Winner' },
  { id: 'hack', label: 'Hackathons', test: (p: Project) => p.type.startsWith('Hackathon') },
  { id: 'client', label: 'Client & community', test: (p: Project) => !p.type.startsWith('Hackathon') },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const all = projects as Project[];
const wins = all.filter(p => p.type === 'Hackathon Winner').length;
const years = all.map(p => Number(p.year));
const span = `${Math.min(...years)}–${Math.max(...years)}`;

export default function ProjectSection() {
  const [filter, setFilter] = useState<FilterId>('all');
  const list = useMemo(() => all.filter(FILTERS.find(f => f.id === filter)!.test), [filter]);
  const [activeSlug, setActiveSlug] = useState(all[0].slug);
  const active = list.find(p => p.slug === activeSlug) ?? list[0];
  const rowsRef = useRef<HTMLDivElement>(null);

  // Arrow keys walk the list; focus moves the preview with it.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const rows = Array.from(rowsRef.current?.querySelectorAll<HTMLAnchorElement>('[data-row]') ?? []);
    const i = rows.indexOf(document.activeElement as HTMLAnchorElement);
    const next = rows[Math.max(0, Math.min(rows.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  return (
    <section id="projects" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Heading row */}
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl tracking-tight text-[#E2E2E2] sm:text-5xl md:text-6xl">Selected work</h2>
            <p className="mt-4 text-sm text-[#919191]">
              {all.length} projects · {wins} hackathon wins · {span}
            </p>
          </div>
          <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-1 rounded-2xl border border-white/[0.06] bg-[#141417]/70 p-1 text-xs backdrop-blur-md">
            {FILTERS.map(f => {
              const count = all.filter(f.test).length;
              const on = f.id === filter;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f.id)}
                  className={`gh-tab relative rounded-xl px-3 py-2 transition-colors duration-200 ${
                    on ? 'text-[#0e0e10]' : 'text-[#919191] hover:text-[#E2E2E2]'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="work-filter"
                      className="absolute inset-0 rounded-xl bg-[#E2E2E2]"
                      transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                    />
                  )}
                  <span className="relative">
                    {f.label} <span className={on ? 'text-[#0e0e10]/50' : 'text-[#5c5c5c]'}>{count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop: index list + live preview */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-12">
          <div ref={rowsRef} onKeyDown={onKeyDown} className="col-span-7 border-t border-white/[0.08]">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Row project={p} index={i} active={p.slug === active?.slug} onActivate={() => setActiveSlug(p.slug)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="col-span-5">
            <div className="sticky top-28">{active && <Preview project={active} />}</div>
          </div>
        </div>

        {/* Phones and tablets: one card per project */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {list.map(p => (
            <MobileCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({
  project,
  index,
  active,
  onActivate,
}: {
  project: Project;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-row
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`work-row group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-white/[0.08] px-3 py-5 ${
        active ? 'work-row--on' : ''
      }`}
    >
      <span className="font-mono text-xs tabular-nums text-[#5c5c5c]">{String(index + 1).padStart(2, '0')}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-3">
          <span className="work-row__name truncate text-2xl tracking-tight">{project.name}</span>
          {project.award && <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-label="Award winner" />}
        </span>
        <span className="mt-1 block truncate text-sm text-[#7a7a7a]">{project.type}</span>
      </span>
      <span className="flex items-center gap-4">
        <span className="text-sm tabular-nums text-[#7a7a7a]">{project.year}</span>
        <svg className="work-row__arrow h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}

function Visual({ project, sizes }: { project: Project; sizes?: string }) {
  const src = imageFor(project.slug);
  if (src) {
    return (
      <img
        src={src}
        alt={`${project.name} screenshot`}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        className="work-frame__img h-full w-full object-cover"
      />
    );
  }
  // No capture yet: a type-set poster in the project's own colour.
  return (
    <div
      className="work-poster flex h-full w-full items-end p-6"
      style={{ ['--poster' as string]: POSTER[project.slug] ?? project.heroColor ?? '#3a3f4a' }}
    >
      <span className="text-4xl leading-none tracking-tight text-white/90">{project.name}</span>
    </div>
  );
}

function Links({ project }: { project: Project }) {
  const demo = project.links?.demo;
  const repo = project.links?.repo;
  const demoLabel = demo?.includes('youtu') ? 'Watch demo' : 'Visit live site';
  const repoLabel = repo?.includes('devpost') ? 'Devpost' : repo?.includes('youtu') ? 'Watch demo' : 'Source';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/projects/${project.slug}`}
        className="gh-btn inline-flex h-9 items-center gap-2 rounded-full bg-[#E2E2E2] px-4 text-sm text-[#0e0e10] hover:bg-white"
      >
        Read case study
      </Link>
      {demo && (
        <a href={demo} target="_blank" rel="noreferrer" className="gh-btn inline-flex h-9 items-center rounded-full border border-white/10 px-4 text-sm text-[#E2E2E2] hover:border-white/25 hover:bg-white/[0.04]">
          {demoLabel}
        </a>
      )}
      {repo && repo !== demo && (
        <a href={repo} target="_blank" rel="noreferrer" className="gh-btn inline-flex h-9 items-center rounded-full border border-white/10 px-4 text-sm text-[#E2E2E2] hover:border-white/25 hover:bg-white/[0.04]">
          {repoLabel}
        </a>
      )}
    </div>
  );
}

function Preview({ project }: { project: Project }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#18181b]/85 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
      <Link href={`/projects/${project.slug}`} className="work-frame block aspect-[16/10] overflow-hidden rounded-[18px] bg-[#0e0e10]" tabIndex={-1} aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Visual project={project} sizes="420px" />
          </motion.div>
        </AnimatePresence>
      </Link>
      <div className="px-4 pb-4 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl tracking-tight text-[#E2E2E2]">{project.name}</h3>
          <span className="text-xs text-[#7a7a7a]">{project.role}</span>
        </div>
        {project.award && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
            <Trophy className="h-3 w-3" aria-hidden="true" />
            {project.award}
          </p>
        )}
        <p className="mt-3 text-[15px] leading-6 text-[#b5b5b5]">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.skills.slice(0, 4).map(s => (
            <TechChip key={s} name={s} />
          ))}
        </div>
        <div className="mt-5">
          <Links project={project} />
        </div>
      </div>
    </div>
  );
}

function MobileCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="lift-card group flex flex-col rounded-3xl border border-white/[0.08] bg-[#18181b]/85 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md"
    >
      <div className="work-frame aspect-[16/10] overflow-hidden rounded-[18px] bg-[#0e0e10]">
        <Visual project={project} sizes="(min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="px-3 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-lg tracking-tight text-[#E2E2E2]">
            {project.name}
            {project.award && <Trophy className="h-3.5 w-3.5 text-amber-400" aria-label="Award winner" />}
          </span>
          <span className="text-xs tabular-nums text-[#7a7a7a]">{project.year}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#a3a3a3]">{project.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.skills.slice(0, 3).map(s => (
            <TechChip key={s} name={s} />
          ))}
        </div>
      </div>
    </Link>
  );
}
