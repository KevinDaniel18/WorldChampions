import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/components/Auth/AuthContext";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface FormDataProps {
  userName: string;
  email: string;
  password: string;
}

interface ErrorProps {
  userName?: string;
  email?: string;
  password?: string;
}

const LoginScreen = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    userName: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin, onRegister, isLoading } = useAuth();

  const router = useRouter();

  if (!onLogin) {
    console.error("onLogin no está definido en el contexto.");
  }

  function handleInput(name: keyof FormDataProps, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg[name]) {
      setErrorMsg((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateInputs() {
    let isValid = true;
    const errors: ErrorProps = {};

    if (formData.email.trim() === "") {
      errors.email = "El correo electrónico es requerido";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function login() {
    if (validateInputs()) {
      const res = await onLogin!(formData.email, formData.password);
      router.replace("/");
      if (res && res.error) {
        alert(res.msg);
      }
    }
  }

  async function register() {
    const res = await onRegister!(
      formData.userName,
      formData.email,
      formData.password
    );
    if (res && res.error) {
      alert(res.msg);
    } else {
      login();
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <FontAwesome6 name="crown" size={64} color="#FFD700" />
          <Text style={styles.logoText}>World Champions</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#A0A0A0"
            value={formData.email}
            onChangeText={(text) => handleInput("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Ingrese su correo electrónico"
          />
          {errorMsg.email ? (
            <Text style={styles.errorText}>{errorMsg.email}</Text>
          ) : null}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Contraseña"
              placeholderTextColor="#A0A0A0"
              value={formData.password}
              onChangeText={(text) => handleInput("password", text)}
              secureTextEntry={!showPassword}
              accessibilityLabel="Ingrese su contraseña"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <FontAwesome6
                name={showPassword ? "eye-slash" : "eye"}
                size={24}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          {errorMsg.password ? (
            <Text style={styles.errorText}>{errorMsg.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity accessibilityLabel="¿Olvidaste tu contraseña?">
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={login}
          disabled={isLoading}
          accessibilityLabel="Iniciar Sesión"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.lineContent}>
          <View style={styles.line} />
          <View>
            <Text style={styles.lineText}>O</Text>
          </View>
          <View style={styles.line} />
        </View>
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
  input: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
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
  forgotPassword: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  lineContent: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  lineText:{
    width: 50,
    textAlign: "center",
    color: "white",
  }
});

export default LoginScreen;
