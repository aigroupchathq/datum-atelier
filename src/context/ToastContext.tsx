import { createContext, useContext, useState, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { ShieldCheck, Compass, CheckCircle2, Heart, Copy, Sparkles, X } from 'lucide-react';

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
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[#141418]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl text-left animate-in slide-in-from-top-3 fade-in duration-200 transition-all hover:border-white/[0.2]"
            style={{
              boxShadow: '0 12px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)'
            }}
          >
            <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07] shrink-0 mt-0.5">
              {TOAST_ICONS[toast.type || 'success']}
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
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
