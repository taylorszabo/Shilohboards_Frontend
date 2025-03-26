import * as React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProgressBar from '../reusableComponents/ProgressBar';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {alphabetLetters, alphabetSounds} from '../assets/imageMapping';
import GameComplete from '../reusableComponents/GameComplete';
import SoundIcon from '../reusableComponents/SoundIcon';
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import ExitConfirmation from '../reusableComponents/ExitConfirmation';
import LoadingMessage from '../reusableComponents/LoadingMessage';

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

type QuestionAnswers = {
    id: string,
    correct: boolean
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
    const recordedAnswers = useRef<QuestionAnswers[]>([]);

    const soundObject = useRef(new Audio.Sound());

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

    useEffect(() => {
        if (gameQuestions.length > 0 && gameQuestions[currentQuestion]) {
            playCurrentSound();
        }
    }, [currentQuestion, gameQuestions]);


    async function playCurrentSound() {
        try {
            if (soundObject.current) {
                await soundObject.current.unloadAsync();
            }
            const currentItem = gameQuestions[currentQuestion];
            const soundPath = alphabetSounds[currentItem.letter];
            if (soundPath) {
                await soundObject.current.loadAsync(soundPath);
                await soundObject.current.playAsync();
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }


    function selectAnswer(answerSubmitted: string) {
        if (!answerDisplayed) {
            setAnswerSelected(answerSubmitted);
        }
    }

    function submitAnswer() {
        if (!answerSelected) return;

        setAnswerDisplayed(true);

        const correctAnswer = gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object;
        const isCorrect = answerSelected === correctAnswer;
        const questionLetter = gameQuestions[currentQuestion].letter;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        } 

        playAudio(isCorrect ? require("../assets/Sounds/correctSound.mp3") : require("../assets/Sounds/incorrectSound.mp3"));
        if (questionLetter) {
            recordedAnswers.current.push({
                id: questionLetter,
                correct: isCorrect
            });
        }
    }

    async function endGame() {
        setGameComplete(true);

        const resultsPayload = {
            child_id: playerId,
            game_type: game,
            level: 3,
            results: recordedAnswers.current.map(ans => ({
                id: ans.id,
                correct: ans.correct,
            }))
        };

        try {
            await axios.post(`${API_BASE_URL}/${String(game).toLowerCase()}/score`, {
                gameId,
                childId: 'mocked_child_id',
                level: 3,
                score: correctAnswers,
            });
            await axios.post(`${API_BASE_URL}/users/report`, resultsPayload);
        } catch (error) {
            console.error('Failed to send final score:', error);
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

    if (loading) return <LoadingMessage backgroundNeeded={true}/>;

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
                {exitPopupOpen && <ExitConfirmation onExit={handleExit} setExitPopupOpen={setExitPopupOpen} />}

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
                            <Text style={[styles.headerText, {width: '40%'}]}>
                                Tap the ear to replay sound
                            </Text>
                            <SoundIcon widthPercent={25} onPress={playCurrentSound}/>
                        </View>
                        
                        <View style={{ alignItems: 'center', flex: 1, width: '100%', position: 'relative' }}>
                            {/* answer for troubleshooting: ({gameQuestions[currentQuestion].options.find(opt => opt.correct)?.object.toString()}) */}
                            <Text style={styles.headerText}>Choose the correct letter for the sound or beginning of the word:</Text>

                            <View style={styles.answerContainer}>
                                <View style={{gap: 15}}>
                                    {gameQuestions[currentQuestion].options.slice(0, 2).map((option, index) => (
                                        <OptionCard key={index} 
                                            square={true}
                                            image={option.image} 
                                            functionToExecute={() => selectAnswer(option.object)} 
                                            disabled={answerDisplayed} 
                                            selected={answerSelected === option.object} 
                                            bgColor={
                                                answerDisplayed
                                                    ? option.correct ? "#CFFFC0" : "#F69292"
                                                    : "#FFF8F0"
                                            }
                                        />
                                    ))}
                                </View>

                                <View style={{gap: 15}}>
                                    {gameQuestions[currentQuestion].options.slice(2).map((option, index) => (
                                        <OptionCard key={index} 
                                            square={true}
                                            image={option.image} 
                                            functionToExecute={() => selectAnswer(option.object)} 
                                            disabled={answerDisplayed} 
                                            selected={answerSelected === option.object} 
                                            bgColor={
                                                answerDisplayed
                                                    ? option.correct ? "#CFFFC0" : "#F69292"
                                                    : "#FFF8F0"
                                            }
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* Before an answer is selected, there should NOT be a submit button but since we need to keep the space for responsiveness, a 3rd invisible/disabled button is there.  Once 
                                an answer is selected, the submit button appears.  After they submit their answer, the next button appears to move to the next question after reviewing feedback */}
                            {answerDisplayed ? 
                                <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text="Next" functionToExecute={moveToNextQuestion} image={require("../assets/forward.png")} /> 
                            : answerSelected ? 
                                <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text="Submit" functionToExecute={submitAnswer} image={require("../assets/Icons/submit.png")} uniqueImageStyling={styles.btnIcon} />
                                :
                                <CustomButton uniqueButtonStyling={styles.submitBtnContainerInvisible} text="Submit"  disabled={true} image={require("../assets/Icons/submit.png")} uniqueImageStyling={styles.btnIcon} />
                            }
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
    gap: '1%'
  },
  answerContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center', 
    flexWrap: 'wrap', 
    gap: 15,
    marginBottom: '4%'
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
    flexDirection: 'row',
  },
  submitBtnContainerInvisible: {
    marginTop: 'auto',
    flexDirection: 'row',
    opacity: 0
  },
  btnIcon: {
    height: '150%',
    width: '7%',
    resizeMode: 'contain',
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