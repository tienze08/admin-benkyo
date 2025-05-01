import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { RequestStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Determine badge styling based on status
  const statusConfig = {
    pending: {
      icon: Clock,
      variant: 'outline',
      text: 'Pending',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    },
    approved: {
      icon: CheckCircle,
      variant: 'outline', 
      text: 'Approved',
      className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    },
    rejected: {
      icon: XCircle,
      variant: 'outline',
      text: 'Rejected',
      className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    }
  };
  
  const { icon: Icon, text, className: statusClassName } = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors',
        statusClassName,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </Badge>
  );
}
