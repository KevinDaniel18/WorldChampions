import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useRegisterForm } from "@/hooks/Form/useRegisterForm";
import { commonStyles } from "@/constants/styles";

const RegisterScreen = () => {
  const {
    formData,
    setFormData,
    errorMsg,
    showPassword,
    setShowPassword,
    isLoading,
    handleInput,
    register,
    googleSignIn,
  } = useRegisterForm();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={commonStyles.container}
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

        <View style={commonStyles.inputContainer}>
          <Text style={commonStyles.labelInput}>
            Nombre completo {""} <Text style={{ color: "yellow" }}>*</Text>
          </Text>

          <TextInput
            style={commonStyles.input}
            placeholder="Fulano Mengano"
            placeholderTextColor="#A0A0A0"
            value={formData.userName}
            onChangeText={(text) => handleInput("userName", text)}
            accessibilityLabel="Ingrese su nombre completo"
          />
          {errorMsg.userName ? (
            <Text style={styles.errorText}>{errorMsg.userName}</Text>
          ) : null}

          <Text style={commonStyles.labelInput}>
            Correo {""} <Text style={{ color: "yellow" }}>*</Text>
          </Text>
          <TextInput
            style={commonStyles.input}
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

          <Text style={commonStyles.labelInput}>
            Contraseña{""} <Text style={{ color: "yellow" }}>*</Text>
          </Text>
          <View style={commonStyles.passwordContainer}>
            <TextInput
              style={[commonStyles.input, commonStyles.passwordInput]}
              placeholder="Tu contraseña"
              placeholderTextColor="#A0A0A0"
              value={formData.password}
              onChangeText={(text) => handleInput("password", text)}
              secureTextEntry={!showPassword}
              accessibilityLabel="Ingrese su contraseña"
            />
            <TouchableOpacity
              style={commonStyles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <FontAwesome6
                name={showPassword ? "eye-slash" : "eye"}
                size={16}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          {errorMsg.password ? (
            <Text style={styles.errorText}>{errorMsg.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            isLoading && commonStyles.disabledButton,
          ]}
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
            <Text style={commonStyles.buttonText}>Crear</Text>
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
