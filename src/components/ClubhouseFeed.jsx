import { useState } from 'react';
import { Pin, Heart, Send, MessageSquare, Trash2, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';

const CATEGORY_COLORS = {
  'announcement': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Announcement' },
  'inside-joke': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Inside Joke' },
  'hangout': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Hangout Intel' },
  'secret-intel': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Top Secret' },
  'meme': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', label: 'Squad Meme' },
};

const REACTION_OPTIONS = ['🔥', '🧱', '💀', '🍕', '👑', '😂'];

export function ClubhouseFeed({
  posts,
  currentMember,
  loggedMember,
  isSeabass = true,
  isEmma = false,
  canPost = true,
  onAddPost,
  onToggleLike,
  onAddReaction,
  onTogglePin,
  onDeletePost,
  onClearAllPosts,
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('inside-joke');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPost || !content.trim()) return;

    sounds.playFanfare();
    onAddPost({
      authorId: currentMember.id,
      authorName: currentMember.name,
      authorNickname: currentMember.nickname,
      authorColor: currentMember.color,
      authorEmoji: currentMember.avatarEmoji,
      content: content.trim(),
      category,
      timestamp: 'Just now',
    });

    setContent('');
  };

  const filteredPosts = posts.filter(p => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Post to Squad Wall: Allowed for Seabass and Emma, Restricted for all other members */}
      {canPost ? (
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${currentMember.avatarBg} flex items-center justify-center text-lg shadow-inner`}>
              {currentMember.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Post to the Brickerton Wall
                </h3>
                {isSeabass ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-700/60 font-semibold">
                    as {currentMember.nickname} (Admin)
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-700/60 font-semibold">
                    as Emma (Co-Admin)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Share intel, jokes, ideas, or memes with the squad</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              id="squad-post-content"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isEmma && !isSeabass
                  ? "What's on your mind, Emma? Broadcast squad intel to the wall..."
                  : "What's the word, Seabass? Broadcast some squad intel to the wall..."
              }
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Category selection */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
                <span className="text-slate-400 text-[11px] font-medium mr-1">Category:</span>
                {['inside-joke', 'hangout', 'announcement', 'secret-intel', 'meme'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sounds.playSnap();
                      setCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      category === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    {cat.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Post Button */}
              <button
                type="submit"
                id="submit-post-btn"
                disabled={!content.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to Squad</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Squad Chat Posting Restricted
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
                  Seabass & Emma Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Posting messages to the squad chat is restricted to Emma and Seabass. (Viewing as {currentMember.nickname}).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Intel Filter:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['all', 'announcement', 'inside-joke', 'hangout', 'secret-intel'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sounds.playSnap();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat === 'all' ? 'All Updates' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>
            Showing <strong className="font-semibold text-slate-200">{filteredPosts.length}</strong> updates
          </span>
          {isSeabass && posts.length > 0 && onClearAllPosts && (
            <button
              type="button"
              onClick={() => {
                sounds.playSnap();
                if (window.confirm('Delete all posts and messages from the squad wall?')) {
                  onClearAllPosts();
                }
              }}
              className="px-2.5 py-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-800/40 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title="Delete all squad posts"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">No posts or messages yet</p>
            <p className="text-xs text-slate-500 mt-1">
              {isSeabass
                ? 'The squad wall is clean. Drop the first broadcast above!'
                : 'The squad wall is clean. Only Seabass can broadcast updates to the wall.'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const catConfig = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['announcement'];
            return (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                className={`bg-slate-900/90 border rounded-2xl p-5 transition-all relative overflow-hidden shadow-lg ${
                  post.pinned 
                    ? 'border-blue-500/60 shadow-blue-500/10 bg-slate-900' 
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Pinned Ribbon */}
                {post.pinned && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow">
                    <Pin className="w-3 h-3 fill-current" />
                    <span>PINNED SQUAD MEMO</span>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow-inner">
                      {post.authorEmoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {post.authorNickname}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          ({post.authorName})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}>
                          {catConfig.label}
                        </span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Pin & Delete (Seabass only) */}
                  {isSeabass && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playSnap();
                          onTogglePin(post.id);
                        }}
                        title={post.pinned ? 'Unpin message' : 'Pin to top of clubhouse'}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          post.pinned 
                            ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Pin className="w-4 h-4" />
                      </button>

                      {onDeletePost && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playSnap();
                            onDeletePost(post.id);
                          }}
                          title="Delete this message"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="text-slate-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap font-sans">
                  {post.content}
                </div>

                {/* Reactions & Like Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  
                  {/* Quick Reactions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {REACTION_OPTIONS.map((emoji) => {
                      const count = post.reactions[emoji] || 0;
                      const hasReacted = post.myReaction === emoji;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            sounds.playSnap();
                            onAddReaction(post.id, emoji);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs font-semibold ${
                            hasReacted
                              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 scale-105'
                              : count > 0
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="font-mono text-[11px]">{count}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Heart / Respect Like */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSnap();
                      onToggleLike(post.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      post.likedByMe
                        ? 'bg-pink-950/40 text-pink-400 border border-pink-700/40'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-pink-300 border border-slate-700/50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-current text-pink-500' : ''}`} />
                    <span>{post.likes} {post.likes === 1 ? 'Respect' : 'Respects'}</span>
                  </button>

                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
