import React, { useState } from 'react';
import { ProjectGrid } from './ProjectGrid';
import { ActiveProjectCard } from './ProjectCard';

const projectsData = [
  {
    id: 1,
    title: "HTML/CSS Profile",
    description: "A foundational front-end interface built entirely from scratch without AI or frameworks to master core web technologies.",
    githubLink: "https://github.com/ManthanSiroya/Profile-Page",
    deployLink: "https://manthansiroya.github.io/Profile-Page/",
    skills: ["HTML", "CSS"]
  },
  {
    id: 2,
    title: "AI WebGL Portfolio",
    description: "An experimental 3D dynamic portfolio crafted with AI, leveraging WebGL and spatial rendering techniques.",
    githubLink: "https://github.com/ManthanSiroya/My-first-3D-Portfolio",
    deployLink: "https://my-first-3-d-portfolio.vercel.app/",
    skills: ["React", "Three.js + React Wrapper", "WebGL", "GSAP", "Framer Motion", "Tailwind CSS"]
  },
  {
    id: 3,
    title: "BlackSwan",
    description: "An AI-driven supply chain optimization and risk management platform tailored for the global energy sector to mitigate real-time operational threats.",
    githubLink: "https://github.com/ManthanSiroya/BlackSwan",
    deployLink: "https://black-swan-rust.vercel.app/",
    skills: ["Next.js 16", "React", "Tailwind CSS + Shadcn UI", "APScheduler", "FastAPI", "PostgreSQL"]
  },
  {
    id: 4,
    title: "Soverncivic App",
    description: "A mobile application for civic engagement and community participation.",
    githubLink: "https://github.com/ManthanSiroya/SovereginCivic-Mobile",
    deployLink: "https://github.com/ManthanSiroya/SovereginCivic-Mobile",
    skills: ["TypeScript", "Expo", "Mobile-App", "Neo4j", "AuraDB"]
  },
  {
    id: 5,
    title: "3D Developer Portfolio",
    description: "A cinematic personal portfolio built with React, Three.js, and GSAP, featuring advanced scroll animations and volumetric effects.",
    githubLink: "https://github.com/ManthanSiroya/Porfolio",
    deployLink: "https://manthan-porfolio.vercel.app/",
    skills: ["React", "Three.js(WebGL)", "GSAP", "Next.js", "Tailwind CSS", "Complex-Physics"]
  },
  {
    id: 6,
    title: "Travel Platform Clone",
    description: "A responsive web replica of a modern travel platform, focusing on complex UI layouts and scalable component design.",
    githubLink: "https://github.com/ManthanSiroya/Travel_websit_replica",
    deployLink: "https://manthansiroya.github.io/Travel_websit_replica/",
    skills: ["HTML", "CSS"]
  },
  {
    id: 7,
    title: "Lost & Found",
    description: "A full-stack web application providing an intuitive interface for users to report, track, and claim lost items.",
    githubLink: "https://github.com/ManthanSiroya/Lost-and-Found",
    deployLink: "https://github.com/ManthanSiroya/Lost-and-Found",
    skills: ["PHP", "JavaScript", "CSS", "HTML"]
  },
  {
    id: 8,
    title: "Linear Regression ML",
    description: "A machine learning practice repository demonstrating the manual implementation and training of predictive models.",
    githubLink: "https://github.com/ManthanSiroya/Linear-Regression",
    deployLink: "https://manthansiroya.github.io/Linear-Regression/",
    skills: ["Python", "NumPy", "Pandas", "Scikit-Learn", "Jupyter Notebook"]
  },
  {
    id: 9,
    title: "ImpactHub",
    description: "A collaborative platform designed to connect social impact projects with volunteers and resources, fostering community engagement.",
    githubLink: "https://github.com/ManthanSiroya/ImpactHub",
    deployLink: "https://impact-hub-mu.vercel.app/",
    skills: ["Next.js", "TypeScript", "React 18", "Framer Motion", "CSS"]
  }
];

export default function MyProjects() {
  const [activeProject, setActiveProject] = useState(projectsData[4]);
  const [gridProjects, setGridProjects] = useState(projectsData.filter(p => p.id !== 5));

  const gridCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const handleSwap = (clickedProject) => {
    const clickedIndex = gridProjects.findIndex(p => p.id === clickedProject.id);
    if (clickedIndex === -1) return;

    const newGridProjects = [...gridProjects];
    newGridProjects[clickedIndex] = activeProject;

    setGridProjects(newGridProjects);
    setActiveProject(clickedProject);

    // Notify global GSAP timeline to trigger a scan
    window.dispatchEvent(new Event('projectSwapped'));
  };

  return (
    <div id="projects-grid-container" className="relative w-full pt-2 pb-12 flex items-center justify-center p-4">
      <ProjectGrid gridCells={gridCells} gridProjects={gridProjects} handleSwap={handleSwap} />
      
      {/* Center Active Project Card */}
      {activeProject && (
        <ActiveProjectCard activeProject={activeProject} />
      )}
    </div>
  );
}
