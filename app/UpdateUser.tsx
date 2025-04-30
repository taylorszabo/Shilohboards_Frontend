import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";
import LoadingMessage from "../reusableComponents/LoadingMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_LOOKUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`;
const FIREBASE_UPDATE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;
const FIREBASE_REFRESH_URL = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;

const UpdateUser = () => {
  const router = useRouter();
  const { playerId = "0" } = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.push('/Login');
      }
    };
    checkUser();
  }, []);

  const fetchUserEmail = async () => {
    try {
      let authToken = await AsyncStorage.getItem("authToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!authToken && refreshToken) {
        const refreshResponse = await axios.post(FIREBASE_REFRESH_URL, {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        });
        authToken = refreshResponse.data.id_token;
        if (authToken) {
          await AsyncStorage.setItem("authToken", authToken);
        }
        await AsyncStorage.setItem("refreshToken", refreshResponse.data.refresh_token);
      }

      const lookupResponse = await axios.post(FIREBASE_LOOKUP_URL, {
        idToken: authToken,
      });

      const userEmail = lookupResponse.data.users[0].email;
      setEmail(userEmail);
    } catch (error) {
      console.error("Failed to fetch user email:", error);
      setErrorMessage("Failed to load user information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const handleUpdateUser = async () => {
    setErrorMessage("");

    if (!email.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const authToken = await AsyncStorage.getItem("authToken");
      const updatePayload: any = {
        idToken: authToken,
        returnSecureToken: true,
      };

      if (email) updatePayload.email = email;
      if (newPassword) updatePayload.password = newPassword;

      const updateResponse = await axios.post(FIREBASE_UPDATE_URL, updatePayload);

      await AsyncStorage.setItem("authToken", updateResponse.data.idToken);
      await AsyncStorage.setItem("refreshToken", updateResponse.data.refreshToken);

      alert("Account information updated!");
      await AsyncStorage.clear();
      router.replace("/Login");
    } catch (error: any) {
      const code = error?.response?.data?.error?.message;
      switch (code) {
        case "EMAIL_EXISTS":
          setErrorMessage("This email is already in use.");
          break;
        case "INVALID_ID_TOKEN":
          setErrorMessage("Your session expired. Please log in again.");
          break;
        default:
          setErrorMessage("Update failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteAccount = async () => {
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const idToken = await AsyncStorage.getItem("authToken");
                if (!idToken) {
                  alert("You are not authenticated.");
                  return;
                }

                const response = await fetch(
                    `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.EXPO_PUBLIC_FIREBASE_API_KEY}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ idToken }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                  if (data.error?.message === "TOKEN_EXPIRED" || data.error?.message === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN") {
                    alert("Please sign in again before deleting your account.");
                    return;
                  } else {
                    console.error("Delete error:", data);
                    alert("Failed to delete account.");
                    return;
                  }
                }

                await AsyncStorage.clear();
                alert("Account deleted.");
                router.replace("/Login");

              } catch (err) {
                console.error("Unexpected error:", err);
                alert("An error occurred. Please try again.");
              }
            },
          },
        ]
    );
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

        

        <Text style={styles.title}>Update Password</Text>

        <TextInput
          style={[styles.input, { width: '80%', fontSize: 20, marginBottom: 15, minWidth: '80%', maxWidth: '80%', backgroundColor: "#e6e6e6", color: "#555555" }, width > 800 && {minWidth: 450 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
        />

        {/* Password Input with Info Icon */}
        <View style={[{ width: '80%', position: "relative", justifyContent: "center", alignItems: 'center', minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}>
          <TextInput
            style={[styles.input, { fontSize: 20, width: '100%', minWidth: '100%', maxWidth: '100%' }]}
            placeholder="Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setShowPasswordInfo(prev => !prev)}
          >
            <Text style={{ fontSize: 18 }}>ℹ️</Text>
          </TouchableOpacity>

          {/* Password info bubble */}
          {showPasswordInfo && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>• Password must be at least 6 characters.</Text>
              <Text style={styles.bubbleText}>• Must contain at least 1 number</Text>
            </View>
          )}
        </View>

        {/* Confirm Password Input WITHOUT Info Icon */}
        <TextInput
          style={[styles.input, { width: '80%', fontSize: 20, marginTop: 15, minWidth: '80%', maxWidth: '80%' }, width > 800 && {minWidth: 450 }]}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {loading ? (
          <LoadingMessage smallVersion={true} oneRow={true}/>
        ) : (
          <>
            <CustomButton
              text="Save"
              functionToExecute={handleUpdateUser}
              uniqueButtonStyling={{ width: '55%', marginTop: 30, minWidth: 200 }}
            />

            <TouchableOpacity onPress={() => router.push(`/SelectCharacter`)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <CustomButton
                text="Delete Account"
                image={require('../assets/Icons/delete.png')}
                uniqueImageStyling={{height: 30, width: 30, resizeMode: 'contain'}}
                functionToExecute={handleDeleteAccount}
                uniqueButtonStyling={{ width: '55%', marginTop: 'auto', minWidth: 230, backgroundColor: "#ED5454", flexDirection: 'row-reverse',}}
            />
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
    minWidth: 350,
    justifyContent: "center",
    alignItems: "center",
    margin: 'auto',
    marginTop: height * 0.1,
    width: '100%'
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#3E1911",
    marginBottom: 25,
    textAlign: "center",
  },
  textCSS: {
    paddingVertical: 10,
    fontSize: 24,
    color: '#3E1911',
    textAlign: 'center',
  },
  cancelText: {
    marginTop: height * 0.03,
    color: "#3E1911",
    fontSize: 18,
    fontWeight: "400",
    textDecorationLine: "underline",
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
    color: "#3E1911",
  },
});

export default UpdateUser;
