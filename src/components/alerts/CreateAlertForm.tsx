
import { useState } from "react";
import { ServiceCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus } from "lucide-react";

interface CreateAlertFormProps {
  onCreateAlert: (alertData: {
    serviceCategory: ServiceCategory;
    threshold: number;
    isAboveThreshold: boolean;
    isActive: boolean;
  }) => void;
}

export function CreateAlertForm({ onCreateAlert }: CreateAlertFormProps) {
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
  
  const handleCreateAlert = () => {
    onCreateAlert(newAlert);
    setIsDialogOpen(false);
    // Reset form
    setNewAlert({
      serviceCategory: "plumbing",
      threshold: 100,
      isAboveThreshold: true,
      isActive: true
    });
  };

  return (
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
  );
}
