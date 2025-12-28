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
    { id: 'plan-maker', label: 'Add Task', icon: Sparkles },
    { id: 'planner', label: 'My List', icon: LayoutList },
    { id: 'analytics', label: 'Progress', icon: PieChart },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-2 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-[150] pointer-events-none">
      <nav className="max-w-md mx-auto glass border border-white/10 px-2 py-2 flex justify-around items-center shadow-xl rounded-[2rem] pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`relative flex flex-col items-center justify-center py-2 flex-1 transition-all duration-300 ${
                isActive ? 'text-blue-500' : 'text-zinc-600'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-500 ${isActive ? 'bg-blue-500/10 scale-110' : 'hover:bg-white/5'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-bold mt-1 transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};