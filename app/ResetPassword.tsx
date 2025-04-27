import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";
import LoadingMessage from "../reusableComponents/LoadingMessage";

const { width, height } = Dimensions.get("window");

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestType: "PASSWORD_RESET",
              email: email,
            }),
          }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
            "Password Reset",
            "A password reset email has been sent. Please check your inbox.",
            [{ text: "OK", onPress: () => router.push("/Login") }]
        );
      } else {
        const error = data.error?.message || "Something went wrong.";
        setErrorMessage(error.replace(/_/g, " "));
      }
    } catch (err) {
      setErrorMessage("Failed to send reset email. Try again later.");
    }

    setLoading(false);
  };

  return (
      <BackgroundLayout>
        <View style={styles.container}>
          <Text style={styles.title}>Reset Your Password</Text>

          <TextInput
              style={[styles.input, { width: '80%', fontSize: 20, marginBottom: 15, minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {loading ? (
              <LoadingMessage />
          ) : (
              <>
                <CustomButton
                    text="Send Reset Email"
                    functionToExecute={handleResetPassword}
                    uniqueButtonStyling={{ width: '50%', marginTop: 30, minWidth: 230 }}
                />

                <TouchableOpacity onPress={() => router.push(`/Login`)}>
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
    maxWidth: 700,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    margin: 'auto'
  },
  title: {
    fontSize: 33,
    fontWeight: "700",
    color: "#3E1911",
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  cancelText: {
    marginTop: height * 0.03,
    color: "#3E1911",
    fontSize: 20,
    fontWeight: "400",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  input: {
    height: 55,
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
    textAlign: "center",
  },
});

export default ResetPassword;
