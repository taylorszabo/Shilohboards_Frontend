import * as React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';

// import HotdogImage from '../assets/Hotdog.png';

const screenWidth = Dimensions.get('window').width; // Get device width

type Props = {
    bgColor?: string;
    imagePath?: string;
    clickFunction?: any; //change to a type later***
    hasImage: boolean;
    lowerText: string;
    upperText?: string;
    customWidth: number;
    disabled: boolean;
    height?: number;
};

// onPress={onPress}
export default function OptionCard(props: Props) {
    const { bgColor = '#FFF8F0', imagePath, hasImage, lowerText, upperText = 'Option', customWidth, disabled, height = 100 } = props;

    return (
        <Pressable disabled={disabled} style={[styles.card, { backgroundColor: bgColor, width: screenWidth * customWidth, height: height }]} onPress={() => alert('Card Pressed')}>
            {hasImage ?
                <Image
                    source={lowerText === 'Alphabet' ? require('../assets/A.png') : require('../assets/1.png')}
                    style={styles.image}
                />
                :
                <Text style={styles.highText}>{upperText}</Text>
            }
            
            <Text style={styles.lowText}>{lowerText}</Text>
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,

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
      lowText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
      },
      highText: {
        marginTop: 10,
        fontSize: 24,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
      }
  });