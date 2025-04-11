
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppContext } from "@/contexts/app";
import { ServiceRecord } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PriceHistoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  record?: ServiceRecord;
}

export function PriceHistoryModal({ 
  isOpen, 
  onOpenChange, 
  record 
}: PriceHistoryModalProps) {
  const { getProviderPriceHistory, getCategoryPriceHistory, getServiceFrequencyByMonth } = useAppContext();
  const isMobile = useIsMobile();

  if (!record) return null;

  // Get price history for this specific provider
  const providerHistory = getProviderPriceHistory(
    record.serviceProvider.id, 
    record.serviceProvider.category
  );

  // Get price history for all providers in this category
  const categoryHistory = getCategoryPriceHistory(
    record.serviceProvider.category
  );

  // Get service request frequency by month
  const frequencyData = getServiceFrequencyByMonth(
    record.serviceProvider.category
  );

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

  // Format data for the frequency chart
  const frequencyChartData = frequencyData.map(item => ({
    month: item.month,
    count: item.count
  }));

  const CustomPriceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-md shadow-md border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Price: <span className="font-medium text-primary">{payload[0].payload.formattedPrice}</span>
          </p>
          <p className="text-sm text-muted-foreground max-w-[200px] truncate">
            {payload[0].payload.description}
          </p>
          <p className="text-sm mt-1">
            Requested by: <span className="font-medium">{payload[0].payload.requestedBy}</span>
          </p>
          <p className="text-sm">
            Provider: <span className="font-medium">{payload[0].payload.provider}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomCategoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-md shadow-md border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Average Price: <span className="font-medium text-primary">{payload[0].payload.formattedPrice}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomFrequencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-md shadow-md border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Service Requests: <span className="font-medium text-primary">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Use Sheet on mobile and Dialog on desktop
  const Container = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className={isMobile ? "sm:max-w-full" : "sm:max-w-[800px]"}>
        <Header>
          <Title>Price History - {record.serviceProvider.name}</Title>
        </Header>
        
        <Tabs defaultValue="provider" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="provider">Provider History</TabsTrigger>
            <TabsTrigger value="category">Category Average</TabsTrigger>
            <TabsTrigger value="frequency">Request Frequency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider">
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
          </TabsContent>
          
          <TabsContent value="category">
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
          </TabsContent>
          
          <TabsContent value="frequency">
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
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Recent Prices</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Provider</th>
                  <th className="py-2 px-4 text-left">Requested By</th>
                  <th className="py-2 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {categoryHistory.length > 0 ? (
                  categoryHistory.slice().reverse().map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-2 px-4">{formatDate(item.date)}</td>
                      <td className="py-2 px-4">{formatPrice(item.price)}</td>
                      <td className="py-2 px-4">{item.serviceProvider.name}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {item.requestedByUser?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="py-2 px-4 max-w-[200px] truncate">{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">
                      No price history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Content>
    </Container>
  );
}
