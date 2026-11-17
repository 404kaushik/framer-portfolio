export const GITHUB_USER = '404kaushik';

export interface Day {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export interface GitHubData {
  days: Day[]; // every day we have, oldest first, never in the future
  yearTotals: Record<string, number>;
  repos: Repo[]; // non-fork, most recently pushed first
  languages: { name: string; share: number }[];
  publicRepos: number;
  followers: number;
  joined: string;
}

/** GitHub's own linguist colours for the languages likely to appear. */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#663399',
  'Jupyter Notebook': '#DA5B0B',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

const CACHE_KEY = `github:${GITHUB_USER}:v1`;
const CACHE_MS = 30 * 60 * 1000;

export async function fetchGitHub(signal?: AbortSignal): Promise<GitHubData> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data as GitHubData;
  } catch {
    /* storage unavailable */
  }

  const [calendarRes, userRes, reposRes] = await Promise.all([
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=all`, { signal }),
    fetch(`https://api.github.com/users/${GITHUB_USER}`, { signal }),
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, { signal }),
  ]);
  if (!calendarRes.ok) throw new Error('Contribution calendar unavailable');
  const calendar = await calendarRes.json();
  const user = userRes.ok ? await userRes.json() : null;
  const rawRepos: any[] = reposRes.ok ? await reposRes.json() : [];

  const today = new Date().toISOString().slice(0, 10);
  const days: Day[] = (calendar.contributions as Day[])
    .filter(d => d.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const own = rawRepos.filter(r => !r.fork && r.name.toLowerCase() !== GITHUB_USER.toLowerCase());
  const repos: Repo[] = own.map(r => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    pushedAt: r.pushed_at,
  }));

  const counts = new Map<string, number>();
  own.forEach(r => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5).map(([name, n]) => ({ name, share: n / total }));
  const rest = sorted.slice(5).reduce((a, [, n]) => a + n, 0);
  if (rest) top.push({ name: 'Other', share: rest / total });

  const data: GitHubData = {
    days,
    yearTotals: calendar.total,
    repos,
    languages: top,
    publicRepos: user?.public_repos ?? repos.length,
    followers: user?.followers ?? 0,
    joined: user?.created_at ?? '',
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable */
  }
  return data;
}

export interface RangeStats {
  total: number;
  activeDays: number;
  longestStreak: number;
  busiestWeekday: string | null;
  bestDay: Day | null;
}

export function statsFor(days: Day[]): RangeStats {
  let total = 0;
  let activeDays = 0;
  let streak = 0;
  let longestStreak = 0;
  let bestDay: Day | null = null;
  const byWeekday = new Array(7).fill(0);
  for (const d of days) {
    total += d.count;
    if (d.count > 0) {
      activeDays++;
      streak++;
      longestStreak = Math.max(longestStreak, streak);
      byWeekday[new Date(`${d.date}T12:00:00Z`).getUTCDay()] += d.count;
      if (!bestDay || d.count > bestDay.count) bestDay = d;
    } else streak = 0;
  }
  const max = Math.max(...byWeekday);
  const names = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
  return {
    total,
    activeDays,
    longestStreak,
    busiestWeekday: max > 0 ? names[byWeekday.indexOf(max)] : null,
    bestDay,
  };
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - Date.parse(iso);
  const day = 86400000;
  if (diff < 3600000) return `${Math.max(1, Math.round(diff / 60000))} min ago`;
  if (diff < day) return `${Math.round(diff / 3600000)} h ago`;
  if (diff < 30 * day) return `${Math.round(diff / day)} d ago`;
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' });
}
