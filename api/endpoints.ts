import axios from "axios";

const instance = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

export function register(userData: {
  userName: string;
  email: string;
  password: string;
}) {
  return instance.post("/auth/register", userData);
}

export function verify2FA(verify2FAData: { userId: number; code: string }) {
  return instance.post("/auth/verify-2fa", verify2FAData);
}

export function login(loginData: { email: string; password: string }) {
  return instance.post("/auth/login", loginData);
}
