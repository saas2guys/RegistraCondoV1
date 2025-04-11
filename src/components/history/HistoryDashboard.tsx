
import { useState } from "react";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { ServiceCostHighlights } from "./ServiceCostHighlights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/contexts/app";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TimeRange = "all" | "month" | "quarter" | "year";

export function HistoryDashboard() {
  const { activeCondoId } = useAppContext();
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );
  
  // Generate months list for the select input
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Generate months for the current year and previous year
    for (let year = currentYear; year >= currentYear - 2; year--) {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Service History Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
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
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PriceHistoryChart timeRange={timeRange} selectedMonth={selectedMonth} />
            </div>
            <div>
              <CategoryBreakdown timeRange={timeRange} selectedMonth={selectedMonth} />
            </div>
            <div className="lg:col-span-3">
              <ServiceCostHighlights timeRange={timeRange} selectedMonth={selectedMonth} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends Analysis</CardTitle>
              <CardDescription>
                Detailed analysis of price changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <PriceHistoryChart 
                  timeRange={timeRange} 
                  selectedMonth={selectedMonth} 
                  expanded={true} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of service categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <CategoryBreakdown 
                  timeRange={timeRange} 
                  selectedMonth={selectedMonth} 
                  expanded={true} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="providers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of service providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceCostHighlights 
                timeRange={timeRange} 
                selectedMonth={selectedMonth}
                showProviderDetails={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
