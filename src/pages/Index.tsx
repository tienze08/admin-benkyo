import { AccountsTable } from "@/components/dashboard/AccountsTable";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DecksTable } from "@/components/dashboard/DecksTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { isToday, parseISO, format } from "date-fns";
import { useAccountStats } from "@/hooks/use-get-accountStats";
import { useDeckStats } from "@/hooks/use-get-deckStats";
import { useDashboardMetrics } from "@/hooks/use-get-totalRevenue";
import { useMonthlyRevenue } from "@/hooks/use-get-monthlyRevenue";
import { useAccounts } from "@/hooks/use-list-account";
import { useRequests } from "@/hooks/use-requests";
import { Users, DollarSign, FileText, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

const Index = () => {
    const [selectedYear, setSelectedYear] = useState(() =>
        new Date().getFullYear().toString()
    );

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 3 }, (_, index) => currentYear - index);
    }, []);

    const { data: accountStats, isLoading: loadingAccountStats } =
        useAccountStats();
    const { data: deckStats, isLoading: loadingDeckStats } = useDeckStats();
    const { data: revenueStats, isLoading: loadingRevenue } =
        useDashboardMetrics(selectedYear);
    const { data: monthlyRevenue = [], isLoading: loadingMonthlyRevenue } =
        useMonthlyRevenue(selectedYear) as {
            data: { name: string; revenue: number }[] | undefined;
            isLoading: boolean;
        };
    const { data: allAccounts = [] } = useAccounts();
    const { data: allDeckRequests = [] } = useRequests();

    const todayAccounts = allAccounts.filter((acc) =>
        isToday(parseISO(acc.createdAt))
    );

    function mapStatusToLabel(
        status: number
    ): "pending" | "approved" | "rejected" {
        if (status === 1) return "pending";
        if (status === 2) return "approved";
        if (status === 3) return "rejected";
        return "pending";
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const todayDecks = allDeckRequests
        .filter((deck) => isToday(parseISO(deck.createdAt)))
        .map((deck) => ({
            id: deck.id,
            title: deck.title,
            author: deck.creator.name,
            status: mapStatusToLabel(deck.status),
            date: `Today, ${format(parseISO(deck.createdAt), "p")}`,
        }));

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h2>
                        <p className="text-muted-foreground">
                            Overview of your accounts, revenue, and decks.
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
                {/* Thống kê */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Accounts"
                        value={
                            loadingAccountStats
                                ? "..."
                                : accountStats?.totalAccounts?.toString() ?? "0"
                        }
                        icon={Users}
                        description={
                            loadingAccountStats
                                ? "Loading..."
                                : `New accounts this month (${selectedYear}): ${
                                      accountStats?.newAccountsThisMonth ?? 0
                                  }`
                        }
                        trend={{
                            value: accountStats?.growthPercentage ?? 0,
                            isPositive:
                                (accountStats?.growthPercentage ?? 0) >= 0,
                        }}
                        iconClassName="bg-dashboard-light-blue text-dashboard-blue"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={
                            loadingRevenue
                                ? "..."
                                : formatCurrency(
                                      revenueStats?.totalRevenue ?? 0
                                  )
                        }
                        icon={DollarSign}
                        iconClassName="bg-dashboard-light-purple text-dashboard-purple"
                    />
                    <StatCard
                        title="Total Decks"
                        value={
                            loadingDeckStats
                                ? "..."
                                : deckStats?.totalDecks?.toString() ?? "0"
                        }
                        icon={FileText}
                        description={
                            loadingDeckStats
                                ? "Loading..."
                                : `Created this month (${selectedYear}): ${
                                      deckStats?.createdThisMonth ?? 0
                                  }`
                        }
                        trend={{
                            value: deckStats?.growthPercentage ?? 0,
                            isPositive: (deckStats?.growthPercentage ?? 0) >= 0,
                        }}
                        iconClassName="bg-dashboard-light-green text-dashboard-green"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={
                            loadingDeckStats
                                ? "..."
                                : deckStats?.pendingDecks?.toString() ?? "0"
                        }
                        icon={Clock}
                        description={`Awaiting review (${selectedYear})`}
                        iconClassName="bg-dashboard-light-orange text-dashboard-orange"
                    />
                </div>
                {/* Biểu đồ doanh thu */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                    {loadingMonthlyRevenue ? (
                        <Card className="col-span-4 border-sidebar-border">
                            <CardHeader>
                                <CardTitle>
                                    Monthly Revenue ({selectedYear})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center">
                                <span className="text-muted-foreground">
                                    Loading chart...
                                </span>
                            </CardContent>
                        </Card>
                    ) : (
                        <RevenueChart
                            data={monthlyRevenue}
                            year={selectedYear}
                        />
                    )}
                </div>
                {/* Bảng tài khoản & deck */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <AccountsTable accounts={todayAccounts} />
                    <DecksTable decks={todayDecks} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Index;
