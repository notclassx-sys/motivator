
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Flame, TrendingUp, Terminal, Award } from 'lucide-react';
import { Planner } from '../types';
import { analyzeProductivity } from '../geminiService';
import { Logo } from './Logo';

interface AnalyticsProps { planners: Planner[]; }

export const Analytics: React.FC<AnalyticsProps> = ({ planners }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const stats = useMemo(() => {
    const total = planners.reduce((acc, p) => acc + p.tasks.length, 0);
    const completed = planners.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);
    const ratio = total > 0 ? (completed / total) * 100 : 0;
    
    const data = [
      { name: 'M', value: 40 }, { name: 'T', value: 65 }, { name: 'W', value: 50 },
      { name: 'T', value: 85 }, { name: 'F', value: 70 }, { name: 'S', value: 90 }, { name: 'S', value: 60 },
    ];
    return { total, completed, ratio, data };
  }, [planners]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const res = await analyzeProductivity(stats.completed, stats.total);
      setAdvice(res);
      setLoadingAdvice(false);
    };
    fetchAdvice();
  }, [stats.completed, stats.total]);

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h1 className="text-3xl font-black text-[#E5E5E5] tracking-tighter uppercase italic">Stats</h1>
        <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[0.4em] mt-1">Operational Performance</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: 'RATIO', value: `${Math.round(stats.ratio)}%`, color: '#3B82F6' },
          { icon: Flame, label: 'STREAK', value: '12D', color: '#C5A059' },
          { icon: Award, label: 'GRADE', value: 'S+', color: '#3B82F6' },
        ].map((item, i) => (
          <div key={i} className="bg-[#1C1C1E] p-5 rounded-3xl border border-white/5 flex flex-col items-center shadow-sm">
            <div className="p-2.5 bg-[#121212] rounded-xl mb-3 border border-white/5" style={{ color: item.color }}>
              <item.icon size={18} />
            </div>
            <span className="text-xl font-black text-[#E5E5E5] tracking-tighter">{item.value}</span>
            <span className="text-[8px] text-[#A1A1AA] font-black uppercase tracking-[0.2em] mt-1">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Chart - Removed extra padding below */}
      <div className="bg-[#1C1C1E] px-8 pt-8 pb-4 rounded-[2.5rem] border border-white/5 shadow-xl mb-2">
        <h3 className="text-[10px] font-black text-[#E5E5E5] mb-8 uppercase tracking-[0.3em] flex items-center">
          <TrendingUp size={14} className="mr-3 text-[#3B82F6]" /> Activity Velocity
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#A1A1AA', fontWeight: 'bold' }} 
                dy={12}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#121212', radius: [6, 6, 6, 6] }}
                contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '16px', border: '1px solid #2C2C2E', fontSize: '10px', fontWeight: 'black', color: '#E5E5E5' }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 4, 4]} 
                barSize={12}
              >
                {stats.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 70 ? '#3B82F6' : '#2C2C2E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advice Card */}
      <div className="bg-[#2C2C2E] p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
        <div className="absolute top-[-5%] right-[-5%] opacity-10 rotate-12 pointer-events-none">
           <Logo size={140} />
        </div>
        <div className="relative z-10">
          <h3 className="text-[10px] font-black text-[#60A5FA] mb-6 flex items-center uppercase tracking-[0.4em]">
            <Terminal size={18} className="mr-3" /> Core Analysis
          </h3>
          {loadingAdvice ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-2.5 bg-white/5 rounded-full w-full" />
              <div className="h-2.5 bg-white/5 rounded-full w-5/6" />
            </div>
          ) : (
            <div className="text-xs text-[#E5E5E5] leading-relaxed font-bold italic prose prose-invert">
              {advice.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
