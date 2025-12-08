"use client"

import { motion } from "framer-motion"

interface ContactSectionProps {
  email: string
  socialLinks?: {
    linkedin?: string
    instagram?: string
  }
}

export function ContactSection({ email, socialLinks = {} }: ContactSectionProps) {
  const links = [
    { label: "Mail", href: `mailto:${email}` },
    { label: "Instagram", href: socialLinks.instagram },
    { label: "LinkedIn", href: socialLinks.linkedin },
  ].filter((item) => item.href)

  return (
    <section id="contact" className="bg-[#1a1a1a] py-24 px-8 md:px-16">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* Left side - Contact heading */}
        <h2 className="text-2xl md:text-4xl font-normal text-white tracking-tight">Contact</h2>

        {/* Right side - Links */}
        <nav className="flex flex-col gap-6 md:w-1/2">
          {links.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label !== "Mail" ? "_blank" : undefined}
              rel={link.label !== "Mail" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-[#888888] hover:text-white text-lg flex items-center gap-2 transition-colors duration-300"
            >
              {link.label}
              <span className="text-[#888888]">→</span>
            </motion.a>
          ))}
        </nav>
      </div>
    </section>
  )
}
