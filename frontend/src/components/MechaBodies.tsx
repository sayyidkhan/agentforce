import { motion } from 'framer-motion';

interface BotProps {
  color?: string;
  avatarUrl?: string;
}

// Reusable defs for gradients and filters to ensure 3D look
const RobotDefs = () => (
  <defs>
    {/* Main Body 3D Gradient (White/Glossy) */}
    <radialGradient id="body3D" cx="30%" cy="30%" r="80%" fx="20%" fy="20%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor="#f1f5f9" />
      <stop offset="100%" stopColor="#94a3b8" />
    </radialGradient>

    {/* Visor Deep Space Gradient */}
    <linearGradient id="visorDeep" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#0f172a" />
      <stop offset="50%" stopColor="#1e293b" />
      <stop offset="100%" stopColor="#334155" />
    </linearGradient>

    {/* Glass Reflection Gradient */}
    <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="white" stopOpacity="0.4" />
      <stop offset="50%" stopColor="white" stopOpacity="0.1" />
      <stop offset="100%" stopColor="white" stopOpacity="0" />
    </linearGradient>

    {/* Soft Drop Shadow */}
    <filter id="dropShadow3D" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
      <feOffset dx="0" dy="4" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Inner Glow for Visor */}
    <filter id="visorGlow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Scanlines Pattern */}
    <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
      <path d="M0 2 L4 2" stroke="white" strokeWidth="1" opacity="0.3" />
    </pattern>
  </defs>
);

export const CuteBotLeft = ({ color = "#8B5CF6", avatarUrl }: BotProps) => (
  <svg viewBox="0 0 400 420" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <RobotDefs />
    <g transform="translate(50, 75)">
      {/* Floating Arms (Behind) */}
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="40" cy="180" rx="25" ry="40" fill="url(#body3D)" filter="url(#dropShadow3D)" />
        <ellipse cx="260" cy="180" rx="25" ry="40" fill="url(#body3D)" filter="url(#dropShadow3D)" />
      </motion.g>

      {/* Main Body Container */}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        
        {/* Torso - Egg Shape */}
        <path 
          d="M80 160 C80 100 220 100 220 160 C220 220 200 280 150 280 C100 280 80 220 80 160 Z"
          fill="url(#body3D)"
          filter="url(#dropShadow3D)"
        />
        
        {/* Torso Highlight (Rim Light) */}
        <path 
          d="M90 160 C90 110 210 110 210 160"
          stroke="white" strokeWidth="2" opacity="0.6" fill="none"
        />

        {/* Belly Seam */}
        <path d="M100 200 Q 150 220 200 200" stroke="#cbd5e1" strokeWidth="2" fill="none" />

        {/* Head - Large Rounded Rectangle */}
        <g transform="translate(50, -60)">
          {/* Head Shell */}
          <rect x="0" y="0" width="200" height="150" rx="60" fill="url(#body3D)" filter="url(#dropShadow3D)" />
          
          {/* Visor Area (Black Screen) */}
          <rect x="15" y="15" width="170" height="120" rx="45" fill="url(#visorDeep)" stroke="#334155" strokeWidth="1" />
          
          {/* Avatar Integration */}
          {avatarUrl && (
            <g clipPath="url(#visorClipLeft)">
              <defs>
                <clipPath id="visorClipLeft">
                  <rect x="15" y="15" width="170" height="120" rx="45" />
                </clipPath>
              </defs>
              <image 
                href={avatarUrl} 
                x="15" y="15" width="170" height="120" 
                preserveAspectRatio="xMidYMid slice"
                opacity="0.9"
              />
              {/* Scanlines Effect */}
              <rect x="15" y="15" width="170" height="120" rx="45" fill="url(#scanlines)" opacity="0.1" />
            </g>
          )}

          {/* Glass Reflection (Top Shine) */}
          <path d="M30 35 Q 100 60 170 35" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
          <path d="M160 40 Q 175 60 170 90" stroke="white" strokeWidth="2" opacity="0.2" fill="none" strokeLinecap="round" />

          {/* LED Cheeks */}
          <circle cx="35" cy="80" r="4" fill={color} filter="url(#visorGlow)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="165" cy="80" r="4" fill={color} filter="url(#visorGlow)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </motion.g>
    </g>
  </svg>
);

export const CuteBotRight = ({ color = "#EC4899", avatarUrl }: BotProps) => (
  <svg viewBox="0 0 400 420" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <RobotDefs />
    <g transform="translate(50, 75)">
      {/* Floating Arms */}
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}>
        <ellipse cx="40" cy="180" rx="28" ry="42" fill="url(#body3D)" filter="url(#dropShadow3D)" />
        <ellipse cx="260" cy="180" rx="28" ry="42" fill="url(#body3D)" filter="url(#dropShadow3D)" />
      </motion.g>

      {/* Main Body */}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
        
        {/* Torso - Slightly different shape */}
        <path 
          d="M80 150 C70 100 230 100 220 150 C220 210 210 270 150 270 C90 270 80 210 80 150 Z"
          fill="url(#body3D)"
          filter="url(#dropShadow3D)"
        />
        
        {/* Chest Panel Detail */}
        <path d="M110 180 L190 180" stroke={color} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        
        {/* Head */}
        <g transform="translate(50, -60)">
          <rect x="0" y="0" width="200" height="150" rx="55" fill="url(#body3D)" filter="url(#dropShadow3D)" />
          
          <rect x="15" y="15" width="170" height="120" rx="40" fill="url(#visorDeep)" stroke="#334155" strokeWidth="1" />
          
          {avatarUrl && (
            <g clipPath="url(#visorClipRight)">
              <defs>
                <clipPath id="visorClipRight">
                  <rect x="15" y="15" width="170" height="120" rx="40" />
                </clipPath>
              </defs>
              <image 
                href={avatarUrl} 
                x="15" y="15" width="170" height="120" 
                preserveAspectRatio="xMidYMid slice"
                opacity="0.9"
              />
            </g>
          )}

          {/* Reflection */}
          <path d="M150 35 Q 100 60 30 35" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
          
          {/* Side Antennae */}
          <rect x="-10" y="50" width="12" height="40" rx="6" fill={color} filter="url(#visorGlow)" />
          <rect x="198" y="50" width="12" height="40" rx="6" fill={color} filter="url(#visorGlow)" />
        </g>
      </motion.g>
    </g>
  </svg>
);
