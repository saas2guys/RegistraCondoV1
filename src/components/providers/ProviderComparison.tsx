
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/app";
import { serviceCategoryLabels } from "@/mocks/data";
import { ServiceProvider, ServiceCategory } from "@/types";
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
import { Building, ArrowRight } from "lucide-react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";

export function ProviderComparison() {
  const { activeCondoId, getServiceProvidersByCondoId, getProviderPriceHistory } = useAppContext();
  const [category, setCategory] = useState<ServiceCategory | "">("");
  const [provider1, setProvider1] = useState<string>("");
  const [provider2, setProvider2] = useState<string>("");
  
  // Get providers for the active condo
  const allProviders = activeCondoId ? getServiceProvidersByCondoId(activeCondoId) : [];
  
  // Filter providers by selected category
  const filteredProviders = category 
    ? allProviders.filter(provider => provider.category === category)
    : allProviders;
  
  // Group providers by category
  const providersByCategory: Record<string, ServiceProvider[]> = {};
  allProviders.forEach(provider => {
    if (!providersByCategory[provider.category]) {
      providersByCategory[provider.category] = [];
    }
    providersByCategory[provider.category].push(provider);
  });
  
  // Available categories with at least 2 providers
  const categoriesWithMultipleProviders = Object.entries(providersByCategory)
    .filter(([_, providers]) => providers.length >= 2)
    .map(([category]) => category as ServiceCategory);
  
  // Get price history for selected providers
  const provider1Data = provider1 
    ? getProviderPriceHistory(provider1, category as ServiceCategory) 
    : [];
  
  const provider2Data = provider2 
    ? getProviderPriceHistory(provider2, category as ServiceCategory) 
    : [];
  
  // Find provider objects
  const provider1Obj = allProviders.find(p => p.id === provider1);
  const provider2Obj = allProviders.find(p => p.id === provider2);
  
  // Prepare chart data
  const prepareChartData = () => {
    const formattedProvider1Data = provider1Data.map(record => ({
      date: formatDate(record.date),
      [provider1Obj?.name || "Provider 1"]: record.price,
    }));
    
    const formattedProvider2Data = provider2Data.map(record => ({
      date: formatDate(record.date),
      [provider2Obj?.name || "Provider 2"]: record.price,
    }));
    
    // Merge data by date
    const mergedData: Record<string, any> = {};
    
    formattedProvider1Data.forEach(item => {
      if (!mergedData[item.date]) {
        mergedData[item.date] = { date: item.date };
      }
      mergedData[item.date][provider1Obj?.name || "Provider 1"] = item[provider1Obj?.name || "Provider 1"];
    });
    
    formattedProvider2Data.forEach(item => {
      if (!mergedData[item.date]) {
        mergedData[item.date] = { date: item.date };
      }
      mergedData[item.date][provider2Obj?.name || "Provider 2"] = item[provider2Obj?.name || "Provider 2"];
    });
    
    // Convert to array and sort by date
    return Object.values(mergedData).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };
  
  const chartData = prepareChartData();
  
  // Handler for category change
  const handleCategoryChange = (value: string) => {
    setCategory(value as ServiceCategory);
    setProvider1("");
    setProvider2("");
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-md shadow-md border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatPrice(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Price Comparison</CardTitle>
        <CardDescription>
          Compare price history between two service providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Category</label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category with multiple providers" />
              </SelectTrigger>
              <SelectContent>
                {categoriesWithMultipleProviders.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {serviceCategoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {category && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Provider 1</label>
                <Select value={provider1} onValueChange={setProvider1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id} disabled={provider.id === provider2}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Provider 2</label>
                <Select value={provider2} onValueChange={setProvider2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id} disabled={provider.id === provider1}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {provider1 && provider2 && chartData.length > 0 ? (
            <div className="space-y-6">
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
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={provider1Obj?.name || "Provider 1"}
                      stroke="#8B5CF6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey={provider2Obj?.name || "Provider 2"}
                      stroke="#F97316"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Provider Comparison</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>{provider1Obj?.name || "Provider 1"}</TableHead>
                      <TableHead>Comparison</TableHead>
                      <TableHead>{provider2Obj?.name || "Provider 2"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Average Price</TableCell>
                      <TableCell>
                        {formatPrice(
                          provider1Data.reduce((sum, item) => sum + item.price, 0) / 
                          (provider1Data.length || 1)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(
                          provider2Data.reduce((sum, item) => sum + item.price, 0) / 
                          (provider2Data.length || 1)
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lowest Price</TableCell>
                      <TableCell>
                        {formatPrice(
                          Math.min(...provider1Data.map(item => item.price), Infinity)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(
                          Math.min(...provider2Data.map(item => item.price), Infinity)
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Highest Price</TableCell>
                      <TableCell>
                        {formatPrice(
                          Math.max(...provider1Data.map(item => item.price), 0)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(
                          Math.max(...provider2Data.map(item => item.price), 0)
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Service Count</TableCell>
                      <TableCell>{provider1Data.length}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>{provider2Data.length}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            provider1 && provider2 && (
              <div className="p-8 text-center text-muted-foreground">
                No data available to compare these providers.
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
