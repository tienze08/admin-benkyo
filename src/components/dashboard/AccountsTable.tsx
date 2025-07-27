import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Account {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    createdAt: string;
}

interface AccountsTableProps {
    accounts: Account[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
    return (
        <Card className="border-sidebar-border">
            <CardHeader>
                <CardTitle>New Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-sidebar-border">
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map((account) => (
                            <TableRow
                                key={account.id}
                                className="border-b border-sidebar-border hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-colors"
                            >
                                <TableCell className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 bg-dashboard-light-blue">
                                        <AvatarImage
                                            src={account.avatarUrl}
                                            alt={account.name}
                                        />
                                        <AvatarFallback>
                                            {account.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">
                                        {account.name}
                                    </span>
                                </TableCell>
                                <TableCell>{account.email}</TableCell>
                                <TableCell>{account.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
