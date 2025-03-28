import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../reusableComponents/CustomButton';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export default function InventoryScreen() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [childAccounts, setChildAccounts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [levelCounts, setLevelCounts] = React.useState<{ [key: string]: number }>({});

  const starIcon1 = require('../assets/GameOverStar-Silver.png');
  const starIcon2 = require('../assets/GameOverStar.png');
  const starIcon3 = require('../assets/GameOverStar-Purple.png');
  const categories = ['Letters', 'Numbers'];
  const levels = [1, 2, 3];

  // ---------------- GET LEVEL COUNTS ----------------
  const fetchLevelCounts = async (childId: string) => {
    try {
      const newCounts: { [key: string]: number } = {};
      for (const category of categories) {
        for (const level of levels) {
          const key = `${childId}_${category}_level${level}_count`;
          let count = await AsyncStorage.getItem(key);

          if (!count) {
            const legacyKey = `${category}_level${level}_count`;
            const legacyCount = await AsyncStorage.getItem(legacyKey);
            if (legacyCount) {
              await AsyncStorage.setItem(key, legacyCount);
              await AsyncStorage.removeItem(legacyKey);
              count = legacyCount;
            }
          }

          newCounts[key] = count ? parseInt(count) : 0;
        }
      }
      setLevelCounts(newCounts);
    } catch (error) {
      console.error('Error retrieving level counts:', error);
    }
  };

  // ---------------- FETCH CHILDREN ----------------
  const fetchChildren = React.useCallback(async (parentId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/children/${parentId}`
      );
      const childrenData = response.data;

      if (Array.isArray(childrenData) && childrenData.length === 0) {
        setErrorMessage('No characters found. Please create a new character.');
        setChildAccounts([]);
        return;
      }

      const profiles: any[] = await Promise.all(
        childrenData.map(async (child: any) => {
          try {
            const res = await axios.get(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/profile/${child.profile_id}`
            );
            return { ...res.data, id: child.id };
          } catch (error) {
            console.error(`Error fetching profile for child ${child.profile_id}:`, error);
            return null;
          }
        })
      );

      const validProfiles = profiles.filter(profile => profile && profile.profile_image);
      setChildAccounts(validProfiles.length ? validProfiles : []);
    } catch (error) {
      console.error('Error fetching children:', error);
      setErrorMessage('Failed to load characters.');
      setChildAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------- INIT FETCH ----------------
  React.useEffect(() => {
    const fetchParentId = async () => {
      const userId: string | null = await AsyncStorage.getItem('userId');
      if (userId) {
        fetchChildren(userId);
      } else {
        setErrorMessage('Error: Parent ID not found.');
      }
    };
    fetchParentId();
  }, []);

  // ---------------- USER SELECTION ----------------
  const handleSelectUser = (userId: string) => {
    const user = childAccounts.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      fetchLevelCounts(user.id);
    }
  };

  return (
    <BackgroundLayout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerWrapper}>
          {/* Back button */}
          <CustomButton
            image={require('../assets/back.png')}
            uniqueButtonStyling={styles.backBtnContainer}
            functionToExecute={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />

          {/* Header */}
          <Text style={styles.headerText}>Reward Inventory</Text>
          <Text style={styles.subHeaderText}>Select an account to see inventory</Text>

          {/* Dropdown */}
          <View style={styles.dropdownWrapper}>
          <Picker
  selectedValue={selectedUser?.id || ''}
  onValueChange={(itemValue) => handleSelectUser(itemValue)}
  style={[
    styles.picker,
    Platform.OS === 'android' && { height: 45, fontSize: 14, marginBottom: 0 },
  ]}
  itemStyle={{
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.3) : 14,
    textAlign: 'center',
  }}
>
              <Picker.Item label="-- Select Account --" value="" />
              {childAccounts.map((user) => (
                <Picker.Item key={user.id} label={user.profile_name} value={user.id} />
              ))}
            </Picker>
          </View>

          {/* Inventory breakdown */}
          {selectedUser && (
            <View style={styles.inventoryContainer}>
              {categories.map((category) => (
                <View key={category} style={styles.column}>
                  <Text style={styles.sectionTitle}>{category}</Text>
                  {levels.filter(level => !(category === "Numbers" && level === 3)).map((level) => (
                    <View key={`${category}_level${level}`}>
                      <Text style={styles.level}>Level {level}</Text>
                      <View style={styles.itemRow}>
                        {level === 1 && <Image source={starIcon1} style={styles.starIcon} />}
                        {level === 2 && <Image source={starIcon2} style={styles.starIcon} />}
                        {level === 3 && <Image source={starIcon3} style={styles.starIcon} />}
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
      </ScrollView>
    </BackgroundLayout>
  );
}

// ================================== STYLES ==================================
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: height * 0.05,
  },
  innerWrapper: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.08,
  },
  headerText: {
    fontSize: RFPercentage(3.5),
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: height * 0.05,
    marginTop: height * 0.05,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: RFPercentage(2.5),
    color: '#3E1911',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  dropdownWrapper: {
    width: '90%',
    maxWidth: 280,
    alignSelf: 'center',
    borderColor: '#3E1911',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: height * 0.03,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#3E1911',
    fontSize: RFPercentage(2.3),
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inventoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: height * 0.03,
  },
  column: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: RFPercentage(2.8),
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: height * 0.015,
  },
  level: {
    fontSize: RFPercentage(2.4),
    fontWeight: 'bold',
    color: '#3E1911',
    marginTop: height * 0.015,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.008,
  },
  starIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  itemText: {
    fontSize: RFPercentage(2.2),
    color: '#3E1911',
  },
  backBtnContainer: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.02,
    paddingVertical: height * 0.02,
  },
});
