import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import LoadingMessage from "../reusableComponents/LoadingMessage";
import CustomButton from "../reusableComponents/CustomButton";

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const { width, height } = Dimensions.get("window");

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    console.log("Register button pressed");

    setErrorMessage("");
    setSuccessMessage(""); // Clear success message on new attempt

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(FIREBASE_SIGNUP_URL, {
        email,
        password,
        returnSecureToken: true,
      });

      // ✅ Set success message
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Delay navigation to allow user to read success message
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", (error as any).response?.data || (error as any).message);

      const firebaseError = (axios.isAxiosError(error) && error.response?.data?.error?.message) || null;

      switch (firebaseError) {
        case "EMAIL_EXISTS":
          setErrorMessage("This email is already in use.");
          break;
        case "INVALID_EMAIL":
          setErrorMessage("Please enter a valid email address.");
          break;
        case "WEAK_PASSWORD":
          setErrorMessage("Password must be at least 6 characters.");
          break;
        default:
          setErrorMessage("Registration failed. Please try again.");
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

        {/* Password info bubble */}
        {showPasswordInfo && (
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>• Password must be at least 6 characters.</Text>
            <Text style={styles.bubbleText}>• Contain 1 number</Text>
          </View>
        )}

        <Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { width: width * 0.5, height: width * 0.5 }]}
        />
        <Text style={styles.title}>Register New Account</Text>

        <TextInput
          style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input with Info Icon */}
        <View style={{ width: width * 0.8, position: "relative", marginBottom: height * 0.015 }}>
          <TextInput
            style={[styles.input, { fontSize: width * 0.045 }]}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setShowPasswordInfo(true)}
          >
            <Text style={{ fontSize: 18 }}>ℹ️</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input without Info Icon */}
        <TextInput
          style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Display error message if it exists */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* ✅ Display success message if registration is successful */}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        {loading ? (
          <LoadingMessage smallVersion={true} />
        ) : (
          <CustomButton
            text="Sign Up"
            functionToExecute={handleRegister}
            uniqueButtonStyling={{ width: width * 0.6, height: height * 0.08 }}
          />
        )}

        <TouchableOpacity onPress={() => router.push("/Login")}>
          <Text style={styles.registerText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BackgroundLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: height * 0.08,
  },
  logo: {
    resizeMode: "contain",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: "#3E1911",
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  input: {
    height: height * 0.07,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#494649",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: "#C3E2E5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: height * 0.02,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#3E1911",
    fontSize: width * 0.06,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  successText: {
    color: "green",
    marginBottom: 10,
    fontSize: width * 0.045,
    textAlign: "center",
  },
  registerText: {
    marginTop: height * 0.03,
    color: "#3E1911",
    fontSize: width * 0.05,
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  infoIcon: {
    position: "absolute",
    right: 10,
    top: height * 0.02,
    zIndex: 2,
  },
  bubble: {
    position: "absolute",
    top: height * 0.32,
    right: width * 0.1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2aa0b8",
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 5,
    elevation: 10,
  },
  bubbleText: {
    fontSize: width * 0.035,
    color: "#333",
  },
});

export default Register;
