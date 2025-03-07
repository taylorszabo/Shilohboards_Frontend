import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";

const SiteLink = () => {
    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <Image 
                    source={require("../assets/logo.png")}
                    style={styles.logo} 
                />
                <Text style={styles.text}>
                    Visit our official website to learn more about Shiloh Boards
                    or to purchase a physical board!
                </Text>
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
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: 400,
        height: 400,
        resizeMode: "contain",
    },
    text: {
        fontSize: 22,
        textDecorationLine: 'underline',
        fontWeight: "600",
        color: "#3E1911",
        textAlign: "center",
        marginHorizontal: 20,
        paddingBottom: 130
    },
});

export default SiteLink;