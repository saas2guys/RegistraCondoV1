
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { Store } from "lucide-react";

interface NoProvidersProps {
  onAdd: () => void;
}

export function NoProviders({ onAdd }: NoProvidersProps) {
  return (
    <EmptyState
      icon={<Store className="h-10 w-10 text-muted-foreground" />}
      title="No Service Providers Found"
      description="There are no service providers for this condo yet. Add your first service provider to help your neighbors!"
      action={
        <Button onClick={onAdd}>
          Add Service Provider
        </Button>
      }
    />
  );
}
