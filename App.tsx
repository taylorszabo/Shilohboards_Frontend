import * as React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/Main';
import Main from './components/Main';
import MainMenu from './components/MainMenu';
import Character from './components/Character';
import LevelChoice from './components/LevelChoice';
import LevelTwo from './components/LevelTwo';

const Stack = createStackNavigator();

export default function App() {


  return (
    <ImageBackground source={require('./assets/woodBackground.jpg')} resizeMode="cover" style={styles.container}> 
        {/* <Character /> */}
        {/* <MainMenu playerName='Shiloh' /> */}
        {/* <LevelChoice alphabetGame={true} /> */}
        <LevelTwo alphabetGame={true}/>
    </ImageBackground>



    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Main">
    //     <Stack.Screen name="Main" component={Main} />
    //     <Stack.Screen name="Menu" component={MainMenu} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

