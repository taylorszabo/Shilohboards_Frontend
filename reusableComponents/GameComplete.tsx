import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from './CustomButton';
import BackgroundLayout from "./BackgroundLayout";
import {useLocalSearchParams, useRouter} from "expo-router";
import CharacterCard from "./CharacterCard";
import ProgressBar from "./ProgressBar";
import {useEffect, useState} from "react";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function GameComplete(props: { game: string | string[], score: string, level: string }) {
    const router = useRouter();
    const { game, score, level } = props;
    const { playerId = '0' } = useLocalSearchParams();
    const showScore = level !== "1"; // Hide score for Level 1
    const [character, setCharacter] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to choose star image based on level
    const getStarImage = (level: string) => {
        if (level === "1") return require('../assets/GameOverStar-Silver.png');
        if (level === "2") return require('../assets/GameOverStar.png');
        if (level === "3") return require('../assets/GameOverStar-Purple.png');
        return require('../assets/GameOverStar.png'); // fallback image incase of errors
    };

    // Function to Save Star Count Correctly
    const saveStarCount = async () => {
        try {
            let category = Array.isArray(game) ? game[0] : game;

            // Normalize "Alphabet" to "Letters"
            if (category === "Alphabet") {
                category = "Letters";
            }

            if (!["Letters", "Numbers"].includes(category)) {
                console.warn("⚠️ Invalid category detected:", category);
                return;
            }

            const key = `${category}_level${level}_count`; // Store correctly under Letters or Numbers
            const currentCount = await AsyncStorage.getItem(key);
            const newCount = currentCount ? parseInt(currentCount) + 1 : 1; // Always increment by 1

            await AsyncStorage.setItem(key, newCount.toString());

            console.log(`✅ Saved ${newCount} stars for ${category} Level ${level}`);
        } catch (error) {
            console.error("❌ Error saving star count:", error);
        }
    };

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

    // Call function when game completes
    React.useEffect(() => {
        saveStarCount();
    }, []);

    return (
        <BackgroundLayout>
            {character ? (
                <View style={styles.textContainer}>
                    <CharacterCard
                        id={character.id}
                        name={character.profile_name}
                        image={characterOptions.find(option => option.id === character.profile_image)?.picture}
                        bgColor={bgColorOptions.includes(character.profile_color) ? character.profile_color : "#FFFFFF"}
                        customWidth={0.25}
                    />

                    <Text style={styles.headerText}>{game} - Level {level}</Text>

                    <ProgressBar fillPercent={100} />

                    <Text style={[styles.textCSS, { fontSize: 35 }]}>Game Complete!</Text>
                    {showScore && <Text style={styles.textCSS}>Score {score}</Text>}
                    <Text style={styles.textCSS}>You've earned 1 star!</Text>
                    
                    {/* Updated image line */}
                    <Image source={getStarImage(level)} style={styles.starImg} />

                    <CustomButton text='Main Menu' onPressRoute={`/MainMenu?playerId=${playerId}`} uniqueButtonStyling={styles.submitBtnContainer}/>
                </View>
            ) : (
                <Text style={styles.textCSS}>Loading character...</Text>
            )}
        </BackgroundLayout>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    textContainer: {
        alignItems: 'center',
        flex: 1
    },
    textCSS: {
        fontWeight: 'bold',
        paddingVertical: 10,
        fontSize: 24,
        color: '#3E1911',
    },
    starImg: {
        marginTop: 30,
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    submitBtnContainer: {
        alignSelf: 'center',
        marginTop: 'auto', 
        padding: 10
    },
    headerText: {
        verticalAlign: 'middle',
        padding: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        color: '#3E1911',
    },
});
