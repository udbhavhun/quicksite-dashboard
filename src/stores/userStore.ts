
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
  loginAs: (userType: UserType, userName: string) => void;
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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            console.error("Login error:", error.message);
            return false;
          }
          
          if (data && data.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            if (profileError) {
              console.error("Profile fetch error:", profileError);
              return false;
            }
            
            if (profileData) {
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
                }
              });
              
              return true;
            }
          }
          
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      
      loginAs: (userType, userName) => set({
        userType,
        userName,
        isAuthenticated: true,
        profile: {
          id: userType === 'admin' ? 'user-2' : 'user-1',
          name: userName,
          email: userType === 'admin' ? 'admin@example.com' : 'customer@example.com',
          role: userType,
          company: userType === 'admin' ? 'Quicksite' : 'Acme Inc.'
        }
      }),
      
      logout: async () => {
        try {
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
        
        // Update profile in Supabase
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              name: profileUpdates.name || currentProfile.name,
              avatar_url: profileUpdates.avatar,
              updated_at: new Date().toISOString()
            })
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
