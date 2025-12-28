
import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, resetPasswordForEmail } from '../supabase';
import { Mail, Lock, LogIn, UserPlus, HelpCircle, ChevronLeft, Sparkles, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';

type AuthView = 'login' | 'signup' | 'forgot';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      let result;
      if (view === 'login') {
        result = await signInWithEmail(email, password);
      } else if (view === 'signup') {
        result = await signUpWithEmail(email, password);
        if (!result.error) {
          setMessage({ type: 'success', text: 'Account Created! You can now log in.' });
        }
      } else if (view === 'forgot') {
        result = await resetPasswordForEmail(email);
        if (!result.error) {
          setMessage({ type: 'success', text: 'Recovery link sent to your email.' });
        }
      }

      if (result?.error) {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let errorMsg = error.message || 'Access Denied';
      if (errorMsg.toLowerCase().includes("api key")) {
        errorMsg = "System Error: Authentication service unavailable.";
      } else if (errorMsg.toLowerCase().includes("invalid login")) {
        errorMsg = "Login Failed: Please check your email and password.";
      }
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-8 py-10 text-[#E5E5E5] font-sans relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-10%] w-full h-[40vh] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-full h-[40vh] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col items-center mb-10 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <Logo size={120} className="mb-6" />
        <div className="flex items-center space-x-2">
          <Sparkles size={14} className="text-[#C5A059]" />
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">Rule Your Life</p>
          <Sparkles size={14} className="text-[#C5A059]" />
        </div>
      </div>

      <div className="w-full max-w-sm z-10 space-y-6">
        {message && (
          <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border animate-in slide-in-from-top-2 duration-300 flex items-center justify-center space-x-3 ${message.type === 'success' ? 'bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/20' : 'bg-rose-900/10 text-rose-400 border-rose-900/20'}`}>
            {message.type === 'error' && <AlertCircle size={14} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-[#3B82F6] transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              className="w-full bg-[#2C2C2E]/60 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold placeholder:text-[#A1A1AA]/40 focus:outline-none focus:border-[#3B82F6]/40 focus:bg-[#2C2C2E] transition-all tracking-wider"
              required
            />
          </div>

          {view !== 'forgot' && (
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-[#3B82F6] transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-[#2C2C2E]/60 border border-white/5 rounded-2xl pl-14 pr-12 py-5 text-sm font-bold placeholder:text-[#A1A1AA]/40 focus:outline-none focus:border-[#3B82F6]/40 focus:bg-[#2C2C2E] transition-all tracking-wider"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#3B82F6] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {view === 'login' && (
            <div className="flex justify-between items-center px-2">
              <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center space-x-2 group cursor-pointer"
              >
                <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-white/20'}`}>
                  {rememberMe && <LogIn size={8} className="text-white" />}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${rememberMe ? 'text-[#3B82F6]' : 'text-[#A1A1AA]/50'}`}>Remember Me</span>
              </button>
              <button 
                type="button" 
                onClick={() => setView('forgot')}
                className="text-[8px] font-black text-[#A1A1AA]/50 hover:text-[#60A5FA] transition-colors uppercase tracking-widest"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B82F6] text-white py-5 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-[0_15px_30px_rgba(59,130,246,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {view === 'login' && <LogIn size={18} strokeWidth={3} />}
                {view === 'signup' && <UserPlus size={18} strokeWidth={3} />}
                {view === 'forgot' && <HelpCircle size={18} strokeWidth={3} />}
                <span>{view === 'login' ? 'Login' : view === 'signup' ? 'Sign Up' : 'Reset'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          {view === 'login' ? (
            <button onClick={() => setView('signup')} className="text-[#E5E5E5] text-[11px] font-black uppercase tracking-widest hover:text-[#3B82F6] transition-colors">
              Need an account? <span className="text-[#3B82F6] underline underline-offset-4 decoration-2">Sign Up</span>
            </button>
          ) : (
            <button onClick={() => setView('login')} className="flex items-center justify-center mx-auto text-[#A1A1AA] text-[11px] font-black hover:text-[#3B82F6] uppercase tracking-widest transition-colors">
              <ChevronLeft size={16} className="mr-1" /> Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
