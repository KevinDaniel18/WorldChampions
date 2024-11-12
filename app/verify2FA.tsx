import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/Auth/AuthContext";

interface FormDataProps {
  code: string;
}

interface ErrorProps {
  code?: string;
}

const Verify2FAScreen = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    code: "",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [userId, setUserId] = useState<number | null>(null);
  const { onVerify2FA, isLoading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const getId = params.userId;
    console.log("tipo de parametro", typeof getId);

    console.log("parametro obtenido", getId);
    setUserId(Number(getId));
  }, []);

  if (!onVerify2FA) {
    console.error("onVerify2FA no está definido en el contexto");
  }

  function handleInput(name: keyof FormDataProps, value: string) {
    const trimedValue = value.trim();
    setFormData((prev) => ({ ...prev, [name]: trimedValue }));
    if (errorMsg[name]) {
      setErrorMsg((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateInputs() {
    let isValid = true;
    const errors: ErrorProps = {};

    if (formData.code.trim() === "") {
      errors.code = "El codigo de verificación es requerido";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function verify2FA() {
    if (!userId) {
      console.log("user id no valid");
      return;
    }

    if (validateInputs()) {
      const res = await onVerify2FA!(userId, formData.code);
      console.log("codigo", typeof formData.code);

      if (res && res.error) {
        alert(res.msg);
      } else {
        router.replace("/sign-in");
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Verifica tu cuenta</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelInput}>Codigo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu codigo"
            placeholderTextColor="#A0A0A0"
            value={formData.code}
            onChangeText={(text) => handleInput("code", text)}
            keyboardType="numeric"
            autoCapitalize="none"
            accessibilityLabel="Ingresa tu codigo"
          />
        </View>
        {errorMsg.code ? (
          <Text style={styles.errorText}>{errorMsg.code}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={verify2FA}
          disabled={isLoading}
          accessibilityLabel="Verificar"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Verificar</Text>
          )}
        </TouchableOpacity>

        <Link
          href="/sign-up"
          style={{ alignSelf: "center", color: "white", marginTop: 20 }}
        >
          Volver
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelInput: {
    color: "white",
    marginBottom: 10,
  },
  input: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Verify2FAScreen;
