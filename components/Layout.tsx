
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
    <div className="min-h-screen pb-[120px] max-w-md mx-auto relative bg-[#121212] overflow-x-hidden">
      {/* Neural Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-full h-[60vh] bg-[#C5A059]/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2 z-0" />
      
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-50" />

      <main className="min-h-screen px-6 pt-10 text-[#E5E5E5] relative z-10 flex flex-col">
        {children}
      </main>

      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};
