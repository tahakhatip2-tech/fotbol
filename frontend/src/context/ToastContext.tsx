import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms — 0 means persist until closed
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++counterRef.current}-${Date.now()}`;
    const duration = toast.type === 'error' ? 0 : (toast.duration ?? 4000);

    setToasts((prev) => [...prev, { ...toast, id, duration }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// ─── useToast hook ────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');

  const { addToast } = ctx;

  return {
    toast: {
      success: (message: string, title?: string) =>
        addToast({ type: 'success', message, title }),
      error: (message: string, title?: string) =>
        addToast({ type: 'error', message, title }),
      info: (message: string, title?: string) =>
        addToast({ type: 'info', message, title }),
      warning: (message: string, title?: string) =>
        addToast({ type: 'warning', message, title }),
      custom: (toast: Omit<Toast, 'id'>) =>
        addToast(toast),
    },
  };
};

export { ToastContext };
