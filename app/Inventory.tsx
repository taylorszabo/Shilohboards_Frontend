import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../reusableComponents/CustomButton";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import LoadingMessage from '../reusableComponents/LoadingMessage';
import { formatNameWithCapitals } from "../CharacterOptions";
import {useEffect} from "react";

// Get screen dimensions for responsive styling
const { width, height } = Dimensions.get("window");

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

// Main functional component for Inventory Screen
export default function InventoryScreen() {
    const router = useRouter();
    const { playerId = "0" } = useLocalSearchParams();

    // State to store selected child account
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
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
        const checkUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                router.push('/Login');
            }
        };
        checkUser();

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/children/${parentId}`);
            const childrenData = response.data;

            // If no children found
            if (Array.isArray(childrenData) && childrenData.length === 0) {
                setChildAccounts([]);
                router.replace("/error?message=No%20Children%20Found");
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
                setChildAccounts([]);
                router.replace("/error?message=No%20characters%20found");

            } else {
                setChildAccounts(validProfiles);
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setChildAccounts([]);
                router.replace("/error?message=No%20characters%20found");

            } else {
                console.error("Error fetching children:", error);
                setChildAccounts([]);
                router.replace("/error?message=Failed%20characters%20found");
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
                router.replace("/error?message=Parent%20could%20not%20be%20found");
            }
        };

        fetchParentId();
    }, []);

    // child is selected from the dropdown
    const handleSelectUser = (userId: string) => {
        if(userId === '')
        {
            setSelectedUser('');
        }
        else{
            const user = childAccounts.find(u => u.id === userId);
            setSelectedUser(user);
            fetchLevelCounts(user.id);
        }
    };

    if (loading) return <LoadingMessage backgroundNeeded={true}/>;

    return (
        <BackgroundLayout>
            <View style={styles.container}>
                {/* Back button in top left */}
                <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?playerId=${playerId}`}/>

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
                        {childAccounts.sort((a, b) => a.profile_name.localeCompare(b.profile_name)).map((user) => (
                            <Picker.Item key={user.id} label={formatNameWithCapitals(user.profile_name)} value={user.id} />
                        ))}
                    </Picker>
                </View>

                {/* Inventory breakdown per category and level */}
                {selectedUser !== '' && selectedUser && (
                    <View style={styles.inventoryContainer}>
                        {categories.map((category) => (
                            <View key={category} style={styles.column}>
                                <Text style={styles.sectionTitle}>
                                    {category === "Letters" ? "Alphabet" : category}
                                </Text>
                                {levels.filter(level => !(category === "Numbers" && level === 3)).map((level) => (
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
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3E1911',
        margin: 25,
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 22,
        color: '#3E1911',
        marginBottom: 30,
        textAlign: 'center',
    },
    dropdownWrapper: {
        width: '80%',
        maxWidth: 500,
        borderColor: '#3E1911',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 20,
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
        maxWidth: 500,
        marginTop: 10
    },
    column: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#3E1911',
    },
    level: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3E1911',
        marginTop: 20,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    starIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    itemText: {
        fontSize: 25,
        color: '#3E1911',
    },
    backBtnContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 5,
        paddingVertical: 20
    },
});
