import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function Settings() {
  const router = useRouter();
   // State for storing and temporarily changing volume
  const [volume, setVolume] = useState(50);
  const [tempVolume, setTempVolume] = useState(50);

    // Load the stored volume 
  useEffect(() => {
    const loadVolume = async () => {
      const savedVolume = await AsyncStorage.getItem("volume");
      if (savedVolume) {
        setVolume(Number(savedVolume));
        setTempVolume(Number(savedVolume));
      }
    };
    loadVolume();
  }, []);
 // Save the current volume to AsyncStorage
  const handleSaveVolume = async () => {
    await AsyncStorage.setItem("volume", tempVolume.toString());
    setVolume(tempVolume);
    alert("Volume settings saved!");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const parentId = await AsyncStorage.getItem("userId");
      if (!parentId) {
        alert("Parent ID not found.");
        return;
      }

      await axios.delete(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/parent/${parentId}`);

      await AsyncStorage.clear();
      alert("Your account has been deleted.");
      router.replace("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <BackgroundLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CustomButton
  image={require("../assets/back.png")}
  uniqueButtonStyling={styles.backButton}
  functionToExecute={async () => {
    const playerId = await AsyncStorage.getItem("selectedPlayerId"); 
    if (playerId) {
      router.replace(`/MainMenu?playerId=${playerId}`);
    } else {
      router.replace("/MainMenu");
    }
  }}
/>


          <Text style={styles.mainHeader}>Account Settings</Text>

          <View style={styles.topButtonContainer}>
            <CustomButton
              text="User Settings"
              functionToExecute={() => router.push("/UpdateUser")}
              uniqueButtonStyling={{ width: width * 0.6, height: height * 0.08 }}
            />
          </View>

          <View style={styles.line} />

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
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <View style={styles.buttonRow}>
            <CustomButton
              text="Delete"
              functionToExecute={handleDeleteAccount}
              uniqueButtonStyling={{
                width: width * 0.4,
                backgroundColor: "#FF4C4C",
                marginRight: 10,
              }}
            />
            <CustomButton
              text="Save"
              functionToExecute={handleSaveVolume}
              uniqueButtonStyling={{ width: width * 0.4 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingBottom: height * 0.1,
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
    marginTop: height * 0.09,
    marginBottom: height * 0.03,
    color: "#3E1911",
  },
  topButtonContainer: {
    marginBottom: height * 0.03,
    alignItems: "center",
  },
  section: {
    width: "90%",
    marginTop: height * 0.025,
    marginBottom: height * 0.015,
  },
  line: {
    height: 1,
    backgroundColor: "#3E1911",
    width: "90%",
    marginVertical: height * 0.025,
  },
  sectionHeader: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "#3E1911",
  },
  label: {
    fontSize: width * 0.05,
    color: "#3E1911",
    marginBottom: height * 0.01,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  volumeText: {
    fontSize: width * 0.05,
    color: "#3E1911",
    textAlign: "center",
    marginVertical: height * 0.015,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: height * 0.035,
    width: "100%",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});