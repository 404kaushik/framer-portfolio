import { motion } from 'framer-motion';
import { AnimatedSectionLeft } from './AnimatedSectionLeft';

interface AboutSectionProps {
  about: {
    highlights: string[];
    description: string;
  };
}

export function ProficienciesSection() {
  return (
    <section id="proficiencies" className="w-full mx-auto py-12 md:py-4 px-4 sm:px-6">
      <div className="container w-full md:max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-2 md:gap-12 items-start">
          <div className="md:col-span-1">
            <AnimatedSectionLeft className="md:sticky md:top-15 self-start">
              <h2 className="text-3xl md:text-4xl md:font-normal text-white sticky top-14 md:top-16 z-40">Proficiencies</h2>            
            </AnimatedSectionLeft>
          </div>
          <div className="flex flex-col mt-2 md:mt-0">
            <AnimatedSectionLeft>
              <div className="flex justify-between border-b border-[#919191]/25 pb-4 md:pb-0">
                <div className="w-full">
                  <h2 className="text-sm md:text-md font-extralight text-white">Skills</h2>
                </div>
                <div className="w-80 md:mb-4">
                  <div className="text-sm text-[#919191] leading-relaxed">API Design</div>                
                  <div className="text-sm text-[#919191] leading-relaxed">Frontend Architecture</div>                
                  <div className="text-sm text-[#919191] leading-relaxed">Backend Logic</div>                
                  <div className="text-sm text-[#919191] leading-relaxed">UX and Layout</div>                
                </div>
              </div>

            </AnimatedSectionLeft>
            <AnimatedSectionLeft>
              <div className="flex justify-between border-b border-[#919191]/25 py-3 md:py-6">
                <div className="w-full">
                  <h2 className="text-sm md:text-md font-extralight text-white">Tools</h2>
                </div>
                  <div className="w-80">
                    <div className="text-sm text-[#919191] leading-relaxed">VS Code</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">React</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Node.js</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">MongoDB</div>                
                  </div>
              </div>
            </AnimatedSectionLeft>
            <AnimatedSectionLeft>
              <div className="flex justify-between border-b border-[#919191]/25 py-3 md:py-6">
                <div className="w-full">
                  <h2 className="text-sm md:text-md font-extralight text-white">Tech Stack</h2>
                </div>
                  <div className="w-80 h-22 overflow-y-scroll scrollbar-thin scrollbar scrollbar-track-[#0000] scrollbar-thumb-[#444444]">
                    <div className="text-sm text-[#919191] leading-relaxed">React</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Next.js</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Node.js</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Framer Motion</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Tailwind CSS</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Express</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">JavaScript (ES6+)</div>
                    <div className="text-sm text-[#919191] leading-relaxed">Python</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">SQL</div>                
                  </div>
              </div>
            </AnimatedSectionLeft>
            <AnimatedSectionLeft>
              <div className="flex justify-between py-3 md:py-6">
                <div className="w-full">
                  <h2 className="text-sm md:text-md font-extralight text-white">Spoken Languages</h2>
                </div>
                  <div className="w-80">
                    <div className="text-sm text-[#919191] leading-relaxed">English</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Hindi</div>                
                    <div className="text-sm text-[#919191] leading-relaxed">Telugu</div>                                  
                  </div>
              </div>
            </AnimatedSectionLeft>
          </div>
        </div>
      </div>
          <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-px bg-linear-to-r from-transparent via-[#919191]/50 to-transparent mt-12 md:mt-16 origin-left"
            />
            

      {/* Decorative divider */}
    </section>
  );
}