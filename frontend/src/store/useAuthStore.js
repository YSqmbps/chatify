import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: null,
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));