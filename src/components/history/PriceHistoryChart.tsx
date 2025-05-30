
import { useAppContext } from "@/contexts/app";
import { ServiceCategory } from "@/types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceCategories, serviceCategoryLabels } from "@/mocks/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataPoint {
  date: string;
  price: number;
  provider: string;
  description: string;
}

interface PriceHistoryChartProps {
  timeRange?: string;
  selectedMonth?: string;
  expanded?: boolean;
}

export function PriceHistoryChart({ 
  timeRange = "all", 
  selectedMonth,
  expanded = false
}: PriceHistoryChartProps) {
  const { activeCondoId, getServiceRecordsByCondoId, getServiceProvidersByCondoId } = useAppContext();
  const [category, setCategory] = useState<ServiceCategory | "all">("all");
  const isMobile = useIsMobile();
  
  // Get records for the active condo
  const allRecords = activeCondoId ? getServiceRecordsByCondoId(activeCondoId) : [];

  // Filter records by time range
  const filteredRecords = allRecords.filter(record => {
    if (timeRange === "all") return true;
    
    const recordDate = new Date(record.date);
    
    if (timeRange === "month" && selectedMonth) {
      const recordMonth = recordDate.toISOString().substring(0, 7);
      return recordMonth === selectedMonth;
    }
    
    if (timeRange === "quarter") {
      const currentDate = new Date();
      const quarterStart = new Date();
      quarterStart.setMonth(currentDate.getMonth() - 3);
      return recordDate >= quarterStart;
    }
    
    if (timeRange === "year") {
      const currentDate = new Date();
      const yearStart = new Date();
      yearStart.setFullYear(currentDate.getFullYear() - 1);
      return recordDate >= yearStart;
    }
    
    return true;
  });

  // Get available categories for the current condo
  const condoProviders = activeCondoId ? getServiceProvidersByCondoId(activeCondoId) : [];
  const availableCategories = Array.from(new Set(condoProviders.map(p => p.category)));
  
  // Filter records by selected category
  const categoryFilteredRecords = filteredRecords.filter(record => 
    category === "all" || record.serviceProvider.category === category
  );
  
  // Sort records by date (oldest first for chart display)
  const sortedRecords = [...categoryFilteredRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Prepare data for the chart
  const chartData: DataPoint[] = sortedRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    }),
    price: record.price,
    provider: record.serviceProvider.name,
    description: record.description
  }));
  
  // Group by month and calculate average price
  const monthlyAverages: Record<string, { total: number, count: number }> = {};
  const monthlyData: { date: string, averagePrice: number }[] = [];
  
  chartData.forEach(point => {
    if (!monthlyAverages[point.date]) {
      monthlyAverages[point.date] = { total: 0, count: 0 };
    }
    monthlyAverages[point.date].total += point.price;
    monthlyAverages[point.date].count += 1;
  });
  
  Object.entries(monthlyAverages).forEach(([date, data]) => {
    monthlyData.push({
      date,
      averagePrice: data.total / data.count
    });
  });

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-3 rounded-md shadow-md border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Average Price:{" "}
            <span className="font-medium text-primary">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(payload[0].value as number)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <CardDescription>
          Average prices of services over time
        </CardDescription>
        <div className="pt-2">
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ServiceCategory | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {serviceCategoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {monthlyData.length > 0 ? (
          <div className={`w-full ${expanded ? 'h-[400px]' : 'h-[350px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averagePrice"
                  name="Average Price"
                  stroke="#14b8a6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={`flex items-center justify-center ${expanded ? 'h-[400px]' : 'h-[350px]'}`}>
            <p className="text-muted-foreground">No data available for the selected category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
