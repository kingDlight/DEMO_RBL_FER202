import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SearchModal } from './SearchModal';
import NotificationDropdown from './NotificationDropdown';

const baseNavClass =
  'font-label-md text-label-md whitespace-nowrap no-underline transition-colors duration-200 pb-1';

const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTg8VkseEGshlJyDJl3zOxhjVRqqcni8WUrUKI7dke9DGKJD1kD2tSp0Gm2buR-icHfSNVitLMYdTAYTFQ3g7yhaxYJbGgRS_TeDcBIGB_i8UbCeN1EN3XQySwT-wzRd0FQKIrvHvRnEa0rn8-egL2O8q-nXWqChRemhOIiUwUSMeQECY6DJY_HBkxoT8GyWhZR3pGHwqIm2u4QqM17Z5CGDtYenZZAu9nRFc-Ylo4KhwLj_QzxVi1lOqmjKpGU5HrX7JnHYEpP80';

const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open profile menu"
      >
        <img
          alt="User profile avatar"
          className="h-full w-full rounded-full object-cover"
          src={user?.avatar || defaultAvatar}
          title={user?.name}
        />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 top-full z-[70] mt-2 flex w-48 flex-col rounded-xl border border-on-surface/10 bg-surface-container-high p-xs shadow-xl animate-in fade-in slide-in-from-top-2"
          role="menu"
        >
          <div className="px-md py-sm border-b border-on-surface/10 mb-xs">
            <p className="font-label-md text-on-surface truncate">{user?.name || user?.username}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate('/profile');
            }}
            className="flex items-center gap-sm rounded-lg px-md py-sm text-left font-label-md text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface"
            role="menuitem"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-sm rounded-lg px-md py-sm text-left font-label-md text-error hover:bg-error-container/20"
            role="menuitem"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const prefetchTracks = () => import('../pages/TrackListPage');
  const prefetchLibrary = () => import('../pages/LibraryPage');
  const prefetchPlaylist = () => import('../pages/PlaylistPage');
  const prefetchAdmin = () => import('../pages/ArtistsPage');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-outline-variant/10 bg-surface-dim/70 px-container-margin-mobile shadow-2xl backdrop-blur-xl md:px-container-margin-desktop">
        <div className="flex min-w-0 items-center gap-xl">
          <Link to="/" className="flex shrink-0 items-center gap-sm no-underline">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-primary-container">
              <div className="absolute inset-[2px] rounded-full border border-secondary/70 border-l-transparent border-t-primary" />
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-on-surface/15 bg-surface-container-high shadow-sm">
                <span
                  className="material-symbols-outlined text-[14px] text-on-surface"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </div>
            </div>
            <span className="whitespace-nowrap font-display text-headline-md font-extrabold text-primary">
              Auralis
            </span>
          </Link>

          <div className="hidden shrink-0 items-center gap-lg md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${baseNavClass} ${
                  isActive
                    ? 'border-b-2 border-primary font-bold text-primary'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/tracks"
              onMouseEnter={prefetchTracks}
              className={({ isActive }) =>
                `${baseNavClass} ${
                  isActive
                    ? 'border-b-2 border-primary font-bold text-primary'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/library"
              onMouseEnter={prefetchLibrary}
              className={({ isActive }) =>
                `${baseNavClass} ${
                  isActive
                    ? 'border-b-2 border-primary font-bold text-primary'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Library
            </NavLink>
            <NavLink
              to="/playlist"
              onMouseEnter={prefetchPlaylist}
              className={({ isActive }) =>
                `${baseNavClass} ${
                  isActive
                    ? 'border-b-2 border-primary font-bold text-primary'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Playlists
            </NavLink>
            <NavLink
              to="/artists"
              onMouseEnter={prefetchAdmin}
              className={({ isActive }) =>
                `${baseNavClass} ${
                  isActive
                    ? 'border-b-2 border-primary font-bold text-primary'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Artists
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseNavClass} ${
                    isActive
                      ? 'border-b-2 border-primary font-bold text-primary'
                      : 'font-medium text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-md">
          {/* Global Search Button (Ctrl+K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group hidden w-[240px] items-center justify-between rounded-full border border-outline-variant/30 bg-surface-container/50 px-md py-xs text-on-surface-variant transition-colors hover:border-primary-container/50 hover:bg-surface-container sm:flex"
          >
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="font-label-md">Search</span>
            </div>
            <kbd className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-on-surface shadow-sm">
              Ctrl K
            </kbd>
          </button>
          
          {/* Mobile search icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-variant sm:hidden"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <NotificationDropdown />

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:text-primary"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            <span className="material-symbols-outlined text-2xl">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="hidden whitespace-nowrap rounded-xl bg-primary-container px-4 py-2 font-label-md text-label-md text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary md:block"
            >
              Login
            </Link>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
