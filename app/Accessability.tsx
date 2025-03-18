import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../reusableComponents/CustomButton';

const { width, height } = Dimensions.get('window');

export default function AccessibilityScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <CustomButton
    image={require("../assets/back.png")}
    uniqueButtonStyling={styles.backBtnContainer}
    onPressRoute="/LevelChoice" 
/>

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
        <CustomButton
          text="Save"
          uniqueButtonStyling={styles.button}
        />
        <CustomButton
          text="Edit"
          uniqueButtonStyling={styles.button}
        />
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5E1C8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  headerText: {
    fontSize: width * 0.07,
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
    fontSize: width * 0.05,
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
    fontSize: width * 0.045,
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
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  button: {
    width: width * 0.35,
    height: height * 0.07,
    backgroundColor: '#C3E2E5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3E1911',
  },
  backBtnContainer: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.02,
    paddingVertical: height * 0.02,
  }
});