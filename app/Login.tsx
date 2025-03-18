import React, { useState } from "react";
import {  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import BackgroundLayout from "../reusableComponents/BackgroundLayout";

const { width, height } = Dimensions.get("window"); 

const Login = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    //placeholder for testing funtionality of login
    const handleLogin = () => {
        if (email === "" && password === "") {
            Alert.alert("Login Successful!");
            router.push('/SelectCharacter'); 
        } else {
            Alert.alert("Invalid email or password.");
        }
    };

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <Image 
                    source={require("../assets/logo.png")}
                    style={[
                        styles.logo,
                        { width: width * 0.5, height: width * 0.5 } 
                    ]} 
                />
                <Text style={styles.title}>Login</Text>
                
                <TextInput 
                  style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]} 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                />
                
                <TextInput 
                    style={[styles.input, { width: width * 0.8, fontSize: width * 0.045 }]} 
                    placeholder="Password" 
                    secureTextEntry 
                    value={password} 
                    onChangeText={setPassword} 
                />
                
                <TouchableOpacity 
                    style={[styles.button, { width: width * 0.6, height: height * 0.08 }]} 
                    onPress={handleLogin} 
                >
                    <Text style={styles.buttonText}>Sign In</Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/Register')}>
                    <Text style={styles.registerText}>Register New Account</Text>
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
        paddingBottom: height * 0.08, 
    },
    logo: {
        resizeMode: "contain",
    },
    title: {
        fontSize: width * 0.08,
        fontWeight: "700",
        color: "#3E1911",
        marginBottom: height * 0.04, 
        textAlign: "center",
    },
    input: {
        height: height * 0.07, 
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: height * 0.015, 
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
        marginTop: height * 0.02, 
        shadowColor: "rgba(0, 0, 0, 0.25)", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#3E1911",
        fontSize: width * 0.06, 
        fontWeight: "700",
        textAlign: "center",
    },
    registerText: {
        marginTop: height * 0.03, 
        color: "#3E1911",
        fontSize: width * 0.05, 
        fontWeight: "400",
        textDecorationLine: "underline",
    }
});

export default Login;
