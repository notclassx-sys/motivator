import React, { useState, useEffect } from 'react';
import { Plus, Target, Clock, Zap, LayoutList, ChevronRight, CheckCircle } from 'lucide-react';
import { Planner, Priority } from '../types';

interface PlanMakerProps {
  planners: Planner[];
  onAddTasks: (pId: string, task: any) => void;
  onAddPlanner: (name: string, icon: string, color: string) => any;
}

export const PlanMaker: React.FC<PlanMakerProps> = ({ planners, onAddTasks, onAddPlanner }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedPlannerId, setSelectedPlannerId] = useState(planners[0]?.id || '');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!selectedPlannerId && planners.length > 0) {
      setSelectedPlannerId(planners[0].id);
    }
  }, [planners]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetId = selectedPlannerId;
    if (!targetId && planners.length === 0) {
      targetId = onAddPlanner('MISSION PLAN', '📅', '#3B82F6');
    } else if (!targetId && planners.length > 0) {
      targetId = planners[0].id;
    }

    onAddTasks(targetId, {
      title,
      description,
      priority,
      timeSlot: timeSlot || 'ASAP'
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTimeSlot('');
    setPriority(Priority.MEDIUM);
    
    // Show success haptic-style feedback
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="px-1">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Plan Maker</h1>
        <p className="text-[#52525B] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Manual Protocol Entry</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title Input */}
        <div className="bg-[#1C1C1E] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center space-x-3 mb-6">
            <Zap size={16} className="text-[#3B82F6]" />
            <label className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.4em]">Objective Title</label>
          </div>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.G. DEPLOY PRODUCTION CODE"
            className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-black text-white placeholder:text-zinc-800 focus:outline-none focus:border-[#3B82F6] transition-all uppercase italic tracking-tight"
          />
        </div>

        {/* Tactical Parameters */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#1C1C1E] rounded-[2.5rem] p-7 border border-white/5 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Clock size={14} className="text-[#C5A059]" />
              <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Time Slot</label>
            </div>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              placeholder="09:00 AM"
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#C5A059] transition-all"
            />
          </div>

          <div className="bg-[#1C1C1E] rounded-[2.5rem] p-7 border border-white/5 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Target size={14} className="text-[#3B82F6]" />
              <label className="text-[9px] font-black text-[#3B82F6] uppercase tracking-widest">Priority</label>
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#3B82F6] appearance-none"
            >
              <option value={Priority.LOW}>LOW</option>
              <option value={Priority.MEDIUM}>MEDIUM</option>
              <option value={Priority.HIGH}>HIGH</option>
            </select>
          </div>
        </div>

        {/* Planner Selection */}
        <div className="bg-[#1C1C1E] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <LayoutList size={16} className="text-[#52525B]" />
            <label className="text-[10px] font-black text-[#52525B] uppercase tracking-[0.4em]">Select Matrix</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {planners.length === 0 ? (
              <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest py-2 italic">No planners available. A default will be created.</p>
            ) : (
              planners.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlannerId(p.id)}
                  className={`px-5 py-3 rounded-2xl border text-[10px] font-black transition-all uppercase tracking-widest ${
                    selectedPlannerId === p.id 
                      ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-black/20 border-white/5 text-zinc-500'
                  }`}
                >
                  {p.icon} {p.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] transition-all flex items-center justify-center space-x-4 shadow-2xl active:scale-95 disabled:opacity-30 ${
            success ? 'bg-[#84BD00] text-white' : 'bg-[#3B82F6] text-white'
          }`}
        >
          {success ? (
            <>
              <CheckCircle size={20} />
              <span>LOGGED SUCCESSFULLY</span>
            </>
          ) : (
            <>
              <Plus size={20} strokeWidth={3} />
              <span>COMMIT TO PLANNER</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="px-4 py-8 border-t border-white/5 mt-10">
        <div className="flex items-center justify-between text-[#52525B]">
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Protocol v2.0 Manual</span>
          <div className="flex space-x-1">
             <div className="w-1 h-1 rounded-full bg-zinc-800" />
             <div className="w-1 h-1 rounded-full bg-zinc-800" />
             <div className="w-1 h-1 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
};