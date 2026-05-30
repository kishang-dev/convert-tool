import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
    phone?: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    guestId: string;
    login: (userData: User) => void;
    logout: () => void;
    initGuestId: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            guestId: '',

            login: (userData) => set({ user: userData }),

            logout: () => {
                set({ user: null });
                localStorage.removeItem('token'); // Also clear from local storage if manually stored
            },

            initGuestId: () => {
                const currentGuestId = get().guestId;
                if (!currentGuestId) {
                    set({ guestId: uuidv4() });
                }
            },

            updateUser: (userData) => set((state) => ({ 
                user: state.user ? { ...state.user, ...userData } : null 
            })),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({ user: state.user, guestId: state.guestId }), // Persist both user and guestId
        }
    )
);
