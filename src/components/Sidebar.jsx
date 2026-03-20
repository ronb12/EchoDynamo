import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../hooks/useUI';
import { useChat } from '../hooks/useChat';
import { useRealtimeChats } from '../hooks/useRealtime';
import { useAuth } from '../hooks/useAuth';
import { useDisplayName } from '../hooks/useDisplayName';
import { chatService } from '../services/chatService';

const ACTION_WIDTH = 128;
const MIN_SWIPE_DISTANCE_TOUCH = 45;
const CLOSE_SWIPE_DISTANCE_TOUCH = 35;

function ChatListRow({
  chat,
  isActive,
  onSelect,
  currentUserId,
  onToggleMute,
  onDelete,
  isMuted
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const pointerStartRef = useRef(null);
  const pointerCurrentRef = useRef(null);
  const pointerIdRef = useRef(null);
  const pointerTypeRef = useRef(null);
  const pointerLastTypeRef = useRef(null);
  const suppressClickRef = useRef(false);

  const participants = Array.isArray(chat?.participants) ? chat.participants : [];
  const otherParticipantId = chat?.type === 'group'
    ? null
    : participants.find((participantId) => participantId && participantId !== currentUserId);
  const baseChatName = chat?.alias || chat?.displayName || chat?.name || 'Unknown';
  const otherParticipantName = useDisplayName(otherParticipantId, baseChatName);
  const chatDisplayName = chat?.type === 'group'
    ? (chat?.name || baseChatName)
    : otherParticipantName;

  const lastMessageSenderId = chat?.lastMessageSenderId && chat.lastMessageSenderId !== currentUserId
    ? chat.lastMessageSenderId
    : null;
  const lastMessageSenderName = useDisplayName(
    lastMessageSenderId,
    chat?.lastMessageSenderName || (lastMessageSenderId ? 'Someone' : '')
  );
  const previewText = chat?.lastMessage
    ? (lastMessageSenderId && lastMessageSenderName
        ? `${lastMessageSenderName}: ${chat.lastMessage}`
        : chat.lastMessage)
    : 'No messages';

  const avatarSrc = chat?.avatar || '/icons/default-avatar.png';

  const resetPosition = () => {
    setOffsetX(0);
    setIsOpen(false);
    suppressClickRef.current = false;
  };

  const openActions = () => {
    setOffsetX(-ACTION_WIDTH);
    setIsOpen(true);
  };

  const handlePointerDown = (event) => {
    if (event.target?.closest('.chat-action-trigger')) {return;}
    if (event.pointerType === 'mouse' && event.button !== 0) {return;}
    pointerIdRef.current = event.pointerId;
    const type = event.pointerType || 'mouse';
    pointerTypeRef.current = type;
    pointerLastTypeRef.current = type;
    pointerStartRef.current = event.clientX;
    pointerCurrentRef.current = event.clientX;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (error) {
      // ignore capture errors (e.g., not supported)
    }
  };

  const handlePointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId) {return;}
    if (pointerTypeRef.current !== 'touch') {return;}

    const currentX = event.clientX;
    const delta = currentX - pointerStartRef.current;
    if (delta < 0) {
      setOffsetX(Math.max(delta, -ACTION_WIDTH - 32));
      if (pointerTypeRef.current === 'touch' && delta <= -MIN_SWIPE_DISTANCE_TOUCH) {
        openActions();
        suppressClickRef.current = true;
      }
    } else if (isOpen) {
      if (pointerTypeRef.current === 'touch') {
        setOffsetX(Math.min(delta - ACTION_WIDTH, 0));
      } else {
        setOffsetX(0);
      }
    } else {
      setOffsetX(0);
    }
    pointerCurrentRef.current = currentX;
    event.preventDefault();
  };

  const handlePointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId) {return;}
    if (pointerTypeRef.current !== 'touch') {return;}

    const start = pointerStartRef.current ?? 0;
    const current = pointerCurrentRef.current ?? start;
    const delta = current - start;
    if (!isOpen && delta <= -MIN_SWIPE_DISTANCE_TOUCH) {
      openActions();
      suppressClickRef.current = true;
    } else if (isOpen && delta >= CLOSE_SWIPE_DISTANCE_TOUCH) {
      resetPosition();
    } else if (isOpen) {
      openActions();
    } else {
      resetPosition();
    }
    pointerStartRef.current = null;
    pointerCurrentRef.current = null;
    pointerIdRef.current = null;
    pointerTypeRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch (error) {
      // ignore capture errors
    }
  };

  const handleRowClick = (event) => {
    if (event) {
      event.stopPropagation();
    }
    if (suppressClickRef.current || event.target?.closest('.chat-action-trigger')) {
      suppressClickRef.current = false;
      return;
    }
    if (isOpen) {
      return;
    }
    onSelect(chat.id);
    pointerLastTypeRef.current = null;
  };

  const handleMute = (event) => {
    event.stopPropagation();
    onToggleMute(chat.id);
    resetPosition();
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(chat.id);
    resetPosition();
  };

  const handleDesktopTrigger = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOpen) {
      resetPosition();
    } else {
      openActions();
      suppressClickRef.current = true;
    }
  };

  const actionsClassName = `chat-item-actions${isOpen ? ' visible' : ''}`;

  return (
    <li className="chat-item-container">
      <div className={actionsClassName} aria-hidden={!isOpen}>
        <button
          className="chat-action-btn mute-btn"
          type="button"
          onClick={handleMute}
          aria-label={isMuted ? 'Unmute chat' : 'Mute chat'}
        >
          <span className="chat-action-icon">{isMuted ? '🔔' : '🔕'}</span>
        </button>
        <button
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
          const pointerLastTypeRef = useRef(null);
          const suppressClickRef = useRef(false);
        
          const participants = Array.isArray(chat?.participants) ? chat.participants : [];
          const otherParticipantId = chat?.type === 'group' ? null : participants.find((p) => p && p !== currentUserId);
          const baseChatName = chat?.alias || chat?.displayName || chat?.name || 'Unknown';
          const otherParticipantName = useDisplayName(otherParticipantId, baseChatName);
          const chatDisplayName = chat?.type === 'group' ? (chat?.name || baseChatName) : otherParticipantName;
        
          const lastMessageSenderId = chat?.lastMessageSenderId && chat.lastMessageSenderId !== currentUserId ? chat.lastMessageSenderId : null;
          const lastMessageSenderName = useDisplayName(lastMessageSenderId, chat?.lastMessageSenderName || (lastMessageSenderId ? 'Someone' : ''));
          const previewText = chat?.lastMessage
            ? (lastMessageSenderId && lastMessageSenderName ? `${lastMessageSenderName}: ${chat.lastMessage}` : chat.lastMessage)
            : 'No messages yet';
          const avatarSrc = chat?.avatar || '/icons/default-avatar.png';
        
          const resetPosition = () => { setOffsetX(0); setIsOpen(false); suppressClickRef.current = false; };
          const openActions = () => { setOffsetX(-ACTION_WIDTH); setIsOpen(true); };
        
          const handlePointerDown = (event) => {
                if (event.target?.closest('.chat-action-trigger')) { return; }
            if (event.pointerType === 'mouse' && event.button !== 0) { return; }
            pointerIdRef.current = event.pointerId;
            const type = event.pointerType || 'mouse';
            pointerTypeRef.current = type;
            pointerLastTypeRef.current = type;
            pointerStartRef.current = event.clientX;
            pointerCurrentRef.current = event.clientX;
            try { event.currentTarget.setPointerCapture(event.pointerId); } catch (_) {}
        };
        
          const handlePointerMove = (event) => {
                if (pointerIdRef.current !== event.pointerId) { return; }
            if (pointerTypeRef.current !== 'touch') { return; }
            const delta = event.clientX - pointerStartRef.current;
            if (delta < 0) {
                    setOffsetX(Math.max(delta, -ACTION_WIDTH - 32));
                    if (delta <= -MIN_SWIPE_DISTANCE_TOUCH) { openActions(); suppressClickRef.current = true; }
                      } else if (isOpen) {
                              setOffsetX(Math.min(delta - ACTION_WIDTH, 0));
                      } else {
                              setOffsetX(0);
                      }
                          pointerCurrentRef.current = event.clientX;
                          event.preventDefault();
                      };
                      
                        const handlePointerUp = (event) => {
                              if (pointerIdRef.current !== event.pointerId) { return; }
                          if (pointerTypeRef.current !== 'touch') { return; }
                          const delta = (pointerCurrentRef.current ?? pointerStartRef.current) - (pointerStartRef.current ?? 0);
                          if (!isOpen && delta <= -MIN_SWIPE_DISTANCE_TOUCH) { openActions(); suppressClickRef.current = true; }
                                else if (isOpen && delta >= CLOSE_SWIPE_DISTANCE_TOUCH) { resetPosition(); }
                                else if (isOpen) { openActions(); }
                                else { resetPosition(); }
                                pointerStartRef.current = null;
                                pointerCurrentRef.current = null;
                                pointerIdRef.current = null;
                                pointerTypeRef.current = null;
                                try { event.currentTarget.releasePointerCapture(event.pointerId); } catch (_) {}
                            };
                            
                              const handleRowClick = (event) => {
                                    if (event) { event.stopPropagation(); }
                                if (suppressClickRef.current || event.target?.closest('.chat-action-trigger')) { suppressClickRef.current = false; return; }
                                if (isOpen) { return; }
                                onSelect(chat.id);
                                pointerLastTypeRef.current = null;
                            };
                            
                              const handleMute = (event) => { event.stopPropagation(); onToggleMute(chat.id); resetPosition(); };
                              const handleDelete = (event) => { event.stopPropagation(); onDelete(chat.id); resetPosition(); };
                              const handleDesktopTrigger = (event) => {
                                    event.preventDefault(); event.stopPropagation();
                                if (isOpen) { resetPosition(); } else { openActions(); suppressClickRef.current = true; }
                            };
                            
                              // Format last message time nicely
                              const formatTime = (ts) => {
                                    if (!ts) { return ''; }
                                const d = new Date(ts);
                                const now = new Date();
                                const isToday = d.toDateString() === now.toDateString();
                                const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
                                const isYesterday = d.toDateString() === yesterday.toDateString();
                                if (isToday) { return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
                                if (isYesterday) { return 'Yesterday'; }
                                return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                            };
                            
                              return (
                                <li className="chat-item-container">
                                      <div className={`chat-item-actions${isOpen ? ' visible' : ''}`} aria-hidden={!isOpen}>
                                              <button className="chat-action-btn mute-btn" type="button" onClick={handleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                                                        <span className="chat-action-icon">{isMuted ? '🔔' : '🔕'}</span>span>
                                              </button>button>
                                              <button className="chat-action-btn delete-btn" type="button" onClick={handleDelete} aria-label="Delete">
                                                        <span className="chat-action-icon">🗑️</span>span>
                                              </button>button>
                                      </div>div>
                                      <div
                                                className={`chat-item${isActive ? ' active' : ''}${isOpen ? ' open' : ''}`}
                                                onClick={handleRowClick}
                                                onPointerDown={handlePointerDown}
                                                onPointerMove={handlePointerMove}
                                                onPointerUp={handlePointerUp}
                                                onPointerCancel={handlePointerUp}
                                                style={{ transform: `translateX(${offsetX}px)` }}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(e); }
                                                            if (e.key === 'Escape' && isOpen) { resetPosition(); }
                                                }}
                                              >
                                              <div className="chat-avatar">
                                                        <img src={avatarSrc} alt={chatDisplayName} onError={(e) => { e.target.src = '/icons/default-avatar.png'; }} />
                                                {/* Online dot placeholder — extend with presence hook if available */}
                                              </div>div>
                                              <div className="chat-info">
                                                        <div className="chat-name">
                                                          {chatDisplayName}
                                                          {isMuted && <span className="chat-muted-indicator" title="Muted">🔕</span>span>}
                                                        </div>div>
                                                        <div className="chat-preview">{previewText}</div>div>
                                              </div>div>
                                              <div className="chat-meta">
                                                {chat.lastMessageAt && (
                                                            <div className="chat-time">{formatTime(chat.lastMessageAt)}</div>div>
                                                        )}
                                                {chat.unreadCount > 0 && (
                                                            <div className="unread-count">{chat.unreadCount > 99 ? '99+' : chat.unreadCount}</div>div>
                                                        )}
                                              </div>div>
                                              <button
                                                          type="button"
                                                          className="chat-action-trigger"
                                                          onClick={handleDesktopTrigger}
                                                          onMouseDown={(e) => e.stopPropagation()}
                                                          onMouseUp={(e) => e.stopPropagation()}
                                                          aria-label="Chat actions"
                                                        >⋯</button>button>
                                      </div>div>
                                </li>li>
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
                                      check();
                                      window.addEventListener('resize', check);
                                      return () => window.removeEventListener('resize', check);
                                    }, []);
                                  
                                    // Close sidebar on mobile when chat selected
                                    useEffect(() => {
                                          if (isMobile && currentChatId && isSidebarOpen) { closeSidebar(); }
                                    }, [currentChatId, isMobile, isSidebarOpen, closeSidebar]);
                                  
                                    // Keyboard shortcut: Ctrl+K / Cmd+K focuses search
                                    useEffect(() => {
                                          const handler = (e) => {
                                                  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                                                            e.preventDefault();
                                          searchRef.current?.focus();
                                    }
                                    };
                                      window.addEventListener('keydown', handler);
                                      return () => window.removeEventListener('keydown', handler);
                                    }, []);
                                  
                                    // Filter chats by search query — matches name, last message, or alias
                                    const filteredChats = useMemo(() => {
                                          const q = searchQuery.trim().toLowerCase();
                                      if (!q) { return chats; }
                                      return chats.filter((chat) => {
                                              const name = (chat?.alias || chat?.displayName || chat?.name || '').toLowerCase();
                                        const lastMsg = (chat?.lastMessage || '').toLowerCase();
                                        return name.includes(q) || lastMsg.includes(q);
                                    });
                                    }, [chats, searchQuery]);
                                  
                                    const handleChatClick = (chatId) => {
                                          if (setCurrentChatId && chatId) { setCurrentChatId(chatId); }
                                      if (isMobile) { closeSidebar(); }
                                    };
                                  
                                    const handleDeleteChat = async (chatId) => {
                                          if (!chatId) { return; }
                                      const ok = window.confirm('Delete this chat and all messages? This cannot be undone.');
                                      if (!ok) { return; }
                                      try {
                                              await chatService.deleteChat(chatId);
                                        setChats((prev) => prev.filter((c) => c.id !== chatId));
                                        if (currentChatId === chatId) { setCurrentChatId(null); }
                                        unmuteChat(chatId);
                                    } catch (err) {
                                            console.error('Failed to delete chat:', err);
                                        alert('Unable to delete this chat. Please try again.');
                                    }
                                    };
                                  
                                    const totalUnread = useMemo(() => chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0), [chats]);
                                  
                                    return (
                                      <>
                                        {isSidebarOpen && !currentChatId && (
              <div className="sidebar-backdrop" onClick={toggleSidebar} />
            )}
                                            <aside className={`sidebar${isSidebarOpen && !currentChatId ? ' open' : ''}${currentChatId ? ' hidden' : ''}`}>
                                            
                                              {/* Header */}
                                                    <div className="sidebar-header">
                                                              <div className="sidebar-header-top">
                                                                          <span className="sidebar-title">
                                                                                        Messages
                                                                            {totalUnread > 0 && (
                      <span className="sidebar-unread-total" title={`${totalUnread} unread`}>{totalUnread > 99 ? '99+' : totalUnread}</span>span>
                                                                                        )}
                                                                          </span>span>
                                                              </div>div>
                                                              <div className="search-container">
                                                                          <input
                                                                                          ref={searchRef}
                                                                                          type="search"
                                                                                          className="search-input"
                                                                                          placeholder="Search chats… (Ctrl+K)"
                                                                                          value={searchQuery}
                                                                                          onChange={(e) => setSearchQuery(e.target.value)}
                                                                                          aria-label="Search conversations"
                                                                                        />
                                                                {searchQuery && (
                    <button
                                      className="search-clear-btn"
                                      onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                                      aria-label="Clear search"
                                    >×</button>button>
                                                                          )}
                                                              </div>div>
                                                    </div>div>
                                            
                                              {/* Chat list */}
                                                    <nav className="sidebar-nav">
                                                              <div className="nav-section">
                                                                          <ul className="chat-list">
                                                                            {filteredChats.length === 0 ? (
                      <li className="sidebar-empty-state">
                        {searchQuery ? (
                                            <>
                                                                  <span className="empty-icon">🔍</span>span>
                                                                  <span className="empty-title">No results for "{searchQuery}"</span>span>
                                                                  <span className="empty-hint">Try a different name or keyword</span>span>
                                            </>>
                                          ) : (
                                            <>
                                                                  <span className="empty-icon">💬</span>span>
                                                                  <span className="empty-title">No chats yet</span>span>
                                                                  <span className="empty-hint">Start a new conversation below</span>span>
                                            </>>
                                          )}
                      </li>li>
                    ) : (
                      filteredChats.map((chat) => (
                                          <ChatListRow
                                                                key={chat.id}
                                                                chat={chat}
                                                                isActive={currentChatId === chat.id}
                                                                onSelect={handleChatClick}
                                                                currentUserId={user?.uid}
                                                                onToggleMute={toggleMuteChat}
                                                                onDelete={handleDeleteChat}
                                                                isMuted={mutedChats?.includes(chat.id)}
                                                              />
                                        ))
                    )}
                                                                          </ul>ul>
                                                              </div>div>
                                                    </nav>nav>
                                            
                                              {/* Footer */}
                                                    <div className="sidebar-footer">
                                                              <button className="new-chat-btn" onClick={openNewChatModal}>
                                                                          <span>＋</span>span>
                                                                          <span>New Chat</span>span>
                                                              </button>button>
                                                    </div>div>
                                            
                                            </aside>aside>
                                      </>>
                                    );
                                    }</></></></li>className="chat-action-btn delete-btn"
          type="button"
          onClick={handleDelete}
          aria-label="Delete chat"
        >
          <span className="chat-action-icon">🗑️</span>
        </button>
      </div>
      <div
        className={`chat-item ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleRowClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ transform: `translateX(${offsetX}px)` }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleRowClick(event);
          }
          if (event.key === 'Escape' && isOpen) {
            resetPosition();
          }
        }}
      >
        <div className="chat-avatar">
          <img
            src={avatarSrc}
            alt={chatDisplayName}
            onError={(e) => { e.target.src = '/icons/default-avatar.png'; }}
          />
        </div>
        <div className="chat-info">
          <div className="chat-name">
            {chatDisplayName}
            {isMuted && <span className="chat-muted-indicator" title="Notifications silenced">🔕</span>}
          </div>
          <div className="chat-preview">{previewText}</div>
        </div>
        <div className="chat-meta">
          {chat.lastMessageAt && (
            <div className="chat-time">
              {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="unread-count">{chat.unreadCount}</div>
          )}
        </div>
        <button
          type="button"
          className="chat-action-trigger"
          onClick={handleDesktopTrigger}
          onMouseDown={(event) => event.stopPropagation()}
          onMouseUp={(event) => event.stopPropagation()}
          aria-label="Chat actions"
        >
          ⋯
        </button>
      </div>
    </li>
  );
}

export default function Sidebar() {
  const { isSidebarOpen, openNewChatModal, toggleSidebar, closeSidebar } = useUI();
  const {
    chats = [],
    currentChatId,
    setCurrentChatId,
    mutedChats,
    toggleMuteChat,
    setChats,
    unmuteChat
  } = useChat();
  const { user } = useAuth();
  // Initialize chats from service
  useRealtimeChats();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when a chat is selected (even if changed from elsewhere)
  useEffect(() => {
    if (isMobile && currentChatId && isSidebarOpen) {
      closeSidebar();
    }
  }, [currentChatId, isMobile, isSidebarOpen, closeSidebar]);

  const handleChatClick = (chatId) => {
    if (setCurrentChatId && chatId) {
      setCurrentChatId(chatId);
    }
    // Close sidebar on mobile when chat is selected
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleToggleMute = (chatId) => {
    toggleMuteChat(chatId);
  };

  const handleDeleteChat = async (chatId) => {
    if (!chatId) {return;}
    const confirmation = window.confirm('Delete this chat and all of its messages? This cannot be undone.');
    if (!confirmation) {return;}
    try {
      await chatService.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
      unmuteChat(chatId);
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Unable to delete this chat. Please try again.');
    }
  };

  return (
    <>
      {/* Backdrop overlay on mobile when sidebar is open AND no chat is selected */}
      {isSidebarOpen && !currentChatId && (
        <div
          className="sidebar-backdrop"
          onClick={toggleSidebar}
        />
      )}
      <aside className={`sidebar ${isSidebarOpen && !currentChatId ? 'open' : ''} ${currentChatId ? 'hidden' : ''}`}>
      <div className="sidebar-header">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search chats..."
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Chats</h3>
          <ul className="chat-list">
            {chats.length === 0 ? (
              <li style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No chats yet
              </li>
            ) : (
              chats.map((chat) => (
                <ChatListRow
                  key={chat.id}
                  chat={chat}
                  isActive={currentChatId === chat.id}
                  onSelect={handleChatClick}
                  currentUserId={user?.uid}
                  onToggleMute={handleToggleMute}
                  onDelete={handleDeleteChat}
                  isMuted={mutedChats?.includes(chat.id)}
                />
              ))
            )}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="new-chat-btn" onClick={openNewChatModal}>
          <span>+</span>
          <span>New Chat</span>
        </button>
      </div>
      </aside>
    </>
  );
}

