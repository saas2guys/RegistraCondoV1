
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AlertsEmptyStateProps {
  onCreateClick: () => void;
}

export function AlertsEmptyState({ onCreateClick }: AlertsEmptyStateProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>No Alerts Set</CardTitle>
        <CardDescription>
          Create your first price alert to get notified when prices change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Price alerts help you track when service costs go above or below your specified thresholds.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </CardFooter>
    </Card>
  );
}
