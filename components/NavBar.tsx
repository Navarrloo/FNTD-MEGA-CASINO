import React from 'react';
import { WikiIcon, CasinoIcon, ProfileIcon, AdminIcon, HomeIcon } from './icons/Icons';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: 'main' | 'wiki' | 'casino' | 'profile' | 'admin') => void;
  isAdmin: boolean;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center transition-colors duration-200 group w-20 text-center">
       <div className={`w-16 h-16 flex items-center justify-center transition-all duration-200 mb-1 ${isActive ? 'scale-110' : ''}`}>
         {/* Using SVG for hexagon shape */}
         <svg viewBox="0 0 100 86.6" className={`absolute w-16 h-16 transition-all duration-200 ${isActive ? 'fill-accent-green' : 'fill-border-dark group-hover:fill-border-light'}`}>
            <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" />
         </svg>
         <div className={`relative transition-all duration-200 ${isActive ? 'text-background-dark' : 'text-text-light'}`}>
            {icon}
         </div>
       </div>
        <span className={`text-sm transition-colors duration-200 ${isActive ? 'text-accent-green' : 'text-text-dark group-hover:text-text-light'}`}>
            {label}
        </span>
    </button>
  );
};

const NavBar: React.FC<NavBarProps> = ({ activePage, setActivePage, isAdmin }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/50 backdrop-blur-md">
      <div className="flex justify-center items-start h-full pt-1 space-x-4">
        <NavItem
          label="Main"
          icon={<HomeIcon className="w-8 h-8"/>}
          isActive={activePage === 'main'}
          onClick={() => setActivePage('main')}
        />
        <NavItem
          label="Wiki"
          icon={<WikiIcon className="w-8 h-8"/>}
          isActive={activePage === 'wiki'}
          onClick={() => setActivePage('wiki')}
        />
        <NavItem
          label="Casino"
          icon={<CasinoIcon className="w-8 h-8"/>}
          isActive={activePage === 'casino'}
          onClick={() => setActivePage('casino')}
        />
        <NavItem
          label="Profile"
          icon={<ProfileIcon className="w-8 h-8"/>}
          isActive={activePage === 'profile'}
          onClick={() => setActivePage('profile')}
        />
        {isAdmin && (
          <NavItem
            label="Admin"
            icon={<AdminIcon className="w-8 h-8"/>}
            isActive={activePage === 'admin'}
            onClick={() => setActivePage('admin')}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;