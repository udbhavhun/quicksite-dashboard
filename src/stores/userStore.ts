
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type UserType = 'customer' | 'admin';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  phone?: string;
  role: UserType;
}

interface UserState {
  userType: UserType;
  userName: string;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userType: 'customer',
      userName: '',
      isAuthenticated: false,
      profile: null,
      
      login: async (email: string, password: string) => {
        try {
          console.log("Attempting login with:", email);
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            console.error("Login error:", error.message);
            toast({
              title: "Login Error",
              description: error.message,
              variant: "destructive"
            });
            return false;
          }
          
          console.log("Auth successful, data:", data);
          
          if (data && data.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            console.log("Profile data:", profileData, "Error:", profileError);
            
            if (profileError) {
              console.error("Profile fetch error:", profileError);
              toast({
                title: "Profile Error",
                description: "Could not fetch your profile. Please try again.",
                variant: "destructive"
              });
              return false;
            }
            
            if (profileData) {
              console.log("Setting profile:", profileData);
              
              // Ensure we have the correct profile interface with optional fields
              // if they don't exist in the database
              set({
                isAuthenticated: true,
                userType: profileData.role as UserType,
                userName: profileData.name || '',
                profile: {
                  id: data.user.id,
                  name: profileData.name || '',
                  email: data.user.email || '',
                  role: profileData.role as UserType,
                  avatar: profileData.avatar_url,
                  company: profileData.company || undefined,
                  phone: profileData.phone || undefined
                }
              });
              
              toast({
                title: "Welcome back",
                description: `Logged in as ${profileData.name || email}`,
              });
              
              return true;
            } else {
              // No profile found - this might happen if the user signs up but their profile isn't created
              console.error("No profile found for user");
              toast({
                title: "Profile Missing",
                description: "Your user profile could not be found.",
                variant: "destructive"
              });
            }
          }
          
          return false;
        } catch (error) {
          console.error("Login error:", error);
          toast({
            title: "Login Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive"
          });
          return false;
        }
      },
      
      logout: async () => {
        try {
          console.log("Attempting logout");
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            toast({
              title: "Logout Error",
              description: error.message,
              variant: "destructive"
            });
            return;
          }
          
          set({
            isAuthenticated: false,
            profile: null,
            userType: 'customer',
            userName: ''
          });
          
          toast({
            title: "Logged Out",
            description: "You have been successfully logged out."
          });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      
      updateProfile: async (profileUpdates) => {
        const currentProfile = get().profile;
        
        if (!currentProfile) return;
        
        // Update local state
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...profileUpdates } : null,
          userName: profileUpdates.name ? profileUpdates.name : state.userName,
          userType: profileUpdates.role ? profileUpdates.role : state.userType
        }));
        
        // Prepare Supabase update object with proper field names
        const supabaseUpdate: any = {
          name: profileUpdates.name || currentProfile.name,
          avatar_url: profileUpdates.avatar,
          updated_at: new Date().toISOString()
        };
        
        // Only add these fields if they are provided in the update
        if (profileUpdates.company !== undefined) {
          supabaseUpdate.company = profileUpdates.company;
        }
        
        if (profileUpdates.phone !== undefined) {
          supabaseUpdate.phone = profileUpdates.phone;
        }
        
        // Update profile in Supabase
        try {
          const { error } = await supabase
            .from('profiles')
            .update(supabaseUpdate)
            .eq('id', currentProfile.id);
            
          if (error) {
            console.error("Profile update error:", error);
            toast({
              title: "Update Failed",
              description: "Failed to update profile in database.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Profile update error:", error);
        }
      }
    }),
    {
      name: 'user-storage'
    }
  )
);
