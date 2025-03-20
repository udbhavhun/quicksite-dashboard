
import { create } from 'zustand';

type UserType = 'customer' | 'admin';

interface UserState {
  userType: UserType;
  userName: string;
  isAuthenticated: boolean;
  login: (userType: UserType, userName: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userType: 'customer',
  userName: 'John Doe',
  isAuthenticated: true, // Default to true for now until we implement proper auth
  login: (userType, userName) => set({ userType, userName, isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
