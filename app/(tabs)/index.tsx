import { Text, View, BackHandler, Alert, Button } from "react-native";
import { useAuth } from "@/hooks/Auth/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

export default function Index() {
  const { onLogout } = useAuth();

  async function logout() {
    try {
      await onLogout!();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  }

  function configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_ANDROID_CLIENT_ID,
    });
  }

  useEffect(() => {
    configureGoogleSignIn();

    const backAction = () => {
      Alert.alert("Confirm", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            logout();
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Text onPress={logout} style={{ color: "white" }}>
        Aqui se mostrará las publicaciones de los usuarios
      </Text>
    </View>
  );
}
