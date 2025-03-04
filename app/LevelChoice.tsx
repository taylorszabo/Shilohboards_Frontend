import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams } from 'expo-router';
import CustomButton from '../reusableComponents/CustomButton';

export default function LevelChoice() {
    const { game = '[game]' } = useLocalSearchParams();

    return (
      <BackgroundLayout>
        <View style={styles.container}> 
            <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute='/MainMenu?playerName=Shiloh'/>
            <CharacterCard bgColor='#C0E3B9' image='hotdog' name='Shiloh' customWidth={0.3}/>
            <Text style={styles.headerText}>Choose a level for the {game} Activity: </Text>
            <View style={styles.cardDiv}>
                <OptionCard upperText='Level 1' lowerText='(Recommended for ages 1-2)' customWidth={0.8} onPressRoute='/LevelOne'/>
                <OptionCard upperText='Level 2' lowerText='(Recommended for ages 3-4)' customWidth={0.8} onPressRoute={`/LevelTwo?game=${game}`} />
                {game === 'Alphabet' &&
                    <OptionCard upperText='Level 3' lowerText='(Recommended for ages 5-6)' customWidth={0.8} onPressRoute={`/LevelThree?game=${game}`}/>
                }
            </View>
        </View>
      </BackgroundLayout>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#3E1911',
  },
  cardDiv: {
    gap: 15
  },
  backBtnContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    paddingVertical: 20
  }
});