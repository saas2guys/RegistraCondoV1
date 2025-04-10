
import { useAppContext } from "@/contexts/AppContext";
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
} from "recharts";
import { serviceCategoryLabels } from "@/mocks/data";
import { ServiceCategory } from "@/types";

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

export function CategoryBreakdown() {
  const { activeCondoId, getServiceRecordsByCondoId } = useAppContext();
  
  // Get records for the active condo
  const condoRecords = activeCondoId ? getServiceRecordsByCondoId(activeCondoId) : [];
  
  // Count records by category
  const categoryCounts: Record<string, number> = {};
  condoRecords.forEach(record => {
    const category = record.serviceProvider.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  // Create data for the pie chart
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
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
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
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
