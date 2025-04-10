
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { PriceAlert, ServiceCategory } from "@/types";
import { AlertCard } from "./AlertCard";
import { CreateAlertForm } from "./CreateAlertForm";
import { AlertsEmptyState } from "./AlertsEmptyState";

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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Price Alerts</h2>
        <CreateAlertForm onCreateAlert={handleCreateAlert} />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              latestPrice={getLatestPrice(alert.serviceCategory)}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteAlert}
            />
          ))
        ) : (
          <AlertsEmptyState onCreateClick={() => setIsDialogOpen(true)} />
        )}
      </div>
    </div>
  );
}
