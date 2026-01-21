import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name?: string | null
}

interface StoreState {
  user: User | null
  theme: 'light' | 'dark'
  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  logout: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      setUser: (user) => set({ user }),
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'hearsay-store',
      partialize: (state) => ({ theme: state.theme, user: state.user }),
    }
  )
)
