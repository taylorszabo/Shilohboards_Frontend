import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions, Image, Dimensions } from 'react-native'; // 🔹 Added Dimensions
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../reusableComponents/CustomButton';
import { useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { gamesArray } from "../GameContent";
import { RFPercentage } from 'react-native-responsive-fontsize'; // Added for responsive font sizes

const { width, height } = Dimensions.get("window"); 

type GameDescriptionQuery = {
  game: string;
  level: number;
};

export default function GameDescriptions() {
  const { playerId = '[name]', game = gamesArray[0].title, level = '1', playerLastSelected = '0' } = useLocalSearchParams();
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;
  const [query, setQuery] = useState<GameDescriptionQuery>({game: game.toString(), level: parseInt(level.toString())});

  //----------------------------------------------------------
  function setGameSelected(game: string) {
    //if level 3 is selected/underlined while the alphabet game is chosen and then you switch to the numbers game,
    //set the level to 2 since level 3 doesn't exist in the numbers game
    if (query.game === gamesArray[0].title && query.level === gamesArray[0].numberOfLevels) {
      setQuery({ ...query, level: 2, game: game });
      return;
    }

    setQuery({ ...query, game: game });
  }

  //----------------------------------------------------------
  return (
    <BackgroundLayout>
        <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
            {/* Back Button */}
            <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} 
                          onPressRoute={`/PerformanceReports?&playerId=${playerId}&game=${query.game}&level=${query.level === 1 ? 2 : query.level}&playerLastSelected=${playerLastSelected}`}/>

            <Text style={styles.headerText}>Game Descriptions</Text>

            <Text style={styles.bodyText}>Select the following options to view what each game & level is teaching:</Text>

            {/* ---------------- Game Row ---------------- */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={[styles.selectionBars, windowWidth > 800 && {justifyContent: 'center'}]}>
                {[...gamesArray].map((game, index) => (
                    <View key={index}>
                        <Text style={[styles.bodyText, game.title === query.game && styles.selectedUnderline]} 
                              onPress={() => setGameSelected(game.title)}>
                          {game.title}
                        </Text>
                    </View>
                ))}
            </LinearGradient>

            {/* ---------------- Level Row ---------------- */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={[styles.selectionBars, windowWidth > 800 && {justifyContent: 'center'}]}>
                {[...Array(gamesArray[query.game === gamesArray[0].title ? 0 : 1].numberOfLevels)].map((level, index) => (
                    <View key={index}>
                        <Text style={[styles.bodyText, index + 1 === query.level && styles.selectedUnderline]} 
                              onPress={() => setQuery({...query, level: index + 1})}>
                          Level {index + 1}
                        </Text>
                    </View>
                ))}
            </LinearGradient>

            {/* ============================================= BODY ============================================= */}
            <View style={styles.bodyContainer}>
                {query.game === 'Alphabet' && query.level === 1 &&
                    <View style={styles.innerBodyContainer}>
                        <Text style={[styles.bodyText, styles.descriptionText]}>
                            In this activity, children are able to view each letter on top of the door and then they are 
                            able to open the door to see an object that begins with that letter. They can also tap to
                            hear the short sound or the word. There is no score or report for level 1.
                        </Text>
                        <Image source={require('../assets/GameDescriptionPics/Alphabet_Level1.png')} style={styles.pics}/>
                    </View>
                }

                {query.game === 'Alphabet' && query.level === 2 &&
                    <View style={styles.innerBodyContainer}>
                        <Text style={[styles.bodyText, styles.descriptionText]}>
                            In this activity, children are presented with a letter. They are given three objects to choose
                            from and the goal is to select the one that begins with the letter provided. They can tap the 
                            letter to hear the short sound if that helps. The order of the letters, and the options, are
                            randomized each game.
                        </Text>
                        <Image source={require('../assets/GameDescriptionPics/Alphabet_Level2.png')} style={styles.pics}/>
                    </View>
                }

                {query.game === 'Alphabet' && query.level === 3 &&
                    <View style={styles.innerBodyContainer}>
                        <Text style={[styles.bodyText, styles.descriptionText]}>
                            In this activity, audio plays at the beginning of each question with the letter long sound,
                            short sound, and a word that begins with the letter. They are presented with four letters and 
                            the goal is to choose the correct one that matches the audio. They can replay the audio if
                            needed. The order of the letters/sounds, and the options, are
                            randomized each game.
                        </Text>
                        <Image source={require('../assets/GameDescriptionPics/Alphabet_Level3.png')} style={styles.pics}/>
                    </View>
                }

                {query.game === 'Numbers' && query.level === 1 &&
                    <View style={styles.innerBodyContainer}>
                        <Text style={[styles.bodyText, styles.descriptionText]}>
                            In this activity, children are able to view each number on top of the door and then they are 
                            able to open the door to see or count that many objects. They can also tap to
                            hear the number.  There is no score or report for level 1.
                        </Text>
                        <Image source={require('../assets/GameDescriptionPics/Numbers_Level1.png')} style={styles.pics}/>
                    </View>
                }

                {query.game === 'Numbers' && query.level === 2 &&
                    <View style={styles.innerBodyContainer}>
                        <Text style={[styles.bodyText, styles.descriptionText]}>
                            In this activity, children are presented with a picture of a certain number of objects. They are given three numbers to choose
                            from and the goal is to select the one that matches. The order of the numbers, and the options, are
                            randomized each game.
                        </Text>
                        <Image source={require('../assets/GameDescriptionPics/Numbers_Level2.png')} style={styles.pics}/>
                    </View>
                }
            </View>
        </View>
    </BackgroundLayout>
  );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  bodyContainer: {
    flex: 1,
    margin: 20,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    resizeMode: 'contain'
  },
  innerBodyContainer: {
    flex: 1,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    resizeMode: 'contain',
    alignItems: 'center',
  },
  backBtnContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    paddingVertical: 20
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3E1911',
  },
  bodyText: {
    verticalAlign: 'middle',
    padding: 7,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3E1911',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  descriptionText: {
    padding: 0, 
    paddingHorizontal: 0, 
    fontWeight: '500', 
    maxWidth: 800
  },
  selectionBars: {
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(62, 25, 17, 0.3)',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  selectedUnderline: {
    borderBottomWidth: 7, 
    borderBottomColor: '#3E1911'
  },
  pics: {
    maxHeight: '65%',
    marginTop: 20,
    flex: 1,
    resizeMode: 'contain',
    flexShrink: 1,
  }
});
