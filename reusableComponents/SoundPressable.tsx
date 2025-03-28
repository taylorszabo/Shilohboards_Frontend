import React, { useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SoundPressableProps = {
  soundFile: any;
  children: React.ReactNode;
  //optional
  styling?: StyleProp<ViewStyle>;
};

export default function SoundPressable({ soundFile, styling, children }: SoundPressableProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  //---------------------------------
  // Configure audio mode for mobile
  async function configureAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true, // Allows playback even if the device is in silent mode (iOS)
        staysActiveInBackground: true, // Keeps audio active in the background (Android)
        //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true, // Lowers the volume of other apps when playing audio
        playThroughEarpieceAndroid: false, // Ensures audio is routed through the speaker
      });
      console.log("Audio mode configured successfully.");
    } catch (error) {
      console.error("Error configuring audio mode:", error);
    }
  }

  //---------------------------------
  async function playSound() {
    try {
      // Configure audio mode before playing sound
      await configureAudioMode();

      // Unload previous sound before playing new sound
      if (sound) {
        await sound.unloadAsync();
        setSound(null); // Clear previous sound instance
      }

      // Create new sound object
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);

      // Get saved volume from AsyncStorage
      const savedVolume = await AsyncStorage.getItem("volume");
      const volumeLevel = savedVolume ? parseFloat(savedVolume) / 100 : 1.0; // Default to 1.0

      console.log(`Loaded Volume: ${savedVolume}`);
      console.log(`Applying Volume: ${volumeLevel}`);

      // Apply volume to new sound
      await newSound.setVolumeAsync(volumeLevel);

      // Play sound
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  //---------------------------------
  return (
    <Pressable onPress={playSound} style={styling}>
      {children}
    </Pressable>
  );
}
