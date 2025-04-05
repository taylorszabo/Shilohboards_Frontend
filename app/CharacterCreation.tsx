import * as React from "react";
import { StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import CharacterCard from "../reusableComponents/CharacterCard";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useEffect, useState } from "react";
import OptionCard from "../reusableComponents/OptionCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { characterOptions, bgColorOptions, isNameInvalid, isCharacterInvalid, isBgColorInvalid, maxCharacterNameLength, formatNameWithCapitals } from "../CharacterOptions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingMessage from "../reusableComponents/LoadingMessage";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";


export default function CharacterCreation() {
    const router = useRouter();
    const windowHeight = useWindowDimensions().height;
    const { isNewOrUpdateId } = useLocalSearchParams();
    const numberOfSteps = 3;

    const [characterCreated, setCharacterCreated] = useState({
        id: isNewOrUpdateId === "New"
            ? Math.floor(Math.random() * 1000000000000)
            : (isNewOrUpdateId ? parseInt(isNewOrUpdateId.toString()) : null),
        name: "",
        picture: "",
        bgColor: "",
    });

    const [parentId, setParentId] = useState<string | null>(null);
    const [processStep, setProcessStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [infoBeingVerified, setInfoBeingVerified] = useState<boolean>(false);

    useEffect(() => {
        const checkUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                router.push('/Login');
            }
        };
        checkUser();
    }, []);

    //--------------------------------------------------------------------------
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
                setCharacterCreated({
                    id: response.data.child_id || characterId,
                    name: response.data.profile_name,
                    picture: response.data.profile_image,
                    bgColor: response.data.profile_color,
                });
            }
        } catch (error) {
            console.error("Error fetching character profile:", error);
            router.replace("/error?message=Failed%20to%20load%20character%20profile");
        }
    }

    //--------------------------------------------------------------------------
    async function saveCharacter() {
        if (!parentId) {
            setErrorMessage("Error: Parent ID not found.");
            return;
        }

        if (!characterCreated.id) {
            setErrorMessage("Error: Character ID is missing.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            let isDuplicate = false;
            let children: any[] = [];

            try {
                const childrenRes = await axios.get(`${API_URL}/users/children/${parentId}`);
                children = childrenRes.data;
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    children = [];
                } else {
                    throw err;
                }
            }

            if (children.length > 0) {
                const profiles = await Promise.all(children.map(async (child: any) => {
                    try {
                        const res = await axios.get(`${API_URL}/users/profile/${child.profile_id}`);
                        return { ...res.data, child_id: child.id };
                    } catch {
                        return null;
                    }
                }));

                const formattedName = characterCreated.name.trim().toLowerCase();
                isDuplicate = profiles.some(profile =>
                    profile &&
                    profile.profile_name.trim().toLowerCase() === formattedName &&
                    profile.profile_image === characterCreated.picture &&
                    profile.profile_color === characterCreated.bgColor &&
                    profile.child_id !== characterCreated.id
                );
            }

            if (isDuplicate && isNewOrUpdateId === "New") {
                setErrorMessage("The character you are creating already exists.");
                setLoading(false);
                return;
            }

            const characterData = {
                child_id: String(characterCreated.id),
                profile_name: characterCreated.name,
                profile_image: characterCreated.picture,
                profile_color: characterCreated.bgColor,
            };

            if (isNewOrUpdateId === "New") {
                await axios.post(`${API_URL}/users/profile`, characterData);
                await axios.post(`${API_URL}/users/create-child`, {
                    parentId: parentId,
                    profileId: characterCreated.id,
                });
            } else {
                await axios.put(`${API_URL}/users/profile/${characterCreated.id}`, characterData);
            }

            router.push(`/MainMenu?playerId=${characterCreated.id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error saving character:", error.response?.data || error.message);
                router.replace("/error?message=Failed%20to%20save%20character%20profile");
            }
        } finally {
            setLoading(false);
        }

    }


    //--------------------------------------------------------------------------
    function verifyInformationEntered() {
        let missingInfo: boolean = false;
        setInfoBeingVerified(true);

        if (processStep === 1) {
            if (isNameInvalid(characterCreated.name) || isCharacterInvalid(characterCreated.picture)) {
                missingInfo = true;
            }
        }

        if (processStep === 2) {
            if (isBgColorInvalid(characterCreated.bgColor)) {
                missingInfo = true;
            }
        }

        if (!missingInfo) {
            setProcessStep((prev) => prev + 1);
            setCharacterCreated({ ...characterCreated, name: (characterCreated.name.trim()) }) //add formatNameWithCapitals in later once all temp data deleted in backend
            setInfoBeingVerified(false);
        }
    }

    //--------------------------------------------------------------------------
    return (
        <BackgroundLayout>
            <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
                <Text style={[styles.headerText, { fontSize: 35 }]}>

                    {processStep !== numberOfSteps ? `Let's ${isNewOrUpdateId === "New" ? "Create Your Character" : "Update Your Character"}` : "Character Review"}
                </Text>


                {/* Step 1 - Enter Name & Choose Character */}
                {processStep === 1 && (
                    <View style={styles.body}>
                        <Text style={[styles.instructionText, { fontSize: 25 }, infoBeingVerified && isNameInvalid(characterCreated.name) && {color: 'red'}]}>
                            Please enter your name:
                        </Text>
                        <TextInput
                            style={[styles.input, { fontSize: 20 }]}
                            value={characterCreated.name}
                            maxLength={maxCharacterNameLength}
                            onChangeText={(input) => setCharacterCreated({ ...characterCreated, name: input.replace(/[.*+?^${}()|[\]\\/@#%^&_=<>:;"`,~!]/g, "") })}
                        />
                        <Text style={{marginBottom: 20, width: '80%', textAlign: 'right', maxWidth: 500, color: '#3E1911'}}>2-{maxCharacterNameLength} characters</Text>

                        <Text style={[styles.instructionText, { fontSize: 25 }, infoBeingVerified && isCharacterInvalid(characterCreated.picture) && {color: 'red'}]}>
                            Please choose your character:
                        </Text>
                        <View style={styles.optionCardContainer}>
                            <View style={{gap: '3%', alignItems: 'flex-end', flex: 1}}>
                                {characterOptions.slice(0, characterOptions.length / 2).map((item) => (
                                    <OptionCard
                                        key={item.id}
                                        square={true}
                                        image={item.picture}
                                        functionToExecute={() => setCharacterCreated({ ...characterCreated, picture: item.id })}
                                        selected={item.id === characterCreated.picture}
                                    />
                                ))}
                            </View>

                            <View style={{gap: '3%', alignItems: 'flex-start', flex: 1}}>
                                {characterOptions.slice(characterOptions.length / 2).map((item) => (
                                    <OptionCard
                                        key={item.id}
                                        square={true}
                                        image={item.picture}
                                        functionToExecute={() => setCharacterCreated({ ...characterCreated, picture: item.id })}
                                        selected={item.id === characterCreated.picture}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 2 - Choose Background Color */}
                {processStep === 2 && (
                    <View style={styles.body}>
                        <Text style={[styles.instructionText, { fontSize: 25 }, infoBeingVerified && isBgColorInvalid(characterCreated.bgColor) && {color: 'red'}]}>
                            Please choose your background colour:
                        </Text>
                        <View style={styles.optionCardContainer}>
                            <View style={{gap: '3%', alignItems: 'flex-end', flex: 1}}>
                                {bgColorOptions.slice(0, bgColorOptions.length / 2).map((item) => (
                                    <OptionCard
                                        key={item}
                                        square={true}
                                        bgColor={item}
                                        functionToExecute={() => setCharacterCreated({ ...characterCreated, bgColor: item })}
                                        selected={item === characterCreated.bgColor}
                                        upperText=""
                                    />
                                ))}
                            </View>

                            <View style={{gap: '3%', alignItems: 'flex-start', flex: 1}}>
                                {bgColorOptions.slice(bgColorOptions.length / 2).map((item) => (
                                    <OptionCard
                                        key={item}
                                        square={true}
                                        bgColor={item}
                                        functionToExecute={() => setCharacterCreated({ ...characterCreated, bgColor: item })}
                                        selected={item === characterCreated.bgColor}
                                        upperText=""
                                    />
                                ))}
                            </View>
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
                            heightPercentNumber={50}
                        />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    </View>
                )}

                {/* Bottom Buttons */}
                <View style={styles.bottomBtns}>
                    {processStep === 1 ? (
                        <CustomButton text="Cancel" image={require("../assets/back.png")} uniqueButtonStyling={styles.backBtnContainer}  onPressRoute={`/SelectCharacter`} />
                    ) : (
                        <CustomButton text="Back" image={require("../assets/back.png")} uniqueButtonStyling={styles.backBtnContainer} functionToExecute={() => setProcessStep((prev) => prev - 1)} />
                    )}

                    {processStep === numberOfSteps ? (
                        loading ? (
                            <LoadingMessage smallVersion={true} oneRow={true} />
                        ) : (
                            <CustomButton
                                text={isNewOrUpdateId === "New" ? "Finish" : "Update"}
                                image={require("../assets/forward.png")}
                                uniqueButtonStyling={styles.forwardBtnContainer}
                                functionToExecute={() => saveCharacter()}
                            />
                        )
                    ) : (
                        <CustomButton 
                            text="Next" 
                            image={require("../assets/forward.png")} 
                            uniqueButtonStyling={styles.forwardBtnContainer}  
                            functionToExecute={() => verifyInformationEntered()} 
                            greyedOut={
                                processStep === 1 ?
                                isNameInvalid(characterCreated.name) || isCharacterInvalid(characterCreated.picture)
                                :
                                isBgColorInvalid(characterCreated.bgColor)
                            }
                        />
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
    position: 'relative',
  },
  headerText: {
    padding: 20,
    textAlign: 'center',
    fontWeight: 'bold',
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
    marginBottom: 20
  },
  input : {
    width: '80%',
    maxWidth: 500,
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 8,
    borderRightWidth: 2,
    borderBottomWidth: 3,
    borderColor: '#A9A9A9',
  },
  optionCardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: '3%',
    marginBottom: 20,
  },
  bottomBtns: {
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 700
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
    margin: 15,
    fontSize: 20,
  },
});