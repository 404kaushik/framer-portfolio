import { motion } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';


export function AwardSection() {
  const style = document.createElement('style');
  style.textContent = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(style);
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <section id="awards" className="w-full mx-auto py-12 md:py-20 px-4 sm:px-6">
      <div className="container max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 md:mb-0">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-2xl font-light mb-6 md:mb-0">Awards</h2>
          </AnimatedSection>
          {/* Awards Items Container */}
          <div className="w-full md:w-80 md:ml-auto space-y-4 md:space-y-4">
            {/* Award Item 1 */}
            <div className="space-y-2 md:space-y-1 border-b border-[#919191]/25 pb-4 md:pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-md font-light mb-1">
                    Award 1
                  </h3>
                  <p className="text-sm sm:text-base md:text-sm font-base text-[#919191]">
                    2025 at xyz place
                  </p>
                </div>
              </div>
            </div>

            {/* Award Item 2 */}
            <div className="space-y-2 md:space-y-1 border-b border-[#919191]/25 pb-4 md:pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-md font-light mb-1">
                    Award 2
                  </h3>
                  <p className="text-sm sm:text-base md:text-sm font-base text-[#919191]">
                    2021 at xyz place
                  </p>
                </div>
              </div>
            </div>

            {/* Award Item 3 */}
            <div className="space-y-2 md:space-y-1 border-b border-[#919191]/25 pb-4 md:pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-md font-light mb-1">
                    Award 3
                  </h3>
                  <p className="text-sm sm:text-base md:text-sm font-base text-[#919191]">
                    2019 at xyz place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="section-divider mt-12 md:mt-16 origin-left"
        />
      </div>
    </section>
  );
}