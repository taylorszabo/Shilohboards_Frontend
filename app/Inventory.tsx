import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../reusableComponents/CustomButton";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

// Get screen dimensions for responsive styling
const { width, height } = Dimensions.get("window");

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

// Main functional component for Inventory Screen
export default function InventoryScreen() {
    const router = useRouter();

    // State to store selected child account
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [childAccounts, setChildAccounts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [levelCounts, setLevelCounts] = React.useState<{ [key: string]: number }>({});


    const starIcon1 = require('../assets/GameOverStar-Silver.png'); 
    const starIcon2 = require('../assets/GameOverStar.png');   
    const starIcon3 = require('../assets/GameOverStar-Purple.png');
    const categories = ["Letters", "Numbers"];
    const levels = [1, 2, 3];

    // stored level counts for a specific child
    const fetchLevelCounts = async (childId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/rewards/${childId}`);
            const rewards = response.data;
            const newCounts: { [key: string]: number } = {};
            for (const category of categories) {
                for (const level of levels) {
                    const count = rewards?.[category]?.[`level${level}`] || 0;
                    const key = `${childId}_${category}_level${level}_count`;
                    newCounts[key] = count;
                }
            }
            setLevelCounts(newCounts);
        } catch (error) {
            console.error("Error fetching reward counts from backend:", error);
        }
    };


    // getting all child accounts for a parent
    const fetchChildren = React.useCallback(async (parentId: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/children/${parentId}`);
            const childrenData = response.data;

            // If no children found
            if (Array.isArray(childrenData) && childrenData.length === 0) {
                setErrorMessage("No characters found. Please create a new character.");
                setChildAccounts([]);
                return;
            }

            // get each child profile
            const profiles: any[] = await Promise.all(
                childrenData.map(async (child: any) => {
                    try {
                        const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/profile/${child.profile_id}`);
                        return { ...res.data, id: child.id };
                    } catch (error) {
                        console.error(`Error fetching profile for child ${child.profile_id}:`, error);
                        return null;
                    }
                })
            );

            const validProfiles = profiles.filter(profile => profile && profile.profile_image);
            if (validProfiles.length === 0) {
                setErrorMessage("No characters found. Please create a new character.");
                setChildAccounts([]);
            } else {
                setChildAccounts(validProfiles);
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setErrorMessage("No characters found. Please create a new character.");
                setChildAccounts([]);
            } else {
                console.error("Error fetching children:", error);
                setErrorMessage("Failed to load characters.");
                setChildAccounts([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        const fetchParentId = async () => {
            const userId: string | null = await AsyncStorage.getItem("userId");
            if (userId) {
                fetchChildren(userId);
            } else {
                setErrorMessage("Error: Parent ID not found.");
            }
        };

        fetchParentId();
    }, []);

    // child is selected from the dropdown
    const handleSelectUser = (userId: string) => {
        const user = childAccounts.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            fetchLevelCounts(user.id);
        }
    };
    return (
        <BackgroundLayout>
            <View style={styles.container}>
                {/* Back button in top left */}
                <CustomButton
                    image={require("../assets/back.png")}
                    uniqueButtonStyling={styles.backBtnContainer}
                    functionToExecute={() => router.canGoBack() ? router.back() : router.replace('/')}
                />

                {/* Header */}
                <Text style={styles.headerText}>Reward Inventory</Text>
                <Text style={styles.subHeaderText}>Select an account to see inventory</Text>

                {/* Dropdown for selecting child */}
                <View style={styles.dropdownWrapper}>
                    <Picker
                        selectedValue={selectedUser?.id || ''}
                        style={styles.picker}
                        onValueChange={(itemValue) => handleSelectUser(itemValue)}
                    >
                        <Picker.Item label="-- Select Account --" value="" />
                        {childAccounts.map((user) => (
                            <Picker.Item key={user.id} label={user.profile_name} value={user.id} />
                        ))}
                    </Picker>
                </View>

                {/* Inventory breakdown per category and level */}
                {selectedUser && (
                    <View style={styles.inventoryContainer}>
                        {categories.map((category) => (
                            <View key={category} style={styles.column}>
                                <Text style={styles.sectionTitle}>{category}</Text>
                                {levels.map((level) => (
                                    <View key={`${category}_level${level}`}>
                                        <Text style={styles.level}>Level {level}</Text>
                                        <View style={styles.itemRow}>
                                        {
                                         level === 1 ? <Image source={starIcon1} style={styles.starIcon} /> :
                                         level === 2 ? <Image source={starIcon2} style={styles.starIcon} /> :
                                         level === 3 ? <Image source={starIcon3} style={styles.starIcon} /> : null
                                            }
                                            <Text style={styles.itemText}>
                                                x {levelCounts[`${selectedUser.id}_${category}_level${level}_count`] || 0}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: width * 0.05,
    },
    headerText: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: '#3E1911',
        marginBottom: 50,
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: width * 0.05,
        color: '#3E1911',
        marginBottom: height * 0.02,
        textAlign: 'center',
    },
    dropdownWrapper: {
        width: '80%',
        borderColor: '#3E1911',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: height * 0.02,
        backgroundColor: 'white',
    },
    picker: {
        width: '100%',
        height: 50,
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
