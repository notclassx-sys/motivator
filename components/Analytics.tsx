import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Flame, TrendingUp, Star, Award } from 'lucide-react';
import { Planner } from '../types';

interface AnalyticsProps { planners: Planner[]; }

export const Analytics: React.FC<AnalyticsProps> = ({ planners }) => {
  const stats = useMemo(() => {
    const allTasks = planners.flatMap(p => p.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.completed).length;
    const ratio = total > 0 ? (completed / total) * 100 : 0;

    // Calculate Weekly Activity (Last 7 Days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: d.toDateString(),
        label: days[d.getDay()],
        count: 0
      };
    });

    allTasks.forEach(task => {
      const taskDate = new Date(task.createdAt).toDateString();
      const dayIndex = last7Days.findIndex(d => d.dateStr === taskDate);
      if (dayIndex !== -1) {
        last7Days[dayIndex].count += 1;
      }
    });

    const chartData = last7Days.map(d => ({ name: d.label, value: d.count }));

    // Calculate Streak (Consecutive days with at least one completed task)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const checkDateStr = checkDate.toDateString();
      
      const hasCompletedOnDay = allTasks.some(t => 
        t.completed && new Date(t.createdAt).toDateString() === checkDateStr
      );

      if (hasCompletedOnDay) {
        streak++;
      } else {
        // If it's today and nothing is done yet, don't break the streak immediately if yesterday was active
        if (i === 0) continue; 
        break;
      }
    }

    // Determine Level
    let level = 'Bronze';
    let levelColor = '#CD7F32';
    if (completed >= 100) { level = 'Diamond'; levelColor = '#B9F2FF'; }
    else if (completed >= 50) { level = 'Gold'; levelColor = '#EAB308'; }
    else if (completed >= 10) { level = 'Silver'; levelColor = '#C0C0C0'; }

    return { total, completed, ratio, chartData, streak, level, levelColor };
  }, [planners]);

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight uppercase italic font-black">Performance</h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Mission Data</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: 'Success', value: `${Math.round(stats.ratio)}%`, color: '#3B82F6' },
          { icon: Flame, label: 'Streak', value: stats.streak.toString(), color: '#F97316' },
          { icon: Award, label: 'Rank', value: stats.level, color: stats.levelColor },
        ].map((item, i) => (
          <div key={i} className="bg-[#1C1C1E] p-4 rounded-3xl border border-white/5 flex flex-col items-center shadow-lg">
            <div className="p-2 rounded-xl mb-2" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              <item.icon size={18} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">{item.value}</span>
            <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#1C1C1E] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <TrendingUp size={120} />
        </div>
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8 flex items-center">
          <TrendingUp size={14} className="mr-2 text-blue-500" /> Task Volume (7D)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
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
                barSize={24}
              >
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#3B82F6' : '#2C2C2E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1C1C1E] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Star size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Total Completed</h4>
            <p className="text-2xl font-black text-white">{stats.completed}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Efficiency</p>
          <p className="text-lg font-black text-blue-500">{stats.completed > 0 ? 'High' : 'N/A'}</p>
        </div>
      </div>

      <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-3 text-blue-400">
          <Star size={18} />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Strategic Insight</h3>
        </div>
        <p className="text-xs text-blue-100/70 leading-relaxed font-medium italic">
          "{stats.completed < 5 ? "Start small. Completing just one task today fuels your momentum for tomorrow." : "You're building real consistency. Keep this pace to reach Diamond rank."}"
        </p>
      </div>
    </div>
  );
};