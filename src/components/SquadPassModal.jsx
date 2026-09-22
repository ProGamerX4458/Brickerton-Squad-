import { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export function SquadPassModal({ member, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    sounds.playSnap();
    navigator.clipboard.writeText(`BRICKERTON SQUAD VERIFIED MEMBER: ${member.nickname} (${member.joinedDate}) | CLEARANCE: AUTHORIZED`);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.5 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

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

        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Official Credential
          </span>
          <h3 className="text-lg font-black text-white font-display">
            Brickerton Squad Membership Pass
          </h3>
        </div>

        {/* Digital ID Card Display */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden text-white">
          
          {/* Hologram shine effect */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Pass Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧱</span>
              <div>
                <div className="font-extrabold text-sm tracking-tight font-display text-white">
                  BRICKERTON SQUAD
                </div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400">
                  Global Friends Network
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-bold uppercase">
                Active Pass
              </span>
            </div>
          </div>

          {/* Member Details */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${member.avatarBg} flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0`}>
              {member.avatarEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-black tracking-tight text-white truncate flex items-center gap-2">
                <span>{member.nickname}</span>
                {(member.isFounder || member.role.toLowerCase().includes('founder') || member.nickname.toLowerCase() === 'emma') && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    👑 Founder
                  </span>
                )}
                {(member.isCoAdmin || member.role.toLowerCase().includes('co-admin') || (member.nickname.toLowerCase() === 'emma' && !member.role.toLowerCase().includes('admin (full'))) && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                    ⭐ Co-Admin
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 truncate">{member.name} • {member.joinedDate}</div>
              <div className={`text-xs font-semibold truncate mt-0.5 ${
                member.role.toLowerCase().includes('founder') || member.isFounder
                  ? 'text-amber-400 font-bold'
                  : member.isCoAdmin || member.role.toLowerCase().includes('co-admin')
                  ? 'text-pink-400 font-bold'
                  : 'text-blue-400'
              }`}>
                {member.role}
              </div>
            </div>
          </div>

          {/* Meta rows */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Pass ID</span>
              <span className="font-mono font-bold text-slate-200">#BRK-{member.id.toUpperCase().slice(-5)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Issued</span>
              <span className="font-medium text-slate-200">{member.joinedDate}</span>
            </div>
            {(member.isFounder || member.role.toLowerCase().includes('founder') || member.nickname.toLowerCase() === 'emma') && (
              <div className="col-span-2 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-amber-400 block text-[10px] uppercase tracking-wider font-bold">Squad Distinction</span>
                <span className="font-mono font-bold text-amber-300 text-[10px]">
                  {member.isCoAdmin || member.role.toLowerCase().includes('co-admin')
                    ? '👑 SQUAD FOUNDER & CO-ADMIN'
                    : '👑 SQUAD FOUNDER [FOUNDING MEMBER]'}
                </span>
              </div>
            )}
            <div className="col-span-2 pt-1 border-t border-slate-800/60">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Vault Verification</span>
              <span className="font-mono font-bold text-amber-300">CLEARANCE: LEVEL 5 [VERIFIED]</span>
            </div>
          </div>

          {/* Security barcode / hash */}
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>SIG: 948A-AUTH-BRK-SQUAD</span>
            <span>LEVEL 5 CLEARANCE</span>
          </div>

        </div>

        {/* Action button */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            id="copy-squad-pass-btn"
            onClick={handleCopyCode}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Pass Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Member Verification Badge</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
