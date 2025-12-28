
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { PlanMaker } from './components/PlanMaker';
import { Analytics } from './components/Analytics';
import { PlannerView } from './components/PlannerView';
import { Profile } from './components/Profile';
import { Auth } from './components/Auth';
import { Logo } from './components/Logo';
import { ViewType, Planner, Task, Priority } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setPlanners([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!session) {
        const saved = localStorage.getItem('motivator_planners');
        if (saved) setPlanners(JSON.parse(saved));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data } = await supabase
          .from('planners')
          .select('*')
          .eq('user_id', session.user.id);

        if (data && data.length > 0) {
          setPlanners(data);
        }
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  const savePlanners = useCallback(async (newPlanners: Planner[]) => {
    setPlanners(newPlanners);
    localStorage.setItem('motivator_planners', JSON.stringify(newPlanners));

    if (session) {
      setSyncing(true);
      const dataToSync = newPlanners.map(p => ({
        ...p,
        user_id: session.user.id
      }));

      await supabase.from('planners').upsert(dataToSync, { onConflict: 'id' });
      setTimeout(() => setSyncing(false), 800);
    }
  }, [session]);

  const addTask = (plannerId: string, task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'plannerId'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      plannerId,
      createdAt: Date.now(),
      completed: false
    };
    const updated = planners.map(p => p.id === plannerId ? { ...p, tasks: [...p.tasks, newTask] } : p);
    savePlanners(updated);
  };

  const toggleTask = (plannerId: string, taskId: string) => {
    const updated = planners.map(p => {
      if (p.id === plannerId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return p;
    });
    savePlanners(updated);
  };

  const deleteTask = (plannerId: string, taskId: string) => {
    const updated = planners.map(p => {
      if (p.id === plannerId) {
        return {
          ...p,
          tasks: p.tasks.filter(t => t.id !== taskId)
        };
      }
      return p;
    });
    savePlanners(updated);
  };

  const updateTaskPriority = (plannerId: string, taskId: string, priority: Priority) => {
    const updated = planners.map(p => {
      if (p.id === plannerId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, priority } : t)
        };
      }
      return p;
    });
    savePlanners(updated);
  };

  const deletePlanner = async (id: string) => {
    const updated = planners.filter(p => p.id !== id);
    setPlanners(updated);
    if (session) {
      await supabase.from('planners').delete().eq('id', id);
    }
  };

  const createPlanner = (name: string, icon: string, color: string) => {
    const newPlanner: Planner = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      icon,
      color,
      tasks: []
    };
    savePlanners([...planners, newPlanner]);
    return newPlanner.id;
  };

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <Logo size={80} className="mb-6 animate-pulse" />
      <div className="text-[#E5E5E5] font-bold text-[10px] tracking-[0.3em] uppercase opacity-30">Starting System</div>
    </div>
  );

  if (!session) return <Auth />;

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <Home planners={planners} onToggleTask={toggleTask} />;
      case 'plan-maker': return <PlanMaker planners={planners} onAddTasks={addTask} onAddPlanner={createPlanner} />;
      case 'analytics': return <Analytics planners={planners} />;
      case 'planner': return <PlannerView planners={planners} onToggleTask={toggleTask} onDeleteTask={deleteTask} onUpdatePriority={updateTaskPriority} onAddPlanner={createPlanner} onDeletePlanner={deletePlanner} />;
      case 'profile': return <Profile user={session.user} />;
      default: return <Home planners={planners} onToggleTask={toggleTask} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {syncing && (
        <div className="fixed top-12 right-6 z-[100] animate-in slide-in-from-right-4 fade-in">
          <div className="bg-[#1C1C1E] border border-white/5 px-3 py-1.5 rounded-lg flex items-center space-x-2 shadow-2xl">
            <div className="w-1 h-1 bg-[#3B82F6] rounded-full animate-ping" />
            <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">Saving</span>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
