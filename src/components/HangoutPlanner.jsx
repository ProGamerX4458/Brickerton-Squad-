import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Check, Users, Trash2, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';

const CATEGORY_TAGS = {
  gaming: { label: 'Gaming Night', color: 'text-indigo-400 bg-indigo-950/40 border-indigo-700/40', icon: '🎮' },
  food: { label: 'Food Feast', color: 'text-amber-400 bg-amber-950/40 border-amber-700/40', icon: '🍕' },
  outdoor: { label: 'Adventure / Outdoor', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-700/40', icon: '🛹' },
  building: { label: 'Brick Building / Workshop', color: 'text-blue-400 bg-blue-950/40 border-blue-700/40', icon: '🧱' },
  chilling: { label: 'Chill & Hangout', color: 'text-purple-400 bg-purple-950/40 border-purple-700/40', icon: '☕' },
};

export function HangoutPlanner({
  events,
  members,
  currentMember,
  isSeabass = true,
  onToggleRsvp,
  onAddEvent,
  onDeleteEvent,
}) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('gaming');

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    sounds.playFanfare();
    const newEvt = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      date: date.trim(),
      time: time.trim() || 'TBD',
      location: location.trim() || 'Brickerton HQ',
      description: description.trim(),
      category,
      attendees: [currentMember.id],
      hostMemberId: currentMember.id,
    };

    onAddEvent(newEvt);
    setShowModal(false);
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 font-display">
            <span>🍕</span>
            <span>HANGOUTS & MISSION DISPATCH</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Where Brickerton Squad unites. Check upcoming plans and lock in your RSVP.
          </p>
        </div>

        {isSeabass ? (
          <button
            type="button"
            id="plan-hangout-btn"
            onClick={() => {
              sounds.playSnap();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-600/20 transition-all cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Hangout</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Hangout Changes: Seabass Only</span>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((evt) => {
          const isAttending = evt.attendees.includes(currentMember.id);
          const host = members.find(m => m.id === evt.hostMemberId);
          const tagInfo = CATEGORY_TAGS[evt.category] || CATEGORY_TAGS.gaming;

          return (
            <div
              key={evt.id}
              id={`hangout-card-${evt.id}`}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tagInfo.color}`}>
                    <span>{tagInfo.icon}</span>
                    <span>{tagInfo.label}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {host && (
                      <span className="text-[11px] text-slate-400">
                        Host: <strong className="text-slate-200">{host.nickname}</strong>
                      </span>
                    )}
                    {isSeabass && onDeleteEvent && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playSnap();
                          onDeleteEvent(evt.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors rounded hover:bg-red-500/10 cursor-pointer"
                        title="Delete this hangout post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {evt.description}
                </p>

                {/* Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>Who's Rolling In ({evt.attendees.length})</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {evt.attendees.map(attId => {
                      const member = members.find(m => m.id === attId);
                      if (!member) return null;
                      return (
                        <div
                          key={attId}
                          title={`${member.nickname} (${member.name})`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 shadow-sm"
                        >
                          <span>{member.avatarEmoji}</span>
                          <span className="font-semibold text-[11px]">{member.nickname}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Status for {currentMember.nickname}:
                </span>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playSnap();
                    onToggleRsvp(evt.id, currentMember.id);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isAttending
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isAttending ? 'opacity-100' : 'opacity-40'}`} />
                  <span>{isAttending ? "I'm In! (RSVP'd)" : "Count Me In"}</span>
                </button>
              </div>

            </div>
          );
        })}

        {events.length === 0 && (
          <div className="col-span-full py-12 px-4 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-2xl mb-3">
              🍕
            </div>
            <h3 className="text-sm font-bold text-slate-300">No Hangout Posts</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No hangout plans are currently posted. Click "Plan New Hangout" above to schedule a mission or hangout for the squad.
            </p>
          </div>
        )}
      </div>

      {/* Plan Hangout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <h3 className="text-lg font-black text-white mb-1 font-display">
              Schedule Squad Hangout
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Set up the time, date, and venue for the Brickerton crew.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hangout Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Saturday Midnight Arcade Rally"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g., This Friday"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g., 7:00 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Downtown Diner / Seabass's House"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                >
                  <option value="gaming">🎮 Gaming Night</option>
                  <option value="food">🍕 Food Feast</option>
                  <option value="outdoor">🛹 Adventure / Outdoor</option>
                  <option value="building">🧱 Brick Building</option>
                  <option value="chilling">☕ Chill & Chat</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Details</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's the plan? Bring your controller, snacks, etc."
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
                  Confirm Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
