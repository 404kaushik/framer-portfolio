import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const links = [
  { label: 'work', href: '#work' },
  { label: 'skills', href: '#proficiencies' },
  { label: 'education', href: '#education' },
  { label: 'awards', href: '#awards' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  // Track which section is in view
  useEffect(() => {
    const ids = ['home', ...links.map((l) => l.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.2, rootMargin: '-60px 0px -40% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-[#141417]/90 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        {/* Single thin line that fades in on scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-white/6 transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Name */}
          <a
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="text-[15px] text-white/50 hover:text-white/90 transition-colors duration-300 select-none"
          >
            kaushik.
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-9">
            {links.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="relative py-1"
                >
                  <span
                    className={`text-[13px] tracking-wide transition-colors duration-300 ${
                      isActive
                        ? 'text-white/90'
                        : 'text-white/25 hover:text-white/60'
                    }`}
                  >
                    {link.label}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-1 h-px bg-white/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Mobile toggle — just text, not an icon */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-[13px] tracking-wide text-white/30 hover:text-white/60 transition-colors duration-300 cursor-pointer select-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — barely there */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel — clean, flat, no glow, no border radius */}
            <motion.nav
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-14 left-0 right-0 z-50 bg-[#141417] md:hidden"
            >
              <div className="h-px bg-white/6" />

              <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-1">
                {links.map((link, i) => {
                  const isActive = active === link.href.slice(1);
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => scrollTo(e, link.href)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.15 }}
                      className={`py-3 transition-colors duration-300 flex items-center justify-between ${
                        isActive
                          ? 'text-white/90'
                          : 'text-white/20 active:text-white/50'
                      }`}
                    >
                      <span className="text-2xl tracking-tight font-light">
                        {link.label}
                      </span>
                      {isActive && (
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                      )}
                    </motion.a>
                  );
                })}
              </div>

              <div className="h-px bg-white/6" />
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
