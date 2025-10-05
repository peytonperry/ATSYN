import { useAuth } from "./AuthContext";
export interface User {
  id: string;
  name: string;
  email: string;
  authToken?: string;
  role: "admin" | "manager" | "staff" | "customer" | string;
}

export const useUser = () => {
  const { user, setUser, login, logout, isLoggedIn } = useAuth();
  return { user, setUser, login, logout, isLoggedIn };
};
