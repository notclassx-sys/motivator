
import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, TrendingUp, Sparkles, Target, Cloud, Clock, AlertTriangle, Key, Activity, ShieldCheck, ChevronRight, LayoutGrid } from 'lucide-react';
import { Planner, Task, Priority } from '../types';
import { generateQuote } from '../geminiService';
import { Logo } from './Logo';

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState("Your ambition defines your reality.");
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
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      {/* CLEAN STATUS HEADER */}
      <div className="flex items-center justify-between px-6 py-4 rounded-[1.5rem] border bg-[#1C1C1E]/50 border-white/5 backdrop-blur-md transition-all duration-700 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
             <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3b82f6] animate-pulse" />
             <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-ping opacity-20" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-[0.3em]">Operational Status</span>
            <span className="text-[7px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-0.5">Neural Core: Optimized</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[#3B82F6]">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Secure</span>
        </div>
      </div>

      <header className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-4xl font-black text-[#E5E5E5] tracking-tighter uppercase italic">Command</h1>
          <div className="flex items-center space-x-2 mt-2">
            <LayoutGrid size={12} className="text-[#3B82F6]" />
            <span className="text-[#A1A1AA] text-[9px] font-black uppercase tracking-[0.4em]">Sector Health: Prime</span>
          </div>
        </div>
        <div className="text-right">
           <div className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-1">Rank</div>
           <div className="text-3xl font-black text-[#E5E5E5] italic tracking-tighter shadow-sm">{efficiency >= 90 ? 'S+' : efficiency >= 70 ? 'A' : 'B'}</div>
        </div>
      </header>

      {/* Quote Card */}
      <div className="relative rounded-[3.5rem] p-12 border shadow-2xl overflow-hidden group transition-all duration-1000 bg-[#1C1C1E] border-white/10 shadow-black/50">
        <div className="absolute top-0 right-[-10%] opacity-[0.04] scale-[2.2] pointer-events-none transition-all duration-[3000ms] group-hover:scale-[2.4] group-hover:rotate-6 text-[#3B82F6]">
          <Logo size={220} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-full border bg-[#121212]/50 border-white/5 text-[#C5A059]">
              <Sparkles size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Directive</span>
            </div>
            <p className="text-[8px] font-black text-[#A1A1AA] uppercase tracking-[0.6em] opacity-40">Pro v4.5</p>
          </div>
          
          <p className="text-2xl font-bold italic leading-tight mb-12 tracking-tight text-[#E5E5E5]">
            "{quote}"
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={fetchQuote} 
              disabled={isRefreshingQuote}
              className="flex-1 bg-[#3B82F6] text-white px-8 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-[0_20px_40px_rgba(59,130,246,0.3)] disabled:opacity-50"
            >
              {isRefreshingQuote ? 'SYNCING...' : 'NEW MISSION BRIEF'}
            </button>
            <button className="w-20 h-20 bg-[#2C2C2E]/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#E5E5E5] transition-all hover:rotate-12">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-[#1C1C1E] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6] opacity-20" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Velocity</span>
            <Activity size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-[#E5E5E5] tracking-tighter">{completedToday}</span>
              <span className="text-sm text-[#A1A1AA] font-bold">/ {allTasks.length}</span>
            </div>
            <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden mt-5">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${(completedToday / (allTasks.length || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="bg-[#1C1C1E] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C5A059] opacity-20" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Efficiency</span>
            <Target size={16} className="text-[#C5A059]" />
          </div>
          <div>
            <span className="text-5xl font-black text-[#C5A059] tracking-tighter italic">{efficiency}%</span>
            <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-[0.3em] mt-3">Mission Grade</p>
          </div>
        </div>
      </div>

      {activeFocus && (
        <div className="px-1">
          <div className="bg-gradient-to-r from-[#3B82F6]/10 to-transparent border-l-4 border-[#3B82F6] p-6 rounded-r-[2rem] space-y-4">
            <div className="flex items-center space-x-2">
              <Zap size={14} className="text-[#3B82F6]" />
              <span className="text-[9px] font-black text-[#E5E5E5] uppercase tracking-[0.4em]">Primary Objective</span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight truncate pr-4">
                {activeFocus.title}
              </h3>
              <button 
                onClick={() => onToggleTask(activeFocus.plannerId, activeFocus.id)}
                className="bg-[#3B82F6] text-white p-3 rounded-xl shadow-lg active:scale-90 transition-all"
              >
                <CheckCircle size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5 px-1 pb-10">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-[11px] font-black text-[#E5E5E5] uppercase tracking-[0.5em] italic">Tactical Sprint</h2>
          <div className="w-10 h-[1px] bg-white/10" />
        </div>
        
        <div className="bg-[#1C1C1E] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl divide-y divide-white/5">
          {allTasks.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mx-auto mb-6 text-[#2C2C2E]">
                <Target size={32} />
              </div>
              <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.4em]">Sector Clear</p>
            </div>
          ) : (
            allTasks.slice(0, 5).map(task => (
              <div 
                key={task.id}
                onClick={() => onToggleTask(task.plannerId, task.id)}
                className={`flex items-center p-7 group cursor-pointer hover:bg-white/[0.02] transition-all duration-300 ${task.completed ? 'opacity-30' : ''}`}
              >
                <div className={`w-12 h-12 rounded-[1.25rem] border flex items-center justify-center mr-6 transition-all duration-500 ${
                  task.completed ? 'bg-[#3B82F6] border-[#3B82F6] rotate-12 scale-90' : 'bg-[#121212] border-white/10 group-hover:border-[#3B82F6] group-hover:rotate-6'
                }`}>
                  {task.completed ? (
                    <CheckCircle size={24} className="text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-[#3B82F6] rounded-full group-hover:animate-ping" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className={`text-[14px] font-black tracking-tight truncate uppercase transition-all ${task.completed ? 'line-through text-[#A1A1AA]' : 'text-[#E5E5E5] group-hover:text-[#3B82F6]'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center mt-1.5 space-x-4">
                    {task.timeSlot && (
                      <span className="text-[9px] text-[#A1A1AA] font-bold uppercase flex items-center">
                        <Clock size={11} className="mr-1.5 text-[#3B82F6]" /> {task.timeSlot}
                      </span>
                    )}
                    <span className={`text-[8px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-widest ${
                       task.priority === Priority.HIGH ? 'text-rose-400 bg-rose-400/10' : 'text-[#A1A1AA] bg-white/5'
                    }`}>{task.priority}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#2C2C2E] group-hover:text-[#3B82F6] transition-all group-hover:translate-x-1" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
