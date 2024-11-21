import { useAuth } from "@/hooks/Auth/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";

import TabBar from "@/components/TabBar";

export default function AppLayout() {
  const { isLoading, authState, isCheckSetup } = useAuth();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isCheckSetup === false) {
    return <Redirect href="/setup/gender" />;
  }

  return authState?.authenticated ? (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />
      <Tabs.Screen
        name="excercises"
        options={{
          title: "Rutinas",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  ) : (
    <Redirect href={"/sign-in"} />
  );
}
