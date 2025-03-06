import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import { useRouter } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { tempCharacterArray } from "../CharacterOptions";

export default function SelectCharacter() {
  const router = useRouter();

  console.log(tempCharacterArray); 

  return (
    <BackgroundLayout>
      <View style={styles.container}> 
          <Text style={styles.headerText}>Select Your Character: </Text>
          <View style={styles.grid}>
            {[...tempCharacterArray].map((user, index) => (
              <View key={user.id}>
                <CharacterCard id={user.id} customWidth={0.4} disabled={false} onPressRoute={`/MainMenu?playerId=${user.id}`} customCardStyling={{marginTop: 0}}/>
              </View>
            ))}
          </View>

          <CustomButton text='Create New Character' uniqueButtonStyling={styles.createNewBtnContainer} onPressRoute={`/CharacterCreation?isNewOrUpdateId=New`} />
          
      </View>
    </BackgroundLayout>
  );
}

// ================================== STYLING ==================================style={{width: '100%'}}                <Text>{user.name},{user.picture},{user.bgColor}</Text>
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
    alignSelf: 'flex-end'
  }
});