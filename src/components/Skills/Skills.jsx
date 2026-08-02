import React from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const skillsData = [
  { id: 'languages', category: "Languages", skills: ["C", "C++", "JavaScript", "SQL", "Python"] },
  { id: 'frontend', category: "Frontend", skills: ["HTML5", "CSS3", "React.js", "Next.js", "Tailwind CSS", "Three.js", "Functional Dashboard UIs"] },
  { id: 'backend', category: "Backend", skills: ["Node.js", "Express.js", "PHP"] },
  { id: 'databases', category: "Databases", skills: ["MongoDB", "MySQL", "PostgreSQL"] },
  { id: 'tools', category: "Tools", skills: ["Git", "GitHub", "VS Code"] },
  { id: 'core-cs', category: "Core CS", skills: ["Data Structures & Algorithms", "OOPS", "DBMS"] }
];

export default function Skills({ timelineTrackRef, setActiveCategory }) {
  // Skills Nodes ScrollTrigger
  useGSAP(() => {
    const wrappers = gsap.utils.toArray('.skill-node-wrapper')
    wrappers.forEach((wrapper, index) => {
      const node = wrapper.querySelector('.skill-node')
      const pills = wrapper.querySelectorAll('.skill-pill')
      const connector = wrapper.querySelector('.connector-line')
      const connectorDot = wrapper.querySelector('.connector-dot')
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top center", // Sync exactly with the coin passing the top edge
          toggleActions: "play none none reverse",
          onEnter: () => setActiveCategory(skillsData[index].category),
          onEnterBack: () => setActiveCategory(skillsData[index].category),
        }
      })

      // 1. Reveal Main Container
      tl.fromTo(node, 
        { y: 30, opacity: 0 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )

      // 2. Connector Line & Dot Reveal
      if (connector) {
        tl.fromTo(connector,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out", transformOrigin: index % 2 === 0 ? "right center" : "left center" },
          "-=0.3"
        )
        tl.fromTo(connectorDot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" },
          "-=0.2"
        )
      }

      // 3. Micro-stagger Reveal for Pills (Start immediately after title begins)
      if (pills.length > 0) {
        tl.fromTo(pills, 
          { opacity: 0, scale: 0.9, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" },
          0.1 // Absolute time: starts just 100ms after the main card begins animating
        )
      }

      // Continuous float
      gsap.to(node, {
        y: "-=6",
        duration: 2 + (index % 3) * 0.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.6 + (index % 2) * 0.3
      })
    })
  }, [])

  return (
    <section id="skills-container" className="relative w-full min-h-[200vh] flex flex-col items-center" style={{ backgroundImage: 'linear-gradient(to bottom, #4A6B8A 0%, #7EA2C2 10%, #B9D5EB 25%, #e0f2fe 50%, #e0f2fe 90%, rgba(240, 253, 250, 0.5) 100%)' }}>
      
      {/* Timeline Track - Starts below the heading */}
      <div ref={timelineTrackRef} className="absolute top-[calc(50vh+80px)] bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/30 z-0"></div>

      {/* Content Wrapper */}
      <div className="w-full flex flex-col items-center pt-[50vh]">
        <h2 className="text-4xl font-bold text-slate-800 drop-shadow-sm mb-[80px] z-10">Skills & Technologies</h2>
        
        {/* Skills Nodes */}
        <div className="flex flex-col gap-12 lg:gap-16 w-full max-w-7xl z-10 pb-32 px-4">
          {skillsData.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={item.id} className="skill-node-wrapper w-full relative flex">
                
                {/* The Connector Line */}
                <div className={`connector-line absolute top-[50%] -translate-y-1/2 w-8 lg:w-16 h-[1px] z-0 ${isLeft ? 'right-[50%] bg-gradient-to-l' : 'left-[50%] bg-gradient-to-r'} from-white/60 to-transparent opacity-0`}></div>
                {/* Connector Dot */}
                <div className={`connector-dot absolute top-[50%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] z-10 left-[50%] -translate-x-1/2 opacity-0`}></div>

                {/* Card Container guaranteeing exact center gap */}
                <div className={`w-1/2 flex ${isLeft ? 'justify-end pr-8 lg:pr-16' : 'justify-start pl-8 lg:pl-16 ml-auto'}`}>
                  
                  <div className="skill-node w-full max-w-xl xl:max-w-2xl h-fit relative will-change-transform rounded-lg bg-white/[0.03] backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),inset_2px_2px_10px_rgba(255,255,255,0.8),inset_-2px_-2px_15px_rgba(0,0,10,0.1),0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden">
                    
                    {/* Internal frosting noise texture */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                    <div className="relative z-10 w-full p-5 lg:p-6">
                      <h3 className="text-lg font-medium text-slate-800 mb-4 tracking-tight" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>{item.category}</h3>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {item.skills.map(skill => (
                          <span key={skill} className="skill-pill px-4 py-1.5 relative flex items-center justify-center rounded-full bg-white/[0.05] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),inset_-1px_-1px_3px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-md cursor-default hover:-translate-y-[1px] hover:bg-white/[0.1] transition-all duration-300">
                            <span className="relative z-10 text-slate-800 text-xs lg:text-sm font-bold tracking-wide" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
