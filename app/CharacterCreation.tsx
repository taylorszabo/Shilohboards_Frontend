import * as React from "react";
import { StyleSheet, Text, TextInput, View, useWindowDimensions, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import CharacterCard from "../reusableComponents/CharacterCard";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useEffect, useState } from "react";
import OptionCard from "../reusableComponents/OptionCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend API URL
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function CharacterCreation() {
    const router = useRouter();
    const windowHeight = useWindowDimensions().height;
    const { isNewOrUpdateId } = useLocalSearchParams();
    const numberOfSteps = 3;

    const [characterCreated, setCharacterCreated] = useState({
        id: isNewOrUpdateId === "New" ? Math.floor(Math.random() * 1000000000000) : parseInt(isNewOrUpdateId.toString()),
        name: "",
        picture: "",
        bgColor: "",
    });

    const [parentId, setParentId] = useState<string | null>(null); // Stores logged-in user's ID
    const [processStep, setProcessStep] = useState<number>(1);
    const [infoBeingVerified, setInfoBeingVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    //--------------------------------------------------------------------------
    // Load existing character data from Firebase if updating
    useEffect(() => {
        const fetchParentId = async () => {
            const userId = await AsyncStorage.getItem("userId");
            if (userId) setParentId(userId);
        };

        fetchParentId();

        if (isNewOrUpdateId !== "New") {
            fetchCharacterFromDatabase(parseInt(isNewOrUpdateId.toString()));
        }
    }, [isNewOrUpdateId]);

    async function fetchCharacterFromDatabase(characterId: number) {
        try {
            const response = await axios.get(`${API_URL}/users/profile/${characterId}`);
            if (response.data) {
                setCharacterCreated(response.data);
            }
        } catch (error) {
            console.error("Error fetching character:", error);
            setErrorMessage("Failed to load character data.");
        }
    }

    //--------------------------------------------------------------------------
    async function saveCharacter() {
        if (!parentId) {
            setErrorMessage("Error: Parent ID not found.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const characterData = {
                child_id: characterCreated.id.toString(),
                profile_name: characterCreated.name,
                profile_image: characterCreated.picture,
                profile_color: characterCreated.bgColor
            };

            await axios.post(`${API_URL}/users/profile`, characterData);


            await axios.post(`${API_URL}/users/create-child`, {
                parentId: parentId,
                profileId: characterCreated.id,
            });

            router.push(`/MainMenu?playerId=${characterCreated.id}`);
        } catch (error) {
            console.error("Error saving character or creating child:", error);
            setErrorMessage("Failed to save character. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    //--------------------------------------------------------------------------
    function verifyInformationEntered() {
        let missingInfo: boolean = false;
        setInfoBeingVerified(true);

        if (processStep === 1) {
            if (characterCreated.name.trim().length < 2 || !characterOptions.find(option => option.id === characterCreated.picture)) {
                missingInfo = true;
            }
        }

        if (processStep === 2) {
            if (!bgColorOptions.includes(characterCreated.bgColor)) {
                missingInfo = true;
            }
        }

        if (!missingInfo) {
            setProcessStep((prev) => prev + 1);
            setInfoBeingVerified(false);
        }
    }

    //--------------------------------------------------------------------------
    return (
        <BackgroundLayout>
            <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
                <Text style={[styles.headerText, { fontSize: RFPercentage(4.5) }]}>
                    {processStep !== numberOfSteps ? "Let's Create Your Character:" : "Character Review"}
                </Text>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                {/* Step 1 - Enter Name & Choose Character */}
                {processStep === 1 && (
                    <View style={styles.body}>
                        <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }]}>Please enter your name:</Text>
                        <TextInput
                            style={[styles.input, { fontSize: RFPercentage(2.5) }]}
                            value={characterCreated.name}
                            onChangeText={(input) => setCharacterCreated({ ...characterCreated, name: input })}
                        />

                        <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }]}>Please choose your character:</Text>
                        <View style={styles.optionCardContainer}>
                            {characterOptions.map((item) => (
                                <OptionCard
                                    key={item.id}
                                    customWidth={0.35}
                                    height={135}
                                    image={item.picture}
                                    functionToExecute={() => setCharacterCreated({ ...characterCreated, picture: item.id })}
                                    selected={item.id === characterCreated.picture}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2 - Choose Background Color */}
                {processStep === 2 && (
                    <View style={styles.body}>
                        <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }]}>Please choose your background colour:</Text>
                        <View style={styles.optionCardContainer}>
                            {bgColorOptions.map((item) => (
                                <OptionCard
                                    key={item}
                                    customWidth={0.35}
                                    height={135}
                                    bgColor={item}
                                    functionToExecute={() => setCharacterCreated({ ...characterCreated, bgColor: item })}
                                    selected={item === characterCreated.bgColor}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 3 - Character Review */}
                {processStep === 3 && (
                    <View style={styles.body}>
                        <CharacterCard
                            name={characterCreated.name}
                            image={characterOptions.find((option) => option.id === characterCreated.picture)?.picture}
                            bgColor={characterCreated.bgColor}
                            customWidth={0.8}
                        />
                    </View>
                )}

                {/* Bottom Buttons */}
                <View style={styles.bottomBtns}>
                    {processStep === 1 ? (
                        <CustomButton text="Cancel" image={require("../assets/back.png")} onPressRoute={`/SelectCharacter`} />
                    ) : (
                        <CustomButton text="Back" image={require("../assets/back.png")} functionToExecute={() => setProcessStep((prev) => prev - 1)} />
                    )}

                    {processStep === numberOfSteps ? (
                        loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <CustomButton
                                text="Finish"
                                image={require("../assets/forward.png")}
                                functionToExecute={() => saveCharacter()}
                            />
                        )
                    ) : (
                        <CustomButton text="Next" image={require("../assets/forward.png")} functionToExecute={() => verifyInformationEntered()} />
                    )}
                </View>
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
  headerText: {
    padding: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 36,
    color: '#3E1911',
  },
  body: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  instructionText : {
    fontWeight: 'bold',
    color: '#3E1911',
    textAlign: 'center',
    marginBottom: '5%'
  },
  input : {
    width: '80%',
    backgroundColor: 'white',
    padding: '3%',
    marginBottom: '5%',
    borderRadius: 8,
    borderRightWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#A9A9A9',
  },
  optionCardContainer: {
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '3%',
  },
  bottomBtns: {
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtnContainer: {
    flexDirection: 'row-reverse'
  },
  forwardBtnContainer: {
    flexDirection: 'row',
  },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
});