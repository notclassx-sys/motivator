import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, Sparkles, Target, Activity, ChevronRight, Crown } from 'lucide-react';
import { Planner, Priority } from '../types';

const LOCAL_QUOTES = [
  "EXCELLENCE IS NOT AN ACT, BUT A HABIT.",
  "THE BEST WAY TO PREDICT THE FUTURE IS TO CREATE IT.",
  "DISCIPLINE IS THE BRIDGE BETWEEN GOALS AND ACCOMPLISHMENT.",
  "HE WHO HAS A WHY TO LIVE CAN BEAR ALMOST ANY HOW.",
  "LIMITS LIKE FEAR ARE OFTEN JUST AN ILLUSION.",
  "SURETY OF PURPOSE IS THE BASIS OF ALL ACHIEVEMENT.",
  "YOU DO NOT RISE TO THE LEVEL OF YOUR GOALS, YOU FALL TO THE LEVEL OF YOUR SYSTEMS."
];

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState(LOCAL_QUOTES[0]);

  const fetchQuote = () => {
    const random = Math.floor(Math.random() * LOCAL_QUOTES.length);
    setQuote(LOCAL_QUOTES[random]);
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 rounded-3xl bg-[#1C1C1E]/40 border border-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
          <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">System Manual</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
          <Crown size={12} className="text-[#C5A059]" />
          <span className="text-[8px] font-black text-[#C5A059] uppercase tracking-widest">Elite Operator</span>
        </div>
      </div>

      <header className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Mission Control</h1>
          <p className="text-[#52525B] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Personal Command</p>
        </div>
        <div className="text-right">
           <div className="text-[9px] font-black text-[#3B82F6] uppercase tracking-[0.3em] mb-1">Efficiency</div>
           <div className="text-3xl font-black text-white tracking-tighter">{efficiency}%</div>
        </div>
      </header>

      {/* Quote Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-8 bg-[#1C1C1E] border border-white/10 shadow-2xl group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-px bg-[#C5A059]/30" />
            <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.5em]">Core Principle</span>
          </div>
          <p className="text-2xl font-black leading-[1.15] mb-8 text-white tracking-tight italic uppercase">
            "{quote}"
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={fetchQuote} 
              className="flex-1 bg-[#3B82F6] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
            >
              NEXT PRINCIPLE
            </button>
            <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors border border-white/5">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-[#1C1C1E] p-7 rounded-[2.5rem] flex flex-col justify-between border border-white/5 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[9px] text-[#52525B] font-black uppercase tracking-[0.3em]">Completed</span>
            <Activity size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white tracking-tighter">{completedToday}</span>
              <span className="text-[11px] font-black text-zinc-700 tracking-widest">/ {allTasks.length}</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-5 overflow-hidden">
              <div className="h-full bg-[#3B82F6] rounded-full transition-all duration-1000 shadow-[0_0_10px_#3B82F6]" style={{ width: `${efficiency}%` }} />
            </div>
          </div>
        </div>
        
        <div className="bg-[#1C1C1E] p-7 rounded-[2.5rem] flex flex-col justify-between border border-white/5 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[9px] text-[#52525B] font-black uppercase tracking-[0.3em]">Streak</span>
            <Target size={16} className="text-[#C5A059]" />
          </div>
          <div>
            <span className="text-4xl font-black text-[#C5A059] tracking-tighter">12D</span>
            <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em] mt-5">Continuous Velocity</p>
          </div>
        </div>
      </div>

      {/* Next Objective Focus */}
      {activeFocus ? (
        <div className="bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/40 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between">
          <div className="min-w-0 pr-6">
            <div className="flex items-center space-x-3 mb-2">
              <Zap size={14} className="text-[#3B82F6] fill-[#3B82F6]" />
              <span className="text-[9px] font-black text-[#3B82F6] uppercase tracking-[0.4em]">Prime Objective</span>
            </div>
            <h3 className="text-lg font-black text-white truncate italic tracking-tight uppercase">{activeFocus.title}</h3>
          </div>
          <button 
            onClick={() => onToggleTask(activeFocus.plannerId, activeFocus.id)} 
            className="bg-[#3B82F6] text-white w-14 h-14 rounded-2xl shadow-[0_10px_20px_rgba(59,130,246,0.4)] active:scale-90 transition-transform flex items-center justify-center flex-shrink-0"
          >
            <CheckCircle size={24} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="bg-[#1C1C1E]/40 border border-white/5 border-dashed p-8 rounded-[2.5rem] text-center">
           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">No Objectives Active</p>
        </div>
      )}

      {/* Quick Access List */}
      <div className="space-y-5 px-1">
        <h2 className="text-[10px] font-black text-[#52525B] uppercase tracking-[0.6em] ml-1">Recent Logs</h2>
        <div className="bg-[#1C1C1E] rounded-[2.5rem] overflow-hidden border border-white/5 divide-y divide-white/5">
          {allTasks.length === 0 ? (
            <div className="py-16 text-center text-[11px] text-zinc-800 font-black uppercase tracking-widest italic">Matrix Empty</div>
          ) : (
            allTasks.slice(0, 4).map(task => (
              <div key={task.id} onClick={() => onToggleTask(task.plannerId, task.id)} className="flex items-center p-6 cursor-pointer hover:bg-white/[0.02] transition-colors group">
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center mr-5 transition-all duration-500 ${task.completed ? 'bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 bg-black/40 group-hover:border-white/20'}`}>
                  {task.completed ? <CheckCircle size={22} className="text-white" strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[15px] font-black uppercase tracking-tight truncate transition-all duration-500 ${task.completed ? 'line-through text-zinc-700' : 'text-white'}`}>{task.title}</h4>
                  <p className="text-[9px] text-zinc-600 font-black mt-1 uppercase tracking-widest italic">{task.timeSlot || 'Routine Slot'}</p>
                </div>
                <ChevronRight size={18} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};