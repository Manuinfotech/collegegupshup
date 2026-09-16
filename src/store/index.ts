import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

interface CompareState {
  colleges: string[];
  addCollege: (id: string) => void;
  removeCollege: (id: string) => void;
  clearAll: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      colleges: [],
      addCollege: (id) =>
        set((state) => ({
          colleges: state.colleges.length < 4
            ? [...state.colleges, id]
            : state.colleges,
        })),
      removeCollege: (id) =>
        set((state) => ({
          colleges: state.colleges.filter((c) => c !== id),
        })),
      clearAll: () => set({ colleges: [] }),
    }),
    { name: 'compare-storage' }
  )
);

interface SavedCollegesState {
  savedIds: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedCollegesStore = create<SavedCollegesState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggle: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((c) => c !== id)
            : [...state.savedIds, id],
        })),
      isSaved: (id) => get().savedIds.includes(id),
    }),
    { name: 'saved-colleges' }
  )
);
