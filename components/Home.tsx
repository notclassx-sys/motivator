import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, Sparkles, Target, Activity, ChevronRight, Crown } from 'lucide-react';
import { Planner, Priority } from '../types';
import { generateQuote } from '../geminiService';

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState("Excellence is not a skill, it is an attitude.");
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
  const totalTasks = allTasks.length;
  const efficiency = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  
  const primeObjective = allTasks
    .filter(t => !t.completed)
    .sort((a, b) => (a.priority === Priority.HIGH ? -1 : 1))[0];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-28">
      {/* Top Elite Status */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_15px_#3B82F6]" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Network.Active</span>
        </div>
        <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 px-5 py-2.5 rounded-full flex items-center space-x-2">
          <Crown size={14} className="text-[#C5A059]" />
          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Supreme Tier</span>
        </div>
      </div>

      <header className="px-1">
        <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">MISSION</h1>
        <div className="flex justify-between items-end mt-4">
          <p className="text-[#52525B] text-[11px] font-black uppercase tracking-[0.6em]">Command Center</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-[#3B82F6] tracking-tighter">{efficiency}%</span>
            <span className="text-[10px] font-black text-[#52525B] uppercase tracking-widest">Velocity</span>
          </div>
        </div>
      </header>

      {/* Daily Directive Section */}
      <div className="relative overflow-hidden rounded-[4rem] p-12 bg-gradient-to-br from-[#1C1C1E] to-[#0A0A0B] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.7)] group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-1000">
          <Sparkles size={250} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6 mb-12">
            <div className="w-16 h-px bg-[#C5A059]/40" />
            <span className="text-[11px] font-black text-[#C5A059] uppercase tracking-[0.8em]">Daily Command</span>
          </div>
          
          <p className="text-5xl font-black leading-[1] text-white tracking-tight italic mb-14">
            "{quote}"
          </p>
          
          <div className="flex space-x-5">
            <button 
              onClick={fetchQuote} 
              disabled={isRefreshing}
              className="flex-1 bg-[#3B82F6] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] active:scale-[0.95] transition-all shadow-[0_25px_50px_rgba(59,130,246,0.4)] disabled:opacity-50"
            >
              {isRefreshing ? 'SYNCHING...' : 'NEW COMMAND'}
            </button>
            <button className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center text-zinc-500 hover:text-white transition-colors border border-white/5">
              <Share2 size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Core */}
      <div className="grid grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-[#3B82F6]/5 group-hover:text-[#3B82F6]/10 transition-colors">
            <Activity size={80} />
          </div>
          <div className="flex justify-between items-start mb-10">
            <Activity size={24} className="text-[#3B82F6]" />
            <span className="text-[10px] text-[#52525B] font-black uppercase tracking-widest">Efficiency</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black text-white tracking-tighter">{completedToday}</span>
            <span className="text-base font-bold text-[#52525B] tracking-widest">/ {totalTasks}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full mt-10 overflow-hidden">
            <div className="h-full bg-[#3B82F6] shadow-[0_0_20px_#3B82F6] transition-all duration-1000" style={{ width: `${efficiency}%` }} />
          </div>
        </div>

        <div className="glass p-10 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-[#C5A059]/5 group-hover:text-[#C5A059]/10 transition-colors">
            <Target size={80} />
          </div>
          <div className="flex justify-between items-start mb-10">
            <Target size={24} className="text-[#C5A059]" />
            <span className="text-[10px] text-[#52525B] font-black uppercase tracking-widest">Momentum</span>
          </div>
          <span className="text-6xl font-black text-[#C5A059] tracking-tighter">12D</span>
          <p className="text-[10px] font-black text-[#52525B] uppercase tracking-[0.4em] mt-4 italic">Unstoppable</p>
        </div>
      </div>

      {/* Prime Objective Card */}
      {primeObjective && (
        <div className="px-1">
          <h2 className="text-[12px] font-black text-[#52525B] uppercase tracking-[0.8em] mb-8 ml-2 italic">Prime Objective</h2>
          <div className="bg-gradient-to-r from-[#1C1C1E] to-transparent border border-white/10 p-10 rounded-[3.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="min-w-0 pr-10 relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <Zap size={20} className="text-[#3B82F6] fill-[#3B82F6]" />
                <span className="text-[11px] font-black text-[#3B82F6] uppercase tracking-[0.2em]">Highest Priority</span>
              </div>
              <h3 className="text-3xl font-black text-white truncate italic tracking-tighter uppercase">{primeObjective.title}</h3>
            </div>
            <button 
              onClick={() => onToggleTask(primeObjective.plannerId, primeObjective.id)} 
              className="w-20 h-20 bg-[#3B82F6] text-white rounded-[2rem] shadow-[0_20px_40px_rgba(59,130,246,0.6)] active:scale-90 transition-transform flex items-center justify-center flex-shrink-0 z-10"
            >
              <CheckCircle size={40} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Mission Log */}
      <div className="space-y-8 px-1">
        <h2 className="text-[12px] font-black text-[#52525B] uppercase tracking-[0.8em] ml-2 italic">Daily Protocol</h2>
        <div className="glass rounded-[4rem] overflow-hidden border-white/5 divide-y divide-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {totalTasks === 0 ? (
            <div className="py-24 text-center text-[12px] text-zinc-700 font-black uppercase tracking-[0.8em]">System Standby</div>
          ) : (
            allTasks.slice(0, 5).map(task => (
              <div 
                key={task.id} 
                onClick={() => onToggleTask(task.plannerId, task.id)} 
                className="flex items-center p-10 cursor-pointer hover:bg-white/[0.04] transition-colors group"
              >
                <div className={`w-16 h-16 rounded-[1.75rem] border-2 flex items-center justify-center mr-8 transition-all duration-500 ${
                  task.completed ? 'bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.5)]' : 'border-white/10 bg-black/40 group-hover:border-white/20'
                }`}>
                  {task.completed ? <CheckCircle size={30} className="text-white" strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-white/20" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xl font-black uppercase tracking-tight truncate transition-all duration-500 ${
                    task.completed ? 'line-through text-zinc-700 opacity-50' : 'text-white'
                  }`}>{task.title}</h4>
                  <p className="text-[11px] text-zinc-600 font-bold mt-2 uppercase tracking-widest italic">{task.timeSlot || 'Routine'}</p>
                </div>
                <ChevronRight size={24} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};