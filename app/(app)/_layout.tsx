import { useAuth } from "@/hooks/Auth/AuthContext";
import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
  const { isLoading, authState } = useAuth();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return authState?.authenticated ? <Stack /> : <Redirect href="/sign-in" />;
}
