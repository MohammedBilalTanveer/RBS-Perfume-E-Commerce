import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// Same demo account the original "Forgot password" hint gave out.
export const DEMO_ACCOUNT = { username: "cmr123", password: "cmr@123" };

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
