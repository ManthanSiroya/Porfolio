import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Loader({ onComplete }) {
  const container = useRef(null);
  const contentRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    });

    // Animate the progress bar width
    tl.to('.loader-bar', {
      width: '100%',
      duration: 2,
      ease: "power2.inOut",
    }, 0);

    // Fade out the content (the bar) before shrinking the background
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });

    // Animate the clip-path to shrink down to a 20px radius circle (matches w-10/h-10 ball)
    tl.fromTo(container.current, 
      { clipPath: "circle(150% at 50% 50%)" },
      {
        clipPath: "circle(20px at 50% 50%)",
        duration: 1,
        ease: "power2.inOut",
      }
    );
    
  }, { scope: container });

  if (isFinished) return null;

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center pointer-events-none"
    >
      <div ref={contentRef} className="flex flex-col items-center">
        <div className="w-64 h-[2px] bg-white/20 relative overflow-hidden rounded-full">
          <div className="loader-bar absolute top-0 left-0 h-full bg-white w-0" />
        </div>
      </div>
    </div>
  );
}
