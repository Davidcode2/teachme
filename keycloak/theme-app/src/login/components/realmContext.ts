import { createContext, useContext } from "react";

export const RealmContext = createContext<string>("");

export function useRealmName(): string {
  return useContext(RealmContext);
}
