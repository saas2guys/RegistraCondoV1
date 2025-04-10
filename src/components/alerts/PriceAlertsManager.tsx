
import { useState } from "react";
import { useAppContext } from "@/contexts/app";
import { PriceAlert, ServiceCategory } from "@/types";
import { AlertsHeader } from "./AlertsHeader";
import { AlertsGrid } from "./AlertsGrid";

export function PriceAlertsManager() {
  const { 
    activeCondoId, 
    getPriceAlertsByCondoId, 
    addPriceAlert, 
    updatePriceAlert, 
    deletePriceAlert,
    serviceRecords
  } = useAppContext();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!activeCondoId) return null;
  
  const alerts = getPriceAlertsByCondoId(activeCondoId);
  
  const handleToggleActive = (alert: PriceAlert) => {
    updatePriceAlert(alert.id, { isActive: !alert.isActive });
  };
  
  const handleDeleteAlert = (id: string) => {
    deletePriceAlert(id);
  };
  
  const handleCreateAlert = (newAlert: {
    serviceCategory: ServiceCategory;
    threshold: number;
    isAboveThreshold: boolean;
    isActive: boolean;
  }) => {
    if (!activeCondoId) return;
    
    addPriceAlert({
      condoId: activeCondoId,
      userId: 'user1', // Current user ID
      serviceCategory: newAlert.serviceCategory,
      threshold: newAlert.threshold,
      isAboveThreshold: newAlert.isAboveThreshold,
      isActive: newAlert.isActive
    });
  };
  
  const getLatestPrice = (category: ServiceCategory) => {
    if (!activeCondoId) return null;
    
    const categoryRecords = serviceRecords
      .filter(record => 
        record.condoId === activeCondoId && 
        record.serviceProvider.category === category
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return categoryRecords.length > 0 ? categoryRecords[0].price : null;
  };
  
  return (
    <div className="space-y-4">
      <AlertsHeader onCreateAlert={handleCreateAlert} />
      <AlertsGrid 
        alerts={alerts}
        getLatestPrice={getLatestPrice}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteAlert}
        onCreateClick={() => setIsDialogOpen(true)}
        isDialogOpen={isDialogOpen}
      />
    </div>
  );
}
