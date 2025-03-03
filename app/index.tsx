import * as React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import Login from './Login';

//starting entry point on app load
export default function index() {

  return (
    <ImageBackground source={require('../assets/woodBackground.jpg')} resizeMode="cover" style={styles.container}> 
        <Login />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});