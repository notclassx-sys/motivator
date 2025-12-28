
import React from 'react';
import { User, Shield, Power, Cpu, Sparkles, Activity, Target, ShieldCheck } from 'lucide-react';
import { signOut } from '../supabase';

interface ProfileProps { user?: any; }

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const handleSignOut = async () => {
    if (confirm('LOG OUT OF YOUR SESSION?')) {
      await signOut();
    }
  };

  const userEmail = user?.email || 'User';
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0].toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail}`;

  return (
    <div className="space-y-10 pb-16">
      <header className="flex flex-col items-center py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#3B82F6]/5 blur-3xl rounded-full pointer-events-none" />
        <div className="relative group">
          <div className="w-32 h-32 rounded-full p-1.5 border-2 border-[#3B82F6]/20 group-hover:border-[#3B82F6] transition-all duration-700 shadow-xl overflow-hidden bg-[#1C1C1E]">
            <img 
              src={avatarUrl} 
              className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover"
              alt="Profile"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#3B82F6] text-white p-2.5 rounded-xl border-4 border-[#121212] shadow-lg">
            <User size={14} strokeWidth={3} />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-black text-[#E5E5E5] tracking-tighter uppercase italic">{userName}</h2>
        <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-[0.4em] mt-3">{userEmail}</p>
      </header>

      {/* STATS OVERVIEW */}
      <div className="px-4">
        <div className="bg-[#1C1C1E] border border-white/5 rounded-[2.5rem] p-8 flex justify-around">
           <div className="text-center">
             <div className="text-[8px] font-black text-[#A1A1AA] uppercase tracking-widest mb-1">Rank</div>
             <div className="text-xl font-black text-[#C5A059]">TITAN</div>
           </div>
           <div className="w-[1px] bg-white/5" />
           <div className="text-center">
             <div className="text-[8px] font-black text-[#A1A1AA] uppercase tracking-widest mb-1">Status</div>
             <div className="text-xl font-black text-[#3B82F6]">PRIME</div>
           </div>
           <div className="w-[1px] bg-white/5" />
           <div className="text-center">
             <div className="text-[8px] font-black text-[#A1A1AA] uppercase tracking-widest mb-1">Level</div>
             <div className="text-xl font-black text-white">42</div>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] px-4 mb-3">Core Parameters</h3>
        
        {[
          { icon: ShieldCheck, label: 'Identity Protection', sub: 'Biometric Secure' },
          { icon: Cpu, label: 'Neural Processing', sub: 'v4.5 High-Speed' },
          { icon: Activity, label: 'System Health', sub: '100% Operational' },
        ].map((item, i) => (
          <div 
            key={i}
            className="w-full flex items-center justify-between p-6 bg-[#1C1C1E] rounded-2xl border border-white/5"
          >
            <div className="flex items-center text-left">
              <div className="p-3 bg-[#121212] rounded-xl mr-5 text-[#A1A1AA] border border-white/5">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-[#E5E5E5] uppercase tracking-widest">{item.label}</p>
                <p className="text-[9px] text-[#A1A1AA]/50 font-bold uppercase tracking-tighter mt-1">{item.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSignOut}
        className="w-full py-6 px-10 flex items-center justify-center text-rose-500 font-black text-[10px] bg-rose-500/5 rounded-[1.5rem] border border-rose-500/10 active:scale-[0.98] transition-all uppercase tracking-[0.4em] shadow-sm hover:bg-rose-500/10"
      >
        <Power size={18} className="mr-3" strokeWidth={3} /> Log Out
      </button>

      <div className="text-center py-10 opacity-10">
        <p className="text-[8px] text-[#A1A1AA] font-black uppercase tracking-[1em]">Nexus Architecture v4.5</p>
      </div>
    </div>
  );
};
