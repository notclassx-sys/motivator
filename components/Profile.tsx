
import React from 'react';
import { User, Power, ShieldCheck, Activity, Sparkles } from 'lucide-react';
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

      <div className="space-y-3 px-1">
        <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] px-4 mb-3">System Parameters</h3>
        
        {[
          { icon: ShieldCheck, label: 'Identity Protection', sub: 'Biometric Secure' },
          { icon: Sparkles, label: 'Intelligence Level', sub: 'Gemini 3 Flash' },
          { icon: Activity, label: 'Operational Health', sub: 'Optimal Performance' },
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
        <p className="text-[8px] text-[#A1A1AA] font-black uppercase tracking-[1em]">Nexus v4.5 Build-8</p>
      </div>
    </div>
  );
};
