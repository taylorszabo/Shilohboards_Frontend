import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import CharacterCard from '../reusableComponents/CharacterCard';
import CustomButton from '../reusableComponents/CustomButton';
import OptionCard from '../reusableComponents/OptionCard';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { tempCharacterArray, formatNameWithCapitals } from "../CharacterOptions";

type HamburgerMenuItem = {
  text: string;
  icon: any;
  route: string;
}

//======================================================================================
export default function MainMenu() {
    const { playerId = '[name]' } = useLocalSearchParams();
    const router = useRouter();

    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState<boolean>(false);
    
    const hamburgerMenuOptions: HamburgerMenuItem[] = [
      {text: 'Switch User', icon: require('../assets/Icons/userProfile.png'), route: '/SelectCharacter'},
      {text: 'Update Current Character', icon: require('../assets/Icons/editIcon.png'), route: `/CharacterCreation?isNewOrUpdateId=${playerId}`},
      {text: 'Settings', icon: require('../assets/Icons/settings.png'), route: '/Setting'},
      {text: 'Performance Reports', icon: require('../assets/Icons/performanceReportIcon.png'), route: `/PerformanceReports?playerId=${playerId}`},
      {text: 'Reward Inventory', icon: require('../assets/Icons/rewardIcon.png'), route: '/Inventory'},
      {text: 'Visit Official Website', icon: require('../assets/Icons/siteLink.png'), route: '/SiteLink'},
      {text: 'Logout', icon: require('../assets/Icons/exitIcon.png'), route: '/Login'}, //will need it's own function to actually log out too
    ];

    //--------------------------------------------------------------------------
    return (
      <BackgroundLayout>
        {hamburgerMenuOpen ?
          <View style={styles.hamburgerMenuContainer}>
            
            {/* ---------------------- header --------------------- */}
            <View style={styles.hamburgerTopHeaderPortion}>
              <Pressable onPress={() => setHamburgerMenuOpen(false)} style={styles.closeHamburgerMenuBtn} testID='closeHamburgerMenuBtn'>
                <Image source={require('../assets/back.png')} />
              </Pressable>

              <Image source={require('../assets/logo.png')} style={styles.hamburgerLogo}/>
            </View>

            {/* ---------------------- link list --------------------- */}
            <View style={styles.linkList}>
                {hamburgerMenuOptions.map((item, index) => (
                  <View style={styles.linkRow} key={index}>
                    <Image source={item.icon} style={styles.icons}/>
                    <Text onPress={() => router.push(item.route)} style={styles.linkText}>{item.text}</Text>
                  </View>
                ))}
            </View>
          </View>

          :

          // ----------------------------- game menu options ----------------------------
          <View style={styles.container}> 
              <CustomButton 
                testID='hamburgerMenuBtn'
                image={require('../assets/hamburgerMenuIcon.png')} 
                uniqueButtonStyling={styles.hamburgerButton} 
                uniqueImageStyling={{width: 28, height: 28}}
                functionToExecute={() => setHamburgerMenuOpen(true)}
              />
              <CharacterCard id={parseInt(playerId.toString())} customWidth={0.3}/>
              <Text style={styles.headerText}>Welcome {playerId ? formatNameWithCapitals(tempCharacterArray[parseInt(playerId.toString())].name) : playerId}! Which game would you like to play? </Text>
              <View style={styles.cardDiv}>
                <OptionCard lowerText='Alphabet' customWidth={0.8} height={160} onPressRoute={`/LevelChoice?game=Alphabet&playerId=${playerId}`} image={require('../assets/ABC_2.png')}/>
                <OptionCard lowerText='Numbers' customWidth={0.8} height={160} onPressRoute={`/LevelChoice?game=Numbers&playerId=${playerId}`} image={require('../assets/123_2.png')}/>
              </View>
          </View>
        }
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
  }
});