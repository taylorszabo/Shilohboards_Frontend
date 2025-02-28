import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundImage';
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import SoundIcon from '../reusableComponents/SoundIcon';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { alphabetArray, numbersArray, Number, Letter } from "../GameContent";
import { shuffleArray, getRandomItemsIncludingId } from "../GameFunctions";

export default function LevelThree() {
    const { game = '[game]' } = useLocalSearchParams();

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const randomizedGameQuestions: Letter[] | Number[] = shuffleArray(game === 'Alphabet' ? alphabetArray : numbersArray);
    const instructionText = 'Choose the correct letter of the sound or beginning of the word:';
    let options: Letter[] | Number[] = currentQuestion !== randomizedGameQuestions.length ? getRandomItemsIncludingId(randomizedGameQuestions, 4, randomizedGameQuestions[currentQuestion].id) : [];

    async function playAudio(soundFile: any) {
        const { sound } = await Audio.Sound.createAsync(soundFile);
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useEffect(() => {

        console.log('-----------------------------' + randomizedGameQuestions.length);
        randomizedGameQuestions.forEach(element => {
            console.log(element.id);
        });
    }, []);

    function moveToNextQuestion() {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }

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
                {/* TODO: DELETE ANSWER PART LATER!!! */}
                <Text style={styles.headerText}>{game} - Level 3 --- {randomizedGameQuestions[currentQuestion].id}</Text>  

                {/* =============== Progress Bar =============== */}
                <ProgressBar fillPercent={(currentQuestion / randomizedGameQuestions.length) * 100}/>

                {/* =============== Sound & Word =============== */}
                <View style={styles.topPortion}>
                    <SoundIcon size='25%'/>
                    <View style={{gap: 10}}>
                        <OptionCard upperText='Sound' customWidth={0.3} height={50} functionToExecute={() => playAudio(alphabetArray[0].idAudio)}/>
                        <OptionCard upperText='Word' customWidth={0.3} height={50} functionToExecute={() => playAudio(alphabetArray[0].exampleAudio)}/>
                    </View>
                </View>

                {/* =============== Instructions =============== */}
                <Text style={styles.headerText}>{instructionText}</Text>

                {/* =============== Answers to Select =============== */}
                <View style={styles.answerContainer}>
                    {options.map((item: Letter | Number) => (
                        <View key={item.id}> 
                            <OptionCard 
                                customWidth={0.38} 
                                height={140} 
                                image={item.idImage} 
                                functionToExecute={() => moveToNextQuestion()}
                            />
                        </View>
                    ))}
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