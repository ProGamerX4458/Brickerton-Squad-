import { useState } from 'react';
import { Plus, Lock, Trash2, ShieldOff } from 'lucide-react';
import { sounds } from '../utils/audio';

export function SquadRulesView({
  rules = [],
  currentMember,
  isSeabass = true,
  isEmma = false,
  canAddRules = true,
  onAddRule,
  onDeleteRule,
  onClearAllRules,
}) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!canAddRules) return;
    if (!title.trim() || !description.trim()) return;

    sounds.playFanfare();
    onAddRule({
      number: rules.length + 1,
      title: title.trim(),
      description: description.trim(),
    });

    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2 font-display">
              <span>📜</span>
              <span>THE BRICKERTON CONSTITUTION</span>
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {rules.length} {rules.length === 1 ? 'Rule' : 'Rules'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Codified rules, sacred vows, and squad bylaws passed by unanimous council.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSeabass && rules.length > 0 && onClearAllRules && (
            <button
              type="button"
              id="clear-all-rules-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all rules from the squad?')) {
                  sounds.playPop();
                  onClearAllRules();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          {canAddRules ? (
            <button
              type="button"
              id="propose-rule-btn"
              onClick={() => {
                sounds.playSnap();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Propose Squad Rule</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Adding Rules: Seabass & Emma Only</span>
            </div>
          )}
        </div>
      </div>

      {/* Rules List or Empty State */}
      {rules.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-10 text-center shadow-lg">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldOff className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white mb-1">
            No Rules in Effect
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            All clubhouse rules have been abolished. The Brickerton Squad is currently running with zero restrictions and total freedom.
          </p>
          {canAddRules ? (
            <button
              type="button"
              onClick={() => {
                sounds.playSnap();
                setShowModal(true);
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs shadow transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Establish New Rule ({isSeabass ? 'Admin' : 'Co-Admin'})</span>
            </button>
          ) : (
            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Only Seabass and Emma can establish new rules</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const isVaultOath = rule.number === 1;

            return (
              <div
                key={rule.number}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  isVaultOath
                    ? 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0 border ${
                      isVaultOath 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md' 
                        : 'bg-slate-800 text-amber-400 border-slate-700'
                    }`}>
                      #{rule.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-white text-base">
                          {rule.title}
                        </h3>
                        {isVaultOath && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-900 text-blue-300 border border-blue-700">
                            Sacred Law
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  {isSeabass && onDeleteRule && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onDeleteRule(rule.number);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                      title="Delete rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Preamble */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
        "United as the Brickerton Squad. Built on trust, sealed in secrecy, bound for life."
      </div>

      {/* Propose Rule Modal */}
      {showModal && canAddRules && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <h3 className="text-lg font-black text-white mb-1 font-display">
              Propose New Bylaw
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isSeabass
                ? 'Executive privilege: Seabass is drafting a new rule for the Brickerton Squad to uphold.'
                : 'Co-Admin authority: Emma is drafting a new rule for the Brickerton Squad to uphold.'}
            </p>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rule Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Birthday Crown Ordinance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rule Description & Oath *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State the exact terms and penalty for violating this rule..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md shadow-amber-600/30"
                >
                  Ratify Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

