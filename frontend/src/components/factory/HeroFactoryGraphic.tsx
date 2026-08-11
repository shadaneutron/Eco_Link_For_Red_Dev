import React from 'react';

export const HeroFactoryGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] bg-gradient-to-b from-[#D2EBF0] via-[#E4F3F5] to-[#EEF7F8] flex items-center justify-center overflow-hidden select-none">
      {/* Subtle Sky Clouds & Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.8)_0%,transparent_60%)]" />
      
      {/* Background Distant Hills */}
      <svg
        className="absolute bottom-16 left-0 right-0 w-full h-32 opacity-40 text-[#96C7C1]"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 120 Q 200 60, 450 110 T 900 70 T 1200 130 L 1200 200 L 0 200 Z" />
      </svg>
      <svg
        className="absolute bottom-14 left-0 right-0 w-full h-28 opacity-30 text-[#7BBBB3]"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 140 Q 300 80, 600 130 T 1200 90 L 1200 200 L 0 200 Z" />
      </svg>

      {/* Main 3D Isometric Scene SVG Container */}
      <svg
        viewBox="0 0 960 620"
        className="w-full h-auto max-h-[460px] drop-shadow-xl relative z-10 transform transition-transform duration-500 hover:scale-[1.01]"
      >
        <defs>
          {/* Base Platform Gradients */}
          <linearGradient id="platformTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6F5F4" />
            <stop offset="100%" stopColor="#D5EDE9" />
          </linearGradient>
          <linearGradient id="platformEdgeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BCDCD8" />
            <stop offset="100%" stopColor="#A2CCC7" />
          </linearGradient>
          <linearGradient id="platformEdgeRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CBDDD9" />
            <stop offset="100%" stopColor="#B2CBC6" />
          </linearGradient>

          {/* Main Factory Walls Gradient */}
          <linearGradient id="factoryWallDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2545" />
            <stop offset="100%" stopColor="#00152F" />
          </linearGradient>
          <linearGradient id="factoryWallTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#134042" />
            <stop offset="100%" stopColor="#00292B" />
          </linearGradient>

          {/* Solar Panel Gradient */}
          <linearGradient id="solarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="50%" stopColor="#2A4D7C" />
            <stop offset="100%" stopColor="#182E4B" />
          </linearGradient>

          {/* Floating Garden Platform */}
          <linearGradient id="gardenGrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7BC676" />
            <stop offset="100%" stopColor="#4FA849" />
          </linearGradient>
          <linearGradient id="gardenDirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6DAA66" />
            <stop offset="100%" stopColor="#3C7B37" />
          </linearGradient>

          {/* Road / Track Gradient */}
          <linearGradient id="tealRoad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8CF3F3" />
            <stop offset="100%" stopColor="#5ED0D0" />
          </linearGradient>
        </defs>

        {/* --- 1. MAIN ISOMETRIC BASE PLATFORM --- */}
        {/* Shadow under platform */}
        <polygon points="120,440 480,570 840,440 480,310" fill="rgba(0,32,74,0.12)" transform="translate(0, 15)" />

        {/* Platform Thickness Sides */}
        <polygon points="120,440 480,570 480,590 120,460" fill="url(#platformEdgeLeft)" />
        <polygon points="480,570 840,440 840,460 480,590" fill="url(#platformEdgeRight)" />

        {/* Platform Top Surface */}
        <polygon points="120,440 480,570 840,440 480,310" fill="url(#platformTop)" stroke="#B3DBD7" strokeWidth="2" />

        {/* Platform Inner Teal Road Track */}
        <polygon points="170,430 480,545 790,430 480,335" fill="none" stroke="url(#tealRoad)" strokeWidth="18" strokeLinejoin="round" />
        <polygon points="170,430 480,545 790,430 480,335" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" strokeLinejoin="round" />

        {/* --- 2. TRAIN & RAIL TRACK (Left Side) --- */}
        <path d="M 120,410 Q 240,360 320,330" fill="none" stroke="#A9B5C1" strokeWidth="4" strokeDasharray="3 3" />
        {/* Small Train */}
        <g transform="translate(200, 365) rotate(-22)">
          <rect x="0" y="0" width="36" height="14" rx="4" fill="#006A6A" />
          <rect x="36" y="2" width="20" height="10" rx="3" fill="#FFFFFF" />
          <circle cx="8" cy="14" r="2.5" fill="#000A1F" />
          <circle cx="28" cy="14" r="2.5" fill="#000A1F" />
          <circle cx="48" cy="14" r="2.5" fill="#000A1F" />
        </g>

        {/* --- 3. WIND TURBINES (Top Left Platform) --- */}
        {/* Turbine 1 (Back Left) */}
        <g transform="translate(300, 160)">
          {/* Shadow */}
          <ellipse cx="0" cy="140" rx="12" ry="5" fill="rgba(0,0,0,0.15)" />
          {/* Tower */}
          <polygon points="-3,140 3,140 1,0 -1,0" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          {/* Nacelle hub */}
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
          {/* Rotating Blades */}
          <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '8s' }}>
            <path d="M 0,0 L -2,-45 C -1,-50 1,-50 2,-45 Z" fill="#FFFFFF" stroke="#E2E8F0" />
            <path d="M 0,0 L -2,-45 C -1,-50 1,-50 2,-45 Z" fill="#FFFFFF" stroke="#E2E8F0" transform="rotate(120)" />
            <path d="M 0,0 L -2,-45 C -1,-50 1,-50 2,-45 Z" fill="#FFFFFF" stroke="#E2E8F0" transform="rotate(240)" />
          </g>
        </g>

        {/* Turbine 2 (Back Right) */}
        <g transform="translate(410, 130)">
          <ellipse cx="0" cy="160" rx="14" ry="6" fill="rgba(0,0,0,0.15)" />
          <polygon points="-4,160 4,160 1.5,0 -1.5,0" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="0" cy="0" r="5" fill="#006A6A" />
          <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '6s' }}>
            <path d="M 0,0 L -2.5,-55 C -1,-60 1,-60 2.5,-55 Z" fill="#FFFFFF" stroke="#E2E8F0" />
            <path d="M 0,0 L -2.5,-55 C -1,-60 1,-60 2.5,-55 Z" fill="#FFFFFF" stroke="#E2E8F0" transform="rotate(120)" />
            <path d="M 0,0 L -2.5,-55 C -1,-60 1,-60 2.5,-55 Z" fill="#FFFFFF" stroke="#E2E8F0" transform="rotate(240)" />
          </g>
        </g>

        {/* --- 4. MAIN FACTORY COMPLEX BUILDING --- */}
        {/* Factory Shadow */}
        <polygon points="340,360 560,460 680,390 460,290" fill="rgba(0,32,74,0.25)" />

        {/* Left Side Wall (Teal/Dark) */}
        <polygon points="360,340 480,410 480,310 360,240" fill="url(#factoryWallTeal)" />
        {/* Right Front Wall (Dark Navy) */}
        <polygon points="480,410 630,335 630,235 480,310" fill="url(#factoryWallDark)" />

        {/* Sawtooth Roof Structures with Solar Panels */}
        {/* Roof Bay 1 */}
        <polygon points="360,240 400,215 440,240 400,265" fill="#1E293B" />
        <polygon points="400,215 550,140 590,165 440,240" fill="url(#solarGlass)" stroke="#38BDF8" strokeWidth="0.5" />
        {/* Solar grid lines */}
        <line x1="430" y1="200" x2="570" y2="155" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
        <line x1="460" y1="185" x2="540" y2="225" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />

        {/* Roof Bay 2 */}
        <polygon points="440,240 480,215 520,240 480,265" fill="#1E293B" />
        <polygon points="480,215 630,140 670,165 520,240" fill="url(#solarGlass)" stroke="#38BDF8" strokeWidth="0.5" />
        <line x1="510" y1="200" x2="650" y2="155" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />

        {/* ECO-LINK Logo Badge on Factory Front Wall */}
        <g transform="translate(495, 325) rotate(-26)">
          <rect x="0" y="0" width="70" height="22" rx="4" fill="#006A6A" />
          <text x="35" y="15" fill="#8CF3F3" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold" textAnchor="middle">
            ECO-LINK
          </text>
        </g>
        <g transform="translate(575, 285) rotate(-26)">
          <rect x="0" y="0" width="42" height="16" rx="3" fill="#8CF3F3" />
          <text x="21" y="11" fill="#006A6A" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="bold" textAnchor="middle">
            CLEAN-TECH
          </text>
        </g>

        {/* Windows & Doors on Front Wall */}
        <polygon points="510,380 540,365 540,345 510,360" fill="#8CF3F3" opacity="0.85" />
        <polygon points="555,358 585,343 585,323 555,338" fill="#8CF3F3" opacity="0.85" />

        {/* --- 5. PROCESSING & WATER TANKS (Left & Front) --- */}
        {/* Water Clarifier Cylindrical Tank */}
        <g transform="translate(560, 420)">
          <ellipse cx="0" cy="0" rx="24" ry="12" fill="#E2E8F0" />
          <ellipse cx="0" cy="-2" rx="22" ry="10" fill="#38BDF8" />
          <path d="M -24,0 L -24,20 Q 0,30 24,20 L 24,0 Z" fill="#CBD5E1" />
        </g>
        <g transform="translate(620, 390)">
          <ellipse cx="0" cy="0" rx="18" ry="9" fill="#E2E8F0" />
          <ellipse cx="0" cy="-2" rx="16" ry="7" fill="#8CF3F3" />
          <path d="M -18,0 L -18,16 Q 0,24 18,16 L 18,0 Z" fill="#94A3B8" />
        </g>

        {/* Small Annex Glass Building (Left Front) */}
        <polygon points="280,390 360,435 440,395 360,350" fill="#EAF7F7" stroke="#006A6A" strokeWidth="1.5" />
        <polygon points="280,390 360,435 360,465 280,420" fill="#99E6E6" opacity="0.8" />
        <polygon points="360,435 440,395 440,425 360,465" fill="#4DD2D2" opacity="0.8" />

        {/* Conveyor Belt Loop */}
        <path d="M 330,440 L 410,480 L 460,455" fill="none" stroke="#000A1F" strokeWidth="6" strokeLinecap="round" />
        <path d="M 330,440 L 410,480 L 460,455" fill="none" stroke="#8CF3F3" strokeWidth="2" strokeDasharray="4 4" />

        {/* --- 6. FLOATING GARDEN & TREE PLATFORM (Right Side) --- */}
        <g transform="translate(670, 310)">
          {/* Covered Bridge walkway connecting Factory to Garden */}
          <polygon points="-70,30 -10,0 -10,12 -70,42" fill="#006A6A" />
          <polygon points="-70,30 -10,0 -10,-10 -70,20" fill="#8CF3F3" opacity="0.9" />

          {/* Floating Garden Base Shadow */}
          <polygon points="0,50 110,105 220,50 110,-5" fill="rgba(0,32,74,0.18)" transform="translate(0, 30)" />

          {/* Dirt Layer */}
          <polygon points="0,50 110,105 110,135 0,80" fill="#4B7A43" />
          <polygon points="110,105 220,50 220,80 110,135" fill="#365C30" />

          {/* Grass Top */}
          <polygon points="0,50 110,105 220,50 110,-5" fill="url(#gardenGrass)" stroke="#5DAE53" strokeWidth="2" />

          {/* Garden Pathways */}
          <path d="M 40,45 L 110,80 L 170,50" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

          {/* Trees on Garden */}
          {/* Tree 1 */}
          <g transform="translate(50, 30)">
            <ellipse cx="0" cy="0" rx="14" ry="18" fill="#22C55E" />
            <ellipse cx="-4" cy="-4" rx="10" ry="12" fill="#4ADE80" />
            <rect x="-2" y="10" width="4" height="12" fill="#78350F" />
          </g>
          {/* Tree 2 */}
          <g transform="translate(85, 45)">
            <ellipse cx="0" cy="0" rx="18" ry="22" fill="#16A34A" />
            <ellipse cx="-5" cy="-5" rx="13" ry="15" fill="#22C55E" />
            <rect x="-3" y="14" width="6" height="14" fill="#78350F" />
          </g>

          {/* Tree 3 */}
          <g transform="translate(130, 25)">
            <ellipse cx="0" cy="0" rx="16" ry="20" fill="#15803D" />
            <ellipse cx="-4" cy="-4" rx="11" ry="13" fill="#16A34A" />
            <rect x="-2.5" y="12" width="5" height="12" fill="#78350F" />
          </g>

          {/* Tree 4 (Right edge) */}
          <g transform="translate(165, 40)">
            <ellipse cx="0" cy="0" rx="12" ry="16" fill="#22C55E" />
            <rect x="-2" y="10" width="4" height="10" fill="#78350F" />
          </g>
        </g>

        {/* --- 7. ECO TREES AROUND MAIN PLATFORM --- */}
        {/* Left background trees */}
        <g transform="translate(150, 350)">
          <circle cx="0" cy="0" r="12" fill="#16A34A" />
          <circle cx="-3" cy="-3" r="8" fill="#4ADE80" />
          <rect x="-2" y="8" width="4" height="10" fill="#78350F" />
        </g>
        <g transform="translate(180, 335)">
          <circle cx="0" cy="0" r="14" fill="#15803D" />
          <rect x="-2" y="10" width="4" height="10" fill="#78350F" />
        </g>
      </svg>
    </div>
  );
};
