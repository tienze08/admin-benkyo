import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useListAccounts } from "@/hooks/use-list-account";
import dayjs from "dayjs";

const Accounts = () => {
  const { accounts, loading, error } = useListAccounts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "pro" && account.isPro) ||
      (statusFilter === "free" && !account.isPro);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
            <p className="text-muted-foreground">
              Manage user accounts and permissions.
            </p>
          </div>
        </div>

        <Card className="border-sidebar-border">
          <CardHeader className="pb-3">
            <CardTitle>All Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4 gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground border-sidebar-border" />
                <Input
                  placeholder="Search accounts..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>

                {/* <Button variant="outline" size="sm" className="gap-1 border-sidebar-border">
                  <Filter className="h-4 w-4" /> Filter
                </Button> */}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading accounts...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Error: {error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-sidebar-border">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-muted/50 cursor-pointer border-b border-sidebar-border">
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {account.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{account.role || "No role"}</TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={account.isPro
                            ? "border-green-500 text-green-500"
                            : "border-red-500 text-red-500"
                          }
                        >
                          {account.isPro ? "Pro" : "Free"}
                        </Badge>
                      </TableCell>
                      <TableCell>{dayjs(account.createdAt).format("MMM D, YYYY")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
