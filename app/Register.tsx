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
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import LoadingMessage from "../reusableComponents/LoadingMessage";
import CustomButton from "../reusableComponents/CustomButton";
//import { ScrollView } from "react-native-gesture-handler";

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
    setErrorMessage("");
    setSuccessMessage(""); // Clear success message on new attempt

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6 || !/\d/.test(password)) {
      setErrorMessage("Password must be at least 6 characters long and contain at least one number.");
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
          setErrorMessage("Password must be at least 6 characters long and contain at least one number.");
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

        <View style={{width: '75%', height: '25%', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require("../assets/logo.png")}
            style={[styles.logo]}
          />
        </View>

        <Text style={styles.title}>Register New Account</Text>

        <TextInput
          style={[styles.input, { width: '80%', fontSize: 20, marginBottom: 15, minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input with Info Icon */}
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
            <Text style={{ fontSize: 18, marginVertical: 'auto' }}>ℹ️</Text>
          </TouchableOpacity>

          {/* Password info bubble */}
          {showPasswordInfo && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>• Password must be at least 6 characters.</Text>
              <Text style={styles.bubbleText}>• Must contain at least 1 number</Text>
            </View>
          )}
        </View>

        {/* Confirm Password Input without Info Icon */}
        <TextInput
          style={[styles.input, { width: '80%', fontSize: 20, marginTop: 15, minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}
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
            uniqueButtonStyling={{ width: '55%', marginTop: 30, minWidth: 200 }}
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
    maxWidth: 700,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    margin: 'auto',
    width: '100%'
  },
  logo: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
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
    shadowRadius: 4,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  successText: {
    color: "green",
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
  },
  registerText: {
    marginTop: 20,
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
    transform: [{ translateY: -90 }],
    right: 0,
    left: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2aa0b8",
    zIndex: 5,
  },
  bubbleText: {
    fontSize: 14,
    color: "#333",
  },
});

export default Register;
