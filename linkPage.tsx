import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";

import { NavigationProp } from "@react-navigation/native";

const LinkPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const handlePress = () => {
        // Replace with the actual Shiloh Boards website URL
        Linking.openURL("https://www.shilohboards.com");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backText}>⬅</Text>
            </TouchableOpacity>
            
            <Image source={require("./assets/shiloh_logo.png")} style={styles.logo} />
            
            <Text style={styles.description}>
                <Text style={styles.boldText}>Visit our official website</Text> to learn more about Shiloh Boards or to <Text style={styles.boldText}>purchase a physical board!</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF3E0",
        padding: 20,
        borderRadius: 20,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#E3E3E3",
        padding: 10,
        borderRadius: 10,
    },
    backText: {
        fontSize: 20,
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: "contain",
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        textAlign: "center",
        color: "#3E1911",
        fontWeight: "bold",
        marginBottom: 20,
    },
    boldText: {
        fontWeight: "bold",
    }
});

export default LinkPage;
