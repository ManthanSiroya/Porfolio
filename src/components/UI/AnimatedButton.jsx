  "use client";

import React, { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils";

/**
 * AnimatedButton
 * - theme-aware: uses Tailwind `dark:` classes so it works in both light and dark mode
 * - accepts all native button props (onClick, className, type, etc.)
 */
const AnimatedButton = forwardRef(({
  children,
  className = "",
  as = "button",
  ...rest
}, ref) => {
  // Memoize the Framer Motion component to avoid remounting on renders
  const Component = useMemo(() => {
    if (typeof as === 'string') {
      return motion[as] || motion.button;
    }
    // For Framer Motion v12+, motion.create() handles custom components
    return motion.create(as);
  }, [as]);

  return (
    <Component
      ref={ref}
      {...rest}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.97 }
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
      // Set a CSS variable `--shine` that we override for dark mode via Tailwind.
      className={cn(
        "group inline-flex items-center justify-center px-4 py-1 rounded-md relative overflow-hidden bg-transparent border border-neutral-200 dark:border-[#222]",
        "text-neutral-900 dark:text-neutral-100 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50",
        "[--shine:rgba(0,0,0,.66)] dark:[--shine:rgba(255,255,255,.66)]",
        className,
      )}
    >
      {/* Text with shine mask */}
      <motion.span
        className="tracking-wide font-light flex items-center justify-center h-full w-full relative z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        variants={{
          initial: { "--mask-x": "100%" },
          hover: {
            "--mask-x": "-100%",
            transition: {
              repeat: Infinity,
              duration: 0.75,
              ease: "linear",
              repeatDelay: 0.75,
            }
          }
        }}
      >
        {children}
      </motion.span>

      {/* Border shine effect uses the --shine variable so it adapts to theme */}
      <motion.span
        className="block absolute inset-0 rounded-md p-px pointer-events-none"
        style={{
          background:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        variants={{
          initial: { backgroundPosition: "100% 0", opacity: 0 },
          hover: {
            backgroundPosition: ["100% 0", "0% 0"],
            opacity: [0, 1, 0],
            transition: {
              duration: 0.75,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.75,
            }
          }
        }}
      />
    </Component>
  );
});

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
