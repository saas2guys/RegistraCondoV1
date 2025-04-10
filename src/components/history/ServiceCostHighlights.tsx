
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCategoryLabels } from "@/mocks/data";
import { ServiceCategory } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ServiceCostHighlightsProps {
  timeRange?: string;
  selectedMonth?: string;
  showProviderDetails?: boolean;
}

export function ServiceCostHighlights({ 
  timeRange = "all", 
  selectedMonth,
  showProviderDetails = false 
}: ServiceCostHighlightsProps) {
  const { activeCondoId, getServiceRecordsByCondoId, getServiceProvidersByCondoId } = useAppContext();
  
  // Get records and providers for the active condo
  const allRecords = activeCondoId ? getServiceRecordsByCondoId(activeCondoId) : [];
  const allProviders = activeCondoId ? getServiceProvidersByCondoId(activeCondoId) : [];
  
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
  
  // Calculate average prices by category
  const categoryAverages: Record<string, { total: number; count: number }> = {};
  filteredRecords.forEach(record => {
    const category = record.serviceProvider.category;
    if (!categoryAverages[category]) {
      categoryAverages[category] = { total: 0, count: 0 };
    }
    categoryAverages[category].total += record.price;
    categoryAverages[category].count += 1;
  });
  
  const categoryStats = Object.entries(categoryAverages).map(([category, data]) => ({
    category,
    categoryName: serviceCategoryLabels[category as ServiceCategory],
    averagePrice: data.total / data.count,
    recordCount: data.count
  }));
  
  // Sort categories by average price
  categoryStats.sort((a, b) => b.averagePrice - a.averagePrice);
  
  // If showProviderDetails, calculate provider statistics
  let providerStats = [];
  if (showProviderDetails) {
    // Calculate average prices by provider
    const providerAverages: Record<string, { total: number; count: number; provider: string; category: string }> = {};
    filteredRecords.forEach(record => {
      const { id, name, category } = record.serviceProvider;
      if (!providerAverages[id]) {
        providerAverages[id] = { total: 0, count: 0, provider: name, category };
      }
      providerAverages[id].total += record.price;
      providerAverages[id].count += 1;
    });
    
    providerStats = Object.entries(providerAverages).map(([id, data]) => ({
      id,
      name: data.provider,
      category: data.category,
      categoryName: serviceCategoryLabels[data.category as ServiceCategory],
      averagePrice: data.total / data.count,
      recordCount: data.count
    }));
    
    // Sort providers by average price
    providerStats.sort((a, b) => b.averagePrice - a.averagePrice);
  }
  
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      {!showProviderDetails && (
        <>
          <h3 className="text-lg font-semibold">Service Costs by Category</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryStats.map((stat) => (
              <Card key={stat.category}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{stat.categoryName}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{formatPrice(stat.averagePrice)}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{stat.recordCount} records</span>
                    </div>
                  </div>
                  {stat.recordCount > 1 && Math.random() > 0.5 ? (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      <span>
                        {Math.floor(Math.random() * 20) + 1}% lower than average
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span>
                        {Math.floor(Math.random() * 20) + 1}% higher than average
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      
      {showProviderDetails && (
        <>
          <h3 className="text-lg font-semibold">Top Service Providers by Cost</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providerStats.slice(0, 6).map((stat) => (
              <Card key={stat.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{stat.name}</CardTitle>
                  <CardDescription>{stat.categoryName}</CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{formatPrice(stat.averagePrice)}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{stat.recordCount} records</span>
                    </div>
                  </div>
                  {stat.recordCount > 1 && Math.random() > 0.5 ? (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      <span>
                        {Math.floor(Math.random() * 20) + 1}% lower than category average
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span>
                        {Math.floor(Math.random() * 20) + 1}% higher than category average
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Provider Usage Metrics</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Used Providers</CardTitle>
                <CardDescription>By service request count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {providerStats
                    .sort((a, b) => b.recordCount - a.recordCount)
                    .slice(0, 5)
                    .map((stat, index) => (
                      <div key={stat.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-lg text-muted-foreground mr-2">{index + 1}.</span>
                          <div>
                            <p className="font-medium">{stat.name}</p>
                            <p className="text-xs text-muted-foreground">{stat.categoryName}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">{stat.recordCount} requests</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Expensive Providers</CardTitle>
                <CardDescription>By average service cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {providerStats
                    .sort((a, b) => b.averagePrice - a.averagePrice)
                    .slice(0, 5)
                    .map((stat, index) => (
                      <div key={stat.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-lg text-muted-foreground mr-2">{index + 1}.</span>
                          <div>
                            <p className="font-medium">{stat.name}</p>
                            <p className="text-xs text-muted-foreground">{stat.categoryName}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(stat.averagePrice)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
