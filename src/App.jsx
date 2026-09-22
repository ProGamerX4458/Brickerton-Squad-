import { useState, useEffect } from 'react';
import { INITIAL_MEMBERS, INITIAL_POSTS, INITIAL_EVENTS, SQUAD_RULES } from './data/initialData';
import { PasswordGate } from './components/PasswordGate';
import { ClubhouseHeader } from './components/ClubhouseHeader';
import { ClubhouseFeed } from './components/ClubhouseFeed';
import { HangoutPlanner } from './components/HangoutPlanner';
import { MemberRoster } from './components/MemberRoster';
import { SquadRulesView } from './components/SquadRulesView';
import { SoundBoardModal } from './components/SoundBoardModal';
import { SquadPassModal } from './components/SquadPassModal';

const SQUAD_PASSWORD = 'B225734!';
const STORAGE_KEYS = {
  MEMBERS: 'brickerton_members_v4',
  POSTS: 'brickerton_posts_v4',
  EVENTS: 'brickerton_events_v3',
  RULES: 'brickerton_rules_v3',
  AUTH: 'brickerton_authenticated',
  CURRENT_MEMBER: 'brickerton_current_member_id',
  LOGGED_MEMBER: 'brickerton_logged_member_id',
};

export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // Main navigation tab
  const [activeTab, setActiveTab] = useState('feed');

  // Squad Members
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updated = parsed.map((m) => {
            if (m.id === 'mem-1' || m.nickname === 'Seabass' || m.name === 'Seabass') {
              return {
                ...m,
                joinedDate: 'Joined 2025',
                role: m.role?.replace(/\s*&\s*Founder/gi, '').replace(/\s*Founder/gi, '') || 'Squad Admin'
              };
            }
            if (m.name?.toLowerCase() === 'emma' || m.nickname?.toLowerCase() === 'emma' || m.id === 'mem-3') {
              return {
                ...m,
                role: 'Founder & Co-Admin',
                isFounder: true,
                isCoAdmin: true,
                joinedDate: m.joinedDate || 'Original Founder',
                superpower: 'Founder & Co-Admin — original squad visionary authorized to broadcast on the clubhouse wall, add new rules, and edit member profiles',
              };
            }
            return m;
          });

          const hasChickenJoshy = updated.some(
            (m) => m.name === 'ChickenJoshy' || m.nickname === 'ChickenJoshy'
          );
          if (!hasChickenJoshy) {
            const chickenJoshy = INITIAL_MEMBERS.find((m) => m.name === 'ChickenJoshy');
            if (chickenJoshy) {
              updated.push(chickenJoshy);
            }
          }

          const hasEmma = updated.some(
            (m) => m.name?.toLowerCase() === 'emma' || m.nickname?.toLowerCase() === 'emma'
          );
          if (!hasEmma) {
            const emma = INITIAL_MEMBERS.find((m) => m.name === 'Emma');
            if (emma) {
              updated.push(emma);
            }
          }
          return updated;
        }
      } catch { /* ignore */ }
    }
    return INITIAL_MEMBERS;
  });

  // Authenticated Member (the real account who signed in at Password Gate)
  const [loggedMemberId, setLoggedMemberId] = useState(() => {
    const savedLoggedId = sessionStorage.getItem(STORAGE_KEYS.LOGGED_MEMBER);
    if (savedLoggedId && members.some(m => m.id === savedLoggedId)) {
      return savedLoggedId;
    }
    const savedMemberId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER);
    if (savedMemberId && members.some(m => m.id === savedMemberId)) {
      return savedMemberId;
    }
    return members[0]?.id || 'mem-1';
  });

  // Current session active member (can be switched ONLY by Seabass acting as others)
  const [currentMemberId, setCurrentMemberId] = useState(() => {
    const savedMemberId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER);
    if (savedMemberId && members.some(m => m.id === savedMemberId)) {
      return savedMemberId;
    }
    return members[0]?.id || 'mem-1';
  });

  // Clubhouse Feed Posts (cleared chat so it starts fresh)
  const [posts, setPosts] = useState(() => {
    try {
      localStorage.removeItem('brickerton_posts');
      localStorage.removeItem('brickerton_posts_v2');
      localStorage.removeItem('brickerton_posts_v3');
    } catch { /* ignore */ }
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // Hangout Events
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_EVENTS;
  });

  // Squad Rules / Constitution (All rules removed)
  const [rules, setRules] = useState(() => {
    try {
      localStorage.removeItem('brickerton_rules');
      localStorage.removeItem('brickerton_rules_v2');
      localStorage.removeItem('brickerton_rules_v3');
    } catch { /* ignore */ }
    const saved = localStorage.getItem(STORAGE_KEYS.RULES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // Modals
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [showSquadPass, setShowSquadPass] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  }, [rules]);

  // Authenticated real member object
  const loggedMember = members.find(m => m.id === loggedMemberId) || members[0] || INITIAL_MEMBERS[0];

  // Current active persona member object
  const currentMember = members.find(m => m.id === currentMemberId) || members[0] || INITIAL_MEMBERS[0];

  // Permissions: Seabass is the clubhouse owner/admin ("I", me)
  const isLoggedSeabass = loggedMember?.id === 'mem-1' || 
    loggedMember?.nickname?.toLowerCase() === 'seabass' || 
    loggedMember?.name?.toLowerCase() === 'seabass';

  const isCurrentEmma = currentMember?.nickname?.toLowerCase() === 'emma' ||
    currentMember?.name?.toLowerCase() === 'emma' ||
    currentMember?.id === 'mem-3';

  const isLoggedEmma = loggedMember?.id === 'mem-3' ||
    loggedMember?.nickname?.toLowerCase() === 'emma' ||
    loggedMember?.name?.toLowerCase() === 'emma';

  // Only Seabass can act as other squad members
  const canActAsOthers = isLoggedSeabass;
  const isActingAsOther = isLoggedSeabass && currentMemberId !== loggedMemberId;

  // Seabass retains full owner/admin privileges (all controls)
  const isSeabass = isLoggedSeabass;

  // Emma is Co-Admin: her ONLY powers are typing in chat and adding rules
  const isEmma = isLoggedEmma || (isLoggedSeabass && isCurrentEmma);

  // Chat posting permission: ONLY Emma and Seabass can type/post in the chat
  const canPost = isLoggedSeabass || isLoggedEmma || (isLoggedSeabass && isCurrentEmma);

  // Rule adding permission: ONLY Emma and Seabass can add new rules
  const canAddRules = isLoggedSeabass || isLoggedEmma || (isLoggedSeabass && isCurrentEmma);

  // Member editing permission: ONLY Emma and Seabass can edit members
  const canEditMembers = isLoggedSeabass || isLoggedEmma || (isLoggedSeabass && isCurrentEmma);

  // Auth Handlers
  const handleUnlock = (memberId) => {
    if (memberId) {
      setLoggedMemberId(memberId);
      setCurrentMemberId(memberId);
      sessionStorage.setItem(STORAGE_KEYS.LOGGED_MEMBER, memberId);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, memberId);
    }
    setIsAuthenticated(true);
    sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const handleLockVault = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_MEMBER);
    sessionStorage.removeItem(STORAGE_KEYS.LOGGED_MEMBER);
  };

  // Switch persona (ONLY permitted for Seabass)
  const handleSwitchPersona = (targetMember) => {
    if (!canActAsOthers) return;
    setCurrentMemberId(targetMember.id);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, targetMember.id);
  };

  const handleSwitchBackToSelf = () => {
    setCurrentMemberId(loggedMemberId);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, loggedMemberId);
  };

  // Feed Actions: ONLY Seabass and Emma can post in chat; other actions (delete/pin) remain Seabass-only
  const handleAddPost = (newPostData) => {
    if (!canPost) return;
    const newPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 0,
      reactions: {},
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleToggleLike = (postId) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const liked = !p.likedByMe;
        return {
          ...p,
          likedByMe: liked,
          likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  const handleAddReaction = (postId, emoji) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const currentCount = p.reactions[emoji] || 0;
        const isSelected = p.myReaction === emoji;
        
        return {
          ...p,
          myReaction: isSelected ? undefined : emoji,
          reactions: {
            ...p.reactions,
            [emoji]: isSelected ? Math.max(0, currentCount - 1) : currentCount + 1,
          },
        };
      })
    );
  };

  const handleTogglePin = (postId) => {
    if (!isSeabass) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, pinned: !p.pinned };
      })
    );
  };

  const handleDeletePost = (postId) => {
    if (!isSeabass) return;
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleClearAllPosts = () => {
    if (!isSeabass) return;
    setPosts([]);
  };

  // Hangout Events Actions (Only Seabass can create or delete hangouts)
  const handleAddEvent = (newEvent) => {
    if (!isSeabass) return;
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (eventId) => {
    if (!isSeabass) return;
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleToggleRsvp = (eventId, memberId) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const isAttending = evt.attendees.includes(memberId);
        return {
          ...evt,
          attendees: isAttending
            ? evt.attendees.filter(id => id !== memberId)
            : [...evt.attendees, memberId],
        };
      })
    );
  };

  // Member Roster Actions (Only Seabass can add or delete members)
  const handleAddMember = (newMember) => {
    if (!isSeabass) return;
    setMembers(prev => [...prev, newMember]);
    setCurrentMemberId(newMember.id);
  };

  const handleUpdateMemberStatus = (memberId, status) => {
    if (!isSeabass && memberId !== currentMember.id) return;
    setMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, status } : m))
    );
  };

  const handleEditMember = (updatedMember) => {
    if (!canEditMembers) return;
    setMembers(prev =>
      prev.map(m => (m.id === updatedMember.id ? { ...m, ...updatedMember } : m))
    );
  };

  const handleRemoveMember = (memberId) => {
    if (!isSeabass) return;
    setMembers(prev => prev.filter(m => m.id !== memberId));
    if (currentMemberId === memberId) {
      setCurrentMemberId(loggedMemberId);
    }
  };

  // Rules Actions (Only Seabass and Emma can add rules; only Seabass can delete/clear)
  const handleAddRule = (newRule) => {
    if (!canAddRules) return;
    setRules(prev => [...prev, newRule]);
  };

  const handleDeleteRule = (ruleNumber) => {
    if (!isSeabass) return;
    setRules(prev =>
      prev
        .filter(r => r.number !== ruleNumber)
        .map((r, idx) => ({ ...r, number: idx + 1 }))
    );
  };

  const handleClearAllRules = () => {
    if (!isSeabass) return;
    setRules([]);
  };

  // If locked, render Password Gate
  if (!isAuthenticated) {
    return (
      <PasswordGate
        members={members}
        onUnlock={handleUnlock}
        targetPassword={SQUAD_PASSWORD}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <ClubhouseHeader
        currentMember={currentMember}
        loggedMember={loggedMember}
        isSeabass={isSeabass}
        isEmma={isEmma}
        isActingAsOther={isActingAsOther}
        onSwitchBackToSelf={handleSwitchBackToSelf}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLockVault={handleLockVault}
        onOpenSoundboard={() => setShowSoundboard(true)}
        onOpenPass={() => setShowSquadPass(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'feed' && (
          <ClubhouseFeed
            posts={posts}
            currentMember={currentMember}
            loggedMember={loggedMember}
            isSeabass={isSeabass}
            isEmma={isEmma}
            canPost={canPost}
            onAddPost={handleAddPost}
            onToggleLike={handleToggleLike}
            onAddReaction={handleAddReaction}
            onTogglePin={handleTogglePin}
            onDeletePost={handleDeletePost}
            onClearAllPosts={handleClearAllPosts}
          />
        )}

        {activeTab === 'hangouts' && (
          <HangoutPlanner
            events={events}
            members={members}
            currentMember={currentMember}
            isSeabass={isSeabass}
            onToggleRsvp={handleToggleRsvp}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'roster' && (
          <MemberRoster
            members={members}
            currentMember={currentMember}
            loggedMember={loggedMember}
            isSeabass={isSeabass}
            isEmma={isEmma}
            canEditMembers={canEditMembers}
            canActAsOthers={canActAsOthers}
            isActingAsOther={isActingAsOther}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onUpdateStatus={handleUpdateMemberStatus}
            onSelectMember={handleSwitchPersona}
            onSwitchBackToSelf={handleSwitchBackToSelf}
            onRemoveMember={handleRemoveMember}
          />
        )}

        {activeTab === 'rules' && (
          <SquadRulesView
            rules={rules}
            currentMember={currentMember}
            isSeabass={isSeabass}
            isEmma={isEmma}
            canAddRules={canAddRules}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
            onClearAllRules={handleClearAllRules}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🧱 Brickerton Squad • Private Vault Protected</span>
          <span>Members Only • Est. 2022</span>
        </div>
      </footer>

      {/* Modals */}
      {showSoundboard && (
        <SoundBoardModal onClose={() => setShowSoundboard(false)} />
      )}

      {showSquadPass && (
        <SquadPassModal
          member={currentMember}
          onClose={() => setShowSquadPass(false)}
        />
      )}
    </div>
  );
}

export default App;
