
import { ServiceCategory, ServiceProvider, ServiceRecord } from "@/types";
import { toast } from "sonner";

export function getServiceProviderById(providers: ServiceProvider[], id: string) {
  return providers.find(provider => provider.id === id);
}

export function getServiceProvidersByCondoId(providers: ServiceProvider[], condoId: string) {
  return providers.filter(provider => provider.condoId === condoId);
}

export function getServiceProvidersByCategory(providers: ServiceProvider[], category: ServiceCategory) {
  return providers.filter(provider => provider.category === category);
}

export function getServiceRecordById(records: ServiceRecord[], id: string) {
  return records.find(record => record.id === id);
}

export function getServiceRecordsByCondoId(records: ServiceRecord[], condoId: string) {
  return records.filter(record => record.condoId === condoId);
}

export function getProviderPriceHistory(records: ServiceRecord[], providerId: string, category: string) {
  return records.filter(record => 
    record.serviceProvider.id === providerId && 
    record.serviceProvider.category === category
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getCategoryPriceHistory(records: ServiceRecord[], category: string) {
  return records.filter(record => 
    record.serviceProvider.category === category
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getServiceFrequencyByMonth(records: ServiceRecord[], category: string) {
  const categoryRecords = records.filter(record => 
    record.serviceProvider.category === category
  );
  
  // Group records by month
  const recordsByMonth: Record<string, number> = {};
  
  categoryRecords.forEach(record => {
    const date = new Date(record.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!recordsByMonth[monthYear]) {
      recordsByMonth[monthYear] = 0;
    }
    
    recordsByMonth[monthYear]++;
  });
  
  // Convert to array format sorted by date
  return Object.entries(recordsByMonth)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      // Extract month and year for comparison
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      
      // Compare years first
      const yearDiff = parseInt(yearA) - parseInt(yearB);
      if (yearDiff !== 0) return yearDiff;
      
      // Compare months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(monthA) - months.indexOf(monthB);
    });
}

export function addServiceRecord(
  records: ServiceRecord[], 
  setRecords: React.Dispatch<React.SetStateAction<ServiceRecord[]>>,
  provider: ServiceProvider,
  user: any,
  record: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt" | "createdByUser" | "serviceProvider" | "requestedByUser">
) {
  const newRecord: ServiceRecord = {
    ...record,
    id: `record${records.length + 1}`,
    serviceProvider: provider,
    createdByUser: user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  setRecords([newRecord, ...records]);
  toast.success("Service record added successfully");
}

export function updateServiceRecord(
  records: ServiceRecord[], 
  setRecords: React.Dispatch<React.SetStateAction<ServiceRecord[]>>,
  getProvider: (id: string) => ServiceProvider | undefined,
  id: string, 
  recordUpdate: Partial<ServiceRecord>
) {
  setRecords(prevRecords => 
    prevRecords.map(record => {
      if (record.id === id) {
        // If the service provider ID changed, update the provider reference
        let updatedRecord = { ...record, ...recordUpdate };
        
        if (recordUpdate.serviceProviderId && recordUpdate.serviceProviderId !== record.serviceProviderId) {
          const newProvider = getProvider(recordUpdate.serviceProviderId);
          if (newProvider) {
            updatedRecord.serviceProvider = newProvider;
          }
        }
        
        // Always update the updatedAt timestamp
        updatedRecord.updatedAt = new Date().toISOString();
        
        return updatedRecord;
      }
      return record;
    })
  );
  toast.success("Service record updated successfully");
}

export function deleteServiceRecord(
  records: ServiceRecord[], 
  setRecords: React.Dispatch<React.SetStateAction<ServiceRecord[]>>,
  id: string
) {
  setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
  toast.success("Service record deleted successfully");
}

export function addServiceProvider(
  providers: ServiceProvider[], 
  setProviders: React.Dispatch<React.SetStateAction<ServiceProvider[]>>,
  user: any,
  provider: Omit<ServiceProvider, "id" | "createdAt" | "updatedAt" | "createdByUser">
) {
  const newProvider: ServiceProvider = {
    ...provider,
    id: `provider${providers.length + 1}`,
    createdBy: user.id,
    createdByUser: user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  setProviders([...providers, newProvider]);
  toast.success("Service provider added successfully");
}

export function updateServiceProvider(
  providers: ServiceProvider[], 
  setProviders: React.Dispatch<React.SetStateAction<ServiceProvider[]>>,
  user: any,
  id: string, 
  providerUpdate: Partial<ServiceProvider>
) {
  setProviders(prevProviders => 
    prevProviders.map(provider => 
      provider.id === id ? { 
        ...provider, 
        ...providerUpdate,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id,
        updatedByUser: user
      } : provider
    )
  );
  toast.success("Service provider updated successfully");
}

export function deleteServiceProvider(
  providers: ServiceProvider[], 
  setProviders: React.Dispatch<React.SetStateAction<ServiceProvider[]>>,
  records: ServiceRecord[],
  id: string
) {
  // First check if there are any records using this provider
  const hasRecords = records.some(record => record.serviceProviderId === id);
  
  if (hasRecords) {
    toast.error("Cannot delete provider with existing service records");
    return;
  }
  
  setProviders(prevProviders => prevProviders.filter(provider => provider.id !== id));
  toast.success("Service provider deleted successfully");
}
