"use client";

import { useMemo } from "react";

export type HaroldOrbState = "stressed" | "neutral" | "recovered" | "thriving";

interface HaroldOrbProps {
  state?: HaroldOrbState;
  size?: number;
  className?: string;
}

interface StateConfig {
  cycleDuration: number;
  colors: { core: string; mid: string; outer: string; glow: string };
  breatheScale: [number, number];
  movement: { dx: number; dy: number; duration: number };
  glowRadius: number;
  glowOpacity: number;
}

const stateConfigs: Record<HaroldOrbState, StateConfig> = {
  stressed: {
    cycleDuration: 1.25,
    colors: {
      core: "#FF6B4A",
      mid: "#FF8860",
      outer: "#FFAA80",
      glow: "rgba(255, 107, 74, 0.45)",
    },
    breatheScale: [0.92, 1.06],
    movement: { dx: 2.5, dy: 1.8, duration: 0.6 },
    glowRadius: 12,
    glowOpacity: 0.5,
  },
  neutral: {
    cycleDuration: 2.5,
    colors: {
      core: "#FF8897",
      mid: "#FFA4B0",
      outer: "#FFC4CC",
      glow: "rgba(255, 136, 151, 0.35)",
    },
    breatheScale: [0.96, 1.04],
    movement: { dx: 1.2, dy: 1.0, duration: 1.2 },
    glowRadius: 10,
    glowOpacity: 0.35,
  },
  recovered: {
    cycleDuration: 3.1,
    colors: {
      core: "#8B7BF7",
      mid: "#A89BFF",
      outer: "#C4BBFF",
      glow: "rgba(139, 123, 247, 0.3)",
    },
    breatheScale: [0.97, 1.05],
    movement: { dx: 1.8, dy: 1.5, duration: 1.6 },
    glowRadius: 14,
    glowOpacity: 0.3,
  },
  thriving: {
    cycleDuration: 2.8,
    colors: {
      core: "#FF8897",
      mid: "#C490FF",
      outer: "#90D4FF",
      glow: "rgba(255, 136, 151, 0.4)",
    },
    breatheScale: [0.95, 1.06],
    movement: { dx: 1.4, dy: 1.2, duration: 1.4 },
    glowRadius: 18,
    glowOpacity: 0.45,
  },
};

export default function HaroldOrb({
  state = "neutral",
  size = 80,
  className,
}: HaroldOrbProps) {
  const config = stateConfigs[state];
  const id = useMemo(
    () => `harold-orb-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const half = size / 2;
  const orbRadius = half * 0.7;

  const breatheKeyframes = `
    @keyframes ${id}-breathe {
      0%, 100% { transform: scale(${config.breatheScale[0]}); }
      50% { transform: scale(${config.breatheScale[1]}); }
    }
  `;

  const driftKeyframes = `
    @keyframes ${id}-drift {
      0%, 100% { transform: translate(0px, 0px); }
      25% { transform: translate(${config.movement.dx}px, -${config.movement.dy}px); }
      50% { transform: translate(-${config.movement.dx * 0.6}px, ${config.movement.dy * 0.5}px); }
      75% { transform: translate(${config.movement.dx * 0.3}px, ${config.movement.dy}px); }
    }
  `;

  const pulseKeyframes = `
    @keyframes ${id}-pulse {
      0%, 100% { opacity: ${config.glowOpacity}; }
      50% { opacity: ${config.glowOpacity * 1.5}; }
    }
  `;

  const shimmerKeyframes = `
    @keyframes ${id}-shimmer {
      0% { stop-opacity: 0.3; }
      50% { stop-opacity: 0.7; }
      100% { stop-opacity: 0.3; }
    }
  `;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{breatheKeyframes}{driftKeyframes}{pulseKeyframes}{shimmerKeyframes}</style>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          overflow: "visible",
          animation: `${id}-drift ${config.cycleDuration * 1.6}s ease-in-out infinite`,
        }}
      >
        <defs>
          {/* Main orb gradient */}
          <radialGradient id={`${id}-grad`} cx="40%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="25%" stopColor={config.colors.core} stopOpacity="1" />
            <stop offset="60%" stopColor={config.colors.mid} stopOpacity="0.85" />
            <stop offset="100%" stopColor={config.colors.outer} stopOpacity="0.6" />
          </radialGradient>

          {/* Glow gradient */}
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={config.colors.core} stopOpacity="0.3" />
            <stop
              offset="70%"
              stopColor={config.colors.outer}
              stopOpacity="0.1"
              style={{
                animation: `${id}-shimmer ${config.cycleDuration}s ease-in-out infinite`,
              }}
            />
            <stop offset="100%" stopColor={config.colors.outer} stopOpacity="0" />
          </radialGradient>

          {/* Highlight gradient for specular reflection */}
          <radialGradient id={`${id}-highlight`} cx="35%" cy="30%" r="30%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <filter id={`${id}-blur`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={config.glowRadius * 0.4} />
          </filter>
        </defs>

        {/* Outer glow */}
        <circle
          cx={half}
          cy={half}
          r={orbRadius * 1.4}
          fill={`url(#${id}-glow)`}
          style={{
            animation: `${id}-pulse ${config.cycleDuration}s ease-in-out infinite`,
            transformOrigin: `${half}px ${half}px`,
          }}
        />

        {/* Soft shadow/glow behind orb */}
        <circle
          cx={half}
          cy={half}
          r={orbRadius * 1.05}
          fill={config.colors.glow}
          filter={`url(#${id}-blur)`}
          style={{
            animation: `${id}-pulse ${config.cycleDuration * 0.8}s ease-in-out infinite`,
            transformOrigin: `${half}px ${half}px`,
          }}
        />

        {/* Main orb body with breathing animation */}
        <g
          style={{
            transformOrigin: `${half}px ${half}px`,
            animation: `${id}-breathe ${config.cycleDuration}s ease-in-out infinite`,
          }}
        >
          {/* Base orb */}
          <circle
            cx={half}
            cy={half}
            r={orbRadius}
            fill={`url(#${id}-grad)`}
          />

          {/* Specular highlight */}
          <circle
            cx={half}
            cy={half}
            r={orbRadius}
            fill={`url(#${id}-highlight)`}
          />

          {/* Subtle inner ring for depth */}
          <circle
            cx={half}
            cy={half}
            r={orbRadius * 0.85}
            fill="none"
            stroke={config.colors.core}
            strokeWidth="0.5"
            strokeOpacity="0.15"
          />
        </g>
      </svg>
    </div>
  );
}
