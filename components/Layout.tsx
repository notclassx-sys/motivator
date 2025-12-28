
import React from 'react';
import { BottomNav } from './BottomNav';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-[#0A0A0B] overflow-x-hidden selection:bg-[#3B82F6]/30">
      {/* Dynamic Background Architecture */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-[#3B82F6]/10 to-transparent blur-[100px] pointer-events-none z-0 neural-glow" />
      <div className="fixed bottom-0 right-0 w-full h-[40vh] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />
      
      {/* Fine Mesh Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay z-[60]" />

      <main className="relative z-10 px-5 pt-12 pb-32 text-[#E5E5E5] animate-in fade-in duration-500">
        {children}
      </main>

      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};
