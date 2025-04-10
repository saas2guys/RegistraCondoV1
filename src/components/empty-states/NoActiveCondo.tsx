
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { Building } from "lucide-react";

interface NoActiveCondoProps {
  onSelect: () => void;
}

export function NoActiveCondo({ onSelect }: NoActiveCondoProps) {
  return (
    <EmptyState
      icon={<Building className="h-10 w-10 text-muted-foreground" />}
      title="No Condo Selected"
      description="Please select a condo to view service records and providers."
      action={
        <Button onClick={onSelect}>
          Select Condo
        </Button>
      }
    />
  );
}
