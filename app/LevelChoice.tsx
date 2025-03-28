import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions, // 🔹 For responsive spacing
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize"; // 🔹 For responsive fonts
import CharacterCard from "../reusableComponents/CharacterCard";
import OptionCard from "../reusableComponents/OptionCard";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "../reusableComponents/CustomButton";
import axios from "axios";
import { characterOptions, bgColorOptions } from "../CharacterOptions";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

const { width, height } = Dimensions.get("window"); // 🔹 Responsive layout base

export default function LevelChoice() {
  const { game = "[game]", playerId = "0" } = useLocalSearchParams();
  const router = useRouter();

    const [character, setCharacter] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCharacterProfile = async () => {
            if (!playerId || playerId === "0") {
                router.replace("/error?message=Failed%20to%20load%20character%20profile");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/users/profile/${playerId}`);
                if (response.data) {
                    setCharacter(response.data);
                } else {
                    router.replace("/error?message=Failed%20to%20load%20character%20profile");
                }
            } catch (error) {
                console.error("Error fetching character profile:", error);
                router.replace("/error?message=Failed%20to%20load%20character%20profile");
            } finally {
                setLoading(false);
            }
        };

    fetchCharacterProfile();
  }, [playerId, router]);

    if (loading || !character) {
        return (<BackgroundLayout><ActivityIndicator size="large" color="#0000ff" /></BackgroundLayout>)
    }
    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton image={require("../assets/back.png")} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?playerId=${playerId}`} />
                    <>
                        <CharacterCard
                            id={character.id}
                            name={character.profile_name}
                            image={characterOptions.find(option => option.id === character.profile_image)?.picture}
                            bgColor={bgColorOptions.includes(character.profile_color) ? character.profile_color : "#FFFFFF"}
                            customWidth={0.3}
                        />

            <Text style={styles.headerText}>Choose a level for the {game} Activity:</Text>

                        <View style={styles.cardDiv}>
                            <OptionCard upperText="Level 1" customWidth={0.8} onPressRoute={`/LevelOne?game=${game}&playerId=${playerId}`} />
                            <OptionCard upperText="Level 2" customWidth={0.8} onPressRoute={`/LevelTwo?game=${game}&playerId=${playerId}`} />
                            {game === "Alphabet" && (
                                <OptionCard upperText="Level 3" customWidth={0.8} onPressRoute={`/LevelThree?game=${game}&playerId=${playerId}`} />
                            )}
                        </View>
                    </>
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
    alignItems: "center",
    paddingTop: height * 0.08, // Balanced top spacing
    paddingHorizontal: width * 0.05,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: RFPercentage(3.2), // Responsive font size
    color: "#3E1911",
    marginVertical: height * 0.03, // Vertical spacing for balance
  },
  cardDiv: {
    gap: height * 0.025, 
    marginTop: height * 0.02, 
  },
  backBtnContainer: {
    position: "absolute",
    top: height * 0.02, 
    left: width * 0.03,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: RFPercentage(2.4),
    marginTop: height * 0.04,
    paddingHorizontal: width * 0.08,
    fontWeight: "500", 
  },
});
