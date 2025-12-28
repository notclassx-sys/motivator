
import React from 'react';
import { Home, MessageSquare, BarChart2, Calendar, User } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'home', label: 'DASH', icon: Home },
    { id: 'plan-maker', label: 'AI', icon: MessageSquare },
    { id: 'planner', label: 'PLANS', icon: Calendar },
    { id: 'analytics', label: 'STATS', icon: BarChart2 },
    { id: 'profile', label: 'USER', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-5 pt-2 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-[150] pointer-events-none">
      <nav className="max-w-md mx-auto bg-[#1C1C1E]/80 backdrop-blur-[24px] border border-white/5 px-1.5 py-1.5 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-full pointer-events-auto relative">
        {/* Fine Inner Boundary */}
        <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
        
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl transition-all duration-500 flex-1 group ${
                isActive ? 'text-[#3B82F6]' : 'text-[#A1A1AA] hover:text-[#E5E5E5]'
              }`}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-[#3B82F6]/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'group-hover:bg-white/5'
              }`}>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span className={`text-[6px] mt-1 font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}>
                {item.label}
              </span>

              {/* Minimal Indicator */}
              {isActive && (
                <div className="absolute -bottom-0.5 w-1 h-1 bg-[#3B82F6] rounded-full shadow-[0_0_8px_#3B82F6]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
