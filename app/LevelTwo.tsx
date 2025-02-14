import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundImage';
import { useLocalSearchParams } from 'expo-router';

export default function LevelTwo() {
    const { game = '[game]' } = useLocalSearchParams(); //for use later

    return (
        <BackgroundLayout>
            <View style={styles.container}> 
                {/* =============== Back Button =============== */}
                <View style={styles.backBtnContainer}>
                    <CustomButton text='<'/>
                </View>

                {/* =============== Player Card =============== */}
                <CharacterCard bgColor='#C0E3B9' image='hotdog' name='Shiloh' customWidth={0.25}/>

                {/* =============== Game/Level Title =============== */}
                <Text style={styles.headerText}>Alphabet - Level 2 </Text>

                {/* =============== Progress Bar =============== */}
                <Image
                    source={require('../assets/fakeProgressBar.png')}
                    style={styles.progressBarImg}
                />

                {/* =============== Top Instruction =============== */}
                <Text style={styles.headerText}>Choose the correct picture and word for the letter shown: </Text>


                <View style={{flexDirection: 'row'}}>
                    {/* ========================================= LEFT SIDE ============================================ */}
                    <View style={styles.leftSideContainer}>
                        <Image source={require('../assets/Atest.png')} style={styles.alphaNumLeftImage} />
                        <Text style={styles.alphaNumLeftInstructionText}>Tap letter to hear sound</Text>
                        <Image source={require('../assets/listen.png')} style={styles.listenImg} />
                    </View>
                    
                    {/* ========================================= RIGHT SIDE ============================================ */}
                    <View style={styles.rightSideContainer}>
                        <OptionCard lowerText='Moon' customWidth={0.38} height={140} onPressRoute='' image='moon'/>
                        <OptionCard lowerText='Apple' customWidth={0.38} height={140} onPressRoute='' image='apple'/>
                        <OptionCard lowerText='Tree' customWidth={0.38} height={140} onPressRoute='' image='tree'/>
                    </View>
                </View>
                
                {/* =============== Submit Button =============== */}
                <View style={styles.submitBtnContainer}>
                    <CustomButton text='Submit'/>
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
    position: 'relative'
  },
  progressBarImg: {
    width: '80%', 
    height: 25
  },
  leftSideContainer: {
    width: '35%', 
    maxHeight: '100%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingRight: 25
  },
  rightSideContainer: {
    gap: 15
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3E1911',
  },
  alphaNumLeftImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain' 
  },
  alphaNumLeftInstructionText: {
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 18, 
    paddingVertical: 10, 
    color: '#3E1911'
  },
  listenImg: {
    width: '25%', 
    height: 25, 
    resizeMode: 'contain'
  },
  submitBtnContainer: {
    alignSelf: 'flex-end', 
    marginTop: 'auto', 
    padding: 10
  },
  backBtnContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    paddingLeft: 10
  }
});





//for use later maybe: source={lowerText === 'Alphabet' ? require('../assets/A.png') : require('../assets/1.png')}