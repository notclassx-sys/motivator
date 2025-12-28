
import React from 'react';
import { Home, Sparkles, LayoutList, PieChart, UserRound } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'plan-maker', label: 'AI COACH', icon: Sparkles },
    { id: 'planner', label: 'PLANNER', icon: LayoutList },
    { id: 'analytics', label: 'INSIGHTS', icon: PieChart },
    { id: 'profile', label: 'PROFILE', icon: UserRound },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-2 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-[150] pointer-events-none">
      <nav className="max-w-md mx-auto glass border border-white/10 px-2 py-2 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`relative flex flex-col items-center justify-center py-2 flex-1 transition-all duration-300 ${
                isActive ? 'text-[#3B82F6]' : 'text-[#52525B]'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-500 ${isActive ? 'bg-[#3B82F6]/15 scale-110' : 'hover:bg-white/5'}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={`text-[7px] font-black uppercase tracking-[0.25em] mt-1.5 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-0.5'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-[#3B82F6] rounded-full shadow-[0_0_10px_#3B82F6]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
