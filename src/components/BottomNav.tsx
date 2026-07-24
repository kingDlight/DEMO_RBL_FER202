import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/tracks', icon: 'search', label: 'Discover' },
  { path: '/library', icon: 'library_music', label: 'Library' },
  { path: '/artists', icon: 'artist', label: 'Artists' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around border-t border-outline-variant/10 bg-surface-dim/80 pb-4 pt-2 backdrop-blur-xl md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-16 transition-colors ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`flex h-8 w-16 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-primary-container/30' : ''}`}>
                <span 
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
              </div>
              <span className="font-label-sm text-[10px] tracking-wide">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
