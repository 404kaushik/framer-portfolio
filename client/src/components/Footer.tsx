import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUp, Copy, Moon, Sunrise, Sunset } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useWeather } from '@/contexts/WeatherContext';
import { fetchGitHub, relativeTime, type Repo } from '@/lib/github';
import { scrollToY } from '@/lib/smoothScroll';
import { EMAIL, SECTIONS, copyEmail, scrollToSection } from './CommandMenu';
import { PixelMark } from './Navigation';
import { Skyline, TOWER_COLOURS } from './Skyline';
import { takeoff } from './SkyLife';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/404kaushik', icon: FaGithub, color: '#f2f2f2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kaushiknagtumu', icon: FaLinkedin, color: '#0a66c2' },
  { label: 'Instagram', href: 'https://www.instagram.com/kaushiknag', icon: FaInstagram, color: '#e1306c' },
];

const WORD = 'KAUSHIK'.split('');

const torontoTime = (d: Date) =>
  d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' });

function useNow(ms = 15_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

/** One letter of the wordmark: rises with the scroll, a beat after its neighbour; hops on hover. */
function Letter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0.25 + i * 0.03, 0.75 + i * 0.03], ['70%', '0%']);
  return (
    <motion.span className="inline-block" style={{ y }}>
      <span className="footer-letter inline-block">{ch}</span>
    </motion.span>
  );
}

export function Footer() {
  const { scene, live, paused } = useWeather();
  const reduce = useReducedMotion();
  const now = useNow();
  const night = scene.life.lights === 'night';
  const [tower, setTower] = useState(0);
  const [repo, setRepo] = useState<Repo | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetchGitHub(ac.signal)
      .then(d => setRepo(d.repos[0] ?? null))
      .catch(() => {});
    return () => ac.abort();
  }, []);

  // Depth as the footer comes up: the far city rises slower than the near one, the name slowest.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const farY = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);
  const nearY = useTransform(scrollYProgress, [0, 1], ['18%', '0%']);

  const nextSun = live
    ? now.getTime() < live.sunrise
      ? { icon: Sunrise, label: 'Sunrise', at: live.sunrise }
      : now.getTime() < live.sunset
        ? { icon: Sunset, label: 'Sunset', at: live.sunset }
        : { icon: Sunrise, label: 'Sunrise', at: live.sunrise + 86_400_000 }
    : null;

  const backToTop = () => {
    takeoff();
    scrollToY(0, 2.2);
  };

  return (
    <footer ref={ref} className="relative mt-8 overflow-hidden" aria-labelledby="footer-title">
      {/* City glow on the horizon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] transition-[background] duration-1000"
        style={{
          background: night
            ? 'linear-gradient(to bottom, transparent, rgba(255,160,90,0.07) 60%, rgba(255,170,100,0.12))'
            : 'linear-gradient(to bottom, transparent, rgba(150,185,230,0.07) 60%, rgba(150,185,230,0.12))',
        }}
      />

      <div className="site-wrap relative z-20 pt-20 md:pt-28">
        <h2 id="footer-title" className="sr-only">
          Site footer
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-8">
          {/* Who */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-3">
              <PixelMark color={scene.ramp[3]} size={28} />
              <span className="text-xl tracking-tight text-[#E2E2E2]">Kaushik Nag Tumu</span>
            </div>
            <p className="mt-4 max-w-sm text-[15px] leading-6 text-[#9a9a9a]">
              Software and data engineer in Toronto, building web apps, data pipelines and the sky behind this page.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={copyEmail}
                className="gh-btn inline-flex h-10 items-center gap-2 rounded-xl bg-[#E2E2E2] px-4 text-sm text-[#0e0e10] hover:bg-white"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy email
              </button>
              <a
                href={`mailto:${EMAIL}`}
                className="gh-btn inline-flex h-10 items-center rounded-xl border border-white/10 px-4 text-sm text-[#E2E2E2] hover:border-white/25 hover:bg-white/[0.04]"
              >
                Send an email
              </a>
            </div>
          </div>

          {/* Where */}
          <nav aria-label="Footer" className="md:col-span-2">
            <p className="footer-head">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {SECTIONS.filter(s => s.id !== 'contact').map(s => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={e => {
                      e.preventDefault();
                      scrollToSection(s.id);
                    }}
                    className="footer-link text-sm"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="footer-head">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {SOCIALS.map(s => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="footer-link group inline-flex items-center gap-2 text-sm">
                    <s.icon className="h-4 w-4 shrink-0" style={{ color: s.color }} aria-hidden="true" />
                    {s.label}
                    <span className="footer-link__arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* When: live, from the same sources as the sky and the graph */}
          <div className="col-span-2 md:col-span-3">
            <p className="footer-head">Right now in Toronto</p>
            <p className="mt-4 text-3xl tabular-nums tracking-tight text-[#E2E2E2]">{torontoTime(now)}</p>
            <ul className="mt-3 space-y-2 text-sm text-[#9a9a9a]">
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-[1px]" style={{ background: scene.ramp[4] }} aria-hidden="true" />
                {live ? `${Math.round(live.temperature)}° · ${scene.label}` : scene.label}
              </li>
              {nextSun && (
                <li className="flex items-center gap-2">
                  <nextSun.icon className="h-4 w-4 text-[#7a7a7a]" aria-hidden="true" />
                  {nextSun.label} {torontoTime(new Date(nextSun.at))}
                </li>
              )}
              {night && (
                <li className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-[#7a7a7a]" aria-hidden="true" />
                  Tap the CN Tower to change its lights
                </li>
              )}
              {repo && (
                <li className="flex items-center gap-2">
                  <FaGithub className="h-4 w-4 shrink-0 text-[#7a7a7a]" aria-hidden="true" />
                  <span className="truncate">
                    Pushed to{' '}
                    <a href={repo.url} target="_blank" rel="noreferrer" className="footer-link text-[#cfcfcf]">
                      {repo.name}
                    </a>{' '}
                    {relativeTime(repo.pushedAt)}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* The name, rising from behind the city */}
      <div className="relative z-0 mt-12 h-[clamp(15rem,32vw,26rem)] md:mt-16">
        <p
          aria-hidden="true"
          className="footer-word absolute inset-x-0 top-0 flex select-none justify-center overflow-hidden leading-[0.8] tracking-[-0.06em]"
          style={{ ['--word-a' as string]: scene.ramp[4], ['--word-b' as string]: scene.ramp[2] }}
        >
          {WORD.map((ch, i) =>
            reduce ? (
              <span key={i} className="footer-letter inline-block">
                {ch}
              </span>
            ) : (
              <Letter key={i} ch={ch} i={i} progress={scrollYProgress} />
            ),
          )}
        </p>

        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]" style={{ y: reduce ? 0 : farY }}>
          <Skyline layer="far" night={night} paused={paused} towerColour={TOWER_COLOURS[tower]} />
        </motion.div>
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%]" style={{ y: reduce ? 0 : nearY }}>
          <Skyline
            layer="near"
            night={night}
            paused={paused}
            towerColour={TOWER_COLOURS[tower]}
            onTower={() => setTower(t => (t + 1) % TOWER_COLOURS.length)}
          />
        </motion.div>
      </div>

      {/* The ground */}
      <div className="relative z-20 bg-[#07080c]">
        <div className="site-wrap flex flex-col gap-4 py-6 text-xs text-[#7a7a7a] sm:flex-row sm:items-center sm:justify-between">
          <span>© {now.getFullYear()} Kaushik Nag Tumu</span>
          <span>Live weather from Open-Meteo · Contributions from GitHub</span>
          <button onClick={backToTop} className="footer-top group inline-flex items-center gap-2 self-start text-[#cfcfcf] sm:self-auto">
            Back to top
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 transition-colors group-hover:border-white/25">
              <ArrowUp className="footer-top__arrow h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
