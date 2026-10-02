import { createContext, useContext, useState, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { ShieldCheck, Compass, CheckCircle2, Heart, Copy, Sparkles } from 'lucide-react';
import { FluidToastItem } from '../components/common/FluidToastItem';

export type ToastType = 'privacy' | 'drive' | 'kudos' | 'clipboard' | 'garage' | 'success';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  badge?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

const TOAST_ICONS: Record<ToastType, ReactNode> = {
  privacy: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
  drive: <Compass className="w-4 h-4 text-amber-400" />,
  kudos: <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />,
  clipboard: <Copy className="w-4 h-4 text-zinc-300" />,
  garage: <Sparkles className="w-4 h-4 text-amber-400" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'success', badge, duration = 3400 }: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, message, type, badge, duration }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating HUD Toast Stack */}
      <div 
        aria-live="polite" 
        className="fixed top-18 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-2"
      >
        {toasts.map((toast) => (
          <FluidToastItem
            key={toast.id}
            toast={toast}
            icon={TOAST_ICONS[toast.type || 'success']}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
