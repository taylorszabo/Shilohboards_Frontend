import * as React from 'react';
import {  ImageBackground, StyleSheet } from 'react-native';
import Character from '../components/Character';
import MainMenu from '../components/MainMenu';
import LevelChoice from '../components/LevelChoice';
import LevelTwo from '../components/LevelTwo';

export default function Main() {
  // const navigation = useNavigation();

  return (
      <ImageBackground source={require('../assets/woodBackground.jpg')} resizeMode="cover" style={styles.container}> 
          <Character />
          {/* <MainMenu playerName='Shiloh' /> */}
          {/* <LevelChoice alphabetGame={true} /> */}
          {/* <LevelTwo alphabetGame={true}/> */}
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});





//--------------------------------------------------------------------------------------------
// style={styles.image}
// <Text style={styles.red}>Open up App.tsx to start working on your app! hiboo</Text>
//         <Button onPress={() => navigation.navigate('Details')}> Go to Next Screen </Button>
//         <StatusBar style="auto" />


// import { Button } from '@react-navigation/elements';
// import {
//   createStaticNavigation,
//   useNavigation,
// } from '@react-navigation/native';

  // const navigation = useNavigation();


  //import { StatusBar } from 'expo-status-bar';