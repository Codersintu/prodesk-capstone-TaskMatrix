export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

      {/* Top purple glow */}
      <div
        className="absolute inset-x-0 top-0 h-100"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(126,34,206,0.35), transparent 70%)",
        }}
      />

      {/* Bottom center purple glow */}
      <div
        className="absolute left-1/2 top-87.5 h-125 w-250 -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,58,237,0.4), transparent 70%)",
        }}
      />

      {/* Geometric SVG lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <g
          stroke="#8B5CF6"
          strokeWidth="1.2"
          strokeOpacity="0.45"
        >
          {/* Upper geometric shape */}
          <path d="M200 100 V270 L370 370 H1070 L1240 270 V100" />

          {/* Left and right connecting lines */}
          <path d="M0 430 H100 L280 530 H720" />
          <path d="M0 450 H120 L300 550 H720" />

          <path d="M1440 430 H1340 L1160 530 H720" />
          <path d="M1440 450 H1320 L1140 550 H720" />

          {/* Center line */}
          <path d="M720 300 V550" />
        </g>

        {/* Brighter highlights */}
        <g
          stroke="#A78BFA"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        >
          <path d="M100 430 L280 530" />
          <path d="M1340 430 L1160 530" />
          <path d="M720 300 V550" />
        </g>
      </svg>
    </div>
  );
}