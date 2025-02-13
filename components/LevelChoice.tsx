import * as React from 'react';
import { Button, ImageBackground, StyleSheet, Text, View, Alert, Pressable } from 'react-native';
import Constants from "expo-constants";
import CharacterCard from './CharacterCard';
import CustomButton from './CustomButton';
import OptionCard from './OptionCard';

type Props = {
    alphabetGame: boolean;
};

export default function LevelChoice(props: Props) {
    const { alphabetGame } = props;

    return (
        <View style={styles.container}> 
            <CharacterCard bgColor='#C0E3B9' imagePath='../assets/Hotdog.png' name='Shiloh' customWidth={0.3} disabled={true}/>
            <Text style={styles.title}>Choose a level for the {alphabetGame ? 'Alphabet' : 'Numbers'} Activity: </Text>
            <View style={{gap: 15}}>
                <OptionCard hasImage={false} upperText='Level 1' lowerText='(Recommended for ages 1-2)' customWidth={0.8} disabled={false}/>
                <OptionCard hasImage={false} upperText='Level 2' lowerText='(Recommended for ages 3-4)' customWidth={0.8} disabled={false}/>
                {alphabetGame &&
                    <OptionCard hasImage={false} upperText='Level 3' lowerText='(Recommended for ages 5-6)' customWidth={0.8} disabled={false}/>
                }
                
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