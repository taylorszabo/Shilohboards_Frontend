import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet } from "react-native";

const LinkPage = () => {
    return (
        <ImageBackground 
            source={require("./assets/background.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Image 
                    source={require("./assets/logo.png")} 
                    style={styles.logo} 
                />
                <Text style={styles.text}>
                    Visit our official website to learn more about Shiloh Boards
                    or to purchase a physical board!
                </Text>
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
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: "600",
        color: "#3E1911",
        textAlign: "center",
        marginHorizontal: 20,
    },
});

export default LinkPage;