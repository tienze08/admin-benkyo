
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { usePendingPayout } from "@/hooks/use-get-pending-payout";
import { usePayoutHistory } from "@/hooks/use-get-payout-history";
import { useState } from "react";

export default function WithdrawalsUI() {
  const { data: pendingRequests = [], isLoading: loadingPending } = usePendingPayout();
  const { data: processedRequests = [], isLoading: loadingHistory } = usePayoutHistory();
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
const [rejectReason, setRejectReason] = useState("");

  const updateRequestStatus = (
    id: string,
    newStatus: "approved" | "rejected",
    notes: string
  ) => {
    console.log(`Update ${id} to ${newStatus} with notes: ${notes}`);
  };


const handleReject = (id: string) => {
  setSelectedRequestId(id);
  setRejectReason("");
  setIsModalOpen(true);
};

  if (loadingPending || loadingHistory) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 text-black">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            💳 Withdrawal Requests
          </h1>
          <p className="text-muted-foreground">
            Manage and review user withdrawal submissions.
          </p>
        </div>

        {/* Pending Section */}
        <Card className="border border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-sidebar-border">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              {`New Requests (${pendingRequests.length})`}
            </CardTitle>
            <CardDescription>
              Pending withdrawal requests awaiting review.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                🎉 No pending withdrawal requests.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-sidebar-border">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>User Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pendingRequests.map((req) => (
                    <TableRow
                      key={req._id}
                      className="hover:bg-blue-50/60 transition border-b border-sidebar-border"
                    >
                      <TableCell>
                         {req.createdAt ? format(new Date(req.createdAt), "MMM d, yyyy HH:mm") : "-"}
                      </TableCell>

                      <TableCell className="font-bold">${req.amount.toFixed(2)}</TableCell>

                     <TableCell>
  <div className="font-medium">{req.user.name}</div>
  <div className="text-xs text-muted-foreground">
    {req.payout.accountName} ({req.payout.accountNumber})
  </div>
</TableCell>


                      <TableCell className="max-w-[220px] truncate">{req.payout?.notes || "-"}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(req._id)}
                            className="bg-red-500 text-white shadow-sm hover:bg-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Processed Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-sidebar-border">
            <CardTitle>Processed Requests</CardTitle>
            <CardDescription>
              Requests that have already been approved or rejected.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-sidebar-border">
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                   <TableHead>Account</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[300px]">Admin Notes</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {processedRequests.map((req) => (
                  <TableRow
                    key={req._id}
                    className="hover:bg-blue-50/40 transition border-b border-sidebar-border"
                  >
                    <TableCell>
                      {req.createdAt ? format(new Date(req.createdAt), "MMM d, yyyy HH:mm") : "-"}
                    </TableCell>

                    <TableCell className="font-medium">${req.amount.toFixed(2)}</TableCell>
 <TableCell>
  <div className="font-medium">{req.user.name}</div>
  
</TableCell>

                    <TableCell>
                      {req.payout.accountName} ({req.payout.accountNumber})
                    </TableCell>

                    <TableCell>
                      {req.status === "SUCCESS" && (
                        <Badge className="bg-blue-600 text-white">Approved</Badge>
                      )}
                      {req.status === "REJECTED" && (
                        <Badge className="bg-red-500 text-white">Rejected</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[300px]">
                      {req.payout?.rejectReason || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-[400px]">
      <h2 className="text-lg font-bold mb-4">Reason for Rejection</h2>
      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={4}
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!rejectReason) return alert("Reason is required!");
            if (selectedRequestId) {
              updateRequestStatus(selectedRequestId, "rejected", rejectReason);
            }
            setIsModalOpen(false);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  </div>
)}

    </DashboardLayout>
    
  );
}

