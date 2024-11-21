import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const AgeScreen = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const router = useRouter();
  const local = useLocalSearchParams();

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const age = calculateAge(selectedDate);
      setSelectedAge(age);
      if (age >= 18 && age <= 100) {
        setAgeError(null);
      } else {
        setAgeError("La siento, la edad debe estar entre 18 y 100 años");
      }
    }
  };

  const nextScreen = () => {
    if (selectedAge !== null && ageError === null) {
      console.log("Selected age:", selectedAge);
      router.push({
        pathname: "/setup/weight",
        params: { ...local, age: selectedAge },
      });
    }
  };

  function backScreen() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cúal es tu fecha de nacimiento?</Text>
        <Text style={styles.subtitle}>
          Esto nos ayuda a crear tus planes personalizados de acuerdo a tu edad
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.dateText}>
          {selectedAge !== null
            ? `Tu edad es: ${selectedAge} años`
            : "Selecciona tu fecha de nacimiento"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      {ageError && <Text style={styles.errorText}>{ageError}</Text>}

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backButton} onPress={backScreen}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: selectedAge !== null ? 1 : 0.5 },
          ]}
          onPress={nextScreen}
          disabled={selectedAge === null}
        >
          <Text style={styles.link}>Siguiente</Text>
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
  datePickerButton: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
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

export default AgeScreen;
