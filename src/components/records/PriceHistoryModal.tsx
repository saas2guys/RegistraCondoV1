
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppContext } from "@/contexts/AppContext";
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
} from "recharts";
import { User } from "lucide-react";

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
  const { getProviderPriceHistory } = useAppContext();
  const isMobile = useIsMobile();

  if (!record) return null;

  const priceHistory = getProviderPriceHistory(
    record.serviceProvider.id, 
    record.serviceProvider.category
  );

  // Format data for the chart
  const chartData = priceHistory.map(record => ({
    date: formatDate(record.date),
    price: record.price,
    formattedPrice: formatPrice(record.price),
    description: record.description,
    requestedBy: record.requestedByUser?.name || 'Unknown',
    requestedById: record.requestedByUser?.id || ''
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
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
      <Content className={isMobile ? "sm:max-w-full" : "sm:max-w-[600px]"}>
        <Header>
          <Title>Price History - {record.serviceProvider.name}</Title>
        </Header>
        
        <div className="mt-4">
          <div className="mb-2 text-sm text-muted-foreground">
            Showing price history for {record.serviceProvider.name} ({record.serviceProvider.category})
          </div>
          
          {chartData.length > 1 ? (
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
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
                  <Tooltip content={<CustomTooltip />} />
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
              {chartData.length === 1 && (
                <div className="mt-4 flex justify-center">
                  <div className="border rounded-md p-4 max-w-[300px]">
                    <div className="font-medium">Price: {chartData[0].formattedPrice}</div>
                    <div className="text-sm text-muted-foreground mt-1">Date: {chartData[0].date}</div>
                    <div className="text-sm mt-2">Requested by: {chartData[0].requestedBy}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Recent Prices</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Requested By</th>
                  <th className="py-2 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {chartData.length > 0 ? (
                  chartData.slice().reverse().map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-2 px-4">{item.date}</td>
                      <td className="py-2 px-4">{item.formattedPrice}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {item.requestedBy}
                        </div>
                      </td>
                      <td className="py-2 px-4 max-w-[200px] truncate">{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-muted-foreground">
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
