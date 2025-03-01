import React, { useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Audio } from 'expo-av';

type SoundPressableProps = {
  soundFile: any;
  children: React.ReactNode;
  //optional
  styling?: StyleProp<ViewStyle>;
};

export default function SoundPressable({ soundFile, styling, children }: SoundPressableProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  //---------------------------------
  async function playSound() {
    if (sound) {
      await sound.unloadAsync(); //ensure previous sound is unloaded
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);

    await newSound.playAsync();
  }

  //---------------------------------
  return (
    <Pressable onPress={playSound} style={styling}>
      {children}
    </Pressable>
  );
}