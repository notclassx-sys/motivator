
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, X, Layers, Trash, Clock, AlertCircle, Zap, Target, Table, List, Calendar, ChevronRight } from 'lucide-react';
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
    <div className="absolute left-0 right-0 -bottom-2 z-20 flex justify-center pointer-events-none">
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
    onAddPlanner(newPlannerName, '📁', '#3B82F6');
    setNewPlannerName('');
    setIsAddingPlanner(false);
  };

  const handleTick = (plannerId: string, taskId: string) => {
    onDeleteTask(plannerId, taskId);
  };

  return (
    <div className="space-y-6 pb-32">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#E5E5E5] tracking-tighter uppercase italic">Registry</h1>
          <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-[0.4em] mt-1">Operational Command</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setViewMode(viewMode === 'normal' ? 'table' : 'normal')}
            className={`p-4 rounded-2xl border transition-all ${
              viewMode === 'table' ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'bg-[#1C1C1E] border-white/5 text-[#A1A1AA]'
            }`}
            title="Toggle View Mode"
          >
            {viewMode === 'normal' ? <Table size={18} /> : <List size={18} />}
          </button>
          <button 
            onClick={() => setIsAddingPlanner(true)}
            className="p-4 bg-[#3B82F6] text-white rounded-2xl active:scale-90 transition-all shadow-xl"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* Selector Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {planners.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlannerId(p.id)}
            className={`flex-shrink-0 px-6 py-4 rounded-2xl border transition-all duration-300 flex items-center space-x-3 ${
              selectedPlannerId === p.id 
                ? 'bg-[#1C1C1E] border-[#3B82F6] shadow-lg text-white' 
                : 'bg-[#1C1C1E]/50 border-white/5 text-[#A1A1AA]'
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
               <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse" />
               <h2 className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-[0.3em]">{currentPlanner.name} // {viewMode === 'table' ? 'GRID' : 'LIST'}</h2>
             </div>
             <button 
                onClick={() => { if (confirm(`DELETE SECTOR: ${currentPlanner.name}?`)) onDeletePlanner(currentPlanner.id); }}
                className="text-[9px] font-black text-[#2C2C2E] hover:text-rose-500 uppercase tracking-widest transition-colors"
              >
                Terminate
              </button>
          </div>

          {viewMode === 'normal' ? (
            /* EMPIRE LIST VIEW (Normal View) */
            <div className="space-y-3">
              {currentPlanner.tasks.length === 0 ? (
                <div className="py-24 text-center bg-[#1C1C1E] rounded-[2.5rem] border border-white/5">
                  <Target size={32} className="text-[#2C2C2E] mx-auto mb-4" />
                  <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.5em]">No Active Objectives.</p>
                </div>
              ) : (
                currentPlanner.tasks.map((task, idx) => (
                  <div 
                    key={task.id} 
                    className="bg-[#1C1C1E] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group animate-in fade-in slide-in-from-left-4 transition-all hover:bg-white/[0.02]"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* LEFT AREA: TITLE AND VIEW ACTION */}
                    <div 
                      className="flex-1 min-w-0 pr-4 cursor-pointer"
                      onClick={() => setViewMode('table')}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                         <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                            task.priority === Priority.HIGH ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-[#A1A1AA]'
                         }`}>
                           {task.priority}
                         </span>
                         {task.timeSlot && (
                           <span className="text-[8px] text-[#FFB81C] font-black uppercase tracking-widest flex items-center">
                             <Clock size={8} className="mr-1" /> {task.timeSlot}
                           </span>
                         )}
                      </div>
                      
                      <h3 className="text-sm font-black text-[#E5E5E5] uppercase tracking-tight mb-3 truncate group-hover:text-[#3B82F6] transition-colors">
                        {task.title}
                      </h3>
                      
                      {/* ACTION: VIEW BUTTON REPLACING DESCRIPTION */}
                      <button 
                        className="bg-[#121212] border border-white/5 px-4 py-2 rounded-xl text-[9px] font-black text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white uppercase tracking-[0.3em] flex items-center transition-all shadow-sm"
                      >
                        VIEW <ChevronRight size={10} className="ml-2" />
                      </button>
                    </div>

                    {/* RIGHT AREA: COMPLETION TOGGLE */}
                    <div className="flex items-center pl-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTick(currentPlanner.id, task.id); }}
                        className="w-14 h-14 bg-[#121212] border border-white/10 rounded-2xl flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all active:scale-90 shadow-xl"
                      >
                        <CheckCircle size={24} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* TACTICAL TABLE TEMPLATE VIEW */
            <div className="animate-in fade-in zoom-in-95 duration-300">
               <div className="flex space-x-1 mb-4">
                <HeaderBlock label="Mission Title" color="#00A3E0" />
                <HeaderBlock label="Target Time" color="#FFB81C" />
                <HeaderBlock label="Strategy Notes" color="#00868F" />
                <div className="w-[60px] relative">
                  <div className="bg-[#84BD00] py-3 text-center text-[9px] font-black text-white uppercase tracking-widest">Status</div>
                  <div className="absolute left-0 right-0 -bottom-2 z-20 flex justify-center pointer-events-none">
                    <svg width="100%" height="8" preserveAspectRatio="none" viewBox="0 0 100 10">
                      <path d="M0 0 L50 10 L100 0 Z" fill="#84BD00" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                {currentPlanner.tasks.length === 0 ? (
                  <div className="py-24 text-center bg-[#1C1C1E] rounded-3xl border border-white/5">
                    <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.5em]">Sector Clear.</p>
                  </div>
                ) : (
                  currentPlanner.tasks.map((task) => (
                    <div key={task.id} className="flex space-x-1">
                      <div className="flex-1 bg-[#1C1C1E] p-4 flex items-center border border-white/5 rounded-sm">
                        <span className="text-[10px] font-black text-[#E5E5E5] uppercase truncate">{task.title}</span>
                      </div>
                      <div className="w-[100px] bg-[#1C1C1E] p-4 flex items-center justify-center border border-white/5 rounded-sm">
                        <span className="text-[9px] font-black text-[#FFB81C] uppercase whitespace-nowrap">{task.timeSlot || 'ANYTIME'}</span>
                      </div>
                      <div className="flex-[1.5] bg-[#1C1C1E] p-4 flex items-center border border-white/5 rounded-sm">
                        <p className="text-[9px] text-[#A1A1AA] font-medium line-clamp-1 italic lowercase">{task.description}</p>
                      </div>
                      <div className="w-[60px] bg-[#1C1C1E] p-2 flex items-center justify-center border border-white/5 rounded-sm">
                        <button 
                          onClick={() => handleTick(currentPlanner.id, task.id)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#84BD00] hover:bg-[#84BD00] hover:text-white transition-all active:scale-90"
                        >
                          <CheckCircle size={20} strokeWidth={2.5} />
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
        <div className="py-24 text-center">
          <p className="text-zinc-800 font-black uppercase tracking-[0.4em] text-[10px]">Registry Offline.</p>
        </div>
      )}

      {/* Add Planner Modal */}
      {isAddingPlanner && (
        <div className="fixed inset-0 bg-[#121212]/98 flex items-center justify-center p-8 z-[100] backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[3.5rem] p-12 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black text-[#E5E5E5] uppercase italic tracking-tighter">New Mission Sector</h3>
              <button onClick={() => setIsAddingPlanner(false)} className="text-[#A1A1AA] hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.5em] mb-5 block">Operational Title</label>
                <input 
                  autoFocus
                  value={newPlannerName}
                  onChange={e => setNewPlannerName(e.target.value)}
                  placeholder="EX: FOCUS SPRINT..."
                  className="w-full bg-[#121212] border border-white/10 rounded-2xl px-7 py-6 text-sm font-black focus:outline-none focus:border-[#3B82F6]/60 text-[#E5E5E5] uppercase tracking-widest placeholder:text-[#2C2C2E]"
                />
              </div>
              <button 
                onClick={handleCreatePlanner}
                className="w-full bg-[#3B82F6] text-white py-6 rounded-[2rem] font-black shadow-xl uppercase tracking-widest text-[12px] active:scale-[0.98] transition-all"
              >
                Launch Sector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
