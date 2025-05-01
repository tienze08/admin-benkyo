import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Plus, Search, Filter, Check, X, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const decks = [
  {
    id: "1",
    title: "Marketing Strategy 2025",
    author: "John Smith",
    category: "Marketing",
    status: "approved" as const,
    date: "Apr 10, 2025",
  },
  {
    id: "2",
    title: "Q4 Financial Report",
    author: "Alice Johnson",
    category: "Finance",
    status: "pending" as const,
    date: "Apr 8, 2025",
  },
  {
    id: "3",
    title: "Product Roadmap",
    author: "Robert Brown",
    category: "Product",
    status: "rejected" as const,
    date: "Apr 5, 2025",
  },
  {
    id: "4",
    title: "Brand Guidelines",
    author: "Emma Davis",
    category: "Marketing",
    status: "approved" as const,
    date: "Apr 3, 2025",
  },
  {
    id: "5",
    title: "Investor Presentation",
    author: "Michael Wilson",
    category: "Finance",
    status: "pending" as const,
    date: "Apr 1, 2025",
  },
  {
    id: "6",
    title: "Employee Handbook",
    author: "Sophia Martin",
    category: "HR",
    status: "approved" as const,
    date: "Mar 28, 2025",
  },
  {
    id: "7",
    title: "Quarterly Sales Report",
    author: "James Taylor",
    category: "Sales",
    status: "pending" as const,
    date: "Mar 25, 2025",
  },
  {
    id: "8",
    title: "User Research Findings",
    author: "Olivia White",
    category: "UX",
    status: "approved" as const,
    date: "Mar 20, 2025",
  },
  {
    id: "9",
    title: "Engineering Sprint Plan",
    author: "William Harris",
    category: "Engineering",
    status: "rejected" as const,
    date: "Mar 18, 2025",
  },
  {
    id: "10",
    title: "Content Calendar",
    author: "Ava Clark",
    category: "Marketing",
    status: "approved" as const,
    date: "Mar 15, 2025",
  },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const Decks = () => {
  const pendingCount = decks.filter(deck => deck.status === "pending").length;
  const approvedCount = decks.filter(deck => deck.status === "approved").length;
  const rejectedCount = decks.filter(deck => deck.status === "rejected").length;

  return (
    <DashboardLayout >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Decks</h2>
            <p className="text-muted-foreground">
              Manage and review presentation decks.
            </p>
          </div>
          <Button className="bg-dashboard-purple hover:bg-dashboard-purple/90">
            <Plus className="mr-2 h-4 w-4" /> Create Deck
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-orange p-1.5">
                <Clock className="h-full w-full text-dashboard-orange" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-green p-1.5">
                <Check className="h-full w-full text-dashboard-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Ready for use</p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-red p-1.5">
                <X className="h-full w-full text-dashboard-red" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Needs revision</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-sidebar-border">
          <CardHeader className="pb-3">
            <CardTitle>All Decks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search decks..."
                  className="pl-8 w-full"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select defaultValue="all" >
                  <SelectTrigger className="w-full md:w-[180px] border border-sidebar-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-50 border border-sidebar-border">
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-sidebar-border">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50 border-b border-sidebar-border">
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decks.map((deck) => (
                  <TableRow key={deck.id} className="hover:bg-muted/50 border-b border-sidebar-border">
                    <TableCell className="font-medium">{deck.title}</TableCell>
                    <TableCell>{deck.author}</TableCell>
                    <TableCell>{deck.category}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "flex w-fit items-center gap-1 ",
                          deck.status === "approved" && "bg-dashboard-light-green text-dashboard-green",
                          deck.status === "rejected" && "bg-dashboard-light-red text-dashboard-red",
                          deck.status === "pending" && "bg-dashboard-light-orange text-dashboard-orange"
                        )}
                      >
                        {deck.status === "approved" && <Check className="h-3 w-3" />}
                        {deck.status === "rejected" && <X className="h-3 w-3" />}
                        {deck.status === "pending" && <Clock className="h-3 w-3" />}
                        {deck.status.charAt(0).toUpperCase() + deck.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{deck.date}</TableCell>
                    <TableCell className="text-right">
                    <Link to={`/review/${deck.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                        </Button>
                    </Link>
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
};

export default Decks;