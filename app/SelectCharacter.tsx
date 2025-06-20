import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import CharacterCard from "../reusableComponents/CharacterCard";
import CustomButton from "../reusableComponents/CustomButton";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import { characterOptions, bgColorOptions } from "../CharacterOptions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingMessage from "../reusableComponents/LoadingMessage";
import {router} from "expo-router";

// Backend API URL
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function SelectCharacter() {
  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inDeleteCharacterMode, setInDeleteCharacterMode] = useState<boolean>(false);
  const [characterIdsToDelete, setCharacterIdsToDelete] = useState<string[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.push('/Login');
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchParentId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        setParentId(userId);
        fetchChildren(userId);
      } else {
        console.error("Error: Parent ID not found.");
        router.replace("/error?message=Account%20cannot%20not%20be%20found");
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
              router.replace("/error?message=Failed%20to%20load%20the%20profile%20for%20that%20child");
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
      router.replace("/error?message=Failed%20to%20load%20characters");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  async function deleteSelectedCharacters() {
    if (characterIdsToDelete.length !== 0) {
      try {
        for (const profileId of characterIdsToDelete) {
          await axios.delete(`${API_URL}/users/child/${profileId}`);
        }

        if (parentId) {
          await fetchChildren(parentId);
        }

        setCharacterIdsToDelete([]);
        setInDeleteCharacterMode(false);
      } catch (error) {
        console.error("Error deleting characters:", error);
        router.replace("/error?message=Failed%20to%20delete%20characters");
      }
    }
  }

  //when the cancel button is pressed in delete mode, empty the current list of characters
  //to delete and return to regular mode instead of delete mode
  function cancelDeleteMode() {
    setInDeleteCharacterMode(false);
    setCharacterIdsToDelete([]);
  }

  //this updates the list of characters to delete when the character card is pressed
  //based on whether it is currently selected or not
  function updateDeleteList(userId: string) {
    setCharacterIdsToDelete((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) //remove from list if it exists (to unselect)
        : [...prev, userId] //add to list if it doesn't exist (to select)
    );
  }

  function adjustCardSize(): number {
    if (children.length <= 6) {
      return 150;
    } else {
      return 100;
    }
  }

  return (
      <BackgroundLayout>
        <View style={styles.container}>
          {inDeleteCharacterMode &&
            <View style={{width: '100%', backgroundColor: '#ED5454'}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold', padding: 10}}>
                DELETE MODE
              </Text>
            </View>
          }

          <Text style={styles.headerText}>
            {inDeleteCharacterMode ?
              "Select which characters you would like to delete:"
              :
              "Select Your Character to Play:"
            }
          </Text>

          {loading ? (
              <LoadingMessage smallVersion={true} />
          ) : errorMessage || children.length === 0 ? (
              <Text style={styles.errorText}>{errorMessage || "No characters found. Please create a new one."}</Text>
          ) : (
              <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={true} overScrollMode="always">
                {children.sort((a, b) => a.profile_name.localeCompare(b.profile_name)).map((user) => {
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
                            deleteModeFunction={inDeleteCharacterMode ? () => updateDeleteList(user.id) : undefined}
                            selected={inDeleteCharacterMode && characterIdsToDelete.includes(user.id)}
                        />
                      </View>
                  );
                })}
              </ScrollView>
          )}

          <View style={{ width: '100%', flexDirection: 'row-reverse', marginTop: 'auto', justifyContent: 'space-between', maxWidth: 700}}>
            <CustomButton
              text={inDeleteCharacterMode ? "Cancel" : "Create New"}
              image={inDeleteCharacterMode ? require('../assets/Icons/undo.png') : require('../assets/Icons/new.png')}
              uniqueImageStyling={{height: 30, width: 30, resizeMode: 'contain'}}
              uniqueButtonStyling={{flexDirection: 'row'}}
              onPressRoute={inDeleteCharacterMode ? undefined : `/CharacterCreation?isNewOrUpdateId=New`}
              functionToExecute={inDeleteCharacterMode ? () => cancelDeleteMode() : undefined}
            />
            
            <CustomButton
                text="Delete"
                image={require('../assets/Icons/delete.png')}
                uniqueImageStyling={{height: 30, width: 30, resizeMode: 'contain'}}
                uniqueButtonStyling={inDeleteCharacterMode ? {flexDirection: 'row-reverse', backgroundColor: '#ED5454', borderWidth: 3, borderColor: "#3E1911"} : {flexDirection: 'row-reverse'}}
                functionToExecute={() => inDeleteCharacterMode ? deleteSelectedCharacters() : setInDeleteCharacterMode(true)}
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
    width: '100%',
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
    alignItems: 'flex-start',
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    maxWidth: 700,
    paddingHorizontal: 20,
  },
  createNewBtnContainer: {
    marginTop: "auto"
  },
  errorText: {
    color: "#3E1911",
    textAlign: "center",
    fontSize: 18,
  },
});
