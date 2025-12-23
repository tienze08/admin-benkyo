import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRequests } from "@/hooks/use-requests";
import { cn } from "@/lib/utils";
import { Search, Check, X, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const Decks = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: decks = [] } = useRequests();

    console.log(decks);

    const pendingCount = decks.filter((deck) => deck.status === 1).length;
    const approvedCount = decks.filter((deck) => deck.status === 2).length;
    const rejectedCount = decks.filter((deck) => deck.status === 3).length;

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    const statusValueMap: Record<string, number | null> = {
        all: null,
        pending: 1,
        approved: 2,
        rejected: 3,
    };

    const filteredDecks = decks.filter((deck) => {
        const matchesSearch =
            deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deck.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deck.creator.name.toLowerCase().includes(searchTerm.toLowerCase());

        const statusFilterValue = statusValueMap[statusFilter];
        const matchesStatus =
            statusFilterValue === null || deck.status === statusFilterValue;

        return matchesSearch && matchesStatus;
    });
const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (a.status === 1 && b.status !== 1) return -1;
    if (a.status !== 1 && b.status === 1) return 1;
    return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
});

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

const totalItems = sortedDecks.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedDecks = sortedDecks.slice(
    startIndex,
    startIndex + itemsPerPage
);


    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Decks
                        </h2>
                        <p className="text-muted-foreground">
                            Manage and review presentation decks.
                        </p>
                    </div>
                </div>


                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Review
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-orange p-1.5">
                                <Clock className="h-full w-full text-dashboard-orange" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pendingCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Approved
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-green p-1.5">
                                <Check className="h-full w-full text-dashboard-green" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {approvedCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ready for use
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rejected
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-red p-1.5">
                                <X className="h-full w-full text-dashboard-red" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {rejectedCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Needs revision
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-sidebar-border">
                    <CardHeader>
                        <CardTitle>All Decks</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {/* FILTER */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative w-full md:max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
                                <Input
                                    className="pl-8 border-sidebar-border"
                                    placeholder="Search decks..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px] border-sidebar-border bg-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="border-sidebar-border bg-white">
                                    {statusOptions.map((o) => (
                                        <SelectItem
                                            key={o.value}
                                            value={o.value}
                                        >
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="border-sidebar-border">
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedDecks.map((deck) => {
                                    const statusMap: Record<number, string> = {
                                        1: "pending",
                                        2: "approved",
                                        3: "rejected",
                                    };

                                    const statusString = statusMap[deck.status];

                                    return (
                                        <TableRow
                                            key={deck.id}
                                            className="border-sidebar-border"
                                        >
                                            <TableCell className="font-medium max-w-[220px] whitespace-normal break-words">
                                                {deck.title}
                                            </TableCell>

                                            <TableCell className="max-w-[160px] whitespace-normal break-words">
                                                {deck.creator.name}
                                            </TableCell>

                                            {/* FIX MẤT CHỮ Ở ĐÂY */}
                                            <TableCell className="max-w-[260px] whitespace-normal break-words text-muted-foreground">
                                                {deck.description}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        statusString ===
                                                            "approved" &&
                                                            "bg-green-100 text-green-700",
                                                        statusString ===
                                                            "rejected" &&
                                                            "bg-red-100 text-red-700",
                                                        statusString ===
                                                            "pending" &&
                                                            "bg-orange-100 text-orange-700"
                                                    )}
                                                >
                                                    {statusString}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(deck.createdAt)}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Link to={`/review/${deck.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    Previous
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Decks;
