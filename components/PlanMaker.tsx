
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
          className="p-3 glass rounded-xl text-zinc-700 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </header>

      {/* Message List - Refined padding for visibility above input */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-48 px-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[1.25rem] text-[10px] font-black tracking-widest leading-relaxed uppercase animate-in fade-in slide-in-from-bottom-2 shadow-xl border border-white/5 ${
              m.role === 'user' 
                ? 'bg-[#3B82F6] text-white rounded-tr-none border-[#3B82F6]' 
                : 'glass text-[#A1A1AA] rounded-tl-none italic'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass p-3 rounded-xl flex space-x-1.5 animate-pulse">
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
            </div>
          </div>
        )}

        {suggestedTasks.length > 0 && (
          <div className="glass rounded-[1.5rem] p-5 animate-in zoom-in-95 duration-500 shadow-2xl space-y-5 border-[#3B82F6]/20 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[9px] font-black text-[#E5E5E5] uppercase tracking-[0.4em]">Target Preview</h4>
              <Zap size={14} className="text-[#3B82F6] animate-pulse" />
            </div>
            
            <div className="space-y-px rounded-xl overflow-hidden border border-white/5">
              <div className="flex space-x-px">
                <PreviewHeader label="Task" color="#00A3E0" />
                <PreviewHeader label="Time" color="#FFB81C" />
                <div className="w-[40px] bg-[#84BD00] py-2.5 text-center text-[7px] font-black text-white uppercase tracking-widest">CMD</div>
              </div>

              {suggestedTasks.map((t, i) => (
                <div key={i} className="flex space-x-px">
                  <div className="flex-1 bg-black/40 p-3 text-[9px] font-black text-[#E5E5E5] uppercase truncate">{t.title}</div>
                  <div className="w-[70px] bg-black/40 p-3 text-[8px] font-black text-[#FFB81C] text-center uppercase whitespace-nowrap">{t.timeSlot}</div>
                  <div className="w-[40px] bg-black/40 p-3 flex items-center justify-center">
                    <CheckCircle size={14} className="text-[#84BD00]" />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addToPlanner}
              className="w-full bg-[#3B82F6] text-white py-4 rounded-xl font-black text-[10px] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl"
            >
              LAUNCH MISSION
            </button>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* CHAT INPUT CONTAINER - Positioned to stay visible above the thinner menu bar */}
      <div className="fixed bottom-[82px] left-5 right-5 max-w-md mx-auto z-[120] animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative group">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="TRANSMIT PARAMETERS..."
            className="w-full bg-[#111113]/98 backdrop-blur-3xl border border-white/10 text-[#E5E5E5] placeholder:text-zinc-800 rounded-[1.5rem] pl-6 pr-14 py-4.5 text-[10px] font-black transition-all uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.7)] focus:border-[#3B82F6]/50 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-2 p-3 rounded-[1.1rem] transition-all ${
              input.trim() ? 'bg-[#3B82F6] text-white shadow-lg scale-100' : 'bg-transparent text-zinc-800 scale-90'
            }`}
          >
            <Send size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
