import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const response = await api.post("/auth/register", { email, password, displayName });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || { message: "Registration failed" } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || { message: "Login failed" } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
