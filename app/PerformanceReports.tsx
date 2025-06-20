import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../reusableComponents/CustomButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import PerformanceBar from '../reusableComponents/PerformanceBar';
import { gamesArray, alphabetArray, numbersArray } from "../GameContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoadingMessage from '../reusableComponents/LoadingMessage';
import { formatNameWithCapitals } from "../CharacterOptions";
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

type ReportQuery = {
  playerId: number;
  game: string;
  level: number;
}

export default function PerformanceReports() {
    const [children, setChildren] = useState<any[]>([]);
    const { playerId, game = gamesArray[0].title, level = '2', playerLastSelected = playerId } = useLocalSearchParams();
    const [query, setQuery] = useState<ReportQuery>({
        playerId: parseInt(playerLastSelected.toString()),
        game: game.toString(),
        level: parseInt(level.toString()),
    });

 
    useEffect(() => {
        if (children.length > 0 && query.playerId === 0) {
            // Set default to first child once loaded
            setQuery(prev => ({ ...prev, playerId: children[0].id }));
        }
    }, [children]);
  const router = useRouter();
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;
  const middleIndex = Math.ceil(query.game === gamesArray[0].title ? alphabetArray.length / 2 : numbersArray.length / 2);
  const [completedGames, setCompletedGames] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [questionPerformance, setQuestionPerformance] = useState<Record<string, number>>({});
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  //----------------------------------------------------------
  //API is called when component loaded & everytime the query is updated
    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/report/${query.playerId}?gameType=${query.game}&level=${query.level}`);
                const data = await response.json();

                setCompletedGames(data.completedGames || 0);
                setAverageScore(data.averageScore || 0);
                setQuestionPerformance(data.questionPerformance || {});
            } catch (error) {
                console.error("Failed to fetch performance data:", error);
            }
        };

        fetchPerformanceData();
    }, [query]);

    useEffect(() => {
        const fetchParentId = async () => {
            const checkUser = async () => {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) {
                    router.push('/Login');
                }
            };
            checkUser();
            const userId = await AsyncStorage.getItem("userId");
            if (userId) {
                setParentId(userId);
                fetchChildren(userId);
            } else {
                router.replace("/error?message=Parent%20could%20not%20be%20found");
                setLoading(false);
            }
        };

        fetchParentId();
    }, []);

    const fetchChildren = async (parentId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/children/${parentId}`);
            const childrenData = response.data;

            if (!Array.isArray(childrenData) || childrenData.length === 0) {
                router.replace("/error?message=No%20characters%20found");
                setChildren([]);
                return;
            }

            const profiles = await Promise.all(
                childrenData.map(async (child: any) => {
                    try {
                        const res = await axios.get(`${API_BASE_URL}/users/profile/${child.profile_id}`);
                        return { ...res.data, id: child.profile_id };
                    } catch (error) {
                        console.error(`Error fetching profile for child ${child.profile_id}:`, error);
                        return null;
                    }
                })
            );

            const validProfiles = profiles.filter(profile => profile && profile.profile_image);

            if (validProfiles.length === 0) {
                router.replace("/error?message=No%20characters%20found");
                setChildren([]);
            } else {
                setChildren(validProfiles);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                router.replace("/error?message=No%20characters%20found");
                setChildren([]);
                return;
            }
            console.error("Error fetching children:", error);
            router.replace("/error?message=No%20characters%20found");
            setChildren([]);
        } finally {
            setLoading(false);
        }
    };


    //----------------------------------------------------------
  function setGameSelected(game: string) {
    //if level 3 is selected/underlined while the alphabet game is chosen and then you switch to the numbers game,
    //set the level to 2 since level 3 doesn't exist in the numbers game
    if (query.game === gamesArray[0].title && query.level === gamesArray[0].numberOfLevels) {
      setQuery({...query, level: 2, game: game});
      return;
    }
    
    setQuery({...query, game: game});
  }

  if (loading) return <LoadingMessage backgroundNeeded={true}/>;

  //----------------------------------------------------------
  return (
    <BackgroundLayout>
        <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
            {/* Back Button */}
            <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?playerId=${playerId}`}/>

            <Text style={styles.headerText}>Performance Reports</Text>

            <Text style={styles.bodyText}>Select the following options to view results:</Text>

            {/* =============== Names Row =============== */}
            {children.length < 5 ?
                <View style={[styles.selectionBars, {backgroundColor: 'rgba(252, 229, 206, 0.5)'}, windowWidth > 800 && {justifyContent: 'center'}] }>
                    {[...children].sort((a, b) => a.profile_name.localeCompare(b.profile_name)).map((user) => (
                        <View key={user.id}>
                            <Text
                                style={[styles.bodyText, user.id === query.playerId && styles.selectedUnderline]}
                                onPress={() => setQuery({ ...query, playerId: user.id })}
                            >
                                {formatNameWithCapitals(user.profile_name)}
                            </Text>
                        </View>
                    ))}
                </View>
                :
                <View style={[styles.selectionBarsDropdown, {backgroundColor: 'rgba(252, 229, 206, 0.5)'}, windowWidth > 800 && {justifyContent: 'center'}] }>
                    <RNPickerSelect
                        onValueChange={(value) => setQuery({ ...query, playerId: value })}
                        items={children.sort((a, b) => a.profile_name.localeCompare(b.profile_name)).map((user) => ({
                            label: formatNameWithCapitals(user.profile_name),
                            value: user.id,
                            color: '#3E1911',
                        }))}
                        value={query.playerId}
                        placeholder={{}}
                        style={pickerSelectStyles}
                    />
                </View>
            }

            {/* =============== Game Row =============== */}
            <View style={[styles.selectionBars, {backgroundColor: 'rgba(252, 229, 206, 0.5)'}, windowWidth > 800 && {justifyContent: 'center'}] }>
                {[...gamesArray].map((game, index) => (
                    <View key={index}>
                        <Text style={[styles.bodyText, game.title === query.game && styles.selectedUnderline]} 
                              onPress={() => setGameSelected(game.title)}>
                          {game.title}
                        </Text>
                    </View>
                ))}
            </View>

            {/* =============== Level Row =============== */}
            <View style={[styles.selectionBars, {backgroundColor: 'rgba(252, 229, 206, 0.5)'}, windowWidth > 800 && {justifyContent: 'center'}] }>
                {[...Array(gamesArray[query.game === gamesArray[0].title ? 0 : 1].numberOfLevels)].slice(1).map((level, index) => (
                    <View key={index}>
                        <Text style={[styles.bodyText, index + 2 === query.level && styles.selectedUnderline]} 
                              onPress={() => setQuery({...query, level: index + 2})}>
                          Level {index + 2}
                        </Text>
                    </View>
                ))}
            </View>

            <Text style={styles.bodyText}>Number of Games Completed: {completedGames}</Text>

            {completedGames > 0 && 
                <View style={{flex: 1}}>
                    <Text style={[styles.bodyText, { paddingTop: 0 }]}>Average Score: {averageScore.toFixed()}%</Text>


                    <Text style={[styles.bodyText, {paddingTop: 0}]}>How often each question was correct:</Text>

                    <View style={styles.barsContainer}>
                        {/* 1st half */}
                        <View style={{flex: 1}}>
                            {(query.game === gamesArray[0].title ? alphabetArray : numbersArray).slice(0, middleIndex).map((item) => (
                                <View key={item.id} style={styles.arrayItem}>
                                    <Text style={[styles.letterNumberStyle]}>{item.id}</Text>
                                    <PerformanceBar fillPercent={questionPerformance[item.id] || 0} />
                                </View>
                            ))}
                        </View>

                        {/* 2nd half */}
                        <View style={{flex: 1}}>
                            {(query.game === gamesArray[0].title ? alphabetArray : numbersArray).slice(middleIndex).map((item) => (
                                <View key={item.id} style={styles.arrayItem}>
                                    <Text style={[styles.letterNumberStyle]}>{item.id}</Text>
                                    <PerformanceBar fillPercent={questionPerformance[item.id] || 0} />
                                </View>
                            ))}
                        </View>

                    </View>
                </View>
            }

            <Text style={[styles.bodyText, styles.gameInstructionLink]}
                  onPress={() => router.push(`/GameDescriptions?playerId=${playerId}&game=${query.game}&level=${query.level}&playerLastSelected=${query.playerId}`)}>
              Click here for game & level descriptions if needed
            </Text>
        </View>
    </BackgroundLayout>
  );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
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
    marginTop: 8,
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
    textAlign: 'center'
  },
  selectionBars: {
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(62, 25, 17, 0.3)',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectionBarsDropdown: {
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(62, 25, 17, 0.3)',
  },
  barsContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    columnGap: '10%',
    maxWidth: 500,
    maxHeight: 900,
    marginHorizontal: 'auto'
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
    fontSize: 15
  },
  gameInstructionLink: {
    marginTop: 'auto',
    textDecorationLine: 'underline', 
    textAlign: 'center', 
    paddingTop: 0, 
    paddingBottom: 20, 
    fontSize: 16
  }
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 18,
        borderColor: '#3E1911',
        color: '#3E1911',
    },
    inputAndroid: {
        fontSize: 18,
        borderColor: '#3E1911',
        color: '#3E1911',
    },
    viewContainer: {
        height: 50,
        width: '100%' as const,
        maxWidth: 500,
        marginHorizontal: 'auto' as const,
        justifyContent: 'center' as const,
        
    }
};