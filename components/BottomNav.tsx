
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
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent z-[100] pointer-events-none">
      <nav className="max-w-md mx-auto bg-[#1C1C1E]/70 backdrop-blur-[32px] border border-white/10 px-2 py-3 flex justify-around items-center shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-[3rem] pointer-events-auto relative">
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 rounded-[3rem] border border-[#3B82F6]/5 pointer-events-none" />
        
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-700 flex-1 group ${
                isActive ? 'text-[#3B82F6] -translate-y-2' : 'text-[#A1A1AA] hover:text-[#E5E5E5]'
              }`}
            >
              {/* Active Neural Dot */}
              {isActive && (
                <div className="absolute -top-1.5 w-1 h-1 bg-[#3B82F6] rounded-full shadow-[0_0_15px_#3B82F6] animate-pulse" />
              )}
              
              <div className={`relative p-2.5 rounded-[1.25rem] transition-all duration-500 ${
                isActive 
                  ? 'bg-[#3B82F6]/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-[#3B82F6]/30' 
                  : 'group-hover:bg-white/5'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span className={`text-[7px] mt-2 font-black uppercase tracking-[0.4em] transition-all duration-500 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}>
                {item.label}
              </span>

              {/* Background Glow for Active Item */}
              {isActive && (
                <div className="absolute inset-0 bg-[#3B82F6]/5 blur-3xl rounded-full -z-10 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
