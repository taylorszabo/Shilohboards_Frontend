import * as React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
//import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width; // Get device width

type Props = {
    bgColor: string;
    imagePath: string;
    name: string;
    customWidth: number;
    disabled: boolean;
};

// onPress={onPress}
export default function CharacterCard(props: Props) {
    const { bgColor, imagePath, name, customWidth, disabled } = props;
    //const navigation = useNavigation();

    return (
        <Pressable disabled={disabled} style={[styles.card, { backgroundColor: bgColor, width: screenWidth * customWidth, height: screenWidth * customWidth }]} 
        onPress={() => alert('Card Pressed')}>
            <Image
                source={require('../assets/Hotdog.png')} // Replace with your image URI
                style={styles.image}
            />
            <Text style={styles.text}>{name}</Text>
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        // width: screenWidth * 0.4,  //40% of screen width
        // height: screenWidth * 0.4, //make a square
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: 'rgba(0, 0, 0, 0.25)', //iOS shadow
        shadowOffset: {
            width: 1,
            height: 4
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,

        elevation: 5, //android shadow
      },
      image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain' //keep aspect ratio
      },
      text: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
      },
  });