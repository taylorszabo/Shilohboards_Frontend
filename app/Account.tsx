import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>
      <Text style={styles.headerText}>Account</Text>
      
      <Text style={styles.label}>Name</Text>
      <View style={styles.input}><Text style={styles.inputText}>First_Last</Text></View>
      
      <Text style={styles.label}>Email</Text>
      <View style={styles.input}><Text style={styles.inputText}>Example@abc.com</Text></View>
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.input}><Text style={styles.inputText}>********</Text></View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.button}><Text style={styles.buttonText}>Save</Text></View>
        <View style={styles.button}><Text style={styles.buttonText}>Edit</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E1C8',
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E1911',
    marginTop: 10,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#3E1911',
    borderRadius: 5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  inputText: {
    fontSize: 18,
    color: '#3E1911',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  button: {
    padding: 10,
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
