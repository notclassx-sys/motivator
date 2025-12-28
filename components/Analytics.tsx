import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Flame, TrendingUp, Star, Award } from 'lucide-react';
import { Planner } from '../types';

interface AnalyticsProps { planners: Planner[]; }

export const Analytics: React.FC<AnalyticsProps> = ({ planners }) => {
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

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Progress</h1>
        <p className="text-zinc-400 text-sm mt-1">See how much you've done this week!</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: 'Success', value: `${Math.round(stats.ratio)}%`, color: '#3B82F6' },
          { icon: Flame, label: 'Days', value: '12', color: '#F97316' },
          { icon: Award, label: 'Level', value: 'Gold', color: '#EAB308' },
        ].map((item, i) => (
          <div key={i} className="bg-[#1C1C1E] p-4 rounded-3xl border border-white/5 flex flex-col items-center">
            <div className="p-2 rounded-xl mb-2" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              <item.icon size={18} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">{item.value}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#1C1C1E] p-8 rounded-[2rem] border border-white/5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-6 flex items-center">
          <TrendingUp size={16} className="mr-2 text-blue-500" /> Weekly Activity
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#71717A', fontWeight: 'bold' }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#ffffff05', radius: [6, 6, 0, 0] }}
                contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: '1px solid #2C2C2E', fontSize: '12px', color: '#fff' }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]} 
                barSize={16}
              >
                {stats.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 70 ? '#3B82F6' : '#2C2C2E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-3 text-blue-400">
          <Star size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">Expert Tip</h3>
        </div>
        <p className="text-xs text-blue-100/70 leading-relaxed font-medium">
          Focus on one thing at a time. Doing less but doing it better is the secret to getting more done.
        </p>
      </div>
    </div>
  );
};