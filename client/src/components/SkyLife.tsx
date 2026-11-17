import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { SkyLife as Life } from '@/lib/weather';

/** CSS pixels per sky pixel: the same grid as the clouds. */
const PX = 4;

// Side-view airliner, nose to the right. '#' body, 'w' wing (drawn darker).
const PLANE = ['#.......', '##......', '########', '..ww....'];
// Bird flap cycle: wings up, level, down, level.
const BIRD = [
  ['#.#', '.#.'],
  ['...', '###'],
  ['...', '.#.', '#.#'],
  ['...', '###'],
];

interface Plane {
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number; // sky px / s
  climb: number; // sky px / s
  trail: { x: number; y: number; t: number }[];
  scale: number;
  route: string;
  hail: number; // seconds left on its "hello": lights flash and the label shows
}

// Real departures out of Pearson, split by which way they head.
const EAST = ['LHR', 'CDG', 'FRA', 'DEL', 'DXB', 'JFK', 'FCO', 'AMS'];
const WEST = ['YVR', 'SFO', 'LAX', 'NRT', 'HKG', 'SEA', 'YYC', 'HNL'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

/** Things that own their clicks: text, controls, cards. Everything else is open sky. */
const SKY_BLOCKERS =
  'a,button,input,textarea,select,label,summary,img,video,h1,h2,h3,h4,p,li,dd,dt,kbd,code,[role],.rounded-xl,.rounded-2xl,.rounded-3xl,[data-no-sky]';
const isSky = (el: EventTarget | null) => !(el instanceof Element) || !el.closest(SKY_BLOCKERS);

export const takeoff = () => window.dispatchEvent(new Event('sky:takeoff'));

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  glide: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

interface SkyLifeProps {
  life: Life;
  /** Cloud cover 0..1: under a full deck, aircraft fly below the cloud base. */
  cover: number;
  paused?: boolean;
  className?: string;
}

/**
 * Calm, slow things in a dry sky: airliners on the Pearson approach with real
 * nav-light patterns, small flocks that scatter from the cursor, the odd meteor.
 * Drawn between the sky pass and the cloud pass, so clouds pass in front.
 */
export function SkyLife({ life, cover, paused = false, className = '' }: SkyLifeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lifeRef = useRef(life);
  const pausedRef = useRef(paused);
  const coverRef = useRef(cover);
  coverRef.current = cover;
  lifeRef.current = life;
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduce) return;

    let W = 1;
    let H = 1;
    const planes: Plane[] = [];
    let flock: Bird[] = [];
    const meteors: Meteor[] = [];
    const pointer = { x: -999, y: -999 };
    let nextPlane = rand(2, 5);
    let nextFlock = rand(6, 14);
    let nextMeteor = rand(8, 20);
    let clock = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      W = canvas.width = Math.max(1, Math.ceil(canvas.clientWidth / PX));
      H = canvas.height = Math.max(1, Math.ceil(canvas.clientHeight / PX));
    };

    const spawnPlane = (opts: Partial<Plane> = {}) => {
      const dir: 1 | -1 = opts.dir ?? (Math.random() < 0.5 ? 1 : -1);
      const scale = opts.scale ?? (Math.random() < 0.3 ? 2 : 1); // a few closer, larger aircraft
      planes.push({
        x: dir === 1 ? -12 : W + 12,
        y: H * (coverRef.current > 0.7 ? rand(0.5, 0.62) : rand(0.16, 0.48)),
        speed: rand(7, 11) * (scale === 2 ? 1.4 : 1),
        climb: rand(-0.25, 0.25),
        trail: [],
        route: `YYZ → ${pick(dir === 1 ? EAST : WEST)}`,
        hail: 0,
        ...opts,
        dir,
        scale,
      });
    };

    // Overlay (in front of the clouds): click ripples and a plane's route tag.
    const overlay = overlayRef.current;
    const ripple = (cx: number, cy: number) => {
      if (!overlay) return;
      const r = document.createElement('span');
      r.className = 'sky-ripple';
      r.style.left = `${cx}px`;
      r.style.top = `${cy}px`;
      overlay.appendChild(r);
      window.setTimeout(() => r.remove(), 900);
    };
    const tag = document.createElement('span');
    tag.className = 'sky-tag';
    overlay?.appendChild(tag);

    const planeAt = (sx: number, sy: number) =>
      planes.find(p => {
        const w = PLANE[0].length * p.scale;
        return Math.abs(sx - p.x) < w / 2 + 4 && sy > p.y - 4 && sy < p.y + 4 * p.scale + 4;
      });

    const spawnFlock = () => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const n = 3 + Math.floor(Math.random() * 5);
      const x0 = dir === 1 ? -10 : W + 10;
      const y0 = H * rand(0.3, 0.6);
      const speed = rand(16, 22) * dir;
      // Loose V: each bird trails the leader, alternating sides.
      flock = Array.from({ length: n }, (_, i) => {
        const rank = Math.ceil(i / 2);
        const side = i % 2 ? -1 : 1;
        return {
          x: x0 - dir * rank * 5 + rand(-1, 1),
          y: y0 + side * rank * 3 + rand(-1, 1),
          vx: speed,
          vy: 0,
          phase: Math.random() * 4,
          glide: 0,
        };
      });
    };

    const spawnMeteor = () => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      meteors.push({ x: W * rand(0.15, 0.85), y: H * rand(0.05, 0.3), vx: dir * rand(55, 80), vy: rand(22, 34), life: 0 });
    };

    const px = (x: number, y: number, color: string, a = 1) => {
      ctx.globalAlpha = a;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    const sprite = (rows: string[], x: number, y: number, flip: boolean, colors: Record<string, string>, scale = 1) => {
      const w = rows[0].length;
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < w; rx++) {
          const c = colors[row[rx]];
          if (!c) continue;
          const cx = flip ? w - 1 - rx : rx;
          ctx.fillStyle = c;
          ctx.fillRect(Math.round(x + cx * scale), Math.round(y + ry * scale), scale, scale);
        }
      });
    };

    const step = (dt: number) => {
      const L = lifeRef.current;
      clock += dt;

      // Planes
      nextPlane -= dt * (0.4 + L.planes);
      if (L.planes > 0 && nextPlane <= 0 && planes.length < 2) {
        spawnPlane();
        nextPlane = rand(16, 34);
      }
      for (let i = planes.length - 1; i >= 0; i--) {
        const p = planes[i];
        p.hail = Math.max(0, p.hail - dt);
        p.x += p.dir * p.speed * dt;
        p.y += p.climb * dt;
        // One trail point per sky pixel travelled, so alpha never stacks.
        const tx = Math.round(p.x - p.dir * 3 * p.scale);
        const lastPt = p.trail[p.trail.length - 1];
        if (L.contrails && (!lastPt || Math.round(lastPt.x) !== tx)) p.trail.push({ x: tx, y: p.y + 2 * p.scale, t: clock });
        p.trail = p.trail.filter(t => clock - t.t < 7);
        if ((p.dir === 1 && p.x > W + 20) || (p.dir === -1 && p.x < -20)) planes.splice(i, 1);
      }

      // Birds
      nextFlock -= dt;
      if (L.birds && nextFlock <= 0 && flock.length === 0) {
        spawnFlock();
        nextFlock = rand(22, 45);
      }
      const ptr = { x: pointer.x / PX, y: pointer.y / PX };
      flock.forEach(b => {
        const dx = b.x - ptr.x;
        const dy = b.y - ptr.y;
        const d = Math.hypot(dx, dy);
        if (d < 16 && d > 0.01) {
          // Startle: veer away and flap hard.
          b.vx += (dx / d) * 60 * dt;
          b.vy += (dy / d) * 60 * dt - 8 * dt;
          b.glide = 0;
        }
        b.vy *= Math.exp(-dt * 1.2);
        b.vy += Math.sin(clock * 1.3 + b.phase) * 0.6 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        // Flap in bursts, then glide.
        b.glide = b.glide > 0 ? b.glide - dt : Math.random() < dt * 0.25 ? rand(0.6, 1.4) : 0;
        if (b.glide <= 0) b.phase += dt * 9;
      });
      if (flock.length && flock.every(b => b.x < -20 || b.x > W + 20 || b.y < -20)) flock = [];

      // Meteors
      nextMeteor -= dt;
      if (L.shootingStars && nextMeteor <= 0) {
        spawnMeteor();
        nextMeteor = rand(18, 40);
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.life > 0.7) meteors.splice(i, 1);
      }
    };

    const draw = () => {
      const L = lifeRef.current;
      ctx.clearRect(0, 0, W, H);
      const night = L.lights === 'night';

      // Contrails: thin, fading, slowly spreading.
      planes.forEach(p =>
        p.trail.forEach(t => {
          const age = clock - t.t;
          const spread = Math.floor(age / 2.5);
          const a = 0.16 * (1 - age / 7);
          px(t.x, t.y - spread * 0.5, '#e6ebf2', a);
          if (spread) px(t.x, t.y + spread * 0.5, '#e6ebf2', a * 0.6);
        }),
      );

      planes.forEach(p => {
        const flip = p.dir === -1;
        const w = PLANE[0].length * p.scale;
        const x = p.x - w / 2;
        const y = p.y;
        ctx.globalAlpha = night ? 0.55 : 0.85;
        sprite(PLANE, x, y, flip, night ? { '#': '#2a303c', w: '#20252f' } : { '#': '#38404d', w: '#2b313c' }, p.scale);
        // Nav lights: steady wingtip light, red belly beacon at 1 Hz, white tail strobe double-flash.
        const wingX = x + (flip ? w - 3 * p.scale : 2 * p.scale);
        const tailX = flip ? x + w - p.scale : x;
        const wingY = y + 3 * p.scale;
        const beaconOn = clock % 1 < 0.12;
        const s = clock % 1.3;
        // A hailed plane answers with a burst of every light it has.
        const hailing = p.hail > 0 && clock % 0.3 < 0.15;
        const strobeOn = hailing || s < 0.06 || (s > 0.16 && s < 0.22);
        const glow = (gx: number, gy: number, c: string, a: number) => {
          px(gx, gy, c, a);
          if (night) {
            px(gx - 1, gy, c, a * 0.25);
            px(gx + 1, gy, c, a * 0.25);
            px(gx, gy - 1, c, a * 0.25);
            px(gx, gy + 1, c, a * 0.25);
          }
        };
        glow(wingX, wingY, p.dir === 1 ? '#ff4b4b' : '#4bff8a', night ? 0.95 : 0.6);
        if (beaconOn) glow(x + w / 2, y + 2 * p.scale + p.scale, '#ff3030', 1);
        if (strobeOn) glow(tailX, y, '#ffffff', 1);
        // Landing lights on the closer aircraft at night, on approach.
        if ((night && p.scale === 2) || hailing) glow(flip ? x : x + w - 1, y + 2 * p.scale, '#fff4d6', 0.9);
      });

      // Route tag follows the hailed plane.
      const hailed = planes.find(p => p.hail > 0);
      if (hailed) {
        const alt = Math.round(Math.min(39, Math.max(11, (1 - hailed.y / H) * 48))) * 1000;
        const text = `${hailed.route} · ${alt.toLocaleString()} ft`;
        if (tag.textContent !== text) tag.textContent = text;
        tag.style.transform = `translate(${Math.round(hailed.x * PX)}px, ${Math.round(hailed.y * PX) - 30}px) translateX(-50%)`;
        tag.style.opacity = hailed.hail < 0.4 ? String(hailed.hail / 0.4) : '1';
      } else if (tag.style.opacity !== '0') {
        tag.style.opacity = '0';
      }

      flock.forEach(b => {
        const frame = BIRD[Math.floor(b.phase) % BIRD.length];
        ctx.globalAlpha = night ? 0.5 : 0.8;
        sprite(frame, b.x, b.y, false, { '#': night ? '#1b1f27' : '#232833' });
      });

      meteors.forEach(m => {
        const len = 10;
        const k = 1 - m.life / 0.7;
        for (let i = 0; i < len; i++) {
          const t = i / len;
          px(m.x - (m.vx / 70) * i * 1.2, m.y - (m.vy / 70) * i * 1.2, i === 0 ? '#ffffff' : '#cfe0ff', (1 - t) * k);
        }
      });
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      if (!pausedRef.current) step(dt);
      draw();
      if (!pausedRef.current) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const wake = () => {
      if (!raf && !document.hidden && !pausedRef.current) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    let grab = false;
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      const over = isSky(e.target) && !!planeAt(e.clientX / PX, e.clientY / PX);
      if (over !== grab) {
        grab = over;
        document.documentElement.classList.toggle('sky-grab', over);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!isSky(e.target) || !window.getSelection()?.isCollapsed) return;
      const sx = e.clientX / PX;
      const sy = e.clientY / PX;
      ripple(e.clientX, e.clientY);
      const L = lifeRef.current;
      const hit = planeAt(sx, sy);
      if (hit) {
        hit.hail = 3.2;
        hit.climb = -0.6; // a polite little climb
      } else if (L.lights === 'night' && coverRef.current < 0.6) {
        const dir = sx < W / 2 ? 1 : -1;
        meteors.push({ x: sx, y: sy, vx: dir * rand(55, 80), vy: rand(22, 34), life: 0 });
      } else if (L.birds && flock.length === 0) {
        spawnFlock();
        const ox = flock[0].x;
        const oy = flock[0].y;
        flock.forEach(b => {
          b.x += sx - ox;
          b.y += sy - oy;
          b.vy = -rand(6, 12); // take off upward
        });
      } else if (planes.length < 3) {
        // Summon a flight past the spot you clicked, from the far side.
        spawnPlane({ dir: sx > W / 2 ? 1 : -1, y: Math.min(H * 0.8, Math.max(H * 0.1, sy)), climb: 0 });
      }
      wake();
    };
    const onTakeoff = () => {
      // From the runway in the bottom-left corner, climbing out over the page.
      spawnPlane({ dir: 1, scale: 2, y: H * 0.86, climb: -H * 0.035, speed: 13 });
      wake();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('sky:takeoff', onTakeoff);
    document.addEventListener('visibilitychange', wake);
    const poll = window.setInterval(wake, 500); // resumes after an unpause
    wake();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('sky:takeoff', onTakeoff);
      document.documentElement.classList.remove('sky-grab');
      tag.remove();
      document.removeEventListener('visibilitychange', wake);
      window.clearInterval(poll);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={className}
        style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
      />
      {typeof document !== 'undefined' &&
        createPortal(<div ref={overlayRef} aria-hidden="true" className="sky-overlay" />, document.body)}
    </>
  );
}
