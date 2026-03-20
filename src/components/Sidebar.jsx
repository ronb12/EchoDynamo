import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUI } from '../hooks/useUI';
import { useChat } from '../hooks/useChat';
import { useRealtimeChats } from '../hooks/useRealtime';
import { useAuth } from '../hooks/useAuth';
import { useDisplayName } from '../hooks/useDisplayName';
import { chatService } from '../services/chatService';

const ACTION_WIDTH = 128;
const MIN_SWIPE_DISTANCE_TOUCH = 45;
const CLOSE_SWIPE_DISTANCE_TOUCH = 35;

function ChatListRow({ chat, isActive, onSelect, currentUserId, onToggleMute, onDelete, isMuted }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const pointerStartRef = useRef(null);
  const pointerCurrentRef = useRef(null);
  const pointerIdRef = useRef(null);
  const pointerTypeRef = useRef(null);
  const suppressClickRef = useRef(false);

  const participants = Array.isArray(chat?.participants) ? chat.participants : [];
  const otherParticipantId = chat?.type === 'group' ? null : participants.find(p => p && p !== currentUserId);
  const baseChatName = chat?.alias || chat?.displayName || chat?.name || 'Unknown';
  const otherParticipantName = useDisplayName(otherParticipantId, baseChatName);
  const chatDisplayName = chat?.type === 'group' ? (chat?.name || baseChatName) : otherParticipantName;
  const lastMessageSenderId = chat?.lastMessageSenderId && chat.lastMessageSenderId !== currentUserId ? chat.lastMessageSenderId : null;
  const lastMessageSenderName = useDisplayName(lastMessageSenderId, chat?.lastMessageSenderName || (lastMessageSenderId ? 'Someone' : ''));
  const previewText = chat?.lastMessage
    ? (lastMessageSenderId && lastMessageSenderName ? lastMessageSenderName + ': ' + chat.lastMessage : chat.lastMessage)
    : 'No messages yet';
  const avatarSrc = chat?.avatar || '/icons/default-avatar.png';

  const resetPosition = () => { setOffsetX(0); setIsOpen(false); suppressClickRef.current = false; };
  const openActions = () => { setOffsetX(-ACTION_WIDTH); setIsOpen(true); };

  const handlePointerDown = e => {
    if (e.target?.closest('.chat-action-trigger')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerIdRef.current = e.pointerId;
    pointerTypeRef.current = e.pointerType || 'mouse';
    pointerStartRef.current = e.clientX;
    pointerCurrentRef.current = e.clientX;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
  };
  const handlePointerMove = e => {
    if (pointerIdRef.current !== e.pointerId || pointerTypeRef.current !== 'touch') return;
    const delta = e.clientX - pointerStartRef.current;
    if (delta < 0) { setOffsetX(Math.max(delta, -ACTION_WIDTH - 32)); if (delta <= -MIN_SWIPE_DISTANCE_TOUCH) { openActions(); suppressClickRef.current = true; } }
    else if (isOpen) setOffsetX(Math.min(delta - ACTION_WIDTH, 0));
    else setOffsetX(0);
    pointerCurrentRef.current = e.clientX;
    e.preventDefault();
  };
  const handlePointerUp = e => {
    if (pointerIdRef.current !== e.pointerId || pointerTypeRef.current !== 'touch') return;
    const delta = (pointerCurrentRef.current ?? pointerStartRef.current) - (pointerStartRef.current ?? 0);
    if (!isOpen && delta <= -MIN_SWIPE_DISTANCE_TOUCH) { openActions(); suppressClickRef.current = true; }
    else if (isOpen && delta >= CLOSE_SWIPE_DISTANCE_TOUCH) resetPosition();
    else if (isOpen) openActions();
    else resetPosition();
    pointerStartRef.current = null; pointerCurrentRef.current = null; pointerIdRef.current = null; pointerTypeRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  };
  const handleRowClick = e => {
    if (e) e.stopPropagation();
    if (suppressClickRef.current || e.target?.closest('.chat-action-trigger')) { suppressClickRef.current = false; return; }
    if (isOpen) return;
    onSelect(chat.id);
  };
  const handleMute = e => { e.stopPropagation(); onToggleMute(chat.id); resetPosition(); };
  const handleDelete = e => { e.stopPropagation(); onDelete(chat.id); resetPosition(); };
  const handleDesktopTrigger = e => {
    e.preventDefault(); e.stopPropagation();
    if (isOpen) resetPosition(); else { openActions(); suppressClickRef.current = true; }
  };
  const formatTime = ts => {
    if (!ts) return '';
    const d = new Date(ts), now = new Date(), yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === yest.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <li className="chat-item-container">
      <div className={"chat-item-actions" + (isOpen ? ' visible' : '')} aria-hidden={!isOpen}>
        <button className="chat-action-btn mute-btn" type="button" onClick={handleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
          <span className="chat-action-icon">{isMuted ? '🔔' : '🔕'}</span>
        </button>
        <button className="chat-action-btn delete-btn" type="button" onClick={handleDelete} aria-label="Delete">
          <span className="chat-action-icon">🗑️</span>
        </button>
      </div>
      <div
        className={"chat-item" + (isActive ? ' active' : '') + (isOpen ? ' open' : '')}
        onClick={handleRowClick} onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
        style={{ transform: "translateX(" + offsetX + "px)" }}
        role="button" tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(e); }
          if (e.key === 'Escape' && isOpen) resetPosition();
        }}
      >
        <div className="chat-avatar">
          <img src={avatarSrc} alt={chatDisplayName} onError={e => { e.target.src = '/icons/default-avatar.png'; }} />
        </div>
        <div className="chat-info">
          <div className="chat-name">{chatDisplayName}{isMuted && <span className="chat-muted-indicator" title="Muted">🔕</span>}</div>
          <div className="chat-preview">{previewText}</div>
        </div>
        <div className="chat-meta">
          {chat.lastMessageAt && <div className="chat-time">{formatTime(chat.lastMessageAt)}</div>}
          {chat.unreadCount > 0 && <div className="unread-count">{chat.unreadCount > 99 ? '99+' : chat.unreadCount}</div>}
        </div>
        <button type="button" className="chat-action-trigger" onClick={handleDesktopTrigger}
          onMouseDown={e => e.stopPropagation()} onMouseUp={e => e.stopPropagation()} aria-label="Chat actions">⋯</button>
      </div>
    </li>
  );
}

export default function Sidebar() {
  const { isSidebarOpen, openNewChatModal, toggleSidebar, closeSidebar } = useUI();
  const { chats = [], currentChatId, setCurrentChatId, mutedChats, toggleMuteChat, setChats, unmuteChat } = useChat();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  useRealtimeChats();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  useEffect(() => { if (isMobile && currentChatId && isSidebarOpen) closeSidebar(); }, [currentChatId, isMobile, isSidebarOpen, closeSidebar]);
  useEffect(() => {
    const h = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(c => {
      const name = (c?.alias || c?.displayName || c?.name || '').toLowerCase();
      return name.includes(q) || (c?.lastMessage || '').toLowerCase().includes(q);
    });
  }, [chats, searchQuery]);

  const handleChatClick = id => { if (setCurrentChatId && id) setCurrentChatId(id); if (isMobile) closeSidebar(); };
  const handleDeleteChat = async id => {
    if (!id || !window.confirm('Delete this chat and all messages? Cannot be undone.')) return;
    try {
      await chatService.deleteChat(id);
      setChats(p => p.filter(c => c.id !== id));
      if (currentChatId === id) setCurrentChatId(null);
      unmuteChat(id);
    } catch (e) { alert('Unable to delete. Please try again.'); }
  };
  const totalUnread = useMemo(() => chats.reduce((s, c) => s + (c.unreadCount || 0), 0), [chats]);

  return (
    <>
      {isSidebarOpen && !currentChatId && <div className="sidebar-backdrop" onClick={toggleSidebar} />}
      <aside className={"sidebar" + (isSidebarOpen && !currentChatId ? ' open' : '') + (currentChatId ? ' hidden' : '')}>
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <span className="sidebar-title">
              Messages
              {totalUnread > 0 && <span className="sidebar-unread-total">{totalUnread > 99 ? '99+' : totalUnread}</span>}
            </span>
          </div>
          <div className="search-container">
            <input ref={searchRef} type="search" className="search-input"
              placeholder="Search chats… (Ctrl+K)" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} aria-label="Search conversations" />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }} aria-label="Clear">×</button>
            )}
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul className="chat-list">
              {filteredChats.length === 0 ? (
                <li className="sidebar-empty-state">
                  {searchQuery ? (
                    <><span className="empty-icon">🔍</span><span className="empty-title">No results for "{searchQuery}"</span><span className="empty-hint">Try a different name or keyword</span></>
                  ) : (
                    <><span className="empty-icon">💬</span><span className="empty-title">No chats yet</span><span className="empty-hint">Start a new conversation below</span></>
                  )}
                </li>
              ) : filteredChats.map(chat => (
                <ChatListRow key={chat.id} chat={chat} isActive={currentChatId === chat.id}
                  onSelect={handleChatClick} currentUserId={user?.uid}
                  onToggleMute={toggleMuteChat} onDelete={handleDeleteChat}
                  isMuted={mutedChats?.includes(chat.id)} />
              ))}
            </ul>
          </div>
        </nav>
        <div className="sidebar-footer">
          <button className="new-chat-btn" onClick={openNewChatModal}><span>+</span><span>New Chat</span></button>
        </div>
      </aside>
    </>
  );
}