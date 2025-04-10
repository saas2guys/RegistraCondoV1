
import React, { useState, ReactNode, useEffect } from "react";
import { AppContext } from "./AppContext";
import { Condo, PriceAlert, ProviderComparison, ServiceRecord, ServiceProvider } from "@/types";
import { condos, currentUser, serviceProviders, serviceRecords, userCondos, priceAlerts, serviceCategories } from "@/mocks/data";
import * as ServiceUtils from "./serviceUtils";
import * as AlertUtils from "./alertUtils";
import * as ComparisonUtils from "./comparisonUtils";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user] = useState(currentUser);
  
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
    ServiceUtils.addServiceProvider(serviceProvidersList, setServiceProvidersList, user, provider);
  };
  
  const updateServiceProvider = (id: string, providerUpdate: Partial<ServiceProvider>) => {
    ServiceUtils.updateServiceProvider(serviceProvidersList, setServiceProvidersList, user, id, providerUpdate);
  };
  
  const deleteServiceProvider = (id: string) => {
    ServiceUtils.deleteServiceProvider(serviceProvidersList, setServiceProvidersList, serviceRecordsList, id);
  };
  
  const getServiceProviderById = (id: string) => {
    return ServiceUtils.getServiceProviderById(serviceProvidersList, id);
  };
  
  const getServiceProvidersByCondoId = (condoId: string) => {
    return ServiceUtils.getServiceProvidersByCondoId(serviceProvidersList, condoId);
  };

  const getServiceProvidersByCategory = (category: any) => {
    return ServiceUtils.getServiceProvidersByCategory(serviceProvidersList, category);
  };
  
  // Service record operations
  const addServiceRecord = (record: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt" | "createdByUser" | "serviceProvider" | "requestedByUser">) => {
    const provider = getServiceProviderById(record.serviceProviderId);
    
    if (!provider) {
      return;
    }
    
    ServiceUtils.addServiceRecord(serviceRecordsList, setServiceRecordsList, provider, user, record);
  };
  
  const updateServiceRecord = (id: string, recordUpdate: Partial<ServiceRecord>) => {
    ServiceUtils.updateServiceRecord(serviceRecordsList, setServiceRecordsList, getServiceProviderById, id, recordUpdate);
  };
  
  const deleteServiceRecord = (id: string) => {
    ServiceUtils.deleteServiceRecord(serviceRecordsList, setServiceRecordsList, id);
  };
  
  const getServiceRecordById = (id: string) => {
    return ServiceUtils.getServiceRecordById(serviceRecordsList, id);
  };
  
  const getServiceRecordsByCondoId = (condoId: string) => {
    return ServiceUtils.getServiceRecordsByCondoId(serviceRecordsList, condoId);
  };

  // Get price history functions
  const getProviderPriceHistory = (providerId: string, category: string) => {
    return ServiceUtils.getProviderPriceHistory(serviceRecordsList, providerId, category);
  };

  // Get price history for all providers in a category
  const getCategoryPriceHistory = (category: string) => {
    return ServiceUtils.getCategoryPriceHistory(serviceRecordsList, category);
  };

  // Get service request frequency by month for a category
  const getServiceFrequencyByMonth = (category: string) => {
    return ServiceUtils.getServiceFrequencyByMonth(serviceRecordsList, category);
  };

  // Price alert operations
  const addPriceAlert = (alert: Omit<PriceAlert, "id" | "createdAt" | "updatedAt" | "lastTriggered">) => {
    AlertUtils.addPriceAlert(priceAlertsList, setPriceAlertsList, alert);
  };
  
  const updatePriceAlert = (id: string, alertUpdate: Partial<PriceAlert>) => {
    AlertUtils.updatePriceAlert(priceAlertsList, setPriceAlertsList, id, alertUpdate);
  };
  
  const deletePriceAlert = (id: string) => {
    AlertUtils.deletePriceAlert(priceAlertsList, setPriceAlertsList, id);
  };
  
  const getPriceAlertsByCondoId = (condoId: string) => {
    return AlertUtils.getPriceAlertsByCondoId(priceAlertsList, condoId, user.id);
  };
  
  // Check if any price alerts should be triggered
  const checkPriceAlerts = () => {
    AlertUtils.checkPriceAlerts(priceAlertsList, updatePriceAlert, getServiceRecordsByCondoId, activeCondoId, user.id);
  };
  
  // Provider comparison operations
  const startProviderComparison = (category: any) => {
    ComparisonUtils.startProviderComparison(setProviderComparisonState, category);
  };
  
  const addProviderToComparison = (providerId: string) => {
    ComparisonUtils.addProviderToComparison(
      providerComparisonState, 
      setProviderComparisonState, 
      getServiceProviderById, 
      providerId
    );
  };
  
  const removeProviderFromComparison = (providerId: string) => {
    ComparisonUtils.removeProviderFromComparison(
      providerComparisonState, 
      setProviderComparisonState, 
      providerId
    );
  };
  
  const clearProviderComparison = () => {
    ComparisonUtils.clearProviderComparison(setProviderComparisonState);
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
        getCategoryPriceHistory,
        getServiceFrequencyByMonth,
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
