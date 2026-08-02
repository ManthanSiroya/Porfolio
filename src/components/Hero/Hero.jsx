import React, { forwardRef } from 'react';

const Hero = forwardRef(({ bgContainerRef, gridContainerRef, textGroupRef, helloRef, imRef, subtitleRef, nameRef }, ref) => {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden z-0">
      
      {/* Localized Background Container */}
      <div ref={bgContainerRef} className="absolute inset-0 -z-10 opacity-0 pointer-events-none">
        <div className="absolute inset-0 z-0 bg-[#4A6B8A]" />
        <video 
          className="absolute inset-0 z-0 w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
          }}
          src="/background.mp4"
        />
      </div>

      {/* Layer 1.5: Typographic Center-Axis Grid */}
      <div ref={gridContainerRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="grid grid-cols-2 gap-x-20 md:gap-x-32 items-baseline w-max">
          <div className="grid-word text-right text-4xl md:text-5xl text-slate-400 font-medium tracking-[0.4em] uppercase">PIXELS</div>
          <div className="grid-word text-left text-4xl md:text-5xl text-slate-400 font-medium tracking-[0.4em] uppercase">PHYSICS</div>
          <div className="grid-word text-right text-5xl md:text-7xl text-slate-900 font-extrabold tracking-tighter uppercase">PERFORMANCE.</div>
          <div className="grid-word text-left text-5xl md:text-7xl text-slate-900 font-extrabold tracking-tighter uppercase">PERFECTION.</div>
        </div>
      </div>

      {/* LAYER 2 & 3: Typography Rig */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div ref={textGroupRef} className="absolute z-10 flex items-center justify-center w-max">
          <div className="relative flex items-center text-[5vw] leading-none font-sans font-medium tracking-[-0.02em] whitespace-pre text-[#111111]">
            <div className="absolute right-full h-full flex items-center mr-[1vw]">
              <div className="relative flex flex-col items-start whitespace-nowrap">
                <div ref={helloRef} className="absolute bottom-full mb-[1vw] font-cursive text-[#111111] text-[6vw] leading-none opacity-0 translate-y-4">
                  hello,
                </div>
                <div ref={imRef} className="text-[5vw] leading-none font-sans font-medium tracking-[-0.02em] text-[#111111] opacity-0 translate-y-4">
                  I'm
                </div>
                <div ref={subtitleRef} className="absolute top-full mt-[2vw] font-sans font-medium text-[#111111] text-lg md:text-[2vw] tracking-wider opacity-0 translate-y-4">
                  A cinematic website creator
                </div>
              </div>
            </div>
            <div ref={nameRef} className="text-[5vw] leading-none font-sans font-medium tracking-[-0.02em] whitespace-nowrap text-[#111111]" style={{ clipPath: "inset(0 100% 0 0)" }}>
              Manthan Siroya
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
