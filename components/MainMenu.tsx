import * as React from 'react';
import { Button, ImageBackground, StyleSheet, Text, View, Alert, Pressable } from 'react-native';
import Constants from "expo-constants";
import CharacterCard from './CharacterCard';
import CustomButton from './CustomButton';
import OptionCard from './OptionCard';

type Props = {
    playerName: string;
};

export default function MainMenu(props: Props) {
    const { playerName } = props;

    return (
        <View style={styles.container}> 
            <CharacterCard bgColor='#C0E3B9' imagePath='../assets/Hotdog.png' name='Shiloh' customWidth={0.3} disabled={true}/>
            <Text style={styles.title}>Welcome {playerName}! Which game would you like to play? </Text>
            <View style={{gap: 15}}>
                <OptionCard hasImage={true} lowerText='Alphabet' customWidth={0.8} disabled={false} height={160}/>
                <OptionCard hasImage={true} lowerText='Numbers' customWidth={0.8} disabled={false} height={160}/>
            </View>
        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 10,
    alignItems: 'center',
  },
  title: {
    verticalAlign: 'middle',
    padding: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#3E1911',
  },
});



/*
style={styles.grid}
*/