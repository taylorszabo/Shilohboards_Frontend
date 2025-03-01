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
            selected
    } = props;

    const router = useRouter();

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
        <Pressable disabled={disabled} 
        style={[styles.card, selected && {borderWidth: 5, borderColor: '#0098A6'}, 
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
                <Text style={styles.lowText}>{lowerText}</Text>
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
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    }
});