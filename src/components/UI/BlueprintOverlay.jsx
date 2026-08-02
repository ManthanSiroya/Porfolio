import React, { useMemo } from 'react';

// Helper to generate perfectly spaced paths avoiding all intersections
function generateDynamicPath(edge, pct) {
  const L1 = 25 + Math.random() * 15;
  const L2 = 25 + Math.random() * 15;

  let points = [{ x: 0, y: 0 }];
  let currentX = 0;
  let currentY = 0;
  
  const addSegment = (angleDeg, length) => {
    const angleRad = angleDeg * (Math.PI / 180);
    const dx = Math.round(Math.cos(angleRad) * length);
    const dy = Math.round(Math.sin(angleRad) * length);
    currentX += dx;
    currentY += dy;
    points.push({ x: currentX, y: currentY });
  };

  if (edge === 'right') {
    // Right edge: 1 line. Top half -> 45 (Down-Right in SVG). Bottom half -> -45 (Up-Right in SVG).
    const angle = pct <= 50 ? 45 : -45;
    addSegment(angle, L1);
  } else if (edge === 'top') {
    // Top edge: goes OUT (Up). SVG Up is negative Y (-45 or -135).
    const isRightHalf = pct > 50;
    const a1 = isRightHalf ? -45 : -135; 
    const horizontalAngle = isRightHalf ? 0 : 180;
    
    addSegment(a1, L1);
    addSegment(horizontalAngle, L2);
    
    // 50% chance of 3rd segment
    if (Math.random() > 0.5) {
      const L3 = 15 + Math.random() * 15;
      addSegment(a1, L3);
    }
  } else if (edge === 'bottom') {
    // Bottom edge: goes OUT (Down). SVG Down is positive Y (45 or 135).
    const isRightHalf = pct > 50;
    const a1 = isRightHalf ? 45 : 135;
    const horizontalAngle = isRightHalf ? 0 : 180;
    
    addSegment(a1, L1);
    addSegment(horizontalAngle, L2);
    
    // 50% chance of 3rd segment
    if (Math.random() > 0.5) {
      const L3 = 15 + Math.random() * 15;
      addSegment(a1, L3);
    }
  }

  const pathD = `M0,0 ` + points.slice(1).map(p => `L${p.x},${p.y}`).join(' ');
  const endPoint = points[points.length - 1];
  
  return { pathD, endPoint };
}

export default function BlueprintOverlay({ skills = [] }) {
  
  const lines = useMemo(() => {
    if (!skills || skills.length === 0) return [];

    // Sort skills by length so the shortest goes to the right edge
    const sortedSkills = [...skills].sort((a, b) => a.length - b.length);
    const shortestSkill = sortedSkills.shift();
    const remainingSkills = sortedSkills;

    const topCount = Math.ceil(remainingSkills.length / 2);
    const bottomCount = remainingSkills.length - topCount;

    const zones = [];
    
    // Right Edge (Shortest skill)
    const rightY = 20 + Math.random() * 60;
    zones.push({
      id: 'right-1',
      skill: shortestSkill,
      cssPos: { top: `${rightY}%`, right: '0%' },
      attach: 'left-center',
      edge: 'right',
      pct: rightY
    });

    // Top Edge
    for (let i = 0; i < topCount; i++) {
      const x = (i + 1) * (100 / (topCount + 1));
      zones.push({
        id: `top-${i}`,
        skill: remainingSkills[i],
        cssPos: { top: '0%', left: `${x}%` },
        attach: 'bottom-center',
        edge: 'top',
        pct: x
      });
    }

    // Bottom Edge
    for (let i = 0; i < bottomCount; i++) {
      const x = (i + 1) * (100 / (bottomCount + 1));
      zones.push({
        id: `bottom-${i}`,
        skill: remainingSkills[topCount + i],
        cssPos: { bottom: '0%', left: `${x}%` },
        attach: 'top-center',
        edge: 'bottom',
        pct: x
      });
    }

    return zones.map((zone) => {
      const { pathD, endPoint } = generateDynamicPath(zone.edge, zone.pct);
      return { ...zone, pathD, endPoint };
    });
  }, [skills]);

  return (
    <div 
      id="blueprint-overlay"
      className="absolute inset-0 pointer-events-none z-[100]"
      style={{
        clipPath: 'inset(-1000px -1000px -1000px 2000px)',
        transform: 'translateZ(30px)',
        willChange: 'clip-path'
      }}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#06b6d4" floodOpacity="0.8"/>
          </filter>
        </defs>
      </svg>

      {lines.map((line) => {
        let containerClasses = "absolute flex items-center justify-center";
        let transform = "";
        let textMargin = "";
        
        if (line.attach === 'right-center') {
          containerClasses += " flex-row-reverse";
          transform = "translate(-100%, -50%)"; // Flows left
          textMargin = "mr-[-4px]";
        } else if (line.attach === 'left-center') {
          containerClasses += " flex-row";
          transform = "translate(0%, -50%)"; // Flows right
          textMargin = "ml-[-4px]";
        } else if (line.attach === 'bottom-center') {
          containerClasses += " flex-col-reverse";
          transform = "translate(-50%, -100%)"; // Flows up
          textMargin = "mb-[-4px]";
        } else if (line.attach === 'top-center') {
          containerClasses += " flex-col";
          transform = "translate(-50%, 0%)"; // Flows down
          textMargin = "mt-[-4px]";
        }

        return (
          <div 
            key={line.id} 
            className="absolute"
            style={line.cssPos}
          >
            {/* Origin Node */}
            <div className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" style={{ transform: 'translate(-50%, -50%)' }} />
            
            <svg className="absolute overflow-visible" style={{ left: 0, top: 0 }}>
              <path 
                d={line.pathD} 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="2" 
                filter="url(#cyanGlow)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Premium Capsule with Dynamic Attachment */}
            <div 
              className={containerClasses}
              style={{
                left: line.endPoint.x,
                top: line.endPoint.y,
                transform: transform
              }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.8)] relative z-10 shrink-0" />
              
              <div className={`px-5 py-1.5 rounded-full bg-cyan-900/40 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center ${textMargin}`}>
                <span className="text-cyan-300 text-xs font-bold tracking-widest uppercase whitespace-nowrap drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] leading-none mt-[1px]">
                  {line.skill}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
