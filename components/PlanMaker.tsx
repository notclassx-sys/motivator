import React, { useState, useEffect } from 'react';
import { Plus, Target, Clock, Zap, LayoutList, CheckCircle } from 'lucide-react';
import { Planner, Priority } from '../types';

interface PlanMakerProps {
  planners: Planner[];
  onAddTasks: (pId: string, task: any) => void;
  onAddPlanner: (name: string, icon: string, color: string) => any;
}

export const PlanMaker: React.FC<PlanMakerProps> = ({ planners, onAddTasks, onAddPlanner }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedPlannerId, setSelectedPlannerId] = useState(planners[0]?.id || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!selectedPlannerId && planners.length > 0) {
      setSelectedPlannerId(planners[0].id);
    }
  }, [planners]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetId = selectedPlannerId;
    if (!targetId && planners.length === 0) {
      targetId = onAddPlanner('My Tasks', '📝', '#3B82F6');
    } else if (!targetId && planners.length > 0) {
      targetId = planners[0].id;
    }

    onAddTasks(targetId, {
      title,
      description: '',
      priority,
      timeSlot: timeSlot || 'Today'
    });

    setTitle('');
    setTimeSlot('');
    setPriority(Priority.MEDIUM);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="px-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Add a task</h1>
        <p className="text-zinc-400 text-sm mt-1">What would you like to do next?</p>
      </header>

      <form onSubmit={handleAdd} className="space-y-6">
        {/* Name Input */}
        <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/5 shadow-sm">
          <label className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 block">Task Name</label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Clean the kitchen"
            className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-semibold text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1E] rounded-3xl p-5 border border-white/5">
            <div className="flex items-center space-x-2 mb-3">
              <Clock size={14} className="text-blue-500" />
              <label className="text-[10px] font-bold text-zinc-500 uppercase">When?</label>
            </div>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              placeholder="9:00 AM"
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-[#1C1C1E] rounded-3xl p-5 border border-white/5">
            <div className="flex items-center space-x-2 mb-3">
              <Target size={14} className="text-blue-500" />
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Importance</label>
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Normal</option>
              <option value={Priority.HIGH}>High</option>
            </select>
          </div>
        </div>

        {/* Planner Choice */}
        <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <LayoutList size={14} className="text-zinc-500" />
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Save to list</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {planners.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlannerId(p.id)}
                className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all ${
                  selectedPlannerId === p.id 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-black/20 border-white/5 text-zinc-500'
                }`}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className={`w-full py-5 rounded-3xl font-bold text-sm transition-all flex items-center justify-center space-x-3 shadow-lg active:scale-95 disabled:opacity-30 ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle size={20} />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Plus size={20} strokeWidth={3} />
              <span>Add Task</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};