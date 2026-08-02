import React from 'react';
import { motion } from 'framer-motion';
import MeshText from './MeshTextHeader';
import Typewriter from './TypewriterDescription';
import CurvedMarquee from './CurvedMarquee';

export default function AboutUI({ isVisible }) {
  // Use framer-motion variants to handle the fade-in of the entire container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* 
        The bounding box perfectly matches the 3D coin projection. 
        Width is 45vw (as per scaling math). Height is 22.5vw (due to 60deg tilt). 
        It is pointer-events-none so you can still trigger the coin hover effect in the empty spaces!
      */}
      <div 
        className="relative pointer-events-none"
        style={{ width: '45vw', height: '22.5vw' }}
      >
        {/* Zone 1: Mesh Text Header (Top) */}
        {/* CRITICAL: The MeshText component was designed for @framerIntrinsicHeight 240.
            Giving it only h-24 (96px) makes the distortion invisible because it clips.
            We use h-[240px] and position it so it overlaps the top of the oval,
            with overflow-visible so displaced vertices can render outside the box. */}
        <motion.div 
          variants={itemVariants} 
          className={`absolute left-0 w-full flex items-center justify-center ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`} 
          style={{ height: '240px', top: '-140px', touchAction: 'none' }}
        >
          <MeshText 
            text="ABOUT ME" 
            color="#ffffff" 
            font={{ fontFamily: "Space Grotesk", variant: "Bold", fontSize: 80, lineHeight: "1em", letterSpacing: "0.1em" }}
            colorSplit={true}
            customColors={["#ff40c0", "#40ff80"]}
            force={15}
          />
        </motion.div>

        {/* Zone 2: Typewriter Descriptions (Center) */}
        {/* Only mount Typewriter when visible so it starts typing from scratch! */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 flex flex-col items-center justify-center text-center z-10 pointer-events-none -mt-3">
          {isVisible && (
            <>
              {/* Primary Paragraph */}
              <div className="mb-6 w-full">
                <Typewriter 
                  texts={[
                    "I am a 2nd-year B.Tech student<d:300> in Computer Science and Engineering at LNMIIT Jaipur<d:300> with a deep passion for Competitive Programming<d:300>, Full-Stack Web Development, and Open Source Contributions.<d:500> I specialize in mastering complex algorithmic problem-solving using C++ while architecting high-performance<d:300>, interactive, and responsive web applications.<d:500>"
                  ]}
                  font={{ fontFamily: "Inter", fontWeight: 600, fontSize: 18, lineHeight: "1.6em" }}
                  color="#ffffff"
                  ease={{ duration: 0.03, delay: 999999 }} // High delay so it never deletes
                  deleteSpeed={0.01}
                />
              </div>
              
              {/* Secondary Paragraph */}
              <div className="w-full">
                <Typewriter 
                  texts={[
                    "Through 15+ open-source contributions under Social Summer of Code (SSoC)<d:300>, I've honed my ability to solve real-world engineering problems.<d:500> By pairing algorithmic problem-solving<d:300> with high-performance UI design, I bring any vision to life<d:500> —if you can imagine it, I can build it."
                  ]}
                  font={{ fontFamily: "Inter", fontWeight: 400, fontSize: 15, lineHeight: "1.6em" }}
                  color="#94A3B8"
                  ease={{ duration: 0.03, delay: 999999 }}
                  deleteSpeed={0.01}
                  startDelay={14.0} // Wait for primary paragraph to finish typing + punctuation delay
                />
              </div>
            </>
          )}
        </div>

        {/* Zone 3: Curved Marquee (Bottom) */}
        <motion.div variants={itemVariants} className={`absolute -bottom-5 left-0 w-full h-24 flex items-center justify-center ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <CurvedMarquee 
            text=" Codeforces 1094 (Newbie)  |  Codechef 2 stars  |  Open Source 15+ PRs  |  100+ problems of CP-31 Sheet solved  | "
            font={{ fontFamily: "Inter", fontWeight: 600, fontSize: 56, letterSpacing: "2px" }}
            color="#ffffff"
            baseVelocity={40}
            direction="left"
            curveAmount={450}
            gap={8}
            fade={true}
            fadePercent={20}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
