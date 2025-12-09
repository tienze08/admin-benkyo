import { useState } from "react";
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

type WithdrawalRequest = {
    id: string;
    user_id: string;
    amount: number;
    account_number: string;
    bank_name: string;
    account_holder_name: string;
    notes: string | null;
    status: "pending" | "approved" | "rejected";
    admin_notes: string | null;
    created_at: string;
};

const mockRequests: WithdrawalRequest[] = [
    {
        id: "1",
        user_id: "demo-user",
        amount: 500,
        account_number: "****4521",
        bank_name: "Chase Bank",
        account_holder_name: "John Doe",
        notes: "Monthly withdrawal",
        status: "approved",
        admin_notes: "Processed successfully",
        created_at: "2024-12-05T10:30:00Z",
    },
    {
        id: "2",
        user_id: "demo-user",
        amount: 1250.5,
        account_number: "****7890",
        bank_name: "Bank of America",
        account_holder_name: "John Doe",
        notes: null,
        status: "pending",
        admin_notes: null,
        created_at: "2024-12-08T09:15:00Z",
    },
    {
        id: "3",
        user_id: "demo-user",
        amount: 200,
        account_number: "****3456",
        bank_name: "Wells Fargo",
        account_holder_name: "John Doe",
        notes: "Urgent - need funds",
        status: "rejected",
        admin_notes: "Insufficient balance in account",
        created_at: "2024-12-01T16:45:00Z",
    },
    {
        id: "4",
        user_id: "vip-user",
        amount: 3500,
        account_number: "****1111",
        bank_name: "Capital One",
        account_holder_name: "Jane Smith",
        notes: "Large withdrawal for investment",
        status: "pending",
        admin_notes: null,
        created_at: "2024-12-09T14:00:00Z",
    },
];

export default function WithdrawalsUI() {
    const [requests, setRequests] = useState<WithdrawalRequest[]>(mockRequests);

    const updateRequestStatus = (
        id: string,
        newStatus: "approved" | "rejected",
        notes: string
    ) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === id
                    ? { ...req, status: newStatus, admin_notes: notes }
                    : req
            )
        );
    };

    const handleApprove = (id: string) => {
        const notes =
            prompt("Admin notes (optional):") || "Approved and processed.";
        updateRequestStatus(id, "approved", notes);
    };

    const handleReject = (id: string) => {
        const reason = prompt("Reason for rejection:");
        if (!reason) return alert("Reason is required!");
        updateRequestStatus(id, "rejected", reason);
    };

    const pendingRequests = requests.filter((r) => r.status === "pending");
    const processedRequests = requests.filter((r) => r.status !== "pending");

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
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pendingRequests.map((req) => (
                                        <TableRow
                                            key={req.id}
                                            className="hover:bg-blue-50/60 transition border-b border-sidebar-border"
                                        >
                                            <TableCell>
                                                {format(
                                                    new Date(req.created_at),
                                                    "MMM d, yyyy"
                                                )}
                                            </TableCell>

                                            <TableCell className="font-bold">
                                                ${req.amount.toFixed(2)}
                                            </TableCell>

                                            <TableCell>
                                                <div className="font-medium">
                                                    {req.account_holder_name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {req.bank_name} (
                                                    {req.account_number})
                                                </div>
                                            </TableCell>

                                            <TableCell className="max-w-[220px] truncate">
                                                {req.notes || "-"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleApprove(
                                                                req.id
                                                            )
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white shadow-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleReject(req.id)
                                                        }
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
                            Requests that have already been approved or
                            rejected.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-sidebar-border">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Bank</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[300px]">
                                        Admin Notes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {processedRequests.map((req) => (
                                    <TableRow
                                        key={req.id}
                                        className="hover:bg-blue-50/40 transition border-b border-sidebar-border"
                                    >
                                        <TableCell>
                                            {format(
                                                new Date(req.created_at),
                                                "MMM d, yyyy HH:mm"
                                            )}
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            ${req.amount.toFixed(2)}
                                        </TableCell>

                                        <TableCell>
                                            {req.bank_name} (
                                            {req.account_number})
                                        </TableCell>

                                        <TableCell>
                                            {req.status === "approved" && (
                                                <Badge className="bg-blue-600 text-white">
                                                    Approved
                                                </Badge>
                                            )}
                                            {req.status === "rejected" && (
                                                <Badge className="bg-red-500 text-white">
                                                    Rejected
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-sm text-muted-foreground max-w-[300px]">
                                            {req.admin_notes || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
