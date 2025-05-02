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
    maxWidth: '100%',
    maxHeight: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    maxWidth: 2000,
    maxHeight: 1200,
    marginHorizontal: 'auto'
  },
});

export default BackgroundLayout;