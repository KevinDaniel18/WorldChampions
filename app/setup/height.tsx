import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";

const HeightScreen = () => {
  const [selectedHeight, setSelectedHeight] = useState("");
  const router = useRouter();
  const local = useLocalSearchParams();

  const heightOptions = [];
  for (let i = 122; i <= 268; i++) {
    heightOptions.push(i);
  }

  function nextScrenn() {
    router.navigate({
      pathname: "/setup/goals",
      params: { ...local, height: selectedHeight },
    });
  }

  function backScreen() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cúal es tu estatura?</Text>
        <Text style={styles.subtitle}>Puedes cambiar esto despues.</Text>
      </View>

      <Picker
        selectedValue={selectedHeight}
        onValueChange={(itemValue, itemIndex) => setSelectedHeight(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona tu estatura" value={null} />
        {heightOptions.map((w) => (
          <Picker.Item key={w} label={`${w}cm`} value={w} />
        ))}
      </Picker>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={backScreen}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          disabled={!selectedHeight}
          onPress={nextScrenn}
        >
          <Text style={[styles.link, { opacity: selectedHeight ? 1 : 0.5 }]}>
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
  picker: {
    width: "100%",
    backgroundColor: "white",
    marginBottom: 40,
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

export default HeightScreen;
