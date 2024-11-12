import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/Auth/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
        <Slot />
    </AuthProvider>
  );
}
