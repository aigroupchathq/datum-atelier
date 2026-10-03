import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, Wrench, FileText } from 'lucide-react';
import { useActiveVehicle } from '../../context/ActiveVehicleContext';

export const MobileNav: FC = () => {
  const { activeVehicle } = useActiveVehicle();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t px-2 py-1.5 transition-colors duration-300 shadow-2xl"
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
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
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
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </NavLink>

        {/* My Atelier (Active Vehicle Centered) */}
        <NavLink
          to={`/car/${activeVehicle.id}`}
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-0.5 px-2.5 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <div className="relative">
            <img
              src={activeVehicle.heroImage}
              alt={activeVehicle.name}
              className="w-5 h-5 rounded-full object-cover border border-white/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
          </div>
          <span className="font-mono-numbers uppercase tracking-wider">{activeVehicle.name}</span>
        </NavLink>

        {/* Clubs */}
        <NavLink
          to="/communities"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Users className="w-4 h-4" />
          <span>Clubs</span>
        </NavLink>

        {/* Ask Mechanic (Pro) */}
        <NavLink
          to="/pro"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <Wrench className="w-4 h-4" />
          <span>Pro</span>
        </NavLink>

        {/* Case Study */}
        <NavLink
          to="/about"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-muted)'
          })}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'font-bold scale-105' : 'hover:opacity-100 opacity-80'
            }`
          }
        >
          <FileText className="w-4 h-4" />
          <span>About</span>
        </NavLink>

      </div>
    </nav>
  );
};
