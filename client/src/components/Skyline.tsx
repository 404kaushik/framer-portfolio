import { useEffect, useRef } from 'react';

/** CSS pixels per sky pixel, the same grid as the clouds. */
const PX = 4;

interface Building {
  x: number;
  w: number;
  h: number;
  windows: { x: number; y: number; seed: number; warm: boolean }[];
}

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A row of towers, taller toward the downtown core around `core` (0..1 across). */
function city(W: number, H: number, seed: number, core: number, scale: number, skip: [number, number]): Building[] {
  const r = mulberry(seed);
  const out: Building[] = [];
  let x = -2;
  while (x < W + 2) {
    const w = 5 + Math.floor(r() * 9);
    const d = (x + w / 2) / W - core;
    const bump = Math.exp(-(d * d) / 0.02);
    const h = Math.round((6 + r() * 10 + bump * (14 + r() * 22)) * scale);
    if (x + w < skip[0] || x > skip[1]) {
      const windows: Building['windows'] = [];
      for (let wy = 3; wy < h - 2; wy += 3)
        for (let wx = 1 + (w % 2); wx < w - 1; wx += 2)
          windows.push({ x: x + wx, y: H - h + wy, seed: r(), warm: r() < 0.82 });
      out.push({ x, w, h: Math.min(h, H - 4), windows });
    }
    x += w + (r() < 0.3 ? 1 : 0);
  }
  return out;
}

export const TOWER_COLOURS = ['#e4f1ff', '#e23b3b', '#3d8bff', '#28c98a', '#ffb02e'];

interface SkylineProps {
  layer: 'far' | 'near';
  night: boolean;
  paused: boolean;
  towerColour: string;
  onTower?: () => void;
  className?: string;
}

/**
 * Toronto at the bottom of the page: the CN Tower, the dome and the downtown core in pixels.
 * Windows come on as you hover a building; at night a few switch on and off on their own.
 */
export function Skyline({ layer, night, paused, towerColour, onTower, className = '' }: SkylineProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const props = useRef({ night, paused, towerColour, onTower });
  props.current = { night, paused, towerColour, onTower };

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const near = layer === 'near';

    let W = 1;
    let H = 1;
    let towers: Building[] = [];
    let cn = 0; // CN Tower centre x
    const hover: number[] = [];
    let hovered = -1;
    let overTower = false;
    const flicker = new Map<number, boolean>(); // window index -> forced state
    let clock = 0;
    let raf = 0;
    let last = 0;
    let visible = false;

    const build = () => {
      W = canvas.width = Math.max(1, Math.ceil(canvas.clientWidth / PX));
      H = canvas.height = Math.max(1, Math.ceil(canvas.clientHeight / PX));
      cn = Math.round(W * (W < 120 ? 0.7 : 0.64));
      towers = near
        ? city(W, H, 11, 0.6, 1, [cn - 4, cn + 30])
        : city(W, H, 29, 0.45, 0.8, [-99, -99]);
      hover.length = 0;
      towers.forEach(() => hover.push(0));
      draw();
    };

    const draw = () => {
      const { night: n, towerColour: tc } = props.current;
      ctx.clearRect(0, 0, W, H);
      const body = near ? (n ? '#07080c' : '#12151c') : n ? '#151a25' : '#1f2531';
      const edge = near ? (n ? '#11141c' : '#1d212b') : n ? '#161a24' : '#262c39';

      towers.forEach((b, i) => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = body;
        ctx.fillRect(b.x, H - b.h, b.w, b.h);
        // A lit edge on the roofline so each tower reads.
        ctx.fillStyle = edge;
        ctx.fillRect(b.x, H - b.h, b.w, 1);
        if (!near && !n) return;
        b.windows.forEach((w, j) => {
          const key = i * 1000 + j;
          const base = n ? w.seed < 0.3 : false;
          const on = flicker.has(key) ? flicker.get(key)! : base;
          const lit = on || hover[i] > w.seed;
          if (lit) {
            ctx.globalAlpha = near ? 0.9 : 0.45;
            ctx.fillStyle = w.warm ? '#f3c677' : '#cfe3ff';
          } else {
            ctx.globalAlpha = near ? (n ? 0.5 : 0.7) : 0.4;
            ctx.fillStyle = n ? '#141823' : '#232836';
          }
          ctx.fillRect(w.x, w.y, 1, 1);
        });
      });
      ctx.globalAlpha = 1;
      if (!near) return;

      // CN Tower: flared base, shaft, main pod, SkyPod and the antenna.
      const top = Math.max(2, Math.round(H * 0.02));
      const shaftTop = Math.round(H * 0.3);
      ctx.fillStyle = body;
      ctx.fillRect(cn - 1, shaftTop, 3, H - shaftTop);
      ctx.fillRect(cn - 2, H - 14, 5, 14);
      ctx.fillRect(cn - 3, H - 5, 7, 5);
      const pod = Math.round(H * 0.4);
      ctx.fillRect(cn - 4, pod, 9, 4);
      ctx.fillRect(cn - 3, pod - 1, 7, 1);
      ctx.fillRect(cn - 1, Math.round(H * 0.24), 3, 3);
      ctx.fillRect(cn, top, 1, shaftTop - top);
      // Its night lighting: the shaft glows in the tower's colour of the day (click it to change).
      const glowA = props.current.night ? 0.55 : 0.18;
      ctx.globalAlpha = glowA;
      ctx.fillStyle = tc;
      ctx.fillRect(cn, shaftTop + 2, 1, H - shaftTop - 16);
      ctx.globalAlpha = props.current.night ? 0.9 : 0.4;
      ctx.fillRect(cn - 3, pod + 2, 7, 1);
      // Aviation beacon on the antenna, 1 Hz.
      if (reduce || clock % 1 < 0.5) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ff3b30';
        ctx.fillRect(cn, top, 1, 1);
        ctx.fillRect(cn, pod - 1, 1, 1);
      }
      // Rogers Centre dome beside it.
      ctx.globalAlpha = 1;
      ctx.fillStyle = body;
      const dx = cn + 6;
      const dw = 22;
      for (let i = 0; i < dw; i++) {
        const k = (i - dw / 2) / (dw / 2);
        const h = Math.round(Math.sqrt(Math.max(0, 1 - k * k)) * 7) + 3;
        ctx.fillRect(dx + i, H - h, 1, h);
      }
      ctx.fillStyle = edge;
      for (let i = 2; i < dw - 2; i += 4) ctx.fillRect(dx + i, H - Math.round(Math.sqrt(1 - ((i - dw / 2) / (dw / 2)) ** 2) * 7) - 3, 1, 1);
    };

    const step = (dt: number) => {
      const still = props.current.paused;
      if (!still) clock += dt;
      let moving = false;
      hover.forEach((v, i) => {
        const to = i === hovered ? 1.05 : 0;
        const next = v + (to - v) * (1 - Math.exp(-dt * (to > v ? 3 : 1.4)));
        if (Math.abs(next - v) > 0.002) moving = true;
        hover[i] = next;
      });
      // Now and then someone gets home, or goes to bed.
      if (!still && props.current.night && Math.random() < dt * 0.6 && towers.length) {
        const i = Math.floor(Math.random() * towers.length);
        const j = Math.floor(Math.random() * towers[i].windows.length);
        if (towers[i].windows.length) flicker.set(i * 1000 + j, !(flicker.get(i * 1000 + j) ?? towers[i].windows[j].seed < 0.3));
      }
      return moving;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 30;
      last = now;
      const moving = step(dt);
      draw();
      if (!props.current.paused || moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const wake = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(frame);
      else if (reduce) draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / PX;
      const y = (e.clientY - rect.top) / PX;
      const inside = x >= 0 && x < W && y >= 0 && y < H;
      const was = hovered;
      hovered = inside ? towers.findIndex(b => x >= b.x && x < b.x + b.w && y >= H - b.h) : -1;
      const tower = inside && near && Math.abs(x - cn) < 5 && y > H * 0.02;
      if (tower !== overTower) {
        overTower = tower;
        document.documentElement.classList.toggle('sky-grab', tower);
      }
      if (hovered !== was) wake();
    };
    const onLeave = () => {
      hovered = -1;
      wake();
    };
    const onClick = () => {
      if (overTower) props.current.onTower?.();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    // The canvas lets the pointer through (the name behind it hovers too), so listen on the window.
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('click', onClick);
    canvas.addEventListener('skyline:redraw', onLeave);
    const poll = window.setInterval(wake, 500);
    build();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.clearInterval(poll);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClick);
      canvas.removeEventListener('skyline:redraw', onLeave);
    };
  }, [layer]);

  // Redraw promptly when day turns to night or the tower changes colour.
  useEffect(() => {
    ref.current?.dispatchEvent(new Event('skyline:redraw'));
  }, [night, towerColour]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated', pointerEvents: 'none' }}
    />
  );
}
