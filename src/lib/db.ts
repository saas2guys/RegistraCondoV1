import { User, Condo, ServiceProvider, ServiceRecord, PriceAlert } from "@/types";
import { db, initializeDatabase } from "./database/connection";
import { userRepository } from "./database/user-repository";
import { condoRepository } from "./database/condo-repository";
import { serviceRepository } from "./database/service-repository";

// Re-export database initialization
export { initializeDatabase };

// The frontend code should use API calls instead of direct database access
export const createApiClient = () => {
  // Create a client-side API wrapper that makes calls to your backend API
  return {
    // User methods
    getUsers: async (): Promise<User[]> => {
      // In a real implementation, this would make a fetch request to your API
      // For example: return fetch('/api/users').then(res => res.json());
      console.log("Making API call to fetch users");
      return [];
    },
    
    getUserById: async (id: string): Promise<User | null> => {
      console.log(`Making API call to fetch user with ID: ${id}`);
      return null;
    },
    
    createUser: async (user: Omit<User, "id">): Promise<User> => {
      console.log("Making API call to create user:", user.email);
      return {
        id: `user-${Date.now()}`,
        ...user
      };
    },
    
    // Condo methods
    getCondos: async (): Promise<Condo[]> => {
      console.log("Making API call to fetch condos");
      return [];
    },
    
    getCondoById: async (id: string): Promise<Condo | null> => {
      console.log(`Making API call to fetch condo with ID: ${id}`);
      return null;
    },
    
    createCondo: async (condo: Omit<Condo, "id">): Promise<Condo> => {
      console.log("Making API call to create condo:", condo.name);
      return {
        id: `condo-${Date.now()}`,
        ...condo
      };
    },
    
    // Relationship methods
    addUserToCondo: async (userId: string, condoId: string, role: 'admin' | 'member'): Promise<boolean> => {
      console.log(`Making API call to add user ${userId} to condo ${condoId} with role ${role}`);
      return true;
    }
    
    // Add more API methods as needed
  };
};

// Export the API client for frontend use
export const api = createApiClient();
