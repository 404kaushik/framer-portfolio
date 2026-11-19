import { useEffect, type ReactNode } from 'react';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { ArrowRight, CloudSun, Copy, Hash, Pause, Play, FolderOpen } from 'lucide-react';
import { projects } from '../data/projects';
import { useWeather, type WeatherMode } from '@/contexts/WeatherContext';
import { lockScroll, scrollToY } from '@/lib/smoothScroll';

export const EMAIL = 'kaushiknag72@outlook.com';

export const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/404kaushik', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kaushiknagtumu', icon: FaLinkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/kaushiknag', icon: FaInstagram },
];

const WEATHER: { mode: WeatherMode; label: string }[] = [
  { mode: 'live', label: 'Live Toronto weather' },
  { mode: 'snow', label: 'Snow' },
  { mode: 'rain', label: 'Rain' },
  { mode: 'storm', label: 'Thunderstorm' },
  { mode: 'fog', label: 'Fog' },
  { mode: 'cloudy', label: 'Overcast' },
  { mode: 'clear-night', label: 'Clear night' },
  { mode: 'clear-day', label: 'Sunny day' },
];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (id === 'home' || !el) {
    scrollToY(0, 1.4);
    return;
  }
  scrollToY(el.getBoundingClientRect().top + window.scrollY - 24);
}

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    toast.success('Email copied', { description: EMAIL });
  } catch {
    window.location.href = `mailto:${EMAIL}`;
  }
}

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [, setLocation] = useLocation();
  const { mode, setMode, paused, setPaused } = useWeather();

  // ⌘K / Ctrl+K anywhere, or "/" when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input, textarea, [contenteditable="true"]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    lockScroll(open);
  }, [open]);

  const run = (fn: () => void) => () => {
    onOpenChange(false);
    // Let the dialog close before scrolling or routing.
    window.setTimeout(fn, 60);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cmd-overlay fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="cmd-panel fixed left-1/2 top-[12vh] z-[61] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#141417]/95 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <Dialog.Title className="sr-only">Command menu</Dialog.Title>
          <Command loop className="text-sm text-[#E2E2E2]">
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
              <Hash className="h-4 w-4 text-[#5c5c5c]" aria-hidden="true" />
              <Command.Input
                autoFocus
                placeholder="Jump to a section, project or weather…"
                className="h-14 flex-1 bg-transparent text-[15px] text-[#E2E2E2] placeholder:text-[#5c5c5c] focus:outline-none"
              />
              <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#7a7a7a]">esc</kbd>
            </div>
            <Command.List data-lenis-prevent className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-[#7a7a7a]">Nothing matches that.</Command.Empty>

              <Group heading="Go to">
                {SECTIONS.map(s => (
                  <Item key={s.id} onSelect={run(() => scrollToSection(s.id))} icon={<ArrowRight className="h-4 w-4" />}>
                    {s.label}
                  </Item>
                ))}
              </Group>

              <Group heading="Projects">
                {projects.map(p => (
                  <Item
                    key={p.slug}
                    value={`project ${p.name} ${p.skills.join(' ')}`}
                    onSelect={run(() => setLocation(`/projects/${p.slug}`))}
                    icon={<FolderOpen className="h-4 w-4" />}
                    hint={p.year}
                  >
                    {p.name}
                  </Item>
                ))}
              </Group>

              <Group heading="Contact">
                <Item onSelect={run(copyEmail)} icon={<Copy className="h-4 w-4" />} hint={EMAIL}>
                  Copy email address
                </Item>
                {SOCIALS.map(s => (
                  <Item key={s.label} onSelect={run(() => window.open(s.href, '_blank', 'noopener'))} icon={<s.icon className="h-4 w-4" />}>
                    Open {s.label}
                  </Item>
                ))}
              </Group>

              <Group heading="Weather">
                {WEATHER.map(w => (
                  <Item
                    key={w.mode}
                    value={`weather ${w.label}`}
                    onSelect={run(() => setMode(w.mode))}
                    icon={<CloudSun className="h-4 w-4" />}
                    hint={mode === w.mode ? 'On' : undefined}
                  >
                    {w.label}
                  </Item>
                ))}
                <Item
                  value="weather pause play animation"
                  onSelect={run(() => setPaused(!paused))}
                  icon={paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                >
                  {paused ? 'Play the sky' : 'Pause the sky'}
                </Item>
              </Group>
            </Command.List>
            <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-2.5 text-[11px] text-[#5c5c5c]">
              <span>
                <kbd className="font-mono">↑↓</kbd> move · <kbd className="font-mono">↵</kbd> open
              </span>
              <span>
                <kbd className="font-mono">⌘K</kbd> or <kbd className="font-mono">/</kbd> anywhere
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Group({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#5c5c5c]"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  children,
  icon,
  hint,
  value,
  onSelect,
}: {
  children: ReactNode;
  icon: ReactNode;
  hint?: string;
  value?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[#b5b5b5] transition-colors duration-100 data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-[#f2f2f2]"
    >
      <span className="text-[#7a7a7a]">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      {hint && <span className="truncate text-xs text-[#5c5c5c]">{hint}</span>}
    </Command.Item>
  );
}
