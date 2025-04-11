
import { ServiceRecord } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomCategoryTooltip } from "./ChartTooltips";

interface CategoryAverageTabProps {
  record: ServiceRecord;
  categoryHistory: ServiceRecord[];
}

export function CategoryAverageTab({ record, categoryHistory }: CategoryAverageTabProps) {
  const isMobile = useIsMobile();

  // Calculate average price by date for all providers in this category
  const categoryAveragesByDate: Record<string, { total: number; count: number }> = {};
  categoryHistory.forEach(record => {
    const date = formatDate(record.date);
    if (!categoryAveragesByDate[date]) {
      categoryAveragesByDate[date] = { total: 0, count: 0 };
    }
    categoryAveragesByDate[date].total += record.price;
    categoryAveragesByDate[date].count += 1;
  });

  // Format data for the category average price chart
  const categoryChartData = Object.entries(categoryAveragesByDate).map(([date, data]) => ({
    date,
    averagePrice: data.total / data.count,
    formattedPrice: formatPrice(data.total / data.count)
  }));

  return (
    <>
      <div className="mt-2 text-sm text-muted-foreground">
        Showing average price history for all providers in the {record.serviceProvider.category} category
      </div>
      
      {categoryChartData.length > 1 ? (
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={categoryChartData}
              margin={{
                top: 5,
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
              <Tooltip content={<CustomCategoryTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="averagePrice"
                name="Average Price"
                stroke="#10B981"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          Not enough data to show category average price history.
        </div>
      )}
    </>
  );
}
