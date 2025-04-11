
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/contexts/app";
import { serviceCategoryLabels } from "@/mocks/data";
import { ServiceCategory } from "@/types";
import { Building, Calendar, WrenchIcon, Wallet } from "lucide-react";

type TimeRange = "all" | "month";

export function DashboardMetrics() {
  const { activeCondoId, getServiceRecordsByCondoId, getServiceProvidersByCondoId } = useAppContext();
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );
  
  // Get records and providers for the active condo
  const allRecords = activeCondoId ? getServiceRecordsByCondoId(activeCondoId) : [];
  const allProviders = activeCondoId ? getServiceProvidersByCondoId(activeCondoId) : [];
  
  // Filter records by selected time range
  const filteredRecords = allRecords.filter(record => {
    if (timeRange === "all") return true;
    
    const recordDate = new Date(record.date);
    const recordMonth = recordDate.toISOString().substring(0, 7);
    return recordMonth === selectedMonth;
  });
  
  // Calculate metrics
  const totalProviders = allProviders.length;
  const totalServices = filteredRecords.length;
  
  // Calculate average price by category
  const priceByCategory: Record<string, { total: number; count: number }> = {};
  filteredRecords.forEach(record => {
    const category = record.serviceProvider.category;
    if (!priceByCategory[category]) {
      priceByCategory[category] = { total: 0, count: 0 };
    }
    priceByCategory[category].total += record.price;
    priceByCategory[category].count += 1;
  });
  
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };
  
  // Generate months list for the select input
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Generate months for the current year and previous year
    for (let year = currentYear; year >= currentYear - 1; year--) {
      const startMonth = year === currentYear ? currentMonth : 11;
      for (let month = startMonth; month >= 0; month--) {
        const date = new Date(year, month, 1);
        const value = date.toISOString().substring(0, 7);
        const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        months.push({ value, label });
      }
    }
    
    return months;
  };
  
  const monthOptions = generateMonthOptions();
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard Metrics</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          {timeRange === "month" && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-medium">Total Providers</CardTitle>
              <CardDescription>Registered service providers</CardDescription>
            </div>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-3">
            <div className="text-2xl font-bold">{totalProviders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-medium">Services Requested</CardTitle>
              <CardDescription>Completed service requests</CardDescription>
            </div>
            <WrenchIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-3">
            <div className="text-2xl font-bold">{totalServices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-medium">Average Cost</CardTitle>
              <CardDescription>Across all services</CardDescription>
            </div>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-3">
            <div className="text-2xl font-bold">
              {formatPrice(
                filteredRecords.reduce((acc, record) => acc + record.price, 0) / 
                (filteredRecords.length || 1)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mt-4">Average Price by Category</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(priceByCategory).map(([category, data]) => (
          <Card key={category}>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">
                {serviceCategoryLabels[category as ServiceCategory]}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">
                {formatPrice(data.total / data.count)}
              </div>
              <div className="text-xs text-muted-foreground">
                Based on {data.count} service records
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
