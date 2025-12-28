
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, X, Table, List, Clock, Target } from 'lucide-react';
import { Planner, Priority } from '../types';

interface PlannerViewProps {
  planners: Planner[];
  onToggleTask: (pId: string, tId: string) => void;
  onDeleteTask: (pId: string, tId: string) => void;
  onUpdatePriority: (pId: string, tId: string, priority: Priority) => void;
  onAddPlanner: (name: string, icon: string, color: string) => void;
  onDeletePlanner: (id: string) => void;
}

const HeaderBlock: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div className="relative flex-1">
    <div 
      className="py-3 text-center text-[9px] font-black text-white uppercase tracking-wider relative z-10"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
    <div className="absolute left-0 right-0 -bottom-1 z-20 flex justify-center pointer-events-none">
      <svg width="100%" height="8" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0 0 L50 10 L100 0 Z" fill={color} />
      </svg>
    </div>
  </div>
);

export const PlannerView: React.FC<PlannerViewProps> = ({ planners, onToggleTask, onDeleteTask, onUpdatePriority, onAddPlanner, onDeletePlanner }) => {
  const [selectedPlannerId, setSelectedPlannerId] = useState(planners[0]?.id || '');
  const [isAddingPlanner, setIsAddingPlanner] = useState(false);
  const [newPlannerName, setNewPlannerName] = useState('');
  const [viewMode, setViewMode] = useState<'normal' | 'table'>('normal');

  const currentPlanner = planners.find(p => p.id === selectedPlannerId);

  const handleCreatePlanner = () => {
    if (!newPlannerName.trim()) return;
    onAddPlanner(newPlannerName.toUpperCase(), '📅', '#3B82F6');
    setNewPlannerName('');
    setIsAddingPlanner(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-black text-[#E5E5E5] tracking-tight uppercase italic leading-none">My Plans</h1>
          <p className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-[0.2em] mt-3">Manage Your Goals</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewMode(viewMode === 'normal' ? 'table' : 'normal')}
            className={`p-3.5 rounded-xl border transition-all ${
              viewMode === 'table' ? 'bg-[#3B82F6] text-white shadow-lg' : 'glass text-[#A1A1AA]'
            }`}
          >
            {viewMode === 'normal' ? <Table size={18} /> : <List size={18} />}
          </button>
          <button 
            onClick={() => setIsAddingPlanner(true)}
            className="p-3.5 bg-[#3B82F6] text-white rounded-xl shadow-lg"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </header>

      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {planners.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlannerId(p.id)}
            className={`flex-shrink-0 px-5 py-3 rounded-xl border transition-all flex items-center space-x-3 ${
              selectedPlannerId === p.id 
                ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg' 
                : 'glass text-[#A1A1AA]'
            }`}
          >
            <span className="text-lg">{p.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-wider">{p.name}</span>
          </button>
        ))}
      </div>

      {currentPlanner ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center px-1 mb-4">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
               <h2 className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-widest">{currentPlanner.name}</h2>
             </div>
             <button 
                onClick={() => { if (confirm(`Delete this planner?`)) onDeletePlanner(currentPlanner.id); }}
                className="text-[9px] font-bold text-zinc-700 hover:text-rose-500 uppercase tracking-wider"
              >
                Delete Planner
              </button>
          </div>

          {viewMode === 'normal' ? (
            <div className="space-y-3">
              {currentPlanner.tasks.length === 0 ? (
                <div className="py-20 text-center glass rounded-2xl border-white/5">
                  <p className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest">No tasks here</p>
                </div>
              ) : (
                currentPlanner.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="glass p-5 rounded-2xl flex items-center justify-between border-white/5 shadow-md"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center space-x-3 mb-1">
                         <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                            task.priority === Priority.HIGH ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-[#A1A1AA]'
                         }`}>
                           {task.priority}
                         </span>
                         {task.timeSlot && (
                           <span className="text-[8px] text-[#C5A059] font-bold flex items-center">
                             <Clock size={10} className="mr-1" /> {task.timeSlot}
                           </span>
                         )}
                      </div>
                      <h3 className={`text-[14px] font-black uppercase tracking-tight truncate ${task.completed ? 'text-zinc-600 line-through' : 'text-white'}`}>
                        {task.title}
                      </h3>
                    </div>
                    <button 
                      onClick={() => onToggleTask(currentPlanner.id, task.id)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                        task.completed ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'bg-black/40 border-white/10 text-[#3B82F6]'
                      }`}
                    >
                      <CheckCircle size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-98">
               <div className="flex space-x-px mb-2 rounded-lg overflow-hidden">
                <HeaderBlock label="Task Name" color="#00A3E0" />
                <HeaderBlock label="Time" color="#FFB81C" />
                <div className="w-[50px] bg-[#84BD00] py-3 text-center text-[9px] font-black text-white uppercase">ADD</div>
              </div>

              <div className="space-y-px rounded-xl overflow-hidden border border-white/5 bg-white/5">
                {currentPlanner.tasks.map((task) => (
                  <div key={task.id} className="flex space-x-px">
                    <div className="flex-1 bg-black/60 p-4 border-b border-white/5">
                      <span className={`text-[11px] font-bold uppercase truncate ${task.completed ? 'text-zinc-700 line-through' : 'text-white'}`}>{task.title}</span>
                    </div>
                    <div className="w-[80px] bg-black/60 p-4 flex items-center justify-center border-b border-white/5">
                      <span className={`text-[9px] font-bold ${task.completed ? 'text-zinc-800' : 'text-[#FFB81C]'}`}>{task.timeSlot || 'Anytime'}</span>
                    </div>
                    <div className="w-[50px] bg-black/60 p-3 flex items-center justify-center border-b border-white/5">
                      <button 
                        onClick={() => onToggleTask(currentPlanner.id, task.id)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          task.completed ? 'bg-[#84BD00] text-white' : 'bg-black/30 text-[#84BD00]'
                        }`}
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-24 text-center glass rounded-3xl opacity-50">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[11px]">No active plans</p>
        </div>
      )}

      {isAddingPlanner && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-8 z-[200] backdrop-blur-3xl animate-in fade-in">
          <div className="glass w-full max-w-sm rounded-[2rem] p-10 border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">New Planner</h3>
              <button onClick={() => setIsAddingPlanner(false)} className="text-[#A1A1AA] p-2"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest mb-4 block">Name</label>
                <input 
                  autoFocus
                  value={newPlannerName}
                  onChange={e => setNewPlannerName(e.target.value)}
                  placeholder="WORK, STUDY, ETC..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-5 text-[14px] font-bold focus:border-[#3B82F6] outline-none text-white uppercase"
                />
              </div>
              <button 
                onClick={handleCreatePlanner}
                className="w-full bg-[#3B82F6] text-white py-5 rounded-xl font-black uppercase tracking-widest text-[11px]"
              >
                Create Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
