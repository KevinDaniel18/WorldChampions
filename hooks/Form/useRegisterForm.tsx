import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useRouter } from "expo-router";
import { ToastAndroid } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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

export function useRegisterForm() {
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
      router.replace({
        pathname: "/verify2FA",
        params: { userId: res.userId },
      });
      if (res && res.error) {
        if (res.statusCode === 400 && res.userId) {
          router.replace({
            pathname: "/verify2FA",
            params: { userId: res.userId },
          });
        }
        ToastAndroid.show(res.msg, ToastAndroid.SHORT);
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
          if (res.statusCode === 400 && res.userId) {
            router.replace({
              pathname: "/verify2FA",
              params: { userId: res.userId },
            });
          }
          ToastAndroid.show(res.msg, ToastAndroid.SHORT);
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

  return {
    formData,
    setFormData,
    errorMsg,
    showPassword,
    setShowPassword,
    isLoading,
    handleInput,
    register,
    googleSignIn,
  };
}
