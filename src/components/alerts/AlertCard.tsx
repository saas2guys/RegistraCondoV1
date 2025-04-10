
import { PriceAlert, ServiceCategory } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, ArrowUp, Bell, BellOff, Trash2 } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { serviceCategoryLabels } from "@/mocks/data";

interface AlertCardProps {
  alert: PriceAlert;
  latestPrice: number | null;
  onToggleActive: (alert: PriceAlert) => void;
  onDelete: (id: string) => void;
}

export function AlertCard({ alert, latestPrice, onToggleActive, onDelete }: AlertCardProps) {
  const isTriggered = latestPrice !== null && (
    (alert.isAboveThreshold && latestPrice > alert.threshold) ||
    (!alert.isAboveThreshold && latestPrice < alert.threshold)
  );

  return (
    <Card className={isTriggered && alert.isActive ? "border-amber-500" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {serviceCategoryLabels[alert.serviceCategory]}
          </CardTitle>
          <Switch
            checked={alert.isActive}
            onCheckedChange={() => onToggleActive(alert)}
            aria-label="Toggle alert"
          />
        </div>
        <CardDescription>
          Alert when price is {alert.isAboveThreshold ? "above" : "below"} {formatPrice(alert.threshold)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isTriggered && alert.isActive && (
            <Alert variant="warning" className="bg-amber-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Alert Triggered!</AlertTitle>
              <AlertDescription>
                Current price: {formatPrice(latestPrice!)}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={alert.isActive ? "default" : "outline"}>
              {alert.isActive ? (
                <>
                  <Bell className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <BellOff className="h-3 w-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Threshold:</span>
            <span className="flex items-center">
              {formatPrice(alert.threshold)}
              {alert.isAboveThreshold ? (
                <ArrowUp className="h-3 w-3 ml-1 text-red-500" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1 text-green-500" />
              )}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(alert.createdAt)}</span>
          </div>
          
          {alert.lastTriggered && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last triggered:</span>
              <span>{formatDate(alert.lastTriggered)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(alert.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Alert
        </Button>
      </CardFooter>
    </Card>
  );
}
