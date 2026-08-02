import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AnimatedButton from './AnimatedButton';

// Register the @gsap/react plugin for lifecycle safety
gsap.registerPlugin(useGSAP);

export default function PortfolioIntro() {
  // --- Animation Scoping Reference ---
  const containerRef = useRef(null);
  
  // --- Layer Reference Mapping ---
  const mainContentRef = useRef(null); // Layer 1 Wrapper
  const cameraRigRef = useRef(null);   // Layer 2 & 3 Wrapper Rig
  const letterRefs = useRef([]);       // Array of letter spans
  const nameString = "Manthan Siroya"; // Master string
  const theBallRef = useRef(null);     // The persistent physics cursor
  const avatarRef = useRef(null);      // The avatar image inside the cursor
  const loaderBgRef = useRef(null);    // Layer 4 Shield
  const counterRef = useRef(null);     // Layer 5 Loading Container
  const loadingBarFillRef = useRef(null); // The actual bar fill element
  const videoBgRef = useRef(null);     // Video Background
  const blendLayerRef = useRef(null);  // Seamless mask layer for the video

  // --- UI Grid Reference Mapping (For Staggered Initialization) ---
  const navLinksRef = useRef(null);    // Nav Grid
  const helloRef = useRef(null);       // "hello," text
  const prefixRef = useRef(null);      // "I'm " text
  const subtitleRef = useRef(null);    // "A cinematic..." text

  // --- Complete Sequential Animation Context ---
  useGSAP(() => {
    // Initialize the main sequential timeline
    const tl = gsap.timeline();

    // 0. Setup Initial Visual States
    gsap.set(loaderBgRef.current, {
      clipPath: 'circle(150% at 50% 50%)'
    });

    // Phase 0: The Loading Bar
    tl.to(loadingBarFillRef.current, {
      width: '100%',
      duration: 2.5,
      ease: 'power1.inOut' // Smooth linear-ish loading feel
    })
    // Fade out the loading container exactly when the bar reaches 75% (0.625s before 100% completion)
    .to(counterRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power1.inOut'
    }, "-=0.625")

    // Phase 1: The Circle Shrink
    // The shrink initiates seamlessly at the exact moment the 75% fade-out begins
    .to(loaderBgRef.current, {
      clipPath: 'circle(1cm at 50% 50%)',
      duration: 1.5,
      ease: 'power3.inOut'
    }, "<")
    
    // Phase 2: The Gravity Bounce (Full Center Bounces)
    .set(loaderBgRef.current, { autoAlpha: 0 }) 
    .set(theBallRef.current, { autoAlpha: 1 })  
    
    // Toss Up: Throw the ball upward as soon as it appears
    .to(theBallRef.current, {
      y: () => -(window.innerHeight * 0.3), // Toss to 30% above center
      duration: 0.6,
      ease: 'power2.out'
    })
    // Bounce 1: Fall from peak to the floor
    .to(theBallRef.current, { 
      y: () => (window.innerHeight / 2) - (theBallRef.current.offsetHeight / 2), 
      duration: 0.8, 
      ease: 'power2.in' 
    }) 
    // Return 1: Bounce back up, losing energy (crests slightly above center)
    .to(theBallRef.current, { 
      y: () => -(window.innerHeight * 0.1), 
      duration: 0.6,
      ease: 'power2.out' 
    })
    // Bounce 2: Second drop to the floor
    .to(theBallRef.current, { 
      y: () => (window.innerHeight / 2) - (theBallRef.current.offsetHeight / 2), 
      duration: 0.55, 
      ease: 'power2.in' 
    })
    // Return 2: Final rise, velocity naturally reaches 0 exactly at center (y: 0)
    .to(theBallRef.current, { 
      y: 0, 
      duration: 0.4, 
      ease: 'power2.out' 
    });
    
    // Phase 3: The Flexbox Typewriter Cursor
    // Add a 0.3s pause when the ball's velocity becomes 0 before it starts behaving like a cursor
    tl.addLabel("typing", "+=0.3");
    
    // We build the sequence dynamically using timeline offsets
    let finalTypeTime = 0;
    (() => {
      let typeTime = 0; // Start instantly
      
      nameString.split('').forEach((char, i) => {
        if (i === 0) {
          // 'M' comes fast and smooth with a scale swoop
          tl.set(letterRefs.current[i], { display: 'inline-block' }, `typing+=${typeTime}`);
          tl.fromTo(letterRefs.current[i], 
            { opacity: 0, scale: 0.5 }, 
            { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, 
            `typing+=${typeTime}`
          );
        } else {
          // All other letters pop in very fast (fast writing cursor)
          tl.set(letterRefs.current[i], { display: 'inline-block' }, `typing+=${typeTime}`);
          tl.to(letterRefs.current[i], { opacity: 1, duration: 0.02 }, `typing+=${typeTime}`);
        }
        
        typeTime += 0.04; // FAST typing cadence
      });
      finalTypeTime = typeTime;
    })();

    // --- Phase 4: Spatial Migration to Left Edge & Final Reveal ---
    // Hold the composition at the center for 0.5 seconds AFTER the typing finishes
    tl.addLabel('migration', `typing+=${finalTypeTime + 0.5}`);

    // 4.1 Execute Spatial Migration for Text
    tl.to(cameraRigRef.current, {
      x: () => {
        // We want the left edge of `prefixRef` to perfectly align with `navLinksRef` padding
        const prefixRect = prefixRef.current.getBoundingClientRect();
        const navRect = navLinksRef.current.getBoundingClientRect();
        
        return navRect.left - prefixRect.left;
      },
      duration: 1.5,
      ease: 'power3.inOut' // Cinematic smooth glide
    }, 'migration')
    
    // 4.2 Independent Cursor Detach & Flight
    .call(() => {
       // Detach ball from flex flow, locking it to its absolute pixel position within cameraRigRef
       const ballEl = theBallRef.current;
       gsap.set(ballEl, {
          position: 'absolute',
          left: ballEl.offsetLeft,
          top: ballEl.offsetTop,
          margin: 0 // Strip margin since it's now absolute
       });
    }, null, 'migration')
    .to(theBallRef.current, {
       x: () => {
          // Calculate the counter-movement to overcome cameraRigRef's leftward glide
          const prefixRect = prefixRef.current.getBoundingClientRect();
          const navRect = navLinksRef.current.getBoundingClientRect();
          const cameraShift = navRect.left - prefixRect.left; 
          
          const ballRect = theBallRef.current.getBoundingClientRect();
          
          // Determine final native dimensions (responsive, minimum 250px)
          const targetSize = Math.max(window.innerWidth * 0.25, 250); 
          const targetX = window.innerWidth * 0.75; // Anchor right side
          const targetLeft = targetX - (targetSize / 2);
          
          // Move top-left corner from current to target, compensating for parent shift
          return targetLeft - ballRect.left - cameraShift;
       },
       y: () => {
          const ballRect = theBallRef.current.getBoundingClientRect();
          const targetSize = Math.max(window.innerWidth * 0.25, 250); 
          const targetY = window.innerHeight * 0.5 - (targetSize / 2);
          return targetY - ballRect.top;
       },
       width: () => Math.max(window.innerWidth * 0.25, 250), 
       height: () => Math.max(window.innerWidth * 0.25, 250), // Animate native size, NOT scale, to prevent blur
       duration: 1.5,
       ease: 'power3.inOut'
    }, 'migration')

    // Fade in the avatar image while the cursor enlarges
    .to(avatarRef.current, {
       opacity: 1,
       duration: 1,
       ease: 'power2.inOut'
    }, 'migration+=0.5')
    
    // Fade in the video background and wrapper
    .set(mainContentRef.current, { opacity: 1 }, 'migration') // Prep wrapper for child stagger
    .call(() => {
      // Start playing the video exactly when it fades in
      if (videoBgRef.current) {
        videoBgRef.current.play().catch(e => console.error("Video play failed:", e));
      }
    }, null, 'migration')
    .to(videoBgRef.current, { 
      opacity: 1, 
      duration: 1.5, 
      ease: 'power2.inOut' 
    }, 'migration')
    .to(blendLayerRef.current, { 
      opacity: 1, 
      duration: 1.5, 
      ease: 'power2.inOut' 
    }, 'migration')

    // Fade in the new central hero elements
    .to(helloRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 'migration+=0.5')
    .to(prefixRef.current, {
      autoAlpha: 1,
      x: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 'migration+=0.5')
    .to(subtitleRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 'migration+=0.7') // Stagger subtitle slightly
    
    // Fade in the navigation links
    .fromTo(navLinksRef.current, 
      { 
        autoAlpha: 0, 
        y: 30 
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        onComplete: () => {
          // Post-Animation Cleanup: Unblock user navigation
          gsap.set(mainContentRef.current, { pointerEvents: 'auto' });
          gsap.set(loaderBgRef.current, { 
            pointerEvents: 'none',
            display: 'none' // Remove empty mask entirely
          });
        }
      },
      'migration+=0.5' // Synchronize with the text reveals
    );

  }, { scope: containerRef }); // Prevents memory leaks automatically

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen overflow-x-hidden text-black font-sans bg-white"
    >
      {/* Intro Section - 100vh */}
      <section className="relative w-full h-screen overflow-hidden">
      
      {/* Seamless mask layer (fades in exactly when the video does to provide the solid backdrop for the video mask) */}
      <div ref={blendLayerRef} className="absolute inset-0 z-0 bg-[#4A6B8A] opacity-0 pointer-events-none" />
      
      <video 
        ref={videoBgRef}
        loop 
        muted 
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-0 gpu-accelerate"
        style={{
          // Seamlessly blend the bottom 15% of the video into the background behind it
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
        src="/background.mp4"
      />
      
      {/* LAYER 1 (Bottom, z-index: 10): Main Content Wrapper */}
      <div 
        id="main-content"
        ref={mainContentRef}
        // Starts with opacity 0 and pointer-events disabled until sequence completes
        className="absolute inset-0 z-10 w-full h-full opacity-0 pointer-events-none flex flex-col"
      >
        <nav className="flex justify-between items-start w-full px-3 pt-6 md:px-6 md:pt-10">
          {/* Standard Navigation Links (Faded in via GSAP stagger) */}
          <div ref={navLinksRef} className="flex gap-2 md:gap-3 text-sm md:text-base font-medium tracking-wide invisible">
            <AnimatedButton as={Link} to="/work">Work</AnimatedButton>
            <AnimatedButton as={Link} to="/about">About</AnimatedButton>
            <AnimatedButton as={Link} to="/contact">Contact</AnimatedButton>
          </div>
        </nav>
      </div>

      {/* LAYER 2 & 3: Typewriter Rig */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div 
          id="camera-rig"
          ref={cameraRigRef}
          className="relative flex items-center justify-center w-full h-full gpu-accelerate"
        >
          {/* Typography Rig: Centered entirely on 'my-name' */}
          <div className="relative flex items-center justify-center">
            
            {/* The Main Name Line (The physical anchor) */}
            <div id="my-name" className="relative flex items-center text-[6vw] leading-none font-general font-medium tracking-[-0.02em] whitespace-pre text-[#111111] gpu-accelerate z-10">
              
              {/* Wrapper anchored to the left of my-name */}
              <div className="absolute right-full h-full flex items-center mr-[1vw]">
                
                {/* Inside this wrapper, we build the left-aligned block */}
                <div className="relative flex flex-col items-start whitespace-nowrap">
                  
                  {/* Hello above */}
                  <div 
                    ref={helloRef}
                    className="absolute bottom-full mb-[1vw] font-cursive text-[#111111] text-[6vw] leading-none invisible"
                    style={{ transform: 'translateY(20px)' }}
                  >
                    hello,
                  </div>

                  {/* Prefix inline */}
                  <div 
                    ref={prefixRef}
                    className="text-[6vw] leading-none font-general font-medium tracking-[-0.02em] text-[#111111] invisible"
                    style={{ transform: 'translateX(-20px)' }}
                  >
                    I'm
                  </div>

                  {/* Subtitle below */}
                  <div 
                    ref={subtitleRef}
                    className="absolute top-full mt-[2vw] font-general font-medium text-[#111111] text-lg md:text-[2vw] invisible tracking-wider"
                    style={{ transform: 'translateY(20px)' }}
                  >
                    A cinematic website creator
                  </div>

                </div>
              </div>

              {nameString.split('').map((char, index) => (
                <span
                  key={index}
                  ref={(el) => (letterRefs.current[index] = el)}
                  style={{ display: 'none', opacity: 0 }} // Hidden from flex flow initially
                >
                  {char}
                </span>
              ))}

              {/* The Persistent Physics Cursor */}
              <div 
                id="the-ball"
                ref={theBallRef}
                className="rounded-full overflow-hidden opacity-0 shrink-0 relative flex items-center justify-center gpu-accelerate"
                style={{ width: '2cm', height: '2cm', margin: '0 4px', backgroundColor: '#111111' }} 
              >
                {/* Avatar Image (Fades in during the grand scale) */}
                <img 
                  ref={avatarRef}
                  src="/Avatar.jpg"
                  alt="Avatar"
                  className="absolute inset-0 w-full h-full object-cover opacity-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 4 (Top, z-index: 40): Loading Shield */}
      <div 
        id="loader-bg"
        ref={loaderBgRef}
        className="absolute inset-0 z-40 w-[100vw] h-[100vh] bg-black"
      ></div>

      {/* LAYER 5 (Topmost, z-index: 50): Loading Bar */}
      <div
        id="loading-container"
        ref={counterRef}
        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        {/* The Bar Track */}
        <div className="w-64 md:w-96 h-[2px] bg-white/20 overflow-hidden">
          {/* The Bar Fill */}
          <div ref={loadingBarFillRef} className="h-full bg-white w-0"></div>
        </div>
      </div>
      </section>

      {/* 1st Page Section (Seamlessly merging with the cinematic video above) */}
      <section 
        className="relative w-full min-h-screen flex flex-col items-center justify-center -mt-1"
        style={{
          // Matches the deep blue of the video bottom (#4A6B8A), fading to a soft light sky blue
          backgroundImage: 'linear-gradient(to bottom, #4A6B8A, #7EA2C2, #B9D5EB, #EAF3FA, #FFFFFF)'
        }}
      >
        <h1 className="text-6xl md:text-8xl font-general font-bold text-white drop-shadow-md">1st Page</h1>
        <p className="mt-6 text-xl font-medium text-white/90">Seamlessly merged with the cinematic sky</p>
      </section>

    </div>
  );
}
