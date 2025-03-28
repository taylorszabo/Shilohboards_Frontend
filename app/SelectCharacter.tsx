import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import CharacterCard from "../reusableComponents/CharacterCard";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend API URL
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function SelectCharacter() {
  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchParentId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        setParentId(userId);
        fetchChildren(userId);
      } else {
        setErrorMessage("Error: Parent ID not found.");
      }
    };

    fetchParentId();
  }, []);

  const fetchChildren = async (parentId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/children/${parentId}`);
      const childrenData = response.data;

      if (!Array.isArray(childrenData) || childrenData.length === 0) {
        setErrorMessage("No characters found. Please create a new character.");
        setChildren([]);
        return;
      }

      const profiles = await Promise.all(
          childrenData.map(async (child: any) => {
            try {
              const res = await axios.get(`${API_URL}/users/profile/${child.profile_id}`);
              return { ...res.data, id: child.profile_id };
            } catch (error) {
              console.error(`Error fetching profile for child ${child.profile_id}:`, error);
              return null;
            }
          })
      );

      const validProfiles = profiles.filter(profile => profile && profile.profile_image);

      if (validProfiles.length === 0) {
        setErrorMessage("No characters found. Please create a new character.");
        setChildren([]);
      } else {
        setChildren(validProfiles);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage("No characters found. Please create a new character.");
        setChildren([]);
        return;
      }
      console.error("Error fetching children:", error);
      setErrorMessage("Failed to load characters.");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  function adjustCardSize(): number {
    if (children.length <= 6) {
      return 0.4;
    } else if (children.length === 7 || children.length === 8) {
      return 0.35;
    } else {
      return 0.28;
    }
  }

  return (
      <BackgroundLayout>
        <View style={styles.container}>
          <Text style={styles.headerText}>Select Your Character:</Text>

          {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
          ) : errorMessage || children.length === 0 ? (
              <Text style={styles.errorText}>{errorMessage || "No characters found. Please create a new one."}</Text>
          ) : (
              <View style={styles.grid}>
                {children.map((user) => {
                  if (!user || !user.profile_image || !user.profile_color) return null;
                  const characterOption = characterOptions.find((option) => option.id === user.profile_image);
                  const bgColor = bgColorOptions.includes(user.profile_color) ? user.profile_color : "#FFFFFF";

                  return (
                      <View key={user.id}>
                        <CharacterCard
                            id={user.id}
                            name={user.profile_name}
                            image={characterOption?.picture}
                            bgColor={bgColor}
                            customWidth={adjustCardSize()}
                            disabled={false}
                            onPressRoute={`/MainMenu?playerId=${user.id}`}
                            customCardStyling={{ marginTop: 0 }}
                        />
                      </View>
                  );
                })}
              </View>
          )}

          <View style={{ width: '100%', flexDirection: 'row-reverse', marginTop: 'auto', justifyContent: 'space-between'}}>
            <CustomButton
                text="Create New"
                image={require('../assets/Icons/new.png')}
                uniqueImageStyling={{height: 30, width: 30, resizeMode: 'contain'}}
                uniqueButtonStyling={{flexDirection: 'row'}}
                onPressRoute={`/CharacterCreation?isNewOrUpdateId=New`}
            />
            <CustomButton
                text="Delete"
                image={require('../assets/Icons/delete.png')}
                uniqueImageStyling={{height: 30, width: 30, resizeMode: 'contain'}}
                uniqueButtonStyling={{flexDirection: 'row-reverse'}}
            />
          </View>
        </View>
      </BackgroundLayout>
  );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    padding: 30,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    color: "#3E1911",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingBottom: 50,
    marginHorizontal: '5%',
    gap: 10,
  },
  createNewBtnContainer: {
    marginTop: "auto",
  },
  errorText: {
    color: "#3E1911",
    textAlign: "center",
    fontSize: 18,
  },
});
