import { create } from 'zustand'
import Material from './DTOs/material'

type AccessTokenState = {
  accessToken: string | null
  setAccessToken: (token: string) => void
  removeAccessToken: () => void
}

export const useAccessTokenStore = create<AccessTokenState>((set) => ({
  accessToken: null,
  setAccessToken: (token: string) => set(() => ({ accessToken: token })),
  removeAccessToken: () => set({ accessToken: null }),
}))

type UserState = {
  user: any
  setUser: (user: any) => void
  removeUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  removeUser: () => set({ user: null }),
}));

type SidebarState = {
  isShown: boolean
  toggleSidebar: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isShown: false,
  toggleSidebar: () => set((state) => ({ isShown: !state.isShown })),
}));

type CartState = {
  cart: any
  setCartItem: (item: any) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  setCartItem: (item: any) => set({ cart: item }),
}));

type LoadingState = {
  loading: boolean,
  setLoading: (loading: boolean) => void
}

export const useGlobalLoadingStore = create<LoadingState>((set) => ({
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}));

type SearchState = {
  searchString: string,
  searchResults: Material[];
  setSearchString: (search: string) => void
  setSearchResults: (results: Material[]) => void
}

export const useSearchState = create<SearchState>((set) => ({
  searchString: '',
  searchResults: [],
  setSearchString: (search: string) => set({ searchString: search }),
  setSearchResults: (results: Material[]) => set({ searchResults: results }),
}));
