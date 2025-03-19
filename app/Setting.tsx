import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
const { width, height } = Dimensions.get("window"); 

const settingsOptions = [
  { text: 'Account', route: '/Account' },
  { text: 'Sound & Volume', route: '/Sound&Volume' },
  { text: 'Accessibility', route: '/Accessability' },
  { text: 'Privacy', route: '/Privacy' },

];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>
      <View style={styles.optionsContainer}>
        {settingsOptions.map((option, index) => (
          
          <Pressable 
            key={index} 
            style={[styles.optionRow, { paddingVertical: height * 0.02 }]} 
            onPress={() => router.push(option.route)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable 
        style={[styles.backButton, { padding: height * 0.015, borderRadius: width * 0.02 }]} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3E2E5',
    alignItems: 'center',
    padding: width * 0.05, 
    borderRadius: width * 0.02, 
  },
  headerText: {
    fontSize: width * 0.08, 
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: height * 0.03, 
  },
  optionsContainer: {
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: '#3E1911',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#3E1911',
    width: '100%',
    paddingHorizontal: width * 0.05, 
  },
  optionText: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    color: '#3E1911',
  },
  backButton: {
    marginTop: height * 0.03, 
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#3E1911',
  },
  backButtonText: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    color: '#3E1911',
  },
});

