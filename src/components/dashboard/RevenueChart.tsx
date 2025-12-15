import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface RevenueChartProps {
    data: {
        name: string;
        revenue: number;
    }[];
    year: string;
}

export function RevenueChart({ data, year }: RevenueChartProps) {
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="col-span-4 border-sidebar-border">
            <CardHeader>
                <CardTitle>Monthly Revenue ({year})</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={(value: number) =>
                                formatCurrency(value)
                            }
                            stroke="#888888"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(
                                value: string | number | (string | number)[]
                            ) => {
                                if (typeof value === "number") {
                                    return formatCurrency(value);
                                }
                                return value;
                            }}
                            labelFormatter={(label) => `Tháng: ${label}`}
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
    );
}
