import { forwardRef } from 'react';

const GlobalPuppet = forwardRef(({ avatarRef, activeCategory, className }, ref) => {
  return (
    <div className={`fixed inset-0 z-[100] pointer-events-none ${className || ''}`}>
      
      {/* The perfectly round ball */}
      <div 
        ref={ref}
        className="hardware-accelerate absolute top-1/2 left-1/2 w-[2cm] h-[2cm] bg-[#111111] rounded-full overflow-hidden flex items-center justify-center"
      >
        <img 
          ref={avatarRef}
          src="/Avatar.jpg" 
          alt="Avatar" 
          className="w-full h-full object-cover opacity-0" 
        />
      </div>
    </div>
  );
});

GlobalPuppet.displayName = 'GlobalPuppet';

export default GlobalPuppet;
