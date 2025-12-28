import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, Sparkles, Target, Activity, ChevronRight, Crown } from 'lucide-react';
import { Planner, Priority } from '../types';
import { generateQuote } from '../geminiService';

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState("Suffer the pain of discipline or suffer the pain of regret.");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchQuote = async () => {
    setIsRefreshing(true);
    const saved = JSON.parse(localStorage.getItem('motivator_seen_quotes') || '[]');
    const q = await generateQuote(saved);
    setQuote(q);
    localStorage.setItem('motivator_seen_quotes', JSON.stringify([q, ...saved].slice(0, 20)));
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const allTasks = planners.flatMap(p => p.tasks);
  const completedToday = allTasks.filter(t => t.completed).length;
  const efficiency = allTasks.length > 0 ? Math.round((completedToday / allTasks.length) * 100) : 0;
  
  const primeObjective = allTasks
    .filter(t => !t.completed)
    .sort((a, b) => (a.priority === Priority.HIGH ? -1 : 1))[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Top Elite Badge */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_12px_#3B82F6]" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">System.Active</span>
        </div>
        <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 px-4 py-2 rounded-full flex items-center space-x-2">
          <Crown size={12} className="text-[#C5A059]" />
          <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Elite Operator</span>
        </div>
      </div>

      <header className="px-1">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Command</h1>
        <div className="flex justify-between items-center mt-3">
          <p className="text-[#52525B] text-[10px] font-black uppercase tracking-[0.5em]">Mission Dashboard</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-[#3B82F6] tracking-tighter">{efficiency}%</span>
            <span className="text-[8px] font-black text-[#52525B] uppercase tracking-widest">Efficiency</span>
          </div>
        </div>
      </header>

      {/* Main Quote Card */}
      <div className="relative overflow-hidden rounded-[3rem] p-10 bg-gradient-to-br from-[#1C1C1E] to-[#0A0A0B] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
          <Sparkles size={180} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-px bg-[#C5A059]/40" />
            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.6em]">Daily Directive</span>
          </div>
          
          <p className="text-3xl font-black leading-[1.1] text-white tracking-tight italic mb-10">
            "{quote}"
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={fetchQuote} 
              disabled={isRefreshing}
              className="flex-1 bg-[#3B82F6] text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] active:scale-[0.96] transition-all shadow-[0_15px_35px_rgba(59,130,246,0.3)] disabled:opacity-50"
            >
              {isRefreshing ? 'Syncing...' : 'New Command'}
            </button>
            <button className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border-white/5 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <Activity size={20} className="text-[#3B82F6]" />
            <span className="text-[8px] text-[#52525B] font-black uppercase tracking-widest">Progress</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-white tracking-tighter">{completedToday}</span>
            <span className="text-xs font-bold text-[#52525B]">/ {allTasks.length}</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" style={{ width: `${efficiency}%` }} />
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/5 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <Target size={20} className="text-[#C5A059]" />
            <span className="text-[8px] text-[#52525B] font-black uppercase tracking-widest">Momentum</span>
          </div>
          <span className="text-4xl font-black text-[#C5A059] tracking-tighter">12D</span>
          <p className="text-[8px] font-black text-[#52525B] uppercase tracking-[0.2em] mt-2">Active Streak</p>
        </div>
      </div>

      {/* Prime Objective Focus */}
      {primeObjective && (
        <div className="px-1">
          <h2 className="text-[10px] font-black text-[#52525B] uppercase tracking-[0.6em] mb-5 ml-1">Prime Objective</h2>
          <div className="bg-gradient-to-r from-[#1C1C1E] to-transparent border border-white/10 p-7 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
            <div className="min-w-0 pr-6">
              <div className="flex items-center space-x-3 mb-2">
                <Zap size={14} className="text-[#3B82F6] fill-[#3B82F6]" />
                <span className="text-[9px] font-black text-[#3B82F6] uppercase tracking-widest">High Impact</span>
              </div>
              <h3 className="text-xl font-black text-white truncate italic tracking-tight">{primeObjective.title}</h3>
            </div>
            <button 
              onClick={() => onToggleTask(primeObjective.plannerId, primeObjective.id)} 
              className="w-16 h-16 bg-[#3B82F6] text-white rounded-2xl shadow-[0_10px_25px_rgba(59,130,246,0.4)] active:scale-90 transition-transform flex items-center justify-center flex-shrink-0"
            >
              <CheckCircle size={28} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Protocol List */}
      <div className="space-y-6 px-1">
        <h2 className="text-[10px] font-black text-[#52525B] uppercase tracking-[0.6em] ml-1">Daily Protocol</h2>
        <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 divide-y divide-white/5">
          {allTasks.length === 0 ? (
            <div className="py-16 text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">No Active Protocols</div>
          ) : (
            allTasks.slice(0, 5).map(task => (
              <div 
                key={task.id} 
                onClick={() => onToggleTask(task.plannerId, task.id)} 
                className="flex items-center p-7 cursor-pointer hover:bg-white/[0.02] transition-colors group"
              >
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center mr-6 transition-all duration-500 ${
                  task.completed ? 'bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 bg-black/40'
                }`}>
                  {task.completed ? <CheckCircle size={22} className="text-white" strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-base font-black uppercase tracking-tight truncate transition-all duration-500 ${
                    task.completed ? 'line-through text-zinc-700' : 'text-white'
                  }`}>{task.title}</h4>
                  <p className="text-[9px] text-zinc-600 font-bold mt-1 uppercase tracking-widest">{task.timeSlot || 'Anytime'}</p>
                </div>
                <ChevronRight size={18} className="text-zinc-800" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};