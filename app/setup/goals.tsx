import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import FitnessGoals from "@/components/FitnessGoals";

const GoalsScreen = () => {
  const router = useRouter();
  const local = useLocalSearchParams();
  const { onCompleteSetup, isCheckSetup } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<{ meta: string }[]>([]);

  useEffect(() => {
    const param = local.gender;
    console.log(param);
  }, []);

  useEffect(() => {
    if (isCheckSetup) {
      router.replace("/");
    }
  }, [isCheckSetup]);

  async function finishSetup() {
    const gender = Array.isArray(local.gender) ? local.gender[0] : local.gender;
    const age = Array.isArray(local.age)
      ? Number(local.age[0])
      : Number(local.age);
    const weight = Array.isArray(local.weight)
      ? Number(local.weight[0])
      : Number(local.weight);
    const height = Array.isArray(local.height)
      ? Number(local.height[0])
      : Number(local.height);

    await onCompleteSetup!(gender, age, weight, height, selectedGoals);
  }

  function backScreen() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cúal es tu meta?</Text>
        <Text style={styles.subtitle}>
          Esto nos ayuda a crear tu plan personalizado
        </Text>
      </View>

      <FitnessGoals onSelectedGoals={setSelectedGoals} />

      <View style={{ height: 60 }} />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={backScreen}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={finishSetup}>
          <Text style={[styles.link]}>Finalizar</Text>
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

export default GoalsScreen;
