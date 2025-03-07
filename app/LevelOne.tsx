import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Audio } from "expo-av";
import CharacterCard from "../reusableComponents/CharacterCard";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useLocalSearchParams } from 'expo-router';
import CustomButton from "../reusableComponents/CustomButton";
import ProgressBar from "../reusableComponents/ProgressBar";
import axios from "axios";
import { alphabetImages, alphabetLetters, numberDigits, numberImages } from "../assets/imageMapping";
import GameComplete from "../reusableComponents/GameComplete";

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

interface GameDataItem {
    letter?: string;
    number?: number;
    object?: string;
}

export default function LevelOne (){
    const { game = 'Alphabet', playerId = '0' } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameData, setGameData] = useState<GameDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [doorOpened, setDoorOpened] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${String(game).toLowerCase()}/level1`);
                setGameData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load game data");
                setLoading(false);
            }
        };
        fetchData();
    }, [game]);

    const getLocalExampleImage = (key: string | number) => {
        console.log(key)
        if (game === "Alphabet" && alphabetLetters[key]) {
            return alphabetLetters[key];
        }
        if (game === "Numbers" && numberDigits[key]) {
            return numberDigits[key];
        }
        return require("../assets/defaultImage.png");
    };

    const getLocalObjectImage = (key: string) => {
        if (game === "Alphabet" && alphabetImages[key]) {
            return alphabetImages[key];
        }
        if (game === "Numbers" && numberImages[key]) {
            return numberImages[key];
        }
        return require("../assets/defaultImage.png");
    };

    const handleNext = () => {
        if (currentIndex < gameData.length - 1) {
            setDoorOpened(false);
            setCurrentIndex((prev) => prev + 1);
        } else {
            setGameComplete(true);
        }
    };


    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text style={{ color: "red" }}>{error}</Text>;
    if(gameComplete)
    {
        <GameComplete level="1" game={game} score="" />;
    }


    const currentItem: GameDataItem | number = gameData[currentIndex];

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton
                    image={require("../assets/back.png")}
                    uniqueButtonStyling={styles.backBtnContainer}
                    onPressRoute={`/LevelChoice?game=${game}&playerId=${playerId}`}
                />
                <CharacterCard id={parseInt(playerId.toString())} customWidth={0.25} />
                <Text style={styles.title}>{game} - Level 1</Text>
                <ProgressBar fillPercent={(currentIndex / gameData.length) * 100} />

                <View style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Tap below to hear voiceover</Text>
                    <Image source={require("../assets/ear.png")} style={styles.ear} />
                </View>

                {doorOpened ? (
                    <TouchableOpacity onPress={() => setDoorOpened(false)} style={styles.cube}>
                        <Image source={getLocalExampleImage(currentItem?.letter ?? currentItem?.number ?? "")} style={styles.numberImage} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setDoorOpened(true)} style={styles.cube}>
                        <Image source={getLocalObjectImage(currentItem?.object ?? "")} style={styles.numberImage} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.buttonText}>Next →</Text>
                </TouchableOpacity>
            </View>
        </BackgroundLayout>

    );
};



const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
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
        marginTop: 10,
    },
    voiceoverText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#3E1911",
        textAlign: "center",
    },
    ear: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        marginLeft: 5,
    },
    cube: {
        width: 200,
        height: 250,
        borderRadius: 20,
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
        right: 200,
        zIndex: 0, // Moves it behind the main image
    },
    ovalShape: {
        width: 70,
        height: 150,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        position: "absolute",
        left: 350,
        top: 50,
        borderRadius: 50,
        zIndex: -1,  // Ensures it is behind everything
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 20,
        width: 45,
        height: 45,
        backgroundColor: "#C3E2E5",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    backIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#3E1911",
        textAlign: "center",
    },
    nextButton: {
        width: 100,
        height: 50,
        backgroundColor: "#C3E2E5",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#3E1911",
    },
    backBtnContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingVertical: 20
    }
});