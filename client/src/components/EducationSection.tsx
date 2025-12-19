import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import { AnimatedSection } from './AnimatedSection';
import { IoLocationOutline } from "react-icons/io5";
import { GraduationCap } from 'lucide-react';
import { AnimatedSectionLeft } from './AnimatedSectionLeft';

interface EducationItem {
  institution: string;
  degree: string;
  period: string;  
}

interface EducationSectionProps {
  items: EducationItem[];
}

export function EducationSection({ items }: EducationSectionProps) {
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
    <section id="education" className="w-full mx-auto py-12 md:py-2 px-4 sm:px-6">
      <div className="container max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 md:mb-0">
          <AnimatedSection className="md:sticky md:top-20 self-start">
            <h2 className="text-3xl sm:text-4xl md:text-4xl md:font-normal mb-6 md:mb-0">Education</h2>
          </AnimatedSection>
        {/* Education Items Container */}
        <div className="w-full md:w-80 md:ml-auto space-y-6 md:space-y-0">
          <AnimatedSectionLeft>

            {/* Education Item 1 - Highest */}
            <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8">
              <h3 className="text-base sm:text-md md:text-md font-light flex flex-wrap items-center gap-2">
                BBA Honours in Marketing & Econ
                <span className='inline-block text-[#ffff] text-[0.70rem] font-light px-2 py-1 bg-[#de8509c8] drop-shadow-xs drop-shadow-amber-400 rounded-lg'>
                  Highest
                </span>
              </h3>
              
              {/* Mobile/Tablet Layout */}
              <div className="flex flex-col gap-2 md:hidden">
                <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                  <IoCalendarSharp className='w-4 h-4'/> 2021 - 2025
                </span>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                  <FaGraduationCap className="shrink-0" />
                  <span>Trent University</span>
                </div>
                <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                  <IoLocationOutline className="w-4 h-4" />
                  Peterborough
                </p>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-3">
                <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                  <IoCalendarSharp className='w-4 h-4'/> 2021 - 2025
                </span>
                <div className="relative w-full md:mr-4 group">
                  <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="flex items-center gap-2 text-xs font-base text-[#919191] whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                      <FaGraduationCap className="shrink-0" />
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                        Trent University
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
                Comprehensive business education with focus on marketing strategies and economic principles.
              </p>
            </div>
          </AnimatedSectionLeft>

        <AnimatedSectionLeft>

          {/* Education Item 2 - High School */}
          <div className="space-y-3 md:space-y-1 pb-6 md:pb-8 md:py-8">
            <h3 className="text-base sm:text-lg md:text-md font-light">
              High School
            </h3>
            
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2019 - 2021
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                <FaGraduationCap className="shrink-0" />
                <span>Indian Language School</span>
              </div>
              <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                <IoLocationOutline className="w-4 h-4" />
                Peterborough
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3">
              <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                <IoCalendarSharp className='w-4 h-4'/> 2019 - 2021
              </span>
              <div className="relative w-full md:mr-7 group">
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center gap-2 text-xs font-base text-[#919191] whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                    <FaGraduationCap className="shrink-0" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      Indian Language School
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
              Strong academic foundation with focus on core subjects and language development.
            </p>
          </div>
        </AnimatedSectionLeft>
        </div>
        </div>


        {/* Decorative divider */}
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