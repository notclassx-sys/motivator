
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import { Planner, ChatMessage } from '../types';
import { chatForTasks } from '../geminiService';

interface PlanMakerProps {
  planners: Planner[];
  onAddTasks: (pId: string, task: any) => void;
  onAddPlanner: (name: string, icon: string, color: string) => any;
}

export const PlanMaker: React.FC<PlanMakerProps> = ({ planners, onAddTasks, onAddPlanner }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('motivator_chat_history');
    return saved ? JSON.parse(saved) : [{ role: 'model', text: "Hi! I'm your AI Assistant. How can I help you plan your day today?" }];
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
      setMessages(prev => [...prev, { role: 'model', text: result.reply || "I've generated a suggested plan for you." }]);
      if (result.suggestedTasks && result.suggestedTasks.length > 0) {
        setSuggestedTasks(result.suggestedTasks);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToPlanner = () => {
    let targetId = selectedPlannerId;
    if (!targetId && planners.length === 0) {
      targetId = onAddPlanner('My Plan', '📅', '#3B82F6');
    } else if (!targetId && planners.length > 0) {
      targetId = planners[0].id;
    }
    suggestedTasks.forEach(task => onAddTasks(targetId, task));
    setSuggestedTasks([]);
    setMessages(prev => [...prev, { role: 'model', text: "Done! I've added those tasks to your planner." }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <header className="flex justify-between items-center mb-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Bot size={20} className="mr-2.5 text-[#3B82F6]" /> AI Assistant
          </h1>
          <p className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-widest mt-1 ml-8">Plan your day</p>
        </div>
        <button 
          onClick={() => { if(confirm('Clear history?')) { setMessages([{ role: 'model', text: "Chat history cleared." }]); setSuggestedTasks([]); localStorage.removeItem('motivator_chat_history'); }}}
          className="p-2.5 bg-white/5 rounded-xl text-zinc-600 hover:text-rose-500 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-40 px-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-[#3B82F6] text-white rounded-tr-none' 
                : 'bg-[#1C1C1E] text-white border border-white/5 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1C1C1E] p-3 rounded-xl flex space-x-1.5 animate-pulse">
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
            </div>
          </div>
        )}

        {suggestedTasks.length > 0 && (
          <div className="bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl space-y-4 border border-white/5 animate-in zoom-in-95">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-[#3B82F6]" />
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">New Suggestions</h4>
            </div>
            <div className="space-y-2">
              {suggestedTasks.map((t, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-black/30 rounded-2xl border border-white/5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-white truncate">{t.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{t.timeSlot || 'Today'}</p>
                  </div>
                  <CheckCircle size={16} className="text-[#3B82F6] ml-3" />
                </div>
              ))}
            </div>
            <button 
              onClick={addToPlanner}
              className="w-full bg-[#3B82F6] text-white py-4 rounded-2xl font-bold text-[11px] transition-all shadow-xl active:scale-95 uppercase tracking-widest"
            >
              Save to Tasks
            </button>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Clean, standard chat bar positioned above nav */}
      <div className="fixed bottom-[80px] left-6 right-6 max-w-md mx-auto z-[120]">
        <div className="relative">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="How can I help you plan?"
            className="w-full bg-[#1C1C1E] border border-white/10 text-white placeholder:text-zinc-700 rounded-full px-6 py-4 text-[15px] focus:border-[#3B82F6] outline-none transition-all shadow-2xl"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 top-1.5 p-2.5 rounded-full transition-all ${
              input.trim() ? 'bg-[#3B82F6] text-white' : 'text-zinc-800'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
