
import { useState, useEffect, ReactNode } from "react";
import { User, Condo } from "@/types";
import { auth } from "@/lib/auth";
import { api } from "@/lib/db";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userCondos, setUserCondos] = useState<Condo[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const restoredUser = auth.initFromStorage();
        if (restoredUser) {
          setUser(restoredUser);
          
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
  }, []);
  
  const registerUser = async (username: string, email: string, password: string) => {
    const newUser = await auth.register(username, email, password);
    if (newUser) {
      setUser(newUser);
    }
    return newUser;
  };
  
  const loginUser = async (email: string, password: string) => {
    const loggedInUser = await auth.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      
      await refreshUserCondos();
    }
    return loggedInUser;
  };
  
  const loginWithHash = async (condoHash: string) => {
    const loggedInUser = await auth.loginWithCondoHash(condoHash);
    if (loggedInUser) {
      setUser(loggedInUser);
      
      const mockCondo: Condo = {
        id: condoHash,
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
  
  const logoutUser = async () => {
    await auth.logout();
    setUser(null);
    setUserCondos([]);
  };
  
  const createNewCondo = async (condo: Omit<Condo, "id">) => {
    if (!user) return null;
    
    try {
      const newCondo = await api.createCondo(condo);
      
      await api.addUserToCondo(user.id, newCondo.id, 'admin');
      
      setUserCondos(prev => [...prev, newCondo]);
      
      return newCondo;
    } catch (error) {
      console.error("Failed to create condo:", error);
      return null;
    }
  };
  
  const inviteUser = async (email: string, condoId: string, role: 'admin' | 'member') => {
    try {
      console.log(`Inviting ${email} to condo ${condoId} with role ${role}`);
      return true;
    } catch (error) {
      console.error("Failed to invite user:", error);
      return false;
    }
  };
  
  const refreshUserCondos = async () => {
    if (!user) return;
    
    try {
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
