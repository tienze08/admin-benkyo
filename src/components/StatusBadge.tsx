// StatusBadge.tsx

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { RequestStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

// Mapping from numeric status to display config
const statusConfig: Record<RequestStatus, {
  icon: React.ElementType;
  variant: string;
  text: string;
  className: string;
}> = {
  1: {
    icon: Clock,
    variant: 'outline',
    text: 'Pending',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
  },
  2: {
    icon: CheckCircle,
    variant: 'outline',
    text: 'Approved',
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
  },
  3: {
    icon: XCircle,
    variant: 'outline',
    text: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const { icon: Icon, text, className: statusClassName } = config;

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
