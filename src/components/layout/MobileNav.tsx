import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, Wrench, Shield, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MobileNav: FC = () => {
  const { isWhiteYellow } = useTheme();

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t px-2 py-2 transition-colors ${
      isWhiteYellow
        ? 'bg-white/95 border-zinc-200/90 shadow-lg text-zinc-600'
        : 'bg-[#0c0c0e]/95 border-zinc-800/80 text-zinc-400'
    }`}>
      <div className="flex items-center justify-around">
        
        {/* Feed */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive 
                ? isWhiteYellow ? 'text-yellow-600 font-bold scale-105' : 'text-white' 
                : isWhiteYellow ? 'text-zinc-500 hover:text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Feed</span>
        </NavLink>

        {/* Explore */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive 
                ? isWhiteYellow ? 'text-yellow-600 font-bold scale-105' : 'text-white' 
                : isWhiteYellow ? 'text-zinc-500 hover:text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </NavLink>

        {/* Ask Mechanic (Pro) */}
        <NavLink
          to="/pro"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive 
                ? isWhiteYellow ? 'text-yellow-600 font-bold scale-105' : 'text-blue-400' 
                : isWhiteYellow ? 'text-zinc-500 hover:text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <Wrench className="w-4 h-4" />
          <span>Pro</span>
        </NavLink>

        {/* Communities */}
        <NavLink
          to="/communities"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive 
                ? isWhiteYellow ? 'text-yellow-600 font-bold scale-105' : 'text-white' 
                : isWhiteYellow ? 'text-zinc-500 hover:text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <Users className="w-4 h-4" />
          <span>Clubs</span>
        </NavLink>

        {/* About & Case Study */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive 
                ? isWhiteYellow ? 'text-yellow-600 font-bold scale-105' : 'text-white' 
                : isWhiteYellow ? 'text-zinc-500 hover:text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <FileText className="w-4 h-4" />
          <span>About</span>
        </NavLink>

        {/* My Garage */}
        <NavLink
          to="/car/car-maya-m3"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive 
                ? isWhiteYellow ? 'text-emerald-700 font-bold scale-105' : 'text-emerald-400' 
                : isWhiteYellow ? 'text-zinc-500 hover:text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <Shield className="w-4 h-4" />
          <span>Garage</span>
        </NavLink>

      </div>
    </nav>
  );
};
