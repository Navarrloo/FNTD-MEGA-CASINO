import React from 'react';
import { HomeIcon, AdminIcon, WikiIcon, CasinoIcon, ProfileIcon } from './icons/Icons';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: 'main' | 'wiki' | 'casino' | 'profile' | 'admin') => void;
  isAdmin: boolean;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  activeColor: string;
}> = ({ label, icon, isActive, onClick, activeColor }) => {
  
  const octagonPoints = "29.4,2.5 55.6,15.6 63.5,45.5 48.1,66.5 19.9,66.5 4.5,45.5 12.4,15.6";

  return (
    <button onClick={onClick} className="flex flex-col items-center justify-start transition-transform duration-200 group w-20 text-center focus:outline-none">
      <div className="w-[72px] h-[72px] relative mb-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
           style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
      >
        <svg viewBox="0 0 68 69" className="absolute w-full h-full transition-all duration-300" style={{ filter: isActive ? `drop-shadow(0 0 8px ${activeColor})` : 'drop-shadow(0 1px 2px #000)' }}>
            <defs>
                <radialGradient id={`grad-${label.replace(/\s+/g, '-')}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: isActive ? activeColor : '#3a3d4a', stopOpacity: isActive ? 0.6 : 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#1a1d2a', stopOpacity: 1 }} />
                </radialGradient>
                 <linearGradient id={`border-grad-${label.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: isActive ? activeColor : '#6c7182', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: isActive ? '#6c7182' : '#2a2d3a', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <polygon 
                points={octagonPoints} 
                fill={`url(#grad-${label.replace(/\s+/g, '-')})`}
                stroke={`url(#border-grad-${label.replace(/\s+/g, '-')})`}
                strokeWidth="2"
                className="transition-all duration-300"
            />
        </svg>
        <div className={`relative transition-all duration-300 ${isActive ? 'text-white' : 'text-text-dark group-hover:text-text-light'}`}>
            {icon}
        </div>
      </div>
      <span 
        className={`text-xs uppercase font-bold transition-colors duration-200 ${!isActive ? 'text-text-dark group-hover:text-text-light' : ''}`}
        style={{ color: isActive ? activeColor : undefined }}
      >
          {label}
      </span>
    </button>
  );
};

const NavBar: React.FC<NavBarProps> = ({ activePage, setActivePage, isAdmin }) => {
   const colors = {
    green: 'var(--accent-green)',
    yellow: 'var(--accent-yellow)',
    purple: 'var(--accent-purple)',
    red: 'var(--accent-red)',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/60 backdrop-blur-md border-t border-border-dark/50">
      <div className="flex justify-around items-start h-full pt-2">
        <NavItem
          label="Main"
          icon={<HomeIcon className="w-8 h-8"/>}
          isActive={activePage === 'main'}
          onClick={() => setActivePage('main')}
          activeColor={colors.yellow}
        />
        <NavItem
          label="Wiki"
          icon={<WikiIcon className="w-8 h-8"/>}
          isActive={activePage === 'wiki'}
          onClick={() => setActivePage('wiki')}
          activeColor={colors.green}
        />
        <NavItem
          label="Casino"
          icon={<CasinoIcon className="w-8 h-8"/>}
          isActive={activePage === 'casino'}
          onClick={() => setActivePage('casino')}
          activeColor={colors.purple}
        />
        <NavItem
          label="Profile"
          icon={<ProfileIcon className="w-8 h-8"/>}
          isActive={activePage === 'profile'}
          onClick={() => setActivePage('profile')}
          activeColor={colors.green}
        />
        {isAdmin && (
          <NavItem
            label="Admin"
            icon={<AdminIcon className="w-8 h-8"/>}
            isActive={activePage === 'admin'}
            onClick={() => setActivePage('admin')}
            activeColor={colors.red}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
