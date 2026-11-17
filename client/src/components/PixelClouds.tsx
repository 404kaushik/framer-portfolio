import { useEffect, useRef } from 'react';
import type { SkyConfig } from '@/lib/weather';

/** CSS pixels per sky pixel. Matches the chunky look of PixelSnow. */
const PX = 4;
const FPS = 30;
// Both passes start from the same moment so the sky and cloud canvases agree.
const SHARED_START = 400 + Math.random() * 200;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCover;
uniform float uDark;
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uLight;
uniform vec3 uShade;
uniform float uSun;
uniform float uMoon;
uniform float uMoonPhase;
uniform vec2 uBodyPos;
uniform float uDrift;
uniform float uFlash;
uniform float uStars;
uniform float uPart; // 0 = sky, stars, sun and moon; 1 = clouds only
uniform vec3 uStir; // pointer in sky px (xy) and how hard it is stirring the clouds (z)
uniform float uScroll; // page scroll in sky px, for depth
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float bayer(ivec2 c) {
  int i = (c.x & 3) + (c.y & 3) * 4;
  float b[16] = float[16](0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
  return (b[i] + 0.5) / 16.0;
}

// Raw cloud field: wide, flat cumulus shapes, domain-warped so they billow as they drift.
float field(vec2 p, float layer) {
  vec2 q = p * vec2(0.85, 2.1) * (1.0 + layer * 0.7);
  q.x -= uTime * uDrift * (0.05 - layer * 0.025) + layer * 31.0;
  float warp = fbm(q * 0.55 + vec2(uTime * 0.006, layer * 7.3));
  return fbm(q + warp * 1.1 + vec2(0.0, uTime * 0.004));
}

float density(vec2 p, float y, float layer) {
  float thr = mix(0.74, 0.3, uCover) + layer * 0.04;
  float base = mix(0.52, 0.18, max(uDark, uCover * 0.6)) - layer * 0.06;
  float height = smoothstep(base, base + 0.32, y);
  return clamp((field(p, layer) - thr) / 0.2, 0.0, 1.0) * height;
}

void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;
  float dither = bayer(cell);

  // Sky: banded, dithered gradient fading into the page at the bottom.
  float skyMix = smoothstep(0.3, 1.0, uv.y);
  skyMix = floor(skyMix * 7.0 + dither) / 7.0;
  vec3 color = mix(uHorizon, uTop, skyMix);
  float alpha = floor(smoothstep(0.18, 0.8, uv.y) * 6.0 + dither) / 6.0;

  // Stars, hidden behind cloud.
  vec2 sc = vec2(cell) - vec2(0.0, floor(uScroll * 0.05));
  float star = step(0.9965, hash(sc)) * uStars * smoothstep(0.35, 0.8, uv.y);
  color += vec3(0.75, 0.8, 0.9) * star * (0.45 + 0.55 * hash(sc + 7.0));

  // Sun or moon, positioned along its real arc.
  vec2 d = (uv - uBodyPos) * vec2(aspect, 1.0) * uRes.y;
  float len = length(d);
  float sunR = 8.0;
  float moonR = 6.5;
  if (uSun > 0.001) {
    float halo = clamp((sunR * 3.6 - len) / (sunR * 2.6), 0.0, 1.0);
    halo = floor(halo * 3.0 + dither) / 3.0;
    color += vec3(1.0, 0.72, 0.42) * halo * 0.22 * uSun;
    if (len < sunR) color = mix(color, vec3(1.0, 0.86, 0.62), uSun);
    if (len < sunR - 2.5) color = mix(color, vec3(1.0, 0.95, 0.82), uSun);
    alpha = max(alpha, halo * 0.6 * uSun);
  }
  if (uMoon > 0.001) {
    float halo = clamp((moonR * 3.0 - len) / (moonR * 2.0), 0.0, 1.0);
    halo = floor(halo * 3.0 + dither) / 3.0;
    color += vec3(0.6, 0.7, 0.85) * halo * 0.12 * uMoon;
    if (len < moonR) {
      vec2 l = d / moonR;
      float k = cos(6.2831853 * uMoonPhase);
      float edge = sqrt(max(0.0, 1.0 - l.y * l.y));
      bool lit = uMoonPhase < 0.5 ? l.x > k * edge : -l.x > k * edge;
      float crater = noise(l * 2.6 + 3.0) > 0.62 ? 0.82 : 1.0;
      vec3 face = lit ? vec3(0.9, 0.92, 0.95) * crater : vec3(0.13, 0.15, 0.2);
      color = mix(color, face, uMoon);
      alpha = max(alpha, uMoon);
    }
    alpha = max(alpha, halo * 0.5 * uMoon);
  }

  if (uPart < 0.5) {
    outColor = vec4(color * alpha, alpha);
    return;
  }
  vec3 skyColor = color;
  vec3 pm = vec3(0.0);
  float acc = 0.0;

  // Two cloud decks: a hazy far deck, then the near deck lit from above.
  for (int layer = 1; layer >= 0; layer--) {
    float fl = float(layer);
    // Depth: the near deck slides up faster than the far one as the page scrolls.
    vec2 pp = p - vec2(0.0, uScroll / uRes.y * 2.4 * (0.22 - fl * 0.1));
    // The pointer stirs the cloud aside like a hand through mist; it fills back in when you stop.
    vec2 toM = gl_FragCoord.xy - uStir.xy;
    float push = (1.0 - smoothstep(0.0, 30.0, length(toM))) * uStir.z;
    pp += normalize(toM + 0.001) * push * 0.18;
    float dens = density(pp, uv.y, fl) * (1.0 - push * 0.9);
    if (dens <= 0.0) continue;
    float above = density(pp + vec2(0.0, 0.07), uv.y + 0.03, fl);
    float lightAmt = clamp(0.5 + (dens - above) * 1.7 + (uv.y - 0.65) * 0.5, 0.0, 1.0);
    // Narrow dither bands: flat pixel-art tones with a short ordered-dither seam between them.
    float tone = clamp(floor(lightAmt * 3.0 + 0.5 + (dither - 0.5) * 0.7) / 3.0, 0.0, 1.0);
    vec3 cloud = mix(uShade, uLight, tone);
    cloud *= mix(1.0, 0.65, uDark * (1.0 - tone));

    // Silver lining where the cloud edge thins in front of the sun or moon.
    float glowR = mix(moonR, sunR, step(0.5, uSun)) * 4.0;
    float near = clamp(1.0 - len / glowR, 0.0, 1.0) * max(uSun, uMoon * 0.7);
    float rim = (1.0 - smoothstep(0.0, 0.45, dens)) * near;
    cloud = mix(cloud, mix(uLight, vec3(1.0, 0.92, 0.8), uSun) * 1.25, floor(rim * 2.0 + dither * 0.8) / 2.0);

    // Lightning lights the cloud from inside.
    cloud += uFlash * vec3(0.55, 0.6, 0.78) * (0.5 + 0.5 * dens);

    if (layer == 1) cloud = mix(cloud, skyColor, 0.45);
    float edge = step(0.3 + (dither - 0.5) * 0.3, dens);
    float a = edge * (layer == 1 ? 0.6 : 0.88);
    pm = cloud * a + pm * (1.0 - a);
    acc = a + acc * (1.0 - a);
  }

  outColor = vec4(pm, acc);
}`;

type Uniforms = {
  cover: number;
  darkness: number;
  top: number[];
  horizon: number[];
  light: number[];
  shade: number[];
  sun: number;
  moon: number;
  moonPhase: number;
  bodyPos: number[];
  drift: number;
  stars: number;
};

const toUniforms = (sky: SkyConfig): Uniforms => {
  const nightish = sky.body === 'moon';
  return {
    cover: sky.cover,
    darkness: sky.darkness,
    top: [...sky.top],
    horizon: [...sky.horizon],
    light: [...sky.light],
    shade: [...sky.shade],
    sun: sky.body === 'sun' ? 1 : 0,
    moon: nightish ? 1 : 0,
    moonPhase: sky.moonPhase,
    bodyPos: [...sky.bodyPos],
    drift: sky.windDrift,
    stars: nightish ? Math.max(0, 1 - sky.cover * 1.1) : 0,
  };
};

const approach = (from: number, to: number, k: number) => from + (to - from) * k;

interface PixelCloudsProps {
  sky: SkyConfig;
  /** Which pass to draw, so things can fly between the sky and the clouds. */
  part: 'sky' | 'clouds';
  flash: number;
  paused?: boolean;
  className?: string;
}

export function PixelClouds({ sky, part, flash, paused = false, className = '' }: PixelCloudsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<Uniforms>(toUniforms(sky));
  const flashRef = useRef(flash);
  const pausedRef = useRef(paused);
  const partRef = useRef(part === 'sky' ? 0 : 1);
  const wakeRef = useRef<() => void>(() => {});

  targetRef.current = toUniforms(sky);
  flashRef.current = flash;
  pausedRef.current = paused;

  useEffect(() => {
    wakeRef.current();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const loc = {
      res: u('uRes'),
      time: u('uTime'),
      cover: u('uCover'),
      dark: u('uDark'),
      top: u('uTop'),
      horizon: u('uHorizon'),
      light: u('uLight'),
      shade: u('uShade'),
      sun: u('uSun'),
      moon: u('uMoon'),
      moonPhase: u('uMoonPhase'),
      bodyPos: u('uBodyPos'),
      drift: u('uDrift'),
      flash: u('uFlash'),
      stars: u('uStars'),
      part: u('uPart'),
      stir: u('uStir'),
      scroll: u('uScroll'),
    };

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    // Start somewhere in the cloud field so the first frame already looks settled.
    let time = SHARED_START;
    const current: Uniforms = structuredClone(targetRef.current);
    let raf = 0;
    let last = 0;
    // Pointer stirring (cloud pass only) and scroll depth.
    const aim = { x: -999, y: -999 };
    const stir = { x: -999, y: -999, k: 0 };
    let scroll = reduce ? 0 : window.scrollY / PX;

    const resize = () => {
      canvas.width = Math.max(1, Math.ceil(canvas.clientWidth / PX));
      canvas.height = Math.max(1, Math.ceil(canvas.clientHeight / PX));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const draw = () => {
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.time, time);
      gl.uniform1f(loc.cover, current.cover);
      gl.uniform1f(loc.dark, current.darkness);
      gl.uniform3fv(loc.top, current.top);
      gl.uniform3fv(loc.horizon, current.horizon);
      gl.uniform3fv(loc.light, current.light);
      gl.uniform3fv(loc.shade, current.shade);
      gl.uniform1f(loc.sun, current.sun);
      gl.uniform1f(loc.moon, current.moon);
      gl.uniform1f(loc.moonPhase, current.moonPhase);
      gl.uniform2fv(loc.bodyPos, current.bodyPos);
      gl.uniform1f(loc.drift, current.drift);
      gl.uniform1f(loc.flash, flashRef.current);
      gl.uniform1f(loc.stars, current.stars);
      gl.uniform1f(loc.part, partRef.current);
      gl.uniform3f(loc.stir, stir.x, stir.y, stir.k);
      gl.uniform1f(loc.scroll, scroll);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Ease every uniform toward the target so weather changes roll in rather than cut.
    const ease = (k: number) => {
      const t = targetRef.current;
      let moving = 0;
      (Object.keys(t) as (keyof Uniforms)[]).forEach(key => {
        const to = t[key];
        if (Array.isArray(to)) {
          const from = current[key] as number[];
          to.forEach((v, i) => {
            moving = Math.max(moving, Math.abs(v - from[i]));
            from[i] = approach(from[i], v, k);
          });
        } else {
          const from = current[key] as number;
          moving = Math.max(moving, Math.abs(to - from));
          (current[key] as number) = approach(from, to, k);
        }
      });
      return moving > 0.002;
    };

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const elapsed = last ? now - last : 1000 / FPS;
      if (elapsed < 1000 / FPS - 2) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min(0.1, elapsed / 1000);
      last = now;
      // The sky pass is static between weather changes; only the cloud pass drifts.
      const animating = !pausedRef.current && !reduce && partRef.current === 1;
      if (animating) time += dt;
      const transitioning = ease(1 - Math.exp(-dt * 1.6));
      const follow = 1 - Math.exp(-dt * 9);
      stir.x = stir.x < -900 ? aim.x : approach(stir.x, aim.x, follow);
      stir.y = stir.y < -900 ? aim.y : approach(stir.y, aim.y, follow);
      stir.k *= Math.exp(-dt * 0.7);
      const stirring = stir.k > 0.01;
      const targetScroll = reduce ? 0 : window.scrollY / PX;
      const scrolling = Math.abs(targetScroll - scroll) > 0.05;
      scroll = targetScroll;
      draw();
      if (animating || transitioning || stirring || scrolling || flashRef.current > 0) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const onVisibility = () => {
      last = 0;
      wake();
    };
    document.addEventListener('visibilitychange', onVisibility);
    const onMove = (e: PointerEvent) => {
      if (reduce || partRef.current !== 1 || e.pointerType === 'touch') return;
      const x = e.clientX / PX;
      const y = (canvas.clientHeight - e.clientY) / PX;
      const moved = aim.x < -900 ? 0 : Math.hypot(x - aim.x, y - aim.y);
      aim.x = x;
      aim.y = y;
      stir.k = Math.min(1, stir.k + moved * 0.02);
      wake();
    };
    const onScroll = () => wake();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    resize();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
    />
  );
}
