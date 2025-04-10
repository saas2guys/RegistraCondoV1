
import { CreateAlertForm } from "./CreateAlertForm";
import { ServiceCategory } from "@/types";

interface AlertsHeaderProps {
  onCreateAlert: (newAlert: {
    serviceCategory: ServiceCategory;
    threshold: number;
    isAboveThreshold: boolean;
    isActive: boolean;
  }) => void;
}

export function AlertsHeader({ onCreateAlert }: AlertsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Price Alerts</h2>
      <CreateAlertForm onCreateAlert={onCreateAlert} />
    </div>
  );
}
