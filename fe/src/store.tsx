import { create } from "zustand";
import Material from "./DTOs/material";
import { MaterialWithThumbnail } from "./types/MaterialWithThumbnail";
import { User } from "./DTOs/user";

type AccessTokenState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
};

export const useAccessTokenStore = create<AccessTokenState>((set) => ({
  accessToken: null,
  setAccessToken: (token: string) => set(() => ({ accessToken: token })),
  removeAccessToken: () => set({ accessToken: null }),
}));

type UserState = {
  user: User | null;
  setUser: (user: any) => void;
  removeUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  removeUser: () => set({ user: null }),
}));

type AvatarState = {
  avatar: any;
  setAvatar: (avatar: any) => void;
  removeAvatar: () => void;
};

export const useAvatarStore = create<AvatarState>((set) => ({
  avatar: null,
  setAvatar: (avatar: any) => set({ avatar }),
  removeAvatar: () => set({ avatar: null }),
}));

type SidebarState = {
  isShown: boolean;
  toggleSidebar: () => void;
  hide: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isShown: false,
  toggleSidebar: () => set((state) => ({ isShown: !state.isShown })),
  hide: () => set({ isShown: false }),
}));

type CartState = {
  numberOfCartItems: number;
  cart: any;
  updateCart: (newCartData: any) => void;
};

export const useCartStore = create<CartState>((set) => ({
  numberOfCartItems: 0,
  cart: [],
  updateNumberOfCartItems: (items: number) => set({ numberOfCartItems: items }),
  updateCart: (cart: any) => set({ cart: cart }),
}));

type LoadingState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useGlobalLoadingStore = create<LoadingState>((set) => ({
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}));

type LikelyHuman = {
  isLikelyHuman: boolean;
  setIsLikelyHuman: (loading: boolean) => void;
};

export const useLikelyHumanStore = create<LikelyHuman>((set) => ({
  isLikelyHuman: false,
  setIsLikelyHuman: (isLikelyHuman: boolean) => set({ isLikelyHuman }),
}));

type SearchState = {
  searchString: string;
  searchResults: Material[] | MaterialWithThumbnail[];
  setSearchString: (search: string) => void;
  setSearchResults: (results: Material[] | MaterialWithThumbnail[]) => void;
};

export const useSearchState = create<SearchState>((set) => ({
  searchString: "",
  searchResults: [],
  setSearchString: (search: string) => set({ searchString: search }),
  setSearchResults: (results: Material[] | MaterialWithThumbnail[]) =>
    set({ searchResults: results }),
}));

type ErrorStore = {
  errors: CustomError[];
  pushError: (error: CustomError) => void;
  pop: () => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],
  pushError: (error: CustomError) =>
    set((state) => ({ errors: [...state.errors, error] })),
  pop: () =>
    set((state) => ({
      errors: state.errors.slice(0, state.errors.length - 1),
    })),
}));

type CustomError = {
  message: string;
  code: number;
};
