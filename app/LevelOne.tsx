import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import CharacterCard from "../reusableComponents/CharacterCard";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "../reusableComponents/CustomButton";
import ProgressBar from "../reusableComponents/ProgressBar";
import axios from "axios";
import {
    alphabetImages,
    alphabetLetters,
    alphabetSounds,
    numberDigits,
    numberImages,
    numberSounds
} from "../assets/imageMapping";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import GameComplete from "../reusableComponents/GameComplete";
import { Dimensions } from "react-native";//adding responsiveness
import { Audio } from "expo-av";
import SoundIcon from "../reusableComponents/SoundIcon";
import ExitConfirmation from '../reusableComponents/ExitConfirmation';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

const { width, height } = Dimensions.get("window"); // adding to make the page responsive 

interface GameQuestion {
    level: number;
    letter?: string;
    number?: number;
    objectImage?: string;
    object?: string;
    voice: string;
}

export default function LevelOne() {
    const { game = "Alphabet", playerId = "0" } = useLocalSearchParams();
    const router = useRouter();

    const [character, setCharacter] = useState<any | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [doorOpened, setDoorOpened] = useState<boolean>(false);
    const [exitPopupOpen, setExitPopupOpen] = useState<boolean>(false);
    const questionsFetched = useRef(false);
    const soundObject = useRef(new Audio.Sound());

    // Fetch character profile from backend
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

    useEffect(() => {
        if (questionsFetched.current) return;
        questionsFetched.current = true;

        let isMounted = true;

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get<GameQuestion[]>(`${API_BASE_URL}/${String(game).toLowerCase()}/level1`);
                const questionsArray = response.data;
                if (!questionsArray || questionsArray.length === 0) {
                    throw new Error("No questions received from API.");
                }

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


    const getLocalExampleImage = (gameType: string, key?: string | number | undefined): number => {
        if (gameType === "Alphabet" && typeof key === "string") {
            return alphabetLetters[key] ?? require("../assets/defaultImage.png");
        }
        if (gameType === "Numbers" && typeof key === "number") {
            return numberImages[key] ?? require("../assets/defaultImage.png");
        }
        return require("../assets/defaultImage.png");
    };

    const getLocalObjectImage = (gameType: string, key?: string | number | undefined): number => {
        if (gameType === "Alphabet" && typeof key === "string" && alphabetImages[key]) {
            return alphabetImages[key];
        }
        if (gameType === "Numbers" && typeof key === "string" && numberImages[key]) {
            return numberDigits[key];
        }
        return require("../assets/defaultImage.png");
    };

    const moveToNextQuestion = () => {
        if (currentQuestion < gameQuestions.length - 1) {
            setDoorOpened(false);
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setGameComplete(true);
        }
    };

    const playSound = async () => {
        try {
            if (soundObject.current) {
                await soundObject.current.unloadAsync();
            }

            let soundPath: number | undefined;
            if (game === "Alphabet" && currentItem.letter) {
                soundPath = alphabetSounds[currentItem.letter];
            } else if (game === "Numbers" && currentItem.letter) {
                soundPath = numberSounds[currentItem.letter];
            }

            if (soundPath) {
                await soundObject.current.loadAsync(soundPath);
                await soundObject.current.playAsync();
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };


    if (loading || !character) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={{ color: "red" }}>{error}</Text>;
    if (gameComplete) {
        return <GameComplete level="1" game={game} score="" />;
    }

    const currentItem = gameQuestions[currentQuestion];

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
                <Text style={styles.title}>{game} - Level 1</Text>
                <ProgressBar fillPercent={(currentQuestion / gameQuestions.length) * 100} />

                
                <TouchableOpacity style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Tap ear to hear voiceover</Text>
                </TouchableOpacity>
                <View style={{margin: '10%'}}>
                    <SoundIcon size='20%' onPress={playSound}/>
                </View>
                
                {/* // === OVAL SHAPE ===  This will always be rendered */}
                <View style={styles.ovalShape} /> 
                {doorOpened ? (
                    <TouchableOpacity onPress={() => setDoorOpened(false)} style={styles.stackedCubeContainer}>
                        <View style={styles.cube}>
                            <Image source={getLocalObjectImage(String(game), currentItem.objectImage)} style={styles.numberImage} />
                        </View>

                        <View style={styles.cubeBackContainer}>
                        
                            <View style={styles.cube}></View>
                        </View>

                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setDoorOpened(true)} style={styles.cube}>
                        <Image source={getLocalExampleImage(String(game), currentItem.letter)} style={styles.numberImage} />

                        <View style={styles.cubeBackContainer}>
                         
                        </View>

                    </TouchableOpacity>
                )}

                <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text="Next" functionToExecute={moveToNextQuestion} image={require("../assets/forward.png")} />

            </View>
            
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    voiceoverContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.02,
    },
    voiceoverText: {
        fontSize: width * 0.05,  // Scales text size
        fontWeight: "600",
        color: "#3E1911",
        textAlign: "center",
    },
    ear: {
        width: width * 0.08,
        height: width * 0.08,  // Keeping it proportional
        resizeMode: "contain",
        marginLeft: width * 0.02,
    },
    cube: {
        width: width * 0.5,   // Makes cube adapt to screen size
        height: height * 0.3, // Adjust height dynamically
        borderRadius: width * 0.05,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        backgroundColor: "#FAEDDC",
        zIndex: 1, // Ensures it stays above the flap
    },
    numberImage: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
    },
    stackedCubeContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2, // Ensures this container is above background elements
    },
    cubeBackContainer: {
        position: "absolute",
        top: 0,
        right: width * 0.5,  // Adjust dynamically based on screen width
        zIndex: 0, // Moves it behind the main image
    },
    ovalShape: {  
        width: width * 0.15,  
        height: height * 0.1,  
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        position: "absolute",
        left: width * 0.65,  // Moves it towards the right
        top: height * 0.63,  
        borderRadius: width * 0.05,  
        zIndex: -1,
        
    },
    backButton: {
        position: "absolute",
        top: height * 0.02,
        left: width * 0.05,
        width: width * 0.12,  
        height: width * 0.12,  // Makes it proportional
        backgroundColor: "#C3E2E5",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    backIcon: {
        width: width * 0.06,
        height: width * 0.06,
        resizeMode: "contain",
    },
    title: {
        fontSize: width * 0.08,  // Scales based on screen width
        fontWeight: "700",
        color: "#3E1911",
        textAlign: "center",
    },
    nextButton: {
        width: width * 0.3,  
        height: height * 0.07,
        backgroundColor: "#C3E2E5",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: height * 0.02,
    },
    buttonText: {
        fontSize: width * 0.05,
        fontWeight: "600",
        color: "#3E1911",
    },
    backBtnContainer: {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.02,
        paddingVertical: height * 0.02,
    },
    submitBtnContainer: {
        marginTop: 'auto',
        flexDirection: 'row',
    },
});

