
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 100 }) => {
  return (
    <div className={`${className} relative flex items-center justify-center`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
      >
        {/* Mane - Geometric Shield Shape */}
        <path
          d="M50 5L85 20V45C85 65 70 85 50 95C30 85 15 65 15 45V20L50 5Z"
          fill="url(#logo-gradient)"
          className="opacity-10"
        />
        <path
          d="M50 5L85 20V45C85 65 70 85 50 95C30 85 15 65 15 45V20L50 5Z"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-30"
        />

        {/* Lion Face - Minimalist Lines */}
        {/* Crown Top */}
        <path
          d="M38 15L50 8L62 15"
          stroke="#C5A059"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Main Face Structure */}
        <path
          d="M30 35L40 60H60L70 35"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M40 60L50 75L60 60"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Eyes - AI Nodes */}
        <circle cx="42" cy="45" r="3" fill="#C5A059" className="animate-pulse" />
        <circle cx="58" cy="45" r="3" fill="#C5A059" className="animate-pulse" />
        
        {/* Neural Network Connections */}
        <path
          d="M25 40L35 45M75 40L65 45M50 75V85"
          stroke="#3B82F6"
          strokeWidth="1"
          strokeDasharray="2 2"
          className="opacity-50"
        />

        <defs>
          <linearGradient id="logo-gradient" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
