import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Linking, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";

const { width, height } = Dimensions.get("window");

const SiteLink = () => {
    const router = useRouter();
    const { game = "Alphabet", playerId = "0" } = useLocalSearchParams();

    const handleLinkPress = () => {
        Linking.openURL("https://shilohboards.com");
    };

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton
                    image={require("../assets/back.png")}
                    uniqueButtonStyling={styles.backBtnContainer}
                    onPressRoute={`/LevelChoice?game=${game}&playerId=${playerId}`}
                />

                <Image 
                    source={require("../assets/logo.png")}
                    style={styles.logo} 
                />
                
                <Pressable onPress={handleLinkPress}>
                    <Text style={styles.linkText}>
                        Visit our official website to learn more about Shiloh Boards
                        or to purchase a physical board!
                    </Text>
                </Pressable>
            </View>
        </BackgroundLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: 400,
        height: 400,
        resizeMode: "contain",
    },
    linkText: {
        fontSize: 22,
        textDecorationLine: 'underline',
        fontWeight: "600",
        color: "#3E1911",
        textAlign: "center",
        marginHorizontal: 20,
        paddingBottom: 130,
    },
    backBtnContainer: {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.02,
        paddingVertical: height * 0.02,
    }
});

export default SiteLink;
