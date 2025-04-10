import { Condo, PriceAlert, ProviderComparison, ServiceRecord, ServiceProvider, ServiceCategory, User } from "@/types";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { condos, currentUser, serviceProviders, serviceRecords, userCondos, priceAlerts, serviceCategoryLabels, serviceCategories } from "@/mocks/data";
import { toast } from "sonner";

type AppContextType = {
  user: User | null;
  userCondos: Condo[];
  activeCondoId: string | null;
  setActiveCondoId: (id: string) => void;
  serviceRecords: ServiceRecord[];
  serviceProviders: ServiceProvider[];
  priceAlerts: PriceAlert[];
  providerComparison: ProviderComparison | null;
  serviceCategories: ServiceCategory[];
  addServiceRecord: (record: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt" | "createdByUser" | "serviceProvider" | "requestedByUser">) => void;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void;
  deleteServiceRecord: (id: string) => void;
  addServiceProvider: (provider: Omit<ServiceProvider, "id" | "createdAt" | "updatedAt" | "createdByUser">) => void;
  updateServiceProvider: (id: string, provider: Partial<ServiceProvider>) => void;
  deleteServiceProvider: (id: string) => void;
  getServiceProviderById: (id: string) => ServiceProvider | undefined;
  getServiceRecordById: (id: string) => ServiceRecord | undefined;
  getServiceProvidersByCondoId: (condoId: string) => ServiceProvider[];
  getServiceRecordsByCondoId: (condoId: string) => ServiceRecord[];
  getProviderPriceHistory: (providerId: string, category: string) => ServiceRecord[];
  getServiceProvidersByCategory: (category: ServiceCategory) => ServiceProvider[];
  addPriceAlert: (alert: Omit<PriceAlert, "id" | "createdAt" | "updatedAt" | "lastTriggered">) => void;
  updatePriceAlert: (id: string, alert: Partial<PriceAlert>) => void;
  deletePriceAlert: (id: string) => void;
  getPriceAlertsByCondoId: (condoId: string) => PriceAlert[];
  checkPriceAlerts: () => void;
  startProviderComparison: (category: ServiceCategory) => void;
  addProviderToComparison: (providerId: string) => void;
  removeProviderFromComparison: (providerId: string) => void;
  clearProviderComparison: () => void;
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
  const [serviceProvidersList, setServiceProvidersList] = useState<ServiceProvider[]>(
    // Add missing properties to the mock data
    serviceProviders.map(provider => ({
      ...provider,
      createdBy: provider.createdBy || user.id,
      createdByUser: provider.createdByUser || user,
      createdAt: provider.createdAt || new Date().toISOString(),
      updatedAt: provider.updatedAt || new Date().toISOString()
    }))
  );

  // Price alerts
  const [priceAlertsList, setPriceAlertsList] = useState<PriceAlert[]>(priceAlerts);

  // Provider comparison
  const [providerComparisonState, setProviderComparisonState] = useState<ProviderComparison | null>(null);
  
  // Service provider operations
  const addServiceProvider = (provider: Omit<ServiceProvider, "id" | "createdAt" | "updatedAt" | "createdByUser">) => {
    const newProvider: ServiceProvider = {
      ...provider,
      id: `provider${serviceProvidersList.length + 1}`,
      createdBy: user.id,
      createdByUser: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setServiceProvidersList([...serviceProvidersList, newProvider]);
    toast.success("Service provider added successfully");
  };
  
  const updateServiceProvider = (id: string, providerUpdate: Partial<ServiceProvider>) => {
    setServiceProvidersList(prevProviders => 
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

  const getServiceProvidersByCategory = (category: ServiceCategory) => {
    return serviceProvidersList.filter(provider => provider.category === category);
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

  // Get price history for a specific provider and category
  const getProviderPriceHistory = (providerId: string, category: string) => {
    return serviceRecordsList.filter(record => 
      record.serviceProvider.id === providerId && 
      record.serviceProvider.category === category
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Price alert operations
  const addPriceAlert = (alert: Omit<PriceAlert, "id" | "createdAt" | "updatedAt" | "lastTriggered">) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert${priceAlertsList.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setPriceAlertsList([...priceAlertsList, newAlert]);
    toast.success(`Price alert for ${serviceCategoryLabels[alert.serviceCategory]} has been created`);
  };
  
  const updatePriceAlert = (id: string, alertUpdate: Partial<PriceAlert>) => {
    setPriceAlertsList(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { 
          ...alert, 
          ...alertUpdate,
          updatedAt: new Date().toISOString()
        } : alert
      )
    );
    toast.success("Price alert updated");
  };
  
  const deletePriceAlert = (id: string) => {
    setPriceAlertsList(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    toast.success("Price alert deleted");
  };
  
  const getPriceAlertsByCondoId = (condoId: string) => {
    return priceAlertsList.filter(alert => alert.condoId === condoId && alert.userId === user.id);
  };
  
  // Check if any price alerts should be triggered
  const checkPriceAlerts = () => {
    if (!activeCondoId) return;
    
    const condoRecords = getServiceRecordsByCondoId(activeCondoId);
    const activeAlerts = priceAlertsList.filter(alert => 
      alert.condoId === activeCondoId && 
      alert.userId === user.id &&
      alert.isActive
    );
    
    activeAlerts.forEach(alert => {
      // Get the latest records for this category
      const categoryRecords = condoRecords.filter(record => 
        record.serviceProvider.category === alert.serviceCategory
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (categoryRecords.length > 0) {
        const latestRecord = categoryRecords[0];
        const isAboveThreshold = latestRecord.price > alert.threshold;
        
        // If the threshold state has changed, update the alert
        if (isAboveThreshold !== alert.isAboveThreshold) {
          updatePriceAlert(alert.id, { 
            isAboveThreshold, 
            lastTriggered: new Date().toISOString() 
          });
          
          // Show a toast notification for the alert
          const message = isAboveThreshold 
            ? `${serviceCategoryLabels[alert.serviceCategory]} price is now above your threshold of $${alert.threshold}`
            : `${serviceCategoryLabels[alert.serviceCategory]} price is now below your threshold of $${alert.threshold}`;
          
          toast.warning(message, {
            description: `Latest price: $${latestRecord.price} from ${latestRecord.serviceProvider.name}`,
            duration: 5000
          });
        }
      }
    });
  };
  
  // Provider comparison operations
  const startProviderComparison = (category: ServiceCategory) => {
    setProviderComparisonState({
      category,
      providers: []
    });
    toast.info(`Started comparing ${serviceCategoryLabels[category]} providers`);
  };
  
  const addProviderToComparison = (providerId: string) => {
    if (!providerComparisonState) return;
    
    const provider = getServiceProviderById(providerId);
    if (!provider) return;
    
    // Only add if not already in the comparison and matches the category
    if (
      provider.category === providerComparisonState.category &&
      !providerComparisonState.providers.some(p => p.id === providerId)
    ) {
      setProviderComparisonState({
        ...providerComparisonState,
        providers: [...providerComparisonState.providers, provider]
      });
      toast.success(`Added ${provider.name} to comparison`);
    }
  };
  
  const removeProviderFromComparison = (providerId: string) => {
    if (!providerComparisonState) return;
    
    setProviderComparisonState({
      ...providerComparisonState,
      providers: providerComparisonState.providers.filter(p => p.id !== providerId)
    });
  };
  
  const clearProviderComparison = () => {
    setProviderComparisonState(null);
  };
  
  // Run price alert check when records change
  useEffect(() => {
    checkPriceAlerts();
  }, [serviceRecordsList, activeCondoId]);
  
  return (
    <AppContext.Provider
      value={{
        user,
        userCondos: userCondosList,
        activeCondoId,
        setActiveCondoId,
        serviceRecords: serviceRecordsList,
        serviceProviders: serviceProvidersList,
        priceAlerts: priceAlertsList,
        providerComparison: providerComparisonState,
        serviceCategories,
        addServiceRecord,
        updateServiceRecord,
        deleteServiceRecord,
        addServiceProvider,
        updateServiceProvider,
        deleteServiceProvider,
        getServiceProviderById,
        getServiceRecordById,
        getServiceProvidersByCondoId,
        getServiceRecordsByCondoId,
        getProviderPriceHistory,
        getServiceProvidersByCategory,
        addPriceAlert,
        updatePriceAlert,
        deletePriceAlert,
        getPriceAlertsByCondoId,
        checkPriceAlerts,
        startProviderComparison,
        addProviderToComparison,
        removeProviderFromComparison,
        clearProviderComparison
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
