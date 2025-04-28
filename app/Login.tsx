import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions, 
    ActivityIndicator,
    Pressable,
    Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import LoadingMessage from "../reusableComponents/LoadingMessage";
import CustomButton from "../reusableComponents/CustomButton";
import { useLocalSearchParams } from "expo-router";


const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
const { width, height } = Dimensions.get("window");


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const { fromSettings } = useLocalSearchParams();

  useEffect(() => {

    const checkUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token && fromSettings !== "true") {
          router.push("/SelectCharacter");
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(FIREBASE_AUTH_URL, {
        email,
        password,
        returnSecureToken: true,
      });

      const { idToken, localId, refreshToken } = response.data;

      await AsyncStorage.setItem("authToken", idToken);
      await AsyncStorage.setItem("userId", localId);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("parentId", localId);

      if (fromSettings === "true") {
        router.push("/UpdateUser");
      } else {
        router.push("/SelectCharacter");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const firebaseError = error.response?.data?.error?.message;
        switch (firebaseError) {
          case "INVALID_LOGIN_CREDENTIALS":
            setErrorMessage("Incorrect username or password. Please try again.");
            break;
          case "INVALID_EMAIL":
            setErrorMessage("Please enter a valid email address.");
            break;
          case "USER_DISABLED":
            setErrorMessage("This account has been disabled.");
            break;
          case "MISSING_PASSWORD":
            setErrorMessage("Please enter a password.");
            break;
          default:
            setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        {/* Fullscreen tap-away overlay */}
        {showPasswordInfo && (
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => {
              Keyboard.dismiss();
              setShowPasswordInfo(false);
            }}
          />
        )}

        <View style={{width: '90%', height: '30%', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require("../assets/logo.png")}
            style={[styles.logo]}
          />
        </View>
        
        {fromSettings === "true" ? <Text style={styles.title}>Confirm Old Email and Password</Text> : <Text style={styles.title}>Login</Text>}


        <TextInput
          style={[styles.input, { width: '80%', fontSize: 20, marginBottom: 15, minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={[{ width: '80%', position: "relative", justifyContent: "center", alignItems: 'center', minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}>
          <TextInput
            style={[styles.input, { fontSize: 20, width: '100%', minWidth: '100%', maxWidth: '100%' }]}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setShowPasswordInfo(prev => !prev)}
          >
            <Text style={{ fontSize: 18, marginVertical: 'auto'}}>ℹ️</Text>
          </TouchableOpacity>

          {/* Password info bubble */}
          {showPasswordInfo && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>• Password must be at least 6 characters.</Text>
              <Text style={styles.bubbleText}>• Must contain at least 1 number</Text>
            </View>
          )}
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {loading ? (
  <LoadingMessage smallVersion={true} />
) : (
  <CustomButton
    text="Sign In"
    functionToExecute={handleLogin}
    uniqueButtonStyling={{ width: '55%', marginTop: 30, minWidth: 200 }}
  />
)}
        <TouchableOpacity onPress={() => router.push("/ResetPassword")}>
          <Text style={styles.registerText}>Forgot Password?</Text>
        </TouchableOpacity>
        {fromSettings !== "true" ?
        <TouchableOpacity onPress={() => router.push("/Register")}>
          <Text style={styles.registerText}>Register New Account</Text>
        </TouchableOpacity>
        : null
        }
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 700,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    margin: 'auto'
  },
  logo: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: "contain",
  },
  title: {
    fontSize: 33,
    fontWeight: "700",
    color: "#3E1911",
    margin: 25,
    textAlign: "center",
  },
  input: {
    position: 'relative',
    height: 55,
    minHeight: 55,
    backgroundColor: "#fff",
    textAlignVertical: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#494649",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  registerText: {
    marginTop: height * 0.03,
    color: "#3E1911",
    fontSize: 18,
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  infoIcon: {
    position: "absolute",
    right: -30,
    top: 0,
    bottom: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
  },
  bubble: {
    position: "absolute",
    top: '50%',
    transform: [{ translateY: -92 }],
    right: 0,
    left: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2aa0b8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 5,
    elevation: 10,
  },
  bubbleText: {
    fontSize: 15,
    color: "#3E1911",
  },
});
