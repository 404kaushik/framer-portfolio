import { motion } from 'framer-motion';
import { FaBriefcase } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import { AnimatedSection } from './AnimatedSection';
import { AnimatedSectionLeft } from './AnimatedSectionLeft';
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
    <section id="work" className="w-full mx-auto md:py-2 md:my-8 px-4 sm:px-6">
      <div className="container max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 md:mb-0">
          <AnimatedSection className="md:sticky md:top-20 self-start">
            <h2 className="text-3xl sm:text-4xl md:text-4xl md:font-normal mb-6 md:mb-0">Work</h2>
          </AnimatedSection>


          {/* Work Items Container */}
          <div className="w-full md:w-80 md:ml-auto space-y-6 md:space-y-0">
            <AnimatedSectionLeft>

              {/* Work Item 1 - Current */}
              <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8">
                <h3 className="text-base font-gothic sm:text-lg md:text-md font-light flex flex-wrap items-center gap-2">
                  Software Engineer
                  <span className='inline-block text-[#ffff] text-xs font-light px-2 py-1 bg-[#de8509c8] drop-shadow-xs drop-shadow-amber-400 rounded-lg'>
                    Current
                  </span>
                </h3>

                {/* Mobile/Tablet Layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2025 - Now
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                    <FaBriefcase className="shrink-0 w-4 h-4" />
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
                    <IoCalendarSharp className='w-4 h-4' /> 2025 - Now
                  </span>
                  <div className="relative w-full md:mr-4 group">
                      <div className="flex items-center gap-2 text-xs font-base whitespace-nowrap text-white transition-colors duration-300 cursor-pointer">
                        <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <span className="transform translate-x-1 transition-transform duration-300">
                            Designed Securities Ltd.
                          </span>
                        </div>
                      </div>
                    <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="mr-auto">
                    <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                      <IoLocationOutline className="w-4 h-4" />
                      Peterborough
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
                  At designed, I mainly work on maintaining company's data. Primary services I work on daily is Fabric, PowerBI, and Excel.
                </p>
              </div>
            </AnimatedSectionLeft>


            <AnimatedSectionLeft>

              {/* Work Item 2 */}
              <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8 md:py-8">
                <h3 className="text-base sm:text-lg md:text-md font-light">
                  Research Data Assistant
                </h3>

                {/* Mobile/Tablet Layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2024 - 2025
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-white">
                    <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                    <span>Junior Achievement Northern & Eastern Ontario</span>
                  </div>
                  <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                    <IoLocationOutline className="w-4 h-4" />
                    Peterborough
                  </p>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-3">
                  <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2024 - 2025
                  </span>
                  <div className="relative w-full md:mr-4 group">
                      <div className="flex items-center gap-2 text-xs font-base text-white whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                        <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                            Junior Achievement Northern & Eastern Ontario
                          </span>
                        </div>
                      </div>
                    <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="mr-auto">
                    <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                      <IoLocationOutline className="w-4 h-4" />
                      Peterborough
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
                  At Junior Achievement, I was a Research Data Assistant where I was responsible for data collection and analysis for various research projects.
                </p>
              </div>
            </AnimatedSectionLeft>


            <AnimatedSectionLeft>

              {/* Work Item 3 */}
              <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8 md:py-8">
                <h3 className="text-base sm:text-lg md:text-md font-light">
                  Full Stack Developer Intern
                </h3>

                {/* Mobile/Tablet Layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2023 - 2024
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                    <FaBriefcase className="shrink-0 w-4 h-4" />
                    <span>HostelHop</span>
                  </div>
                  <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                    <IoLocationOutline className="w-4 h-4" />
                    Toronto
                  </p>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-3">
                  <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2023 - 2024
                  </span>
                  <div className="relative w-full md:mr-4 group">
                      <div className="flex items-center gap-2 text-xs font-base text-white whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                        <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                            HostelHop
                          </span>
                        </div>
                      </div>
                    <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="mr-auto">
                    <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                      <IoLocationOutline className="w-4 h-4" />
                      Toronto
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
                  Building scalable web applications and leading frontend architecture decisions.
                </p>
              </div>
            </AnimatedSectionLeft>


            <AnimatedSectionLeft>

              {/* Work Item 4 */}
              <div className="space-y-3 md:space-y-1 border-b border-[#919191]/25 pb-6 md:pb-8 md:py-8">
                <h3 className="text-base sm:text-lg md:text-md font-light">
                  Frontend Developer Intern
                </h3>

                {/* Mobile/Tablet Layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2022 - 2023
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                    <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                    <span>EasyFits</span>
                  </div>
                  <p className="text-xs sm:text-sm font-base text-[#919191] flex items-center gap-2">
                    <IoLocationOutline className="w-4 h-4" />
                    Pickering
                  </p>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-3">
                  <span className="text-[#919191] text-xs flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2022 - 2023
                  </span>
                  <div className="relative w-full md:mr-4 group">
                      <div className="flex items-center gap-2 text-xs font-base text-white whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                        <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                            EasyFits
                          </span>
                        </div>
                      </div>
                    <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="mr-auto">
                    <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                      <IoLocationOutline className="w-4 h-4" />
                      Pickering
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
                  At EasyFits, I mainly work on maintaining company's data. Primary services I work on daily is Fabric, PowerBI, and Excel.
                </p>
              </div>
            </AnimatedSectionLeft>


            <AnimatedSectionLeft>

              {/* Work Item 5 */}
              <div className="space-y-3 md:space-y-1 pb-6 md:pb-8 md:py-8">
                <h3 className="text-base sm:text-lg md:text-md font-light">
                  Teaching Assistant
                </h3>

                {/* Mobile/Tablet Layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <span className="text-[#919191] text-xs sm:text-sm flex items-center font-light gap-2">
                    <IoCalendarSharp className='w-4 h-4' /> 2022 - 2023
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-base text-[#919191]">
                    <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
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
                    <IoCalendarSharp className='w-4 h-4' /> 2022 - 2023
                  </span>
                  <div className="relative w-full md:mr-4 group">
                      <div className="flex items-center gap-2 text-xs font-base text-white whitespace-nowrap hover:text-white transition-colors duration-300 cursor-pointer">
                        <FaBriefcase className="text-[#919191] shrink-0 w-4 h-4" />
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                            Trent University
                          </span>
                        </div>
                      </div>
                    <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-[#141417] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="mr-auto">
                    <p className="text-xs font-base text-[#919191] flex items-center gap-2">
                      <IoLocationOutline className="w-4 h-4" />
                      Peterborough
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-sm font-base text-[#919191] mt-2">
                  At EasyFits, I mainly work on maintaining company's data. Primary services I work on daily is Fabric, PowerBI, and Excel.
                </p>
              </div>
            </AnimatedSectionLeft>
          </div>

        </div>
      </div>
      {/* Decorative divider */}
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