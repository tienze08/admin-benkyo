import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const monthlyRevenue = [
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

const revenueByPlan = [
  { name: "Basic", value: 25000 },
  { name: "Pro", value: 150000 },
  { name: "Enterprise", value: 200000 },
];

const revenueBreakdown = [
  { name: "Subscriptions", value: 320000 },
  { name: "One-time Purchases", value: 45000 },
  { name: "Add-ons", value: 10000 },
];

const quarterlyRevenue = [
  { name: "Q1", basic: 25000, pro: 42000, enterprise: 68000 },
  { name: "Q2", basic: 28000, pro: 48000, enterprise: 72000 },
  { name: "Q3", basic: 32000, pro: 55000, enterprise: 85000 },
  { name: "Q4", basic: 35000, pro: 60000, enterprise: 95000 },
];

const COLORS = ["#8B5CF6", "#0EA5E9", "#10B981", "#F97316"];

const Revenue = () => {
  const totalRevenue = monthlyRevenue.reduce((acc, month) => acc + month.revenue, 0);
  const averageMonthlyRevenue = Math.round(totalRevenue / monthlyRevenue.length);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Revenue</h2>
            <p className="text-muted-foreground">
              Financial performance and revenue analytics.
            </p>
          </div>
          <Select defaultValue="2025">
            <SelectTrigger className="w-[180px] border-sidebar-border">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="w-[180px] border-sidebar-border bg-purple-50">
              <SelectItem value="2025" className="cursor-pointer">2025</SelectItem>
              <SelectItem value="2024" className="cursor-pointer">2024</SelectItem>
              <SelectItem value="2023" className="cursor-pointer">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-purple p-1.5">
                <DollarSign className="h-full w-full text-dashboard-purple" />
              </div>
            </CardHeader>
            <CardContent> 
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                Year to date
                <span className="ml-1 inline-flex items-center text-green-600">
                  ↑ 15%
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-blue p-1.5">
                <TrendingUp className="h-full w-full text-dashboard-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageMonthlyRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                Per month
                <span className="ml-1 inline-flex items-center text-green-600">
                  ↑ 8%
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">ARPU</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-green p-1.5">
                <Users className="h-full w-full text-dashboard-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$250</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                Average revenue per user
                <span className="ml-1 inline-flex items-center text-green-600">
                  ↑ 5%
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <div className="h-8 w-8 rounded-full bg-dashboard-light-orange p-1.5">
                <CreditCard className="h-full w-full text-dashboard-orange" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$42,500</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                Monthly recurring revenue
                <span className="ml-1 inline-flex items-center text-green-600">
                  ↑ 12%
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 border-sidebar-border bg-purple-50  text-sidebar-accent-foreground">
            <TabsTrigger
                value="monthly"
                className="hover:bg-dashboard-light-purple/40 data-[state=active]:bg-dashboard-light-purple data-[state=active]:text-sidebar-foreground cursor-pointer"
            >
                Monthly
            </TabsTrigger>
            <TabsTrigger
                value="quarterly"
                className="hover:bg-dashboard-light-purple/40 data-[state=active]:bg-dashboard-light-purple data-[state=active]:text-sidebar-foreground cursor-pointer"
            >
                Quarterly
            </TabsTrigger>
            <TabsTrigger
                value="breakdown"
                className="hover:bg-dashboard-light-purple/40 data-[state=active]:bg-dashboard-light-purple data-[state=active]:text-sidebar-foreground cursor-pointer"
            >
                Breakdown
            </TabsTrigger>
        </TabsList>

          <TabsContent value="monthly" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Monthly Revenue (2025)</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyRevenue}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis
                      tickFormatter={formatCurrency}
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      fill="#E5DEFF"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quarterly" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Quarterly Revenue by Plan (2025)</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={quarterlyRevenue}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                    <Legend />
                    <Bar dataKey="basic" name="Basic Plan" fill="#8B5CF6" />
                    <Bar dataKey="pro" name="Pro Plan" fill="#0EA5E9" />
                    <Bar dataKey="enterprise" name="Enterprise Plan" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="breakdown" className="mt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="border-sidebar-border">
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByPlan}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByPlan.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [formatCurrency(value), "Revenue"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="border-sidebar-border">
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueBreakdown.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [formatCurrency(value), "Revenue"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Revenue;