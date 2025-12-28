
import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Bot, Trash2, CheckCircle, Clock } from 'lucide-react';
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
      className="py-2.5 text-center text-[7px] font-black text-white uppercase tracking-widest"
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
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
      <header className="flex justify-between items-center mb-6 px-1">
        <div>
          <h1 className="text-2xl font-black text-[#E5E5E5] tracking-tighter uppercase italic flex items-center">
            <Bot size={22} className="mr-3 text-[#3B82F6]" /> Strategist
          </h1>
          <p className="text-[8px] text-[#A1A1AA] font-black uppercase tracking-[0.4em] mt-1 ml-9">Prime Intelligence</p>
        </div>
        <button 
          onClick={() => { if(confirm('Purge history?')) { setMessages([{ role: 'model', text: "Log cleared." }]); setSuggestedTasks([]); localStorage.removeItem('motivator_chat_history'); }}}
          className="p-3 glass rounded-xl text-[#2C2C2E] hover:text-rose-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </header>

      {/* Message List - Increased Bottom Padding to avoid hiding under input */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-52 px-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-2xl text-[10px] font-black tracking-widest leading-relaxed uppercase animate-in fade-in slide-in-from-bottom-2 shadow-lg ${
              m.role === 'user' 
                ? 'bg-[#3B82F6] text-white rounded-tr-none' 
                : 'glass text-[#A1A1AA] rounded-tl-none italic'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass p-3 rounded-xl flex space-x-1.5 animate-pulse">
              <div className="w-1 h-1 bg-[#3B82F6] rounded-full" />
              <div className="w-1 h-1 bg-[#3B82F6] rounded-full" />
              <div className="w-1 h-1 bg-[#3B82F6] rounded-full" />
            </div>
          </div>
        )}

        {suggestedTasks.length > 0 && (
          <div className="glass rounded-[2rem] p-6 animate-in zoom-in-95 duration-500 shadow-2xl space-y-6 border-[#3B82F6]/20">
            <div className="flex items-center justify-between">
              <h4 className="text-[9px] font-black text-[#E5E5E5] uppercase tracking-[0.4em]">Target Preview</h4>
              <Zap size={14} className="text-[#3B82F6] animate-pulse" />
            </div>
            
            <div className="space-y-0.5 rounded-xl overflow-hidden border border-white/5">
              <div className="flex space-x-px">
                <PreviewHeader label="Task" color="#00A3E0" />
                <PreviewHeader label="Time" color="#FFB81C" />
                <div className="w-[40px] bg-[#84BD00] py-2.5 text-center text-[7px] font-black text-white uppercase tracking-widest">CMD</div>
              </div>

              {suggestedTasks.map((t, i) => (
                <div key={i} className="flex space-x-px">
                  <div className="flex-1 bg-black/40 p-3 text-[8px] font-black text-[#E5E5E5] uppercase truncate">{t.title}</div>
                  <div className="w-[70px] bg-black/40 p-3 text-[8px] font-black text-[#FFB81C] text-center uppercase whitespace-nowrap">{t.timeSlot}</div>
                  <div className="w-[40px] bg-black/40 p-3 flex items-center justify-center">
                    <CheckCircle size={12} className="text-[#84BD00]/30" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[8px] font-black text-[#A1A1AA] uppercase tracking-[0.4em] ml-2 block">Mission Sector</label>
              <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2">
                {planners.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlannerId(p.id)}
                    className={`flex-shrink-0 px-5 py-3.5 rounded-xl border transition-all flex items-center space-x-2.5 ${
                      selectedPlannerId === p.id 
                        ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg' 
                        : 'glass text-[#A1A1AA]'
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={addToPlanner}
              className="w-full bg-[#3B82F6] text-white py-5 rounded-2xl font-black text-[10px] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl flex items-center justify-center"
            >
              Launch Directives
            </button>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* CHAT INPUT CONTAINER - Elevated with higher Z-INDEX to clear BottomNav */}
      <div className="fixed bottom-[115px] left-5 right-5 max-w-md mx-auto z-[120] animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative group">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="TRANSMIT PARAMETERS..."
            className="w-full bg-[#111113]/95 backdrop-blur-3xl border border-white/10 text-[#E5E5E5] placeholder:text-zinc-800 rounded-3xl pl-8 pr-16 py-6 text-[11px] font-black transition-all uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.6)] focus:border-[#3B82F6]/50 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 top-3 p-4 rounded-2xl transition-all ${
              input.trim() ? 'bg-[#3B82F6] text-white shadow-lg scale-100' : 'bg-transparent text-zinc-800 scale-90'
            }`}
          >
            <Send size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
