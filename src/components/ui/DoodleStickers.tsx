import React from 'react';

// Skater Silhouette with Neon Trail
export function SkaterSilhouette({
  className = 'w-16 h-16',
  color = '#f97316',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Dynamic neon speed streaks */}
      <path
        d="M15 78 Q 30 76, 55 82"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.8"
      />
      <path
        d="M5 86 Q 25 84, 45 88"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Skateboard */}
      <g transform="rotate(-18 50 80)">
        <rect
          x="25"
          y="76"
          width="54"
          height="6"
          rx="3"
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
        <circle cx="35" cy="86" r="4.5" fill={color} />
        <circle cx="69" cy="86" r="4.5" fill={color} />
      </g>
      {/* Skater Silhouette Body */}
      <path
        d="M52 22 C 55 22 57 20 57 17 C 57 14 55 12 52 12 C 49 12 47 14 47 17 C 47 20 49 22 52 22 Z
           M42 32 L49 24 L56 26 L64 34 L72 31 L69 36 L61 38 L55 33 L52 42 L62 50 L68 62 L60 64 L54 53 L44 50 L38 60 L30 68 L24 62 L34 52 L38 39 L30 42 L24 38 L34 32 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Cyber DJ Cat with Headphones Silhouette
export function CyberCatSilhouette({
  className = 'w-16 h-16',
  color = '#ec4899',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cat head & ears */}
      <path
        d="M28 32 L34 50 C 34 68 66 68 66 50 L72 32 L60 40 C 54 38 46 38 40 40 Z"
        fill="currentColor"
      />
      {/* Headphones band & cups */}
      <path d="M22 45 C 22 24 78 24 78 45" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <rect x="18" y="42" width="10" height="18" rx="5" fill={color} />
      <rect x="72" y="42" width="10" height="18" rx="5" fill={color} />
      {/* Cool sunglasses */}
      <path
        d="M36 50 L48 52 L60 50 L62 58 L50 60 L38 58 Z"
        fill="#090a0f"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Whisker lines */}
      <path
        d="M25 58 L12 56 M25 62 L14 64 M75 58 L88 56 M75 62 L86 64"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Spray Paint Can Graffiti Doodle
export function SprayCanDoodle({
  className = 'w-16 h-16',
  color = '#a3e635',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Spray dots */}
      <circle cx="82" cy="18" r="3.5" fill={color} />
      <circle cx="72" cy="12" r="2" fill={color} />
      <circle cx="90" cy="28" r="2.5" fill={color} />
      <circle cx="76" cy="26" r="4.5" fill={color} opacity="0.8" />
      {/* Can Body */}
      <g transform="rotate(-25 45 55)">
        <rect x="36" y="24" width="8" height="8" rx="2" fill="#ffffff" />
        <rect x="30" y="32" width="20" height="6" rx="2" fill="#64748b" />
        <rect
          x="26"
          y="38"
          width="28"
          height="46"
          rx="6"
          fill="currentColor"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* Label badge on can */}
        <rect x="29" y="48" width="22" height="22" rx="3" fill={color} />
        <path d="M33 59 L47 59" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Graffiti Starburst Badge
export function StarburstBadge({
  text = '100% FUN',
  bg = '#f97316',
  textColor = '#000000',
  className = '',
  rotate = 'rotate-[-6deg]',
}: {
  text?: string;
  bg?: string;
  textColor?: string;
  className?: string;
  rotate?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center px-3.5 py-1 rounded-md font-mono text-[11px] font-black tracking-wider uppercase shadow-xl select-none border-2 border-white/90 transform hover:scale-110 hover:rotate-0 transition-all duration-200 cursor-default ${rotate} ${className}`}
      style={{
        backgroundColor: bg,
        color: textColor,
        boxShadow: '4px 4px 0px rgba(0,0,0,0.8), 0 0 15px rgba(249,115,22,0.3)',
      }}
    >
      ★ {text} ★
    </div>
  );
}

// Neon Paper Tape Sticker
export function TapeSticker({
  text = 'INTERACTIVE TOYBOX',
  className = '',
  color = '#06b6d4',
}: {
  text?: string;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 font-mono text-[10px] font-extrabold tracking-widest uppercase border border-dashed border-white/40 bg-black/80 backdrop-blur-md text-white shadow-lg ${className}`}
      style={{
        boxShadow: `inset 0 0 8px ${color}33, 3px 3px 0px rgba(0,0,0,0.6)`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
      <span style={{ color }}>// {text}</span>
    </div>
  );
}

// 8-Bit Pixel Game Monster
export function PixelMonsterDoodle({
  className = 'w-14 h-14',
  color = '#8b5cf6',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <path d="M4 1h8v1H4zm-2 2h12v1H2zm-1 2h14v2H1zm0 3h2v2H1zm13 0h2v2h-2zm-3-2h2v1h-2zm-6 0h2v1H5zm-3 5h3v2H2zm9 0h3v2h-3zm-5 1h4v1H6zm-3 2h2v2H3zm7 0h2v2h-2z" />
    </svg>
  );
}

// Lightning Bolt Sticker
export function LightningSticker({
  className = 'w-10 h-10',
  color = '#facc15',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
