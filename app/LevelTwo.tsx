import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import { useEffect, useState } from 'react';
import SoundIcon from '../reusableComponents/SoundIcon';
import { Audio } from 'expo-av';
import { alphabetArray, numbersArray, Number, Letter } from "../GameContent";
import { shuffleArray, getRandomItemsIncludingId } from "../GameFunctions";
import GameComplete from '../reusableComponents/GameComplete';
import SoundPressable from '../reusableComponents/SoundPressable';

export default function LevelTwo() {
    const { game = '[game]' } = useLocalSearchParams(); //for use later

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [randomizedGameQuestions] = useState<Letter[] | Number[]>(shuffleArray(game === 'Alphabet' ? alphabetArray : numbersArray));                                      
    const [options, setOptions] = useState<Letter[] | Number[]>([]);
    const [answerSelected, setAnswerSelected] = useState<string>('');
    const [answerDisplayed, setAnswerDisplayed] = useState<boolean>(false);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const resultText: string = currentQuestion < randomizedGameQuestions.length ? 
                                  answerSelected === randomizedGameQuestions[currentQuestion].id ? 'Great job! Your answer is correct.' : 
                                                                                                   'Good try! Unfortunately, that is incorrect.' 
                               : '';
    const instructionText: string = game === 'Alphabet' ? 'Choose the correct object that matches the letter shown on the left:' :
                                             'Choose the correct number that matches how many objects are shown:';

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
      setOptions(getRandomItemsIncludingId(randomizedGameQuestions, 3, randomizedGameQuestions[currentQuestion].id));
    }, [randomizedGameQuestions]);

    //-----------------------------------------------------------------------
    useEffect(() => {
      if (currentQuestion === randomizedGameQuestions.length) { //game completed
        //update records??
      } else if (currentQuestion !== 0) {
        setOptions(getRandomItemsIncludingId(randomizedGameQuestions, 3, randomizedGameQuestions[currentQuestion].id));
      }
    }, [currentQuestion]);

    //-----------------------------------------------------------------------
    function markAnswer(answerSubmitted: string) {
      setAnswerDisplayed(true);

      if (answerSubmitted === randomizedGameQuestions[currentQuestion].id) {
        setCorrectAnswers((prev) => prev + 1);
        playAudio(require('../assets/Sounds/correctSound.mp3'));
      } else {
        playAudio(require('../assets/Sounds/incorrectSound.mp3'));
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

    //-----------------------------------------------------------------------
    return (
        <BackgroundLayout>
            <View style={styles.container}> 
                {/* =============== Back Button =============== */}
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/LevelChoice?game=${game}`}/>

                {/* =============== Player Card =============== */}
                <CharacterCard bgColor='#C0E3B9' image='hotdog' name='Shiloh' customWidth={0.25}/>

                {/* =============== Game/Level Title =============== */}
                <Text style={styles.headerText}>{game} - Level 2 </Text>

                {/* =============== Progress Bar =============== */}
                <ProgressBar fillPercent={(currentQuestion / randomizedGameQuestions.length) * 100}/>

                {currentQuestion !== randomizedGameQuestions.length ?

                  <View style={{alignItems: 'center', flex: 1, width: '100%', position: 'relative'}}>

                    {/* =============== Top Instruction =============== */}
                    <Text style={styles.headerText}>{answerDisplayed ? resultText : instructionText}</Text>

                    <View style={{flexDirection: 'row'}}>
                        {/* ========================================= LEFT SIDE ============================================ */}
                        {game === 'Alphabet' ?
                          <View style={styles.leftSideContainer}>
                              <SoundPressable soundFile={randomizedGameQuestions[currentQuestion].idAudio} styling={styles.alphaNumLeftImage}>
                                <Image source={randomizedGameQuestions[currentQuestion].idImage} 
                                       style={styles.alphaNumLeftImage} />
                              </SoundPressable>
                              <Text style={styles.alphaNumLeftInstructionText}>Tap letter to hear sound</Text>
                              <SoundIcon size='9%'/>
                          </View>
                          :
                          <View style={styles.leftSideContainer}>
                              <Image source={randomizedGameQuestions[currentQuestion].exampleImage} 
                                     style={styles.alphaNumLeftImage} />
                          </View>
                        }
                        
                        {/* ========================================= RIGHT SIDE (Answer Options) ============================================ */}
                        <View style={styles.rightSideContainer}>
                          {options.map((item: Letter | Number) => (
                            <View key={item.id}> 
                              <OptionCard 
                                customWidth={0.38} 
                                height={140} 
                                image={game === 'Alphabet' ? item.exampleImage : item.idImage} 
                                lowerText={item.writtenWord} 
                                boldFirstLetter={game === 'Alphabet'}
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
    width: '100%',
    alignItems: 'center',
    position: 'relative'
  },
  progressBarImg: {
    width: '80%', 
    height: 25
  },
  leftSideContainer: {
    width: '40%', 
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
    padding: 20,
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
  submitBtnContainer: {
    alignSelf: 'flex-end', 
    marginTop: 'auto', 
  },
  backBtnContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0,
    paddingVertical: 20
  }
});