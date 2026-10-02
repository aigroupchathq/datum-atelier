import type { FC, ReactNode } from 'react';
import { X } from 'lucide-react';
import type { ToastItem } from '../../context/ToastContext';
import { useFluidDraggable } from '../../core/motion/useFluidDraggable';
import { FLUID_PRESETS } from '../../core/motion/fluidPhysics';

interface FluidToastItemProps {
  toast: ToastItem;
  icon: ReactNode;
  onRemove: (id: string) => void;
}

export const FluidToastItem: FC<FluidToastItemProps> = ({ toast, icon, onRemove }) => {
  const { ref, bind } = useFluidDraggable<HTMLDivElement>({
    config: FLUID_PRESETS.floatingHud,
    axis: 'x',
    dismissThreshold: 110,
    dismissVelocity: 500,
    onDismiss: () => onRemove(toast.id),
    ambientLevitation: true
  });

  return (
    <div
      ref={ref}
      {...bind}
      className="pointer-events-auto cursor-grab active:cursor-grabbing flex items-start gap-3 p-3.5 rounded-xl bg-[#141418]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl text-left select-none"
      style={{
        ...bind.style,
        boxShadow: '0 12px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)'
      }}
    >
      <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07] shrink-0 mt-0.5">
        {icon}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 justify-between">
          <p className="text-xs font-bold text-[#F4F4F5] tracking-tight truncate">
            {toast.title}
          </p>
          {toast.badge && (
            <span className="text-[9px] font-mono-numbers px-1.5 py-0.2 rounded bg-white/[0.08] text-zinc-400 border border-white/[0.06] shrink-0 uppercase">
              {toast.badge}
            </span>
          )}
        </div>
        {toast.message && (
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
        className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded transition shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
