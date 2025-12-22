import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Wallet,
  ArrowDownCircle,
} from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-get-totalRevenue";
import { useMonthlyRevenue } from "@/hooks/use-get-monthlyRevenue";
import { useQuarterlyRevenue } from "@/hooks/use-get-quarterlyRevenue";
import { usePackageDistribution } from "@/hooks/use-get-Package-Distribution-Dashboard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

const Revenue = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => currentYear - i);
  }, []);

  /* ================= HOOKS ================= */
  const { data: metrics, isLoading: isLoadingMetrics } =
    useDashboardMetrics(selectedYear);
  const { data: monthlyRevenue = [] } = useMonthlyRevenue(selectedYear) as {
    data: { name: string; revenue: number }[] | undefined;
  };
  const {
    data: quarterlyRevenue = [],
    isLoading: isLoadingQuarterly,
    error: quarterlyError,
  } = useQuarterlyRevenue(selectedYear);
  const { data: packageDistribution, isLoading: isLoadingPackageDistribution } =
    usePackageDistribution(Number(selectedYear));
    console.log("Package Distribution:", packageDistribution);
  const packageData = packageDistribution?.data?.data ?? [];

  /* ================= FORMAT ================= */
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  /* ================= KPI ================= */
  const totalRevenue = metrics?.totalRevenue ?? 0;
  const monthlyAverage = metrics?.monthlyAverage ?? 0;
  const arpu = metrics?.arpu ?? 0;
//   const mrr = metrics?.mrr ?? 0;
  const packageRevenue = metrics?.packageRevenue ?? 0;
  const topupRevenue = metrics?.topupRevenue ?? 0;
  const payoutRevenue = metrics?.payoutRevenue ?? 0;

  const pieColors = [
    "#8B5CF6",
    "#A78BFA",
    "#C4B5FD",
    "#0EA5E9",
    "#38BDF8",
    "#7DD3FC",
    "#10B981",
    "#34D399",
    "#6EE7B7",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Revenue</h2>
            <p className="text-muted-foreground">
              Financial performance and revenue analytics.
            </p>
          </div>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px] border-sidebar-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-purple-50">
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Revenue"
            value={totalRevenue}
            icon={<DollarSign />}
            bg="purple"
            loading={isLoadingMetrics}
          />
          <MetricCard
            title="Monthly Average"
            value={monthlyAverage}
            icon={<TrendingUp />}
            bg="blue"
            loading={isLoadingMetrics}
          />
          <MetricCard
            title="ARPU"
            value={arpu}
            icon={<Users />}
            bg="green"
            loading={isLoadingMetrics}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <MetricCard
            title="Package Revenue"
            value={packageRevenue}
            icon={<Package />}
            bg="purple"
            loading={isLoadingMetrics}
          />
          <MetricCard
            title="Topup Revenue"
            value={topupRevenue}
            icon={<Wallet />}
            bg="blue"
            loading={isLoadingMetrics}
          />
          <MetricCard
            title="Payout"
            value={payoutRevenue}
            icon={<ArrowDownCircle />}
            bg="red"
            negative
            loading={isLoadingMetrics}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3 border-sidebar-border bg-purple-50">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="package">Packages</TabsTrigger>
          </TabsList>

          {/* MONTHLY */}
          <TabsContent value="monthly" className="mt-4">
            <Card className="border-sidebar-border">
              <CardContent className="h-[400px]">
                <RevenueChart data={monthlyRevenue} year={selectedYear} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* QUARTERLY */}
          <TabsContent value="quarterly" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quarterly Revenue ({selectedYear})</CardTitle>
                {isLoadingQuarterly && (
                  <div className="animate-spin h-4 w-4 border-b-2 border-purple-600" />
                )}
              </CardHeader>

              <CardContent className="h-[400px]">
                {isLoadingQuarterly ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                  </div>
                ) : quarterlyError ? (
                  <div className="text-center">
                    <p className="text-red-500 mb-4">
                      Failed to load quarterly data for {selectedYear}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : quarterlyRevenue.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No quarterly data available for {selectedYear}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quarterlyRevenue}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar
                        dataKey="basic"
                        name="Basic"
                        fill="#8B5CF6"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="pro"
                        name="Pro"
                        fill="#0EA5E9"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="premium"
                        name="Premium"
                        fill="#10B981"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PACKAGES */}
          {/* PACKAGES */}
          <TabsContent value="package" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>
                  Package Purchase Distribution ({selectedYear})
                </CardTitle>
              </CardHeader>

              <CardContent className="h-[400px]">
                {isLoadingPackageDistribution ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                  </div>
                ) : packageData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No package data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packageData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        label={(entry: any) => {
                          const name = entry?.name ?? "";
                          const value =
                            typeof entry?.value === "number" ? entry.value : 0;
                          const total =
                            packageData.reduce(
                              (sum: number, item: any) =>
                                sum +
                                (typeof item.value === "number"
                                  ? item.value
                                  : 0),
                              0
                            ) || 1;
                          const percent = ((value / total) * 100).toFixed(0);
                          return `${name}: ${percent}%`;
                        }}
                      >
                        {packageData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${value}`} />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Revenue;

/* ================= KPI CARD ================= */
const MetricCard = ({
  title,
  value,
  icon,
  bg,
  loading,
  negative,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: "purple" | "blue" | "green" | "orange" | "red";
  loading?: boolean;
  negative?: boolean;
}) => {
  const bgMap = {
    purple: "bg-dashboard-light-purple text-dashboard-purple",
    blue: "bg-dashboard-light-blue text-dashboard-blue",
    green: "bg-dashboard-light-green text-dashboard-green",
    orange: "bg-dashboard-light-orange text-dashboard-orange",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Card className="border-sidebar-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full p-1.5 ${bgMap[bg]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${negative ? "text-red-600" : ""}`}>
          {loading
            ? "Loading..."
            : new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(value)}
        </div>
      </CardContent>
    </Card>
  );
};
