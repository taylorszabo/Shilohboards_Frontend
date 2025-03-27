import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import CharacterCard from "../reusableComponents/CharacterCard";
import OptionCard from "../reusableComponents/OptionCard";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "../reusableComponents/CustomButton";
import axios from "axios";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import LoadingMessage from "../reusableComponents/LoadingMessage";


const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function LevelChoice() {
    const { game = "[game]", playerId = "0" } = useLocalSearchParams();
    const router = useRouter();

    const [character, setCharacter] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const fetchCharacterProfile = async () => {
            if (!playerId || playerId === "0") {
                router.replace("/SelectCharacter");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/users/profile/${playerId}`);
                if (response.data) {
                    setCharacter(response.data);
                } else {
                    router.replace("/SelectCharacter");
                }
            } catch (error) {
                console.error("Error fetching character profile:", error);
                setErrorMessage("Failed to load character. Redirecting...");
                setTimeout(() => router.replace("/SelectCharacter"), 2000);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacterProfile();
    }, [playerId, router]);

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton image={require("../assets/back.png")} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?playerId=${playerId}`} />

                {loading ? (
                    <LoadingMessage />
                ) : character ? (
                    <>
                        <CharacterCard
                            id={character.id}
                            name={character.profile_name}
                            image={characterOptions.find(option => option.id === character.profile_image)?.picture}
                            bgColor={bgColorOptions.includes(character.profile_color) ? character.profile_color : "#FFFFFF"}
                            heightPercentNumber={15}
                        />

                        <Text style={styles.headerText}>Choose a level for the {game} Activity:</Text>

                        <View style={[styles.cardDiv, game === "Alphabet" ? {flex: 0.6} : {flex: 0.4}]}>
                            <OptionCard upperText="Level 1" square={false} onPressRoute={`/LevelOne?game=${game}&playerId=${playerId}`} />
                            <OptionCard upperText="Level 2" square={false} onPressRoute={`/LevelTwo?game=${game}&playerId=${playerId}`} />
                            {game === "Alphabet" && (
                                <OptionCard upperText="Level 3" square={false} onPressRoute={`/LevelThree?game=${game}&playerId=${playerId}`} />
                            )}
                        </View>
                    </>
                ) : (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}
            </View>
        </BackgroundLayout>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: "center",
    },
    headerText: {
        verticalAlign: "middle",
        padding: 20,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
        color: "#3E1911",
    },
    cardDiv: {
        gap: 15,
        width: '100%',
        alignItems: "center",
        maxWidth: 600
    },
    backBtnContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        paddingVertical: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        fontSize: 18,
        marginTop: 20,
    },
});
