import { forwardRef, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const CoinMesh = ({ coinRadius }) => {
  const avatarTexture = useTexture('/Avatar.jpg');
  
  const { sideMaterial, backMaterial, frontMaterial } = useMemo(() => {
    // Ensure accurate colors by setting sRGB color space before rendering
    avatarTexture.colorSpace = THREE.SRGBColorSpace;
    avatarTexture.needsUpdate = true;

    return {
      sideMaterial: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.8 }),
      backMaterial: new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.9 }),
      frontMaterial: new THREE.MeshBasicMaterial({ 
        map: avatarTexture,
        toneMapped: false
      })
    };
  }, [avatarTexture]);

  const geometryRef = useRef();

  useEffect(() => {
    return () => {
      if (geometryRef.current) geometryRef.current.dispose();
      sideMaterial.dispose();
      backMaterial.dispose();
      frontMaterial.dispose();
      avatarTexture.dispose();
    };
  }, [sideMaterial, backMaterial, frontMaterial, avatarTexture]);

  return (
    <mesh 
      // Cylinder is Y-up by default. Rotate X by 90deg to face camera.
      // Rotate Y by 90deg to spin the texture upright (head pointing up).
      rotation={[Math.PI / 2, Math.PI / 2, 0]}
    >
      <cylinderGeometry ref={geometryRef} args={[coinRadius, coinRadius, 0.15, 64]} />
      {/* Materials array: [side, top (front), bottom (back)] */}
      <primitive object={sideMaterial} attach="material-0" />
      <primitive object={frontMaterial} attach="material-1" />
      <primitive object={backMaterial} attach="material-2" />
    </mesh>
  );
};

const RingMesh = ({ coinRadius, avgThickness }) => {
  // Sleek, volumetric physical material to create physical depth and visual separation
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#0a0a0a', 
    roughness: 0.4, 
    metalness: 0.8,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2
  }), []);
  
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      const tubeRadius = avgThickness / 2;
      const torusRadius = coinRadius - tubeRadius;
      meshRef.current.geometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 16, 64);
    }
    return () => {
      if (meshRef.current && meshRef.current.geometry) {
        meshRef.current.geometry.dispose();
      }
      material.dispose();
    };
  }, [coinRadius, avgThickness, material]);

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      {/* Torus geometry is managed imperatively so GSAP can mutate it safely */}
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const SceneContext = ({ meshRef, flipRef, scanRef, solidRef, ringRef, scrollAnchorRef }) => {
  const { viewport, size } = useThree()
  
  // Convert exactly 300px to world units based on current viewport
  const coinDiameterWorld = 300 * (viewport.width / size.width)
  const coinRadius = coinDiameterWorld / 2
  

  // Unifying the Geometry (The Average Thickness)
  const coinThickness = 0.15;
  const currentRingThickness = coinRadius * 0.30;
  const avgThickness = (coinThickness + currentRingThickness) / 2;

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Outer group for Trajectory (X, Y, Tilt Z). Position set dynamically by GSAP */}
      <group ref={scrollAnchorRef} position={[0, 0, 0]}>
        <group ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          {/* Independent group strictly for the horizontal holographic scan motion */}
          <group ref={scanRef} position={[0, 0, 0]}>
            <Suspense fallback={null}>
              {/* Inner group for Flip (Rotation Y) and Shrink (Scale) */}
              <group ref={flipRef}>
                <group ref={solidRef}>
                  <CoinMesh coinRadius={coinRadius} />
                </group>
                <group ref={ringRef} visible={false}>
                  <RingMesh coinRadius={coinRadius} avgThickness={avgThickness} />
                </group>
              </group>
            </Suspense>
          </group>
        </group>
      </group>
    </>
  )
};

const Coin3D = ({ cameraRef, onReady, flipRef, meshRef, scanRef, solidRef, ringRef, scrollAnchorRef }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ powerPreference: "high-performance", antialias: false }}
        style={{ pointerEvents: 'none' }} 
        onCreated={() => onReady && onReady()}
      >
        <PerspectiveCamera 
          makeDefault 
          ref={cameraRef} 
          position={[0, 0, 8]} 
          fov={45} 
        />
        
        <SceneContext meshRef={meshRef} flipRef={flipRef} scanRef={scanRef} solidRef={solidRef} ringRef={ringRef} scrollAnchorRef={scrollAnchorRef} />
      </Canvas>
    </div>
  );
};

export default Coin3D;
