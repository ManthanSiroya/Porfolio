import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

export function useScannerAnimation({
  stage,
  is3DLoaded,
  puppetRef,
  coinWrapperRef,
  coinOrbitRef,
  coinCameraRef,
  coinFlipRef,
  coinSolidRef,
  coinRingRef,
  avatarRef,
  timelineTrackRef,
  coinScanRef,
  coinScrollAnchorRef
}) {
  useGSAP(() => {
    if (stage !== 2 || !is3DLoaded) return;
    
    // Safety check
    if (!coinOrbitRef.current || !coinCameraRef.current || !coinFlipRef.current || !coinSolidRef.current) return;

    // Synchronized Handoff Step
    gsap.delayedCall(0.01, () => {
      gsap.set(puppetRef.current, { opacity: 0 })
      gsap.set(coinWrapperRef.current, { zIndex: 40, opacity: 1, ease: 'none' })
    })

    // The coin wrapper is full screen
    gsap.set(coinWrapperRef.current, {
      left: 0, top: 0, xPercent: 0, yPercent: 0, x: 0, width: "100%", height: "100vh"
    })

    // --- DYNAMIC PIXEL-TO-WEBGL MAPPING ---
    // Mathematically derive WebGL viewport boundaries using our camera specs (fov: 45, z: 8)
    const vFov = (45 * Math.PI) / 180;
    const viewportHeight = 2 * Math.tan(vFov / 2) * 8;
    const factor = viewportHeight / window.innerHeight;

    // Get exact DOM screen coordinates
    const avatarRect = avatarRef.current.getBoundingClientRect();
    const trackRect = timelineTrackRef.current.getBoundingClientRect();

    // Convert DOM pixel centers to WebGL world coordinates (accounting for scrollbar width)
    const clientWidth = document.documentElement.clientWidth;
    const startX = ((avatarRect.left + avatarRect.width / 2) - clientWidth / 2) * factor;
    const startY = -((avatarRect.top + avatarRect.height / 2) - window.innerHeight / 2) * factor;
    const targetX = ((trackRect.left + trackRect.width / 2) - clientWidth / 2) * factor;

    // Instantly snap the 3D mesh to perfectly overlap the 2D DOM avatar before animating
    gsap.set(coinOrbitRef.current.position, { x: startX, y: startY });
    
    // Flatten the 3D coin to a pure 2D plane initially so it EXACTLY matches the 2D DOM circle without any perspective thickness bleeding out!
    gsap.set(coinSolidRef.current.scale, { z: 0.001 });

    const flightSt = gsap.timeline({
      scrollTrigger: {
        trigger: "#skills-container",
        start: "top bottom",
        end: () => `+=${window.innerHeight}`, // Scrubs exactly 100vh
        scrub: 1,
      }
    })

    // 1. The Trajectory (X, Y, Tilt Z)
    // Animate X perfectly to the timeline track center linearly to create a true parabola
    flightSt.to(coinOrbitRef.current.position, {
      x: targetX, 
      ease: "none",
      duration: 1.0
    }, 0)
    
    // Animate Y using a keyframe array to force an upward peak before descending to 0.
    flightSt.to(coinOrbitRef.current.position, {
      keyframes: [
        { y: startY + (viewportHeight * 0.15), ease: "power2.out", duration: 0.5 },
        { y: 0, ease: "power2.in", duration: 0.5 }
      ]
    }, 0)

    // Animate Tilt Z from 0 to leaning slightly left and back to upright
    // Animate Tilt Z from 0 to leaning slightly left and back to upright
    flightSt.to(coinOrbitRef.current.rotation, {
      keyframes: {
        "0%": { z: 0 },
        "50%": { z: -0.2 },
        "100%": { z: 0 },
        easeEach: "power1.inOut"
      },
      duration: 1.0
    }, 0)

    // Quickly restore the 3D thickness (Z-scale) in the first 10% of the flight!
    flightSt.to(coinSolidRef.current.scale, {
      z: 1,
      ease: "power2.out",
      duration: 0.1
    }, 0)

    // 2. The Flip (Rotation Y)
    // Simultaneously flip the coin mesh 180 degrees
    flightSt.to(coinFlipRef.current.rotation, {
      y: Math.PI,
      ease: "none",
      duration: 1.0
    }, 0)

    // Orbit the camera slightly to reveal thickness during the flip
    flightSt.to(coinCameraRef.current.position, {
      x: 2,
      y: 2,
      ease: "power1.inOut",
      duration: 0.5
    }, 0)
    flightSt.to(coinCameraRef.current.position, {
      x: 0,
      y: 0,
      ease: "power1.inOut",
      duration: 0.5
    }, 0.5)

    // Shrink the coin mesh to represent a 10px dot with staggered pacing
    flightSt.to(coinFlipRef.current.scale, {
      keyframes: [
        { x: 0.5, y: 0.5, z: 0.5, ease: "power1.inOut", duration: 0.5 },
        { x: 0.0333, y: 0.0333, z: 0.0333, ease: "power2.in", duration: 0.5 }
      ]
    }, 0)

    // Sync the Timeline Track reveal
    const trackSt = gsap.timeline({
      scrollTrigger: {
        trigger: "#skills-container",
        start: "top top",
        end: () => `+=${window.innerHeight * 0.5}`, 
        scrub: 1,
      }
    })
    
    trackSt.fromTo(timelineTrackRef.current, 
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, ease: "power2.inOut" }
    )

    // --- Scroll-Jacking Utilities ---
    const preventScroll = (e) => {
      if (e.type === 'keydown') {
        const keys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
        if (keys.includes(e.code)) e.preventDefault();
        return;
      }
      e.preventDefault();
    };
    
    let isScrollLocked = false;
    const lockScroll = () => {
      if (isScrollLocked) return;
      isScrollLocked = true;
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventScroll, { passive: false });
    };
    
    const unlockScroll = () => {
      if (!isScrollLocked) return;
      isScrollLocked = false;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScroll);
    };

    const getRingTarget = () => {
      const activeCard = document.getElementById('active-project-card');
      const projectsSection = document.getElementById('projects');
      const gridContainer = document.getElementById('projects-grid-container');
      if (!activeCard || !projectsSection || !gridContainer) return { x: 0, y: 0, scale: 1, width: 0, edgeOnRotation: Math.PI * 1.5, avgThickness: 0.15 };
      
      // Instead of reading live bounding rects which fluctuate during Framer Motion layout animations,
      // we mathematically calculate the final exact centered position based on its static offset sizes!
      // The active card is scaled by 1.05 in its final state (defined in MyProjects.jsx).
      const finalCardWidth = activeCard.offsetWidth * 1.05;
      const finalCardHeight = activeCard.offsetHeight * 1.05;
      
      const vFov = (45 * Math.PI) / 180;
      const viewportHeight = 2 * Math.tan(vFov / 2) * 8;
      const factor = viewportHeight / window.innerHeight;
      const clientWidth = document.documentElement.clientWidth;

      // 1. Unifying Geometry Thickness first so we can use it for padding math
      const coinRadiusWorld = (300 * factor) / 2;
      const coinThickness = 0.15;
      const currentRingThickness = coinRadiusWorld * 0.30;
      const originalAvgThickness = (coinThickness + currentRingThickness) / 2;

      // 2. Docking Gap & Inner Padding Math
      const paddingPx = 16; // reduced padding for a tighter fit
      const innerDiameterPx = finalCardHeight + paddingPx;
      const tubeThicknessPx = originalAvgThickness / factor;
      const outerDiameterPx = innerDiameterPx + 2 * tubeThicknessPx;
      
      const radiusPx = outerDiameterPx / 2;
      const gapPx = 24; 
      
      // Calculate targetX strictly using center offsets (clientWidth / 2 cancels out mathematically!)
      // The ring will perfectly dock gapPx to the left of the card's final left edge.
      const targetX = (-finalCardWidth / 2 - gapPx - radiusPx) * factor;
      
      // Calculate targetY based on the static grid container's vertical center.
      // This accounts for the header ("My Projects") and padding without being affected by card animations!
      const containerRect = gridContainer.getBoundingClientRect();
      const sectionRect = projectsSection.getBoundingClientRect();
      const staticCenterY_relativeToSection = (containerRect.top - sectionRect.top) + (containerRect.height / 2);
      
      // When the section is fully pinned, sectionRect.top is 0 on the screen.
      // The visual Y position on screen is exactly staticCenterY_relativeToSection.
      const targetY = - (staticCenterY_relativeToSection - window.innerHeight / 2) * factor;

      // 2. Perspective Bleed Correction for Mid-Point Swap
      const RESTING_ANGLE = 85 * Math.PI / 180;
      
      const getClosestEdgeOnAngle = (xPos, targetAngle) => {
        let angle1 = Math.atan2(-8, -xPos);
        if (angle1 < 0) angle1 += Math.PI * 2;
        let angle2 = (angle1 + Math.PI) % (Math.PI * 2);
        
        const diff1 = Math.abs(Math.atan2(Math.sin(angle1 - targetAngle), Math.cos(angle1 - targetAngle)));
        const diff2 = Math.abs(Math.atan2(Math.sin(angle2 - targetAngle), Math.cos(angle2 - targetAngle)));
        
        return diff1 < diff2 ? angle1 : angle2;
      };

      const midEdgeOnRotation = getClosestEdgeOnAngle(targetX * 0.5, RESTING_ANGLE);
      const leftEdgeOnRotation = getClosestEdgeOnAngle(targetX, RESTING_ANGLE);
      const rightEdgeOnRotation = getClosestEdgeOnAngle(-targetX, RESTING_ANGLE);

      // 3. Size and Scale Math
      const finalScale = outerDiameterPx / 300;
      const baseScale = (finalCardHeight * factor) / (300 * factor); // The original scale before we added free space padding
      
      // 4. Unifying Geometry Thickness (Compensated for increased scale)
      // Because we increased finalScale to add padding, the whole 3D geometry scales up, making the tube thicker.
      // We divide the avgThickness by the scale ratio to perfectly preserve the original visual thickness!
      const adjustedAvgThickness = originalAvgThickness * (baseScale / finalScale);

      return {
        x: targetX,
        y: targetY,
        scale: finalScale,
        width: finalCardWidth * factor,
        midEdgeOnRotation: midEdgeOnRotation,
        leftEdgeOnRotation: leftEdgeOnRotation,
        rightEdgeOnRotation: rightEdgeOnRotation,
        restingAngle: RESTING_ANGLE,
        avgThickness: adjustedAvgThickness,
        factor: factor,
        coinRadiusWorld: coinRadiusWorld
      };
    };

    // --- PHASE 2.5: The Approach (Unpinned, scrubs while section enters viewport) ---
    const approachSt = gsap.timeline({
      scrollTrigger: {
        trigger: "#projects",
        start: "top bottom", // Initiates exactly in the dead space
        end: "top top", // Ends exactly as it hits the top and docks
        scrub: true, // Fixed: use true instead of 1 to prevent scrub lag from overlapping with Phase 3 scanning
        invalidateOnRefresh: true
      },
      onUpdate: function() {
        if (!this.isActive() && this.progress() === 0) return;
        
        // Visibility Swap exactly at 50% progress of the TIMELINE (syncs perfectly with scrub lag!)
        const p = this.progress();
        if (p >= 0.5) {
          if (coinSolidRef.current && coinSolidRef.current.visible) {
             coinSolidRef.current.visible = false;
             if (coinRingRef.current) coinRingRef.current.visible = true;
          }
        } else {
          if (coinSolidRef.current && !coinSolidRef.current.visible) {
             coinSolidRef.current.visible = true;
             if (coinRingRef.current) coinRingRef.current.visible = false;
          }
        }
      }
    });

    // --- 0.0 to 1.0: Continuous Translation ---
    approachSt.to(coinOrbitRef.current.position, {
      x: () => getRingTarget().x,
      y: () => getRingTarget().y,
      ease: "power1.inOut",
      duration: 1.0
    }, 0);

    // --- 0.0 to 0.5: Coin Phase ---
    approachSt.to(coinFlipRef.current.scale, {
      x: () => getRingTarget().scale * 0.5,
      y: () => getRingTarget().scale * 0.5,
      z: () => getRingTarget().scale * 0.5,
      ease: "power2.in", // slow start, fast at swap
      duration: 0.5
    }, 0);

    approachSt.to(coinFlipRef.current.rotation, {
      y: () => getRingTarget().midEdgeOnRotation, // perfectly edge-on midpoint
      ease: "power2.in",
      duration: 0.5
    }, 0);

    approachSt.to(coinSolidRef.current.scale, {
      z: () => getRingTarget().avgThickness / 0.075, // Extrude to 2x so it matches final thickness at 50% scale
      ease: "power2.in",
      duration: 0.5
    }, 0);

    // --- 0.5 to 1.0: Ring Phase ---
    approachSt.to(coinFlipRef.current.scale, {
      x: () => getRingTarget().scale,
      y: () => getRingTarget().scale,
      z: () => getRingTarget().scale,
      ease: "power2.out", // fast start, slow end
      duration: 0.5,
      onUpdate: function() {
        // Rebuild Torus geometry to maintain constant screen thickness
        const p = this.progress(); // 0 to 1
        const scaleFactor = 0.5 + p * 0.5;
        const ringMesh = coinRingRef.current?.children[0];
        if (ringMesh) {
           const target = getRingTarget();
           const tubeRadius = target.avgThickness / (2 * scaleFactor);
           const torusRadius = target.coinRadiusWorld - tubeRadius;
           
           if (ringMesh.geometry) ringMesh.geometry.dispose();
           ringMesh.geometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 16, 64);
        }
      }
    }, 0.5);

    approachSt.to(coinFlipRef.current.rotation, {
      y: () => getRingTarget().restingAngle, // 85 degrees (short symmetric path!)
      ease: "power2.out",
      duration: 0.5
    }, 0.5);


    // --- PHASE 2.75: Scroll Anchoring (Locking fixed canvas to DOM scroll) ---
    // We translate a specific parent WebGL group to anchor the ring to the DOM perfectly,
    // avoiding the timeline conflicts and canvas clipping issues.
    gsap.to(coinScrollAnchorRef.current.position, {
      y: () => ((document.getElementById('projects')?.offsetHeight || window.innerHeight) * factor),
      ease: "none",
      scrollTrigger: {
        trigger: "#projects",
        start: "top top", // Starts EXACTLY when the Ring is docked!
        end: "bottom top", // Ends exactly when the section scrolls out of view
        scrub: true, // Set to true (instant) rather than 1 (smoothed) to guarantee pixel-perfect locking!
        invalidateOnRefresh: true,
      }
    });

    // --- PHASE 4: Transition to About (Ring -> Coin, scaling up) ---
    const aboutSt = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom", 
        end: "top top", 
        scrub: 1,
        invalidateOnRefresh: true
      },
      onUpdate: function() {
        if (!this.isActive() && this.progress() === 0) return;
        
        const p = this.progress();
        // Swap visibility at 50%
        if (p >= 0.5) {
          if (coinSolidRef.current && !coinSolidRef.current.visible) {
             coinSolidRef.current.visible = true;
             if (coinRingRef.current) coinRingRef.current.visible = false;
          }
        } else {
          if (coinSolidRef.current && coinSolidRef.current.visible) {
             coinSolidRef.current.visible = false;
             if (coinRingRef.current) coinRingRef.current.visible = true;
          }
        }
        
        // Enforce constant thickness dynamically
        if (coinFlipRef.current) {
          const currentScale = coinFlipRef.current.scale.x;
          const currentZScale = coinFlipRef.current.scale.z;
          const target = getRingTarget();
          
          if (p < 0.5) {
             // Ring Phase
             const ringMesh = coinRingRef.current?.children[0];
             if (ringMesh) {
                const tubeRadius = target.avgThickness / (2 * currentScale);
                const torusRadius = target.coinRadiusWorld - tubeRadius;
                if (ringMesh.geometry) ringMesh.geometry.dispose();
                ringMesh.geometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 16, 64);
             }
          } else {
             // Coin Phase
             if (coinSolidRef.current) {
                coinSolidRef.current.scale.z = (target.avgThickness / 0.15) / currentZScale;
             }
          }
        }
      }
    });

    // 0.0 to 1.0: Continuous Translation to Center
    // We counteract the scrollAnchorRef upward translation to center it visually!
    aboutSt.to(coinOrbitRef.current.position, {
      x: 0,
      y: () => -((document.getElementById('projects')?.offsetHeight || window.innerHeight) * factor),
      ease: "power1.inOut",
      duration: 1.0
    }, 0);

    // 0.0 to 0.5: Ring Phase
    aboutSt.to(coinFlipRef.current.scale, {
      x: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         const finalScale = (vHeight * aspect * 0.60) / (300 * factor); // diameter is 45% of screen width
         return (getRingTarget().scale + finalScale) / 2;
      },
      y: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         const finalScale = (vHeight * aspect * 0.60) / (300 * factor);
         return (getRingTarget().scale + finalScale) / 2;
      },
      z: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         const finalScale = (vHeight * aspect * 0.60) / (300 * factor);
         return (getRingTarget().scale + finalScale) / 2;
      },
      ease: "power2.in",
      duration: 0.5
    }, 0);

    aboutSt.to(coinFlipRef.current.rotation, {
      y: () => {
         const target = getRingTarget();
         const getClosestEdgeOnAngle = (xPos, targetAngle) => {
           let angle1 = Math.atan2(-8, -xPos);
           if (angle1 < 0) angle1 += Math.PI * 2;
           let angle2 = (angle1 + Math.PI) % (Math.PI * 2);
           const diff1 = Math.abs(Math.atan2(Math.sin(angle1 - targetAngle), Math.cos(angle1 - targetAngle)));
           const diff2 = Math.abs(Math.atan2(Math.sin(angle2 - targetAngle), Math.cos(angle2 - targetAngle)));
           return diff1 < diff2 ? angle1 : angle2;
         };
         // The coin reaches halfway to the center at p=0.5
         return getClosestEdgeOnAngle(target.x * 0.5, Math.PI * 0.75);
      },
      ease: "power2.in",
      duration: 0.5
    }, 0);

    // 0.5 to 1.0: Coin Phase
    aboutSt.to(coinFlipRef.current.scale, {
      x: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         return (vHeight * aspect * 0.60) / (300 * factor); 
      },
      y: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         return (vHeight * aspect * 0.60) / (300 * factor); 
      },
      z: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         return (vHeight * aspect * 0.60) / (300 * factor); 
      },
      ease: "power2.out",
      duration: 0.5
    }, 0.5);

    aboutSt.to(coinFlipRef.current.rotation, {
      y: Math.PI, // facing camera (back side)
      x: -Math.PI * (50/180), // tilt backward 50 degrees into the flat oval
      ease: "power2.out",
      duration: 0.5
    }, 0.5);

    aboutSt.to(coinScanRef.current.position, {
      y: () => {
         const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 8;
         const aspect = window.innerWidth / window.innerHeight;
         // R is the exact final world-space radius of the coin
         const R = (vHeight * aspect * 0.60) / 2; 
         const theta = Math.PI * (50/180);
         // Mathematically exact upward shift to cancel perspective droop
         return (R * R * Math.sin(theta) * Math.cos(theta)) / 8;
      },
      ease: "power2.out",
      duration: 0.5
    }, 0.5);

    const contactSt = gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top bottom", 
        end: "+=150%", // Forces animation to complete fully within the scroll range
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    // Rotate to exactly -90 degrees on the X-axis to expose the edge perfectly flat
    contactSt.to(coinFlipRef.current.rotation, {
      x: -Math.PI / 2, // -90 degrees perfectly orthogonal
      y: Math.PI,      // Keep it facing back
      ease: "power1.inOut"
    }, 0);

    // We want the final edge to perfectly wrap the new scaled-up Contact card
    const targetWidthPx = 520;
    const targetThicknessPx = 180;
    
    // Scale X controls the diameter (width of the edge). Base diameter is 300px.
    // Scale Y controls the depth into the screen. Setting it near 0 flattens the cylinder,
    // which completely removes the perspective "bulge" and turns it into a perfect flat rectangle!
    contactSt.to(coinFlipRef.current.scale, {
      x: targetWidthPx / 300,
      y: 0.001, // Flatten depth
      ease: "power1.inOut"
    }, 0);

    // Scale Z controls the thickness. Base thickness in world units is 0.15.
    contactSt.to(coinFlipRef.current.scale, {
      z: () => {
         const vFov = (45 * Math.PI) / 180;
         const viewportHeight = 2 * Math.tan(vFov / 2) * 8;
         const factor = viewportHeight / window.innerHeight;
         
         const targetThicknessWorld = targetThicknessPx * factor;
         return targetThicknessWorld / 0.15;
      },
      ease: "power1.inOut"
    }, 0);

    // Revert the perspective-droop vertical shift so the edge aligns perfectly with the true center
    contactSt.to(coinScanRef.current.position, {
      y: 0,
      ease: "power1.inOut"
    }, 0);

    // No translation on coinOrbitRef.current.position is needed because scrollAnchorRef stops moving after #projects.
    // The coin is already perfectly centered by aboutSt and will remain centered in the viewport.

    // --- PHASE 3: Scanning Ring (Automated & Scroll-Locked) ---
    ScrollTrigger.create({
      trigger: "#projects",
      start: "top top", // Engages exactly when the dot finishes its approach
      onEnter: () => {
        // EXACT TIMING TRIGGER: Lock scroll precisely at the docking state
        lockScroll(); 
        
        // Automatically run the holographic scan sweep
        triggerScan();
      }
    });


    // Phase 3: The Holographic Smart Scan (Independent Automation)
    function triggerScan() {
      const target = getRingTarget();
      
      // We strictly kill tweens on the isolated scanRef, never the flipRef! 
      // This protects the scroll timeline from corruption.
      gsap.killTweensOf(coinScanRef.current.position, "x");
      gsap.killTweensOf(coinScanRef.current.rotation, "y");
      
      const sweepDuration = 1.2; 
      
      // Ensure lock is active (safeguard)
      lockScroll();

      const scanTl = gsap.timeline({
        onComplete: () => unlockScroll() // Release scroll lock perfectly when done!
      });

      // 1. Snap position to start
      scanTl.set(coinScanRef.current.position, { x: 0 }, 0);
      
      // Hide completely during forward sweep by pushing left inset far out
      scanTl.set('#blueprint-overlay', { clipPath: `inset(-1000px -1000px -1000px 2000px)` }, 0);

      // --- FORWARD SWEEP (0 to 1.2s) ---
      const forwardStart = 0;
      scanTl.to(coinScanRef.current.position, {
        x: -2 * target.x,
        duration: sweepDuration,
        ease: "power2.inOut"
      }, forwardStart);
      
      const edgeInDuration = 0.2; // Time spent traversing the "gap" before entering the card
      const forwardMidDuration = (sweepDuration / 2) - edgeInDuration; // 0.6 - 0.2 = 0.4
      
      // Y-Rotation Choreography
      // 1a. Rotate to left edge-on simultaneously while moving through the gap
      scanTl.to(coinScanRef.current.rotation, {
        y: target.leftEdgeOnRotation - target.restingAngle,
        duration: edgeInDuration,
        ease: "power2.out"
      }, forwardStart);
      
      // 1b. Rotate back to open (resting) in the middle
      scanTl.to(coinScanRef.current.rotation, {
        y: 0,
        duration: forwardMidDuration,
        ease: "power2.in"
      }, forwardStart + edgeInDuration);
      
      // 1c. Rotate to right edge-on at the end
      scanTl.to(coinScanRef.current.rotation, {
        y: target.rightEdgeOnRotation - target.restingAngle,
        duration: sweepDuration / 2, // 0.6
        ease: "power2.out"
      }, forwardStart + sweepDuration / 2);


      // --- RETURN SWEEP (1.2s to 2.4s) ---
      const returnStart = forwardStart + sweepDuration;
      // Reveal the blueprint overlay synchronously with the ring's return sweep (Right to Left)
      scanTl.to(coinScanRef.current.position, {
        x: 0,
        duration: sweepDuration,
        ease: "power2.inOut",
        onUpdate: function() {
           const maxRight = -2 * target.x;
           const progress = coinScanRef.current.position.x / maxRight; // 1.0 down to 0.0
           
           const finalCardWidth = target.width / target.factor;
           const gapPx = 24;
           const ringWidth = 100; // rough width of 3D ring on screen
           
           const startPixel = finalCardWidth + gapPx + ringWidth;
           const endPixel = -gapPx;
           const currentPixel = endPixel + progress * (startPixel - endPixel);
           
           const overlay = document.getElementById('blueprint-overlay');
           if (overlay) {
               overlay.style.clipPath = `inset(-1000px -1000px -1000px ${currentPixel}px)`;
           }
        }
      }, returnStart);

      // 2a. Rotate back to open (resting) in the middle
      scanTl.to(coinScanRef.current.rotation, {
        y: 0,
        duration: sweepDuration / 2, // 0.6
        ease: "power2.in"
      }, returnStart);
      
      // 2b. Rotate to left edge-on
      scanTl.to(coinScanRef.current.rotation, {
        y: target.leftEdgeOnRotation - target.restingAngle,
        duration: forwardMidDuration, // 0.4
        ease: "power2.out"
      }, returnStart + sweepDuration / 2);
      
      // 2c. Rotate back to resting angle while exiting the gap and docking
      scanTl.to(coinScanRef.current.rotation, {
        y: 0,
        duration: edgeInDuration, // 0.2
        ease: "power2.inOut"
      }, returnStart + sweepDuration / 2 + forwardMidDuration);
    };

    // Listen for custom projectSwapped events to re-trigger the scan dynamically
    const handleProjectSwapped = () => {
      setTimeout(() => triggerScan(), 50);
    };
    
    window.addEventListener('projectSwapped', handleProjectSwapped);

    return () => {
      unlockScroll(); // Absolute flawless cleanup safeguard!
      window.removeEventListener('projectSwapped', handleProjectSwapped);
    };

  }, [stage, is3DLoaded]);
}
