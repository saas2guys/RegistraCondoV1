
import { Condo, PriceAlert, ProviderComparison, ServiceRecord, ServiceProvider, ServiceCategory, User } from "@/types";

export interface AppContextType {
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
  getCategoryPriceHistory: (category: string) => ServiceRecord[];
  getServiceFrequencyByMonth: (category: string) => Array<{ month: string, count: number }>;
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
}
