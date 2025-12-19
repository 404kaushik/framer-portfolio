import { useEffect, useState } from "react"
import { AnimatedSection } from "./AnimatedSection"
import { AnimatedSectionLeft } from "./AnimatedSectionLeft"

interface HeroSectionProps {
  name: string
  profileImage?: string
}

export function HeroSection({ name, profileImage = "/images/profilePic.JPG" }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="min-h-2.5 md:min-h-120 mt-12 md:mt-0 md:mb-12 flex items-center justify-center">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-2xl mx-auto mt-2 md:mt-24 px-4 md:px-0">
        <div className="grid md:grid-cols-2 gap-12 justify-start">
          <div className="md:col-span-1">
            <AnimatedSection>
              <h1 className="text-5xl md:text-5xl text-foreground tracking-tighter">{name}</h1>
            </AnimatedSection>
          </div>
          <div className="md:col-span-1 flex">
            <div className="relative w-96 h-52 md:w-[50%] md:h-[50%]">
              <div className="absolute inset-0 overflow-hidden -translate-x-[23%] -translate-y-1/7">
                <div
                  className="hidden md:block absolute -inset-12 rounded-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                    maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
                  }}
                />  
                              
              </div>
              <AnimatedSection>
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={name}
                  className={`hidden md:block relative w-20 h-30 rounded-2xl object-cover shadow-md shadow-gray-700/25 transition-all duration-700 ease-out hover:-translate-y-2 ${
                    isLoaded ? "sm:hidden opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-12 scale-90"
                  }`}
                />
              </AnimatedSection>
              <div className="space-y-4">
                <div className="w-full md:w-96 flex justify-between gap-20 pb-2 md:mt-4 animate-fadeInUp border-b border-[#919191]/25 md:py-4">
                  <AnimatedSection>
                    <p className="text-base md:font-light mt-2">About</p>
                  </AnimatedSection>
                  <AnimatedSectionLeft>
                    <ul className="w-80 flex flex-col items-start mt-2 border-white/50">
                      <li className="text-sm font-light text-[#919191]">Software & Data Engineer</li>
                      <li className="text-sm font-light text-[#919191]">Based in Ontario, Canada</li>
                      <li className="text-sm font-light text-[#919191]">SWE @ Designed Securities Ltd.</li>
                    </ul>
                  </AnimatedSectionLeft>
                </div>
                <div className="w-80 flex justify-center md:mt-4 text-left">
                  <AnimatedSectionLeft>
                    <p className="text-sm font-light text-[#919191]">
                      When I'm not coding, you'll find me on the tennis court, gaming, or sharing a good meal with friends.
                    </p>
                  </AnimatedSectionLeft>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
