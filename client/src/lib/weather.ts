import type { PixelSnowProps } from '@/components/PixelSnow';

export type SceneKind = 'snow' | 'rain' | 'drizzle' | 'storm' | 'fog' | 'cloudy' | 'clear-day' | 'clear-night';
export type DayPhase = 'night' | 'dawn' | 'day' | 'dusk';

export interface LiveWeather {
  temperature: number;
  code: number;
  cloudCover: number; // 0..100
  windSpeed: number; // km/h
  windGusts: number; // km/h
  windDirection: number; // degrees, direction the wind blows FROM
  isDay: boolean;
  sunrise: number; // epoch ms
  sunset: number; // epoch ms
  fetchedAt: number;
}

/** Everything the sky shader needs. Colours are linear 0..1 RGB. */
export interface SkyConfig {
  cover: number; // 0..1 how much of the sky is cloud
  darkness: number; // 0..1 storm heaviness (darker, lower base)
  top: [number, number, number]; // sky colour at the top of the screen
  horizon: [number, number, number]; // sky colour where it fades out
  light: [number, number, number]; // lit cloud tops
  shade: [number, number, number]; // cloud undersides
  body: 'sun' | 'moon' | 'none';
  bodyPos: [number, number]; // uv, y up
  moonPhase: number; // 0 new → 0.5 full → 1 new
  windDrift: number; // signed, screen widths per minute-ish
}

/** Ambient things that live in a dry sky. */
export interface SkyLife {
  planes: number; // 0..1 how busy the flight path is (Pearson approaches cross the city)
  contrails: boolean;
  birds: boolean;
  shootingStars: boolean;
  lights: 'day' | 'night'; // planes show silhouettes by day, nav lights by night
}

export interface Scene {
  kind: SceneKind;
  label: string;
  /** Falling particles. Only real precipitation gets any: dry skies stay clear. */
  snow: PixelSnowProps | null;
  life: SkyLife;
  sky: SkyConfig;
  lightning?: boolean;
  fog?: boolean;
  /** Five-step ramp for UI that follows the weather (GitHub graph, accents). */
  ramp: [string, string, string, string, string];
}

// Toronto: matches "Based in Ontario" in the hero.
export const LOCATION = { name: 'Toronto', latitude: 43.6532, longitude: -79.3832 };

const CACHE_KEY = 'weather:v2';
const CACHE_MS = 10 * 60 * 1000;

export async function fetchWeather(signal?: AbortSignal): Promise<LiveWeather> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as LiveWeather | null;
    if (cached && Date.now() - cached.fetchedAt < CACHE_MS) return cached;
  } catch {
    /* storage unavailable */
  }

  const params = new URLSearchParams({
    latitude: String(LOCATION.latitude),
    longitude: String(LOCATION.longitude),
    current:
      'temperature_2m,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m,wind_direction_10m,is_day',
    daily: 'sunrise,sunset',
    forecast_days: '1',
    timezone: 'auto',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  const data = await res.json();
  const { current, daily, utc_offset_seconds: offset = 0 } = data;
  // Open-Meteo returns local wall-clock times without an offset.
  const toEpoch = (local: string) => Date.parse(`${local}:00Z`) - offset * 1000;
  const weather: LiveWeather = {
    temperature: current.temperature_2m,
    code: current.weather_code,
    cloudCover: current.cloud_cover,
    windSpeed: current.wind_speed_10m,
    windGusts: current.wind_gusts_10m,
    windDirection: current.wind_direction_10m,
    isDay: current.is_day === 1,
    sunrise: toEpoch(daily.sunrise[0]),
    sunset: toEpoch(daily.sunset[0]),
    fetchedAt: Date.now(),
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(weather));
  } catch {
    /* storage unavailable */
  }
  return weather;
}

/** Horizontal wind for the particle sim: positive blows left → right. */
export function windFromWeather(w: Pick<LiveWeather, 'windSpeed' | 'windDirection'>): number {
  const towardEast = -Math.sin((w.windDirection * Math.PI) / 180);
  return Math.max(-1.6, Math.min(1.6, (towardEast * w.windSpeed) / 22));
}

/** Synodic moon phase for a date: 0 new, 0.5 full. */
export function moonPhase(date = new Date()): number {
  const knownNew = Date.UTC(2000, 0, 6, 18, 14);
  const synodic = 29.530588853 * 86400000;
  const p = ((date.getTime() - knownNew) % synodic) / synodic;
  return p < 0 ? p + 1 : p;
}

export function moonName(phase: number): string {
  const names = [
    'New moon',
    'Waxing crescent',
    'First quarter',
    'Waxing gibbous',
    'Full moon',
    'Waning gibbous',
    'Last quarter',
    'Waning crescent',
  ];
  return names[Math.round(phase * 8) % 8];
}

export function dayPhase(w: Pick<LiveWeather, 'sunrise' | 'sunset'>, now = Date.now()): DayPhase {
  const band = 45 * 60 * 1000;
  if (Math.abs(now - w.sunrise) < band) return 'dawn';
  if (Math.abs(now - w.sunset) < band) return 'dusk';
  return now > w.sunrise && now < w.sunset ? 'day' : 'night';
}

/** Where the sun or moon sits on screen, following its real arc across the day or night. */
function bodyPosition(w: Pick<LiveWeather, 'sunrise' | 'sunset'> | null, now = Date.now()): [number, number] {
  if (!w) return [0.86, 0.84];
  const day = w.sunset - w.sunrise;
  let p: number;
  if (now >= w.sunrise && now <= w.sunset) p = (now - w.sunrise) / day;
  else {
    const night = 86400000 - day;
    const since = now > w.sunset ? now - w.sunset : now + 86400000 - w.sunset;
    p = Math.min(1, Math.max(0, since / night));
  }
  // Keep it in the upper sky and clear of the hero copy on the left.
  return [0.66 + p * 0.28, 0.72 + Math.sin(Math.PI * p) * 0.17];
}

/** WMO weather code → scene kind + intensity (0..1). */
export function classify(code: number, isDay: boolean): { kind: SceneKind; intensity: number; label: string } {
  const table: Record<number, [SceneKind, number, string]> = {
    0: [isDay ? 'clear-day' : 'clear-night', 0, 'Clear'],
    1: [isDay ? 'clear-day' : 'clear-night', 0.3, 'Mostly clear'],
    2: ['cloudy', 0.45, 'Partly cloudy'],
    3: ['cloudy', 0.85, 'Overcast'],
    45: ['fog', 0.6, 'Fog'],
    48: ['fog', 0.9, 'Freezing fog'],
    51: ['drizzle', 0.3, 'Light drizzle'],
    53: ['drizzle', 0.6, 'Drizzle'],
    55: ['drizzle', 0.9, 'Heavy drizzle'],
    56: ['drizzle', 0.5, 'Freezing drizzle'],
    57: ['drizzle', 0.9, 'Freezing drizzle'],
    61: ['rain', 0.3, 'Light rain'],
    63: ['rain', 0.6, 'Rain'],
    65: ['rain', 1, 'Heavy rain'],
    66: ['rain', 0.5, 'Freezing rain'],
    67: ['rain', 0.9, 'Freezing rain'],
    71: ['snow', 0.3, 'Light snow'],
    73: ['snow', 0.6, 'Snow'],
    75: ['snow', 1, 'Heavy snow'],
    77: ['snow', 0.4, 'Snow grains'],
    80: ['rain', 0.4, 'Rain showers'],
    81: ['rain', 0.7, 'Rain showers'],
    82: ['rain', 1, 'Violent showers'],
    85: ['snow', 0.5, 'Snow showers'],
    86: ['snow', 0.9, 'Snow showers'],
    95: ['storm', 0.8, 'Thunderstorm'],
    96: ['storm', 0.9, 'Thunderstorm, hail'],
    99: ['storm', 1, 'Thunderstorm, hail'],
  };
  const [kind, intensity, label] = table[code] ?? ['cloudy', 0.5, 'Cloudy'];
  return { kind, intensity, label };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Sky palettes by time of day. The page is dark, so every sky stays low-key. */
const SKY: Record<DayPhase, { top: string; horizon: string; light: string; shade: string }> = {
  night: { top: '#0c1322', horizon: '#141417', light: '#384052', shade: '#191d27' },
  dawn: { top: '#1a2138', horizon: '#3a2a26', light: '#b98a72', shade: '#3a3040' },
  day: { top: '#1f3550', horizon: '#18202b', light: '#9aa6b6', shade: '#3e4756' },
  dusk: { top: '#1a1f36', horizon: '#40291f', light: '#c78a5e', shade: '#3b2e3a' },
};

const RAMPS: Record<string, Scene['ramp']> = {
  ice: ['#202329', '#2c3f55', '#4f7192', '#8fb3d6', '#e6f0ff'],
  rain: ['#202329', '#1e3654', '#2b5a8c', '#4a8bd0', '#9cc8ff'],
  sun: ['#24221f', '#4a3618', '#8a5d1e', '#d08e2c', '#ffd59a'],
  night: ['#202329', '#24384a', '#356179', '#5a9bb3', '#b7e3ef'],
  cloud: ['#222327', '#363a41', '#59606b', '#8c95a2', '#d6dbe2'],
};

export interface SceneContext {
  phase?: DayPhase;
  wind?: number;
  cloudCover?: number; // 0..100 from the live reading
  gusts?: number;
  live?: Pick<LiveWeather, 'sunrise' | 'sunset'> | null;
}

export function buildScene(kind: SceneKind, intensity = 0.6, ctx: SceneContext = {}, label?: string): Scene {
  const t = Math.max(0, Math.min(1, intensity));
  const wind = ctx.wind ?? 0.25;
  const phase: DayPhase =
    ctx.phase ?? (kind === 'clear-day' ? 'day' : kind === 'clear-night' ? 'night' : 'night');
  const palette = SKY[phase];
  const gustiness = ctx.gusts ? Math.min(1, ctx.gusts / 50) : 0.3;
  const base: PixelSnowProps = {
    wind,
    pixelSize: 3,
    depth: 0.7,
    mouseInteraction: true,
    intro: true,
    sway: 0.5 + gustiness * 0.6,
  };
  const isNightish = phase === 'night';
  const body: SkyConfig['body'] = isNightish ? 'moon' : 'sun';
  const life = (overrides: Partial<SkyLife> = {}): SkyLife => ({
    planes: 0.8,
    contrails: !isNightish,
    birds: phase !== 'night',
    shootingStars: false,
    lights: isNightish ? 'night' : 'day',
    ...overrides,
  });

  const sky = (cover: number, darkness = 0, overrides: Partial<SkyConfig> = {}): SkyConfig => ({
    cover: ctx.cloudCover != null ? Math.max(cover * 0.5, ctx.cloudCover / 100) : cover,
    darkness,
    top: hex(palette.top),
    horizon: hex(palette.horizon),
    light: hex(palette.light),
    shade: hex(palette.shade),
    body,
    bodyPos: bodyPosition(ctx.live ?? null),
    moonPhase: moonPhase(),
    windDrift: wind,
    ...overrides,
  });

  switch (kind) {
    case 'snow':
      return {
        kind,
        label: label ?? 'Snow',
        ramp: RAMPS.ice,
        life: life({ planes: 0.35, contrails: false, birds: false }),
        sky: sky(lerp(0.7, 0.95, t), 0.2, {
          light: hex(isNightish ? '#454e60' : '#9ea7b4'),
          shade: hex(isNightish ? '#262c38' : '#5a6270'),
        }),
        snow: {
          ...base,
          variant: 'snowflake',
          color: '#f4f8ff',
          density: lerp(0.18, 0.5, t),
          speed: lerp(0.8, 1.3, t),
          flakeSize: lerp(0.8, 1.15, t),
          glow: 0.6,
          twinkle: 0.15,
          brightness: 0.85,
          accumulate: true,
          opacity: 0.7,
        },
      };
    case 'rain':
    case 'drizzle':
    case 'storm': {
      const heavy = kind === 'storm' ? Math.max(t, 0.85) : kind === 'drizzle' ? t * 0.45 : t;
      return {
        kind,
        label: label ?? (kind === 'storm' ? 'Thunderstorm' : kind === 'drizzle' ? 'Drizzle' : 'Rain'),
        ramp: RAMPS.rain,
        lightning: kind === 'storm',
        life: life({ planes: kind === 'storm' ? 0 : 0.4, contrails: false, birds: false }),
        sky: sky(lerp(0.8, 1, heavy), kind === 'storm' ? 0.9 : heavy * 0.5, {
          top: hex(kind === 'storm' ? '#10141c' : '#141a24'),
          light: hex(kind === 'storm' ? '#4a5262' : '#6a7484'),
          shade: hex(kind === 'storm' ? '#14171e' : '#262b35'),
          body: 'none',
        }),
        snow: {
          ...base,
          variant: 'rain',
          color: '#a8c3ea',
          density: lerp(0.16, 0.6, heavy),
          speed: lerp(6, 13, heavy),
          flakeSize: lerp(0.6, 1.2, heavy),
          wind: wind * 1.6,
          sway: 0.03,
          glow: 0.3,
          twinkle: 0,
          brightness: 0.85,
          depth: 0.85,
          opacity: 0.75,
        },
      };
    }
    case 'fog':
      return {
        kind,
        label: label ?? 'Fog',
        ramp: RAMPS.cloud,
        fog: true,
        sky: sky(0.95, 0.1, { light: hex('#6c727c'), shade: hex('#2e3138'), body: 'none' }),
        life: life({ planes: 0.5, contrails: false, birds: false }),
        snow: null,
      };
    case 'cloudy':
      return {
        kind,
        label: label ?? 'Cloudy',
        ramp: RAMPS.cloud,
        sky: sky(lerp(0.45, 0.9, t), t * 0.3),
        life: life({ contrails: false }),
        snow: null,
      };
    case 'clear-day':
      return {
        kind,
        label: label ?? 'Clear',
        ramp: RAMPS.sun,
        sky: sky(lerp(0.12, 0.3, t), 0, { body: 'sun' }),
        life: life({ planes: 1 }),
        snow: null,
      };
    case 'clear-night':
    default:
      return {
        kind: 'clear-night',
        label: label ?? 'Clear night',
        ramp: RAMPS.night,
        sky: sky(lerp(0.12, 0.3, t), 0, { body: 'moon' }),
        life: life({ planes: 1, shootingStars: true, birds: false, contrails: false, lights: 'night' }),
        snow: null,
      };
  }
}

export function sceneFromWeather(w: LiveWeather): Scene {
  const { kind, intensity, label } = classify(w.code, w.isDay);
  return buildScene(
    kind,
    intensity,
    {
      phase: dayPhase(w),
      wind: windFromWeather(w),
      cloudCover: w.cloudCover,
      gusts: w.windGusts,
      live: w,
    },
    label,
  );
}
