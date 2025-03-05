import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useEffect, useState } from 'react';
import OptionCard from '../reusableComponents/OptionCard';
import { useLocalSearchParams, useRouter } from 'expo-router';

type CharacterBuild = {
    name: string;
    picture: string;
    bgColor: string;
};

type Character = {
    id: string;
    picture: any;
};

export default function CharacterCreation() {
    const router = useRouter();
    const { isNewOrUpdateId } = useLocalSearchParams(); //a new character or one being updated
    const numberOfSteps = 3 - 1;
    const [characterCreated, setCharacterCreated] = useState<CharacterBuild>({name: '' , picture: '', bgColor: ''});
    const [processStep, setProcessStep] = useState<number>(0);

    const characterOptions: Character[] = [
        {id: 'hotdog', picture: require('../assets/Alphabet/Images/Hotdog.png')},
        {id: 'flower', picture: require('../assets/Alphabet/Images/Flower.png')},
        {id: 'tree', picture: require('../assets/Alphabet/Images/Tree.png')},
        {id: 'whale', picture: require('../assets/Alphabet/Images/Whale.png')},
        {id: 'moon', picture: require('../assets/Alphabet/Images/Moon.png')},
        {id: 'penguin', picture: require('../assets/Alphabet/Images/Penguin.png')},
    ];

    const bgColorOptions: string[] = ['#C3E2E5', '#C0E3B9', '#FDFFB8', '#FFDDF6', '#FFD195', '#FFA3A3'];

    //--------------------------------------------------------------------------
    useEffect(() => {
        console.log(isNewOrUpdateId);
        // if (isNewOrUpdate !== "New" && isNewOrUpdate !== "Update") { //2nd part -- change to: check array of current user Id's stored to see if it's located/exists
        //     router.push('/SelectCharacter');
        //     console.log('Error: param passed to component CharacterCreation must be either "New" or "Update"');
        // }
    }, [isNewOrUpdateId]);

    //--------------------------------------------------------------------------
    function saveCharacter(characterCreated: CharacterBuild, isNew: boolean) {
        console.log(characterCreated);
        console.log(isNew);

        if (isNew) {
            //save new record with characterCreated info
            return;
        }

        //update a current record with characterCreated info
    }

    //--------------------------------------------------------------------------
    return (
        <BackgroundLayout>
            <View style={styles.container}> 
                    {/* ---------------------------- title ------------------------ */}
                    <Text style={[styles.headerText, { fontSize: RFPercentage(4.5) }]}>{processStep !== numberOfSteps ? "Let's Create Your Character:" : "Character Review"}</Text>

                    {/* -------------------------------------------------------- body ------------------------------------------------------ */}
                    {/* ======= STEP 1 ======= */}
                    {processStep === 0 &&
                        <View style={styles.body}>
                            {/* name */}
                            <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }]}>Please enter your name:</Text>
                            <TextInput 
                                style={[styles.input, { fontSize: RFPercentage(2.5) }]} 
                                value={characterCreated.name} 
                                onChangeText={(input) => setCharacterCreated({...characterCreated, name: input})} 
                            />

                            {/* character */}
                            <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }]}>Please choose your character:</Text>
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
                    {processStep === 1 && 
                        <View style={styles.body}>
                            {/* bg color */}
                            <Text style={[styles.instructionText, { fontSize: RFPercentage(3) }]}>Please choose your background colour:</Text>
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
                    {processStep === 2 && 
                        <View style={styles.body}>
                            {/* character review */}
                            <OptionCard 
                                customWidth={0.80} 
                                height={300} 
                                upperText = ''
                                lowerText={characterCreated.name}
                                bgColor={characterCreated.bgColor}
                                image={characterOptions.find(option => option.id === characterCreated.picture)?.picture}
                                disabled={true}
                            />
                        </View>
                    }

                    {/* ---------------------------- bottom buttons ------------------------ */}
                    <View style={styles.bottomBtns}>
                        {processStep === 0 ? 
                            <CustomButton text='Cancel' image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/SelectCharacter`}/>
                            :
                            <CustomButton text='Back' image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} functionToExecute={() => setProcessStep((prev) => prev - 1)}/>
                        }

                        {processStep === numberOfSteps ?
                            <CustomButton text='Finish' image={require('../assets/forward.png')} uniqueButtonStyling={styles.forwardBtnContainer} 
                                          onPressRoute={`/MainMenu?playerName=${characterCreated.name}`} functionToExecute={() => saveCharacter(characterCreated, isNewOrUpdateId === "New")}/>
                            :
                            <CustomButton text='Next' image={require('../assets/forward.png')} uniqueButtonStyling={styles.forwardBtnContainer} functionToExecute={() => setProcessStep((prev) => prev + 1)}/>
                        }
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
    flexDirection: 'row'
  }
});