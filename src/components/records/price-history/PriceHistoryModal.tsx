
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppContext } from "@/contexts/app";
import { ServiceRecord } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderHistoryTab } from "./ProviderHistoryTab";
import { CategoryAverageTab } from "./CategoryAverageTab";
import { FrequencyTab } from "./FrequencyTab";
import { PriceHistoryTable } from "./PriceHistoryTable";

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
            <ProviderHistoryTab record={record} providerHistory={providerHistory} />
          </TabsContent>
          
          <TabsContent value="category">
            <CategoryAverageTab record={record} categoryHistory={categoryHistory} />
          </TabsContent>
          
          <TabsContent value="frequency">
            <FrequencyTab record={record} frequencyData={frequencyData} />
          </TabsContent>
        </Tabs>
        
        <PriceHistoryTable categoryHistory={categoryHistory} />
      </Content>
    </Container>
  );
}
