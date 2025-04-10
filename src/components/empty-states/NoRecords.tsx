
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { ClipboardList } from "lucide-react";

interface NoRecordsProps {
  onAdd: () => void;
}

export function NoRecords({ onAdd }: NoRecordsProps) {
  return (
    <EmptyState
      icon={<ClipboardList className="h-10 w-10 text-muted-foreground" />}
      title="No Service Records Found"
      description="There are no service records for this condo yet. Add your first service record to help your neighbors!"
      action={
        <Button onClick={onAdd}>
          Add Service Record
        </Button>
      }
    />
  );
}
