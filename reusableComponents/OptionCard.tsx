import * as React from 'react';
import { Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width; //get device width

type Props = {
    customWidth: number;
    //optional
    height?: number;
    bgColor?: string;
    image?: any;
    upperText?: string;
    lowerText?: string;
    disabled?: boolean;
    onPressRoute?: string;
    textSize?: number;
    functionToExecute?: Function;
    selected?: boolean;
    boldFirstLetter?: boolean;
    testID?: string;
};

export default function OptionCard(props: Props) {
    const { bgColor = '#FFF8F0', 
            image, 
            lowerText, 
            upperText = 'Option', 
            customWidth, 
            disabled = false, 
            height = 100, 
            onPressRoute, 
            textSize = 24,
            functionToExecute,
            selected,
            boldFirstLetter = false,
            testID
    } = props;

    const router = useRouter();

    let firstLetter;
    let restOfText;

    if (lowerText) {
        firstLetter = lowerText.charAt(0);
        restOfText = lowerText.slice(1);
    }

    //------------------- FUNCTION ------------------
    function handlePressEvent() {   
        if (functionToExecute) {
            functionToExecute();
        }

        if (onPressRoute) {
            router.push(onPressRoute)
        }
    } 

    //-----------------------------------------------
    return (
        <Pressable disabled={disabled} testID={testID}
        style={[styles.card, selected && {borderWidth: 5, borderRightWidth: 5, borderBottomWidth: 5, borderColor: '#0098A6'}, 
            { 
                backgroundColor: bgColor, 
                width: screenWidth * customWidth, 
                height: height, 
                ...(image && { padding: 20 }) 
            }
        ]} 
        onPress={() => handlePressEvent()}>
            {image ?
                <Image source={image} style={styles.image} />
                :
                <Text style={[styles.highText, {fontSize: textSize}]}>{upperText}</Text>
            }
            
            {lowerText &&
                <Text style={styles.lowText}>
                    {boldFirstLetter ? (
                        <Text style={styles.boldUnderline}>{firstLetter}</Text>
                    ) : (
                        firstLetter
                    )}
                    {restOfText}
                </Text>
            }
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderColor: '#A9A9A9',
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain' //keep aspect ratio
    },
    lowText: {
        marginTop: 10,
        fontSize: 18,
        textAlign: 'center',
        color: '#3E1911',
    },
    boldUnderline: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    highText: {
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    }
});