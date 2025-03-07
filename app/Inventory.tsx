import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';

export default function InventoryScreen() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = React.useState('Shiloh');
  const users = ['Shiloh', 'Jessica', 'Mina'];
  const starIcon = require('../assets/GameOverStar.png');

  return (
    <BackgroundLayout>
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerText}>Inventory</Text>
          <Text style={styles.subHeaderText}>Select an account to see inventory</Text>
          
          <View style={styles.tabContainer}>
            {users.map((user) => (
              <Pressable
                key={user}
                style={[styles.tab, selectedUser === user && styles.activeTab]}
                onPress={() => setSelectedUser(user)}
              >
                <Text style={styles.tabText}>{user}</Text>
              </Pressable>
            ))}
          </View>
          
          <View style={styles.inventoryContainer}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Letters</Text>
              <Text style={styles.level}>Level 1</Text>
              <View style={styles.itemRow}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.itemText}>x 3</Text>
              </View>
              <Text style={styles.level}>Level 2</Text>
              <View style={styles.itemRow}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.itemText}>x 0</Text>
              </View>
              <Text style={styles.level}>Level 3</Text>
              <View style={styles.itemRow}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.itemText}>x 0</Text>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Numbers</Text>
              <Text style={styles.level}>Level 1</Text>
              <View style={styles.itemRow}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.itemText}>x 2</Text>
              </View>
              <Text style={styles.level}>Level 2</Text>
              <View style={styles.itemRow}>
                <Image source={starIcon} style={styles.starIcon} />
                <Text style={styles.itemText}>x 1</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: 5,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#3E1911',
    marginBottom: 15,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#3E1911',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3E1911',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E1911',
  },
  inventoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  column: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: 10,
  },
  level: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E1911',
    marginTop: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#3E1911',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#C3E2E5',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3E1911',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E1911',
  },
});
