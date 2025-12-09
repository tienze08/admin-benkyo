import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { RequestStatus } from "@/lib/types";
import { toast } from "sonner";

interface ReviewFormProps {
    requestId: string;
    onReviewSubmit: (status: RequestStatus, note: string) => void;
    className?: string;
}

export function ReviewForm({ onReviewSubmit, className }: ReviewFormProps) {
    const [status, setStatus] = useState<RequestStatus | null>(null);
    const [note, setNote] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!status) {
            toast.error("Please select approve or reject before submitting");
            return;
        }

        if (status === 3 && !note.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        try {
            await onReviewSubmit(status, note);
            toast.success(
                `Request ${status === 2 ? "approved" : "rejected"} successfully`
            );

            setStatus(null);
            setNote("");
        } catch (error) {
            toast.error(
                "An error occurred while submitting your review. Please try again."
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`space-y-4 animate-fade-in ${className}`}
        >
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
                    {status === 3
                        ? "Required: Please provide reason for rejection"
                        : "Optional for approvals"}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                    type="button"
                    variant={status === 2 ? "default" : "outline"}
                    className={`flex-1 border-sidebar-border ${
                        status === 2
                            ? "bg-green-600 hover:bg-green-700"
                            : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                    }`}
                    onClick={() => setStatus(2)} // Status 2 for approve
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Approve</span>
                </Button>

                <Button
                    type="button"
                    variant={status === 3 ? "default" : "outline"}
                    className={`flex-1 border-sidebar-border ${
                        status === 3
                            ? "bg-red-600 hover:bg-red-700"
                            : "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    }`}
                    onClick={() => setStatus(3)} // Status 3 for reject
                >
                    <XCircle className="h-4 w-4 mr-2" />
                    <span>Reject</span>
                </Button>
            </div>

            <Button
                type="submit"
                className="w-full border-sidebar-border bg-dashboard-purple hover:bg-dashboard-purple/90 text-white"
                disabled={!status || (status === 3 && !note.trim())} // Disable if status is rejected but no note
            >
                Submit Review
            </Button>
        </form>
    );
}
