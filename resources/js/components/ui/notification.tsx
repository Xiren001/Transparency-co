import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationProps {
  title: string;
  description: string;
  onClose: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export function Notification({ title, description, onClose, type = 'info' }: NotificationProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg ${getTypeStyles()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="mt-1 text-sm opacity-90">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-2 h-6 w-6 p-0 hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
