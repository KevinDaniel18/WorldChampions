import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useAuth } from "../Auth/AuthContext";

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

export function useLoginForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    userName: "",
    email: "",
    password: "",
    authMethod: "local",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin, isLoading } = useAuth();

  const router = useRouter();

  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };

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

    if (formData.password.trim() === "" && formData.authMethod === "local") {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function googleSignIn() {
    console.log("pressed sign in");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { email } = userInfo.data?.user || {};

      if (!email) {
        console.error("No se encontró un email en la respuesta de Google");
        googleLogout();
        return;
      }

      if (onLogin) {
        const res = await onLogin(email, null, "google");
        if (res && res.error) {
          if (res.statusCode === 400 && res.userId) {
            router.replace({
              pathname: "/verify2FA",
              params: { userId: res.userId },
            });
          }
          showToast(res.msg);
          googleLogout();
        } else {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error(error);
      googleLogout();
    }
  }

  async function login() {
    if (validateInputs()) {
      if (formData.authMethod === "google") {
        await googleSignIn();
      } else {
        const res = await onLogin!(
          formData.email,
          formData.password,
          formData.authMethod
        );

        if (res && res.error) {
          if (res.statusCode === 400 && res.userId) {
            router.replace({
              pathname: "/verify2FA",
              params: { userId: res.userId },
            });
          } else {
            showToast(res.msg);
          }
        } else {
          router.replace("/");
        }
      }
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
    showPassword,
    setShowPassword,
    errorMsg,
    isLoading,
    handleInput,
    login,
    googleSignIn
  };
}
