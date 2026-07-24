import React from 'react';
import { NavLink } from 'react-router-dom';

const mobileItems = [
  { label: 'Play', icon: 'play_circle', to: '/' },
  { label: 'Queue', icon: 'queue_music', to: '/playlist' },
  { label: 'Lyrics', icon: 'match_case', to: '/tracks' },
  { label: 'Volume', icon: 'volume_up', to: '/tracks' },
];

const Footer: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-24 w-full items-center justify-between bg-surface/80 px-xl py-md shadow-[0px_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-lg md:hidden">
      {mobileItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `flex min-w-14 flex-col items-center justify-center font-label-sm text-label-sm no-underline transition-all duration-300 active:scale-90 ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined mb-xs">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Footer;
