import { useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';
import type { Toast, ToastType } from '../../context/ToastContext';

// ─── Config per type ──────────────────────────────────────────────────────────
const CONFIG: Record<ToastType, {
  icon: React.ReactNode;
  bar: string;
  border: string;
  iconBg: string;
  iconColor: string;
}> = {
  success: {
    icon: <CheckCircle size={18} />,
    bar: 'bg-emerald-500',
    border: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  error: {
    icon: <XCircle size={18} />,
    bar: 'bg-rose-500',
    border: 'border-l-rose-500',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  info: {
    icon: <Info size={18} />,
    bar: 'bg-blue-500',
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    bar: 'bg-amber-400',
    border: 'border-l-amber-400',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const config = CONFIG[toast.type];
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? (toast.type === 'error' ? 0 : 4000);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Slide-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!duration) return;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onRemove, 300);
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 bg-white rounded-xl shadow-lg
        border border-slate-200 border-l-4 ${config.border}
        w-[340px] max-w-[calc(100vw-2rem)] p-3.5 overflow-hidden
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{toast.title}</p>
        )}
        <p className={`text-xs text-slate-600 leading-snug ${toast.title ? '' : 'font-semibold text-slate-800'}`}>
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-0.5 rounded-md transition-colors mt-0.5"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${config.bar} transition-none rounded-b-xl`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Toaster Container ────────────────────────────────────────────────────────
export const Toaster = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, removeToast } = ctx;

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[9999] flex flex-col gap-2.5 bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 items-center sm:items-start"
      dir="rtl"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
