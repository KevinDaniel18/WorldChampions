import { createContext, useContext, useEffect, useState } from "react";
import {
  register,
  verify2FA,
  login,
  completeSetup,
  checkSetup,
} from "@/api/endpoints";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated?: boolean | null };
  isLoading: boolean;
  isCheckSetup: boolean | null;
  onRegister?: (
    userName: string,
    email: string,
    password: string | null,
    authMethod: string
  ) => Promise<any>;
  onVerify2FA?: (userId: number, code: string) => Promise<any>;
  onCompleteSetup?: (
    gender: string,
    age: number,
    weight: number,
    height: number,
    goals: { meta: string }[]
  ) => Promise<any>;
  onCheckSetup?: () => Promise<any>;
  onLogin?: (
    email: string,
    password: string | null,
    authMethod: string
  ) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({
  isLoading: false,
  isCheckSetup: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckSetup, setIsCheckSetup] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        const token = await SecureStore.getItemAsync("TOKEN_KEY");
        console.log("token", token);

        if (token) {
          handleCheckSetup();
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
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuthState();
  }, [authState.token]);

  const handleRegister = async (
    userName: string,
    email: string,
    password: string | null,
    authMethod: string
  ) => {
    setIsLoading(true);
    try {
      const res = await register({ userName, email, password, authMethod });
      console.log("user id creado", res.data.id);

      return { userId: res.data.id };
    } catch (error: any) {
      if (new AxiosError(error) && error.response) {
        return {
          error: true,
          msg: error.response.data.message,
          userId: error.response.data.userId,
          statusCode: error.response.status,
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (userId: number, code: string) => {
    setIsLoading(true);
    try {
      return await verify2FA({ userId, code });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (
    email: string,
    password: string | null,
    authMethod: string
  ) => {
    setIsLoading(true);
    try {
      const res = await login({ email, password, authMethod });
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
    } catch (error: any) {
      if (new AxiosError(error) && error.response) {
        return {
          error: true,
          msg: error.response.data.message,
          userId: error.response.data.userId,
          statusCode: error.response.status,
        };
      } else {
        console.log(error);
        return { error: true, msg: "Ocurrió un error desconocido" };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSetup = async (
    gender: string,
    age: number,
    weight: number,
    height: number,
    goals: { meta: string }[]
  ) => {
    if (!authState.token) {
      console.log("Token no disponible");
      return;
    }
    try {
      await completeSetup({ gender, age, weight, height, goals });
      setIsCheckSetup(true);
    } catch (error) {
      console.error("Error completing setup", error);
    }
  };

  const handleCheckSetup = async () => {
    if (!authState.token) {
      console.log("Token no disponible");
      return;
    }
    try {
      console.log(
        "Authorization Header: ",
        axios.defaults.headers.common["Authorization"]
      );
      const res = await checkSetup();
      console.log("check setup:", res.data.hasCompletedSetup);

      setIsCheckSetup(res.data.hasCompletedSetup);
    } catch (error) {
      console.error("Error checking setup", error);
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
    onCompleteSetup: handleCompleteSetup,
    onLogout: handleLogout,
    authState,
    isLoading,
    isCheckSetup,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
