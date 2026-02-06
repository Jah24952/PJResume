import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
    id: number
    email: string
    name: string
    role?: string
}

type AuthState = {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        }
    )
)
