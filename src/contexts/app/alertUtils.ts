
import { PriceAlert, ServiceCategory, ServiceRecord } from "@/types";
import { serviceCategoryLabels } from "@/mocks/data";
import { toast } from "sonner";

export function addPriceAlert(
  alerts: PriceAlert[], 
  setAlerts: React.Dispatch<React.SetStateAction<PriceAlert[]>>,
  alert: Omit<PriceAlert, "id" | "createdAt" | "updatedAt" | "lastTriggered">
) {
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert${alerts.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  setAlerts([...alerts, newAlert]);
  toast.success(`Price alert for ${serviceCategoryLabels[alert.serviceCategory]} has been created`);
}

export function updatePriceAlert(
  alerts: PriceAlert[], 
  setAlerts: React.Dispatch<React.SetStateAction<PriceAlert[]>>,
  id: string, 
  alertUpdate: Partial<PriceAlert>
) {
  setAlerts(prevAlerts => 
    prevAlerts.map(alert => 
      alert.id === id ? { 
        ...alert, 
        ...alertUpdate,
        updatedAt: new Date().toISOString()
      } : alert
    )
  );
  toast.success("Price alert updated");
}

export function deletePriceAlert(
  alerts: PriceAlert[], 
  setAlerts: React.Dispatch<React.SetStateAction<PriceAlert[]>>,
  id: string
) {
  setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  toast.success("Price alert deleted");
}

export function getPriceAlertsByCondoId(
  alerts: PriceAlert[], 
  condoId: string,
  userId: string
) {
  return alerts.filter(alert => alert.condoId === condoId && alert.userId === userId);
}

export function checkPriceAlerts(
  alerts: PriceAlert[],
  updateAlert: (id: string, alert: Partial<PriceAlert>) => void,
  getServiceRecordsByCondoId: (condoId: string) => ServiceRecord[],
  activeCondoId: string | null,
  userId: string
) {
  if (!activeCondoId) return;
  
  const condoRecords = getServiceRecordsByCondoId(activeCondoId);
  const activeAlerts = alerts.filter(alert => 
    alert.condoId === activeCondoId && 
    alert.userId === userId &&
    alert.isActive
  );
  
  activeAlerts.forEach(alert => {
    // Get the latest records for this category
    const categoryRecords = condoRecords.filter(record => 
      record.serviceProvider.category === alert.serviceCategory
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (categoryRecords.length > 0) {
      const latestRecord = categoryRecords[0];
      const isAboveThreshold = latestRecord.price > alert.threshold;
      
      // If the threshold state has changed, update the alert
      if (isAboveThreshold !== alert.isAboveThreshold) {
        updateAlert(alert.id, { 
          isAboveThreshold, 
          lastTriggered: new Date().toISOString() 
        });
        
        // Show a toast notification for the alert
        const message = isAboveThreshold 
          ? `${serviceCategoryLabels[alert.serviceCategory]} price is now above your threshold of $${alert.threshold}`
          : `${serviceCategoryLabels[alert.serviceCategory]} price is now below your threshold of $${alert.threshold}`;
        
        toast.warning(message, {
          description: `Latest price: $${latestRecord.price} from ${latestRecord.serviceProvider.name}`,
          duration: 5000
        });
      }
    }
  });
}
