import * as React from 'react';
import { Button, ImageBackground, StyleSheet, Text, View, Alert, Pressable } from 'react-native';
import Constants from "expo-constants";
import CharacterCard from './CharacterCard';
import CustomButton from './CustomButton';

export default function Character() {

  return (
    <View style={styles.container}> 
        <Text style={styles.title}>Select Your Character: </Text>
        <View style={styles.grid}>
          <CharacterCard bgColor='#C0E3B9' imagePath='../assets/Hotdog.png' name='Shiloh' customWidth={0.4} disabled={true}/>
          <CharacterCard bgColor='#FFDDF6' imagePath='../assets/Hotdog.png' name='Jessica' customWidth={0.4} disabled={true}/>
          <CharacterCard bgColor='#FFD195' imagePath='../assets/Hotdog.png' name='Mina' customWidth={0.4} disabled={true}/>
        </View>
        <CustomButton text='Create New Character'/>
    </View>
  );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    alignItems: 'center',
  },
  title: {
    padding: 30,
    verticalAlign: 'middle',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    color: '#3E1911',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingBottom: 50,
    gap: 10,
  }
});


/*
{'\n'}


    alignItems: 'center',
    justifyContent: 'center',
 style={styles.title}


         {/* <Pressable style={styles.card} onPress={() => alert('Btn Pressed')}></Pressable> }
        {/* <Button onPress={() => Alert.alert('Simple Button pressed')} title='hi' style={{backgroundColor: 'red', flex: 0.3}}/> }
*/