import React, { useState } from "react";
import {  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,Dimensions} from "react-native";
import { useRouter } from 'expo-router';
import BackgroundLayout from "../reusableComponents/BackgroundLayout";

const { width, height } = Dimensions.get("window");  

const Register = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        console.log("Register button pressed");

        // Check if fields are empty or missing
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            console.log("Empty fields detected");
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("/register", { // Add in API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registration Successful!");
                Alert.alert("Success", "Account created successfully!", [
                    { text: "OK", onPress: () => router.push('/Login') }
                ]);
            } else {
                console.log("Registration Failed:", data.message);
                Alert.alert("Error", data.message || "Registration failed. Try again.");
            }
        } catch (error) {
            console.error("Network error:", error);
            Alert.alert("Error", "Something went wrong. Please check your connection.");
        }
    };

    return ( 
        <BackgroundLayout>
            <View style={styles.container}>
                <Image 
                    source={require("../assets/logo.png")}
                    style={[styles.logo, { width: width * 0.5, height: width * 0.5 }]} 
                   
                />
                <Text style={styles.title}>Register New Account</Text>
                
                <TextInput 
                    style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]} 
                 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <TextInput 
                    style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]} 
                    placeholder="Password" 
                    secureTextEntry 
                    value={password} 
                    onChangeText={setPassword} 
                />

                <TextInput 
                    style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]} 
                    placeholder="Confirm Password" 
                    secureTextEntry 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                />
                
                <TouchableOpacity 
                    style={[styles.button, { width: width * 0.6, height: height * 0.08 }]} 
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/Login')}>
                    <Text style={styles.registerText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </BackgroundLayout>
    ); 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: height * 0.08, // 🔹 Adjusted padding based on screen height
    },
    logo: {
        resizeMode: "contain",
    },
    title: {
        fontSize: width * 0.08, // 🔹 Title scales with screen size (8% of screen width)
        fontWeight: "700",
        color: "#3E1911",
        marginBottom: height * 0.04, // 🔹 Margin adjusts dynamically
        textAlign: "center",
    },
    input: {
        height: height * 0.07, // 🔹 Input field height adjusts dynamically
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: height * 0.015, // 🔹 Responsive spacing
        borderWidth: 1,
        borderColor: "#494649",
        shadowColor: "rgba(0, 0, 0, 0.25)", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: "#C3E2E5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: height * 0.02, // 🔹 Button margin adjusts dynamically
        shadowColor: "rgba(0, 0, 0, 0.25)", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#3E1911",
        fontSize: width * 0.06, // 🔹 Font size adjusts based on screen width
        fontWeight: "700",
        textAlign: "center",
    },
    registerText: {
        marginTop: height * 0.03, // 🔹 Adjusted margin for better spacing on all screen sizes
        color: "#3E1911",
        fontSize: width * 0.05, // 🔹 Text scales dynamically
        fontWeight: "400",
        textDecorationLine: "underline",
    }
});

export default Register;
