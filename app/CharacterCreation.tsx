import * as React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useEffect, useState } from 'react';
import OptionCard from '../reusableComponents/OptionCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { tempCharacterArray } from "../CharacterOptions";
import { CharacterBuild, Character, characterOptions, bgColorOptions } from "../CharacterOptions";

//=============================================================================================================
export default function CharacterCreation() {
    const router = useRouter();
    const windowHeight = useWindowDimensions().height;
    const { isNewOrUpdateId } = useLocalSearchParams(); //a new character or one being updated
    const numberOfSteps = 3;
    const [characterCreated, setCharacterCreated] = useState<CharacterBuild>({id: isNewOrUpdateId === "New" ? tempCharacterArray.length : parseInt(isNewOrUpdateId.toString()), name: '' , picture: '', bgColor: ''});
    const [processStep, setProcessStep] = useState<number>(1);
    const [infoBeingVerified, setInfoBeingVerified] = useState<boolean>(false);

    //--------------------------------------------------------------------------
    //Error check
    useEffect(() => {
        console.log(isNewOrUpdateId);
        // if (isNewOrUpdate !== "New" && isNewOrUpdate !== "Update") { //2nd part -- change to: check array of current user Id's stored to see if it's located/exists
        //     router.push('/SelectCharacter');
        //     console.log('Error: param passed to component CharacterCreation must be either "New" or an Id to "Update"');
        // }
    }, [isNewOrUpdateId]);

    //--------------------------------------------------------------------------
    function saveCharacter(characterCreated: CharacterBuild, isNew: boolean) {
        console.log(characterCreated);
        console.log(isNew);

        if (isNew) {
            //save new record with characterCreated info
            tempCharacterArray.push(characterCreated);
        } else {
            //update a current record with characterCreated info
        }

        router.push(`/MainMenu?playerId=${characterCreated.id}`);
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
            if (!bgColorOptions.find(option => option === characterCreated.bgColor)) {
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
                    {/* ---------------------------- title ------------------------ */}
                    <Text style={[styles.headerText, { fontSize: RFPercentage(4.5) }]}>{processStep !== numberOfSteps ? "Let's Create Your Character:" : "Character Review"}</Text>

                    {/* -------------------------------------------------------- body ------------------------------------------------------ */}
                    {/* ======= STEP 1 ======= */}
                    {processStep === 1 &&
                        <View style={styles.body}>
                            {/* name */}
                            <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }, infoBeingVerified && characterCreated.name.trim().length < 2 && {color: 'red'}]}>
                                Please enter your name:
                            </Text>
                            <TextInput 
                                style={[styles.input, { fontSize: RFPercentage(2.5) }]} 
                                value={characterCreated.name} 
                                onChangeText={(input) => setCharacterCreated({...characterCreated, name: input})} 
                            />

                            {/* character */}
                            <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }, infoBeingVerified && !characterOptions.find(option => option.id === characterCreated.picture) && {color: 'red'}]}>
                                Please choose your character:
                            </Text>
                            <View style={styles.optionCardContainer}>                
                                {characterOptions.map((item: Character, index) => (
                                    <View key={index}> 
                                        <OptionCard 
                                            customWidth={0.35} 
                                            height={135} 
                                            image={item.picture} 
                                            functionToExecute={() => setCharacterCreated({...characterCreated, picture: item.id})}
                                            selected={item.id === characterCreated.picture}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    }

                    {/* ======= STEP 2 ======= */}
                    {processStep === 2 && 
                        <View style={styles.body}>
                            {/* bg color */}
                            <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }, infoBeingVerified && !bgColorOptions.find(option => option === characterCreated.bgColor) && {color: 'red'}]}>
                                Please choose your background colour:
                            </Text>
                            <View style={styles.optionCardContainer}>                
                                {bgColorOptions.map((item: string, index) => (
                                    <View key={index}> 
                                        <OptionCard 
                                            customWidth={0.35} 
                                            height={135} 
                                            upperText = ''
                                            bgColor={item}
                                            functionToExecute={() => setCharacterCreated({...characterCreated, bgColor: item})}
                                            selected={item === characterCreated.bgColor}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    }

                    {/* ======= STEP 3 ======= */}
                    {processStep === 3 && 
                        <View style={styles.body}>
                            {/* character review */}
                            <CharacterCard 
                                name={characterCreated.name} 
                                image={characterOptions.find(option => option.id === characterCreated.picture)?.picture} 
                                bgColor={characterCreated.bgColor} 
                                customWidth={0.8}
                            />
                        </View>
                    }

                    {/* ---------------------------- bottom buttons ------------------------ */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        enabled={false}
                        style={styles.bottomBtns}
                    >
                        {processStep === 1 ? 
                            <CustomButton text='Cancel' image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/SelectCharacter`}/>
                            :
                            <CustomButton text='Back' image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} functionToExecute={() => setProcessStep((prev) => prev - 1)}/>
                        }

                        {processStep === numberOfSteps ?
                            <CustomButton text='Finish' image={require('../assets/forward.png')} uniqueButtonStyling={styles.forwardBtnContainer} 
                                          functionToExecute={() => saveCharacter(characterCreated, isNewOrUpdateId === "New")}/>
                            :
                            <CustomButton text='Next' image={require('../assets/forward.png')} uniqueButtonStyling={styles.forwardBtnContainer} functionToExecute={() => verifyInformationEntered()}/>
                        }
                    </KeyboardAvoidingView>

                    {/* <View style={styles.bottomBtns}>
                        {processStep === 1 ? 
                            <CustomButton text='Cancel' image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/SelectCharacter`}/>
                            :
                            <CustomButton text='Back' image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} functionToExecute={() => setProcessStep((prev) => prev - 1)}/>
                        }

                        {processStep === numberOfSteps ?
                            <CustomButton text='Finish' image={require('../assets/forward.png')} uniqueButtonStyling={styles.forwardBtnContainer} 
                                          functionToExecute={() => saveCharacter(characterCreated, isNewOrUpdateId === "New")}/>
                            :
                            <CustomButton text='Next' image={require('../assets/forward.png')} uniqueButtonStyling={styles.forwardBtnContainer} functionToExecute={() => verifyInformationEntered()}/>
                        }
                    </View> */}
                
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
    //marginTop: 'auto',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtnContainer: {
    flexDirection: 'row-reverse'
  },
  forwardBtnContainer: {
    flexDirection: 'row'
  }
});