


export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Condo {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image?: string;
}

export interface UserCondo {
  userId: string;
  condoId: string;
  role: 'admin' | 'member';
}

export type ServiceCategory = 
  | 'mechanic' 
  | 'cleaning' 
  | 'plumbing' 
  | 'electrical' 
  | 'painting' 
  | 'gardening' 
  | 'security' 
  | 'maintenance' 
  | 'construction' 
  | 'other';

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
  condoId: string;
  createdBy: string;
  createdByUser: User;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  updatedByUser?: User;
}

export interface ServiceRecord {
  id: string;
  serviceProviderId: string;
  serviceProvider: ServiceProvider;
  condoId: string;
  createdBy: string;
  createdByUser: User;
  description: string;
  price: number;
  date: string;
  documentation?: string;
  documentationUrl?: string;
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistoryEntry {
  id: string;
  providerId: string;
  category: ServiceCategory;
  price: number;
  date: string;
  recordId: string;
}

