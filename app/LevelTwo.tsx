import * as React from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator, ScrollView} from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import {useLocalSearchParams, useRouter} from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import {useEffect, useRef, useState} from 'react';
import { Audio } from 'expo-av';
import GameComplete from '../reusableComponents/GameComplete';
import axios from "axios";
import {
    alphabetImages,
    alphabetLetters,
    alphabetSounds,
    numberDigits,
    numberImages,
    numberSounds
} from "../assets/imageMapping";
import SoundIcon from "../reusableComponents/SoundIcon";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import ExitConfirmation from '../reusableComponents/ExitConfirmation';


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

type QuestionAnswers = {
    id: string,
    correct: boolean
}

export default function LevelTwo() {
    const { game = 'Alphabet', playerId = '0' } = useLocalSearchParams();
    const router = useRouter();

    const [gameId] = useState(() => `game-${Date.now()}-${Math.floor(Math.random() * 10000)}`);

    const [character, setCharacter] = useState<any | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
    const [answerSelected, setAnswerSelected] = useState<string | null>(null);
    const [answerDisplayed, setAnswerDisplayed] = useState<boolean>(false);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [exitPopupOpen, setExitPopupOpen] = useState<boolean>(false);
    const recordedAnswers = useRef<QuestionAnswers[]>([]);
    const soundObject = useRef(new Audio.Sound());


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

    const playCurrentSound = async () => {
        try {
            if (soundObject.current) {
                await soundObject.current.unloadAsync();
            }

            const currentItem = gameQuestions[currentQuestion];
            let soundPath: number | undefined;

            if (game === "Alphabet" && currentItem.letter) {
                soundPath = alphabetSounds[currentItem.letter];
            } else if (game === "Numbers" && currentItem.number) {
                soundPath = numberSounds[currentItem.number];
            }

            if (soundPath) {
                await soundObject.current.loadAsync(soundPath);
                await soundObject.current.playAsync();
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    useEffect(() => {
        const fetchCharacterProfile = async () => {
            if (!playerId || playerId === "0") {
                console.warn("Invalid playerId, redirecting to character selection...");
                router.replace("/SelectCharacter");
                return;
            }

            try {
                console.log(`Fetching profile for playerId: ${playerId}`);
                const response = await axios.get(`${API_BASE_URL}/users/profile/${playerId}`);

                if (response.data) {
                    setCharacter(response.data);
                } else {
                    console.warn("No profile found, redirecting...");
                    router.replace("/SelectCharacter");
                }
            } catch (error) {
                console.error("Error fetching character profile:", error);
                setError("Failed to load character. Redirecting...");
                setTimeout(() => router.replace("/SelectCharacter"), 2000);
            }
        };

        fetchCharacterProfile();
    }, [playerId, router]);

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
                const response = await axios.get<GameQuestion[]>(`${API_BASE_URL}/${String(game).toLowerCase()}/level2`);
                let questionsArray = response.data;

                if (!questionsArray || questionsArray.length === 0) {
                    throw new Error("No questions received from API.");
                }

                questionsArray = questionsArray.map((questionData) => {

                    if (game === "Numbers" && questionData.number) {
                        questionData.exampleImage = getLocalExampleImage(String(game), questionData.number);
                    } else if (game === "Alphabet" && questionData.letter) {
                        questionData.exampleImage = getLocalExampleImage(String(game), questionData.letter);
                    }

                    questionData.options = questionData.options.map((option) => ({
                        ...option,
                        image: getLocalImage(String(game), option.image),
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

    function selectAnswer(answerSubmitted: string) {
        if (!answerDisplayed) {
            setAnswerSelected(answerSubmitted);
        }
    }

    function submitAnswer() {
        if (!answerSelected) return;

        setAnswerDisplayed(true);

        const correctAnswer = gameQuestions[currentQuestion].options.find(opt => opt.correct);
        const correctValue = game === "Alphabet" ? correctAnswer?.object : correctAnswer?.number?.toString();
        const questionLetterOrNumber = game === "Alphabet" ? gameQuestions[currentQuestion].letter : gameQuestions[currentQuestion].number?.toString();

        const isCorrect = answerSelected === correctValue;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        } 

        playAudio(isCorrect ? require("../assets/Sounds/correctSound.mp3") : require("../assets/Sounds/incorrectSound.mp3"));

        if(questionLetterOrNumber)
        {
            recordedAnswers.current.push({
                id: questionLetterOrNumber as string,
                correct: isCorrect,
            });
        }
        else{
            console.warn("Missing letter or number for question at index", currentQuestion);
            return;
        }

    }

    async function endGame() {
        setGameComplete(true);

        const resultsPayload = {
            child_id: playerId,
            game_type: game,
            level: 2,
            results: recordedAnswers.current.map(ans => ({
                id: ans.id,
                correct: ans.correct,
            }))
        };

        try {
            await axios.post(`${API_BASE_URL}/${String(game).toLowerCase()}/score`, {
                gameId,
                childId: "mocked_child_id",
                level: 2,
                score: correctAnswers,
            });
            await axios.post(`${API_BASE_URL}/users/report`, resultsPayload);
        } catch (error) {
            console.error("Failed to send final score:", error);
        }
    }

    const handleExit = () => {
        recordedAnswers.current = [];
        router.replace(`/LevelChoice?game=${game}&playerId=${playerId}`);
    };

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

    if (!character) {
        console.warn("Character profile is null, redirecting...");
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={{ color: "red" }}>{error}</Text>;
    }

    if (gameComplete) {
        return <GameComplete level="2" game={game} score={`${correctAnswers}/${gameQuestions.length}`} />;
    }

    return (
        <BackgroundLayout>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* =============== Back Button =============== */}
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} functionToExecute={() => setExitPopupOpen(true)} />
                {exitPopupOpen && <ExitConfirmation onExit={handleExit} setExitPopupOpen={setExitPopupOpen} />}


                {/* =============== Player Card =============== */}
                <CharacterCard
                    id={character.id}
                    name={character.profile_name}
                    image={characterOptions.find(option => option.id === character.profile_image)?.picture}
                    bgColor={bgColorOptions.includes(character.profile_color) ? character.profile_color : "#FFFFFF"}
                    customWidth={0.25}
                />

                {/* =============== Game/Level Title =============== */}
                <Text style={styles.headerText}>{game} - Level 2</Text>

                {/* =============== Progress Bar =============== */}
                <ProgressBar fillPercent={(currentQuestion / gameQuestions.length) * 100} />

                {/* =============== Top Instruction =============== */}
                <View style={{ alignItems: "center", flex: 1, width: "100%", position: "relative" }}>
                    <Text style={styles.headerText}>
                        {answerDisplayed
                            ? answerSelected === (game === "Alphabet" ? gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object : gameQuestions[currentQuestion].options.find(opt => opt.correct)?.number?.toString())
                                ? "Great job! Your answer is correct."
                                : "Good try! Unfortunately, that is incorrect."
                            : game === 'Alphabet' ? 'Choose the correct object that matches the letter shown on the left:' :
                                                    'Choose the correct number that matches how many objects are shown:'}
                    </Text>

                    <View style={{flexDirection: 'row', justifyContent: 'center', width: '85%', gap: '3%'}}>
                        {/* ========================================= LEFT SIDE ============================================ */}
                        <View style={styles.leftSideContainer}>
                            <Image
                                source={gameQuestions[currentQuestion].exampleImage}
                                style={[
                                    styles.alphaNumLeftImage,
                                    game === "Numbers" && styles.alphaImageOverride
                                ]}
                            />
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.alphaNumLeftInstructionText}>Tap letter to hear sound</Text>
                                    <SoundIcon size='9%' onPress={playCurrentSound}/>
                                </View>
                        </View>

                        {/* ========================================= RIGHT SIDE (Answer Options) ============================================ */}
                        <View style={styles.rightSideContainer}>
                            {gameQuestions[currentQuestion].options.map((option, index) => (
                                <OptionCard
                                    key={index}
                                    customWidth={0.38}
                                    height={140}
                                    image={option.image}
                                    lowerText={game === "Alphabet" ? option.object : ""}
                                    functionToExecute={() => selectAnswer(game === "Alphabet" ? option.object! : option.number!.toString())}
                                    disabled={answerDisplayed}
                                    selected={answerSelected === (game === "Alphabet" ? option.object : option.number?.toString())}
                                    boldFirstLetter={game === "Alphabet"}
                                    bgColor={
                                        answerDisplayed
                                            ? option.correct ? "#CFFFC0" : "#F69292"
                                            : "#FFF8F0"
                                    }
                                />
                            ))}
                        </View>
                    </View>

                    {answerDisplayed ? 
                    <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text="Next" functionToExecute={moveToNextQuestion} image={require("../assets/forward.png")} /> 
                    : answerSelected && 
                    <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text="Submit" functionToExecute={submitAnswer} image={require("../assets/Icons/submit.png")} uniqueImageStyling={styles.btnIcon} />
                    }
                </View>
            </ScrollView>
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
    flex: 1,
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 25,
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
    resizeMode: 'contain'
  },
  alphaImageOverride: {
    maxHeight: 180,
    maxWidth:180,
    aspectRatio: 1,
  },
  alphaNumLeftInstructionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 10,
    color: '#3E1911'
  },
    submitBtnContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        zIndex: 10,
    },
  backBtnContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 20
  },
  btnIcon: {
    height: '150%',
    width: '7%',
    resizeMode: 'contain',
  }
});