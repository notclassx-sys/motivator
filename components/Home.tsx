
import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, Sparkles, Target, Clock, Activity, ShieldCheck, ChevronRight, LayoutGrid } from 'lucide-react';
import { Planner, Priority } from '../types';
import { generateQuote } from '../geminiService';
import { Logo } from './Logo';

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState("Success is a decision made in silence.");
  const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);

  const fetchQuote = async () => {
    setIsRefreshingQuote(true);
    const savedQuotes = JSON.parse(localStorage.getItem('motivator_seen_quotes') || '[]');
    const q = await generateQuote(savedQuotes);
    setQuote(q);
    const newHistory = [q, ...savedQuotes].slice(0, 20);
    localStorage.setItem('motivator_seen_quotes', JSON.stringify(newHistory));
    setIsRefreshingQuote(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const allTasks = planners.flatMap(p => p.tasks);
  const completedToday = allTasks.filter(t => t.completed).length;
  const efficiency = allTasks.length > 0 ? Math.round((completedToday / allTasks.length) * 100) : 0;
  
  const activeFocus = allTasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (a.priority === Priority.HIGH && b.priority !== Priority.HIGH) return -1;
      if (a.priority !== Priority.HIGH && b.priority === Priority.HIGH) return 1;
      return b.createdAt - a.createdAt;
    })[0];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* STATUS HUD - FIXED MESHING */}
      <div className="flex items-center justify-between px-5 py-4 rounded-3xl glass shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
             <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_12px_#3b82f6]" />
             <div className="absolute w-5 h-5 rounded-full border border-[#3B82F6]/20 animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-[0.2em]">Operational Status</span>
            <span className="text-[7px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-0.5">Neural Link: Prime</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
          <ShieldCheck size={12} className="text-[#3B82F6]" />
          <span className="text-[8px] font-black text-[#3B82F6] uppercase tracking-widest">Encrypted</span>
        </div>
      </div>

      <header className="flex justify-between items-end px-1 mt-2">
        <div>
          <h1 className="text-4xl font-black text-[#E5E5E5] tracking-tighter uppercase italic leading-none">Command</h1>
          <div className="flex items-center space-x-2 mt-3">
            <LayoutGrid size={12} className="text-[#3B82F6]" />
            <span className="text-[#A1A1AA] text-[9px] font-black uppercase tracking-[0.4em]">Sector Profile: S-Class</span>
          </div>
        </div>
        <div className="text-right">
           <div className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-1">Efficiency</div>
           <div className="text-3xl font-black text-[#E5E5E5] italic tracking-tighter">{efficiency}%</div>
        </div>
      </header>

      {/* Quote Card - Standardized Spacing */}
      <div className="relative rounded-[2.5rem] p-10 border shadow-2xl overflow-hidden group bg-[#121214] border-white/5">
        <div className="absolute -top-12 -right-12 opacity-[0.04] scale-[2.2] pointer-events-none transition-transform duration-[5000ms] group-hover:rotate-6 text-[#3B82F6]">
          <Logo size={220} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-2.5 px-4 py-2 rounded-full glass border-white/10 text-[#C5A059]">
              <Sparkles size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Brief</span>
            </div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.6em]">V4.5.1</p>
          </div>
          
          <p className="text-2xl font-bold italic leading-tight mb-12 tracking-tight text-white/90">
            "{quote}"
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={fetchQuote} 
              disabled={isRefreshingQuote}
              className="flex-1 bg-[#3B82F6] text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-[0_12px_40px_rgba(59,130,246,0.4)] disabled:opacity-50"
            >
              {isRefreshingQuote ? 'SYNCING...' : 'REFRESH INTEL'}
            </button>
            <button className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-[#A1A1AA] hover:text-[#E5E5E5] transition-all hover:scale-105 active:scale-90 shadow-lg">
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid HUD - Explicit Separation */}
      <div className="grid grid-cols-2 gap-5">
        <div className="glass p-7 rounded-[2.2rem] flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden group border-white/5">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B82F6] opacity-40" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Velocity</span>
            <Activity size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-[#E5E5E5] tracking-tighter">{completedToday}</span>
              <span className="text-sm text-[#A1A1AA] font-bold">/ {allTasks.length}</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-5 border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${(completedToday / (allTasks.length || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="glass p-7 rounded-[2.2rem] flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden border-white/5">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C5A059] opacity-40" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Progress</span>
            <Target size={16} className="text-[#C5A059]" />
          </div>
          <div>
            <span className="text-5xl font-black text-[#C5A059] tracking-tighter italic">{efficiency}%</span>
            <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-[0.3em] mt-4">Sector Active</p>
          </div>
        </div>
      </div>

      {activeFocus && (
        <div className="px-1">
          <div className="bg-gradient-to-r from-[#3B82F6]/10 via-[#3B82F6]/5 to-transparent border-l-4 border-[#3B82F6] p-6 rounded-r-3xl space-y-4 glass border-t-0 border-b-0 border-r-0 shadow-lg">
            <div className="flex items-center space-x-2.5">
              <Zap size={14} className="text-[#3B82F6]" />
              <span className="text-[9px] font-black text-[#E5E5E5] uppercase tracking-[0.4em]">Primary Directive</span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight truncate pr-6">
                {activeFocus.title}
              </h3>
              <button 
                onClick={() => onToggleTask(activeFocus.plannerId, activeFocus.id)}
                className="bg-[#3B82F6] text-white p-3 rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.4)] active:scale-90 transition-all"
              >
                <CheckCircle size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Queue - Uniform Spacing */}
      <div className="space-y-5 px-1 pb-6">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-[11px] font-black text-[#A1A1AA] uppercase tracking-[0.5em] italic">Tactical Briefing</h2>
          <div className="w-16 h-[1px] bg-white/10" />
        </div>
        
        <div className="glass rounded-[2.5rem] overflow-hidden shadow-2xl divide-y divide-white/5 border-white/5">
          {allTasks.length === 0 ? (
            <div className="py-24 text-center">
              <Target size={32} className="text-[#2C2C2E] mx-auto mb-6 opacity-20" />
              <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.5em]">No Data in Sector</p>
            </div>
          ) : (
            allTasks.slice(0, 5).map(task => (
              <div 
                key={task.id}
                onClick={() => onToggleTask(task.plannerId, task.id)}
                className={`flex items-center p-6 group cursor-pointer hover:bg-white/[0.02] transition-all duration-300 ${task.completed ? 'opacity-25' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mr-6 transition-all duration-500 ${
                  task.completed ? 'bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-black/40 border-white/10 group-hover:border-[#3B82F6]/50'
                }`}>
                  {task.completed ? (
                    <CheckCircle size={24} className="text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full group-hover:scale-125 transition-transform shadow-[0_0_8px_#3B82F6]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className={`text-[14px] font-black tracking-tight truncate uppercase transition-all ${task.completed ? 'line-through text-[#A1A1AA]' : 'text-[#E5E5E5]'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center mt-1.5 space-x-4">
                    {task.timeSlot && (
                      <span className="text-[8px] text-[#A1A1AA] font-bold uppercase flex items-center tracking-widest">
                        <Clock size={11} className="mr-1.5 text-[#3B82F6]" /> {task.timeSlot}
                      </span>
                    )}
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${
                       task.priority === Priority.HIGH ? 'text-rose-400 bg-rose-400/10' : 'text-[#A1A1AA] bg-white/5'
                    }`}>{task.priority}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#2C2C2E] group-hover:text-[#3B82F6] transition-transform group-hover:translate-x-1" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
