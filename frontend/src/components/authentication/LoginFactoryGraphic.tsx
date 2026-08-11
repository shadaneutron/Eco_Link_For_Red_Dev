import React from 'react';

export const LoginFactoryGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[340px] bg-gradient-to-b from-[#E6F7ED] via-[#D5F2E1] to-[#C0EBD1] rounded-2xl flex items-end justify-center overflow-hidden p-4 select-none">
      {/* Background Soft Lighting Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.7)_0%,transparent_70%)]" />

      {/* SVG 3D Isometric Factory Illustration */}
      <svg
        viewBox="0 0 800 520"
        className="w-full h-auto max-h-[380px] drop-shadow-xl relative z-10"
      >
        <defs>
          {/* Gradients matching the image */}
          <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBEBD7" />
            <stop offset="100%" stopColor="#AFDFC0" />
          </linearGradient>
          <linearGradient id="navyGroundDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0A1C38" />
            <stop offset="100%" stopColor="#040D1C" />
          </linearGradient>

          {/* Building Walls */}
          <linearGradient id="navyBuilding" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D2C54" />
            <stop offset="100%" stopColor="#061933" />
          </linearGradient>
          <linearGradient id="tealBuildingFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006A6A" />
            <stop offset="100%" stopColor="#004D4D" />
          </linearGradient>
          <linearGradient id="greenRoof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#76C893" />
            <stop offset="100%" stopColor="#52B788" />
          </linearGradient>

          {/* Solar Panel */}
          <linearGradient id="solarPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A7BB0" />
            <stop offset="100%" stopColor="#254A78" />
          </linearGradient>
        </defs>

        {/* --- DEEP NAVY BASE BLOCK (Bottom half of illustration) --- */}
        <path d="M 0,360 L 800,360 L 800,520 L 0,520 Z" fill="url(#navyGroundDark)" />
        {/* Horizontal dividing strip */}
        <path d="M 0,300 L 800,300 L 800,360 L 0,360 Z" fill="#006A6A" />
        {/* Pale Mint Top Backdrop */}
        <path d="M 0,0 L 800,0 L 800,300 L 0,300 Z" fill="#E6F7ED" />

        {/* --- 3D FLOATING PLATFORM FOR THE FACTORY --- */}
        <g transform="translate(0, -20)">
          {/* Base Platform Shadow */}
          <polygon points="120,380 400,480 680,380 400,280" fill="rgba(6,25,51,0.25)" />

          {/* Platform Thickness (Sides) */}
          <polygon points="120,380 400,480 400,495 120,395" fill="#88CCA3" />
          <polygon points="400,480 680,380 680,395 400,495" fill="#6FB98C" />

          {/* Platform Top (Rounded Light Mint Lawn) */}
          <polygon points="120,380 400,480 680,380 400,280" fill="url(#groundGrad)" stroke="#A2DDB8" strokeWidth="2" />

          {/* Road Pathways on Platform */}
          <polygon points="260,390 400,440 540,390 400,340" fill="#E6F7ED" opacity="0.9" />

          {/* --- WIND TURBINES (LEFT SIDE) --- */}
          {/* Turbine 1 (Back Left) */}
          <g transform="translate(190, 160)">
            <ellipse cx="0" cy="180" rx="10" ry="4" fill="rgba(0,0,0,0.12)" />
            <polygon points="-3,180 3,180 1,0 -1,0" fill="#88CCA3" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            {/* Blades */}
            <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '7s' }}>
              <path d="M 0,0 L -2,-50 C -1,-55 1,-55 2,-50 Z" fill="#88CCA3" />
              <path d="M 0,0 L -2,-50 C -1,-55 1,-55 2,-50 Z" fill="#88CCA3" transform="rotate(120)" />
              <path d="M 0,0 L -2,-50 C -1,-55 1,-55 2,-50 Z" fill="#88CCA3" transform="rotate(240)" />
            </g>
          </g>

          {/* Turbine 2 (Front Left - Larger) */}
          <g transform="translate(280, 120)">
            <ellipse cx="0" cy="240" rx="14" ry="5" fill="rgba(0,0,0,0.15)" />
            <polygon points="-4,240 4,240 1.5,0 -1.5,0" fill="#BBE2CD" />
            <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
            <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '5s' }}>
              <path d="M 0,0 L -2.5,-65 C -1,-70 1,-70 2.5,-65 Z" fill="#BBE2CD" />
              <path d="M 0,0 L -2.5,-65 C -1,-70 1,-70 2.5,-65 Z" fill="#BBE2CD" transform="rotate(120)" />
              <path d="M 0,0 L -2.5,-65 C -1,-70 1,-70 2.5,-65 Z" fill="#BBE2CD" transform="rotate(240)" />
            </g>
          </g>

          {/* --- TALL SMOKESTACKS (BACK MIDDLE) --- */}
          {/* Stack 1 */}
          <g transform="translate(430, 120)">
            <ellipse cx="0" cy="140" rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
            <path d="M -9,140 L 9,140 L 7,0 L -7,0 Z" fill="#006A6A" />
            {/* White stripes on smokestack */}
            <polygon points="-8,30 8,30 7.5,15 -7.5,15" fill="#BBE2CD" />
            <polygon points="-7.3,70 7.3,70 6.8,55 -6.8,55" fill="#BBE2CD" />
          </g>
          {/* Stack 2 */}
          <g transform="translate(465, 120)">
            <ellipse cx="0" cy="140" rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
            <path d="M -9,140 L 9,140 L 7,0 L -7,0 Z" fill="#006A6A" />
            <polygon points="-8,30 8,30 7.5,15 -7.5,15" fill="#BBE2CD" />
            <polygon points="-7.3,70 7.3,70 6.8,55 -6.8,55" fill="#BBE2CD" />
          </g>

          {/* --- FACTORY MAIN BUILDINGS --- */}
          {/* Main Left Navy Block */}
          <polygon points="260,330 380,390 380,290 260,230" fill="url(#navyBuilding)" />
          <polygon points="380,390 500,330 500,230 380,290" fill="#082245" />

          {/* Pitched Green Roof for Main Block */}
          <polygon points="260,230 320,195 380,230 320,265" fill="url(#greenRoof)" />
          <polygon points="320,195 440,135 500,170 380,230" fill="#40916C" />
          {/* Roof Vents */}
          <polygon points="340,190 360,180 380,190 360,200" fill="#2D6A4F" />
          <polygon points="380,170 400,160 420,170 400,180" fill="#2D6A4F" />

          {/* Right Extension Building (Teal & Solar Panels) */}
          <polygon points="460,350 540,310 540,230 460,270" fill="url(#tealBuildingFront)" />
          <polygon points="540,310 630,265 630,185 540,230" fill="#004D4D" />

          {/* Flat Roof for Right Building */}
          <polygon points="460,270 540,230 630,185 550,225" fill="#52B788" />

          {/* 4 SOLAR PANELS ON RIGHT EXTENSION ROOF */}
          {/* Panel 1 */}
          <polygon points="480,250 515,232 540,245 505,263" fill="url(#solarPanelGrad)" stroke="#6495ED" strokeWidth="1" />
          {/* Panel 2 */}
          <polygon points="520,230 555,212 580,225 545,243" fill="url(#solarPanelGrad)" stroke="#6495ED" strokeWidth="1" />
          {/* Panel 3 */}
          <polygon points="495,235 530,217 555,230 520,248" fill="url(#solarPanelGrad)" stroke="#6495ED" strokeWidth="1" />
          {/* Panel 4 */}
          <polygon points="535,215 570,197 595,210 560,228" fill="url(#solarPanelGrad)" stroke="#6495ED" strokeWidth="1" />

          {/* Garage Doors & Windows */}
          {/* Garage Door 1 */}
          <polygon points="280,320 340,350 340,310 280,280" fill="#BBE2CD" />
          <line x1="280" y1="295" x2="340" y2="325" stroke="#76C893" strokeWidth="2" />
          <line x1="280" y1="307" x2="340" y2="337" stroke="#76C893" strokeWidth="2" />

          {/* Garage Door 2 */}
          <polygon points="480,325 520,305 520,275 480,295" fill="#BBE2CD" />
          <line x1="480" y1="305" x2="520" y2="285" stroke="#76C893" strokeWidth="2" />

          {/* Windows on Teal Front Wall */}
          <polygon points="555,280 575,270 575,255 555,265" fill="#8CF3F3" />
          <polygon points="585,265 605,255 605,240 585,250" fill="#8CF3F3" />
          <polygon points="610,252 625,244 625,230 610,238" fill="#8CF3F3" />

          {/* Drainage Pipe */}
          <path d="M 450,335 L 450,375 L 470,385" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

          {/* --- TREES SURROUNDING FACTORY --- */}
          {/* Left Tree 1 */}
          <g transform="translate(220, 360)">
            <ellipse cx="0" cy="0" rx="16" ry="24" fill="#2D6A4F" />
            <ellipse cx="-4" cy="-5" rx="11" ry="16" fill="#52B788" />
            <rect x="-3" y="16" width="6" height="12" fill="#1B4332" />
          </g>
          {/* Left Tree 2 */}
          <g transform="translate(250, 395)">
            <ellipse cx="0" cy="0" rx="14" ry="20" fill="#40916C" />
            <rect x="-2" y="14" width="4" height="10" fill="#1B4332" />
          </g>
          {/* Right Trees */}
          <g transform="translate(620, 330)">
            <ellipse cx="0" cy="0" rx="18" ry="26" fill="#2D6A4F" />
            <ellipse cx="-4" cy="-6" rx="12" ry="18" fill="#76C893" />
            <rect x="-3" y="18" width="6" height="14" fill="#1B4332" />
          </g>
          <g transform="translate(650, 365)">
            <ellipse cx="0" cy="0" rx="15" ry="22" fill="#40916C" />
            <rect x="-2" y="14" width="4" height="10" fill="#1B4332" />
          </g>
          <g transform="translate(590, 400)">
            <ellipse cx="0" cy="0" rx="12" ry="16" fill="#76C893" />
            <rect x="-2" y="10" width="4" height="8" fill="#1B4332" />
          </g>
          <g transform="translate(615, 415)">
            <ellipse cx="0" cy="0" rx="10" ry="14" fill="#52B788" />
          </g>
        </g>
      </svg>
    </div>
  );
};
