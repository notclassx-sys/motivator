
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Trash2, CheckCircle } from 'lucide-react';
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
    return saved ? JSON.parse(saved) : [{ role: 'model', text: "Hi! How can I help you plan your day today?" }];
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
      setMessages(prev => [...prev, { role: 'model', text: result.reply || "I've updated your suggestions." }]);
      if (result.suggestedTasks && result.suggestedTasks.length > 0) {
        setSuggestedTasks(result.suggestedTasks);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I had a connection error. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToPlanner = () => {
    let targetId = selectedPlannerId;
    if (!targetId && planners.length === 0) {
      targetId = onAddPlanner('My Tasks', '📅', '#3B82F6');
    } else if (!targetId && planners.length > 0) {
      targetId = planners[0].id;
    }
    suggestedTasks.forEach(task => onAddTasks(targetId, task));
    setSuggestedTasks([]);
    setMessages(prev => [...prev, { role: 'model', text: "Tasks saved to your plan!" }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <header className="flex justify-between items-center mb-6 px-1">
        <div>
          <h1 className="text-2xl font-black text-[#E5E5E5] flex items-center">
            <Bot size={22} className="mr-3 text-[#3B82F6]" /> AI Helper
          </h1>
          <p className="text-[9px] text-[#A1A1AA] font-bold uppercase tracking-widest mt-1 ml-9">Ask me anything</p>
        </div>
        <button 
          onClick={() => { if(confirm('Clear chat history?')) { setMessages([{ role: 'model', text: "Chat cleared." }]); setSuggestedTasks([]); localStorage.removeItem('motivator_chat_history'); }}}
          className="p-3 glass rounded-xl text-zinc-600 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-40 px-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] font-medium leading-relaxed shadow-lg ${
              m.role === 'user' 
                ? 'bg-[#3B82F6] text-white rounded-tr-none' 
                : 'bg-[#1C1C1E] text-[#E5E5E5] border border-white/5 rounded-tl-none'
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
          <div className="bg-[#1C1C1E] rounded-2xl p-5 shadow-2xl space-y-4 border border-[#3B82F6]/20">
            <h4 className="text-[10px] font-black text-[#E5E5E5] uppercase tracking-widest">New Suggestions</h4>
            <div className="space-y-2">
              {suggestedTasks.map((t, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl">
                  <div>
                    <p className="text-[11px] font-bold text-white">{t.title}</p>
                    <p className="text-[9px] text-[#A1A1AA]">{t.timeSlot || 'Today'}</p>
                  </div>
                  <CheckCircle size={14} className="text-[#3B82F6]" />
                </div>
              ))}
            </div>
            <button 
              onClick={addToPlanner}
              className="w-full bg-[#3B82F6] text-white py-3.5 rounded-xl font-bold text-[11px] transition-all shadow-lg"
            >
              Add to My Plan
            </button>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Normal chat bar, visible above the menu */}
      <div className="fixed bottom-[75px] left-5 right-5 max-w-md mx-auto z-[120]">
        <div className="relative shadow-2xl">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type here..."
            className="w-full bg-[#1C1C1E] border border-white/10 text-white placeholder:text-zinc-600 rounded-2xl pl-5 pr-14 py-4 text-[13px] focus:border-[#3B82F6] outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 top-1.5 p-2.5 rounded-xl transition-all ${
              input.trim() ? 'bg-[#3B82F6] text-white' : 'text-zinc-700'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
