
import React from 'react';
import { Home, MessageSquare, BarChart2, Calendar, User } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan-maker', label: 'AI', icon: MessageSquare },
    { id: 'planner', label: 'Tasks', icon: Calendar },
    { id: 'analytics', label: 'Stats', icon: BarChart2 },
    { id: 'profile', label: 'Me', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-8 pb-3 pt-1 bg-gradient-to-t from-[#0A0A0B] to-transparent z-[150] pointer-events-none">
      <nav className="max-w-md mx-auto bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/5 px-1 py-0.5 flex justify-around items-center shadow-2xl rounded-full pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`relative flex flex-col items-center justify-center py-1 flex-1 transition-all duration-300 ${
                isActive ? 'text-[#3B82F6]' : 'text-[#A1A1AA]'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#3B82F6]/10' : ''}`}>
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[6.5px] font-black uppercase tracking-[0.2em] mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0 w-1 h-1 bg-[#3B82F6] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
