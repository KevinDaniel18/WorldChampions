import { Stack } from "expo-router";
import { AuthProvider } from "@/hooks/Auth/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="sign-in" options={{ animation: "fade" }} />
      </Stack>
    </AuthProvider>
  );
}
