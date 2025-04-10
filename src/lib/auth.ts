
import { User } from "@/types";
import { db } from "./db";
import { toast } from "sonner";

// Store the current user in memory (in a real app, you'd use a more secure method)
let currentUser: User | null = null;

// Simple authentication utility functions
export const auth = {
  // Check if a user is logged in
  isAuthenticated: (): boolean => {
    return currentUser !== null;
  },
  
  // Get the current user
  getCurrentUser: (): User | null => {
    return currentUser;
  },
  
  // Register a new user
  register: async (username: string, email: string, password: string): Promise<User | null> => {
    try {
      console.log(`Registering new user: ${username}, ${email}`);
      
      // In a real implementation, you would hash the password before storing it
      // and check if the user already exists
      
      // Create the user in the database
      const user = await db.createUser({
        name: username,
        email,
        // Note: In a real app, never store passwords in plaintext
        // This is just for the mock implementation
      });
      
      // Set as current user
      currentUser = user;
      
      // Store in localStorage for session persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast.success("Registration successful!");
      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
      return null;
    }
  },
  
  // Log in a user
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      console.log(`Logging in user: ${email}`);
      
      // In a real implementation, you would verify credentials against the database
      // Here we're mocking a successful login
      
      // For demo purposes, create a mock user
      const user: User = {
        id: 'user1',
        name: email.split('@')[0], // Use part of email as username
        email
      };
      
      // Set as current user
      currentUser = user;
      
      // Store in localStorage for session persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast.success("Login successful!");
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
      return null;
    }
  },
  
  // Log in with a condo hash
  loginWithCondoHash: async (condoHash: string): Promise<User | null> => {
    try {
      console.log(`Logging in with condo hash: ${condoHash}`);
      
      // In a real implementation, you would verify the hash and create a temporary user
      // Here we're mocking a successful login with a condo hash
      
      // Extract the condo ID from the hash (in a real app, you'd decode/verify it)
      const condoId = condoHash;
      
      // Create a temporary user for this condo session
      const user: User = {
        id: `temp-${Date.now()}`,
        name: "Guest User",
        email: `guest-${Date.now()}@example.com`
      };
      
      // Set as current user
      currentUser = user;
      
      // Store in localStorage for session persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('condoHash', condoHash);
      
      // Associate the user with the condo
      await db.addUserToCondo(user.id, condoId, 'member');
      
      toast.success("Condo access granted!");
      return user;
    } catch (error) {
      console.error("Condo hash login failed:", error);
      toast.error("Invalid condo access code.");
      return null;
    }
  },
  
  // Log out the current user
  logout: async (): Promise<void> => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('condoHash');
    toast.success("You have been logged out.");
  },
  
  // Initialize auth from localStorage (for session persistence)
  initFromStorage: (): User | null => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        return currentUser;
      }
    } catch (error) {
      console.error("Failed to restore user session:", error);
    }
    return null;
  }
};
