
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, X, Table, List, Clock, ChevronRight, Target } from 'lucide-react';
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
      className="py-3 text-center text-[9px] font-black text-white uppercase tracking-widest relative z-10"
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
    onAddPlanner(newPlannerName.toUpperCase(), '📁', '#3B82F6');
    setNewPlannerName('');
    setIsAddingPlanner(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-black text-[#E5E5E5] tracking-tighter uppercase italic leading-none">Registry</h1>
          <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-[0.4em] mt-3">Tactical Operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setViewMode(viewMode === 'normal' ? 'table' : 'normal')}
            className={`p-4 rounded-2xl border transition-all ${
              viewMode === 'table' ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-xl scale-105' : 'glass text-[#A1A1AA]'
            }`}
          >
            {viewMode === 'normal' ? <Table size={20} /> : <List size={20} />}
          </button>
          <button 
            onClick={() => setIsAddingPlanner(true)}
            className="p-4 bg-[#3B82F6] text-white rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* Sector Selector - Better Contrast */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4">
        {planners.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlannerId(p.id)}
            className={`flex-shrink-0 px-6 py-4 rounded-2xl border transition-all duration-300 flex items-center space-x-4 ${
              selectedPlannerId === p.id 
                ? 'glass border-[#3B82F6] text-white shadow-2xl scale-105' 
                : 'bg-black/40 border-white/5 text-[#A1A1AA]'
            }`}
          >
            <span className="text-xl">{p.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
          </button>
        ))}
      </div>

      {currentPlanner ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center px-2 mb-6">
             <div className="flex items-center space-x-3">
               <div className="w-2 h-2 bg-[#3B82F6] rounded-full neural-glow shadow-[0_0_8px_#3B82F6]" />
               <h2 className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-[0.4em]">{currentPlanner.name} // {viewMode === 'table' ? 'GRID' : 'STREAK'}</h2>
             </div>
             <button 
                onClick={() => { if (confirm(`TERMINATE SECTOR ${currentPlanner.name}?`)) onDeletePlanner(currentPlanner.id); }}
                className="text-[9px] font-black text-zinc-700 hover:text-rose-500 uppercase tracking-[0.3em] transition-colors"
              >
                CLOSE SECTOR
              </button>
          </div>

          {viewMode === 'normal' ? (
            <div className="space-y-3">
              {currentPlanner.tasks.length === 0 ? (
                <div className="py-24 text-center glass rounded-[2.5rem] border-white/5">
                  <Target size={40} className="text-zinc-800 mx-auto mb-6 opacity-20" />
                  <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.6em]">Sector Sanitized</p>
                </div>
              ) : (
                currentPlanner.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="glass p-6 rounded-3xl flex items-center justify-between group transition-all hover:bg-white/[0.03] border-white/5"
                  >
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center space-x-3 mb-2">
                         <span className={`text-[7px] font-black px-2 py-0.5 rounded-lg uppercase ${
                            task.priority === Priority.HIGH ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-[#A1A1AA]'
                         }`}>
                           {task.priority}
                         </span>
                         {task.timeSlot && (
                           <span className="text-[8px] text-[#C5A059] font-black uppercase tracking-widest flex items-center">
                             <Clock size={10} className="mr-1.5" /> {task.timeSlot}
                           </span>
                         )}
                      </div>
                      <h3 className="text-[15px] font-black text-white uppercase tracking-tight truncate">
                        {task.title}
                      </h3>
                    </div>
                    <button 
                      onClick={() => onToggleTask(currentPlanner.id, task.id)}
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-lg active:scale-90 ${
                        task.completed ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'bg-black/40 border-white/10 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                      }`}
                    >
                      <CheckCircle size={24} strokeWidth={2.5} />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-98 duration-400">
               {/* GRID HEADER - FIXED MESHING */}
               <div className="flex space-x-px mb-4 rounded-xl overflow-hidden shadow-2xl">
                <HeaderBlock label="Objective" color="#00A3E0" />
                <HeaderBlock label="Window" color="#FFB81C" />
                <div className="w-[60px] relative">
                  <div className="bg-[#84BD00] py-3 text-center text-[9px] font-black text-white uppercase tracking-widest">CMD</div>
                  <div className="absolute left-0 right-0 -bottom-1 z-20 flex justify-center pointer-events-none">
                    <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 100 10">
                      <path d="M0 0 L50 10 L100 0 Z" fill="#84BD00" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* GRID BODY - EXPLICIT CELL BOUNDARIES */}
              <div className="space-y-px rounded-2xl overflow-hidden border border-white/5 tactical-mesh p-px bg-white/5 shadow-2xl">
                {currentPlanner.tasks.length === 0 ? (
                  <div className="py-24 text-center glass border-none rounded-none bg-transparent">
                    <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.5em]">Command Log Empty</p>
                  </div>
                ) : (
                  currentPlanner.tasks.map((task) => (
                    <div key={task.id} className="flex space-x-px">
                      <div className="flex-1 bg-black/60 p-5 flex items-center border-b border-white/5">
                        <span className={`text-[11px] font-black uppercase truncate ${task.completed ? 'text-zinc-700 line-through' : 'text-[#E5E5E5]'}`}>{task.title}</span>
                      </div>
                      <div className="w-[90px] bg-black/60 p-5 flex items-center justify-center border-b border-white/5">
                        <span className={`text-[9px] font-black uppercase whitespace-nowrap ${task.completed ? 'text-zinc-800' : 'text-[#FFB81C]'}`}>{task.timeSlot || '24/7'}</span>
                      </div>
                      <div className="w-[60px] bg-black/60 p-3 flex items-center justify-center border-b border-white/5">
                        <button 
                          onClick={() => onToggleTask(currentPlanner.id, task.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            task.completed ? 'bg-[#84BD00] text-white' : 'bg-black/30 text-[#84BD00] hover:bg-[#84BD00] hover:text-white'
                          }`}
                        >
                          <CheckCircle size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-32 text-center glass rounded-[3rem] border-white/5 opacity-40">
          <p className="text-zinc-500 font-black uppercase tracking-[0.8em] text-[11px]">Nexus Link Offline</p>
        </div>
      )}

      {isAddingPlanner && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-8 z-[200] backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="glass w-full max-w-sm rounded-[3rem] p-12 shadow-[0_32px_80px_rgba(0,0,0,0.8)] border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">New Operational Sector</h3>
              <button onClick={() => setIsAddingPlanner(false)} className="text-[#A1A1AA] hover:text-white p-2">
                <X size={26} />
              </button>
            </div>
            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.5em] mb-5 block italic">Codename</label>
                <input 
                  autoFocus
                  value={newPlannerName}
                  onChange={e => setNewPlannerName(e.target.value)}
                  placeholder="CODE SPRINT ALPHA..."
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-8 py-6 text-[14px] font-black focus:border-[#3B82F6] outline-none text-white uppercase tracking-[0.2em] placeholder:text-zinc-800 transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={handleCreatePlanner}
                className="w-full bg-[#3B82F6] text-white py-6 rounded-2xl font-black shadow-[0_15px_40px_rgba(59,130,246,0.4)] uppercase tracking-widest text-[12px] active:scale-[0.98] transition-all"
              >
                INITIALIZE SECTOR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
