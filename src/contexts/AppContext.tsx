
import { Condo, ServiceRecord, ServiceProvider, User } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { condos, currentUser, serviceProviders, serviceRecords, userCondos } from "@/mocks/data";
import { toast } from "sonner";

type AppContextType = {
  user: User | null;
  userCondos: Condo[];
  activeCondoId: string | null;
  setActiveCondoId: (id: string) => void;
  serviceRecords: ServiceRecord[];
  serviceProviders: ServiceProvider[];
  addServiceRecord: (record: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt" | "createdByUser" | "serviceProvider">) => void;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void;
  deleteServiceRecord: (id: string) => void;
  addServiceProvider: (provider: Omit<ServiceProvider, "id">) => void;
  updateServiceProvider: (id: string, provider: Partial<ServiceProvider>) => void;
  deleteServiceProvider: (id: string) => void;
  getServiceProviderById: (id: string) => ServiceProvider | undefined;
  getServiceRecordById: (id: string) => ServiceRecord | undefined;
  getServiceProvidersByCondoId: (condoId: string) => ServiceProvider[];
  getServiceRecordsByCondoId: (condoId: string) => ServiceRecord[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User>(currentUser);
  
  // Get the user's condos
  const userCondoIds = userCondos
    .filter(uc => uc.userId === user.id)
    .map(uc => uc.condoId);
  
  const [userCondosList] = useState<Condo[]>(
    condos.filter(condo => userCondoIds.includes(condo.id))
  );
  
  // Set the first condo as active by default
  const [activeCondoId, setActiveCondoId] = useState<string | null>(
    userCondosList.length > 0 ? userCondosList[0].id : null
  );
  
  // Service records and providers
  const [serviceRecordsList, setServiceRecordsList] = useState<ServiceRecord[]>(serviceRecords);
  const [serviceProvidersList, setServiceProvidersList] = useState<ServiceProvider[]>(serviceProviders);
  
  // Service provider operations
  const addServiceProvider = (provider: Omit<ServiceProvider, "id">) => {
    const newProvider: ServiceProvider = {
      ...provider,
      id: `provider${serviceProvidersList.length + 1}`,
    };
    
    setServiceProvidersList([...serviceProvidersList, newProvider]);
    toast.success("Service provider added successfully");
  };
  
  const updateServiceProvider = (id: string, providerUpdate: Partial<ServiceProvider>) => {
    setServiceProvidersList(prevProviders => 
      prevProviders.map(provider => 
        provider.id === id ? { ...provider, ...providerUpdate } : provider
      )
    );
    toast.success("Service provider updated successfully");
  };
  
  const deleteServiceProvider = (id: string) => {
    // First check if there are any records using this provider
    const hasRecords = serviceRecordsList.some(record => record.serviceProviderId === id);
    
    if (hasRecords) {
      toast.error("Cannot delete provider with existing service records");
      return;
    }
    
    setServiceProvidersList(prevProviders => 
      prevProviders.filter(provider => provider.id !== id)
    );
    toast.success("Service provider deleted successfully");
  };
  
  const getServiceProviderById = (id: string) => {
    return serviceProvidersList.find(provider => provider.id === id);
  };
  
  const getServiceProvidersByCondoId = (condoId: string) => {
    return serviceProvidersList.filter(provider => provider.condoId === condoId);
  };
  
  // Service record operations
  const addServiceRecord = (record: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt" | "createdByUser" | "serviceProvider">) => {
    const provider = getServiceProviderById(record.serviceProviderId);
    
    if (!provider) {
      toast.error("Service provider not found");
      return;
    }
    
    const newRecord: ServiceRecord = {
      ...record,
      id: `record${serviceRecordsList.length + 1}`,
      serviceProvider: provider,
      createdByUser: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setServiceRecordsList([newRecord, ...serviceRecordsList]);
    toast.success("Service record added successfully");
  };
  
  const updateServiceRecord = (id: string, recordUpdate: Partial<ServiceRecord>) => {
    setServiceRecordsList(prevRecords => 
      prevRecords.map(record => {
        if (record.id === id) {
          // If the service provider ID changed, update the provider reference
          let updatedRecord = { ...record, ...recordUpdate };
          
          if (recordUpdate.serviceProviderId && recordUpdate.serviceProviderId !== record.serviceProviderId) {
            const newProvider = getServiceProviderById(recordUpdate.serviceProviderId);
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
  };
  
  const deleteServiceRecord = (id: string) => {
    setServiceRecordsList(prevRecords => 
      prevRecords.filter(record => record.id !== id)
    );
    toast.success("Service record deleted successfully");
  };
  
  const getServiceRecordById = (id: string) => {
    return serviceRecordsList.find(record => record.id === id);
  };
  
  const getServiceRecordsByCondoId = (condoId: string) => {
    return serviceRecordsList.filter(record => record.condoId === condoId);
  };
  
  return (
    <AppContext.Provider
      value={{
        user,
        userCondos: userCondosList,
        activeCondoId,
        setActiveCondoId,
        serviceRecords: serviceRecordsList,
        serviceProviders: serviceProvidersList,
        addServiceRecord,
        updateServiceRecord,
        deleteServiceRecord,
        addServiceProvider,
        updateServiceProvider,
        deleteServiceProvider,
        getServiceProviderById,
        getServiceRecordById,
        getServiceProvidersByCondoId,
        getServiceRecordsByCondoId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
