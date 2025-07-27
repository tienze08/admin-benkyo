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
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";
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
    // State must be declared first before using in hooks
    const [selectedYear, setSelectedYear] = useState(() =>
        new Date().getFullYear().toString()
    );

    // Generate the last 3 years dynamically
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 3 }, (_, index) => currentYear - index);
    }, []);

    // Now we can use selectedYear in hooks
    const { data: metrics, isLoading: isLoadingMetrics } =
        useDashboardMetrics(selectedYear);
    const { data: monthlyRevenue = [] } = useMonthlyRevenue(selectedYear) as {
        data: { name: string; revenue: number }[] | undefined;
    };

    console.log("Monthly Revenue Data:", monthlyRevenue);
    const {
        data: quarterlyRevenue = [],
        isLoading: isLoadingQuarterly,
        error: quarterlyError,
    } = useQuarterlyRevenue(selectedYear);

    const totalRevenue = metrics?.totalRevenue ?? 0;
    const averageMonthlyRevenue = metrics?.monthlyAverage ?? 0;
    const arpu = metrics?.arpu ?? 0;
    const mrr = metrics?.mrr ?? 0;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
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
                        onValueChange={handleYearChange}
                    >
                        <SelectTrigger className="w-[180px] border-sidebar-border">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="w-[180px] border-sidebar-border bg-purple-50">
                            {availableYears.map((year) => (
                                <SelectItem
                                    key={year}
                                    value={year.toString()}
                                    className="cursor-pointer"
                                >
                                    {year}
                                    {year === new Date().getFullYear() && (
                                        <span className="ml-2 text-xs text-purple-600 font-medium">
                                            (Current)
                                        </span>
                                    )}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Metrics Cards */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-purple p-1.5">
                                <DollarSign className="h-full w-full text-dashboard-purple" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingMetrics
                                    ? "Loading..."
                                    : formatCurrency(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Monthly Average
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-blue p-1.5">
                                <TrendingUp className="h-full w-full text-dashboard-blue" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingMetrics
                                    ? "Loading..."
                                    : formatCurrency(averageMonthlyRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                Per month ({selectedYear})
                                {isLoadingMetrics ? (
                                    <span className="ml-1 text-gray-400">
                                        Loading...
                                    </span>
                                ) : (
                                    <span
                                        className={`ml-1 inline-flex items-center ${
                                            (metrics?.monthlyAverageChange ??
                                                0) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {(metrics?.monthlyAverageChange ?? 0) >=
                                        0
                                            ? "↑"
                                            : "↓"}{" "}
                                        {Math.abs(
                                            metrics?.monthlyAverageChange ?? 0
                                        )}
                                        %
                                    </span>
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                ARPU
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-green p-1.5">
                                <Users className="h-full w-full text-dashboard-green" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingMetrics
                                    ? "Loading..."
                                    : formatCurrency(arpu)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                Average revenue per user
                                {isLoadingMetrics ? (
                                    <span className="ml-1 text-gray-400">
                                        Loading...
                                    </span>
                                ) : (
                                    <span
                                        className={`ml-1 inline-flex items-center ${
                                            (metrics?.arpuChange ?? 0) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {(metrics?.arpuChange ?? 0) >= 0
                                            ? "↑"
                                            : "↓"}{" "}
                                        {Math.abs(metrics?.arpuChange ?? 0)}%
                                    </span>
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                MRR
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-dashboard-light-orange p-1.5">
                                <CreditCard className="h-full w-full text-dashboard-orange" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingMetrics
                                    ? "Loading..."
                                    : formatCurrency(mrr)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                Monthly recurring revenue
                                {isLoadingMetrics ? (
                                    <span className="ml-1 text-gray-400">
                                        Loading...
                                    </span>
                                ) : (
                                    <span
                                        className={`ml-1 inline-flex items-center ${
                                            (metrics?.mrrChange ?? 0) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {(metrics?.mrrChange ?? 0) >= 0
                                            ? "↑"
                                            : "↓"}{" "}
                                        {Math.abs(metrics?.mrrChange ?? 0)}%
                                    </span>
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Tabs */}
                <Tabs defaultValue="monthly" className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2 border-sidebar-border bg-purple-50 text-sidebar-accent-foreground">
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
