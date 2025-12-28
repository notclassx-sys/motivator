import React, { useState, useEffect } from 'react';
import { Share2, Zap, CheckCircle, Sparkles, Target, Activity, ChevronRight, Heart } from 'lucide-react';
import { Planner, Priority } from '../types';
import { generateQuote } from '../geminiService';

interface HomeProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ planners, onToggleTask }) => {
  const [quote, setQuote] = useState("Small steps lead to big results!");
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    const q = await generateQuote();
    setQuote(q);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const allTasks = planners.flatMap(p => p.tasks);
  const completedToday = allTasks.filter(t => t.completed).length;
  const totalTasks = allTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  
  const mainTask = allTasks
    .filter(t => !t.completed)
    .sort((a, b) => (a.priority === Priority.HIGH ? -1 : 1))[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="px-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">Welcome back!</h1>
        <p className="text-zinc-400 text-sm mt-1">Let's see what you can achieve today.</p>
      </header>

      {/* Daily Quote Card */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles size={100} />
        </div>
        <div className="relative z-10">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-4">Today's Inspiration</p>
          <p className="text-2xl font-semibold text-white leading-tight mb-8">
            "{quote}"
          </p>
          <button 
            onClick={fetchQuote} 
            disabled={loading}
            className="bg-white text-blue-600 px-6 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Get New Quote'}
          </button>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1C1C1E] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-500 text-xs font-bold uppercase">Done</span>
            <Activity size={18} className="text-blue-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-white">{completedToday}</span>
            <span className="text-zinc-500 text-sm">/ {totalTasks}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-[#1C1C1E] p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-500 text-xs font-bold uppercase">Streak</span>
            <Target size={18} className="text-orange-400" />
          </div>
          <span className="text-3xl font-bold text-white">12 Days</span>
          <p className="text-[10px] text-zinc-500 mt-2">You're on fire!</p>
        </div>
      </div>

      {/* Main Task Focus */}
      {mainTask && (
        <div className="bg-[#1C1C1E] p-6 rounded-3xl border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Next important thing</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-4">
              <h3 className="text-lg font-bold text-white truncate">{mainTask.title}</h3>
              <p className="text-xs text-zinc-500 mt-1">{mainTask.timeSlot || 'Whenever you can'}</p>
            </div>
            <button 
              onClick={() => onToggleTask(mainTask.plannerId, mainTask.id)} 
              className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-90 transition-all"
            >
              <CheckCircle size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Quick List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Your recent tasks</h2>
        <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5 divide-y divide-white/5">
          {allTasks.length === 0 ? (
            <div className="py-12 text-center text-zinc-600 text-sm">No tasks added yet.</div>
          ) : (
            allTasks.slice(0, 3).map(task => (
              <div key={task.id} onClick={() => onToggleTask(task.plannerId, task.id)} className="flex items-center p-5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mr-4 transition-all ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-white/10'}`}>
                  {task.completed ? <CheckCircle size={20} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate transition-all ${task.completed ? 'line-through text-zinc-600' : 'text-white'}`}>{task.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{task.timeSlot || 'Routine'}</p>
                </div>
                <ChevronRight size={16} className="text-zinc-700" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};