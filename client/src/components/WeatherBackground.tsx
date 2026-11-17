import { useEffect, useRef, useState } from 'react';
import PixelSnow from './PixelSnow';
import { PixelClouds } from './PixelClouds';
import { SkyLife } from './SkyLife';
import { useWeather, type WeatherMode } from '@/contexts/WeatherContext';
import { LOCATION, moonName, moonPhase, type Scene } from '@/lib/weather';

const FADE_MS = 450;

const PRESETS: { mode: WeatherMode; label: string }[] = [
  { mode: 'live', label: 'Live' },
  { mode: 'snow', label: 'Snow' },
  { mode: 'rain', label: 'Rain' },
  { mode: 'storm', label: 'Storm' },
  { mode: 'fog', label: 'Fog' },
  { mode: 'cloudy', label: 'Cloudy' },
  { mode: 'clear-night', label: 'Night' },
  { mode: 'clear-day', label: 'Sun' },
];

const reducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

/** A jagged pixel bolt from the cloud base, with one fork. Coordinates in CSS px. */
function makeBolt(width: number, height: number): string[] {
  const step = 4;
  const snap = (v: number) => Math.round(v / step) * step;
  const walk = (x: number, y: number, endY: number, spread: number) => {
    const pts: string[] = [`${snap(x)},${snap(y)}`];
    while (y < endY) {
      y += step * (2 + Math.floor(Math.random() * 3));
      x += (Math.random() - 0.5) * spread;
      pts.push(`${snap(x)},${snap(y)}`);
    }
    return { pts, x, y };
  };
  const startX = width * (0.35 + Math.random() * 0.5);
  const main = walk(startX, height * 0.12, height * (0.42 + Math.random() * 0.18), 28);
  const forkAt = main.pts[Math.floor(main.pts.length * 0.45)].split(',').map(Number);
  const fork = walk(forkAt[0], forkAt[1], forkAt[1] + height * 0.12, 22);
  return [main.pts.join(' '), fork.pts.join(' ')];
}

/**
 * Full-viewport pixel weather driven by live Toronto conditions: a dithered sky with
 * drifting clouds, the real sun or moon, and the matching precipitation in front.
 * Sits behind the page (pointer-events: none); the particles still react to the cursor.
 */
export function WeatherBackground() {
  const { scene: target, paused } = useWeather();

  // Crossfade the particle layer between precipitation types; the sky eases on its own.
  const [scene, setScene] = useState<Scene>(target);
  const [shown, setShown] = useState(true);
  useEffect(() => {
    if (target.kind === scene.kind && target.snow?.variant === scene.snow?.variant) {
      setScene(target);
      return;
    }
    setShown(false);
    const id = window.setTimeout(() => {
      setScene(target);
      setShown(true);
    }, FADE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // Lightning: a bolt with a double-strike flash at irregular intervals.
  const [flash, setFlash] = useState(0);
  const [bolt, setBolt] = useState<string[] | null>(null);
  useEffect(() => {
    if (!target.lightning || paused || reducedMotion()) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const strike = () => {
      const visibleBolt = Math.random() < 0.7;
      if (visibleBolt) setBolt(makeBolt(window.innerWidth, window.innerHeight));
      setFlash(1);
      later(() => setFlash(0.2), 70);
      later(() => setFlash(0.85), 140);
      later(() => {
        setFlash(0);
        setBolt(null);
      }, 280);
      later(strike, 5000 + Math.random() * 9000);
    };
    later(strike, 1500 + Math.random() * 2500);
    return () => {
      timers.forEach(t => window.clearTimeout(t));
      setFlash(0);
      setBolt(null);
    };
  }, [target.lightning, paused]);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        {/* Back to front: sky, sun/moon and stars → planes, birds, meteors → clouds → weather. */}
        <div className="absolute inset-0 opacity-75 md:opacity-100">
          <PixelClouds part="sky" sky={target.sky} flash={0} paused={paused} />
        </div>
        <div className="absolute inset-0">
          <SkyLife life={target.life} cover={target.sky.cover} paused={paused} />
        </div>
        <div className="absolute inset-0 opacity-75 md:opacity-100">
          <PixelClouds part="clouds" sky={target.sky} flash={flash} paused={paused} />
        </div>
        {target.fog && <div className="weather-fog absolute inset-0" />}
        {scene.snow && (
          <div
            className="absolute inset-0"
            style={{ opacity: shown ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
          >
            <PixelSnow
              {...scene.snow}
              paused={paused}
              brightness={(scene.snow.brightness ?? 1) * (1 + flash * 1.2)}
              className="absolute inset-0"
            />
          </div>
        )}
        {bolt && (
          <svg className="absolute inset-0 h-full w-full" style={{ filter: 'drop-shadow(0 0 6px rgba(190,210,255,0.9))' }}>
            <polyline points={bolt[0]} fill="none" stroke="#eef3ff" strokeWidth={4} shapeRendering="crispEdges" />
            <polyline points={bolt[1]} fill="none" stroke="#cdd9ff" strokeWidth={2} shapeRendering="crispEdges" />
          </svg>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(120% 80% at 50% 0%, rgba(200,215,255,0.16), rgba(200,215,255,0.03) 70%)',
            opacity: flash,
          }}
        />
      </div>

      <WeatherControls />
    </>
  );
}

const compass = (deg: number) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

function WeatherControls() {
  const { scene, live, failed, mode, setMode, paused, setPaused } = useWeather();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isLive = mode === 'live';
  const status = isLive
    ? live
      ? `${LOCATION.name} · ${Math.round(live.temperature)}° · ${scene.label}`
      : failed
        ? `${LOCATION.name} · offline`
        : `${LOCATION.name} · reading the sky…`
    : `Preview · ${scene.label}`;

  return (
    <div ref={ref} className="fixed bottom-4 left-4 z-40 text-xs">
      {open && (
        <div
          role="menu"
          className="weather-menu mb-2 w-[17.5rem] rounded-2xl border border-white/10 bg-[#141417]/90 p-3 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          {live && (
            <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-2 border-b border-white/[0.08] pb-3 text-[#919191]">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[#666]">Wind</dt>
                <dd className="text-[#E2E2E2]">
                  {Math.round(live.windSpeed)} km/h {compass(live.windDirection)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[#666]">Gusts</dt>
                <dd className="text-[#E2E2E2]">{Math.round(live.windGusts)} km/h</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[#666]">Cloud</dt>
                <dd className="text-[#E2E2E2]">{Math.round(live.cloudCover)}%</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[#666]">Moon</dt>
                <dd className="text-[#E2E2E2]">{moonName(moonPhase())}</dd>
              </div>
            </dl>
          )}
          <div className="flex flex-wrap gap-1">
            {PRESETS.map(p => {
              const active = mode === p.mode;
              return (
                <button
                  key={p.mode}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setMode(p.mode);
                    setOpen(false);
                  }}
                  className={`weather-chip rounded-lg px-2.5 py-1 ${
                    active ? 'bg-white/15 text-[#E2E2E2]' : 'text-[#919191] hover:bg-white/[0.06] hover:text-[#E2E2E2]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          title="Change the weather"
          className="weather-pill flex h-8 items-center gap-2 rounded-full border border-white/10 bg-[#141417]/75 px-3 text-[#919191] backdrop-blur-md hover:border-white/20 hover:text-[#E2E2E2]"
        >
          <span className="relative flex h-1.5 w-1.5">
            {isLive && live && !paused && <span className="live-ring absolute inset-0 rounded-full bg-emerald-400" />}
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                isLive ? (live ? 'bg-emerald-400' : 'bg-[#555]') : 'bg-sky-300'
              }`}
            />
          </span>
          <span className="hidden font-light tracking-tight sm:inline">{status}</span>
          <span className="font-light tracking-tight sm:hidden">
            {isLive && live ? `${Math.round(live.temperature)}° · ${scene.label}` : scene.label}
          </span>
        </button>
        <button
          onClick={() => setPaused(!paused)}
          aria-label={paused ? 'Play weather animation' : 'Pause weather animation'}
          title={paused ? 'Play' : 'Pause'}
          className="weather-pill grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[#141417]/75 text-[#919191] backdrop-blur-md hover:border-white/20 hover:text-[#E2E2E2]"
        >
          {paused ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <path d="M2 1l7 4-7 4z" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <rect x="1.5" y="1" width="2.5" height="8" />
              <rect x="6" y="1" width="2.5" height="8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
