import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../reusableComponents/CustomButton';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState('First_Last');
  const [email, setEmail] = React.useState('Example@abc.com');
  const [password, setPassword] = React.useState('********');

  // Handle Save button
  const handleSave = () => {
    // Logic to save the changes
    console.log("Saved:", { name, email, password });
    setIsEditing(false); // Disable editing after save
  };

  // Handle Edit button
  const handleEdit = () => {
    setIsEditing(true); // Enable editing
  };

  // Handle Back button
  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomButton
        image={require("../assets/back.png")}
        uniqueButtonStyling={styles.backBtnContainer}
        onPressRoute="/LevelChoice" 
      />

      <Text style={styles.headerText}>Account</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={name}
            onChangeText={setName}
            editable={isEditing} // Enable/Disable editing
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={email}
            onChangeText={setEmail}
            editable={isEditing} // Enable/Disable editing
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={password}
            onChangeText={setPassword}
            editable={isEditing} // Enable/Disable editing
            secureTextEntry // Mask the password
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <CustomButton
            text="Save"
            uniqueButtonStyling={styles.button}

          />
        ) : (
          <CustomButton
            text="Edit"
            uniqueButtonStyling={styles.button}

          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5E1C8',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: 40,
  },
  headerText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#3E1911',
    marginVertical: 20,
  },
  fieldContainer: {
    width: '100%',
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#3E1911',
    marginTop: 15,
  },
  input: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#3E1911',
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginVertical: 5,
  },
  inputText: {
    fontSize: width * 0.045,
    color: '#3E1911',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    width: '100%',
  },
  button: {
    width: width * 0.35,
    height: height * 0.07,
    backgroundColor: '#C3E2E5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnContainer: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.02,
    paddingVertical: height * 0.02,
  }
});
