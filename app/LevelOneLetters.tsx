import React, { useState, useEffect } from "react";
import {  
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ImageBackground
} from "react-native";
import { Audio } from "expo-av";
import CharacterCard from "../reusableComponents/CharacterCard";


import { router } from "expo-router";
import LevelOneLetters from "./LevelOneLetters";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from "../reusableComponents/ProgressBar";


export const LevelOne = () => {
    const { game = '[game]', playerId = '0' } = useLocalSearchParams();
    const [doorOpened, setDoorOpened] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [progress, setProgress] = useState(0); // Tracks progress

    // Array of images for the closed door
    const doorImages = [
        require("../assets/Alphabet/Letters/A.png"),
        require("../assets/Alphabet/Letters/B.png"),
        require("../assets/Alphabet/Letters/C.png"),
        require("../assets/Alphabet/Letters/D.png"),
        require("../assets/Alphabet/Letters/E.png"), 
        require("../assets/Alphabet/Letters/F.png"),
        require("../assets/Alphabet/Letters/G.png"),
        require("../assets/Alphabet/Letters/H.png"),
        require("../assets/Alphabet/Letters/I.png"),
        require("../assets/Alphabet/Letters/J.png"),
        require("../assets/Alphabet/Letters/K.png"),
        require("../assets/Alphabet/Letters/L.png"),
        require("../assets/Alphabet/Letters/M.png"),
        require("../assets/Alphabet/Letters/N.png"),
        require("../assets/Alphabet/Letters/O.png"),
        require("../assets/Alphabet/Letters/P.png"),
        require("../assets/Alphabet/Letters/Q.png"),
        require("../assets/Alphabet/Letters/R.png"),
        require("../assets/Alphabet/Letters/S.png"),
        require("../assets/Alphabet/Letters/T.png"),
        require("../assets/Alphabet/Letters/U.png"),
        require("../assets/Alphabet/Letters/V.png"),
        require("../assets/Alphabet/Letters/W.png"),
        require("../assets/Alphabet/Letters/X.png"),
        require("../assets/Alphabet/Letters/Y.png"),
        require("../assets/Alphabet/Letters/Z.png"),

        
    ];

    // Array of images for the opened door
    const doorOpenedImages = [
        require("../assets/Alphabet/Images/Apple.png"),
        require("../assets/Alphabet/Images/Balloons.png"),
        require("../assets/Alphabet/Images/Car.png"),
        require("../assets/Alphabet/Images/Drum.png"),
        require("../assets/Alphabet/Images/Egg.png"),
        require("../assets/Alphabet/Images/Flower.png"),
        require("../assets/Alphabet/Images/Guitar.png"),
        require("../assets/Alphabet/Images/Hotdog.png"),
        require("../assets/Alphabet/Images/Igloo.png"),
        require("../assets/Alphabet/Images/Jam.png"),
        require("../assets/Alphabet/Images/Kite.png"),
        require("../assets/Alphabet/Images/Leaf.png"),
        require("../assets/Alphabet/Images/Moon.png"),
        require("../assets/Alphabet/Images/Nest.png"),
        require("../assets/Alphabet/Images/Orange.png"),
        require("../assets/Alphabet/Images/Penguin.png"),
        require("../assets/Alphabet/Images/Queen.png"),
        require("../assets/Alphabet/Images/Rainbow.png"),
        require("../assets/Alphabet/Images/Sun.png"),
        require("../assets/Alphabet/Images/Tree.png"),
        require("../assets/Alphabet/Images/Umbrella.png"),
        require("../assets/Alphabet/Images/Violin.png"),
        require("../assets/Alphabet/Images/Whale.png"),
        require("../assets/Alphabet/Images/Xray.png"),
        require("../assets/Alphabet/Images/Yarn.png"),
        require("../assets/Alphabet/Images/Zip.png")


    ];

    // Array of sounds corresponding to the numbers
    const numberSounds = [
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
        require("../assets/Sounds/correctSound.mp3"),
    
    ];
    const totalQuestions = doorImages.length; // Total for progress calculation

    const handleNext = () => {
        setDoorOpened(false);
        setImageIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % totalQuestions;
            setProgress(((nextIndex + 1) / totalQuestions) * 100); // Update progress dynamically
            return nextIndex;
            
        });
    };

    async function playAudio() {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(numberSounds[imageIndex]);
        setSound(newSound);
        await newSound.playAsync();
    }

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/LevelChoice?game=${game}&playerId=${playerId}`}/>
                <CharacterCard id={parseInt(playerId.toString())} customWidth={0.25}/>

                <Text style={styles.title}>Letters - Level 1</Text>

                <ProgressBar fillPercent={progress}/>

                <View style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Tap below to hear voiceover</Text>
                    <TouchableOpacity onPress={playAudio}>
                        <Image source={require("../assets/ear.png")} style={styles.ear} />
                    </TouchableOpacity>
                </View>

                {doorOpened ? (
                    <TouchableOpacity onPress={() => setDoorOpened(false)} style={styles.stackedCubeContainer}>
                        <View style={styles.cube}>
                            <Image 
                                source={doorOpenedImages[imageIndex]}
                                style={styles.numberImage} 
                            />
                        </View>
                        <View style={styles.cubeBackContainer}>
                            <View style={styles.cube}></View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.cube} onPress={() => setDoorOpened(true)}>
                        <Image 
                            source={doorImages[imageIndex]}  
                            style={styles.numberImage} 
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Swipe left to open door</Text>
                    <Image source={require("../assets/swipe.png")} style={styles.ear} />
                </View>

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
        overflow: 'visible',
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
        position: "relative",
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

export default LevelOne;
