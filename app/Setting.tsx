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
  const [currentValue, setCurrentValue] = useState(0); // track live dragging value
  const isSliding = useRef(false);
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

  const handleSlidingStart = () => {
    isSliding.current = true;
  };

  const handleValueChange = (value: number) => {
    if (isSliding.current) {
      setCurrentValue(value);
    }
  };

  const handleSlidingComplete = (value: number) => {
    isSliding.current = false;
    setTempVolume(value);
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

          <View style={{maxWidth: 650, alignItems: 'center', width: '100%'}}>
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
                uniqueButtonStyling={{ minWidth: '50%' }}
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
                onSlidingStart={handleSlidingStart}
                onValueChange={handleValueChange} // Use the debounced handler
                onSlidingComplete={handleSlidingComplete}
                minimumTrackTintColor="#3E1911"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#3E1911"
              />

              <Text style={styles.volumeText}>{tempVolume}%</Text>
            </View>

            <CustomButton
              text="Save"
              functionToExecute={handleSaveVolume}
              uniqueButtonStyling={{ minWidth: '40%' }}
            />

            <View style={styles.line} />
          </View>
        </ScrollView>
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
    width: '100%',
    paddingBottom: height * 0.1,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    paddingVertical: 20
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: "bold",
    margin: 25,
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
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "#3E1911",
  },
  label: {
    fontSize: 25,
    color: "#3E1911",
    marginBottom: height * 0.01,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  volumeText: {
    fontSize: 25,
    color: "#3E1911",
    textAlign: "center",
    marginVertical: height * 0.015,
  }
});
