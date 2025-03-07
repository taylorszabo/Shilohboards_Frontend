import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import {useEffect, useRef, useState} from 'react';
import { Audio } from 'expo-av';
import GameComplete from '../reusableComponents/GameComplete';
import axios from "axios";
import {alphabetImages, alphabetLetters, numberDigits, numberImages} from "../assets/imageMapping";

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export interface GameOption {
    object?: string;
    number?: number;
    image: number;
    correct: boolean;
}

export interface GameQuestion {
    level: number;
    letter?: string;
    number?: number;
    voice: string;
    options: GameOption[];
    exampleImage?: number;
}

export default function LevelTwo() {
    const params = useLocalSearchParams();
    const game = Array.isArray(params.game) ? params.game[0] : params.game || "Alphabet";

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


    const getLocalImage = (gameType: string, key: string | number): number => {
        if (gameType === "Alphabet" && typeof key === "string" && alphabetImages[key]) {
            return alphabetImages[key];
        }
        if (gameType === "Numbers" && typeof key === "string" && numberImages[key]) {
            return numberImages[key];
        }
        return require("../assets/defaultImage.png");
    };

    const getLocalExampleImage = (gameType: string, key: string | number | undefined): number => {
        if (gameType === "Alphabet" && typeof key === "string" && alphabetLetters[key]) {
            return alphabetLetters[key];
        }
        if (gameType === "Numbers" && typeof key === "number" && numberDigits[key]) {
            return numberDigits[key];
        }
        return require("../assets/defaultImage.png");
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const questionsFetched = useRef(false);

    useEffect(() => {
        if (questionsFetched.current) return;
        questionsFetched.current = true;

        let isMounted = true;

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get<GameQuestion[]>(`${API_BASE_URL}/${game.toLowerCase()}/level2`);
                let questionsArray = response.data;

                if (!questionsArray || questionsArray.length === 0) {
                    throw new Error("No questions received from API.");
                }

                questionsArray = questionsArray.map((questionData) => {

                    if (game === "Numbers" && questionData.number) {
                        questionData.exampleImage = getLocalExampleImage(game, questionData.number);
                    } else if (game === "Alphabet" && questionData.letter) {
                        questionData.exampleImage = getLocalExampleImage(game, questionData.letter);
                    }

                    questionData.options = questionData.options.map((option) => ({
                        ...option,
                        image: getLocalImage(game, option.image),
                    }));

                    return questionData;
                });


                if (isMounted) {
                    setGameQuestions(questionsArray);
                    setCurrentQuestion(0);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Failed to load game questions.");
                    setLoading(false);
                }
            }
        };

        fetchQuestions();

        return () => {
            isMounted = false;
        };
    }, [game]);

    function markAnswer(answerSubmitted: string) {
        if (!answerDisplayed) {
            setAnswerSelected(answerSubmitted);
        }
    }

    function submitAnswer() {
        if (!answerSelected) return;

        setAnswerDisplayed(true);

        const correctAnswer = gameQuestions[currentQuestion].options.find(opt => opt.correct);
        const correctValue = game === "Alphabet" ? correctAnswer?.object : correctAnswer?.number?.toString();

        const isCorrect = answerSelected === correctValue;

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
                level: 2,
                score: correctAnswers,
            });
        } catch (error) {
            console.error("Failed to send final score:", error);
        }
    }

    function moveToNextQuestion() {
        if (currentQuestion < gameQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setAnswerDisplayed(false);
            setAnswerSelected(null);
        } else {
            endGame();
        }
    }

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
                <CustomButton image={require("../assets/back.png")} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/LevelChoice?game=${game}`} />

                <CharacterCard bgColor="#C0E3B9" image="hotdog" name="Shiloh" customWidth={0.25} />

                <Text style={styles.headerText}>{game} - Level 2</Text>

                <ProgressBar fillPercent={(currentQuestion / gameQuestions.length) * 100} />

                <View style={{ alignItems: "center", flex: 1, width: "100%", position: "relative" }}>
                    <Text style={styles.headerText}>
                        {answerDisplayed
                            ? answerSelected === (game === "Alphabet" ? gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object : gameQuestions[currentQuestion].options.find(opt => opt.correct)?.number?.toString())
                                ? "Great job! Your answer is correct."
                                : "Good try! Unfortunately, that is incorrect."
                            : "Choose the correct answer:"}
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.leftSideContainer}>
                            <Image source={gameQuestions[currentQuestion].exampleImage} style={styles.alphaNumLeftImage} />
                        </View>

                        <View style={styles.rightSideContainer}>
                            {gameQuestions[currentQuestion].options.map((option, index) => (
                                <OptionCard
                                    key={index}
                                    customWidth={0.38}
                                    height={140}
                                    image={option.image}
                                    lowerText={game === "Alphabet" ? option.object : ""}
                                    functionToExecute={() => markAnswer(game === "Alphabet" ? option.object! : option.number!.toString())}
                                    disabled={answerDisplayed}
                                    selected={answerSelected === (game === "Alphabet" ? option.object : option.number?.toString())}
                                    bgColor={
                                        answerDisplayed
                                            ? game === "Alphabet"
                                                ? option.object === answerSelected
                                                    ? option.correct ? "#CFFFC0" : "#F69292"
                                                    : "#FFF8F0"
                                                : option.number?.toString() === answerSelected
                                                    ? option.correct ? "#CFFFC0" : "#F69292"
                                                    : "#FFF8F0"
                                            : "#FFF8F0"
                                    }
                                />
                            ))}
                        </View>
                    </View>

                    {answerDisplayed ? <CustomButton text="Next" functionToExecute={moveToNextQuestion} /> : answerSelected && <CustomButton text="Submit" functionToExecute={submitAnswer} />}
                </View>
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
    position: 'relative',
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