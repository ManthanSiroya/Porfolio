import React, { forwardRef } from 'react';
import Coin3D from './Coin3D';

const ScannerRing = forwardRef(({ 
  shouldMount3D, 
  coinOrbitRef, 
  coinScanRef, 
  coinFlipRef, 
  coinCameraRef, 
  coinSolidRef, 
  coinRingRef, 
  setIs3DLoaded,
  coinScrollAnchorRef 
}, ref) => {
  if (!shouldMount3D) return null;

  return (
    <div 
      ref={ref} 
      className="fixed top-0 left-0 w-full h-screen pointer-events-none z-40"
      style={{
        opacity: 0 // Keep invisible until GSAP brings it to opacity-1
      }}
    >
      <Coin3D 
        meshRef={coinOrbitRef} 
        scanRef={coinScanRef} 
        flipRef={coinFlipRef} 
        cameraRef={coinCameraRef} 
        solidRef={coinSolidRef} 
        ringRef={coinRingRef} 
        scrollAnchorRef={coinScrollAnchorRef}
        onReady={() => setIs3DLoaded(true)} 
      />
    </div>
  );
});

export default ScannerRing;
