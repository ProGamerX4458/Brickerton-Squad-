import { useState } from 'react';
import { UserPlus, MapPin, Quote, Zap, Trash2, Lock, Pencil, X, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

const STATUS_LABELS = {
  active: { label: 'Active in HQ', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-700/40', dot: 'bg-emerald-400' },
  chilling: { label: 'Chilling', color: 'text-blue-400 bg-blue-950/40 border-blue-700/40', dot: 'bg-blue-400' },
  'on-mission': { label: 'On Mission', color: 'text-amber-400 bg-amber-950/40 border-amber-700/40', dot: 'bg-amber-400' },
  sleeping: { label: 'Recharging', color: 'text-purple-400 bg-purple-950/40 border-purple-700/40', dot: 'bg-purple-400' },
};

const AVATAR_COLORS = [
  { name: 'Blue', class: 'bg-blue-600' },
  { name: 'Rose', class: 'bg-rose-600' },
  { name: 'Amber', class: 'bg-amber-600' },
  { name: 'Emerald', class: 'bg-emerald-600' },
  { name: 'Purple', class: 'bg-purple-600' },
  { name: 'Indigo', class: 'bg-indigo-600' },
  { name: 'Cyan', class: 'bg-cyan-600' },
  { name: 'Red', class: 'bg-red-600' },
];

const PRESET_EMOJIS = ['🧱', '👑', '⭐', '⚡', '🍕', '🔥', '🛠️', '🛹', '🎮', '🚀', '🕶️', '🎯', '🎧', '🏆', '💎', '🍿'];

export function MemberRoster({
  members,
  currentMember,
  loggedMember,
  isSeabass = true,
  isEmma = false,
  canEditMembers = true,
  canActAsOthers = false,
  isActingAsOther = false,
  onAddMember,
  onEditMember,
  onUpdateStatus,
  onSelectMember,
  onSwitchBackToSelf,
  onRemoveMember,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('');
  const [superpower, setSuperpower] = useState('');
  const [favoriteHangout, setFavoriteHangout] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [emoji, setEmoji] = useState('🧱');

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editSuperpower, setEditSuperpower] = useState('');
  const [editFavoriteHangout, setEditFavoriteHangout] = useState('');
  const [editCatchphrase, setEditCatchphrase] = useState('');
  const [editEmoji, setEditEmoji] = useState('🧱');
  const [editAvatarBg, setEditAvatarBg] = useState('bg-blue-600');
  const [editStatus, setEditStatus] = useState('active');

  const handleOpenEditModal = (member) => {
    if (!canEditMembers) return;
    sounds.playSnap();
    setEditingMember(member);
    setEditName(member.name || '');
    setEditNickname(member.nickname || '');
    setEditRole(member.role || '');
    setEditSuperpower(member.superpower || '');
    setEditFavoriteHangout(member.favoriteHangout || '');
    setEditCatchphrase(member.catchphrase || '');
    setEditEmoji(member.avatarEmoji || '🧱');
    setEditAvatarBg(member.avatarBg || 'bg-blue-600');
    setEditStatus(member.status || 'active');
  };

  const handleCloseEditModal = () => {
    setEditingMember(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!canEditMembers || !editingMember) return;
    if (!editName.trim() || !editNickname.trim()) return;

    sounds.playFanfare();
    const updated = {
      ...editingMember,
      name: editName.trim(),
      nickname: editNickname.trim(),
      role: editRole.trim() || editingMember.role,
      superpower: editSuperpower.trim() || editingMember.superpower,
      favoriteHangout: editFavoriteHangout.trim() || editingMember.favoriteHangout,
      catchphrase: editCatchphrase.trim(),
      avatarEmoji: editEmoji,
      avatarBg: editAvatarBg,
      status: editStatus,
    };

    if (onEditMember) {
      onEditMember(updated);
    }
    setEditingMember(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !nickname.trim()) return;

    sounds.playFanfare();
    const newSquadMember = {
      id: `mem-${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim(),
      role: role.trim() || 'Squad Operative',
      color: '#3B82F6',
      avatarBg: 'bg-blue-600',
      avatarEmoji: emoji,
      superpower: superpower.trim() || 'Instant good vibes and squad energy',
      favoriteHangout: favoriteHangout.trim() || 'Brickerton HQ Lounge',
      catchphrase: catchphrase.trim() || 'Squad up!',
      joinedDate: 'Joined Today',
      status: 'active',
    };

    onAddMember(newSquadMember);
    setShowAddModal(false);
    setName('');
    setNickname('');
    setRole('');
    setSuperpower('');
    setFavoriteHangout('');
    setCatchphrase('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 font-display">
            <span>🧱</span>
            <span>BRICKERTON SQUAD ROSTER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official Roll Call • {members.length} Squad Members Enlisted
          </p>
        </div>

        {isSeabass ? (
          <button
            type="button"
            id="open-add-member-modal-btn"
            onClick={() => {
              sounds.playSnap();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4" />
            <span>Induct New Member</span>
          </button>
        ) : isEmma ? (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-950/80 border border-pink-700/60 text-pink-300 text-xs font-semibold">
            <Pencil className="w-3.5 h-3.5 text-pink-400" />
            <span>Co-Admin Privileges: Member Editing Authorized</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Member Editing: Seabass & Emma Only</span>
          </div>
        )}
      </div>

      {/* Active Disguise / Acting Persona Banner for Seabass */}
      {isActingAsOther && onSwitchBackToSelf && (
        <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎭</span>
            <div>
              <div className="font-extrabold text-amber-300 text-sm flex items-center gap-2">
                <span>Acting As {currentMember.nickname}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Disguise Active
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Only you have authorization to act as other members. Everything you post will be authored as {currentMember.nickname}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playSnap();
              onSwitchBackToSelf();
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            Return to Seabass &rarr;
          </button>
        </div>
      )}

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => {
          const isCurrentUser = member.id === currentMember.id;
          const isRealUserCard = member.id === loggedMember?.id;
          const statusConfig = STATUS_LABELS[member.status] || STATUS_LABELS.active;

          return (
            <div
              key={member.id}
              id={`member-card-${member.id}`}
              className={`bg-slate-900/90 border rounded-2xl p-5 relative overflow-hidden transition-all shadow-lg flex flex-col justify-between ${
                isCurrentUser 
                  ? isActingAsOther
                    ? 'border-amber-500/70 shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'border-blue-500/70 shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge for Current Active Persona */}
              {isCurrentUser && (
                <div className={`absolute top-0 right-0 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg shadow ${
                  isActingAsOther ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                }`}>
                  {isActingAsOther ? '🎭 Active Persona' : 'Current Session'}
                </div>
              )}

              {/* Main Member Profile */}
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${member.avatarBg} flex items-center justify-center text-2xl shadow-lg shrink-0 border border-white/10`}>
                    {member.avatarEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-extrabold text-white text-base truncate flex items-center gap-1.5 flex-wrap">
                        <span>{member.nickname}</span>
                        {(member.isFounder || member.role.toLowerCase().includes('founder') || member.nickname.toLowerCase() === 'emma') && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            👑 Founder
                          </span>
                        )}
                        {(member.isCoAdmin || member.role.toLowerCase().includes('co-admin') || (member.nickname.toLowerCase() === 'emma' && !member.role.toLowerCase().includes('admin (full'))) && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                            ⭐ Co-Admin
                          </span>
                        )}
                        {(!member.isCoAdmin && !member.role.toLowerCase().includes('co-admin') && member.role.toLowerCase().includes('admin')) && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            🛡️ Admin
                          </span>
                        )}
                      </h3>

                      {/* Edit member button (Seabass and Emma Only) */}
                      {canEditMembers && onEditMember && (
                        <button
                          type="button"
                          id={`edit-member-btn-${member.id}`}
                          onClick={() => handleOpenEditModal(member)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 text-[11px] font-bold transition-all shadow-sm cursor-pointer shrink-0"
                          title={`Edit ${member.nickname}'s profile (Seabass & Emma Only)`}
                        >
                          <Pencil className="w-3 h-3 text-amber-400" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{member.name}</p>
                    <p className={`text-xs font-semibold mt-0.5 truncate ${
                      member.role.toLowerCase().includes('founder') || member.isFounder
                        ? 'text-amber-400 font-bold'
                        : member.isCoAdmin || member.role.toLowerCase().includes('co-admin')
                        ? 'text-pink-400 font-bold'
                        : 'text-blue-400'
                    }`}>
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Founder & Co-Admin Recognition Banner */}
                {(member.isFounder || member.role.toLowerCase().includes('founder') || member.nickname.toLowerCase() === 'emma') && (
                  <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/40 to-pink-950/40 border border-amber-500/30 flex items-center gap-2 text-amber-200 text-xs shadow-inner">
                    <span className="text-base">👑</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-amber-300">Squad Founder & Co-Admin:</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-mono">Chat & Rules Privileges</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5">Original squad founder authorized to broadcast on chat and ratify rules.</p>
                    </div>
                  </div>
                )}

                {/* Status Switcher */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-medium">Status:</span>
                    {isCurrentUser && (
                      <span className="text-blue-400 font-semibold text-[10px]">Click to change</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['active', 'chilling', 'on-mission', 'sleeping'].map((st) => {
                      const cfg = STATUS_LABELS[st];
                      const isCurrentStatus = member.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={!isCurrentUser}
                          onClick={() => {
                            if (isCurrentUser) {
                              sounds.playSnap();
                              onUpdateStatus(member.id, st);
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all ${
                            isCurrentStatus
                              ? cfg.color
                              : 'bg-slate-800/40 text-slate-500 border-transparent hover:text-slate-400'
                          } ${isCurrentUser ? 'cursor-pointer hover:border-slate-600' : 'cursor-default'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isCurrentStatus && st === 'active' ? 'animate-pulse' : ''}`} />
                          <span>{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Member Details */}
                <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                  <div className="flex items-start gap-2 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-medium">Squad Superpower: </span>
                      <span>{member.superpower}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-medium">Fav Hangout: </span>
                      <span>{member.favoriteHangout}</span>
                    </div>
                  </div>

                  {member.catchphrase && (
                    <div className="flex items-start gap-2 text-slate-300 italic pt-1">
                      <Quote className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">"{member.catchphrase}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom switch user action */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="text-[10px] text-slate-500 font-mono">{member.joinedDate}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Edit Member button: Accessible ONLY to Seabass and Emma */}
                  {canEditMembers && onEditMember && (
                    <button
                      type="button"
                      id={`edit-member-btn-bottom-${member.id}`}
                      onClick={() => handleOpenEditModal(member)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400/60 text-xs font-bold transition-all shadow-sm cursor-pointer"
                      title={`Edit ${member.nickname}'s profile (Seabass & Emma Only)`}
                    >
                      <Pencil className="w-3 h-3 text-amber-400" />
                      <span>Edit Member</span>
                    </button>
                  )}

                  {isSeabass && onRemoveMember && member.id !== 'mem-1' && member.nickname?.toLowerCase() !== 'emma' && member.name?.toLowerCase() !== 'emma' && !member.isFounder && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSnap();
                        onRemoveMember(member.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title={`Remove ${member.nickname} from Squad`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* ONLY Seabass (canActAsOthers) can act as other members */}
                  {canActAsOthers && !isCurrentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSnap();
                        onSelectMember(member);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <span>Act As {member.nickname}</span>
                      <span>&rarr;</span>
                    </button>
                  )}

                  {/* Return button on Seabass card if currently in another member's persona */}
                  {isActingAsOther && isRealUserCard && onSwitchBackToSelf && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSnap();
                        onSwitchBackToSelf();
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <span>Back to Seabass</span>
                      <span>&rarr;</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <h3 className="text-lg font-black text-white mb-1 font-display">
              Induct New Squad Member
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a trusted friend into the Brickerton Squad archives.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Brandon Miller"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Squad Nickname *</label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g., Turbo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Squad Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Arcade Champion"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Emoji Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Crest Emoji Badge</label>
                <div className="flex gap-2 flex-wrap">
                  {['🧱', '⚡', '🍕', '🔥', '🛠️', '🛹', '🎮', '👑', '🚀', '🕶️'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                        emoji === em 
                          ? 'bg-blue-600 border-blue-400 scale-110' 
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Squad Superpower</label>
                <input
                  type="text"
                  value={superpower}
                  onChange={(e) => setSuperpower(e.target.value)}
                  placeholder="e.g., Can find the best taco truck in any town"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Favorite Hangout Spot</label>
                <input
                  type="text"
                  value={favoriteHangout}
                  onChange={(e) => setFavoriteHangout(e.target.value)}
                  placeholder="e.g., Sunset Hill Diner"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Squad Catchphrase</label>
                <input
                  type="text"
                  value={catchphrase}
                  onChange={(e) => setCatchphrase(e.target.value)}
                  placeholder="e.g., All gas, no brakes."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30"
                >
                  Confirm Induction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Squad Member Modal: Accessible ONLY to Seabass and Emma */}
      {editingMember && canEditMembers && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">
                    Edit Squad Member: {editingMember.nickname}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {isSeabass ? 'Admin (Seabass)' : 'Co-Admin (Emma)'} Authorized
                    </span>
                    <span className="text-xs text-slate-400">Exclusive member management</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Preview Pill */}
            <div className="mb-4 mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl ${editAvatarBg} flex items-center justify-center text-xl shadow-md border border-white/10 shrink-0`}>
                {editEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-slate-400 font-mono">Live Crest & Profile Preview:</div>
                <div className="text-white font-bold text-sm truncate">{editNickname || 'Nickname'} ({editName || 'Name'})</div>
                <div className="text-amber-400 text-xs font-semibold truncate">{editRole || 'Squad Role'}</div>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full / Real Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Squad Nickname *</label>
                  <input
                    type="text"
                    required
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Squad Role / Title</label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">HQ Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(STATUS_LABELS).map(([stKey, stCfg]) => {
                    const isSelected = editStatus === stKey;
                    return (
                      <button
                        key={stKey}
                        type="button"
                        onClick={() => setEditStatus(stKey)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? `${stCfg.color} ring-1 ring-amber-500/50`
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                        <span>{stCfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Crest Emoji Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Crest Emoji Badge</label>
                <div className="flex gap-1.5 flex-wrap items-center">
                  {PRESET_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEditEmoji(em)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition-all cursor-pointer ${
                        editEmoji === em
                          ? 'bg-amber-500/30 border-amber-400 scale-110'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                  <input
                    type="text"
                    maxLength={2}
                    value={editEmoji}
                    onChange={(e) => setEditEmoji(e.target.value)}
                    placeholder="Custom"
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500 text-xs"
                    title="Or enter any custom emoji"
                  />
                </div>
              </div>

              {/* Avatar Color Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Avatar Shield Color</label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col.class}
                      type="button"
                      onClick={() => setEditAvatarBg(col.class)}
                      className={`h-7 px-2.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer ${col.class} ${
                        editAvatarBg === col.class
                          ? 'ring-2 ring-white scale-105 shadow-md'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {editAvatarBg === col.class && <Check className="w-3 h-3" />}
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Squad Superpower</label>
                <input
                  type="text"
                  value={editSuperpower}
                  onChange={(e) => setEditSuperpower(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Favorite Hangout Spot</label>
                <input
                  type="text"
                  value={editFavoriteHangout}
                  onChange={(e) => setEditFavoriteHangout(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Squad Catchphrase</label>
                <input
                  type="text"
                  value={editCatchphrase}
                  onChange={(e) => setEditCatchphrase(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-member-edits-btn"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Member Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
