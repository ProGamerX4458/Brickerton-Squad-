import { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff, AlertTriangle, KeyRound, CheckCircle2, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export function PasswordGate({ onUnlock, targetPassword, members = [] }) {
  const [memberName, setMemberName] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedMember, setUnlockedMember] = useState(null);

  // Helper to match input against squad roster
  const findMember = (query) => {
    if (!query || !members.length) return null;
    const clean = query.trim().toLowerCase();
    const cleanNoSpace = clean.replace(/[\s\-_]/g, '');

    return members.find((m) => {
      const nick = (m.nickname || '').toLowerCase();
      const name = (m.name || '').toLowerCase();
      const nickNoSpace = nick.replace(/[\s\-_]/g, '');
      const nameNoSpace = name.replace(/[\s\-_]/g, '');

      return (
        nick === clean ||
        name === clean ||
        nickNoSpace === cleanNoSpace ||
        nameNoSpace === cleanNoSpace
      );
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitting || isUnlocked) return;

    sounds.playSnap();
    setIsSubmitting(true);
    setError(false);

    // 1. Verify Name
    const trimmedName = memberName.trim();
    if (!trimmedName) {
      sounds.playDenied();
      setError(true);
      setErrorMessage('Please enter your name to sign in.');
      setIsSubmitting(false);
      return;
    }

    const matched = findMember(trimmedName);
    if (!matched) {
      sounds.playDenied();
      setError(true);
      setErrorMessage(`"${trimmedName}" was not found. Please check your spelling.`);
      setIsSubmitting(false);
      return;
    }

    // 2. Verify Vault Password
    if (inputPass.trim() !== targetPassword) {
      sounds.playDenied();
      setError(true);
      setErrorMessage(inputPass.trim() === ''
        ? 'Please enter the clubhouse vault password.'
        : 'Access Denied: Incorrect squad password.');
      setIsSubmitting(false);
      return;
    }

    // 3. Authenticated Successfully
    sounds.playUnlock();
    setIsUnlocked(true);
    setUnlockedMember(matched);

    // Fire squad confetti
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#ffffff'],
    });

    setTimeout(() => {
      onUnlock(matched.id);
    }, 750);
  };

  const handlePanic = (e) => {
    if (e) e.preventDefault();
    try {
      if (window.top && window.top !== window) {
        window.top.location.replace('https://www.google.com');
        return;
      }
    } catch {
      // Top frame navigation blocked by sandbox
    }
    try {
      window.location.replace('https://www.google.com');
    } catch {
      window.location.href = 'https://www.google.com';
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Top Right Panic Button */}
      <div className="absolute top-4 right-4 z-30">
        <a
          href="https://www.google.com"
          target="_top"
          rel="noopener noreferrer"
          id="gate-panic-button"
          onClick={handlePanic}
          title="Panic Exit: Instantly reload to Google.com"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-red-950/40 border border-red-400 transition-all cursor-pointer hover:scale-105"
        >
          <AlertTriangle className="w-3.5 h-3.5 fill-white text-red-600 shrink-0" />
          <span>Panic</span>
        </a>
      </div>

      {/* Background Decorative Brick Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(#60a5fa 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
      }} />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Clubhouse Vault Container */}
        <div className={`bg-slate-900/90 backdrop-blur-xl border-2 rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 ${
          error 
            ? 'border-red-500 shadow-red-500/20 animate-shake' 
            : isUnlocked 
              ? 'border-emerald-500 shadow-emerald-500/30 scale-[1.02]' 
              : 'border-slate-700/80 shadow-black/50'
        }`}>
          
          {/* Clubhouse Header & Crest */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center relative mb-3">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                isUnlocked ? 'bg-emerald-500/20 text-emerald-400 scale-110' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30'
              }`}>
                {isUnlocked ? (
                  <Unlock className="w-10 h-10 animate-pulse text-emerald-400" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black tracking-tighter">🧱</span>
                    <Lock className="w-5 h-5 -mt-1 text-amber-300" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold tracking-widest uppercase text-amber-400 shadow">
                Est. 2025
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              BRICKERTON SQUAD
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Private Friends Club & Vault
            </p>

            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Sign In Required</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Name */}
            <div>
              <label htmlFor="squad-member-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Name
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                
                <input
                  id="squad-member-name-input"
                  type="text"
                  value={memberName}
                  onChange={(e) => {
                    setMemberName(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter your name..."
                  autoComplete="username"
                  autoFocus
                  disabled={isUnlocked}
                  className={`w-full pl-10 pr-3 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none transition-all ${
                    error && !findMember(memberName.trim())
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/40 bg-red-950/20' 
                      : isUnlocked 
                        ? 'border-emerald-500 bg-emerald-950/20' 
                        : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                  }`}
                />
              </div>
            </div>

            {/* Field 2: Vault Password */}
            <div>
              <label htmlFor="squad-pass-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Clubhouse Password
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                </div>
                
                <input
                  id="squad-pass-input"
                  type={showPassword ? 'text' : 'password'}
                  value={inputPass}
                  onChange={(e) => {
                    setInputPass(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter Squad Password..."
                  autoComplete="current-password"
                  disabled={isUnlocked}
                  className={`w-full pl-10 pr-11 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 font-mono text-base focus:outline-none transition-all ${
                    error && inputPass.trim() !== targetPassword
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/40 bg-red-950/20' 
                      : isUnlocked 
                        ? 'border-emerald-500 bg-emerald-950/20' 
                        : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                  }`}
                />

                <button
                  type="button"
                  id="toggle-pass-visibility-btn"
                  onClick={() => {
                    sounds.playSnap();
                    setShowPassword(!showPassword);
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 mt-2 text-xs text-red-400 animate-fadeIn bg-red-950/30 p-2.5 rounded-lg border border-red-800/40">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isUnlocked && unlockedMember && (
                <div className="flex items-center gap-2 mt-3 text-xs text-emerald-400 font-semibold animate-fadeIn bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/50">
                  <span className="text-base">{unlockedMember.avatarEmoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Welcome back, {unlockedMember.nickname}!</span>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-normal">
                      Signing in as {unlockedMember.role}...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="unlock-clubhouse-btn"
              disabled={isSubmitting || isUnlocked}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                isUnlocked
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4 animate-bounce" />
                  <span>ENTERING CLUBHOUSE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{memberName.trim() ? `SIGN IN AS ${memberName.trim().toUpperCase()}` : 'SIGN IN'}</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>Brickerton Squad • Friends Only • Strictly Confidential</p>
        </div>
      </div>
    </div>
  );
}
