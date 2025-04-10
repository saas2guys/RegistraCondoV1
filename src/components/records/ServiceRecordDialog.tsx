
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/contexts/AppContext";
import { ServiceRecord } from "@/types";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ServiceRecord;
}

export function ServiceRecordDialog({
  open,
  onOpenChange,
  initialData,
}: ServiceRecordDialogProps) {
  const { activeCondoId, addServiceRecord, updateServiceRecord, getServiceProvidersByCondoId } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<ServiceRecord>>({
    serviceProviderId: "",
    description: "",
    price: 0,
    date: new Date().toISOString().split("T")[0],
    documentation: "",
    documentationUrl: "",
    notes: "",
  });
  
  // Get available service providers for the current condo
  const serviceProviders = activeCondoId 
    ? getServiceProvidersByCondoId(activeCondoId)
    : [];
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        serviceProviderId: initialData.serviceProviderId,
        description: initialData.description,
        price: initialData.price,
        date: initialData.date,
        documentation: initialData.documentation || "",
        documentationUrl: initialData.documentationUrl || "",
        notes: initialData.notes || "",
      });
    } else {
      // Reset form for new record
      setFormData({
        serviceProviderId: serviceProviders.length > 0 ? serviceProviders[0].id : "",
        description: "",
        price: 0,
        date: new Date().toISOString().split("T")[0],
        documentation: "",
        documentationUrl: "",
        notes: "",
      });
    }
  }, [initialData, serviceProviders]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeCondoId || !formData.serviceProviderId) {
      return;
    }
    
    if (initialData) {
      // Update existing record
      updateServiceRecord(initialData.id, formData);
    } else {
      // Add new record
      addServiceRecord({
        ...formData as Omit<ServiceRecord, "id" | "createdAt" | "updatedAt" | "createdByUser" | "serviceProvider">,
        condoId: activeCondoId,
        createdBy: "user1", // Current user ID
      });
    }
    
    onOpenChange(false);
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Service Record" : "Add Service Record"}</DialogTitle>
            <DialogDescription>
              {initialData
                ? "Update the details for this service record."
                : "Add a new service record to help your neighbors."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceProviderId">Service Provider</Label>
              <Select
                name="serviceProviderId"
                value={formData.serviceProviderId}
                onValueChange={(value) => handleSelectChange("serviceProviderId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {serviceProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What service was provided?"
                className="resize-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date of Service</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="documentation">Documentation Details</Label>
              <Input
                id="documentation"
                name="documentation"
                value={formData.documentation}
                onChange={handleChange}
                placeholder="Invoice #, receipt #, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="documentationUrl">Documentation URL</Label>
              <Input
                id="documentationUrl"
                name="documentationUrl"
                type="url"
                value={formData.documentationUrl}
                onChange={handleChange}
                placeholder="Link to the invoice, receipt, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information about the service"
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Record" : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
