
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Condo } from "@/types";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type AuthContextType = {
  user: User | null;
  userCondos: Condo[];
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithCondoHash: (condoHash: string) => Promise<User | null>;
  logout: () => Promise<void>;
  createCondo: (condo: Omit<Condo, "id">) => Promise<Condo | null>;
  inviteUserToCondo: (email: string, condoId: string, role: 'admin' | 'member') => Promise<boolean>;
  refreshUserCondos: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userCondos, setUserCondos] = useState<Condo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize authentication from localStorage on app start
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize database connection
        await db.connect();
        
        // Restore user session if available
        const restoredUser = auth.initFromStorage();
        if (restoredUser) {
          setUser(restoredUser);
          
          // Fetch user's condos
          // In a real implementation, this would query the database
          const mockCondos: Condo[] = [
            {
              id: "condo1",
              name: "Ocean View Condos",
              address: "123 Beach Drive",
              city: "Oceanside",
              state: "CA",
              zipCode: "92054",
              image: "/placeholder.svg"
            }
          ];
          setUserCondos(mockCondos);
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
    
    // Cleanup on unmount
    return () => {
      db.disconnect();
    };
  }, []);
  
  // Register a new user
  const registerUser = async (username: string, email: string, password: string) => {
    const newUser = await auth.register(username, email, password);
    if (newUser) {
      setUser(newUser);
    }
    return newUser;
  };
  
  // Log in a user
  const loginUser = async (email: string, password: string) => {
    const loggedInUser = await auth.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      
      // Fetch user's condos
      await refreshUserCondos();
    }
    return loggedInUser;
  };
  
  // Log in with a condo hash
  const loginWithHash = async (condoHash: string) => {
    const loggedInUser = await auth.loginWithCondoHash(condoHash);
    if (loggedInUser) {
      setUser(loggedInUser);
      
      // In a real implementation, you would fetch the condo associated with the hash
      const mockCondo: Condo = {
        id: condoHash, // Simplified for demo
        name: "Shared Condo Access",
        address: "456 Share Lane",
        city: "Shareville",
        state: "NY",
        zipCode: "10001",
        image: "/placeholder.svg"
      };
      
      setUserCondos([mockCondo]);
    }
    return loggedInUser;
  };
  
  // Log out the current user
  const logoutUser = async () => {
    await auth.logout();
    setUser(null);
    setUserCondos([]);
  };
  
  // Create a new condo
  const createNewCondo = async (condo: Omit<Condo, "id">) => {
    if (!user) return null;
    
    try {
      const newCondo = await db.createCondo(condo);
      
      // Associate the user with the condo as an admin
      await db.addUserToCondo(user.id, newCondo.id, 'admin');
      
      // Update the local state
      setUserCondos(prev => [...prev, newCondo]);
      
      return newCondo;
    } catch (error) {
      console.error("Failed to create condo:", error);
      return null;
    }
  };
  
  // Invite a user to a condo
  const inviteUser = async (email: string, condoId: string, role: 'admin' | 'member') => {
    try {
      // In a real implementation, you would send an invitation email
      // and create a pending invitation in the database
      console.log(`Inviting ${email} to condo ${condoId} with role ${role}`);
      
      // Simulate successful invitation
      return true;
    } catch (error) {
      console.error("Failed to invite user:", error);
      return false;
    }
  };
  
  // Refresh the user's condos
  const refreshUserCondos = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, this would query the database
      // For now, use mock data
      const mockCondos: Condo[] = [
        {
          id: "condo1",
          name: "Ocean View Condos",
          address: "123 Beach Drive",
          city: "Oceanside",
          state: "CA",
          zipCode: "92054",
          image: "/placeholder.svg"
        }
      ];
      
      setUserCondos(mockCondos);
    } catch (error) {
      console.error("Failed to refresh user condos:", error);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        userCondos,
        loading,
        register: registerUser,
        login: loginUser,
        loginWithCondoHash: loginWithHash,
        logout: logoutUser,
        createCondo: createNewCondo,
        inviteUserToCondo: inviteUser,
        refreshUserCondos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
