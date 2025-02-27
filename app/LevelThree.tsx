import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundImage';
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import SoundIcon from '../reusableComponents/SoundIcon';

export default function LevelThree() {
    const { game = '[game]' } = useLocalSearchParams(); //for use later
    const instructionText = 'Choose the correct letter of the sound or beginning of the word:';

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
                <Text style={styles.headerText}>{game} - Level 3 </Text>

                {/* =============== Progress Bar =============== */}
                <ProgressBar fillPercent={30}/>

                <View style={styles.topPortion}>
                    <SoundIcon size='25%'/>
                    <View style={{gap: 10}}>
                        <OptionCard upperText='Sound' customWidth={0.3} height={50}/>
                        <OptionCard upperText='Word' customWidth={0.3} height={50}/>
                    </View>
                </View>

                {/* =============== Instructions =============== */}
                <Text style={styles.headerText}>{instructionText}</Text>


                <View style={styles.answerContainer}>
                    <OptionCard customWidth={0.38} height={140} image='moon'/>
                    <OptionCard customWidth={0.38} height={140} image='apple'/>
                    <OptionCard customWidth={0.38} height={140} image='tree'/>
                    <OptionCard customWidth={0.38} height={140} image='tree'/>




                    {/* ========================================= LEFT SIDE ============================================ */}
                    {/* <View style={styles.leftSideContainer}>
                        <Image source={require('../assets/Alphabet/Letters/A.png')} style={styles.alphaNumLeftImage} />
                        <Text style={styles.alphaNumLeftInstructionText}>Tap letter to hear sound</Text>
                        <Image source={require('../assets/listen.png')} style={styles.listenImg} />
                    </View> */}
                    
                    {/* ========================================= RIGHT SIDE ============================================ */}
                    {/* <View style={styles.rightSideContainer}>
                        <OptionCard lowerText='Moon' customWidth={0.38} height={140} onPressRoute='' image='moon'/>
                        <OptionCard lowerText='Apple' customWidth={0.38} height={140} onPressRoute='' image='apple'/>
                        <OptionCard lowerText='Tree' customWidth={0.38} height={140} onPressRoute='' image='tree'/>
                    </View> */}
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
  topPortion: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    gap: 30
  },
  answerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    flexWrap: 'wrap', 
    gap: 15
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3E1911',
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