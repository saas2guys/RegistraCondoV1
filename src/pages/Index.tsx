
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MainTabs } from "@/components/layout/Tabs";
import { NoActiveCondo } from "@/components/empty-states/NoActiveCondo";
import { NoRecords } from "@/components/empty-states/NoRecords";
import { NoProviders } from "@/components/empty-states/NoProviders";
import { ServiceRecordsTable } from "@/components/records/ServiceRecordsTable";
import { ServiceProvidersGrid } from "@/components/providers/ServiceProvidersGrid";
import { ServiceRecordDialog } from "@/components/records/ServiceRecordDialog";
import { ServiceProviderDialog } from "@/components/providers/ServiceProviderDialog";
import { HistoryDashboard } from "@/components/history/HistoryDashboard";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProviderComparison } from "@/components/providers/ProviderComparison";
import { PriceAlertsManager } from "@/components/alerts/PriceAlertsManager";
import { useAppContext } from "@/contexts/app";
import { ServiceProvider, ServiceRecord } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const {
    activeCondoId,
    getServiceRecordsByCondoId,
    getServiceProvidersByCondoId,
    deleteServiceRecord,
    deleteServiceProvider,
  } = useAppContext();
  
  // UI State
  const [activeTab, setActiveTab] = useState("records");
  const [toolsTab, setToolsTab] = useState("comparison");
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | undefined>();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "record" | "provider" } | null>(null);
  
  // Get data for the current condo
  const condoRecords = activeCondoId ? getServiceRecordsByCondoId(activeCondoId) : [];
  const condoProviders = activeCondoId ? getServiceProvidersByCondoId(activeCondoId) : [];
  
  // Show the records tab if there are no records but providers exist
  const hasProviders = condoProviders.length > 0;
  const hasRecords = condoRecords.length > 0;
  
  // Handlers
  const handleAddRecord = () => {
    setSelectedRecord(undefined);
    setIsAddRecordOpen(true);
  };
  
  const handleEditRecord = (record: ServiceRecord) => {
    setSelectedRecord(record);
    setIsAddRecordOpen(true);
  };
  
  const handleDeleteRecord = (id: string) => {
    setItemToDelete({ id, type: "record" });
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddProvider = () => {
    setSelectedProvider(undefined);
    setIsAddProviderOpen(true);
  };
  
  const handleEditProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsAddProviderOpen(true);
  };
  
  const handleDeleteProvider = (id: string) => {
    setItemToDelete({ id, type: "provider" });
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "record") {
        deleteServiceRecord(itemToDelete.id);
      } else {
        deleteServiceProvider(itemToDelete.id);
      }
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  const viewDocument = (url: string) => {
    window.open(url, "_blank");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-4">
        {!activeCondoId ? (
          <NoActiveCondo onSelect={() => {}} />
        ) : (
          <>
            {hasProviders && hasRecords && activeTab === "records" && (
              <DashboardMetrics />
            )}
            
            <MainTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onAddRecord={handleAddRecord}
              onAddProvider={handleAddProvider}
            />
            
            <div className="p-4">
              {activeTab === "records" && (
                <>
                  {!hasProviders ? (
                    <NoProviders onAdd={handleAddProvider} />
                  ) : hasRecords ? (
                    <ServiceRecordsTable
                      records={condoRecords}
                      onEdit={handleEditRecord}
                      onDelete={handleDeleteRecord}
                      onViewDocument={viewDocument}
                    />
                  ) : (
                    <NoRecords onAdd={handleAddRecord} />
                  )}
                </>
              )}
              
              {activeTab === "providers" && (
                <>
                  {hasProviders ? (
                    <ServiceProvidersGrid
                      providers={condoProviders}
                      onEdit={handleEditProvider}
                      onDelete={handleDeleteProvider}
                    />
                  ) : (
                    <NoProviders onAdd={handleAddProvider} />
                  )}
                </>
              )}
              
              {activeTab === "history" && (
                <>
                  {hasRecords ? (
                    <HistoryDashboard />
                  ) : (
                    <NoRecords onAdd={handleAddRecord} />
                  )}
                </>
              )}
              
              {activeTab === "tools" && (
                <div className="space-y-4">
                  <Tabs value={toolsTab} onValueChange={setToolsTab} className="w-full">
                    <TabsList className="w-full max-w-md grid grid-cols-2">
                      <TabsTrigger value="comparison">Provider Comparison</TabsTrigger>
                      <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="comparison">
                      <ProviderComparison />
                    </TabsContent>
                    <TabsContent value="alerts">
                      <PriceAlertsManager />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      {/* Dialogs */}
      <ServiceRecordDialog
        open={isAddRecordOpen}
        onOpenChange={setIsAddRecordOpen}
        initialData={selectedRecord}
      />
      
      <ServiceProviderDialog
        open={isAddProviderOpen}
        onOpenChange={setIsAddProviderOpen}
        initialData={selectedProvider}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {itemToDelete?.type === "record" ? " service record." : " service provider."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
