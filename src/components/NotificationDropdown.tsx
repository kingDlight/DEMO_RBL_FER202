import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePlayer } from '../context/player';
import { useToast } from '../context/ToastContext';

type NotificationTone = 'primary' | 'secondary' | 'tertiary' | 'info';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: string;
  tone: NotificationTone;
  unread: boolean;
  actionLabel?: string;
  actionPath?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 'local-library-synced',
    title: 'Local library synced',
    body: 'Tracks from G:\\Music are ready across Discover, Library, and Playlists.',
    time: 'Just now',
    icon: 'library_music',
    tone: 'secondary',
    unread: true,
    actionLabel: 'Open Library',
    actionPath: '/library',
  },
  {
    id: 'playlist-updated',
    title: 'Local Music Mix updated',
    body: 'The playlist tab now uses real files from your local music folder.',
    time: 'Today',
    icon: 'queue_music',
    tone: 'primary',
    unread: true,
    actionLabel: 'View Playlist',
    actionPath: '/playlist',
  },
  {
    id: 'category-picks-ready',
    title: 'Category picks are live',
    body: 'Browse Pop, Hip-Hop, EDM, and more in Discover.',
    time: 'New',
    icon: 'explore',
    tone: 'tertiary',
    unread: false,
    actionLabel: 'Explore',
    actionPath: '/tracks',
  },
];

const toneClass: Record<NotificationTone, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  tertiary: 'bg-tertiary/10 text-tertiary',
  info: 'bg-surface-container-high text-on-surface-variant',
};

const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const isStoredNotification = (id: string) => !id.startsWith('now-playing-');

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useLocalStorage<NotificationItem[]>(
    'auralis_notifications',
    initialNotifications,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { track, isPlaying, hasActiveTrack } = usePlayer();

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const visibleNotifications = useMemo<NotificationItem[]>(() => {
    const nowPlaying: NotificationItem[] = hasActiveTrack
      ? [
          {
            id: `now-playing-${track.id ?? track.title}`,
            title: isPlaying ? 'Now playing' : 'Playback paused',
            body: `${track.title} - ${track.artist}`,
            time: isPlaying ? 'Playing now' : 'Paused',
            icon: isPlaying ? 'graphic_eq' : 'pause_circle',
            tone: isPlaying ? 'secondary' : 'info',
            unread: false,
            actionLabel: 'Open Discover',
            actionPath: '/tracks',
          },
        ]
      : [];

    return [...nowPlaying, ...notifications];
  }, [hasActiveTrack, isPlaying, notifications, track.artist, track.id, track.title]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const markAsRead = (id: string) => {
    if (!isStoredNotification(id)) return;

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
    addToast('All notifications marked as read', 'success');
  };

  const clearAll = () => {
    setNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  const restoreDefaults = () => {
    setNotifications(initialNotifications);
    addToast('Notifications restored', 'success');
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    if (notification.actionPath) {
      navigate(notification.actionPath);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:text-primary"
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-on-primary">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed right-container-margin-mobile top-20 z-[90] flex max-h-[calc(100vh-104px)] w-[calc(100vw-32px)] max-w-[392px] flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-low shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[392px]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-start justify-between gap-md border-b border-outline-variant/20 p-md">
            <div>
              <h2 className="font-headline-md text-[20px] font-bold leading-tight text-on-surface">
                Notifications
              </h2>
              <p className="mt-xs font-label-sm text-label-sm text-on-surface-variant">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>

            <div className="flex items-center gap-xs">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="rounded-lg px-sm py-xs font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                Read all
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-white/5 hover:text-error disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Clear notifications"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
            </div>
          </div>

          <div className="max-h-[440px] overflow-y-auto p-sm">
            {visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-lg py-xl text-center">
                <span className="material-symbols-outlined mb-sm text-4xl text-on-surface-variant/40">
                  notifications_off
                </span>
                <p className="font-label-md text-label-md text-on-surface">No notifications</p>
                <p className="mt-xs max-w-[260px] text-sm text-on-surface-variant">
                  New library, playlist, and playback updates will appear here.
                </p>
                <button
                  type="button"
                  onClick={restoreDefaults}
                  className="mt-md rounded-full border border-outline-variant px-md py-sm font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  Restore demo alerts
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-xs">
                {visibleNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className="group flex w-full items-start gap-md rounded-xl p-sm text-left transition-colors hover:bg-white/5"
                  >
                    <span
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneClass[notification.tone]}`}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={notification.unread ? filledIconStyle : undefined}
                      >
                        {notification.icon}
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-sm">
                        <span className="truncate font-label-md text-label-md text-on-surface">
                          {notification.title}
                        </span>
                        {notification.unread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="mt-xs line-clamp-2 text-sm leading-5 text-on-surface-variant">
                        {notification.body}
                      </span>
                      <span className="mt-sm flex items-center gap-sm font-label-sm text-label-sm text-on-surface-variant">
                        <span>{notification.time}</span>
                        {notification.actionLabel && (
                          <>
                            <span aria-hidden="true">&bull;</span>
                            <span className="text-primary group-hover:underline">
                              {notification.actionLabel}
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
