import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

interface HeroSectionProps {
  name?: string
  profileImage?: string
}

export function HeroSection({ name = "Kaushik Nag Tumu", profileImage = "/images/profilePic.JPG" }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // The intro drifts up a little slower than the page and dims as you leave it.
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, -90])
  const opacity = useTransform(scrollY, [0, 600], [1, 0.2])

  return (
    <section id="home" className="min-h-2.5 md:min-h-120 mt-24 md:mt-0 md:mb-12 flex items-center justify-center">
      <motion.div style={reduce ? undefined : { y, opacity }} className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-2xl mx-auto mt-2 md:mt-24 px-4 md:px-0">
        <div className="grid md:grid-cols-2 gap-12 justify-start">
          <div className="md:col-span-1">
            <div>
              <h1 className="text-5xl md:text-5xl text-foreground tracking-tighter">{name}</h1>
            </div>
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
              <div>
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={name}
                  className={`hidden md:block relative w-20 h-30 rounded-2xl object-cover shadow-md shadow-gray-700/25 transition-all duration-700 ease-out hover:-translate-y-2 ${
                    isLoaded ? "sm:hidden opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-12 scale-90"
                  }`}
                />
              </div>
              <div className="space-y-4">
                <div className="w-full md:w-96 flex justify-between gap-20 pb-2 md:mt-4 animate-fadeInUp border-b border-[#919191]/25 md:py-4">
                  <div>
                    <p className="text-base md:font-light mt-2">About</p>
                  </div>
                  <div>
                    <ul className="w-80 flex flex-col items-start mt-2 border-white/50">
                      <li className="text-sm font-light text-[#919191]">Software & Data Engineer</li>
                      <li className="text-sm font-light text-[#919191]">Based in Ontario, Canada</li>
                      <li className="text-sm font-light text-[#919191]">SWE @ Designed Securities Ltd.</li>
                    </ul>
                  </div>
                </div>
                <div className="w-80 flex justify-center md:mt-4 text-left">
                  <div>
                    <p className="text-sm font-light text-[#919191]">
                      When I'm not coding, you'll find me on the tennis court, gaming, or sharing a good meal with friends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
