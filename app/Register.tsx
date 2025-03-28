import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
      Alert,
      Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";


const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const { width, height } = Dimensions.get("window");  
const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // State to display errors
    const router = useRouter();

    const handleRegister = async () => {
        console.log("Register button pressed");

        setErrorMessage("");

        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }


        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(FIREBASE_SIGNUP_URL, {
                email,
                password,
                returnSecureToken: true
            });

            console.log("Registration Successful!", response.data);

            router.push("/Login");

        } catch (error: any) {
            console.error("Registration error:", error.response?.data || error.message);

            const firebaseError = error.response?.data?.error?.message;

            switch (firebaseError) {
                case "EMAIL_EXISTS":
                    setErrorMessage("This email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    setErrorMessage("Please enter a valid email address.");
                    break;
                case "WEAK_PASSWORD":
                    setErrorMessage("Password must be at least 6 characters.");
                    break;
                default:
                    setErrorMessage("Registration failed. Please try again.");
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
                
                
                {/* Display error message if it exists */}
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                {loading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  <CustomButton
    text="Sign Up"
    functionToExecute={handleRegister}
    uniqueButtonStyling={{ width: width * 0.6, height: height * 0.08 }}
  />
)}


                <TouchableOpacity onPress={() => router.push("/Login")}>
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
    errorText: {
        color: "red",
        marginBottom: 10,
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
