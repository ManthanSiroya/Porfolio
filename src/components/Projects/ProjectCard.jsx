import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import BlueprintOverlay from '../UI/BlueprintOverlay';
export const GithubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function ProjectCard({ project, onSwap }) {
  return (
    <motion.div
      layoutId={`project-${project.id}`}
      onClick={() => onSwap(project)}
      className={`group cursor-pointer rounded-2xl flex flex-col justify-start h-full
        backdrop-blur-xl
        shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1),_0_5px_15px_-5px_rgba(0,0,0,0.05),_inset_0_1px_1px_rgba(255,255,255,0.5),_inset_0_-1px_2px_rgba(0,0,0,0.05)]
        p-5 relative overflow-hidden transform-gpu`}
      style={{
        background: 'linear-gradient(135deg, rgba(217, 226, 225, 0.8) 0%, rgba(196, 213, 231, 0.8) 50%, rgba(223, 212, 162, 0.8) 100%)'
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      
      {/* Static Glass Grain Overlay */}
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-[0.65] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold tracking-tight pr-2 text-transparent bg-clip-text bg-gradient-to-br from-black via-slate-800 to-slate-400 [filter:drop-shadow(0_-1px_1px_rgba(255,255,255,0.7))_drop-shadow(0_2px_2px_rgba(0,0,0,0.3))] pb-1">
          {project.title}
        </h3>
        
        <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/icon p-1.5 rounded-lg bg-indigo-200/30 backdrop-blur-md text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.05),_inset_0_1px_1px_rgba(255,255,255,0.7)] border border-indigo-200/50">
            <GithubIcon size={16} className="transition-colors" />
          </a>
          <a href={project.deployLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/icon p-1.5 rounded-lg bg-indigo-200/30 backdrop-blur-md text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.05),_inset_0_1px_1px_rgba(255,255,255,0.7)] border border-indigo-200/50">
            <ExternalLink size={16} className="transition-colors" />
          </a>
        </div>
      </div>

      <div className="relative z-10 flex-grow">
        <p className="text-xs text-slate-900 leading-relaxed font-semibold line-clamp-3 [text-shadow:0_1px_0px_rgba(255,255,255,1)]">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

export function ActiveProjectCard({ activeProject }) {
  return (
    <motion.div 
      id="active-project-card"
      layoutId={`project-${activeProject.id}`}
      key={activeProject.id}
      className="absolute inset-0 m-auto z-50 
        w-[90%] md:w-[65%] lg:w-[40%] max-w-[550px] h-fit
        rounded-3xl p-6 flex flex-col justify-start
        backdrop-blur-2xl 
        shadow-[0_40px_80px_-15px_rgba(0,10,40,0.25),_0_15px_30px_-5px_rgba(0,10,40,0.1),_inset_0_1px_2px_rgba(255,255,255,0.6),_inset_0_-1px_4px_rgba(0,0,0,0.05),_inset_0_0_20px_rgba(6,182,212,0.1)]
        pointer-events-auto transform-gpu"
      style={{
        background: 'linear-gradient(135deg, rgba(217, 226, 225, 0.95) 0%, rgba(196, 213, 231, 0.95) 50%, rgba(223, 212, 162, 0.95) 100%)'
      }}
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }} // Slight scale bump to visually pop out
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <BlueprintOverlay skills={activeProject.skills || []} />
      {/* Static Glass Grain Overlay */}
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-[0.65] pointer-events-none rounded-3xl z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Inner volumetric light sweep for premium glass feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/10 to-transparent rounded-3xl pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <div className="inline-block px-3 py-1 mb-2 rounded-md bg-indigo-200/40 backdrop-blur-md text-indigo-950 text-[11px] font-extrabold uppercase tracking-widest border border-indigo-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.05),_inset_0_1px_1px_rgba(255,255,255,0.8)] [text-shadow:0_1px_0px_rgba(255,255,255,0.6)]">
            {activeProject.skills?.[0] || "Active Module"}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight pr-4 text-transparent bg-clip-text bg-gradient-to-br from-black via-slate-800 to-slate-400 [filter:drop-shadow(0_-1px_1px_rgba(255,255,255,0.8))_drop-shadow(0_3px_3px_rgba(0,0,0,0.4))] pb-2">
            {activeProject.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0 pointer-events-auto mt-1">
          <a href={activeProject.githubLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
             className="group/icon p-2.5 rounded-xl bg-indigo-200/30 backdrop-blur-md text-slate-700 hover:text-blue-600 border border-indigo-200/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05),_inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95">
            <GithubIcon size={22} className="transition-colors" />
          </a>
          <a href={activeProject.deployLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
             className="group/icon p-2.5 rounded-xl bg-indigo-200/30 backdrop-blur-md text-slate-700 hover:text-blue-600 border border-indigo-200/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05),_inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95">
            <ExternalLink size={22} className="transition-colors" />
          </a>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-sm md:text-base text-slate-900 font-semibold leading-relaxed [text-shadow:0_1px_0px_rgba(255,255,255,1)]">
          {activeProject.description}
        </p>
      </div>
    </motion.div>
  );
}
