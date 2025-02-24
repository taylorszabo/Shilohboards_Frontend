import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
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

export default function GameOverScreen() {
    const router = useRouter();

    // Default values if no gameType and level are passed
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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{gameData?.message}</Text>
            <Text style={styles.text}>Game Type: {gameData?.gameType}</Text>
            <Text style={styles.text}>Level: {gameData?.level}</Text>
            <Text style={styles.text}>Score: {gameData?.score}</Text>
            <Text style={styles.text}>Accuracy: {gameData?.accuracy}</Text>
            <Text style={styles.text}>Rewards: {gameData?.rewardsEarned.join(", ")}</Text>

            <Button title="Play Again" onPress={() => router.push(`/LevelChoice?game=Alphabet`)} />
            <Button title="Go to Home" onPress={() => router.push("/MainMenu?playerName=Shiloh")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginVertical: 5,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
