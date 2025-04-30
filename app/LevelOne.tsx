import React, { useState, useEffect, useRef } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image, Platform} from "react-native";
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
import LoadingMessage from "../reusableComponents/LoadingMessage";
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http   ://localhost:3000";

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
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [doorOpened, setDoorOpened] = useState<boolean>(false);
    const [exitPopupOpen, setExitPopupOpen] = useState<boolean>(false);
    const questionsFetched = useRef(false);
    const soundObject = useRef(new Audio.Sound());


    // Fetch character profile from backend
    useEffect(() => {
        const fetchCharacterProfile = async () => {
            if (!playerId || playerId === "0") {
                router.replace("/error?message=Failed%20to%20load%20character%20profile");
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/users/profile/${playerId}`);
                if (response.data) {
                    setCharacter(response.data);
                } else {
                    router.replace("/error?message=Failed%20to%20load%20character%20profile");
                }
            } catch (error) {
                console.error("Error fetching character profile:", error);
                setTimeout(() => router.replace("/error?message=Failed%20to%20load%20character%20profile"), 2000);
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
                const clonedQuestions = JSON.parse(JSON.stringify(questionsArray));

                if (isMounted) {
                    //sort in ascending order for either letter strings or numbers
                    setGameQuestions(questionsArray.sort((a, b) => (typeof a.letter === "number" && typeof b.letter === "number") ? (a.letter as number) - (b.letter as number) : (a.letter as string).localeCompare(b.letter as string)));

                    //setGameQuestions(clonedQuestions); //other possible solution if issues with ascending order persist

                    setCurrentQuestion(0);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    router.replace("/error?message=Failed%20to%20load%20game%20questions");
                    setLoading(false);
                }
            }
        };
        fetchQuestions();

        return () => {
            isMounted = false;
        };
    }, [game]);

    useEffect(() => {
        const checkUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                router.push('/Login');
            }
        };
        checkUser();
        if (Platform.OS === "web") {
            const handleBeforeUnload = (event: BeforeUnloadEvent) => {
                event.preventDefault();
            };
            window.addEventListener("beforeunload", handleBeforeUnload);
            return () => window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, []);


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

    const handleExit = () => {
        router.replace(`/LevelChoice?game=${game}&playerId=${playerId}`);
    };

    const playSound = async () => {
        try {
          // Unload previous sound before playing new sound
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
      
            // Get saved volume from AsyncStorage
            const savedVolume = await AsyncStorage.getItem("volume");
            const volumeLevel = savedVolume ? Number(savedVolume) / 100 : 1.0;

      
            // Apply volume before playing
            await soundObject.current.setVolumeAsync(volumeLevel);
      
            // Play sound
            await soundObject.current.playAsync();
          }
        } catch (error) {
          console.error("Error playing sound:", error);
        }
    };

    if (loading || !character) return <LoadingMessage backgroundNeeded={true}/> ;

    if (gameComplete) {
        return <GameComplete level="1" game={game} score="" />;
    }

    const currentItem = gameQuestions[currentQuestion];

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
                />
                <Text style={styles.title}>{game} - Level 1</Text>
                <ProgressBar fillPercent={(currentQuestion / gameQuestions.length) * 100} />

                
                <TouchableOpacity style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Tap ear to hear voiceover</Text>
                </TouchableOpacity>
                 
                <View style={{margin: 25, width: '100%', maxWidth: 500, alignItems: 'center'}}>
                    <SoundIcon widthPercent={18} onPress={playSound}/>
                </View>

                <View style={{flex: 1, maxHeight: 550, alignItems: 'center'}}>
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
                            <View style={styles.cubeBackContainer}></View>
                        </TouchableOpacity>
                    )}
                

                    <CustomButton uniqueButtonStyling={styles.submitBtnContainer} text="Next" functionToExecute={moveToNextQuestion} image={require("../assets/forward.png")} />
                </View>
            </View>
            
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    voiceoverContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.02,
    },
    voiceoverText: {
        fontSize: 18, // Responsive font size
        color: '#3E1911',
        fontWeight: '700',
        textAlign: 'center',
      },
    cube: {
        width: 250,   // Makes cube adapt to screen size
        height: height * 0.32, // Adjust height dynamically
        maxWidth: 300,
        maxHeight: 350,
        borderRadius: 15,
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
        bottom: 0,
        left: 0,
        transform: [{ translateX: -252 }],
        zIndex: 0, // Moves it behind the main image
    },
    title: {
        fontSize: 28,  // Scales based on screen width
        fontWeight: "700",
        color: "#3E1911",
        textAlign: "center",
        paddingVertical: 20
    },
    backBtnContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingVertical: 20,
    },
    submitBtnContainer: {
        marginTop: 'auto', 
        flexDirection: 'row',
    },
});

