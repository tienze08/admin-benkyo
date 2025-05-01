import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';
import { RequestStatus } from '@/lib/types';
import { toast } from 'sonner';

interface ReviewFormProps {
  requestId: string;
  onReviewSubmit: (status: RequestStatus, note: string) => void;
}

export function ReviewForm({ onReviewSubmit }: ReviewFormProps) {
  const [status, setStatus] = useState<RequestStatus | null>(null);
  const [note, setNote] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status) {
      toast.error('Please select approve or reject before submitting');
      return;
    }
    
    if (status === 'rejected' && !note.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    onReviewSubmit(status, note);
    toast.success(`Request ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Review Note</label>
        <Textarea
          placeholder="Add your review notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="resize-none border-sidebar-border"
        />
        <p className="text-xs text-muted-foreground">
          {status === 'rejected' ? 'Required: Please provide reason for rejection' : 'Optional for approvals'}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant={status === 'approved' ? 'default' : 'outline'}
          className={`flex-1 border-sidebar-border ${status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}
          onClick={() => setStatus('approved')}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>Approve</span>
        </Button>
        
        <Button
          type="button"
          variant={status === 'rejected' ? 'default' : 'outline'}
          className={`flex-1  border-sidebar-border ${status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 hover:text-red-700 hover:border-red-200'}`}
          onClick={() => setStatus('rejected')}
        >
          <XCircle className="h-4 w-4 mr-2" />
          <span>Reject</span>
        </Button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full border-sidebar-border bg-dashboard-purple hover:bg-dashboard-purple/90 text-white"
        disabled={!status || (status === 'rejected' && !note.trim())}
      >
        Submit Review
      </Button>
    </form>
  );
}
