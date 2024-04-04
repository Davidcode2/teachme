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
  setCartItem: (item: any) => set({ cart: item}),
}));

interface BearState {
  bears: number
  increasePopulation: (by: number) => void
  removeAllBears: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
