import axios from "axios";
import * as SecureStore from "expo-secure-store";

const instance = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

const getAuthToken = async () => {
  const token = await SecureStore.getItemAsync("TOKEN_KEY");
  return token ? `Bearer ${token}` : "";
};

instance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function register(userData: {
  userName: string;
  email: string;
  password?: string | null;
  authMethod: string;
}) {
  return instance.post("/auth/register", userData);
}

export function verify2FA(verify2FAData: { userId: number; code: string }) {
  return instance.post("/auth/verify-2fa", verify2FAData);
}

export function completeSetup(setupData: {
  gender: string;
  age: number;
  weight: number;
  height: number;
  goals: {meta: string}[];
}) {
  return instance.post("/auth/setup/complete", setupData);
}

export function checkSetup() {
  return instance.get("/auth/check-setup");
}

export function login(loginData: {
  email: string;
  password?: string | null;
  authMethod: string;
}) {
  return instance.post("/auth/login", loginData);
}
