
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { PriceAlert, ServiceCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { serviceCategories, serviceCategoryLabels } from "@/mocks/data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, Bell, BellOff, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [newAlert, setNewAlert] = useState<{
    serviceCategory: ServiceCategory;
    threshold: number;
    isAboveThreshold: boolean;
    isActive: boolean;
  }>({
    serviceCategory: "plumbing",
    threshold: 100,
    isAboveThreshold: true,
    isActive: true
  });
  
  if (!activeCondoId) return null;
  
  const alerts = getPriceAlertsByCondoId(activeCondoId);
  
  const handleToggleActive = (alert: PriceAlert) => {
    updatePriceAlert(alert.id, { isActive: !alert.isActive });
  };
  
  const handleDeleteAlert = (id: string) => {
    deletePriceAlert(id);
  };
  
  const handleCreateAlert = () => {
    if (!activeCondoId) return;
    
    addPriceAlert({
      condoId: activeCondoId,
      userId: 'user1', // Current user ID
      serviceCategory: newAlert.serviceCategory,
      threshold: newAlert.threshold,
      isAboveThreshold: newAlert.isAboveThreshold,
      isActive: newAlert.isActive
    });
    
    setIsDialogOpen(false);
    // Reset form
    setNewAlert({
      serviceCategory: "plumbing",
      threshold: 100,
      isAboveThreshold: true,
      isActive: true
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
              <DialogDescription>
                Get notified when service prices cross your threshold.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Service Category</Label>
                <Select 
                  value={newAlert.serviceCategory} 
                  onValueChange={(value) => setNewAlert({...newAlert, serviceCategory: value as ServiceCategory})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {serviceCategoryLabels[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="threshold">Price Threshold ($)</Label>
                <Input 
                  id="threshold" 
                  type="number"
                  min="0"
                  value={newAlert.threshold} 
                  onChange={(e) => setNewAlert({...newAlert, threshold: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Alert Condition</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="above"
                      checked={newAlert.isAboveThreshold}
                      onChange={() => setNewAlert({...newAlert, isAboveThreshold: true})}
                    />
                    <Label htmlFor="above" className="cursor-pointer">Above threshold</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="below"
                      checked={!newAlert.isAboveThreshold}
                      onChange={() => setNewAlert({...newAlert, isAboveThreshold: false})}
                    />
                    <Label htmlFor="below" className="cursor-pointer">Below threshold</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active"
                  checked={newAlert.isActive}
                  onCheckedChange={(checked) => setNewAlert({...newAlert, isActive: checked})}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAlert}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {alerts.length > 0 ? (
          alerts.map(alert => {
            const latestPrice = getLatestPrice(alert.serviceCategory);
            const isTriggered = latestPrice !== null && (
              (alert.isAboveThreshold && latestPrice > alert.threshold) ||
              (!alert.isAboveThreshold && latestPrice < alert.threshold)
            );
            
            return (
              <Card key={alert.id} className={isTriggered && alert.isActive ? "border-amber-500" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {serviceCategoryLabels[alert.serviceCategory]}
                    </CardTitle>
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => handleToggleActive(alert)}
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
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Alert
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
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
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
