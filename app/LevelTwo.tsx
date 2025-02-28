import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import { useEffect, useState } from 'react';
import SoundIcon from '../reusableComponents/SoundIcon';
import { alphabetArray, numbersArray, Number, Letter } from "../GameContent";
import { shuffleArray, getRandomItemsIncludingId } from "../GameFunctions";
import GameComplete from '../reusableComponents/GameComplete';

export default function LevelTwo() {
    const { game = '[game]' } = useLocalSearchParams(); //for use later
    const router = useRouter();

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answerDisplayed, setAnswerDisplayed] = useState<boolean>(false);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);

    const randomizedGameQuestions: Letter[] | Number[] = shuffleArray(game === 'Alphabet' ? alphabetArray : numbersArray);
    const resultText: string = 'Green = Correct, Red = Incorrect';
    const instructionText = game === 'Alphabet' ? 'Choose the correct object that matches the letter shown:' :
                                                  'Choose the correct number that matches how many objects are shown:';

    let options: Letter[] | Number[] = currentQuestion !== randomizedGameQuestions.length ? getRandomItemsIncludingId(randomizedGameQuestions, 3, randomizedGameQuestions[currentQuestion].id) : [];

    useEffect(() => {
      //game completed
      if (currentQuestion === randomizedGameQuestions.length) {
        //update records??
      }
    }, [currentQuestion]);

    function markAnswer() {
      setAnswerDisplayed(true);
      //update records??
    }

    function moveToNextQuestion() {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setAnswerDisplayed(false);
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
                <Text style={styles.headerText}>{game} - Level 2 </Text>

                {/* =============== Progress Bar =============== */}
                <ProgressBar fillPercent={(currentQuestion / randomizedGameQuestions.length) * 100}/>

                {currentQuestion !== randomizedGameQuestions.length ?

                  <View style={{alignItems: 'center', flex: 1, width: '100%', position: 'relative'}}>

                    {/* =============== Top Instruction =============== */}
                    <Text style={styles.headerText}>{answerDisplayed ? resultText : instructionText}</Text>

                    <View style={{flexDirection: 'row'}}>
                        {/* ========================================= LEFT SIDE ============================================ */}
                        <View style={styles.leftSideContainer}>
                            <Image source={game === 'Alphabet' ? randomizedGameQuestions[currentQuestion].idImage : randomizedGameQuestions[currentQuestion].exampleImage} 
                                    style={styles.alphaNumLeftImage} />
                            <Text style={styles.alphaNumLeftInstructionText}>Tap {game === 'Alphabet' ? 'letter' : 'picture'} to hear sound</Text>
                            <SoundIcon size='9%'/>
                        </View>
                        
                        {/* ========================================= RIGHT SIDE (Answer Options) ============================================ */}
                        <View style={styles.rightSideContainer}>
                          {options.map((item: Letter | Number) => (
                            <View key={item.id}> 
                              <OptionCard 
                                customWidth={0.38} 
                                height={140} 
                                image={game === 'Alphabet' ? item.exampleImage : item.idImage} 
                                lowerText={item.writtenWord} 
                                functionToExecute={() => moveToNextQuestion()}
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
                          <CustomButton text='Submit' functionToExecute={() => markAnswer()}/>
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
    padding: 10
  },
  backBtnContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    paddingLeft: 10
  }
});


//console.log('currentQuestion updated');

      // if (currentQuestion !== randomizedGameQuestions.length) {
      //   //router.push('/LevelChoice?game=Alphabet');
      //   options = getRandomItemsIncludingId(randomizedGameQuestions, 3, randomizedGameQuestions[currentQuestion].id);
      // }

      

      // console.log(currentQuestion / randomizedGameQuestions.length);

      // randomizedGameQuestions.forEach(element => {
      //       console.log(element.id);
      //   });




    // useEffect(() => {
    //   console.log('level 2 loaded');
    //   //fetch user?
    //   //start game?
    // }, []);