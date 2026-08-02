# 3D Developer Portfolio

A cinematic, high-performance personal portfolio designed to showcase my full-stack web development and problem-solving capabilities. Built entirely with React, Three.js, GSAP, and Tailwind CSS, this project moves away from standard web layouts to explore complex spatial UI/UX. It features custom WebGL geometry, including a fully interactive 3D rotating coin interface, volumetric glass aesthetics, and synchronized typographic animations.

## 🌟 Key Features

*   **Cinematic WebGL Integration**: A seamlessly integrated 3D avatar/coin element that morphs and transitions, anchoring itself mathematically to DOM elements, Highly choreographed scroll and hover interactions powered by GSAP.
*   **Procedural UI Generation**: The Projects section uses an algorithmic blueprint overlay that generates perfectly spaced SVG lines and skill nodes around active project cards without intersecting.
*   **High-Performance Animations**: Utilizes GSAP with ScrollTrigger and `@gsap/react` for buttery-smooth, hardware-accelerated scroll hijacking and cinematic camera movements without memory leaks.
*   **Scalable Component Architecture**: Clean, modular folder structure (`src/components`, `src/hooks`, `src/layouts`) designed for long-term maintainability.
*   **Responsive Glassmorphism**: Premium frosted-glass design tokens and Tailwind CSS utilities that perfectly scale across all device sizes.

## 🛠️ Tech Stack

*   **Framework**: React (Vite)
*   **3D Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`
*   **Animation Engine**: GSAP (GreenSock), Framer Motion
*   **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`
*   **Icons**: `lucide-react`, `react-icons`

## 🚀 Getting Started

### Live Demo Link: 

## 📂 Project Structure

```
├── public/                 # Static assets (3D models, global textures)
├── src/
│   ├── assets/             # Images, local fonts, and SVGs
│   ├── components/         # Modular React components
│   │   ├── 3D/             # WebGL Canvases, Cameras, and Meshes
│   │   ├── About/          # About section UI
│   │   ├── Contact/        # Interactive footer components
│   │   ├── Hero/           # Landing screen UI
│   │   ├── Projects/       # Dynamic project grids and cards
│   │   ├── Skills/         # Skill showcases
│   │   └── UI/             # Reusable UI overlays (Blueprint, Loaders)
│   ├── hooks/              # Custom React and GSAP logic (useScannerAnimation)
│   ├── layouts/            # Global wrapper components
│   ├── utils/              # Helper functions (cn)
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Global styles and Tailwind directives
│   └── main.jsx            # React root
├── .gitignore              
├── package.json            
├── tailwind.config.js      
└── vite.config.js          
```

## 🎨 Design Philosophy

This portfolio is designed to be **More than a Website; It's an Experience.** 
It leverages strict geometry for its procedural overlays, guarantees visual hierarchy through robust contrast and glassmorphism, and never compromises on performance (utilizing `useMemo`, `React.lazy`, and explicit WebGL `.dispose()` methods).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
