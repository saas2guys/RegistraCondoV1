
import { useAppContext } from "@/contexts/app";
import { ServiceCategory, ServiceProvider } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus, X, AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { serviceCategoryLabels } from "@/mocks/data";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function ProviderComparisonTool() {
  const { 
    activeCondoId, 
    providerComparison, 
    startProviderComparison, 
    clearProviderComparison,
    addProviderToComparison,
    removeProviderFromComparison,
    getServiceProvidersByCondoId,
    getServiceProvidersByCategory,
    getProviderPriceHistory,
    serviceCategories
  } = useAppContext();
  
  const [availableProviders, setAvailableProviders] = useState<ServiceProvider[]>([]);
  const [avgPrices, setAvgPrices] = useState<{[key: string]: number}>({});

  // Calculate average prices for each provider in comparison
  useEffect(() => {
    if (!providerComparison) return;
    
    const prices: {[key: string]: number} = {};
    
    providerComparison.providers.forEach(provider => {
      const history = getProviderPriceHistory(provider.id, provider.category);
      if (history.length > 0) {
        const sum = history.reduce((acc, record) => acc + record.price, 0);
        prices[provider.id] = sum / history.length;
      } else {
        prices[provider.id] = 0;
      }
    });
    
    setAvgPrices(prices);
  }, [providerComparison]);
  
  // Update available providers when category changes
  useEffect(() => {
    if (!activeCondoId || !providerComparison) return;
    
    const condoProviders = getServiceProvidersByCondoId(activeCondoId);
    const categoryProviders = condoProviders.filter(
      provider => provider.category === providerComparison.category
    );
    
    // Filter out providers already in comparison
    const availableForComparison = categoryProviders.filter(
      provider => !providerComparison.providers.some(p => p.id === provider.id)
    );
    
    setAvailableProviders(availableForComparison);
  }, [activeCondoId, providerComparison]);
  
  const handleSelectCategory = (category: string) => {
    startProviderComparison(category as ServiceCategory);
  };
  
  // Find the cheapest and most expensive providers
  const findPriceExtremes = () => {
    if (!providerComparison || providerComparison.providers.length === 0) return { cheapest: null, mostExpensive: null };
    
    const prices = Object.entries(avgPrices);
    if (prices.length === 0) return { cheapest: null, mostExpensive: null };
    
    let cheapestId = prices[0][0];
    let cheapestPrice = prices[0][1];
    
    let expensiveId = prices[0][0];
    let expensivePrice = prices[0][1];
    
    prices.forEach(([id, price]) => {
      if (price < cheapestPrice && price > 0) {
        cheapestId = id;
        cheapestPrice = price;
      }
      
      if (price > expensivePrice) {
        expensiveId = id;
        expensivePrice = price;
      }
    });
    
    return { 
      cheapest: cheapestPrice > 0 ? cheapestId : null, 
      mostExpensive: expensivePrice > 0 ? expensiveId : null 
    };
  };
  
  const { cheapest, mostExpensive } = findPriceExtremes();
  
  // Chart data preparation
  const getChartData = () => {
    if (!providerComparison) return [];
    
    return providerComparison.providers.map(provider => ({
      name: provider.name,
      id: provider.id,
      avgPrice: avgPrices[provider.id] || 0,
      formattedPrice: formatPrice(avgPrices[provider.id] || 0),
      color: provider.id === cheapest ? "#22c55e" : provider.id === mostExpensive ? "#ef4444" : "#8B5CF6",
      priceRecords: getProviderPriceHistory(provider.id, provider.category).length
    }));
  };
  
  const chartData = getChartData();

  // Check if any provider has records
  const hasRecords = chartData.some(data => data.priceRecords > 0);
  
  // Bar chart tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <div className="font-medium">{payload[0].payload.name}</div>
          <div>Average Price: {payload[0].payload.formattedPrice}</div>
          <div className="text-sm text-muted-foreground">
            Based on {payload[0].payload.priceRecords} service records
          </div>
        </div>
      );
    }
    return null;
  };
  
  if (!activeCondoId) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {!providerComparison ? (
        <Card>
          <CardHeader>
            <CardTitle>Provider Comparison Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Compare providers in the same category to find the best value for your needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <span className="min-w-[110px]">Select category:</span>
                <Select onValueChange={handleSelectCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {serviceCategoryLabels[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Comparing {serviceCategoryLabels[providerComparison.category]} Providers
            </h2>
            <Button variant="outline" size="sm" onClick={clearProviderComparison}>
              <X className="h-4 w-4 mr-2" />
              Clear Comparison
            </Button>
          </div>
          
          {providerComparison.providers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No providers added yet</AlertTitle>
              <AlertDescription>
                Add providers to compare their pricing and services.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {providerComparison.providers.map(provider => (
                  <Card key={provider.id} className="relative">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => removeProviderFromComparison(provider.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {provider.name}
                        {provider.id === cheapest && (
                          <Badge className="ml-auto" variant="outline">
                            <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                            Best Value
                          </Badge>
                        )}
                        {provider.id === mostExpensive && (
                          <Badge className="ml-auto" variant="outline">
                            <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                            Premium
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Average Price:</span>
                          <span className="font-medium text-lg">
                            {formatPrice(avgPrices[provider.id] || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{provider.phone || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Rating:</span>
                          <span>★★★★☆</span>
                        </div>
                        {provider.address && (
                          <div className="text-muted-foreground text-sm mt-2 truncate">
                            {provider.address}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {availableProviders.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="border border-dashed rounded-md flex flex-col items-center justify-center p-6 h-full cursor-pointer hover:bg-muted/50 transition-colors">
                        <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span>Add Provider</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <h3 className="font-medium">Add to comparison</h3>
                        <div className="text-sm text-muted-foreground mb-2">
                          Select a provider to add
                        </div>
                        {availableProviders.map(provider => (
                          <Button
                            key={provider.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addProviderToComparison(provider.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {provider.name}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              
              {providerComparison.providers.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Price Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasRecords ? (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
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
                              height={70}
                            />
                            <YAxis tickFormatter={(value) => `$${value}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="avgPrice" name="Average Price">
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        No price history available for these providers.
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
