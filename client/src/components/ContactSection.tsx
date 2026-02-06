"use client"

import { motion } from "framer-motion"

interface ContactSectionProps {
  email: string
  socialLinks?: {
    linkedin?: string
    instagram?: string
    github?: string
  }
}

export function ContactSection({ email, socialLinks = {} }: ContactSectionProps) {
  const socials = [
    { label: "LinkedIn", href: socialLinks.linkedin },
    { label: "Instagram", href: socialLinks.instagram },
    { label: "GitHub", href: socialLinks.github },
  ].filter((item) => item.href)

  return (
    <section id="contact" className="relative bg-[#0e0e10] px-6 sm:px-10 md:px-16">
      {/* Top divider */}
      <div className="max-w-3xl mx-auto">
        <div className="h-px bg-white/6" />
      </div>

      <div className="max-w-3xl mx-auto py-28 sm:py-36 md:py-44">
        {/* Small label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/20 mb-10 sm:mb-14"
        >
          Get in touch
        </motion.p>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-tight leading-[1.15]"
        >
          Have an idea?
          <br />
          <span className="text-white/30">Let's make it real.</span>
        </motion.h2>

        {/* Email — the focal point */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16"
        >
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-baseline gap-3"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-light text-white/50 group-hover:text-white/90 transition-colors duration-300 border-b border-white/0 group-hover:border-white/20 pb-0.5">
              {email}
            </span>
            <span className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-300 text-sm">
              ↗
            </span>
          </a>
        </motion.div>

        {/* Social links — secondary, horizontal, subtle */}
        {socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="mt-16 sm:mt-20 flex items-center gap-6 sm:gap-8"
          >
            {socials.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white hover:text-white/60 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer line */}
      <div className="max-w-3xl mx-auto">
        <div className="h-px bg-white/6" />
        <div className="py-8 flex items-center justify-between">
          <span className="text-[11px] text-white tracking-wide">
            © {new Date().getFullYear()}
          </span>
          <span className="text-[11px] text-white tracking-wide">
            Kaushik Nag Tumu
          </span>
        </div>
      </div>
    </section>
  )
}
