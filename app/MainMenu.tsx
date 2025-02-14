import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundImage';
import { useLocalSearchParams } from 'expo-router';

export default function MainMenu() {
    const { playerName = '[name]' } = useLocalSearchParams();

    return (
      <BackgroundLayout>
        <View style={styles.container}> 
            <View style={styles.hamburgerMenuContainer}>
                <CustomButton text='Menu'/>
            </View>
            <CharacterCard bgColor='#C0E3B9' image='hotdog' name='Shiloh' customWidth={0.3}/>
            <Text style={styles.headerText}>Welcome {playerName}! Which game would you like to play? </Text>
            <View style={styles.cardDiv}>
                <OptionCard lowerText='Alphabet' customWidth={0.8} height={160} onPressRoute='/LevelChoice?game=Alphabet' image='alpha'/>
                <OptionCard lowerText='Numbers' customWidth={0.8} height={160} onPressRoute='/LevelChoice?game=Numbers' image='num'/>
            </View>
        </View>
      </BackgroundLayout>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
  hamburgerMenuContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    paddingLeft: 10
  }
});