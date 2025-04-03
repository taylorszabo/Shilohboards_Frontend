import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const BackgroundLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <ImageBackground
      source={require('../assets/largerWoodBg3.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
});

export default BackgroundLayout;