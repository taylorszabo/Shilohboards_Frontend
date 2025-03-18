import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator
} from "react-native";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";

const FIREBASE_API_KEY =  process.env.EXPO_PUBLIC_FIREBASE_API_KEY
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                router.push('/SelectCharacter');
            }
        };
        checkUser();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post(FIREBASE_AUTH_URL, {
                email,
                password,
                returnSecureToken: true
            });

            const { idToken, localId } = response.data;

            await AsyncStorage.setItem("authToken", idToken);
            await AsyncStorage.setItem("userId", localId);

            router.push('/SelectCharacter');

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const firebaseError = error.response?.data?.error?.message;
                console.log(firebaseError);
                switch (firebaseError) {
                    case "INVALID_LOGIN_CREDENTIALS":
                        setErrorMessage("Incorrect username or password. Please try again.");
                        break;
                    case "INVALID_EMAIL":
                        setErrorMessage("Please enter a valid email address.");
                        break;
                    case "USER_DISABLED":
                        setErrorMessage("This account has been disabled.");
                        break;
                    case "MISSING_PASSWORD":
                        setErrorMessage("Please enter a password.");
                        break;
                    default:
                        setErrorMessage("Login failed. Please try again.");
                }
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <Image
                    source={require("../assets/logo.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => router.push('/Register')}>
                    <Text style={styles.registerText}>Register New Account</Text>
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
    label: {
        width: "90%",
        fontSize: 20,
        fontWeight: "400",
        color: "#3E1911",
        textAlign: "left",
        marginTop: 10,
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
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    button: {
        width: 214,
        height: 61,
        backgroundColor: "#C3E2E5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderColor: '#A9A9A9',
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