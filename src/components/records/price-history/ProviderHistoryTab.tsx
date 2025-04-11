
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
import { CustomPriceTooltip } from "./ChartTooltips";

interface ProviderHistoryTabProps {
  record: ServiceRecord;
  providerHistory: ServiceRecord[];
}

export function ProviderHistoryTab({ record, providerHistory }: ProviderHistoryTabProps) {
  const isMobile = useIsMobile();

  // Format data for the provider price chart
  const providerChartData = providerHistory.map(record => ({
    date: formatDate(record.date),
    price: record.price,
    formattedPrice: formatPrice(record.price),
    description: record.description,
    requestedBy: record.requestedByUser?.name || 'Unknown',
    requestedById: record.requestedByUser?.id || '',
    provider: record.serviceProvider.name
  }));

  return (
    <>
      <div className="mt-2 text-sm text-muted-foreground">
        Showing price history for {record.serviceProvider.name} ({record.serviceProvider.category})
      </div>
      
      {providerChartData.length > 1 ? (
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={providerChartData}
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
              <Tooltip content={<CustomPriceTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#8B5CF6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          Not enough data to show price history graph.
          {providerChartData.length === 1 && (
            <div className="mt-4 flex justify-center">
              <div className="border rounded-md p-4 max-w-[300px]">
                <div className="font-medium">Price: {providerChartData[0].formattedPrice}</div>
                <div className="text-sm text-muted-foreground mt-1">Date: {providerChartData[0].date}</div>
                <div className="text-sm mt-2">Requested by: {providerChartData[0].requestedBy}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
