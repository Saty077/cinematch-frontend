import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_BASE_URL || "";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cm_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("cm_token") || null);

  const persist = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("cm_user", JSON.stringify(userData));
    localStorage.setItem("cm_token", jwt);
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { name, email, password });
    persist(data.user, data.token);
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    persist(data.user, data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cm_user");
    localStorage.removeItem("cm_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Restore auth header on page reload
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
