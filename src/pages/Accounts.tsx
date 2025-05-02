import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";

// Mock data
const accounts = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "active",
    role: "Admin",
    joinedDate: "Jan 10, 2025",
  },
  {
    id: "2",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    status: "active",
    role: "Editor",
    joinedDate: "Jan 15, 2025",
  },
  {
    id: "3",
    name: "Robert Brown",
    email: "robert.b@example.com",
    status: "inactive",
    role: "Viewer",
    joinedDate: "Feb 2, 2025",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.d@example.com",
    status: "active",
    role: "Editor",
    joinedDate: "Feb 12, 2025",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    status: "active",
    role: "Viewer",
    joinedDate: "Feb 18, 2025",
  },
  {
    id: "6",
    name: "Sophia Martin",
    email: "sophia.m@example.com",
    status: "inactive",
    role: "Editor",
    joinedDate: "Mar 1, 2025",
  },
  {
    id: "7",
    name: "James Taylor",
    email: "james.t@example.com",
    status: "active",
    role: "Admin",
    joinedDate: "Mar 5, 2025",
  },
  {
    id: "8",
    name: "Olivia White",
    email: "olivia.w@example.com",
    status: "active",
    role: "Viewer",
    joinedDate: "Mar 10, 2025",
  },
  {
    id: "9",
    name: "William Harris",
    email: "william.h@example.com",
    status: "active",
    role: "Editor",
    joinedDate: "Mar 15, 2025",
  },
  {
    id: "10",
    name: "Ava Clark",
    email: "ava.c@example.com",
    status: "active",
    role: "Viewer",
    joinedDate: "Mar 20, 2025",
  },
];

const Accounts = () => {
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
          <Button className="bg-dashboard-purple hover:bg-dashboard-purple/90">
            <Plus className="mr-2 h-4 w-4" /> Add Account
          </Button>
        </div>

        <Card className="border-sidebar-border">
          <CardHeader className="pb-3">
            <CardTitle>All Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground border-sidebar-border" />
                <Input
                  placeholder="Search accounts..."
                  className="pl-8 w-full"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1 border-sidebar-border">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>

            <Table>
              <TableHeader >
                <TableRow className="border-b border-sidebar-border">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
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
                    <TableCell>{account.role}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={account.status === "active" ? 
                          "border-dashboard-green text-dashboard-green" : 
                          "border-dashboard-red text-dashboard-red"
                        }
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.joinedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;