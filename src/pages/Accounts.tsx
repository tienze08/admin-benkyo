import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Crown } from "lucide-react";
import { useAccounts } from "@/hooks/use-list-account";
import { useEffect, useState } from "react";

const AccountsPage = () => {
    const { data: accounts, isLoading } = useAccounts();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
    }, []);
    useEffect(() => {
        if (accounts) {
            console.log("✅ List of accounts:");
            accounts.forEach((acc, index) => {
                console.log(
                    `${index + 1}. ${acc.name} (${acc.email}) - Role: ${
                        acc.role
                    } - isPro: ${acc.isPro} - proType: ${acc.proType}`
                );
            });
        }
    }, [accounts]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const [filterPro, setFilterPro] = useState<
        "all" | "free" | "pro" | "premium"
    >("all");

    const filteredAccounts =
        accounts
            ?.filter((account) => {
                const matchesSearch =
                    account.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    account.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());

                const matchesProFilter =
                    filterPro === "all" ||
                    (filterPro === "free" &&
                        (!account.isPro ||
                            account.proType?.toLowerCase() === "basic")) ||
                    (filterPro === "pro" &&
                        account.isPro &&
                        account.proType?.toLowerCase() === "pro") ||
                    (filterPro === "premium" &&
                        account.isPro &&
                        account.proType?.toLowerCase() === "premium");

                return matchesSearch && matchesProFilter;
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortBy === "newest" ? dateB - dateA : dateA - dateB;
            }) || [];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Accounts
                        </h2>
                        <p className="text-muted-foreground">
                            Manage user accounts and permissions.
                        </p>
                    </div>
                </div>

                <Card className="border-sidebar-border">
                    <CardHeader className="pb-3">
                        <CardTitle>
                            All Accounts ({filteredAccounts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground border-sidebar-border" />
                                <Input
                                    placeholder="Search accounts..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 items-center">
                                <label
                                    htmlFor="pro-filter"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Filter by:
                                </label>
                                <select
                                    id="pro-filter"
                                    value={filterPro}
                                    onChange={(e) =>
                                        setFilterPro(
                                            e.target.value as
                                                | "all"
                                                | "pro"
                                                | "premium"
                                                | "free"
                                        )
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="pro">Pro</option>
                                    <option value="premium">Premium</option>
                                    <option value="free">Free</option>
                                </select>

                                <label
                                    htmlFor="sort-by"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Sort by:
                                </label>
                                <select
                                    id="sort-by"
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(
                                            e.target.value as
                                                | "newest"
                                                | "oldest"
                                        )
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-4"
                                    >
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[150px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-sidebar-border">
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>

                                        <TableHead>Pro Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAccounts.map((account) => (
                                        <TableRow
                                            key={account.id}
                                            className="hover:bg-muted/50 cursor-pointer border-b border-sidebar-border"
                                        >
                                            <TableCell className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    {account.avatar && (
                                                        <AvatarImage
                                                            src={
                                                                account.avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={account.name}
                                                        />
                                                    )}
                                                    <AvatarFallback>
                                                        {account.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {account.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {account.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        account.role === "admin"
                                                            ? "border-dashboard-purple text-dashboard-purple"
                                                            : "border-gray-300 text-gray-600"
                                                    }
                                                >
                                                    {account.role === "admin"
                                                        ? "Admin"
                                                        : "User"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {account.isPro &&
                                                account.proType?.toLowerCase() !==
                                                    "basic" ? (
                                                    <div className="flex items-center gap-1">
                                                        <Crown
                                                            className={
                                                                account.proType?.toLowerCase() ===
                                                                "premium"
                                                                    ? "h-4 w-4 text-purple-600"
                                                                    : "h-4 w-4 text-yellow-500"
                                                            }
                                                        />
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                account.proType?.toLowerCase() ===
                                                                "premium"
                                                                    ? "border-purple-500 text-purple-600"
                                                                    : "border-yellow-500 text-yellow-600"
                                                            }
                                                        >
                                                            {account.proType
                                                                ? account.proType
                                                                      .charAt(0)
                                                                      .toUpperCase() +
                                                                  account.proType.slice(
                                                                      1
                                                                  )
                                                                : "Pro"}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-gray-300 text-gray-600"
                                                    >
                                                        Free
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(account.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {!isLoading && filteredAccounts.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? "No accounts found matching your search."
                                        : "No accounts found."}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AccountsPage;
