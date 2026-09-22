import { Shield, Lock, Radio, UserCheck, AlertTriangle, LogOut } from 'lucide-react';
import { sounds } from '../utils/audio';

export function ClubhouseHeader({
  currentMember,
  loggedMember,
  isSeabass = true,
  isEmma = false,
  isActingAsOther = false,
  onSwitchBackToSelf,
  activeTab,
  onTabChange,
  onLockVault,
  onOpenSoundboard,
  onOpenPass,
}) {
  const tabs = [
    { id: 'feed', label: 'Clubhouse Wall', emoji: '💬' },
    { id: 'hangouts', label: 'Hangouts', emoji: '🍕' },
    { id: 'roster', label: 'Squad Roster', emoji: '🧱' },
    { id: 'rules', label: 'Squad Rules', emoji: '📜' },
  ];

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
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar: Left = Branding, Right = All Action Buttons */}
        <div className="flex items-center justify-between py-3.5 gap-4">
          
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/20 text-xl border border-blue-400/30">
              🧱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight font-display">
                  BRICKERTON SQUAD
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Vault Secure
                </span>
                {isActingAsOther ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50 animate-pulse">
                    🎭 Acting As {currentMember.nickname}
                  </span>
                ) : isSeabass ? (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-700/50">
                    Admin (Full Control)
                  </span>
                ) : isEmma ? (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-700/50">
                    ⭐ Co-Admin (Chat & Rules)
                  </span>
                ) : (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                    Posting: Seabass & Emma Only
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Official Clubhouse • Private Vault
              </p>
            </div>
          </div>

          {/* Right: All Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Switch Back to Seabass when acting as another member */}
            {isActingAsOther && onSwitchBackToSelf && (
              <button
                type="button"
                id="header-switch-back-btn"
                onClick={() => {
                  sounds.playSnap();
                  onSwitchBackToSelf();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer"
                title="Return to Seabass (Admin) Persona"
              >
                <span>🧱</span>
                <span className="hidden sm:inline">Back to Seabass</span>
              </button>
            )}

            {/* Soundboard Button */}
            <button
              type="button"
              id="header-soundboard-btn"
              onClick={() => {
                sounds.playSnap();
                onOpenSoundboard();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-amber-400 border border-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title="Clubhouse Soundboard"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Soundboard</span>
            </button>

            {/* Member Credential / Pass */}
            <button
              type="button"
              id="header-squad-pass-btn"
              onClick={() => {
                sounds.playSnap();
                onOpenPass();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title={`View ${currentMember.nickname}'s Squad Pass`}
            >
              <span className="text-sm">{currentMember.avatarEmoji}</span>
              <span className="hidden sm:inline font-bold">{currentMember.nickname}</span>
              <span className="hidden lg:inline text-[10px] text-blue-400 font-normal">Pass</span>
            </button>

            {/* Lock Vault / Sign Out */}
            <button
              type="button"
              id="lock-vault-btn"
              onClick={() => {
                sounds.playSnap();
                onLockVault();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-red-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="Lock Vault & Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sign Out / Lock</span>
            </button>

            {/* Panic Button */}
            <a
              href="https://www.google.com"
              target="_top"
              rel="noopener noreferrer"
              id="header-panic-button"
              onClick={handlePanic}
              title="Panic Exit: Instantly reload to Google.com"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-red-950/40 border border-red-400 transition-all cursor-pointer hover:scale-105"
            >
              <AlertTriangle className="w-3.5 h-3.5 fill-white text-red-600 shrink-0" />
              <span>Panic</span>
            </a>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`nav-tab-${tab.id}`}
                onClick={() => {
                  sounds.playSnap();
                  onTabChange(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
