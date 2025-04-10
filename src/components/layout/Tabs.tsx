
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, History, List, Plus } from "lucide-react";

interface MainTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onAddRecord: () => void;
  onAddProvider: () => void;
}

export function MainTabs({ 
  activeTab, 
  onTabChange, 
  onAddRecord, 
  onAddProvider 
}: MainTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="records" className="flex items-center gap-1.5">
            <List className="h-4 w-4" />
            <span>Records</span>
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            <span>Providers</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1.5">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex gap-2">
        {activeTab === "records" && (
          <Button onClick={onAddRecord} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" />
            Add Record
          </Button>
        )}
        
        {activeTab === "providers" && (
          <Button onClick={onAddProvider} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" />
            Add Provider
          </Button>
        )}
      </div>
    </div>
  );
}
