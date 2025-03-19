import * as React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from "../reusableComponents/CustomButton";
import { Dimensions } from "react-native"; // Adding responsiveness

const { width, height } = Dimensions.get("window"); // Adding to make the page responsive

export default function InventoryScreen() {
    const router = useRouter();
    const [selectedUser, setSelectedUser] = React.useState('Shiloh');
    const users = ['Shiloh', 'Jessica', 'Mina'];
    const starIcon = require('../assets/GameOverStar.png');

    const categories = ["Letters", "Numbers"]; // Ensuring Letters and Numbers are both fetched
    const levels = [1, 2, 3];
    const [levelCounts, setLevelCounts] = React.useState<{ [key: string]: number }>({});

    // Function to Fetch Both Letters & Numbers from AsyncStorage so they save separately.
    const fetchLevelCounts = async () => {
        try {
            const newCounts: { [key: string]: number } = {};

            for (const category of categories) { // Loop through both categories letter & numbers
                for (const level of levels) {
                    const key = `${category}_level${level}_count`; // 
                    const count = await AsyncStorage.getItem(key);
                    newCounts[key] = count ? parseInt(count) : 0; // ✅ Ensure 0 if no value exists
                }
            }

            setLevelCounts(newCounts);
            console.log(" Updated Inventory:", newCounts);
        } catch (error) {
            console.error(" Error retrieving level counts:", error);
        }
    };

    // Fetch data
    useFocusEffect(
        React.useCallback(() => {
            fetchLevelCounts();
        }, [])
    );

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                <CustomButton
                    image={require("../assets/back.png")}
                    uniqueButtonStyling={styles.backBtnContainer}
                    functionToExecute={() => router.back()}
                />

                <Text style={styles.headerText}>Inventory</Text>
                <Text style={styles.subHeaderText}>Select an account to see inventory</Text>

                <View style={styles.tabContainer}>
                    {users.map((user) => (
                        <Pressable
                            key={user}
                            style={[styles.tab, selectedUser === user && styles.activeTab]}
                            onPress={() => setSelectedUser(user)}
                        >
                            <Text style={styles.tabText}>{user}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.inventoryContainer}>
                    {categories.map((category) => ( // Looping through both categories
                        <View key={category} style={styles.column}>
                            <Text style={styles.sectionTitle}>{category}</Text>
                            {levels.map((level) => (
                                <View key={`${category}_level${level}`}>
                                    <Text style={styles.level}>Level {level}</Text>
                                    <View style={styles.itemRow}>
                                        <Image source={starIcon} style={styles.starIcon} />
                                        <Text style={styles.itemText}>
                                            x {levelCounts[`${category}_level${level}_count`] || 0} 
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        position: 'relative',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: width * 0.05, // Add responsive padding
    },
    headerText: {
        fontSize: width * 0.08,  // Scales based on screen width
        fontWeight: 'bold',
        color: '#3E1911',
        marginBottom: 50,
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: width * 0.05,  // Scales text size
        color: '#3E1911',
        marginBottom: height * 0.02,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#3E1911',
        marginBottom: height * 0.02,
    },
    tab: {
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        marginHorizontal: width * 0.02,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#3E1911',
    },
    tabText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#3E1911',
    },
    inventoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: height * 0.02,
    },
    column: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#3E1911',
        marginBottom: height * 0.02,
    },
    level: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#3E1911',
        marginTop: height * 0.01,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.01,
    },
    starIcon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: width * 0.02,
    },
    itemText: {
        fontSize: width * 0.05,
        color: '#3E1911',
    },
    backBtnContainer: {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.02,
        paddingVertical: height * 0.02,
    },
});
