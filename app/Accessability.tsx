import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AccessibilityScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>
      <Text style={styles.headerText}>Accessibility</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Colour Blind Mode</Text>
        <View style={styles.optionRow}>
          <View style={styles.radioGroup}>
            <Text style={styles.optionText}>ON</Text>
            <View style={styles.radioSelected} />
          </View>
          <View style={styles.radioGroup}>
            <Text style={styles.optionText}>OFF</Text>
            <View style={styles.radio} />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Text Narration</Text>
        <View style={styles.optionRow}>
          <View style={styles.radioGroup}>
            <Text style={styles.optionText}>ON</Text>
            <View style={styles.radio} />
          </View>
          <View style={styles.radioGroup}>
            <Text style={styles.optionText}>OFF</Text>
            <View style={styles.radioSelected} />
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Save</Text></Pressable>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Edit</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E1C8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E1911',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E1911',
    marginRight: 10,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#3E1911',
    borderRadius: 12,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#3E1911',
    borderRadius: 12,
    backgroundColor: '#3E1911',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  button: {
    padding: 12,
    backgroundColor: '#C3E2E5',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3E1911',
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
