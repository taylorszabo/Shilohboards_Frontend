import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

type GameOverData = {
    message: string;
    gameType: string;
    level: number;
    score: number;
    accuracy: string;
    rewardsEarned: string[];
};

const capitalizeSentence = (sentence: string | undefined) => {
    if (!sentence) return '';
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

export default function GameOverScreen() {
    const router = useRouter();


    const defaultGameType = "alphabet";
    const defaultLevel = 1;

    const [gameData, setGameData] = useState<GameOverData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/game-over?gameType=${defaultGameType}&level=${defaultLevel}`)
            .then((response) => {
                setGameData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching game data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <ImageBackground
            source={require("../assets/background.png")}
            style={styles.background}
            resizeMode="cover"
        >

            <TouchableOpacity style={styles.backButton} onPress={() => console.log("Back Clicked")}>
                <Image source={require("../assets/back.png")} style={styles.backIcon} />
            </TouchableOpacity>


            <View style={styles.container}>

                <View style={styles.nameBox}>
                    <Image
                        source={require("../assets/Hotdog.png")}
                        style={styles.hotdog}
                    />
                    <Text style={styles.nameText}>Shiloh</Text>
                </View>

                <Text style={styles.title}>{capitalizeSentence(gameData?.gameType) + ' - ' + gameData?.level}</Text>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                        <View style={styles.progressBarFill} />
                    </View>
                </View>

                <Text style={styles.title}>{gameData?.message}</Text>
                <Text style={styles.text}>Score: {gameData?.score}/26</Text>
                <Text style={styles.text}>You earned {gameData?.rewardsEarned.length} {gameData?.rewardsEarned.join(", ")!}</Text>

                <View>
                    <Image
                        source={require("../assets/Star.png")}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/LevelChoice?game=Alphabet')}
                    >
                        <Text style={styles.buttonText}>Play Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/MainMenu?playerName=Shiloh')}
                    >
                        <Text style={styles.buttonText}>Main Menu</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    progressBar: {
        width: "100%",
        height: "100%",
        backgroundColor: "#E3D1B9",
    },
    progressBarContainer: {
        width: 351,
        height: 18,
        backgroundColor: "#E3D1B9",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#3E1911",
        overflow: "hidden",
    },

    progressBarFill: {
        width: "100%",
        height: "100%",
        backgroundColor: "#6B3E26",
        borderRadius: 50,
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 50,
        width: "100%",
    },
    text: {
        fontSize: 25,
        fontWeight: "700",
        color: "#3E1911",
        textAlign: "center",
    },
    nameBox: {
        width: 113,
        height: 107,
        backgroundColor: "#C0E3B9",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    hotdog: {
        width: 60,
        height: 40,
        resizeMode: "contain",
        position: "absolute",
        top: 15,
    },
    nameText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#3E1911",
        marginTop: 50,
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
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
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
    bottomContainer: {
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        width: 150,
        height: 61,
        backgroundColor: "#C3E2E5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        marginHorizontal: 20,

    },
    buttonText: {
        color: "#3E1911",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
    },
});
