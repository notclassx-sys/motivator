
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
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    // Check if key selection is required
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();

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
        const { data, error } = await supabase
          .from('planners')
          .select('*')
          .eq('user_id', session.user.id);

        if (data && data.length > 0) {
          setPlanners(data);
        } else {
          setPlanners([]);
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

      const { error } = await supabase
        .from('planners')
        .upsert(dataToSync, { onConflict: 'id' });
      
      if (error) console.error('Sync error:', error);
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
    localStorage.setItem('motivator_planners', JSON.stringify(updated));

    if (session) {
      setSyncing(true);
      const { error } = await supabase
        .from('planners')
        .delete()
        .eq('id', id);
      if (error) console.error('Deletion error:', error);
      setTimeout(() => setSyncing(false), 800);
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
    const updated = [...planners, newPlanner];
    savePlanners(updated);
    return newPlanner.id;
  };

  const handleOpenKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <Logo size={100} className="mb-6" />
      <div className="text-[#E5E5E5] font-bold text-xs animate-pulse tracking-widest uppercase">Loading...</div>
    </div>
  );

  if (!hasKey) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B] px-8 text-center">
        <Logo size={80} className="mb-8" />
        <h2 className="text-xl font-bold mb-4">API Access Required</h2>
        <p className="text-sm text-zinc-500 mb-8">Please select an API key to enable AI features.</p>
        <button 
          onClick={handleOpenKey}
          className="bg-[#3B82F6] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest"
        >
          Select API Key
        </button>
      </div>
    );
  }

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
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-2 fade-in">
          <div className="bg-[#1C1C1E] border border-white/5 px-4 py-2 rounded-xl flex items-center space-x-2 shadow-2xl">
            <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-ping" />
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Saving</span>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
