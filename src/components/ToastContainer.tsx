import { useStore } from '../store/useStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-olive" />,
    error: <AlertCircle className="w-5 h-5 text-tomato" />,
    info: <Info className="w-5 h-5 text-espresso-light" />,
  };

  const bgMap = {
    success: 'bg-olive/10 border-olive/30',
    error: 'bg-tomato/10 border-tomato/30',
    info: 'bg-latte/50 border-gold/30',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <p className="text-sm font-medium text-espresso flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-warm-gray hover:text-espresso transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
