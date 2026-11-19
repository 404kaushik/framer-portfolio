import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaStar } from 'react-icons/fa';
import { useWeather } from '@/contexts/WeatherContext';
import {
  GITHUB_USER,
  LANGUAGE_COLORS,
  fetchGitHub,
  relativeTime,
  statsFor,
  type Day,
  type GitHubData,
} from '@/lib/github';

const GAP = 3;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;

type Range = 'last' | string; // 'last' = trailing 12 months, otherwise a year

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Days for a range, padded so every column is a Sunday-to-Saturday week. */
function weeksFor(days: Day[], range: Range): { weeks: (Day | null)[][]; inRange: Day[] } {
  const byDate = new Map(days.map(d => [d.date, d]));
  const today = new Date();
  let start: Date;
  let end: Date;
  if (range === 'last') {
    end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 364);
  } else {
    const y = Number(range);
    start = new Date(Date.UTC(y, 0, 1));
    end = new Date(Date.UTC(y, 11, 31));
    const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (end > todayUtc) end = todayUtc;
  }
  const inRange: Day[] = [];
  const weeks: (Day | null)[][] = [];
  const cursor = new Date(start);
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());
  while (cursor <= end) {
    const week: (Day | null)[] = [];
    for (let i = 0; i < 7; i++) {
      const key = iso(cursor);
      if (cursor < start || cursor > end) week.push(null);
      else {
        const day = byDate.get(key) ?? { date: key, count: 0, level: 0 as const };
        week.push(day);
        inRange.push(day);
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return { weeks, inRange };
}

const formatDay = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

export function GitHubSection() {
  const { scene } = useWeather();
  const [data, setData] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);
  const [range, setRange] = useState<Range>('last');

  useEffect(() => {
    const controller = new AbortController();
    fetchGitHub(controller.signal)
      .then(setData)
      .catch(err => err?.name !== 'AbortError' && setFailed(true));
    return () => controller.abort();
  }, []);

  const years = useMemo(() => {
    if (!data) return [];
    const current = String(new Date().getFullYear());
    return Object.keys(data.yearTotals)
      .filter(y => y !== current && data.yearTotals[y] > 0)
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 3);
  }, [data]);

  const { weeks, inRange } = useMemo(() => weeksFor(data?.days ?? [], range), [data, range]);
  const stats = useMemo(() => statsFor(inRange), [inRange]);
  const recent = data?.repos.slice(0, 3) ?? [];

  return (
    <section id="github" className="site-section">
      <div className="site-wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="font-mono text-[12px] tabular-nums text-[#7a7a7a]">05</p>
            <h2 className="section-title mt-3 text-[#f2f2f2]">GitHub activity</h2>
            <p className="mt-4 text-[15px] text-[#9a9a9a]">
              Live from <span className="text-[#E2E2E2]">@{GITHUB_USER}</span>
              {data ? ` · ${data.publicRepos} public repositories` : ''}
            </p>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="gh-btn inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-white/15 px-4 text-sm text-[#f2f2f2] hover:border-white/30 hover:bg-white/[0.06] md:self-auto"
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            View GitHub profile
          </a>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#18181b]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm sm:p-6 md:p-8">
          {/* Status row + range tabs */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-[#919191]">
              <span className="relative flex h-1.5 w-1.5">
                {data && <span className="live-ring absolute inset-0 rounded-full bg-emerald-400" />}
                <span className={`relative h-1.5 w-1.5 rounded-full ${data ? 'bg-emerald-400' : 'bg-[#555]'}`} />
              </span>
              {data
                ? `Last push ${relativeTime(data.repos[0]?.pushedAt ?? new Date().toISOString())}`
                : failed
                  ? 'GitHub is not answering right now'
                  : 'Loading contributions…'}
            </div>
            <div role="tablist" aria-label="Contribution range" className="flex gap-1 rounded-full bg-white/[0.04] p-1 text-xs">
              {(['last', ...years] as Range[]).map(r => {
                const active = r === range;
                return (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setRange(r)}
                    className={`gh-tab relative rounded-full px-3 py-1.5 transition-colors duration-200 ${
                      active ? 'text-[#0e0e10]' : 'text-[#919191] hover:text-[#E2E2E2]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="gh-tab-indicator"
                        className="absolute inset-0 rounded-full bg-[#E2E2E2]"
                        transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                      />
                    )}
                    <span className="relative">{r === 'last' ? 'Last 12 months' : r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Stat label="Contributions" value={data ? stats.total.toLocaleString() : '—'} />
            <Stat label="Active days" value={data ? String(stats.activeDays) : '—'} />
            <Stat label="Longest streak" value={data ? `${stats.longestStreak} d` : '—'} />
            <Stat label="Most active" value={data ? (stats.busiestWeekday ?? '—') : '—'} />
          </dl>

          <ContributionGraph weeks={weeks} ramp={scene.ramp} />

          {/* Languages */}
          {data && data.languages.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm text-[#E2E2E2]">Languages across repositories</h3>
              <PixelBar languages={data.languages} />
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#919191]">
                {data.languages.map(l => (
                  <li key={l.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2" style={{ background: LANGUAGE_COLORS[l.name] ?? '#6b7280' }} />
                    {l.name}
                    <span className="text-[#666]">{Math.round(l.share * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recently pushed repositories */}
        {recent.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {recent.map(repo => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="lift-card group flex flex-col rounded-2xl border border-white/[0.08] bg-[#18181b]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[13px] leading-5 text-[#E2E2E2] [overflow-wrap:anywhere]">
                    {/* Let long names wrap at their hyphens, not mid-word. */}
                    {repo.name.split(/(?<=[-_])/).map((part, i) => (
                      <span key={i} className="whitespace-nowrap">
                        {part}
                        <wbr />
                      </span>
                    ))}
                  </span>
                  <svg
                    className="lift-arrow mt-0.5 h-3.5 w-3.5 shrink-0 text-[#919191] group-hover:text-[#E2E2E2]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M5 11L11 5M6 5h5v5" />
                  </svg>
                </div>
                {repo.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-[#919191]">{repo.description}</p>
                )}
                <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-[#919191]">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2" style={{ background: LANGUAGE_COLORS[repo.language] ?? '#6b7280' }} />
                      {repo.language}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1">
                      <FaStar className="h-3 w-3" aria-hidden="true" />
                      {repo.stars}
                    </span>
                  )}
                  <span className="ml-auto">{relativeTime(repo.pushedAt)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[#919191]">{label}</dt>
      <dd className="mt-1 text-2xl tracking-tight text-[#E2E2E2] tabular-nums">{value}</dd>
    </div>
  );
}

function PixelBar({ languages }: { languages: { name: string; share: number }[] }) {
  const BLOCKS = 48;
  // Largest-remainder split so the blocks always add up to the full bar.
  const raw = languages.map(l => l.share * BLOCKS);
  const counts = raw.map(Math.floor);
  let left = BLOCKS - counts.reduce((a, b) => a + b, 0);
  raw
    .map((v, i) => [v - Math.floor(v), i] as const)
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => left-- > 0 && counts[i]++);
  const blocks = languages.flatMap((l, i) => new Array(counts[i]).fill(LANGUAGE_COLORS[l.name] ?? '#6b7280'));
  return (
    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${BLOCKS}, minmax(0, 1fr))` }} aria-hidden="true">
      {blocks.map((c, i) => (
        <span key={i} className="h-2.5" style={{ background: c }} />
      ))}
    </div>
  );
}

function ContributionGraph({ weeks, ramp }: { weeks: (Day | null)[][]; ramp: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<{ day: Day; x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Fit as many recent weeks as the card allows (cells never under 7px), then let them fill the width.
  const MIN = 7;
  const fit = width ? Math.max(13, Math.floor((width + GAP) / (MIN + GAP))) : weeks.length;
  const shown = weeks.slice(-Math.min(weeks.length, fit));
  const columns = { display: 'grid', gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))`, columnGap: GAP };

  // One label per month, at the week holding its 1st; drop any that would collide.
  let lastAt = -4;
  const monthLabels = shown.map((week, i) => {
    const first = week.find(d => d && d.date.endsWith('-01')) ?? (i === 0 ? week.find(Boolean) : null);
    if (!first || i - lastAt < 4) return '';
    lastAt = i;
    return MONTHS[Number(first.date.slice(5, 7)) - 1];
  });

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={() => setHover(null)}>
      <div className="mb-1.5 text-[10px] text-[#666]" style={columns} aria-hidden="true">
        {monthLabels.map((m, i) => (
          <span key={i} className="overflow-visible whitespace-nowrap">
            {m}
          </span>
        ))}
      </div>
      <div style={columns} role="grid" aria-label="Contribution calendar">
        {shown.map((week, w) => (
          <div key={w} className="flex flex-col" style={{ gap: GAP }} role="row">
            {week.map((day, d) =>
              day ? (
                <span
                  key={d}
                  role="gridcell"
                  tabIndex={-1}
                  aria-label={`${day.count} contributions on ${formatDay(day.date)}`}
                  className="gh-cell block aspect-square w-full"
                  style={{ background: ramp[day.level] }}
                  onMouseEnter={e => {
                    const box = wrapRef.current!.getBoundingClientRect();
                    const r = e.currentTarget.getBoundingClientRect();
                    setHover({ day, x: r.left - box.left + r.width / 2, y: r.top - box.top });
                  }}
                />
              ) : (
                <span key={d} className="block aspect-square w-full" />
              ),
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-[#666]" aria-hidden="true">
        Less
        {ramp.map(c => (
          <span key={c} className="gh-cell" style={{ width: 10, height: 10, background: c }} />
        ))}
        More
      </div>
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/10 bg-[#0e0e10] px-2 py-1 text-[11px] text-[#E2E2E2] shadow-lg"
          style={{
            left: Math.min(Math.max(hover.x, 80), width - 80),
            top: hover.y - 6,
          }}
        >
          <span className="tabular-nums">{hover.day.count}</span>{' '}
          {hover.day.count === 1 ? 'contribution' : 'contributions'}
          <span className="text-[#919191]"> · {formatDay(hover.day.date)}</span>
        </div>
      )}
    </div>
  );
}
