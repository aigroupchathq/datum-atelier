import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, Wrench, Shield, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MobileNav: FC = () => {
  const { themeMeta } = useTheme();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t px-2 py-2 transition-colors duration-300 shadow-2xl"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-secondary)'
      }}
    >
      <div className="flex items-center justify-around">
        
        {/* Feed */}
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Feed</span>
        </NavLink>

        {/* Explore */}
        <NavLink
          to="/explore"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </NavLink>

        {/* Ask Mechanic (Pro) */}
        <NavLink
          to="/pro"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Wrench className="w-4 h-4" />
          <span>Pro</span>
        </NavLink>

        {/* Communities */}
        <NavLink
          to="/communities"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Users className="w-4 h-4" />
          <span>Clubs</span>
        </NavLink>

        {/* About & Case Study */}
        <NavLink
          to="/about"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <FileText className="w-4 h-4" />
          <span>About</span>
        </NavLink>

        {/* My Garage */}
        <NavLink
          to="/car/car-maya-m3"
          style={({ isActive }) => ({
            color: isActive ? themeMeta.accentHex : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
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
