import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import LoadingMessage from "../reusableComponents/LoadingMessage";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function Settings() {
  const router = useRouter();
  const [volume, setVolume] = useState(50);
  const [tempVolume, setTempVolume] = useState(50);
  const { playerId = "0" } = useLocalSearchParams();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.push('/Login');
      }
    };
    checkUser();
  }, []);

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

  const handleSliderChange = (value: number) => {
    // Clear the previous timeout if it exists
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to update the state after a delay
    debounceTimeout.current = setTimeout(() => {
      setTempVolume(value);
    }, 100); // Adjust the delay (in milliseconds) as needed
  };

  const handleSaveVolume = async () => {
    await AsyncStorage.setItem("volume", tempVolume.toString());
    setVolume(tempVolume);
    alert("Settings Saved");
  };


  return (
    <BackgroundLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <CustomButton
            image={require("../assets/back.png")}
            uniqueButtonStyling={styles.backButton}
            onPressRoute={`/MainMenu?playerId=${playerId}`}
          />

          <Text style={styles.mainHeader}>Account Settings</Text>

          <CustomButton
              text="User Settings"
              functionToExecute={async () => {
                try {
                  router.replace("/Login?fromSettings=true");
                } catch (err) {
                  console.error("Failed to clear session data:", err);
                  alert("Something went wrong while logging out.");
                }
              }}
              uniqueButtonStyling={{
                width: width * 0.6,
                height: height * 0.08,
              }}
          />

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
              onValueChange={handleSliderChange} // Use the debounced handler
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
