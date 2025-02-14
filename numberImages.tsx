import React from "react";
import {  
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ImageBackground
} from "react-native";

export const Numbers1 = () => {
    return (
        <ImageBackground 
            source={require("./assets/background.png")}
            style={styles.background}
            resizeMode="cover" 
        >
            {/* Back Button - Positioned at Top Left */}
            <TouchableOpacity style={styles.backButton} onPress={() => console.log("Back Clicked")}>
                <Image source={require("./assets/back.png")} style={styles.backIcon} />
            </TouchableOpacity>

            {/* Full-Screen Container */}
            <View style={styles.container}>
                
                {/* Green Box with Image */}
                <View style={styles.nameBox}>
                    <Image 
                        source={require("./assets/hotdog.png")}  
                        style={styles.hotdog}
                    />
                    <Text style={styles.nameText}>Shiloh</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>Numbers - Level 1</Text>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                        <View style={styles.progressBarFill} />
                    </View>
                </View>

                {/* Voiceover Section */}
                <View style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Tap below to hear voiceover</Text>
                    <Image source={require("./assets/ear.png")} style={styles.ear} />
                </View>

                <View style={styles.stackedCubeContainer}>
    {/* Top Cube (Door) */}
    <View style={styles.cube}>
        <Image 
            source={require("./assets/1-Car.png")}  
            style={styles.numberImage} 
        />
    </View>

    {/* Bottom Cube (Back Panel) */}
    <View style={styles.cubeBackContainer}>
        <View style={styles.ovalShape} />
        <View style={styles.cube}>
          
        </View>
    </View>
</View>

   {/* Voiceover Section */}
   <View style={styles.voiceoverContainer}>
                    <Text style={styles.voiceoverText}>Swipe left to open door</Text>
                    <Image source={require("./assets/swipe.png")} style={styles.ear} />
                </View>
                {/* Next Button */}
                <TouchableOpacity style={styles.button} onPress={() => console.log("Next Clicked")}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
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
        paddingVertical: 50,
        width: "100%",
    },
    progressBar: {
        width: "100%",
        height: "100%",
        backgroundColor: "#E3D1B9",
    },
    progressBarContainer: {
        width: 351,
        height: 18,
        backgroundColor: "#E3D1B9", // Light brown background
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#3E1911",
        overflow: "hidden", // Ensures progress stays within rounded edges
    },
    
    progressBarFill: {
        width: "10%",  // Adjust progress level (smaller value)
        height: "100%",
        backgroundColor: "#6B3E26", // Dark brown fill
        borderRadius: 50,
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

   stackedCubeContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    left: 50,
},

cubeBackContainer: {
    position: "absolute",
    top: 0,
    right: 200,
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
    
},

ovalShape: {
    width: 70, 
    height: 150, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    position: "absolute",
    left: 350, 
    top: 50,
    borderRadius: 50, 
    zIndex: -1,  // Ensures it's behind the cube?
},

numberImage: {
    width: "90%", 
    height: "90%",
    resizeMode: "contain",
},


    /* Next Button */
    button: {
        width: 214,
        height: 61,
        backgroundColor: "#C3E2E5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "rgba(0, 0, 0, 0.25)", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#3E1911",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
    },
});

//export default Numbers1;
