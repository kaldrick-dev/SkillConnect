import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("skillconnect_user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [ready] = useState(true);

  const persist = (payload) => {
    localStorage.setItem("skillconnect_token", payload.access_token);
    localStorage.setItem("skillconnect_user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    persist(data);
    return data;
  };

  const register = async (details) => {
    await authApi.register(details);
    return login({ email: details.email, password: details.password });
  };

  const logout = () => {
    localStorage.removeItem("skillconnect_token");
    localStorage.removeItem("skillconnect_user");
    setUser(null);
  };

  const updateUser = (next) => {
    setUser((current) => {
      const merged = { ...current, ...next };
      localStorage.setItem("skillconnect_user", JSON.stringify(merged));
      return merged;
    });
  };

  const value = useMemo(
    () => ({ user, ready, login, register, logout, updateUser }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
