import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = () => {
  const progressBarRef = useRef(null);

  useGSAP(() => {
    // Animate the scaleY of the progress bar based on the scroll position of the entire document
    gsap.to(progressBarRef.current, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true,
      }
    });
  });

  return (
    <div className="fixed top-0 right-0 w-1 h-screen bg-white/10 z-[999] pointer-events-none">
      <div 
        ref={progressBarRef}
        className="w-full h-full bg-yellow-500 origin-top"
        style={{ transform: 'scaleY(0)' }}
      />
    </div>
  );
};

export default ScrollProgress;
