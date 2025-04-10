
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCategoryLabels } from "@/mocks/data";
import { ServiceCategory } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ServiceCostHighlights() {
  const { activeCondoId, getServiceRecordsByCondoId } = useAppContext();
  
  // Get records for the active condo
  const condoRecords = activeCondoId ? getServiceRecordsByCondoId(activeCondoId) : [];
  
  // Calculate average prices by category
  const categoryAverages: Record<string, { total: number; count: number }> = {};
  condoRecords.forEach(record => {
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
  
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Costs by Category</CardTitle>
        <CardDescription>
          Average service costs across different categories
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
