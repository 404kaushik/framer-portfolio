import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  buildScene,
  dayPhase,
  fetchWeather,
  sceneFromWeather,
  windFromWeather,
  type LiveWeather,
  type Scene,
  type SceneKind,
} from '@/lib/weather';

const REFRESH_MS = 10 * 60 * 1000;

export type WeatherMode = SceneKind | 'live';

interface WeatherState {
  live: LiveWeather | null;
  failed: boolean;
  mode: WeatherMode;
  setMode: (mode: WeatherMode) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  scene: Scene;
}

const WeatherContext = createContext<WeatherState | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<LiveWeather | null>(null);
  const [failed, setFailed] = useState(false);
  // `?weather=storm` (or snow, rain, fog, cloudy, clear-day, clear-night) opens on a preview.
  const [mode, setMode] = useState<WeatherMode>(() => {
    const kinds: WeatherMode[] = ['snow', 'rain', 'drizzle', 'storm', 'fog', 'cloudy', 'clear-day', 'clear-night'];
    const asked = new URLSearchParams(window.location.search).get('weather') as WeatherMode | null;
    return asked && kinds.includes(asked) ? asked : 'live';
  });
  const [paused, setPaused] = useState(false);
  // Re-derive the sky every minute so the sun and moon keep moving along their arc.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const load = () =>
      fetchWeather(controller.signal)
        .then(w => {
          setLive(w);
          setFailed(false);
        })
        .catch(err => {
          if (err?.name !== 'AbortError') setFailed(true);
        });
    load();
    const refresh = window.setInterval(load, REFRESH_MS);
    const minute = window.setInterval(() => setTick(t => t + 1), 60_000);
    return () => {
      controller.abort();
      window.clearInterval(refresh);
      window.clearInterval(minute);
    };
  }, []);

  const scene = useMemo(() => {
    if (mode === 'live') {
      return live ? sceneFromWeather(live) : buildScene('cloudy', 0.6, {}, 'Loading');
    }
    // A preview keeps Toronto's real time of day and wind so it still feels "now".
    const phase = mode === 'clear-day' ? 'day' : mode === 'clear-night' ? 'night' : live ? dayPhase(live) : 'night';
    return buildScene(mode, 0.75, {
      phase,
      wind: live ? windFromWeather(live) : 0.35,
      gusts: live?.windGusts,
      live,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, live, tick]);

  const value = useMemo(
    () => ({ live, failed, mode, setMode, paused, setPaused, scene }),
    [live, failed, mode, paused, scene],
  );
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(): WeatherState {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used inside <WeatherProvider>');
  return ctx;
}
