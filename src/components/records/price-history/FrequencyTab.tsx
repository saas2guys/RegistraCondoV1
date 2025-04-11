
import { ServiceRecord } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomFrequencyTooltip } from "./ChartTooltips";

interface FrequencyTabProps {
  record: ServiceRecord;
  frequencyData: { month: string; count: number }[];
}

export function FrequencyTab({ record, frequencyData }: FrequencyTabProps) {
  const isMobile = useIsMobile();

  // Format data for the frequency chart
  const frequencyChartData = frequencyData.map(item => ({
    month: item.month,
    count: item.count
  }));

  return (
    <>
      <div className="mt-2 text-sm text-muted-foreground">
        Showing request frequency for {record.serviceProvider.category} services by month
      </div>
      
      {frequencyChartData.length > 0 ? (
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={frequencyChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomFrequencyTooltip />} />
              <Legend />
              <Bar
                dataKey="count"
                name="Service Requests"
                fill="#F97316"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No data available to show service request frequency.
        </div>
      )}
    </>
  );
}
