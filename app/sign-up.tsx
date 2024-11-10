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
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthContext";
import { Link, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FormDataProps {
  userName: string;
  email: string;
  password: string;
  authMethod: string;
}

interface ErrorProps {
  userName?: string;
  email?: string;
  password?: string;
  authMethod?: string;
}

const RegisterScreen = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    userName: "",
    email: "",
    password: "",
    authMethod: "local",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [showPassword, setShowPassword] = useState(false);
  const { onRegister, isLoading } = useAuth();

  const router = useRouter();

  if (!onRegister) {
    console.error("onRegister no está definido en el contexto.");
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

    if (formData.password.trim() === "" && formData.authMethod === "local") {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function register() {
    if (validateInputs()) {
      const res = await onRegister!(
        formData.userName,
        formData.email,
        formData.authMethod === "google" ? null : formData.password,
        formData.authMethod
      );
      if (res && res.error) {
        alert(res.msg);
      }
    }
  }

  async function googleSignIn() {
    console.log("pressed sign in");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { email, name } = userInfo.data?.user || {};

      if (!email || !name) {
        console.error("No se encontró un email en la respuesta de Google");
        return;
      }

      if (onRegister) {
        const res = await onRegister(name, email, null, "google");
        if (res && res.error) {
          alert(res.msg);
          googleLogout();
        } else if (res && res.userId) {
          googleLogout();
          router.replace({
            pathname: "/verify2FA",
            params: { userId: res.userId },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_ANDROID_CLIENT_ID,
    });
  }

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  function googleLogout() {
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Crea tu cuenta</Text>
        </View>

        <View style={styles.googleLogin}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={() => {
              setFormData((prev) => ({ ...prev, authMethod: "google" }));
              googleSignIn();
            }}
          />
        </View>

        <View style={styles.lineContent}>
          <View style={styles.line} />
          <View>
            <Text style={styles.lineText}>O</Text>
          </View>
          <View style={styles.line} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelInput}>
            Correo {""} <Text style={{ color: "yellow" }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="hola@ejemplo.com"
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

          <Text style={styles.labelInput}>
            Contraseña{""} <Text style={{ color: "yellow" }}>*</Text>
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Tu contraseña"
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

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={() => {
            setFormData((prev) => ({ ...prev, authMethod: "local" }));
            register();
          }}
          disabled={isLoading}
          accessibilityLabel="Crear"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Crear</Text>
          )}
        </TouchableOpacity>

        <View style={{ alignSelf: "center", marginTop: 20 }}>
          <Text style={{ color: "white" }}>
            Ya tienes una cuenta {""}
            <Link href={"/sign-in"}>
              <Text style={{ color: "yellow" }}>Iniciar sesión</Text>
            </Link>
          </Text>
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
  lineText: {
    width: 50,
    textAlign: "center",
    color: "white",
  },
  googleLogin: {
    marginTop: 20,
  },
});

export default RegisterScreen;
