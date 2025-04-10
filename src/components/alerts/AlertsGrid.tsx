
import { PriceAlert, ServiceCategory } from "@/types";
import { AlertCard } from "./AlertCard";
import { AlertsEmptyState } from "./AlertsEmptyState";

interface AlertsGridProps {
  alerts: PriceAlert[];
  getLatestPrice: (category: ServiceCategory) => number | null;
  onToggleActive: (alert: PriceAlert) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
  isDialogOpen: boolean;
}

export function AlertsGrid({ 
  alerts, 
  getLatestPrice, 
  onToggleActive, 
  onDelete, 
  onCreateClick,
  isDialogOpen 
}: AlertsGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {alerts.length > 0 ? (
        alerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            latestPrice={getLatestPrice(alert.serviceCategory)}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
          />
        ))
      ) : (
        <AlertsEmptyState onCreateClick={onCreateClick} />
      )}
    </div>
  );
}
