import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import axios, {AxiosError} from "axios";

const { width, height } = Dimensions.get("window");

// Firebase API Key and Endpoints
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_GET_USER_URL = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`
const FIREBASE_UPDATE_PASSWORD = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`

export default function Settings() {
  const router = useRouter();

  // State variables for account settings
  const [email, setEmail] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

  // Sound settings state
  const [volume, setVolume] = useState(50);
  const [tempVolume, setTempVolume] = useState(50); 
  const [volumeSaved, setVolumeSaved] = useState(false); 

  //Accessibility settings state
  const [colourBlindMode, setColourBlindMode] = useState(true); // Controls Colour Blind Mode

  const refreshAuthToken = async (refreshToken: string | null) => {
    try {
      console.log("Refreshing authentication token...");

      const response = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }
      );

      const newAuthToken = response.data.id_token;
      const newRefreshToken = response.data.refresh_token;

      await AsyncStorage.setItem("authToken", newAuthToken);
      await AsyncStorage.setItem("refreshToken", newRefreshToken);

      console.log("Auth token refreshed successfully.");
      return newAuthToken;
    } catch (error) {
      console.error("Error refreshing auth token:", error);
      return null;
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        let authToken = await AsyncStorage.getItem("authToken");
        let refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!authToken) {
          console.warn("No authentication token found. Attempting to refresh...");

          if (refreshToken) {
            authToken = await refreshAuthToken(refreshToken);
            if (!authToken) {
              setLoading(false);
              return;
            }
          } else {
            setLoading(false);
            return;
          }
        }

        console.log("Fetching user email from Firebase...");

        try {
          const response = await axios.post(FIREBASE_GET_USER_URL, {
            idToken: authToken,
          });

          const userEmail = response.data.users[0].email;
          setEmail(userEmail);
          console.log("User email retrieved:", userEmail);
        } catch (error :unknown) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.status === 400) {
            console.warn("Auth token expired. Refreshing token...");

            authToken = await refreshAuthToken(refreshToken);

            if (authToken) {
              console.log("Retrying fetch with new token...");
              const retryResponse = await axios.post(
                  FIREBASE_GET_USER_URL,
                  { idToken: authToken }
              );

              // Extract user email
              const userEmail = retryResponse.data.users[0].email;
              setEmail(userEmail);
              console.log("User email retrieved after token refresh:", userEmail);
            } else {
              console.error("Failed to refresh auth token.");
            }
          } else {
            console.error("Error fetching user data:", error);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  const handleSaveAllSettings = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        console.warn("No authentication token found.");
        return;
      }

      const response = await axios.post(FIREBASE_UPDATE_PASSWORD, {
        idToken: authToken, 
        password: newPassword, 
        returnSecureToken: true, 
      });

      console.log("Password updated successfully.");

      //Store the new authentication token after password updates
      await AsyncStorage.setItem("authToken", response.data.idToken);

      //Clear password field and notify user of save
      setNewPassword("");
      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  //navigate back to the LevelChoice screen
  const goBack = () => {
    router.replace("/LevelChoice");
  };

  return (
    <BackgroundLayout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <CustomButton
          image={require("../assets/back.png")}
          uniqueButtonStyling={styles.backButton}
          onPressRoute="/LevelChoice"
        />

        <Text style={styles.mainHeader}>Settings</Text>

        {/* Account Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>

       
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textBox}
            value={email}
            onChangeText={setEmail} 
            editable={true}
            placeholderTextColor="#555"
            keyboardType="email-address"
          />

          {/* Password Update Field */}
          <Text style={styles.label}>Update Password</Text>
          <TextInput
            style={styles.textBox}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#555"
            secureTextEntry={!isPasswordVisible}
          />

          {/* Toggle Password Visibility */}
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Text style={styles.toggleText}>
              {isPasswordVisible ? "Hide Password" : "Show Password"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        {/* Sound Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sound</Text>
          <Text style={styles.label}>Volume</Text>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={tempVolume}
            onValueChange={setTempVolume}
            minimumTrackTintColor="#3E1911"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#3E1911"
          />

          <Text style={styles.volumeText}>{tempVolume}%</Text>
        </View>

        <View style={styles.line} />

        {/* Accessibility Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Accessibility</Text>

          {/* Colour Blind Mode Toggle */}
          <Text style={styles.label}>Colour Blind Mode</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={styles.radioGroup}
              onPress={() => setColourBlindMode(true)}
            >
              <Text style={styles.optionText}>ON</Text>
              <View style={colourBlindMode ? styles.radioSelected : styles.radio} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioGroup}
              onPress={() => setColourBlindMode(false)}
            >
              <Text style={styles.optionText}>OFF</Text>
              <View style={!colourBlindMode ? styles.radioSelected : styles.radio} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.line} />

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            text="Save"
            functionToExecute={handleSaveAllSettings} 
            uniqueButtonStyling={styles.button}
          />
        </View>
      </ScrollView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: width * -1,
  },
  backButton: {
    position: "absolute",
    top: height * 0.02,
    left: width * 0.05,
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: "#C3E2E5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  mainHeader: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginVertical: height * 0.02,
    color: "#3E1911",
  },
  section: {
    width: "90%",
    marginVertical: height * 0.02,
  },
  line: {
    height: 1,
    backgroundColor: "#3E1911",
    width: "90%",
    marginVertical: height * 0.02,
  },
  label: {
    fontSize: width * 0.05,
    color: "#3E1911",
    marginBottom: height * 0.01,
  },
  textBox: {
    width: "100%",
    padding: height * 0.015,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: height * 0.02,
    color: "#3E1911",
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "#3E1911",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  button: {
    width: width * 0.5,
    backgroundColor: "#C3E2E5",
    borderRadius: 8,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  radio: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    borderWidth: 1,
    borderColor: "#3E1911",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    backgroundColor: "#3E1911",
  },
  optionText: {
    fontSize: width * 0.05,
    color: "#3E1911",
    marginRight: width * 0.02,
  },
  toggleText: {
    color: "#3E1911",
    fontSize: width * 0.04,
    textDecorationLine: "underline",
    marginVertical: height * 0.01,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  volumeText: {
    fontSize: width * 0.05,
    color: "#3E1911",
    textAlign: "center",
    marginVertical: height * 0.01,
  },
  savedLabel: {
    fontSize: width * 0.05,
    color: "#3E1911",
    textAlign: "center",
    marginVertical: height * 0.02,
  },
});

