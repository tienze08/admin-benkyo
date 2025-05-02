import { Link, useNavigate, useParams } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReviewForm } from '@/components/ReviewForm';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarIcon, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useRequestById, useReviewRequest } from '@/hooks/use-requests';
import { RequestStatus } from '@/lib/types';


const ReviewRequest = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { data: request, isLoading, error } = useRequestById(id as string);
    const reviewRequest = useReviewRequest();

    if (isLoading) {
      return <DashboardLayout><div className="p-4">Loading...</div></DashboardLayout>;
    }
    
    if (error) {
      return <DashboardLayout><div className="p-4 text-red-500">Failed to load request.</div></DashboardLayout>;
    }
    
    if (!request) {
      return <DashboardLayout><div className="p-4 text-red-500">Request not found.</div></DashboardLayout>;
    } 
  
    console.log("Request data:", request);

  const handleReviewSubmit = async (status: RequestStatus | null, note: string) => {
    console.log(`Review result for ${request.id}:`, { status, note });
    if (status !== null) {
      await reviewRequest.mutateAsync({ id: request.id, status, note });
    } else {
      console.error("Invalid status: status cannot be null.");
    }
    navigate('/decks');
  };

  
  return (
    <DashboardLayout>
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <Button variant="outline" size="sm" asChild className="mb-2">
                <Link to="/decks" className="border-sidebar-border">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Back</span>
                </Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{request.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={request.status} />
                <span className="text-sm text-muted-foreground">
                    {request.id && `ID: ${request.id}`}
                </span>
                </div>
            </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card className="glass-card border-sidebar-border">
                <CardHeader>
                    <CardTitle>Deck Details</CardTitle>
                    <CardDescription>
                    Information about the flashcard deck
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1">{request.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Cards</span>
                        <div className="flex items-center mt-1">
                            <Layers className="h-4 w-4 mr-2 text-primary text-dashboard-blue" />
                            <span>{request.cardsCount} cards</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Created At</span>
                        <div className="flex items-center mt-1">
                        <CalendarIcon className="h-4 w-4 mr-2 text-primary text-dashboard-blue" />
                        <span>{format(new Date(request.createdAt), 'PPP')}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Updated At</span>
                        <div className="flex items-center mt-1">
                        <CalendarIcon className="h-4 w-4 mr-2 text-primary text-dashboard-blue" />
                        <span>{format(new Date(request.updatedAt), 'PPP')}</span>
                        </div>
                    </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Sample Cards</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(index => (
                        <div 
                            key={index} 
                            className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors border-sidebar-border"
                        >
                            <div className="flex justify-between items-center mb-2 ">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs bg-dashboard-purple text-white">
                                    Card {index}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium mb-1">
                            {request.title.includes('Spanish') 
                                ? `¿Cómo se dice "${['hello', 'thank you', 'please', 'goodbye'][index - 1]}" en español?` 
                                : request.title.includes('Javascript') 
                                ? ['What is a closure?', 'Explain Promise chaining', 'What is the event loop?', 'Describe destructuring'][index - 1]
                                : `Sample Question ${index}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                            {request.title.includes('Spanish') 
                                ? `${['Hola', 'Gracias', 'Por favor', 'Adiós'][index - 1]}` 
                                : request.title.includes('Javascript') 
                                ? ['A function with access to its outer scope...', 'Using .then() to handle results sequentially', 'Mechanism that handles async operations', 'Unpacking values from arrays or objects'][index - 1]
                                : `Sample Answer ${index}`}
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>
                </CardContent>
                </Card>
                
                {request.status !== 1 && (
                <Card className="glass-card border-sidebar-border">
                    <CardHeader>
                    <CardTitle>Review Details</CardTitle>
                    <CardDescription>
                        This request was {request.status} by {request.reviewedBy?.name}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Review Note</h3>
                        <p>{request.reviewNote || 'No notes provided.'}</p>
                    </div>
                    </CardContent>
                </Card>
                )}
            </div>
            
            <div className="space-y-6 ">
                <Card className="glass-card border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Creator</CardTitle>
                        <CardDescription>
                        Information about the deck creator
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={request.creator.avatar} />
                            <AvatarFallback>{request.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium">{request.creator.name}</h3>
                            <p className="text-sm text-muted-foreground">Creator</p>
                        </div>
                        </div>
                         
                        <div className="mt-4 ">
                        <div className="flex items-center justify-between py-2 border-b border-sidebar-border">
                            <span className="text-sm text-muted-foreground">User ID</span>
                            <span className="text-sm">{request.creator.id}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-sidebar-border">
                            <span className="text-sm text-muted-foreground">Decks Created</span>
                            <span className="text-sm">12</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-sidebar-border">
                            <span className="text-sm text-muted-foreground">Public Decks</span>
                            <span className="text-sm">5</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-sidebar-border">
                            <span className="text-sm text-muted-foreground">Member Since</span>
                            <span className="text-sm">Mar 2022</span>
                        </div>
                        </div>
                    </CardContent>
                </Card>
                
                {request.status === 1 && (
                    <Card className="glass-card border-sidebar-border">
                        <CardHeader>
                        <CardTitle>Review Decision</CardTitle>
                        <CardDescription>
                            Approve or reject this public deck request
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                        <ReviewForm
                            className="space-y-4"  // Now it works
                            requestId={request.id} 
                            onReviewSubmit={handleReviewSubmit}
                        />
                        </CardContent>
                    </Card>
                )}
            </div>
            </div>
        </div>
    </DashboardLayout>
    
  );
};

export default ReviewRequest;