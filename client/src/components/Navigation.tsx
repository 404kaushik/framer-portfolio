import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { lockScroll } from '@/lib/smoothScroll';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Moon, Search, Sun } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useWeather } from '@/contexts/WeatherContext';
import { CommandMenu, EMAIL, SECTIONS, copyEmail, scrollToSection } from './CommandMenu';
import type { SceneKind } from '@/lib/weather';

const LINKS = SECTIONS.filter(s => s.id !== 'home');

const WEATHER_ICON: Record<SceneKind, typeof Cloud> = {
  snow: CloudSnow,
  rain: CloudRain,
  drizzle: CloudRain,
  storm: CloudLightning,
  fog: CloudFog,
  cloudy: Cloud,
  'clear-day': Sun,
  'clear-night': Moon,
};

const K_ROWS = ['#...#', '#..#.', '###..', '#..#.', '#...#'];
const K_PIXELS = K_ROWS.flatMap((row, y) =>
  row.split('').flatMap((c, x) => (c === '#' ? [{ x, y, i: x + y * 5 }] : [])),
);

/** A 5×5 pixel "K", tinted with today's weather. Pixels fly in on load and hop in a wave on hover. */
export function PixelMark({ color, size = 20, hop = false }: { color: string; size?: number; hop?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <svg width={size} height={size} viewBox="-1 -1 7 7" shapeRendering="crispEdges" aria-hidden="true" overflow="visible">
      {K_PIXELS.map(({ x, y, i }) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width="1"
          height="1"
          fill={color}
          style={{ transition: 'fill 600ms linear' }}
          initial={reduce ? false : { opacity: 0, x: ((i * 7) % 5) - 2, y: ((i * 3) % 5) - 2.5 }}
          animate={
            hop && !reduce
              ? { opacity: 1, x: 0, y: [0, -0.9, 0], transition: { duration: 0.32, delay: x * 0.045, ease: 'easeOut' } }
              : { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, delay: 0.15 + i * 0.018, ease: [0.22, 1, 0.36, 1] } }
          }
        />
      ))}
    </svg>
  );
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Navigation() {
  const { scene, live, mode } = useWeather();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [hovered, setHovered] = useState<string | null>(null);
  const [logoHover, setLogoHover] = useState(0);
  const reduce = useReducedMotion();

  // At the top the bar is part of the sky: no glass, full width, roomy. Scrolling condenses it into
  // the floating pill. A spring on the scroll value keeps the morph soft whichever way you go.
  const { scrollY, scrollYProgress } = useScroll();
  const raw = useTransform(scrollY, [0, 180], [0, 1], { clamp: true });
  const t = useSpring(raw, { stiffness: 220, damping: 32, mass: 0.6 });
  const vw = useMotionValue(typeof window === 'undefined' ? 1440 : window.innerWidth);
  useEffect(() => {
    const onResize = () => vw.set(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [vw]);
  const width = useTransform([t, vw] as const, ([k, w]: number[]) => {
    const full = w - (w >= 640 ? 48 : 24);
    return `${lerp(full, Math.min(w - 24, 1024), k)}px`;
  });
  const top = useTransform(t, k => `${lerp(10, 12, k)}px`);
  const height = useTransform(t, k => `${lerp(72, 56, k)}px`);
  const bg = useTransform(t, k => `rgba(20,20,23,${(0.72 * k).toFixed(3)})`);
  const border = useTransform(t, k => `rgba(255,255,255,${(0.09 * k).toFixed(3)})`);
  const blur = useTransform(t, k => `blur(${(20 * k).toFixed(1)}px) saturate(${(1 + 0.4 * k).toFixed(2)})`);
  const shadow = useTransform(
    t,
    k => `inset 0 1px 0 rgba(255,255,255,${(0.05 * k).toFixed(3)}), 0 10px 30px rgba(0,0,0,${(0.22 * k).toFixed(3)})`,
  );
  const padL = useTransform(t, k => `${lerp(8, 16, k)}px`);
  // The name slides out from behind the mark at the top and tucks away as the bar condenses.
  const nameW = useTransform(t, k => `${lerp(118, 0, Math.min(1, k * 1.6))}px`);
  const nameO = useTransform(t, k => 1 - Math.min(1, k * 2));
  const progressO = useTransform(t, [0.6, 1], [0, 1]);
  const springProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  // Which section is in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0, rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    lockScroll(menuOpen);
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  };

  const Icon = WEATHER_ICON[scene.kind];
  const temp = live && mode === 'live' ? `${Math.round(live.temperature)}°` : scene.label;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        {/* A soft band of sky behind the bar at the top, so the links read over bright clouds. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0e0e10]/55 to-transparent"
          style={{ opacity: nameO }}
        />
        <motion.div
          className="nav-bar pointer-events-auto relative mx-auto flex items-center gap-2 rounded-2xl border pr-2"
          style={
            reduce
              ? { width: 'min(calc(100% - 24px), 1024px)', top: 12, height: 56, background: 'rgba(20,20,23,0.72)', borderColor: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', paddingLeft: 16 }
              : { width, top, height, background: bg, borderColor: border, backdropFilter: blur, WebkitBackdropFilter: blur, boxShadow: shadow, paddingLeft: padL }
          }
        >
          <a
            href="#home"
            onClick={go('home')}
            onMouseEnter={() => setLogoHover(n => n + 1)}
            className="nav-logo group flex items-center gap-2.5 pr-2"
            aria-label="Kaushik Nag Tumu, back to top"
          >
            <PixelMark key={logoHover} color={scene.ramp[3]} hop={logoHover > 0} />
            <span className="text-[15px] tracking-tight text-[#E2E2E2]">kaushik</span>
            {!reduce && (
              <motion.span
                className="-ml-1 hidden overflow-hidden whitespace-nowrap text-[15px] tracking-tight text-[#8a8a8a] sm:block"
                style={{ width: nameW, opacity: nameO }}
              >
                &nbsp;nag tumu
              </motion.span>
            )}
          </a>

          <nav
            aria-label="Sections"
            className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {LINKS.map(link => {
              const on = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  onMouseEnter={() => setHovered(link.id)}
                  onFocus={() => setHovered(link.id)}
                  aria-current={on ? 'true' : undefined}
                  className={`nav-link relative px-2.5 py-2 text-[13px] ${on ? 'text-[#f2f2f2]' : 'text-[#8a8a8a]'}`}
                >
                  {/* A soft pill glides between links under the pointer. */}
                  {hovered === link.id && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-lg bg-white/[0.06]"
                      transition={{ type: 'spring', stiffness: 520, damping: 40, mass: 0.6 }}
                    />
                  )}
                  <span className="nav-link__word relative">{link.label}</span>
                  {on && (
                    <motion.span
                      layoutId="nav-current"
                      className="absolute inset-x-2.5 -bottom-[3px] h-[2px] rounded-full"
                      style={{ background: scene.ramp[4] }}
                      transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setPaletteOpen(true)}
              className="nav-chip hidden h-9 items-center gap-1.5 rounded-xl px-2.5 text-[13px] text-[#a3a3a3] sm:flex"
              title={live ? `Toronto · ${scene.label}` : 'Weather'}
              aria-label={`Weather: ${scene.label}. Open command menu`}
            >
              <Icon className="h-4 w-4" style={{ color: scene.ramp[4] }} aria-hidden="true" />
              <span className="tabular-nums">{temp}</span>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="nav-chip hidden h-9 items-center gap-2 rounded-xl border border-white/[0.08] px-2.5 text-[13px] text-[#8a8a8a] md:flex"
              aria-label="Open command menu"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Search</span>
              <kbd className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[#a3a3a3]">⌘K</kbd>
            </button>
            <a
              href="#contact"
              onClick={go('contact')}
              className="gh-btn hidden h-9 items-center rounded-xl bg-[#E2E2E2] px-3.5 text-[13px] text-[#0e0e10] hover:bg-white sm:inline-flex"
            >
              Get in touch
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="nav-chip grid h-9 w-10 place-items-center rounded-xl lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`nav-burger top-0 ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`nav-burger bottom-0 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
          {/* Reading progress, in today's weather colours, once the bar has formed. */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 -bottom-px h-px origin-left"
            style={{
              scaleX: springProgress,
              opacity: reduce ? 1 : progressO,
              background: `linear-gradient(90deg, transparent, ${scene.ramp[3]}, ${scene.ramp[4]})`,
            }}
          />
        </motion.div>
      </header>

      {/* Full-screen menu on phones and tablets */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#0e0e10]/95 px-6 pb-8 pt-24 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Sections" className="flex flex-1 flex-col">
              {LINKS.map(link => {
                const on = active === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    className={`flex items-center justify-between border-b border-white/[0.06] py-4 text-3xl tracking-tight transition-colors ${
                      on ? 'text-[#f2f2f2]' : 'text-[#6b6b6b] active:text-[#E2E2E2]'
                    }`}
                  >
                    {link.label}
                    {on && <span className="h-1.5 w-1.5 rounded-full bg-[#E2E2E2]" />}
                  </a>
                );
              })}
            </nav>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  copyEmail();
                }}
                className="gh-btn h-12 w-full rounded-xl bg-[#E2E2E2] text-[15px] text-[#0e0e10]"
              >
                Copy {EMAIL}
              </button>
              <div className="flex items-center justify-between text-sm text-[#8a8a8a]">
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: scene.ramp[4] }} aria-hidden="true" />
                  Toronto · {temp}
                </span>
                <span className="flex gap-4">
                  <a href="https://github.com/404kaushik" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <FaGithub className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/kaushiknagtumu" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <FaLinkedin className="h-5 w-5 text-[#0a66c2]" />
                  </a>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandMenu open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
