import { AccountsTable } from "@/components/dashboard/AccountsTable";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DecksTable } from "@/components/dashboard/DecksTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatCard } from "@/components/dashboard/StatCard";

import { Users, DollarSign, FileText, Clock} from "lucide-react";

// Mock data for dashboard
const revenueData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 15000 },
  { name: "Mar", revenue: 18000 },
  { name: "Apr", revenue: 22000 },
  { name: "May", revenue: 19000 },
  { name: "Jun", revenue: 25000 },
  { name: "Jul", revenue: 32000 },
  { name: "Aug", revenue: 38000 },
  { name: "Sep", revenue: 43000 },
  { name: "Oct", revenue: 41000 },
  { name: "Nov", revenue: 45000 },
  { name: "Dec", revenue: 52000 },
];

const newAccounts = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    joinedDate: "Today, 2:30 PM",
  },
  {
    id: "2",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    joinedDate: "Today, 10:15 AM",
  },
  {
    id: "3",
    name: "Robert Brown",
    email: "robert.b@example.com",
    joinedDate: "Yesterday, 5:42 PM",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.d@example.com",
    joinedDate: "Yesterday, 1:20 PM",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    joinedDate: "2 days ago, 9:30 AM",
  },
];

const recentDecks = [
  {
    id: "1",
    title: "Marketing Strategy 2025",
    author: "John Smith",
    status: "approved" as const,
    date: "Today, 4:30 PM",
  },
  {
    id: "2",
    title: "Q4 Financial Report",
    author: "Alice Johnson",
    status: "pending" as const,
    date: "Today, 2:15 PM",
  },
  {
    id: "3",
    title: "Product Roadmap",
    author: "Robert Brown",
    status: "rejected" as const,
    date: "Yesterday, 3:42 PM",
  },
  {
    id: "4",
    title: "Brand Guidelines",
    author: "Emma Davis",
    status: "approved" as const,
    date: "Yesterday, 11:20 AM",
  },
  {
    id: "5",
    title: "Investor Presentation",
    author: "Michael Wilson",
    status: "pending" as const,
    date: "2 days ago, 10:30 AM",
  },
];

const Index = () => {
  // Calculate totals
  const totalRevenue = revenueData.reduce((acc, month) => acc + month.revenue, 0);
  const totalAccounts = 1250; // Mock value
  const totalDecks = 3567; // Mock value
  const pendingDecks = recentDecks.filter(deck => deck.status === "pending").length + 42;
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your accounts, revenue, and decks.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Accounts"
            value={totalAccounts.toString()}
            icon={Users}
            description="New accounts this month: 125"
            trend={{ value: 12, isPositive: true }}
            iconClassName="bg-dashboard-light-blue text-dashboard-blue"
          />
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Monthly target: $350,000"
            trend={{ value: 8, isPositive: true }}
            iconClassName="bg-dashboard-light-purple text-dashboard-purple"
          />
          <StatCard
            title="Total Decks"
            value={totalDecks.toString()}
            icon={FileText}
            description="Created this month: 287"
            trend={{ value: 5, isPositive: true }}
            iconClassName="bg-dashboard-light-green text-dashboard-green"
          />
          <StatCard
            title="Pending Approvals"
            value={pendingDecks.toString()}
            icon={Clock}
            description="Awaiting review"
            iconClassName="bg-dashboard-light-orange text-dashboard-orange"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          <RevenueChart data={revenueData} />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <AccountsTable accounts={newAccounts} />
          <DecksTable decks={recentDecks} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;