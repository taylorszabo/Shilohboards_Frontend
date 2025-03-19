import * as React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { alphabetLetters } from '../assets/imageMapping';
import GameComplete from '../reusableComponents/GameComplete';
import SoundPressable from '../reusableComponents/SoundPressable';
import SoundIcon from '../reusableComponents/SoundIcon';
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import ExitConfirmation from '../reusableComponents/ExitConfirmation';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export interface GameOption {
    object: string;
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
    const { game = 'Alphabet', playerId = '0' } = useLocalSearchParams();
    const router = useRouter();

    const [character, setCharacter] = useState<any | null>(null);
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
    const [exitPopupOpen, setExitPopupOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchCharacterProfile = async () => {
            if (!playerId || playerId === "0") {
                router.replace("/SelectCharacter");
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/users/profile/${playerId}`);
                if (response.data) {
                    setCharacter(response.data);
                } else {
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

    const getLocalExampleImage = (key: string | number): number => {
        return alphabetLetters[key] || require('../assets/defaultImage.png');
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

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get<GameQuestion[]>(`${API_BASE_URL}/alphabet/level3`);
                let questionsArray = response.data;

                if (!questionsArray || questionsArray.length === 0) {
                    throw new Error('No questions received from API.');
                }

                questionsArray = questionsArray.map((questionData) => {
                    return {
                        ...questionData,
                        exampleImage: getLocalExampleImage(questionData.letter),
                        options: questionData.options.map((option) => ({
                            object: option.object,
                            image: getLocalExampleImage(option.image),
                            correct: option.correct,
                        })),
                    };
                });

                setGameQuestions(questionsArray);
                setCurrentQuestion(0);
                setLoading(false);
            } catch (err) {
                setError('Failed to load game questions.');
                setLoading(false);
            }
        };

        fetchQuestions();
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
            playAudio(require('../assets/Sounds/correctSound.mp3'));
        } else {
            playAudio(require('../assets/Sounds/incorrectSound.mp3'));
        }
    }

    async function endGame() {
        setGameComplete(true);

        try {
            await axios.post(`${API_BASE_URL}/${String(game).toLowerCase()}/score`, {
                gameId,
                childId: 'mocked_child_id',
                level: 3,
                score: correctAnswers,
            });

        } catch (error) {
            console.error('Failed to send final score:', error);
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

    if (!character) {
        console.warn("Character profile is null, redirecting...");
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={{ color: 'red' }}>{error}</Text>;
    }

    if (gameComplete) {
        return <GameComplete level="3" game={game} score={`${correctAnswers}/${gameQuestions.length}`} />;
    }

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} functionToExecute={() => setExitPopupOpen(true)} />
                {exitPopupOpen && <ExitConfirmation exitRoute={`/LevelChoice?game=${game}&playerId=${playerId}`} setExitPopupOpen={setExitPopupOpen}/>}

                <CharacterCard
                    id={character.id}
                    name={character.profile_name}
                    image={characterOptions.find(option => option.id === character.profile_image)?.picture}
                    bgColor={bgColorOptions.includes(character.profile_color) ? character.profile_color : "#FFFFFF"}
                    customWidth={0.25}
                />

                <Text style={styles.headerText}>{game} - Level 3</Text>
                <ProgressBar fillPercent={(currentQuestion / gameQuestions.length) * 100} />

                {currentQuestion !== gameQuestions.length ? (
                    <View style={{alignItems: 'center', flex: 1, width: '100%', position: 'relative'}}>
                        {/* =============== Sound =============== */}
                        <View style={styles.topPortion}>
                            <SoundIcon size='25%'/>
                            <View style={styles.replayBtn}>
                                {/* <SoundPressable soundFile={randomizedGameQuestions[currentQuestion].idAudio}> */}
                                    <Image source={require('../assets/Icons/replay.png')} style={styles.replayIconPic}/>
                                {/* </SoundPressable>*/}
                            </View>
                        </View>
                        
                        <View style={{ alignItems: 'center', flex: 1, width: '100%', position: 'relative' }}>
                            {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                            {/* TODO: remove the answer once development done!!!!!!!!!! */}
                            {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                            <Text style={styles.headerText}>Choose the correct letter ({gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object.toString()}) for the sound or beginning of the word:</Text>

                            <View style={styles.answerContainer}>
                                {gameQuestions[currentQuestion].options.map((option, index) => (
                                    <OptionCard key={index} 
                                        customWidth={0.38} 
                                        height={140} 
                                        image={option.image} 
                                        functionToExecute={() => markAnswer(option.object)} 
                                        disabled={answerDisplayed} 
                                        selected={answerSelected === option.object} 
                                        bgColor={
                                            // answerDisplayed
                                            //     ? answerSelected === option.object
                                            //         ? option.correct ? "#CFFFC0" : "#F69292"
                                            //         : "#FFF8F0"
                                            //     : "#FFF8F0"
                                            answerDisplayed
                                                ? option.correct ? "#CFFFC0" : "#F69292"
                                                : "#FFF8F0"
                                        }
                                    />
                                ))}
                            </View>

                            <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text={answerDisplayed ? 'Next' : 'Submit'} functionToExecute={answerDisplayed ? moveToNextQuestion : submitAnswer} />
                        </View>
                    </View>
                ) : null}
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

    borderRightWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#A9A9A9',
  },
  replayBtn: {
    width: '25%', 
    aspectRatio: 1, 
    padding: '3%', 
    borderRadius: 10,
    borderRightWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#A9A9A9',
    backgroundColor: '#FFF8F0',
  },
  replayIconPic: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  }
});