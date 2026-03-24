import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/services/authService";
import type { LoginDto, RegisterDto, UserProfile } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<UserProfile>;
  register: (dto: RegisterDto) => Promise<UserProfile>;
  logout: () => void;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function storeToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (dto: LoginDto) => {
    const auth = await authService.login(dto);
    storeToken(auth.token);
    const profile = await refreshProfile();
    if (!profile) throw new Error("No se pudo cargar el perfil del usuario.");
    return profile;
  };

  const register = async (dto: RegisterDto) => {
    const auth = await authService.register(dto);
    storeToken(auth.token);
    const profile = await refreshProfile();
    if (!profile) throw new Error("No se pudo cargar el perfil del usuario.");
    return profile;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
