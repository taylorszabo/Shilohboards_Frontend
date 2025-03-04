import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import { useRouter } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';

export default function SelectCharacter() {
  const router = useRouter();

  return (
    <BackgroundLayout>
      <View style={styles.container}> 
          <Text style={styles.headerText}>Select Your Character: </Text>
          <View style={styles.grid}>
            <CharacterCard bgColor='#C0E3B9' image='hotdog' name='Shiloh' customWidth={0.4} disabled={false} onPressRoute='/MainMenu?playerName=Shiloh'/>
            <CharacterCard bgColor='#FFDDF6' image='flower' name='Jessica' customWidth={0.4} />
            <CharacterCard bgColor='#FFD195' image='penguin' name='Mina' customWidth={0.4} />
          </View>
          <View style={styles.createNewBtnContainer}>
            <CustomButton text='Create New Character'/>
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
  },
  createNewBtnContainer: {
    marginTop: 'auto',
    marginBottom: 60
  }
});