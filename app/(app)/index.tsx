import { Text, View } from "react-native";

import { useAuth } from "@/components/Auth/AuthContext";

export default function Index() {
  const { onLogout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={onLogout}>Sign Out</Text>
    </View>
  );
}
