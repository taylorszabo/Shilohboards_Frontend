import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const settingsOptions = [
  { text: 'Account', route: '/Account'},
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
          <Pressable key={index} style={styles.optionRow} onPress={() => router.push(option.route)}>
            <Text style={styles.optionText}>{option.text}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
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
    padding: 20,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: '#3E1911',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3E1911',
    width: '100%',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E1911',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFF8F0',
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
