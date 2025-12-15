import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Check, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Deck {
    id: string;
    title: string;
    author: string;
    status: "pending" | "approved" | "rejected";
    date: string;
}

interface DecksTableProps {
    decks: Deck[];
}

export function DecksTable({ decks }: DecksTableProps) {
    const navigate = useNavigate();

    return (
        <Card className="border-sidebar-border">
            <CardHeader>
                <CardTitle>Recent Decks</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-sidebar-border">
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {decks.map((deck) => (
                            <TableRow
                                key={deck.id}
                                onClick={() => navigate(`/review/${deck.id}`)}
                                className="border-b border-sidebar-border hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-colors cursor-pointer"
                            >
                                <TableCell className="font-medium pt-3 pb-3">
                                    {deck.title}
                                </TableCell>
                                <TableCell>{deck.author}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={cn(
                                            "flex items-center gap-1",
                                            deck.status === "approved" &&
                                                "bg-dashboard-light-green text-dashboard-green",
                                            deck.status === "rejected" &&
                                                "bg-dashboard-light-red text-dashboard-red",
                                            deck.status === "pending" &&
                                                "bg-dashboard-light-orange text-dashboard-orange"
                                        )}
                                    >
                                        {deck.status === "approved" && (
                                            <Check className="h-3 w-3" />
                                        )}
                                        {deck.status === "rejected" && (
                                            <X className="h-3 w-3" />
                                        )}
                                        {deck.status === "pending" && (
                                            <Clock className="h-3 w-3" />
                                        )}
                                        {deck.status.charAt(0).toUpperCase() +
                                            deck.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>{deck.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
