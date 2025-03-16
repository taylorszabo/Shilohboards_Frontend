import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {StyleSheet, Text, View, Image, Pressable, ActivityIndicator} from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {bgColorOptions, characterOptions} from "../CharacterOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type HamburgerMenuItem = {
  text: string;
  icon: any;
  route?: string;
  action?: () => void;
};

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";


export default function MainMenu() {
  const { playerId } = useLocalSearchParams();
  const router = useRouter();

  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState<boolean>(false);
  const [character, setCharacter] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      router.replace("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  const hamburgerMenuOptions: HamburgerMenuItem[] = [
    { text: "Switch User", icon: require("../assets/Icons/userProfile.png"), route: "/SelectCharacter" },
    { text: "Update Current Character", icon: require("../assets/Icons/editIcon.png"), route: `/CharacterCreation?isNewOrUpdateId=${playerId}` },
    { text: "Settings", icon: require("../assets/Icons/settings.png"), route: "/Setting" },
    { text: "Performance Reports", icon: require("../assets/Icons/performanceReportIcon.png"), route: "/" },
    { text: "Reward Inventory", icon: require("../assets/Icons/rewardIcon.png"), route: "/Inventory" },
    { text: "Visit Official Website", icon: require("../assets/Icons/siteLink.png"), route: "/SiteLink" },
    { text: "Logout", icon: require("../assets/Icons/exitIcon.png"), action: handleLogout },
  ];

  // Fetch character profile from backend
  useEffect(() => {
    const fetchCharacterProfile = async () => {
      if (!playerId) {
        router.replace("/SelectCharacter");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users/profile/${playerId}`);
        if (response.data) {
          setCharacter(response.data);
        } else {
          router.replace("/SelectCharacter");
        }
      } catch (error) {
        console.error("Error fetching character profile:", error);
        setErrorMessage("Failed to load character. Redirecting...");
        setTimeout(() => router.replace("/SelectCharacter"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterProfile();
  }, [playerId, router]);

  return (
      <BackgroundLayout>
        {hamburgerMenuOpen ? (
            <View style={styles.hamburgerMenuContainer}>
              {/* ---------------------- Header --------------------- */}
              <View style={styles.hamburgerTopHeaderPortion}>
                <Pressable onPress={() => setHamburgerMenuOpen(false)} style={styles.closeHamburgerMenuBtn}>
                  <Image source={require("../assets/back.png")} />
                </Pressable>
                <Image source={require("../assets/logo.png")} style={styles.hamburgerLogo} />
              </View>

              {/* ---------------------- Menu Links --------------------- */}
              <View style={styles.linkList}>
                {hamburgerMenuOptions.map((item, index) => (
                    <View style={styles.linkRow} key={index}>
                      <Image source={item.icon} style={styles.icons} />
                      <Text
                          onPress={() => (item.action ? item.action() : item.route && router.push(item.route))}
                          style={styles.linkText}
                      >
                        {item.text}
                      </Text>
                    </View>
                ))}
              </View>
            </View>
        ) : (
            <View style={styles.container}>
              <CustomButton
                  image={require("../assets/hamburgerMenuIcon.png")}
                  uniqueButtonStyling={styles.hamburgerButton}
                  uniqueImageStyling={{ width: 28, height: 28 }}
                  functionToExecute={() => setHamburgerMenuOpen(true)}
              />

              {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
              ) : character ? (
                  <>
                    <CharacterCard
                        id={character.id}
                        name={character.profile_name}
                        image={characterOptions.find(option => option.id === character.profile_image)?.picture}
                        bgColor={bgColorOptions.includes(character.profile_color) ? character.profile_color : "#FFFFFF"}
                        customWidth={0.3}
                    />

                    <Text style={styles.headerText}>
                      Welcome {character.profile_name}! Which game would you like to play?
                    </Text>

                    <View style={styles.cardDiv}>
                      <OptionCard lowerText="Alphabet" customWidth={0.8} height={160} onPressRoute={`/LevelChoice?game=Alphabet&playerId=${playerId}`} image={require("../assets/ABC_2.png")} />
                      <OptionCard lowerText="Numbers" customWidth={0.8} height={160} onPressRoute={`/LevelChoice?game=Numbers&playerId=${playerId}`} image={require("../assets/123_2.png")} />
                    </View>
                  </>
              ) : (
                  <Text style={styles.errorText}>{errorMessage}</Text>
              )}
            </View>
        )}
      </BackgroundLayout>
  );
}


// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  hamburgerMenuContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#C3E2E5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A9A9A9',
    //iOS shadow
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 1,
      height: 4
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    //android shadow
    elevation: 3,
  },
  hamburgerTopHeaderPortion: {
    width: '100%',
    height: '23%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#FFF8F0',
    borderBottomWidth: 15,
    borderBottomColor: '#FCCF9D',
    position: 'relative'
  },
  hamburgerLogo: {
    position: 'absolute',
    bottom: -100
  },
  closeHamburgerMenuBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 25,
    zIndex: 1
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#3E1911',
  },
  cardDiv: {
    gap: 15
  },
  hamburgerButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icons: {
    width: 30,
    aspectRatio: 1, // Maintains the aspect ratio
    resizeMode: 'contain',
  },
  linkList: {
    marginTop: 25,
    padding: 15,
    height: '80%'
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    height: '9%',
    borderBottomWidth: 2,
    borderBottomColor: '#3E1911',
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3E1911',
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});