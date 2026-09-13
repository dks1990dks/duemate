import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getCurrentUser, logoutUser } from "./auth.api";
import type { AuthUser } from "./auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;

  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const refreshUser = async () => {
    try {
      setIsLoading(true);

      const response = await getCurrentUser();

      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      // Always clear frontend authentication state.
      setUser(null);

      navigate("/login", {
        replace: true,
      });
    }
  };

  // Restore authenticated user on application startup.
  useEffect(() => {
    void refreshUser();
  }, []);

  // Handle expired/invalid authentication.
  useEffect(() => {
    const handleAuthExpired = () => {
      // Clear current authenticated user.
      setUser(null);

      // Avoid unnecessary navigation when already on an auth page.
      if (location.pathname !== "/login") {
        navigate("/login", {
          replace: true,
          state: {
            from: location.pathname,
          },
        });
      }
    };

    window.addEventListener(
      "auth:expired",
      handleAuthExpired,
    );

    return () => {
      window.removeEventListener(
        "auth:expired",
        handleAuthExpired,
      );
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),

        refreshUser,
        logout,

        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};