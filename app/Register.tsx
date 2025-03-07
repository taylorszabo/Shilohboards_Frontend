import React, { useState } from "react";
import {  
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ImageBackground,
    Alert  
} from "react-native";
import { useRouter } from 'expo-router';
import BackgroundLayout from "../reusableComponents/BackgroundLayout";

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
            const response = await fetch("/register", { //add in API
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
                    style={styles.logo} 
                />
                <Text style={styles.title}>Register New Account</Text>
                
                <TextInput 
                    style={styles.input} 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <TextInput 
                    style={styles.input} 
                    placeholder="Password" 
                    secureTextEntry 
                    value={password} 
                    onChangeText={setPassword} 
                />

                <TextInput 
                    style={styles.input} 
                    placeholder="Confirm Password" 
                    secureTextEntry 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                />
                
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
        paddingBottom: 60,
    },
    logo: {
        width: 400,
        height: 400,
        resizeMode: "contain",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#3E1911",
        marginBottom: 40,
    },
    input: {
        width: 300,
        height: 57,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#494649",
        shadowColor: "rgba(0, 0, 0, 0.25)", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    button: {
        width: 214,
        height: 61,
        backgroundColor: "#C3E2E5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
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
    registerText: {
        marginTop: 20,
        color: "#3E1911",
        fontSize: 20,
        fontWeight: "400",
        textDecorationLine: "underline",
    }
});

export default Register;
