import React from 'react';
import { Home, Sparkles, LayoutList, PieChart, UserRound } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan-maker', label: 'AI Coach', icon: Sparkles },
    { id: 'planner', label: 'Planner', icon: LayoutList },
    { id: 'analytics', label: 'Insights', icon: PieChart },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-10 pt-4 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent z-[100] pointer-events-none">
      <nav className="max-w-md mx-auto glass border border-white/10 px-2 py-2 flex justify-around items-center shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-[2.5rem] pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`relative flex flex-col items-center justify-center py-2.5 flex-1 transition-all duration-500 rounded-full ${
                isActive ? 'text-white' : 'text-[#52525B]'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/5 rounded-[2rem] animate-in fade-in zoom-in-95 duration-500" />
              )}
              
              <div className={`relative z-10 transition-all duration-500 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                  className={isActive ? 'text-[#3B82F6]' : ''} 
                />
              </div>

              <span className={`relative z-10 text-[7px] font-black uppercase tracking-[0.4em] mt-1.5 transition-all duration-500 ${
                isActive ? 'opacity-100 translate-y-0 text-[#3B82F6]' : 'opacity-0 translate-y-2'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-[#3B82F6] rounded-full shadow-[0_0_15px_#3B82F6] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};