import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Loader from './components/UI/Loader'
import GlobalPuppet from './layouts/GlobalPuppet'
import AnimatedButton from './components/UI/AnimatedButton'
import ScrollProgress from './components/UI/ScrollProgress'
import Hero from './components/Hero/Hero'
import Skills from './components/Skills/Skills'
import ScannerRing from './components/3D/ScannerRing'
import AboutUI from './components/About/AboutUI'
import { useScannerAnimation } from './hooks/useScannerAnimation'
import Lenis from 'lenis'

const MyProjects = lazy(() => import('./components/Projects/MyProjects'))
const SocialFlipButton = lazy(() => import('./components/Contact/Contact'))

gsap.registerPlugin(ScrollTrigger, useGSAP)

function App() {
  const [stage, setStage] = useState(1) // 1: Intro, 2: 3D Ready, 3/4: Handled by GSAP ScrollTrigger
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const [shouldMount3D, setShouldMount3D] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [isAboutUIVisible, setIsAboutUIVisible] = useState(false)
  const [isContactUIVisible, setIsContactUIVisible] = useState(false)
  
  const puppetRef = useRef(null)
  const avatarRef = useRef(null)
  const textGroupRef = useRef(null)
  const nameRef = useRef(null)
  const helloRef = useRef(null)
  const imRef = useRef(null)
  const subtitleRef = useRef(null)
  const navRef = useRef(null)
  const bgContainerRef = useRef(null)
  const gridContainerRef = useRef(null)

  // 3D Refs
  const coinWrapperRef = useRef(null)
  const coinOrbitRef = useRef(null)
  const coinScanRef = useRef(null)
  const coinFlipRef = useRef(null)
  const coinCameraRef = useRef(null)
  const timelineTrackRef = useRef(null)
  const coinSolidRef = useRef(null)
  const coinRingRef = useRef(null)
  const coinScrollAnchorRef = useRef(null)

  const { contextSafe } = useGSAP(() => {
    // Initial setup for the puppet
    gsap.set(puppetRef.current, {
      xPercent: -50,
      yPercent: -50, // Center of screen
    })
    
    // Initial setup for text group (perfectly centered)
    gsap.set(textGroupRef.current, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50
    })

    // Initial setup for typographic grid words
    gsap.set('.grid-word', { opacity: 0, y: 20 })
  }, [])

  // Setup Lenis for harsh/slow smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Adjusts interpolation smoothness
      wheelMultiplier: 0.35, // Enforces harsh scroll limit (reduces mouse wheel speed by 65%)
      smoothWheel: true,
    })

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Prevent GSAP from disabling animations on lag, keeping scroll locked in sync
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  const handleLoaderComplete = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setStage(2) // Trigger Handoff to 3D
      }
    })
    
    const nameWidth = nameRef.current.offsetWidth

    // 1. Pop & Drop (Bounce) to center with exact kinematic physics and Typographic Fade-In
    tl.addLabel("start", 0)
    tl.to('.grid-word', { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" }, "start")
    tl.to(puppetRef.current, { y: "-40vh", duration: 0.40, ease: "power1.out" }, "start")
    tl.to(puppetRef.current, { y: "45vh", duration: 0.58, ease: "power1.in" }, "start+=0.4")
    tl.to(puppetRef.current, { y: "-15vh", duration: 0.49, ease: "power1.out" }, "start+=0.98")
    tl.to(puppetRef.current, { y: "45vh", duration: 0.49, ease: "power1.in" }, "start+=1.47")
    tl.to(puppetRef.current, { y: "0vh", duration: 0.42, ease: "power1.out" }, "start+=1.96")
    
    // Typographic Fade-Out (0.5s after ball settles at 2.38s)
    tl.to(gridContainerRef.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "start+=2.88")

    // 2. Setup Writing Effect
    tl.to(puppetRef.current, { x: -nameWidth / 2, duration: 0.5, ease: "power2.inOut" })
    
    // 3. Write Text
    tl.to(puppetRef.current, {
      x: (nameWidth / 2) + 45,
      duration: 1.5,
      ease: "power2.inOut"
    }, "write")
    tl.fromTo(nameRef.current, 
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power2.inOut" },
      "write"
    )

    // GSAP Timeline for Section 2 Entrance (Coin dropping down into place)
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom", // Starts when #about just enters viewport from bottom
        end: "top top",      // Ends when #about hits top of viewport
        scrub: 1
      }
    });

    aboutTl.fromTo("#about h2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
    aboutTl.fromTo("#about div", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.5");

    // Toggle the AboutUI overlay exactly when the 3D coin flip finishes (i.e. when #about reaches top top)
    // We use "top 5%" to trigger slightly before the absolute end, ensuring the fade feels instantaneous as it docks.
    // It fades out slightly before the Contact section enters (bottom 110%) to give it time to clear.
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 5%",
      end: "bottom 110%",
      onEnter: () => setIsAboutUIVisible(true),
      onLeave: () => setIsAboutUIVisible(false),
      onEnterBack: () => setIsAboutUIVisible(true),
      onLeaveBack: () => setIsAboutUIVisible(false),
    });
    
    // Toggle the Contact UI when the coin has finished rotating and scaling
    ScrollTrigger.create({
      trigger: "#contact",
      start: "top top", // Triggers when the top of #contact reaches the top of the viewport
      onEnter: () => setIsContactUIVisible(true),
      onLeaveBack: () => setIsContactUIVisible(false),
    });

    // 4. The Layout Split
    tl.to(textGroupRef.current, {
      left: "15vw",
      xPercent: 0, 
      duration: 1.5,
      ease: "power3.inOut"
    }, "split")
    
    tl.to(puppetRef.current, {
      x: "25vw", 
      width: "300px",
      height: "300px",
      duration: 1.5,
      ease: "power3.inOut"
    }, "split")
    
    tl.to(bgContainerRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut"
    }, "split")
    
    // Mount 3D coin slightly before intro finishes, so it pre-renders behind the avatar
    tl.to(avatarRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => setShouldMount3D(true)
    }, "split+=0.5")
    
    // 5. Secondary Elements Reveal
    const secondaryElements = [
      helloRef.current, 
      imRef.current, 
      subtitleRef.current
    ]
    
    tl.to(secondaryElements, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out"
    }, "split+=0.8")

    tl.to(navRef.current.children, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out"
    }, "split+=1.0")
  })

  useScannerAnimation({
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
  })

  return (
    <main className={`relative w-full ${stage < 2 ? 'overflow-hidden h-screen' : 'overflow-x-hidden'} bg-white`}>
      {stage >= 2 && <ScrollProgress />}
      <Loader onComplete={handleLoaderComplete} />
      
      {/* Stage 1: DOM Intro Puppet */}
      <GlobalPuppet 
        ref={puppetRef} 
        avatarRef={avatarRef} 
        activeCategory={activeCategory}
      />

      {/* Stage 2 & 3: WebGL Persistent Container */}
      <ScannerRing 
        ref={coinWrapperRef}
        shouldMount3D={shouldMount3D}
        coinOrbitRef={coinOrbitRef}
        coinScanRef={coinScanRef}
        coinFlipRef={coinFlipRef}
        coinCameraRef={coinCameraRef}
        coinSolidRef={coinSolidRef}
        coinRingRef={coinRingRef}
        setIs3DLoaded={setIs3DLoaded}
        coinScrollAnchorRef={coinScrollAnchorRef}
      />

      {/* The DOM UI Overlay that sits perfectly over the 3D coin */}
      <AboutUI isVisible={isAboutUIVisible} />

      {/* Global Navigation */}
      <div className="absolute top-0 left-0 w-full z-[100] pointer-events-none">
        <nav className="flex justify-start items-start w-full pl-8 pr-4 pt-6 md:pl-24 md:pr-12 md:pt-10">
          <div ref={navRef} className="flex gap-2 md:gap-4 text-sm md:text-base font-medium tracking-wide pointer-events-auto">
            {['Projects', 'About', 'Contact'].map(item => (
              <div key={item} className="opacity-0 translate-y-4">
                <AnimatedButton>
                  {item}
                </AnimatedButton>
              </div>
            ))}
          </div>
        </nav>
      </div>

      <Hero 
        bgContainerRef={bgContainerRef}
        gridContainerRef={gridContainerRef}
        textGroupRef={textGroupRef}
        helloRef={helloRef}
        imRef={imRef}
        subtitleRef={subtitleRef}
        nameRef={nameRef}
      />

      <Skills 
        timelineTrackRef={timelineTrackRef}
        setActiveCategory={setActiveCategory}
      />

      {/* Section 1: My Projects */}
      <section id="projects" className="relative w-full min-h-screen bg-gradient-to-b from-teal-50/50 to-emerald-100/30 z-10 flex flex-col pt-24 md:pt-32">
        <div className="w-full max-w-[1600px] mx-auto px-4 flex flex-col items-center justify-start flex-grow relative z-20 overflow-hidden">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 drop-shadow-sm">My Projects</h2>
          <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading Projects...</div>}>
            <MyProjects />
          </Suspense>
        </div>
      </section>

      {/* Section 2: About Me */}
      <section id="about" className="relative w-full h-[160vh] bg-gradient-to-b from-emerald-100/30 via-slate-100 to-zinc-200 z-10 flex flex-col">
        {/* We removed the absolute heading here as requested. */}
        
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center flex-grow relative z-20">
          <div className="w-full h-96 border border-transparent rounded-3xl flex items-center justify-center bg-transparent">
            {/* The white card is removed, this invisible container just maintains structure for math centering */}
          </div>
        </div>
      </section>

      {/* Section 3: Contact */}
      <section id="contact" className="relative w-full h-[250vh] bg-gradient-to-b from-zinc-200 via-indigo-50 to-violet-200/80 z-10 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center flex-grow relative z-20">
          {/* Contact heading removed as requested */}
          {/* We keep this space empty so the user can scroll, but the actual Contact UI is a fixed overlay */}
        </div>
      </section>

      {/* The DOM UI Overlay that sits perfectly over the 3D coin in the Contact section */}
      <div className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-700 ${isContactUIVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}>
        <Suspense fallback={null}>
          <SocialFlipButton />
        </Suspense>
      </div>
    </main>
  )
}

export default App
