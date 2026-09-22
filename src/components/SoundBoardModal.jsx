import { X, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export function SoundBoardModal({ onClose }) {
  const soundTriggers = [
    {
      name: 'Squad Horn',
      emoji: '📯',
      desc: 'Summon all Brickerton members',
      action: () => sounds.playHorn(),
      color: 'hover:bg-amber-600/20 hover:border-amber-500',
    },
    {
      name: 'Victory Fanfare',
      emoji: '🎺',
      desc: 'Celebrate squad victories',
      action: () => {
        sounds.playFanfare();
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
      },
      color: 'hover:bg-blue-600/20 hover:border-blue-500',
    },
    {
      name: 'Secret Vault Chime',
      emoji: '🔓',
      desc: 'Official vault unlock chime',
      action: () => sounds.playUnlock(),
      color: 'hover:bg-emerald-600/20 hover:border-emerald-500',
    },
    {
      name: 'Intruder Alert',
      emoji: '🚨',
      desc: 'Sound for unauthorized outsiders',
      action: () => sounds.playDenied(),
      color: 'hover:bg-red-600/20 hover:border-red-500',
    },
    {
      name: 'Laser Zap',
      emoji: '⚡',
      desc: 'High-tech squad energy zap',
      action: () => sounds.playLaser(),
      color: 'hover:bg-purple-600/20 hover:border-purple-500',
    },
    {
      name: 'Council Gong',
      emoji: '🔔',
      desc: 'Bring the squad meeting to order',
      action: () => sounds.playGong(),
      color: 'hover:bg-indigo-600/20 hover:border-indigo-500',
    },
    {
      name: 'Snap / Clack',
      emoji: '🧱',
      desc: 'The sound of bricks locking together',
      action: () => sounds.playSnap(),
      color: 'hover:bg-slate-700 hover:border-slate-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            sounds.playSnap();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white font-display">
            Clubhouse Soundboard
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time audio cues for Brickerton Squad meetings
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {soundTriggers.map((snd) => (
            <button
              key={snd.name}
              type="button"
              onClick={() => snd.action()}
              className={`p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left transition-all active:scale-95 cursor-pointer ${snd.color}`}
            >
              <div className="text-2xl mb-1">{snd.emoji}</div>
              <div className="text-xs font-bold text-white leading-tight">{snd.name}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{snd.desc}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              sounds.playSnap();
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Soundboard
          </button>
        </div>

      </div>
    </div>
  );
}
