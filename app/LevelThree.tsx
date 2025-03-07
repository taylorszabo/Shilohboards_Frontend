import * as React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import SoundIcon from '../reusableComponents/SoundIcon';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { alphabetImages, alphabetLetters } from "../assets/imageMapping";
import SoundPressable from '../reusableComponents/SoundPressable';
import GameComplete from '../reusableComponents/GameComplete';
import { shuffleArray } from '../GameFunctions';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export interface GameOption {
    object?: string;
    number?: number;
    image: number;
    correct: boolean;
}

export interface GameQuestion {
    level: number;
    letter: string;
    sound: string;
    wordExample: string;
    options: GameOption[];
    exampleImage?: number;
}

export default function LevelThree() {
    const { game = '[game]', playerId = '0' } = useLocalSearchParams();

    const [gameId] = useState(() => `game-${Date.now()}-${Math.floor(Math.random() * 10000)}`);

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
    const [answerSelected, setAnswerSelected] = useState<string | null>(null);
    const [answerDisplayed, setAnswerDisplayed] = useState<boolean>(false);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);


    const getLocalImage = (key: number): number => {
        return alphabetImages[key] || require("../assets/defaultImage.png");
    };

    const getLocalExampleImage = (key: string): number => {
        return alphabetLetters[key] || require("../assets/defaultImage.png");
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const questionsFetched = useRef(false);

    //-----------------------------------------------------------------------
    useEffect(() => {
        if (questionsFetched.current) return;
        questionsFetched.current = true;

        let isMounted = true;

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get<GameQuestion[]>(`${API_BASE_URL}/alphabet/level3`);
                let questionsArray = response.data;

                if (!questionsArray || questionsArray.length === 0) {
                    throw new Error("No questions received from API.");
                }

                questionsArray = questionsArray.map((questionData) => {
                    return {
                        ...questionData,
                        exampleImage: getLocalExampleImage(questionData.letter!),

                        options: questionData.options.map((option) => ({
                            object: option.object,
                            image: getLocalImage(option.image),
                            correct: option.correct,
                        })) as GameOption[],
                    };
                });

                setGameQuestions(shuffleArray(questionsArray));
                setCurrentQuestion(0);
                setLoading(false);
            } catch (err) {
                setError("Failed to load game questions.");
                setLoading(false);
            }
        };

        fetchQuestions();

        return () => {
            isMounted = false;
        };
    }, []);

    function markAnswer(answerSubmitted: string) {
        if (!answerDisplayed) {
            setAnswerSelected(answerSubmitted);
        }
    }

    function submitAnswer() {
        if (!answerSelected) return;

        setAnswerDisplayed(true);

        const correctAnswer = gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object;
        const isCorrect = answerSelected === correctAnswer;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            playAudio(require("../assets/Sounds/correctSound.mp3"));
        } else {
            playAudio(require("../assets/Sounds/incorrectSound.mp3"));
        }
    }

    async function endGame() {
        setGameComplete(true);

        try {
            await axios.post(`${API_BASE_URL}/${game.toLowerCase()}/score`, {
                gameId,
                childId: "mocked_child_id",
                level: 3,
                score: correctAnswers,
            });
        } catch (error) {
            console.error("Failed to send final score:", error);
        }
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

    if (loading) {
        return <Text>Loading questions...</Text>;
    }

    if (error) {
        return <Text style={{ color: "red" }}>{error}</Text>;
    }

    if (gameComplete) {
        return <GameComplete score={`${correctAnswers}/${gameQuestions.length}`} />;
    }

    return (
        <BackgroundLayout>
            <View style={styles.container}> 
                {/* =============== Back Button =============== */}
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/LevelChoice?game=${game}&playerId=${playerId}`}/>

                {/* =============== Player Card =============== */}
                <CharacterCard id={parseInt(playerId.toString())} customWidth={0.25}/>

                <Text style={styles.headerText}>{game} - Level 3</Text>

                <ProgressBar fillPercent={(currentQuestion / gameQuestions.length) * 100} />

                {currentQuestion !== gameQuestions.length ? (
                    <View style={{ alignItems: "center", flex: 1, width: "100%", position: "relative" }}>
                        <View style={styles.topPortion}>
                            <SoundIcon size='25%' />
                            <View style={{ gap: 10 }}>
                                <SoundPressable soundFile={gameQuestions[currentQuestion].sound}>
                                    <Text style={styles.soundBtn}>Sound</Text>
                                </SoundPressable>
                                <SoundPressable soundFile={`assets/Alphabet/Audio/${gameQuestions[currentQuestion].wordExample}Word.mp3`}>
                                    <Text style={styles.soundBtn}>Word</Text>
                                </SoundPressable>
                            </View>
                        </View>

                        <Text style={styles.headerText}>
                            {answerDisplayed
                                ? answerSelected === gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object
                                    ? "Great job! Your answer is correct."
                                    : "Good try! Unfortunately, that is incorrect."
                                : "Choose the correct letter for the sound or beginning of the word:"}
                        </Text>

                        <View style={styles.answerContainer}>
                            {gameQuestions[currentQuestion].options.map((option, index) => (
                                <OptionCard
                                    key={index}
                                    customWidth={0.38}
                                    height={140}
                                    image={option.image}
                                    lowerText={option.object}
                                    functionToExecute={() => markAnswer(game === "Alphabet" ? option.object! : '')}
                                    disabled={answerDisplayed}
                                    selected={answerSelected === option.object}
                                    bgColor={
                                        answerDisplayed
                                            ? answerSelected === option.object
                                                ? option.correct ? "#CFFFC0" : "#F69292"
                                                : "#FFF8F0"
                                            : "#FFF8F0"
                                    }
                                />
                            ))}
                        </View>

                        {answerDisplayed ? <CustomButton text="Next" functionToExecute={moveToNextQuestion} /> : answerSelected && <CustomButton text="Submit" functionToExecute={submitAnswer} />}
                    </View>
                ) : <GameComplete score={`${correctAnswers}/${gameQuestions.length}`} />}
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