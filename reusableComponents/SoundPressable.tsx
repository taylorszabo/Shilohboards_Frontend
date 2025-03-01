import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

type SoundPressableProps = {
  soundFile: any;
  children: React.ReactNode;
};

export default function SoundPressable({ soundFile, children }: SoundPressableProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    if (sound) {
      await sound.unloadAsync(); //ensure previous sound is unloaded
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);

    await newSound.playAsync();
  }

  return (
    <Pressable onPress={playSound}>
      {children}
    </Pressable>
  );
}

// const styles = StyleSheet.create({
//   button: {
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#ddd',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//});
//style={styles.button}