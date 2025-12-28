
import React, { useState, useRef, useEffect } from 'react';
import { Send, Target, Zap, Bot, Trash2, CheckCircle, Clock, ListChecks, ChevronDown, AlertTriangle, Key, ShieldAlert } from 'lucide-react';
import { Planner, ChatMessage } from '../types';
import { chatForTasks } from '../geminiService';

interface PlanMakerProps {
  planners: Planner[];
  onAddTasks: (pId: string, task: any) => void;
  onAddPlanner: (name: string, icon: string, color: string) => any;
}

const PreviewHeader: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div className="relative flex-1">
    <div 
      className="py-2 text-center text-[7px] font-black text-white uppercase tracking-widest"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
    <div className="absolute left-0 right-0 -bottom-1 z-20 flex justify-center pointer-events-none">
      <svg width="100%" height="4" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0 0 L50 10 L100 0 Z" fill={color} />
      </svg>
    </div>
  </div>
);

export const PlanMaker: React.FC<PlanMakerProps> = ({ planners, onAddTasks, onAddPlanner }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('motivator_chat_history');
    return saved ? JSON.parse(saved) : [{ role: 'model', text: "Strategic Link: Online. How shall we dominate the day?" }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<any[]>([]);
  const [selectedPlannerId, setSelectedPlannerId] = useState(planners[0]?.id || '');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedPlannerId && planners.length > 0) {
      setSelectedPlannerId(planners[0].id);
    }
  }, [planners]);

  useEffect(() => {
    localStorage.setItem('motivator_chat_history', JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, suggestedTasks]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await chatForTasks(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: result.reply || "Strategy parameters updated." }]);
      if (result.suggestedTasks && result.suggestedTasks.length > 0) {
        setSuggestedTasks(result.suggestedTasks);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Brief delay in neural processing. Awaiting re-sync..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToPlanner = () => {
    let targetId = selectedPlannerId;
    if (!targetId && planners.length === 0) {
      targetId = onAddPlanner('MISSION OPS', '🎯', '#3B82F6');
    } else if (!targetId && planners.length > 0) {
      targetId = planners[0].id;
    }
    suggestedTasks.forEach(task => onAddTasks(targetId, task));
    setSuggestedTasks([]);
    setMessages(prev => [...prev, { role: 'model', text: "Sector objectives initialized." }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <header className="flex justify-between items-center mb-8 px-1">
        <div>
          <h1 className="text-2xl font-black text-[#E5E5E5] tracking-tighter uppercase italic flex items-center">
            <Bot size={24} className="mr-3 text-[#3B82F6]" /> Strategist
          </h1>
          <p className="text-[9px] text-[#A1A1AA] font-black uppercase tracking-[0.4em] mt-1 ml-9">Prime Intelligence</p>
        </div>
        <button 
          onClick={() => { if(confirm('Purge briefing history?')) { setMessages([{ role: 'model', text: "Tactical log cleared." }]); setSuggestedTasks([]); localStorage.removeItem('motivator_chat_history'); }}}
          className="p-3 bg-[#1C1C1E] border border-white/5 rounded-2xl text-[#2C2C2E] hover:text-rose-500 transition-colors shadow-lg"
        >
          <Trash2 size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-48 px-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] text-[11px] font-black tracking-widest leading-relaxed uppercase animate-in fade-in slide-in-from-bottom-2 shadow-2xl ${
              m.role === 'user' 
                ? 'bg-[#3B82F6] text-white rounded-tr-none' 
                : 'bg-[#1C1C1E] border border-white/5 text-[#A1A1AA] rounded-tl-none italic'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1C1C1E] border border-white/5 p-4 rounded-2xl flex space-x-2 animate-pulse">
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
            </div>
          </div>
        )}

        {suggestedTasks.length > 0 && (
          <div className="bg-[#1C1C1E] border border-[#3B82F6]/30 rounded-[3rem] p-8 animate-in zoom-in-95 duration-500 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-[0.5em]">Target Preview</h4>
              <Zap size={16} className="text-[#3B82F6] animate-pulse" />
            </div>
            
            <div className="space-y-1 rounded-2xl overflow-hidden">
              <div className="flex space-x-0.5">
                <PreviewHeader label="Target" color="#00A3E0" />
                <PreviewHeader label="Window" color="#FFB81C" />
                <PreviewHeader label="Note" color="#00868F" />
                <div className="w-[40px] bg-[#84BD00] py-2 text-center text-[7px] font-black text-white uppercase tracking-widest">CMD</div>
              </div>

              {suggestedTasks.map((t, i) => (
                <div key={i} className="flex space-x-0.5">
                  <div className="flex-1 bg-[#121212] p-3 border border-white/5 text-[9px] font-black text-[#E5E5E5] uppercase truncate">{t.title}</div>
                  <div className="w-[70px] bg-[#121212] p-3 border border-white/5 text-[8px] font-black text-[#FFB81C] text-center uppercase">{t.timeSlot}</div>
                  <div className="flex-1 bg-[#121212] p-3 border border-white/5 text-[8px] text-[#A1A1AA] italic truncate">{t.description}</div>
                  <div className="w-[40px] bg-[#121212] p-3 border border-white/5 flex items-center justify-center">
                    <CheckCircle size={14} className="text-[#84BD00]/50" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black text-[#A1A1AA] uppercase tracking-[0.5em] ml-2 block">Mission Sector</label>
              <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
                {planners.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlannerId(p.id)}
                    className={`flex-shrink-0 px-6 py-4 rounded-2xl border transition-all flex items-center space-x-3 ${
                      selectedPlannerId === p.id 
                        ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-xl' 
                        : 'bg-[#121212] border-white/5 text-[#A1A1AA]'
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={addToPlanner}
              className="w-full bg-[#3B82F6] text-white py-6 rounded-[2rem] font-black text-[11px] active:scale-[0.98] transition-all uppercase tracking-widest shadow-2xl flex items-center justify-center"
            >
              Initialize Directives
            </button>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="fixed bottom-[110px] left-8 right-8 max-w-md mx-auto pointer-events-none">
        <div className="relative group pointer-events-auto">
          <div className="absolute inset-0 bg-[#3B82F6]/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="TRANSMIT MISSION PARAMETERS..."
            className="w-full bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 text-[#E5E5E5] placeholder:text-[#2C2C2E] rounded-[2rem] pl-8 pr-16 py-6 text-[11px] font-black transition-all uppercase tracking-[0.2em] shadow-2xl relative z-10 focus:border-[#3B82F6]/60"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 top-3 p-4 rounded-2xl transition-all z-20 ${
              input.trim() ? 'bg-[#3B82F6] text-white active:scale-90 shadow-xl' : 'bg-[#121212] text-[#2C2C2E]'
            }`}
          >
            <Send size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
