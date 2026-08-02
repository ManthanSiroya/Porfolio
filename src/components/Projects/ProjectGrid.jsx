import React from 'react';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid({ gridCells, gridProjects, handleSwap }) {
  return (
    <div className="w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-8 lg:gap-y-20 relative z-10 px-4 md:px-12">
      {gridCells.map((cellIndex) => {
        if (cellIndex === 4) {
          return <div key="empty-center" className="pointer-events-none hidden lg:block" />;
        }

        const dataIndex = cellIndex > 4 ? cellIndex - 1 : cellIndex;
        const project = gridProjects[dataIndex];
        
        if (!project) return null;

        const isTopRow = cellIndex < 3;
        const isBottomRow = cellIndex > 5;
        const tuckClass = isTopRow 
          ? 'lg:translate-y-12' 
          : isBottomRow 
            ? 'lg:-translate-y-12' 
            : '';

        return (
          <div key={project.id} className={tuckClass}>
            <ProjectCard project={project} onSwap={handleSwap} />
          </div>
        );
      })}
    </div>
  );
}
