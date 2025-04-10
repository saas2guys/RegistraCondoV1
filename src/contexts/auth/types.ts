
import { User, Condo } from "@/types";

export type AuthContextType = {
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
