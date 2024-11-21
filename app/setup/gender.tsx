import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const GenderScreen = () => {
  const [selectedGender, setSelectedGender] = useState<null | string>(null);
  const router = useRouter();
  const local = useLocalSearchParams();

  const handleSelectGender = (gender: null | string) => {
    setSelectedGender(gender);
  };

  function nextScrenn() {
    router.navigate({
      pathname: "/setup/age",
      params: { ...local, gender: selectedGender },
    });
  }

  function configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_ANDROID_CLIENT_ID,
    });
  }

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  async function backScreen() {
    await GoogleSignin.revokeAccess();
    await SecureStore.deleteItemAsync("TOKEN_KEY");
    axios.defaults.headers.common["Authorization"] = "";
    router.replace("/sign-in");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="person-outline" size={50} color="yellow" />
        <Text style={styles.title}>¡Cuéntanos acerca de ti!</Text>
        <Text style={styles.subtitle}>
          Para ofrecerte una experiencia personalizada, necesitamos saber tu
          género.
        </Text>
      </View>
      <View style={styles.genderIcons}>
        <TouchableOpacity
          style={[
            styles.iconContent,
            selectedGender === "male" ? styles.selected : styles.unselected,
          ]}
          onPress={() => handleSelectGender("male")}
        >
          <Foundation
            name="male-symbol"
            size={40}
            color={selectedGender === "male" ? "white" : "gray"}
          />
          <Text style={{ color: selectedGender === "male" ? "white" : "gray" }}>
            Masculino
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconContent,
            selectedGender === "female" ? styles.selected : styles.unselected,
          ]}
          onPress={() => handleSelectGender("female")}
        >
          <Foundation
            name="female-symbol"
            size={40}
            color={selectedGender === "female" ? "white" : "gray"}
          />
          <Text
            style={{ color: selectedGender === "female" ? "white" : "gray" }}
          >
            Femenino
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={backScreen}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          disabled={!selectedGender}
          onPress={nextScrenn}
        >
          <Text style={[styles.link, { opacity: selectedGender ? 1 : 0.5 }]}>
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  header: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  genderIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  iconContent: {
    alignItems: "center",
    padding: 20,
    borderRadius: 50,
    width: 120,
    height: 120,
    justifyContent: "center",
  },
  selected: {
    backgroundColor: "black",
    borderWidth: 2,
    borderColor: "yellow",
  },
  unselected: {
    backgroundColor: "transparent",
    opacity: 0.5,
  },
  genderText: {
    fontSize: 16,
    marginTop: 8,
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    gap: 100,
    marginBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextButton: {
    backgroundColor: "yellow",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: {
    backgroundColor: "yellow",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  link: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default GenderScreen;
