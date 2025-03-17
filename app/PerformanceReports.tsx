import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../reusableComponents/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { tempCharacterArray } from "../CharacterOptions";
import PerformanceBar from '../reusableComponents/PerformanceBar';
import { gamesArray, alphabetArray, numbersArray } from "../GameContent";

type ReportQuery = {
  playerId: number;
  game: string;
  level: number;
}

export default function SelectCharacter() {
  const router = useRouter();
  const { playerId = '[name]' } = useLocalSearchParams();
  const windowHeight = useWindowDimensions().height;

  const [query, setQuery] = useState<ReportQuery>({playerId: 0, game: gamesArray[0].title, level: 1});

  const middleIndex = Math.ceil(query.game === gamesArray[0].title ? alphabetArray.length / 2 : numbersArray.length / 2);

  useEffect(() => {
    console.log('--useEffect---')
      console.log(query.level);
      }, [query.level]);

  function setGameSelected(game: string) {
    //if level 3 is selected/underlined when alphabet game is chosen and then you switch to the numbers game,
    //set the level to 2 since level 3 doesn't exist
    console.log('---------------');
    // console.log(query.game);
    // console.log(query.level);
    // console.log(gamesArray[1].title);
    // console.log(gamesArray[0].numberOfLevels);
    // console.log(query.game === gamesArray[1].title);
    // console.log(query.level === gamesArray[0].numberOfLevels);
    if (query.game === gamesArray[0].title && query.level === gamesArray[0].numberOfLevels) {
      console.log('execute');
      //console.log(gamesArray[1].numberOfLevels);
      setQuery({...query, level: 2});
    }
    console.log('anyway');
    setQuery({...query, game: game});
    
  }

  return (
    <BackgroundLayout>
        <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
            <View  style={styles.header}>
              {/* =============== Back Button =============== */}
              <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?&playerId=${playerId}`}/>

              <Text style={styles.headerText}>Performance Reports</Text>
            </View>

            <Text style={styles.bodyText}>Select the following options to view results:</Text>

            {/* =============== Names Row =============== */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={styles.selectionBars}>
                {[...tempCharacterArray].map((user, index) => (
                    <View key={user.id}>
                        <Text key={user.id} style={[styles.bodyText, user.id === query.playerId && styles.selectedUnderline]} onPress={() => setQuery({...query, playerId: user.id})}>
                          {user.name}
                        </Text>
                    </View>
                ))}
            </LinearGradient>

            {/* =============== Game Row =============== */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={styles.selectionBars}>
                {[...gamesArray].map((game, index) => (
                    <View key={index}>
                        <Text style={[styles.bodyText, game.title === query.game && styles.selectedUnderline]} onPress={() => setGameSelected(game.title)}>
                          {game.title}
                        </Text>
                    </View>
                ))}
            </LinearGradient>

            {/* =============== Level Row =============== */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={styles.selectionBars}>
                {[...Array(gamesArray[query.game === gamesArray[0].title ? 0 : 1].numberOfLevels)].map((level, index) => (
                    <View key={index}>
                        <Text style={[styles.bodyText, index + 1 === query.level && styles.selectedUnderline]} onPress={() => setQuery({...query, level: index + 1})}>
                          Level {index + 1}
                        </Text>
                    </View>
                ))}
            </LinearGradient>

            <Text style={styles.bodyText}>Number of Games Completed:</Text>

            <Text style={[styles.bodyText, {paddingTop: 0}]}>Average Score:</Text>

            <Text style={[styles.bodyText, {paddingTop: 0}]}>Number of times each question was correct:</Text>

            <View style={styles.barsContainer}>
                {/* 1st half */}
                <View style={{flex: 1}}>
                    {(query.game === gamesArray[0].title ? alphabetArray : numbersArray).slice(0, middleIndex).map((item) => (
                        <View key={item.id} style={styles.arrayItem}>
                            <Text style={[styles.letterNumberStyle]}>{item.id}</Text>
                            <PerformanceBar fillPercent={30} />
                        </View>
                    ))}
                </View>

                {/* 2nd half */}
                <View style={{flex: 1}}>
                    {(query.game === gamesArray[0].title ? alphabetArray : numbersArray).slice(middleIndex).map((item) => (
                        <View key={item.id} style={styles.arrayItem}>
                            <Text style={[styles.letterNumberStyle]}>{item.id}</Text>
                            <PerformanceBar fillPercent={60} />
                        </View>
                    ))}
                </View>

            </View>

            <Text style={[styles.bodyText, {textDecorationLine: 'underline', textAlign: 'center', paddingTop: 0, paddingBottom: 20, fontSize: 16}]}>Click here for game & level descriptions if needed</Text>
        </View>
    </BackgroundLayout>
  );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
    //backgroundColor: 'red'
  },
  header: {
    flexDirection: 'row'
  },
  backBtnContainer: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    paddingVertical: 20
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
    color: '#3E1911',
    //backgroundColor: 'blue'
  },
  bodyText: {
    verticalAlign: 'middle',
    padding: 7,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3E1911',
    //backgroundColor: 'blue'
  },
  selectionBars: {
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(62, 25, 17, 0.3)',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    columnGap: '10%',
    //backgroundColor: 'blue'
  },
  arrayItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    flexGrow: 1, 
    flexShrink: 1
  },
  selectedUnderline: {
    borderBottomWidth: 7, 
    borderBottomColor: '#3E1911'
  },
  letterNumberStyle: {
    fontWeight: 'bold', 
    color: '#3E1911',
    fontSize: 20
  }
});