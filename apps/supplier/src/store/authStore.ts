import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Tenant } from '@sb/types';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tenant: Tenant, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, tenant, token) => {
        localStorage.setItem('sb_token', token);
        set({ user, tenant, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('sb_token');
        set({ user: null, tenant: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'sb-supplier-auth',
    }
  )
);
