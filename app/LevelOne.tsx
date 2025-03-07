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
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { useLocalSearchParams } from 'expo-router';
import CustomButton from "../reusableComponents/CustomButton";
import ProgressBar from "../reusableComponents/ProgressBar";

export const LevelOne = () => {
    const { game = '[game]', playerId = '0' } = useLocalSearchParams();
    const [doorOpened, setDoorOpened] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [progress, setProgress] = useState(0); // Tracks progress

    // Array of images for the closed door
    const doorImages = [
        require("../assets/Numbers/Digits/1.png"),
        require("../assets/Numbers/Digits/2.png"),
        require("../assets/Numbers/Digits/3.png"),
        require("../assets/Numbers/Digits/4.png"),
        require("../assets/Numbers/Digits/5.png"),
        require("../assets/Numbers/Digits/6.png"),
        require("../assets/Numbers/Digits/7.png"),
        require("../assets/Numbers/Digits/8.png"),
        require("../assets/Numbers/Digits/9.png"),
        require("../assets/Numbers/Digits/10.png"),
        require("../assets/Numbers/Digits/11.png"),
        require("../assets/Numbers/Digits/12.png"),
        require("../assets/Numbers/Digits/13.png"),
        require("../assets/Numbers/Digits/14.png"),
        require("../assets/Numbers/Digits/15.png"),
        require("../assets/Numbers/Digits/16.png"),
        require("../assets/Numbers/Digits/17.png"),
        require("../assets/Numbers/Digits/18.png"),
        require("../assets/Numbers/Digits/19.png"),
        require("../assets/Numbers/Digits/20.png"),
    ];

    // Array of images for the opened door
    const doorOpenedImages = [
        require("../assets/Numbers/Images/1-Car.png"),
        require("../assets/Numbers/Images/2-Shoes.png"),
        require("../assets/Numbers/Images/3-Guitars.png"),
        require("../assets/Numbers/Images/4-Icecreams.png"),
        require("../assets/Numbers/Images/5-Stars.png"),
        require("../assets/Numbers/Images/6-Eggs.png"),
        require("../assets/Numbers/Images/7-Bananas.png"),
        require("../assets/Numbers/Images/8-Crayons.png"),
        require("../assets/Numbers/Images/9-Spoons.png"),
        require("../assets/Numbers/Images/10-Apples.png"),
        require("../assets/Numbers/Images/11-Jellyfish.png"),
        require("../assets/Numbers/Images/12-Hats.png"),
        require("../assets/Numbers/Images/13-Balloons.png"),
        require("../assets/Numbers/Images/14-Socks.png"),
        require("../assets/Numbers/Images/15-Trees.png"),
        require("../assets/Numbers/Images/16-Penguins.png"),
        require("../assets/Numbers/Images/17-Shells.png"),
        require("../assets/Numbers/Images/18-Sweets.png"),
        require("../assets/Numbers/Images/19-Books.png"),
        require("../assets/Numbers/Images/20-Cupcakes.png"),
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

                <Text style={styles.title}>Numbers - Level 1</Text>

               {/* Progress Bar - Updated to Move on "Next" */}
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
                            <View style={styles.ovalShape} />
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
    ovalShape: {
        width: 70, 
        height: 150, 
        backgroundColor: "rgba(0, 0, 0, 0.2)", 
        position: "absolute",
        left: 350, 
        top: 50,
        borderRadius: 50, 
        zIndex: -1,  // Ensures it is behind everything
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
