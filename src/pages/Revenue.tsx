import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Users,
    Package,
    Wallet,
    ArrowDownCircle,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDashboardMetrics } from "@/hooks/use-get-totalRevenue";
import { useMonthlyRevenue } from "@/hooks/use-get-monthlyRevenue";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useQuarterlyRevenue } from "@/hooks/use-get-quarterlyRevenue";
import { useState, useMemo } from "react";

const Revenue = () => {
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 3 }, (_, i) => currentYear - i);
    }, []);

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
    const mrr = metrics?.mrr ?? 0;

    const packageRevenue = metrics?.packageRevenue ?? 0;
    const topupRevenue = metrics?.topupRevenue ?? 0;
    const payoutRevenue = metrics?.payoutRevenue ?? 0;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Revenue
                        </h2>
                        <p className="text-muted-foreground">
                            Financial performance and revenue analytics.
                        </p>
                    </div>

                    <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                    >
                        <SelectTrigger className="w-[180px] border-sidebar-border">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-50">
                            {availableYears.map((year) => (
                                <SelectItem
                                    key={year}
                                    value={year.toString()}
                                >
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* ================= KPI – CŨ (GIỮ NGUYÊN) ================= */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
                    <MetricCard
                        title="MRR"
                        value={mrr}
                        icon={<CreditCard />}
                        bg="orange"
                        loading={isLoadingMetrics}
                    />
                </div>

                {/* ================= KPI – THEO TRANSACTION ================= */}
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

                {/* ================= CHART – GIỮ NGUYÊN ================= */}
                <Tabs defaultValue="monthly">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2 border-sidebar-border bg-purple-50">
                        <TabsTrigger value="monthly">
                            Monthly
                        </TabsTrigger>
                        <TabsTrigger value="quarterly">
                            Quarterly
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="monthly" className="mt-4">
                        <CardContent className="h-[400px]">
                            <RevenueChart
                                data={monthlyRevenue}
                                year={selectedYear}
                            />
                        </CardContent>
                    </TabsContent>

                     <TabsContent value="quarterly" className="mt-4">
                        <Card className="border-sidebar-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>
                                    Quarterly Revenue ({selectedYear})
                                </CardTitle>
                                {isLoadingQuarterly && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                        Loading...
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                {isLoadingQuarterly ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                            <span className="text-sm text-muted-foreground">
                                                Loading quarterly data for{" "}
                                                {selectedYear}...
                                            </span>
                                        </div>
                                    </div>
                                ) : quarterlyError ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <p className="text-red-500 mb-4">
                                                Failed to load quarterly data
                                                for {selectedYear}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    window.location.reload()
                                                }
                                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                ) : quarterlyRevenue.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <p className="text-muted-foreground mb-2">
                                                No quarterly data available for{" "}
                                                {selectedYear}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Try selecting a different year
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={quarterlyRevenue}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#f0f0f0"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                tickLine={{ stroke: "#e0e0e0" }}
                                            />
                                            <YAxis
                                                tickFormatter={formatCurrency}
                                                tick={{ fontSize: 12 }}
                                                tickLine={{ stroke: "#e0e0e0" }}
                                            />
                                            <Tooltip
                                                formatter={(
                                                    value: number,
                                                    name: string
                                                ) => [
                                                    formatCurrency(value),
                                                    name,
                                                ]}
                                                labelStyle={{ color: "#333" }}
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                }}
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
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Revenue;

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
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-full p-1.5 ${bgMap[bg]}`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className={`text-2xl font-bold ${
                        negative ? "text-red-600" : ""
                    }`}
                >
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
