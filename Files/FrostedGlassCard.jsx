import React from "react";

/**
 * FrostedGlassCard
 * Replicates ribbed/reeded frosted glass: fine noise grain (feTurbulence)
 * + vertical corrugation highlights/shadows + a blue-to-warm-gold gradient
 * standing in for light passing through the glass.
 *
 * Usage:
 *   <FrostedGlassCard title="Skill name" description="What it does" />
 */

function FrostedGlassDefs() {
  // Shared SVG filter — put this once per page (it's invisible on its own).
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="frostedGrain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.9"
            numOctaves="2"
            seed="7"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.5 0"
            result="whiteNoise"
          />
          <feComposite in="whiteNoise" in2="SourceGraphic" operator="in" result="grain" />
          <feBlend in="SourceGraphic" in2="grain" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
}

const cardStyle = {
  position: "relative",
  width: 280,
  height: 200,
  borderRadius: 16,
  overflow: "hidden",
  isolation: "isolate",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
};

// Base color wash: sky blue at top fading to warm gold/olive at bottom,
// like light through frosted glass with something warm behind it low-down.
const colorLayerStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, #bcd6ea 0%, #cfdfe6 28%, #b9c3ad 55%, #cdc48f 78%, #d8c98a 100%)",
};

// Vertical reeded/corrugated glass ribs: alternating light/dark stripes
// with soft edges, like the fluted channels in the reference photo.
const ribsStyle = {
  position: "absolute",
  inset: 0,
  backgroundImage: `repeating-linear-gradient(
    90deg,
    rgba(255,255,255,0.35) 0px,
    rgba(255,255,255,0.12) 6px,
    rgba(0,0,0,0.06) 14px,
    rgba(0,0,0,0.16) 22px,
    rgba(255,255,255,0.12) 30px,
    rgba(255,255,255,0.35) 38px
  )`,
  mixBlendMode: "overlay",
  filter: "blur(1.5px)",
};

// Fine frosted-glass grain, applied via the shared SVG filter.
const grainStyle = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.5)",
  filter: "url(#frostedGrain)",
  opacity: 0.5,
  mixBlendMode: "soft-light",
};

// Soft directional light glow (upper-left brighter, like light source in photo).
const glowStyle = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
  mixBlendMode: "screen",
};

const contentStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: 20,
  textShadow: "0 1px 4px rgba(0,0,0,0.35)",
};

export function FrostedGlassCard({ title = "Skill name", description = "Short description" }) {
  return (
    <div style={cardStyle}>
      <div style={colorLayerStyle} />
      <div style={ribsStyle} />
      <div style={grainStyle} />
      <div style={glowStyle} />
      <div style={contentStyle}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.9 }}>{description}</p>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div style={{ padding: 32, background: "#111", display: "flex", gap: 24, flexWrap: "wrap" }}>
      <FrostedGlassDefs />
      <FrostedGlassCard title="Data analysis" description="Explore and visualize datasets" />
      <FrostedGlassCard title="Writing" description="Draft and edit documents" />
      <FrostedGlassCard title="Coding" description="Build and debug software" />
    </div>
  );
}
