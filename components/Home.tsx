
import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, Sparkles, Target, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { Planner, Priority } from '../types';
import { generateQuote } from '../geminiService';
import { Logo } from './Logo';

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState("Focus on the step in front of you.");
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[#1C1C1E] border border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Sync</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
          <ShieldCheck size={10} className="text-[#3B82F6]" />
          <span className="text-[8px] font-bold text-[#3B82F6] uppercase tracking-widest">Secure</span>
        </div>
      </div>

      <header className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Home</h1>
          <p className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest mt-1">Daily Overview</p>
        </div>
        <div className="text-right">
           <div className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">Score</div>
           <div className="text-2xl font-bold text-white">{efficiency}%</div>
        </div>
      </header>

      <div className="relative rounded-3xl p-7 bg-[#1C1C1E] border border-white/5 shadow-xl">
        <div className="flex items-center space-x-2 mb-5">
          <Sparkles size={14} className="text-[#C5A059]" />
          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">Motivation</span>
        </div>
        <p className="text-lg font-bold leading-tight mb-7 text-white/95">"{quote}"</p>
        <div className="flex space-x-3">
          <button 
            onClick={fetchQuote} 
            disabled={isRefreshingQuote}
            className="flex-1 bg-[#3B82F6] text-white py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
          >
            {isRefreshingQuote ? 'Syncing...' : 'New Quote'}
          </button>
          <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#A1A1AA]">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1C1C1E] p-6 rounded-[2rem] flex flex-col justify-between border border-white/5 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] text-[#A1A1AA] font-bold uppercase tracking-widest">Done</span>
            <Activity size={14} className="text-[#3B82F6]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-white">{completedToday}</span>
              <span className="text-[10px] text-zinc-600">/ {allTasks.length}</span>
            </div>
            <div className="w-full h-1 bg-black rounded-full mt-4">
              <div className="h-full bg-[#3B82F6] rounded-full transition-all duration-1000" style={{ width: `${efficiency}%` }} />
            </div>
          </div>
        </div>
        
        <div className="bg-[#1C1C1E] p-6 rounded-[2rem] flex flex-col justify-between border border-white/5 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] text-[#A1A1AA] font-bold uppercase tracking-widest">Goals</span>
            <Target size={14} className="text-[#C5A059]" />
          </div>
          <div>
            <span className="text-3xl font-bold text-[#C5A059]">{efficiency}%</span>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-4">Completion</p>
          </div>
        </div>
      </div>

      {activeFocus && (
        <div className="bg-[#1C1C1E] border border-white/5 p-4 rounded-3xl shadow-lg flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex items-center space-x-2 mb-1">
              <Zap size={12} className="text-[#3B82F6]" />
              <span className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-widest">Next</span>
            </div>
            <h3 className="text-sm font-bold text-white truncate">{activeFocus.title}</h3>
          </div>
          <button onClick={() => onToggleTask(activeFocus.plannerId, activeFocus.id)} className="bg-[#3B82F6] text-white p-3 rounded-2xl shadow-lg active:scale-90">
            <CheckCircle size={20} />
          </button>
        </div>
      )}

      <div className="space-y-4 px-1 pb-16">
        <h2 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Today's Tasks</h2>
        <div className="bg-[#1C1C1E] rounded-[2rem] overflow-hidden border border-white/5 divide-y divide-white/5">
          {allTasks.length === 0 ? (
            <div className="py-16 text-center text-[11px] text-zinc-600 font-bold uppercase tracking-widest">No tasks yet</div>
          ) : (
            allTasks.slice(0, 5).map(task => (
              <div key={task.id} onClick={() => onToggleTask(task.plannerId, task.id)} className="flex items-center p-5 cursor-pointer">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mr-4 transition-all ${task.completed ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-white/10'}`}>
                  {task.completed && <CheckCircle size={18} className="text-white" />}
                </div>
                <h4 className={`text-sm font-bold flex-1 truncate ${task.completed ? 'line-through text-zinc-600' : 'text-white'}`}>{task.title}</h4>
                <ChevronRight size={16} className="text-zinc-800" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
