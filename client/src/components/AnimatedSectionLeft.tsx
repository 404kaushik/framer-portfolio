import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSectionLeft({ children, className }: AnimatedSectionProps) {
  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
