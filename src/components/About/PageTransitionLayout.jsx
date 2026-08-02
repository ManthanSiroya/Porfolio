import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function PageTransitionLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  
  // Local state to "hold onto" the old route's DOM during the exit transition
  const [displayLocation, setDisplayLocation] = useState(location);
  const [displayOutlet, setDisplayOutlet] = useState(outlet);
  
  const containerRef = useRef(null);

  // We use useGSAP for safe lifecycle management
  const { contextSafe } = useGSAP({ scope: containerRef });

  // The exit and entrance animation logic
  const animateTransition = contextSafe((newLocation, newOutlet) => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Only swap the React Router outlet AFTER the exit animation finishes!
        setDisplayLocation(newLocation);
        setDisplayOutlet(newOutlet);
        
        // Entrance animation for the new route
        gsap.fromTo(containerRef.current,
          { opacity: 0, scale: 0.98, y: 10 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.6, 
            ease: 'expo.out',
            clearProps: 'all' // Cleanup inline styles
          }
        );
      }
    });

    // Exit animation (compositor only: opacity, scale)
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.02,
      duration: 0.4,
      ease: 'power3.in'
    });
  });

  useEffect(() => {
    // Whenever the URL changes, if it's a new path, trigger the interceptor
    if (location.pathname !== displayLocation.pathname) {
      animateTransition(location, outlet);
    }
  }, [location, outlet, displayLocation.pathname, animateTransition]);

  return (
    <div className="w-full h-full min-h-screen bg-transparent">
      {/* 
        This wrapper holds the 'gpu-accelerate' class to force a hardware composite layer,
        ensuring our scale and opacity transitions never drop frames.
      */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-screen gpu-accelerate"
      >
        {displayOutlet}
      </div>
    </div>
  );
}
