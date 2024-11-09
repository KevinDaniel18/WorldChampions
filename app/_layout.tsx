import { Slot } from "expo-router";
import { AuthProvider } from "@/components/Auth/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
