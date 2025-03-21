
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

// Mock user data - this would come from a database in a real app
const mockUsers = [
  {
    id: 'user-1',
    email: 'customer@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'customer' as UserType,
    company: 'Acme Inc.',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserType,
    company: 'Quicksite',
    phone: '+1 (555) 987-6543'
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userType: 'customer',
      userName: 'John Doe',
      isAuthenticated: false,
      profile: null,
      
      login: async (email: string, password: string) => {
        // Mock authentication
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          set({
            isAuthenticated: true,
            userType: user.role,
            userName: user.name,
            profile: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              company: user.company,
              phone: user.phone
            }
          });
          return true;
        }
        
        return false;
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
      
      logout: () => set({
        isAuthenticated: false,
        profile: null
      }),
      
      updateProfile: (profileUpdates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...profileUpdates } : null,
        userName: profileUpdates.name ? profileUpdates.name : state.userName,
        userType: profileUpdates.role ? profileUpdates.role : state.userType
      }))
    }),
    {
      name: 'user-storage'
    }
  )
);
