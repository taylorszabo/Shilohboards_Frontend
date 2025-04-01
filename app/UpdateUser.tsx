import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";
import LoadingMessage from "../reusableComponents/LoadingMessage";

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const { width, height } = Dimensions.get("window");

const UpdateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  const router = useRouter();
  const { playerId = "0" } = useLocalSearchParams();

  const handleUpdateUser = async () => {
    setErrorMessage("");

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

      console.log("Update successful!", response.data);
      router.push("/Setting");
    } catch (error) {
      console.error("Update error:", (error as any).response?.data || (error as any).message);
      const firebaseError = (error as any)?.response?.data?.error?.message;

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
          setErrorMessage("Update failed. Please try again.");
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

        <Text style={styles.title}>Update Account Information</Text>

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

        {/* Confirm Password Input WITHOUT Info Icon */}
        <TextInput
          style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {loading ? (
          <LoadingMessage />
        ) : (
          <>
            <CustomButton
              text="Save"
              functionToExecute={handleUpdateUser}
              uniqueButtonStyling={{ width: width * 0.6, height: height * 0.08 }}
            />

            <TouchableOpacity onPress={() => router.push(`/Setting?playerId=${playerId}`)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
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
  title: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: "#3E1911",
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  cancelText: {
    marginTop: height * 0.03,
    color: "#3E1911",
    fontSize: width * 0.05,
    fontWeight: "400",
    textDecorationLine: "underline",
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
  errorText: {
    color: "red",
    marginBottom: 10,
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

export default UpdateUser;
