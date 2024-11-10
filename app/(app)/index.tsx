import { Text, View } from "react-native";

import { useAuth } from "@/components/Auth/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

export default function Index() {
  const { onLogout } = useAuth();

  async function logout() {
    await onLogout!();
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  }

  function configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_ANDROID_CLIENT_ID,
    });
  }

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={logout}>Sign Out</Text>
    </View>
  );
}
