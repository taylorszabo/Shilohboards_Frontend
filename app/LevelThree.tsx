import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
import SoundPressable from '../reusableComponents/SoundPressable';
import GameComplete from '../reusableComponents/GameComplete';

export default function LevelThree() {
    const { game = '[game]' } = useLocalSearchParams();

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [randomizedGameQuestions] = useState<Letter[] | Number[]>(shuffleArray(alphabetArray));                                      
    const [options, setOptions] = useState<Letter[] | Number[]>([]);
    const [answerSelected, setAnswerSelected] = useState<string>('');
    const [answerDisplayed, setAnswerDisplayed] = useState<boolean>(false);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const resultText: string = currentQuestion < randomizedGameQuestions.length ? 
                                    answerSelected === randomizedGameQuestions[currentQuestion].id ? 'Great job! Your answer is correct.' : 
                                                                                                    'Good try! Unfortunately, that is incorrect.' 
                                : '';
    const instructionText = 'Choose the correct letter for the sound or beginning of the word:';

    //-----------------------------------------------------------------------
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    //-----------------------------------------------------------------------
    useEffect(() => {
        setOptions(getRandomItemsIncludingId(randomizedGameQuestions, 4, randomizedGameQuestions[currentQuestion].id));
    }, [randomizedGameQuestions]);

    //-----------------------------------------------------------------------
    useEffect(() => {
        if (currentQuestion === randomizedGameQuestions.length) { //game completed
        //update records??
        } else if (currentQuestion !== 0) {
        setOptions(getRandomItemsIncludingId(randomizedGameQuestions, 4, randomizedGameQuestions[currentQuestion].id));
        }
    }, [currentQuestion]);

    //-----------------------------------------------------------------------
    function markAnswer(answerSubmitted: string) {
        setAnswerDisplayed(true);

        if (answerSubmitted === randomizedGameQuestions[currentQuestion].id) {
            setCorrectAnswers((prev) => prev + 1);
            playAudio(require('../assets/correctSound.mp3'));
        } else {
            playAudio(require('../assets/incorrectSound.mp3'));
        }

        //update records??
    }

    //-----------------------------------------------------------------------
    function moveToNextQuestion() {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setAnswerDisplayed(false);
        setAnswerSelected('');
    }

    //-----------------------------------------------------------------------
    async function playAudio(soundFile: any) {
        const { sound } = await Audio.Sound.createAsync(soundFile);
        setSound(sound);
        await sound.playAsync();
    }

    return (
        <BackgroundLayout>
            <View style={styles.container}> 
                {/* =============== Back Button =============== */}
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/LevelChoice?game=${game}`}/>

                {/* =============== Player Card =============== */}
                <CharacterCard bgColor='#C0E3B9' image='hotdog' name='Shiloh' customWidth={0.25}/>

                {/* =============== Game/Level Title =============== */}
                {/* TODO: DELETE ANSWER PART LATER (once sounds correct)!!! */}
                <Text style={styles.headerText}>{game} - Level 3 --- {randomizedGameQuestions[currentQuestion].id}</Text>  

                {/* =============== Progress Bar =============== */}
                <ProgressBar fillPercent={(currentQuestion / randomizedGameQuestions.length) * 100}/>

                {currentQuestion !== randomizedGameQuestions.length ?

                <View style={{alignItems: 'center', flex: 1, width: '100%', position: 'relative'}}>
                    {/* =============== Sound & Word =============== */}
                    <View style={styles.topPortion}>
                        <SoundIcon size='25%'/>
                        <View style={{gap: 10}}>
                            <SoundPressable soundFile={alphabetArray[currentQuestion].idAudio}>
                                <Text style={styles.soundBtn}>Sound</Text>
                            </SoundPressable>
                            <SoundPressable soundFile={alphabetArray[currentQuestion].exampleAudio}>
                                <Text style={styles.soundBtn}>Word</Text>
                            </SoundPressable>
                        </View>
                    </View>

                    {/* =============== Instructions =============== */}
                    <Text style={styles.headerText}>{answerDisplayed ? resultText : instructionText}</Text>

                    {/* =============== Answers to Select =============== */}
                    <View style={styles.answerContainer}>
                        {options.map((item: Letter | Number) => (
                            <View key={item.id}> 
                                <OptionCard 
                                    customWidth={0.38} 
                                    height={140} 
                                    image={item.idImage} 
                                    functionToExecute={() => setAnswerSelected(item.id)}
                                    disabled={answerDisplayed}
                                    selected={item.id === answerSelected}
                                    bgColor={answerDisplayed && item.id === answerSelected ? 
                                        item.id === randomizedGameQuestions[currentQuestion].id ? '#CFFFC0' : '#F69292' 
                                        : 
                                        '#FFF8F0' 
                                    }
                                />
                            </View>
                        ))}
                    </View>
                    
                    {/* =============== Submit Button =============== */}
                    <View style={styles.submitBtnContainer}>
                        {answerDisplayed ?
                            <CustomButton text='Next' functionToExecute={() => moveToNextQuestion()}/>
                            :
                            answerSelected !== '' && <CustomButton text='Submit' functionToExecute={() => markAnswer(answerSelected)}/>
                        }
                    </View>
                </View>
                :
                <GameComplete score={correctAnswers + '/' + randomizedGameQuestions.length} />
                }
            </View>
        </BackgroundLayout>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  backBtnContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    paddingVertical: 20
  },
  soundBtn: {
    backgroundColor: '#FFF8F0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: 'rgba(0, 0, 0, 0.25)', //iOS shadow
    shadowOffset: {
        width: 1,
        height: 4
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,

    elevation: 5, //android shadow
  }
});