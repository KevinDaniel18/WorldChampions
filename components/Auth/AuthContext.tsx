import { createContext, useContext, useEffect, useState } from "react";
import { register, verify2FA, login } from "@/api/endpoints";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated?: boolean | null };
  isLoading: boolean;
  onRegister?: (
    userName: string,
    email: string,
    password: string
  ) => Promise<any>;
  onVerify2FA?: (userId: number, code: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({ isLoading: false });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("TOKEN_KEY");
      console.log("stored token: ", token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
        });
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const handleRegister = async (
    userName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      return await register({ userName, email, password });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.mesg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (userId: number, code: string) => {
    setIsLoading(true);
    try {
      return await verify2FA({ userId, code });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.mesg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await login({ email, password });
      if (!res || !res.data) {
        throw new Error("No se recibió una respuesta válida del servidor.");
      }
      setAuthState({ token: res.data.accessToken, authenticated: true });
      const accessToken = res.data.accessToken;

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      await SecureStore.setItemAsync("TOKEN_KEY", accessToken);
      return res.data;
    } catch (error) {
      console.log(error);

      return { error: true, msg: (error as any).response.data.message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await SecureStore.deleteItemAsync("TOKEN_KEY");
    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
    });
    setIsLoading(false);
  };

  const value = {
    onRegister: handleRegister,
    onLogin: handleLogin,
    onVerify2FA: handleVerify2FA,
    onLogout: handleLogout,
    authState,
    isLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
