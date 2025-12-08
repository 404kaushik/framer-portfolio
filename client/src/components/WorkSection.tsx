import { motion } from 'framer-motion';
import { FaBriefcase } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import { AnimatedSection } from './AnimatedSection';
import { IoLocationOutline } from "react-icons/io5";

interface WorkItem {
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
}

interface WorkSectionProps {
  items: WorkItem[];
}

export function WorkSection({ items }: WorkSectionProps) {
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
    <section id="work" className="w-full mx-auto  md:py-2 px-4 sm:px-6">
      <div className="container max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 md:mb-0">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-2xl mb-6 md:mb-0">Work</h2>
          </AnimatedSection>
        

        {/* Work Items Container */}
        <div className="w-full md:w-80 md:ml-auto space-y-6 md:space-y-0">
          {/* Work Item 1 - Current */}
          <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8">
            <h3 className="text-base sm:text-lg md:text-md font-light flex flex-wrap items-center gap-2">
              Software Engineer
              <span className='inline-block text-[#ffff] text-xs font-light px-2 py-1 bg-[#de8509c8] drop-shadow-xs drop-shadow-amber-400 rounded-lg'>
                Current
              </span>
            </h3>
            
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2025 - Now
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                <FaBriefcase className="shrink-0" />
                <span>Designed Securities Ltd.</span>
              </div>
              <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                <IoLocationOutline className="w-4 h-4" />
                Peterborough
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3">
              <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2025 - Now
              </span>
              <div className="relative w-full md:mr-4 group">
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center gap-2 text-xs font-base text-[#919191] whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                    <FaBriefcase className="shrink-0" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      Designed Securities Ltd.
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="ml-auto">
                <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                  <IoLocationOutline className="w-4 h-4" />
                  Peterborough
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
              Building scalable web applications and leading frontend architecture decisions.
            </p>
          </div>

          {/* Work Item 2 */}
          <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8 md:py-8">
            <h3 className="text-base sm:text-lg md:text-md font-light">
              Software Engineer
            </h3>
            
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2024 - 2025
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                <FaBriefcase className="shrink-0" />
                <span>Designed Securities Ltd.</span>
              </div>
              <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                <IoLocationOutline className="w-4 h-4" />
                Peterborough
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3">
              <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2024 - 2025
              </span>
              <div className="relative w-full md:mr-7 group">
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center gap-2 text-xs font-base text-[#919191] whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                    <FaBriefcase className="shrink-0" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      Designed Securities Ltd.
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="ml-auto">
                <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                  <IoLocationOutline className="w-4 h-4" />
                  Peterborough
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
              Building scalable web applications and leading frontend architecture decisions.
            </p>
          </div>

          {/* Work Item 3 */}
          <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8 md:py-8">
            <h3 className="text-base sm:text-lg md:text-md font-light">
              Software Engineer
            </h3>
            
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2023 - 2024
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                <FaBriefcase className="shrink-0" />
                <span>Designed Securities Ltd.</span>
              </div>
              <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                <IoLocationOutline className="w-4 h-4" />
                Peterborough
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3">
              <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2023 - 2024
              </span>
              <div className="relative w-full md:mr-7 group">
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center gap-2 text-xs font-base text-[#919191] whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                    <FaBriefcase className="shrink-0" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      Designed Securities Ltd.
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="ml-auto">
                <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                  <IoLocationOutline className="w-4 h-4" />
                  Peterborough
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
              Building scalable web applications and leading frontend architecture decisions.
            </p>
          </div>

          {/* Work Item 4 */}
          <div className="space-y-3 md:space-y-1 pb-6 md:pb-8 md:py-8">
            <h3 className="text-base sm:text-lg md:text-md font-light">
              Software Engineer
            </h3>
            
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2022 - 2023
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                <FaBriefcase className="shrink-0" />
                <span>Designed Securities Ltd.</span>
              </div>
              <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                <IoLocationOutline className="w-4 h-4" />
                Peterborough
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3">
              <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2022 - 2023
              </span>
              <div className="relative w-full md:mr-7 group">
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center gap-2 text-xs font-base text-[#919191] whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                    <FaBriefcase className="shrink-0" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      Designed Securities Ltd.
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="ml-auto">
                <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                  <IoLocationOutline className="w-4 h-4" />
                  Peterborough
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
              Building scalable web applications and leading frontend architecture decisions.
            </p>
          </div>
        </div>

        {/* Decorative divider */}
      </div>
      </div>
        <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-px bg-linear-to-r from-transparent via-[#919191]/50 to-transparent mt-12 md:mt-16 origin-left"
            />
    </section>
  );
}