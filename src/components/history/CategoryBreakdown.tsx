
import { useAppContext } from "@/contexts/app";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { serviceCategoryLabels } from "@/mocks/data";
import { ServiceCategory } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = [
  "#0d9488", // teal-600
  "#14b8a6", // teal-500
  "#2dd4bf", // teal-400
  "#5eead4", // teal-300
  "#99f6e4", // teal-200
  "#ccfbf1", // teal-100
  "#115e59", // teal-800
  "#134e4a", // teal-900
  "#167570", // custom teal
  "#0f9995", // custom teal
];

interface CategoryBreakdownProps {
  timeRange?: string;
  selectedMonth?: string;
  expanded?: boolean;
}

export function CategoryBreakdown({ 
  timeRange = "all", 
  selectedMonth,
  expanded = false 
}: CategoryBreakdownProps) {
  const { activeCondoId, getServiceRecordsByCondoId } = useAppContext();
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  
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
  
  // Count records by category
  const categoryCounts: Record<string, number> = {};
  filteredRecords.forEach(record => {
    const category = record.serviceProvider.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  // Create data for the chart
  const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
    name: serviceCategoryLabels[category as ServiceCategory],
    value: count,
    category
  }));
  
  // Sort data by count
  chartData.sort((a, b) => b.value - a.value);
  
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-3 rounded-md shadow-md border">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">
            Records: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Distribution of service records by category
        </CardDescription>
        {expanded && (
          <div className="pt-2">
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as "pie" | "bar")}>
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className={`w-full ${expanded ? 'h-[400px]' : 'h-[350px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={expanded ? 150 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Records" 
                    fill="#0d9488" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={`flex items-center justify-center ${expanded ? 'h-[400px]' : 'h-[350px]'}`}>
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
