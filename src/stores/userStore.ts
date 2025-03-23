
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  // Added optional properties for the profile
  company?: string;
  phone?: string;
}

interface UserState {
  isAuthenticated: boolean;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed getters
  get userType(): 'admin' | 'customer' | null;
  get userName(): string;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false,
  profile: null,
  isLoading: false,
  error: null,
  
  get userType() {
    return get().profile?.role || null;
  },
  
  get userName() {
    return get().profile?.name || 'User';
  },
  
  login: async (email, password) => {
    console.log("Attempting login with:", email);
    set({ isLoading: true, error: null });
    
    try {
      // Ensure email is lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Login successful, user data:", data);
      
      if (data.user) {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error("Profile fetch error:", profileError.message);
          throw profileError;
        }
        
        console.log("Profile data fetched:", profileData);
        
        // Safe access to properties with optional chaining
        set({
          isAuthenticated: true,
          profile: {
            id: data.user.id,
            email: data.user.email || '',
            name: profileData?.name || '',
            role: (profileData?.role as 'customer' | 'admin') || 'customer',
            avatar: profileData?.avatar_url,
            company: profileData?.company || undefined,
            phone: profileData?.phone || undefined,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Login process error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    
    try {
      // Ensure email is lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();
      
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              email: normalizedEmail,
              name: name,
              role: 'customer'
            }
          ]);
        
        if (profileError) throw profileError;
        
        set({
          isAuthenticated: true,
          profile: {
            id: data.user.id,
            email: normalizedEmail,
            name: name,
            role: 'customer',
          },
          isLoading: false,
        });
        
        // Show success message
        toast({
          title: "Account created",
          description: "Your account has been successfully created.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({
        isAuthenticated: false,
        profile: null,
      });
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      set({ error: errorMessage });
      throw error;
    }
  },
  
  updateProfile: (data) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;
    
    set({
      profile: {
        ...currentProfile,
        ...data
      }
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));
